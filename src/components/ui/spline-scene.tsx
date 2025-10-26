'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ),
})

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Unable to load 3D scene</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Theme-based overlay for visual adjustment */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-10"
        style={{
          background: resolvedTheme === 'dark'
            ? 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
            : 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 100%)',
        }}
      />

      <Spline
        scene={scene}
        onError={() => setError(true)}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
