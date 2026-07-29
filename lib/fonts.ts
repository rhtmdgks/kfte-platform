import { Instrument_Serif, Unbounded } from 'next/font/google'
import localFont from 'next/font/local'

export const paperlogy = localFont({
  src: [
    {
      path: '../assets/fonts/Paperlogy-1Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-2ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-3Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-4Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-5Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-6SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-7Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-8ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Paperlogy-9Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-paperlogy',
  display: 'swap',
})

export const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-unbounded',
  display: 'swap',
})

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})
