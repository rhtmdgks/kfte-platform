import type { Transition, Variants } from "motion/react"

export const easeSmooth = [0.16, 1, 0.3, 1] as const

export const springGentle: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 36,
  mass: 0.7,
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

/** Route-level page enter — snappy */
export const tweenPage: Transition = {
  duration: 0.1,
  ease: easeSmooth,
}

/** Route-level page exit — instant so mode=wait does not block */
export const tweenPageExit: Transition = {
  duration: 0,
}

export const viewportOnce = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -48px 0px",
} as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeUpHero: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

/** Opacity-only: cheaper than y-shift, less layout thrash on route change */
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: tweenPage,
  },
  exit: {
    opacity: 0,
    transition: tweenPageExit,
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
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
