import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'

type RiveComponentType = (props: { src: string; autoplay?: boolean; className?: string }) => JSX.Element

type RiveShowcaseProps = {
  files?: string[]
  title?: string
}

export const RiveShowcase = ({ files = ['/animations/login.riv'], title = 'Animations' }: RiveShowcaseProps) => {
  const [RiveComponent, setRiveComponent] = useState<RiveComponentType | null>(null)

  useEffect(() => {
    let mounted = true
    import('@rive-app/react-canvas')
      .then((mod) => {
        const RiveComp = (mod as unknown as { RiveComponent?: RiveComponentType }).RiveComponent
        if (mounted && RiveComp) {
          setRiveComponent(() => RiveComp)
        }
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(249, 115, 22, 0.2)', background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: '#f97316', fontFamily: 'Poppins, sans-serif' }}>{title}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
        {files.map((src) => (
          <Box key={src} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(249, 115, 22, 0.15)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140 }}>
            {RiveComponent ? (
              <RiveComponent src={src} autoplay className="w-full h-full" />
            ) : (
              <Box className="rive-fallback" sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <Typography sx={{ color: '#f97316', fontFamily: 'Poppins, sans-serif', fontWeight: 800, letterSpacing: '0.4px' }}>
                    {(src.split('/').pop() || 'Animation').replace('.riv', '')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#fb923c', fontFamily: 'Poppins, sans-serif', fontWeight: 600, opacity: 0.9 }}>
                    Mode démo
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
