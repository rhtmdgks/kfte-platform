import { About } from "./about"
import { Apply } from "./apply"
import { Atmosphere } from "./atmosphere"
import { Events } from "./events"
import { BonlipFooter } from "./footer"
import { Hero } from "./hero"
import { Rundown } from "./rundown"
import { TickerTape } from "./ticker"

export function BonlipLanding() {
  return (
    <div className="bonlip relative min-h-screen overflow-x-hidden">
      <Atmosphere />

      <div className="relative z-10">
        <Hero />

        <div className="relative z-20 -mx-2 my-6 md:my-10">
          <TickerTape />
        </div>

        <Events />
        <Rundown />
        <About />
        <Apply />
        <BonlipFooter />
      </div>
    </div>
  )
}
