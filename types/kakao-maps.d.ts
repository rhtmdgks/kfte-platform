export {}

declare global {
  namespace kakao {
    namespace maps {
      function load(callback: () => void): void

      class LatLng {
        constructor(lat: number, lng: number)
      }

      class Map {
        constructor(container: HTMLElement, options: { center: LatLng; level: number })
        setCenter(latlng: LatLng): void
        relayout(): void
      }

      class Marker {
        constructor(options: { map: Map; position: LatLng })
      }

      namespace services {
        enum Status {
          OK = "OK",
          ZERO_RESULT = "ZERO_RESULT",
          ERROR = "ERROR",
        }

        class Geocoder {
          addressSearch(
            address: string,
            callback: (
              result: Array<{ x: string; y: string }>,
              status: Status,
            ) => void,
          ): void
        }
      }
    }
  }

  interface Window {
    kakao: typeof kakao
  }
}
