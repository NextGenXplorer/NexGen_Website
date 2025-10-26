'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [splineApp, setSplineApp] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update Spline scene when theme changes
  useEffect(() => {
    if (splineApp && mounted) {
      try {
        // Try to find and update theme-related objects in the scene
        const isDark = resolvedTheme === 'dark'

        // You can trigger events or update variables in Spline
        splineApp.emitEvent('mouseDown', isDark ? 'dark' : 'light')

        // Alternative: Update specific objects if they exist
        // splineApp.setVariable('theme', isDark ? 'dark' : 'light')
      } catch (error) {
        console.log('Spline theme update not available for this scene')
      }
    }
  }, [resolvedTheme, splineApp, mounted])

  function onLoad(spline: any) {
    setSplineApp(spline)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Theme-based overlay for visual adjustment */}
      {mounted && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: resolvedTheme === 'dark'
              ? 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
              : 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 100%)',
          }}
        />
      )}

      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <Spline
          scene={scene}
          onLoad={onLoad}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  )
}
