"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type NaverMapProps = {
  address: string
  markerTitle?: string
  zoom?: number
  fallbackLat?: number
  fallbackLng?: number
  latitude?: number
  longitude?: number
  className?: string
}

/** @see https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html */
const NAVER_SDK_URL = "https://oapi.map.naver.com/openapi/v3/maps.js"

function getNaverMapKeyId() {
  return (
    process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID?.trim() ||
    process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim() ||
    ""
  )
}

function loadNaverMaps(ncpKeyId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Naver Maps is only available in the browser"))
      return
    }

    const ready = () => Boolean(window.naver?.maps?.Map && window.naver?.maps?.Service)

    if (ready()) {
      resolve()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-naver-maps-sdk="true"]',
    )

    const onLoad = () => {
      if (ready()) {
        resolve()
        return
      }
      reject(new Error("Naver Maps SDK is unavailable"))
    }

    if (existing) {
      if (ready()) {
        resolve()
        return
      }
      existing.addEventListener("load", onLoad, { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error("Naver Maps SDK load failed")),
        { once: true },
      )
      return
    }

    // 인증 실패 시 Maps SDK가 호출하는 전역 훅
    window.navermap_authFailure = () => {
      reject(new Error("Naver Maps authentication failed"))
    }

    const script = document.createElement("script")
    // 신규 통합 키: ncpKeyId (구 ncpClientId 대체)
    script.src = `${NAVER_SDK_URL}?ncpKeyId=${encodeURIComponent(ncpKeyId)}&submodules=geocoder`
    script.async = true
    script.dataset.naverMapsSdk = "true"
    script.onload = onLoad
    script.onerror = () => reject(new Error("Naver Maps SDK load failed"))
    document.head.appendChild(script)
  })
}

function renderMap(
  container: HTMLDivElement,
  lat: number,
  lng: number,
  zoom: number,
  markerTitle?: string,
) {
  const center = new naver.maps.LatLng(lat, lng)
  const map = new naver.maps.Map(container, {
    center,
    zoom,
  })

  // 컨테이너 크기가 늦게 잡히는 경우 보정
  const { clientWidth, clientHeight } = container
  if (clientWidth > 0 && clientHeight > 0) {
    map.setSize(new naver.maps.Size(clientWidth, clientHeight))
  }

  const marker = new naver.maps.Marker({
    map,
    position: center,
    title: markerTitle,
  })

  if (markerTitle) {
    const infoWindow = new naver.maps.InfoWindow({
      content: `<div style="padding:10px 12px;font-size:13px;line-height:1.5;max-width:220px;">${markerTitle}</div>`,
    })
    infoWindow.open(map, marker)
  }

  return map
}

function searchAddress(query: string): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    naver.maps.Service.geocode({ query }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK) {
        resolve(null)
        return
      }

      // 신규 geocoder 응답: response.v2.addresses[].x/y
      const modern = response.v2?.addresses?.[0]
      if (modern?.x && modern?.y) {
        resolve({
          lat: Number(modern.y),
          lng: Number(modern.x),
        })
        return
      }

      // 구형 응답 호환
      const legacy = response.result?.items?.[0]?.point
      if (legacy) {
        resolve({ lat: legacy.y, lng: legacy.x })
        return
      }

      resolve(null)
    })
  })
}

export function NaverMap({
  address,
  markerTitle,
  zoom = 16,
  fallbackLat,
  fallbackLng,
  latitude,
  longitude,
  className,
}: NaverMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<naver.maps.Map | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const ncpKeyId = getNaverMapKeyId()

  useEffect(() => {
    if (!ncpKeyId) {
      setStatus("error")
      setErrorDetail(
        "네이버 지도 API 키가 없습니다. .env.local에 NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID를 설정한 뒤 개발 서버를 재시작해 주세요.",
      )
      return
    }

    let cancelled = false

    const initMap = async () => {
      try {
        await loadNaverMaps(ncpKeyId)
        if (cancelled || !containerRef.current) return

        let coords: { lat: number; lng: number } | null = null

        if (latitude != null && longitude != null) {
          coords = { lat: latitude, lng: longitude }
        } else {
          const trimmed = address.trim()
          const addressCandidates = trimmed
            ? [trimmed, `${trimmed} ${markerTitle ?? ""}`.trim()]
            : []

          for (const candidate of addressCandidates) {
            coords = await searchAddress(candidate)
            if (coords) break
          }
        }

        if (!coords && fallbackLat != null && fallbackLng != null) {
          coords = { lat: fallbackLat, lng: fallbackLng }
        }

        if (cancelled || !containerRef.current) return

        if (!coords) {
          setErrorDetail("주소를 찾지 못했습니다.")
          setStatus("error")
          return
        }

        mapRef.current = renderMap(
          containerRef.current,
          coords.lat,
          coords.lng,
          zoom,
          markerTitle,
        )
        setStatus("ready")
      } catch (error) {
        if (!cancelled) {
          const authFailed =
            error instanceof Error && /authentication failed/i.test(error.message)
          setErrorDetail(
            authFailed
              ? "네이버 지도 인증에 실패했습니다. ncpKeyId와 Web 서비스 URL(localhost:3000, kfte.kr 등) 등록을 확인해 주세요."
              : "네이버 지도 SDK를 불러오지 못했습니다. Naver Cloud Platform Maps의 ncpKeyId와 Web 서비스 URL 등록을 확인해 주세요.",
          )
          setStatus("error")
        }
      }
    }

    void initMap()

    return () => {
      cancelled = true
      mapRef.current = null
    }
  }, [
    address,
    ncpKeyId,
    fallbackLat,
    fallbackLng,
    latitude,
    longitude,
    markerTitle,
    zoom,
  ])

  useEffect(() => {
    if (status !== "ready" || !containerRef.current || !mapRef.current) return

    const container = containerRef.current
    const map = mapRef.current

    const resize = () => {
      const { clientWidth, clientHeight } = container
      if (clientWidth > 0 && clientHeight > 0) {
        map.setSize(new naver.maps.Size(clientWidth, clientHeight))
      }
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [status])

  return (
    <div
      className={cn(
        "relative h-[360px] w-full overflow-hidden rounded-lg bg-muted md:h-[440px]",
        className,
      )}
      aria-label={markerTitle ? `${markerTitle} 위치 지도` : "위치 지도"}
    >
      <div ref={containerRef} className="h-full w-full" />

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
          지도를 불러오는 중입니다.
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted px-6 text-center text-sm leading-relaxed text-muted-foreground">
          {errorDetail ?? "지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
        </div>
      )}
    </div>
  )
}
