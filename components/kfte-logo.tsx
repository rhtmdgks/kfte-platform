import Image from "next/image"
import { cn } from "@/lib/utils"
import logoBlue from "@/assets/logo/kfte_logo(blue).svg"
import logoWhite from "@/assets/logo/kfte_logo(white).svg"
import logoSymbol from "@/assets/logo/kfte_symbol.svg"

type KfteLogoProps = {
  variant?: "blue" | "white" | "symbol"
  className?: string
  priority?: boolean
}

const variantSrc = {
  blue: logoBlue,
  white: logoWhite,
  symbol: logoSymbol,
} as const

export function KfteLogo({
  variant = "blue",
  className,
  priority = false,
}: KfteLogoProps) {
  const src = variantSrc[variant]

  return (
    <Image
      src={src}
      alt="한국기술창업진흥재단 KFTE"
      priority={priority}
      className={cn(
        variant === "symbol" ? "h-9 w-9 md:h-10 md:w-10" : "h-10 w-auto md:h-12",
        className,
      )}
    />
  )
}
