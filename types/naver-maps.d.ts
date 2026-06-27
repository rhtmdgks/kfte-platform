declare namespace naver {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number)
    }

    class Map {
      constructor(element: HTMLElement, options: { center: LatLng; zoom: number })
      setCenter(center: LatLng): void
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
        options: { address: string },
        callback: (
          status: Service.Status,
          response: {
            result: {
              items: Array<{
                point: { x: number; y: number }
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
}
