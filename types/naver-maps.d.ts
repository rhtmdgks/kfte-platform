declare namespace naver {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number)
    }

    class Map {
      constructor(
        element: string | HTMLElement,
        options?: {
          center?: LatLng
          zoom?: number
          size?: Size
        },
      )
      setCenter(center: LatLng): void
      setSize(size: Size): void
      destroy?: () => void
    }

    class Size {
      constructor(width: number, height: number)
    }

    class Marker {
      constructor(options: { map: Map; position: LatLng; title?: string })
    }

    class InfoWindow {
      constructor(options: { content: string })
      open(map: Map, marker: Marker): void
    }

    namespace Service {
      enum Status {
        OK = "OK",
        ERROR = "ERROR",
      }

      function geocode(
        options: { query: string } | { address: string },
        callback: (
          status: Service.Status,
          response: {
            v2?: {
              addresses?: Array<{
                x: string
                y: string
                roadAddress?: string
                jibunAddress?: string
              }>
            }
            result?: {
              items?: Array<{
                point?: { x: number; y: number }
              }>
            }
          },
        ) => void,
      ): void
    }
  }
}

interface Window {
  naver?: typeof naver
  navermap_authFailure?: () => void
}
