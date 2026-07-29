import { BRAND } from "./data"

/** 다크 배경 레이어: 에코 워터마크 + 글로우 오브 + 스캔라인 + 시머 */
export function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <span className="bonlip-echo absolute left-1/2 top-[6%] -translate-x-1/2 whitespace-nowrap font-extrabold leading-none tracking-[-0.06em] text-[clamp(6rem,26vw,20rem)]">
        {BRAND.hanja}
      </span>
      <span className="bonlip-echo absolute -left-[6%] top-[58%] whitespace-nowrap font-extrabold leading-none tracking-[-0.06em] text-[clamp(4rem,16vw,12rem)] opacity-70">
        {BRAND.hanja}
      </span>
      <div className="bonlip-glow absolute -right-[10%] top-[2%] h-[420px] w-[420px] md:h-[520px] md:w-[520px]" />
      <div className="bonlip-glow bonlip-glow--mid absolute -left-[14%] top-[38%] h-[380px] w-[380px] md:h-[480px] md:w-[480px]" />
      <div className="bonlip-glow absolute bottom-[6%] right-[12%] h-[300px] w-[300px] opacity-25 md:h-[400px] md:w-[400px]" />
      <div className="bonlip-scanlines absolute inset-0" />
      <div className="bonlip-shimmer absolute inset-0" />
    </div>
  )
}
