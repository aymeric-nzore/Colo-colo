import { Box, Typography } from '@mui/material'
import { DecorationSVG } from './Decorations'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// Chargement paresseux de Rive pour éviter de casser si la lib n'est pas encore installée
type RiveComponentType = (props: { src: string; autoplay?: boolean; className?: string }) => JSX.Element

export const RiveHero = () => {
  const [RiveComponent, setRiveComponent] = useState<RiveComponentType | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    // @ts-expect-error: le module sera présent une fois installé par le projet
    import('@rive-app/react-canvas')
      .then((mod) => {
        if (mounted && mod.RiveComponent) {
          setRiveComponent(() => mod.RiveComponent as RiveComponentType)
        }
      })
      .catch(() => {
        // on tombe simplement sur le fallback visuel
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        x: -40,
        duration: 1.2,
        ease: 'power3.out',
      })
      
      // Animation fluide de la sphère principale
      gsap.to('.security-sphere-inner', {
        duration: 8,
        repeat: -1,
        rotation: 360,
        ease: 'none',
      })
      
      // Animation des éléments de sécurité
      gsap.to('.security-dot-1', {
        duration: 4,
        repeat: -1,
        opacity: 0.3,
        ease: 'sine.inOut',
      })
      
      gsap.to('.security-dot-2', {
        duration: 5,
        repeat: -1,
        opacity: 0.5,
        ease: 'sine.inOut',
        delay: 0.5,
      })
      
      gsap.to('.security-dot-3', {
        duration: 6,
        repeat: -1,
        opacity: 0.4,
        ease: 'sine.inOut',
        delay: 1,
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box ref={heroRef} className="auth-hero" sx={{ mb: 3, p: { xs: 2, md: 3 }, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
      {RiveComponent ? (
        <RiveComponent src="/animations/login.riv" autoplay className="w-full h-56 animate-float" />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <DecorationSVG position="top-right" size={260} opacity={0.22} rotate={-6} zIndex={0} />
          <Box sx={{ zIndex: 10 }}>
            <Typography variant="overline" className="text-orange-400 font-black text-sm" sx={{ letterSpacing: 3 }}>
              🎓 PORTAIL ÉLÈVE
            </Typography>
            <Typography variant="h5" className="font-black text-white mt-2 mb-2" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.8rem' }}>
              Connexion Sécurisée
            </Typography>
            <Typography variant="body2" className="text-slate-200 max-w-xs opacity-90" sx={{ fontFamily: 'Poppins, sans-serif', lineHeight: 1.6 }}>
              Accédez instantanément à votre espace personnel. Consultez vos notes, votre emploi du temps et vos ressources académiques en un seul endroit.
            </Typography>
          </Box>
          
          {/* Sphère de sécurité moderne */}
          <Box
            sx={{
              position: 'relative',
              width: 220,
              height: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            }}
          >
            {/* Fond avec dégradé */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                filter: 'blur(20px)',
                animation: 'pulse 4s ease-in-out infinite',
              }}
            />
            
            {/* Sphère principale avec gradient rotateur */}
            <Box
              className="security-sphere-inner"
              sx={{
                position: 'relative',
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #f97316 0%, #fbbf24 25%, #06b6d4 50%, #3b82f6 75%, #f97316 100%)',
                boxShadow: '0 0 60px rgba(249, 115, 22, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Centre lumineux */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(59, 130, 246, 0.4))',
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
                }}
              />
              
              {/* Icône cadenas */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '3rem',
                  zIndex: 2,
                }}
              >
                🔒
              </Box>
            </Box>
            
            {/* Points orbitaux animés */}
            <Box
              className="security-dot-1"
              sx={{
                position: 'absolute',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#f97316',
                boxShadow: '0 0 15px rgba(249, 115, 22, 0.8)',
                top: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
            
            <Box
              className="security-dot-2"
              sx={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#06b6d4',
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.8)',
                bottom: '10%',
                right: '10%',
              }}
            />
            
            <Box
              className="security-dot-3"
              sx={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#3b82f6',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.8)',
                bottom: '10%',
                left: '10%',
              }}
            />
            
            {/* Anneaux de sécurité */}
            <Box
              sx={{
                position: 'absolute',
                width: 220,
                height: 220,
                borderRadius: '50%',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                animation: 'pulse-ring 3s ease-in-out infinite',
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                animation: 'pulse-ring 4s ease-in-out infinite 0.5s',
              }}
            />
          </Box>
        </Box>
      )}
      <div className="auth-hero-overlay" />
    </Box>
  )
}


