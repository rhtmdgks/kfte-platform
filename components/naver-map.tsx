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

const NAVER_SDK_URL = "https://oapi.map.naver.com/openapi/v3/maps.js"

function loadNaverMaps(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Naver Maps is only available in the browser"))
      return
    }

    const init = () => {
      if (!window.naver?.maps?.Service) {
        reject(new Error("Naver Maps SDK is unavailable"))
        return
      }
      resolve()
    }

    if (window.naver?.maps?.Service) {
      init()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-naver-maps-sdk="true"]',
    )

    if (existing) {
      if (window.naver?.maps?.Service) {
        init()
        return
      }
      existing.addEventListener("load", init, { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error("Naver Maps SDK load failed")),
        { once: true },
      )
      return
    }

    const script = document.createElement("script")
    script.src = `${NAVER_SDK_URL}?ncpKeyId=${clientId}&submodules=geocoder`
    script.async = true
    script.dataset.naverMapsSdk = "true"
    script.onload = init
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
  const map = new naver.maps.Map(container, { center, zoom })
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

function searchAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    naver.maps.Service.geocode({ address }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK) {
        resolve(null)
        return
      }

      const item = response.result.items?.[0]
      if (!item?.point) {
        resolve(null)
        return
      }

      resolve({
        lat: item.point.y,
        lng: item.point.x,
      })
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
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID

  useEffect(() => {
    if (!clientId) {
      setStatus("error")
      setErrorDetail("네이버 지도 API 키가 설정되지 않았습니다.")
      return
    }

    let cancelled = false

    const initMap = async () => {
      try {
        await loadNaverMaps(clientId)
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

        renderMap(containerRef.current, coords.lat, coords.lng, zoom, markerTitle)
        setStatus("ready")
      } catch {
        if (!cancelled) {
          setErrorDetail(
            "네이버 지도 SDK를 불러오지 못했습니다. Naver Cloud Platform에서 Client ID와 Web 서비스 URL(localhost:3000 등) 등록을 확인해 주세요.",
          )
          setStatus("error")
        }
      }
    }

    void initMap()

    return () => {
      cancelled = true
    }
  }, [
    address,
    clientId,
    fallbackLat,
    fallbackLng,
    latitude,
    longitude,
    markerTitle,
    zoom,
  ])

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
