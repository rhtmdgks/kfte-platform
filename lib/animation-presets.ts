import type { Transition, Variants } from "motion/react"

export const easeSmooth = [0.16, 1, 0.3, 1] as const

export const springGentle: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 34,
  mass: 0.85,
}

export const springSidebar: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 34,
  mass: 0.85,
}

export const tweenSmooth: Transition = {
  duration: 0.45,
  ease: easeSmooth,
}

export const viewportOnce = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -48px 0px",
} as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeUpHero: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
}

export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export const slideDown: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
}
