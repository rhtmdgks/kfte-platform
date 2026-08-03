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

let sdkLoadPromise: Promise<void> | null = null

function getNaverMapKeyId() {
  return (
    process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID?.trim() ||
    process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim() ||
    ""
  )
}

function hasNaverMapsCore() {
  return Boolean(window.naver?.maps?.Map && window.naver?.maps?.LatLng)
}

function hasNaverGeocoder() {
  return Boolean(window.naver?.maps?.Service?.geocode)
}

function waitFor(
  predicate: () => boolean,
  timeoutMs = 4000,
  intervalMs = 50,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (predicate()) {
      resolve()
      return
    }

    const started = Date.now()
    const timer = window.setInterval(() => {
      if (predicate()) {
        window.clearInterval(timer)
        resolve()
        return
      }
      if (Date.now() - started >= timeoutMs) {
        window.clearInterval(timer)
        reject(new Error("Naver Maps SDK initialization timed out"))
      }
    }, intervalMs)
  })
}

function loadNaverMaps(ncpKeyId: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Naver Maps is only available in the browser"))
  }

  if (hasNaverMapsCore() && hasNaverGeocoder()) {
    return Promise.resolve()
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    let settled = false
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      if (error) {
        sdkLoadPromise = null
        reject(error)
        return
      }
      resolve()
    }

    const previousAuthFailure = window.navermap_authFailure
    window.navermap_authFailure = () => {
      previousAuthFailure?.()
      finish(new Error("Naver Maps authentication failed"))
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-naver-maps-sdk="true"]',
    )

    const afterScriptReady = () => {
      waitFor(() => hasNaverMapsCore() && hasNaverGeocoder())
        .then(() => finish())
        .catch((error) =>
          finish(error instanceof Error ? error : new Error("Naver Maps SDK is unavailable")),
        )
    }

    if (existing) {
      if (existing.dataset.naverMapsReady === "1" || (hasNaverMapsCore() && hasNaverGeocoder())) {
        afterScriptReady()
        return
      }
      existing.addEventListener("load", afterScriptReady, { once: true })
      existing.addEventListener(
        "error",
        () => finish(new Error("Naver Maps SDK load failed")),
        { once: true },
      )
      // load가 이미 끝난 스크립트면 load 이벤트가 다시 안 오므로 폴링으로 복구
      void waitFor(() => hasNaverMapsCore() && hasNaverGeocoder(), 1500)
        .then(() => finish())
        .catch(() => {
          /* load 리스너가 처리하거나 최종 타임아웃 */
        })
      return
    }

    const script = document.createElement("script")
    script.src = `${NAVER_SDK_URL}?ncpKeyId=${encodeURIComponent(ncpKeyId)}&submodules=geocoder`
    script.async = true
    script.dataset.naverMapsSdk = "true"
    script.onload = () => {
      script.dataset.naverMapsReady = "1"
      afterScriptReady()
    }
    script.onerror = () => finish(new Error("Naver Maps SDK load failed"))
    document.head.appendChild(script)
  })

  return sdkLoadPromise
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
    if (!hasNaverGeocoder()) {
      resolve(null)
      return
    }

    naver.maps.Service.geocode({ query }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK) {
        resolve(null)
        return
      }

      const modern = response.v2?.addresses?.[0]
      if (modern?.x && modern?.y) {
        const lat = Number(modern.y)
        const lng = Number(modern.x)
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          resolve({ lat, lng })
          return
        }
      }

      const legacy = response.result?.items?.[0]?.point
      if (legacy && Number.isFinite(legacy.y) && Number.isFinite(legacy.x)) {
        resolve({ lat: legacy.y, lng: legacy.x })
        return
      }

      resolve(null)
    })
  })
}

/** Geocoding은 세부 호실·행사명에 약함 → 점점 단순한 후보로 재시도 */
function buildGeocodeCandidates(address: string): string[] {
  const trimmed = address.trim()
  if (!trimmed) return []

  const noParen = trimmed.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim()
  const noRoom = noParen
    .replace(/\d+\s*[·,~～~\-]\s*\d+\s*호/g, " ")
    .replace(/\d+\s*호/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const head = (noRoom.split(/[·|,/]/)[0] ?? noRoom).trim()
  const venue = head
    .replace(/\s*(제?\d*전시장|중회의실|대회의실|컨퍼런스홀|회의실|홀)\b.*$/u, "")
    .replace(/\s+/g, " ")
    .trim()

  return Array.from(
    new Set([trimmed, noParen, noRoom, head, venue].filter((s) => s.length >= 2)),
  )
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
        "네이버 지도 API 키가 없습니다. Vercel 환경 변수 NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID를 설정한 뒤 재배포해 주세요.",
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
          // ponytail: markerTitle(행사명)은 geocode에 넣지 않음 — 검색만 방해함
          for (const candidate of buildGeocodeCandidates(address)) {
            coords = await searchAddress(candidate)
            if (coords) break
          }
        }

        if (!coords && fallbackLat != null && fallbackLng != null) {
          coords = { lat: fallbackLat, lng: fallbackLng }
        }

        if (cancelled || !containerRef.current) return

        if (!coords) {
          setErrorDetail("주소를 찾지 못했습니다. 장소명을 단순화하거나 좌표를 확인해 주세요.")
          setStatus("error")
          return
        }

        // 컨테이너가 아직 0 크기면 한 프레임 뒤 다시 그림
        if (containerRef.current.clientWidth === 0 || containerRef.current.clientHeight === 0) {
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => resolve())
          })
        }
        if (cancelled || !containerRef.current) return

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
          const message = error instanceof Error ? error.message : ""
          if (/authentication failed/i.test(message)) {
            setErrorDetail(
              "네이버 지도 인증에 실패했습니다. ncpKeyId와 Web 서비스 URL(배포 도메인) 등록을 확인해 주세요.",
            )
          } else if (/timed out|unavailable/i.test(message)) {
            setErrorDetail(
              "네이버 지도 초기화에 실패했습니다. Dynamic Map·Geocoding API가 애플리케이션에 선택돼 있는지 확인해 주세요.",
            )
          } else {
            setErrorDetail(
              "네이버 지도 SDK를 불러오지 못했습니다. ncpKeyId와 Web 서비스 URL 등록을 확인해 주세요.",
            )
          }
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
