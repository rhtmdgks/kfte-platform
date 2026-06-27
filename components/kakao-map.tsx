"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type KakaoMapProps = {
  address: string
  markerTitle: string
  level?: number
  fallbackLat?: number
  fallbackLng?: number
  className?: string
}

const KAKAO_SDK_URL = "https://dapi.kakao.com/v2/maps/sdk.js"

function loadKakaoMaps(appKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Kakao Maps is only available in the browser"))
      return
    }

    const init = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK is unavailable"))
        return
      }
      window.kakao.maps.load(() => resolve())
    }

    if (window.kakao?.maps) {
      init()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps-sdk="true"]',
    )

    if (existing) {
      if (window.kakao?.maps) {
        init()
        return
      }
      existing.addEventListener("load", init, { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error("Kakao Maps SDK load failed")),
        { once: true },
      )
      return
    }

    const script = document.createElement("script")
    script.src = `${KAKAO_SDK_URL}?appkey=${appKey}&autoload=false&libraries=services`
    script.async = true
    script.dataset.kakaoMapsSdk = "true"
    script.onload = init
    script.onerror = () => reject(new Error("Kakao Maps SDK load failed"))
    document.head.appendChild(script)
  })
}

function renderMap(
  container: HTMLDivElement,
  lat: number,
  lng: number,
  level: number,
) {
  const coords = new window.kakao.maps.LatLng(lat, lng)
  const map = new window.kakao.maps.Map(container, {
    center: coords,
    level,
  })

  new window.kakao.maps.Marker({
    map,
    position: coords,
  })

  window.requestAnimationFrame(() => {
    map.relayout()
    map.setCenter(coords)
  })

  return map
}

function searchAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    const geocoder = new window.kakao.maps.services.Geocoder()
    geocoder.addressSearch(address, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || result.length === 0) {
        resolve(null)
        return
      }
      resolve({
        lat: Number(result[0].y),
        lng: Number(result[0].x),
      })
    })
  })
}

export function KakaoMap({
  address,
  markerTitle,
  level = 3,
  fallbackLat,
  fallbackLng,
  className,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY

  useEffect(() => {
    if (!appKey) {
      setStatus("error")
      setErrorDetail("API 키가 설정되지 않았습니다.")
      return
    }

    let cancelled = false

    const initMap = async () => {
      try {
        await loadKakaoMaps(appKey)
        if (cancelled || !containerRef.current) return

        const addressCandidates = [
          address,
          "서울특별시 강남구 테헤란로 128",
          "강남구 테헤란로 128",
        ]

        let coords: { lat: number; lng: number } | null = null

        for (const candidate of addressCandidates) {
          coords = await searchAddress(candidate)
          if (coords) break
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

        renderMap(containerRef.current, coords.lat, coords.lng, level)
        setStatus("ready")
      } catch {
        if (!cancelled) {
          setErrorDetail(
            "카카오 지도 SDK를 불러오지 못했습니다. Kakao Developers에서 JavaScript 키와 Web 도메인(localhost:3000) 등록을 확인해 주세요.",
          )
          setStatus("error")
        }
      }
    }

    void initMap()

    return () => {
      cancelled = true
    }
  }, [address, fallbackLat, fallbackLng, level, appKey])

  return (
    <div
      className={cn(
        "relative h-[360px] md:h-[440px] w-full overflow-hidden rounded-lg bg-muted",
        className,
      )}
      aria-label={`${markerTitle} 위치 지도`}
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
