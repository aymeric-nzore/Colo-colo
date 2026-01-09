import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type DecorationSVGProps = {
  position?: 'top-right' | 'bottom-left' | 'center';
  size?: number;
  opacity?: number;
  rotate?: number;
  zIndex?: number;
}

export const DecorationSVG = ({ position = 'top-right', size = 260, opacity = 0.25, rotate = -8, zIndex = 1 }: DecorationSVGProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(el, { y: -8, rotation: rotate, duration: 3.5, ease: 'sine.inOut' })
      .to(el, { y: 0, rotation: rotate / 2, duration: 3.5, ease: 'sine.inOut' })
    return () => { tl.kill() }
  }, [rotate])

  const posStyles = {
    'top-right': { top: -20, right: -20 },
    'bottom-left': { bottom: -20, left: -20 },
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' as const },
  }[position]

  return (
    <Box
      ref={ref}
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        pointerEvents: 'none',
        opacity,
        zIndex,
        ...posStyles,
      }}
    >
      <Box component="img" src="/decoration.svg" alt="Décoration" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Box>
  )
}
