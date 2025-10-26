"use client"

import { useEffect, useRef } from "react"

interface LightParticle {
  x: number
  y: number
  targetX: number
  targetY: number
  speed: number
  brightness: number
  gridLine: "horizontal" | "vertical"
  progress: number
}

interface AnimatedGridBackgroundProps {
  gridSize?: number
  lightSpeed?: number
  maxLights?: number
  lightSpawnRate?: number
  primaryColor?: string
  secondaryColor?: string
  gridColor?: string
  className?: string
}

export function AnimatedGridBackground({
  gridSize = 40,
  lightSpeed = 1.5,
  maxLights = 8,
  lightSpawnRate = 0.02,
  primaryColor = "38, 92, 50", // Orange from theme
  secondaryColor = "168, 85, 247",
  gridColor,
  className = "",
}: AnimatedGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lightsRef = useRef<LightParticle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let lastTime = 0

    const isDarkMode = () => {
      return document.documentElement.classList.contains("dark")
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const createLight = (): LightParticle => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      const isHorizontal = Math.random() > 0.5

      if (isHorizontal) {
        const y = Math.floor(Math.random() * (height / gridSize)) * gridSize
        return {
          x: 0,
          y,
          targetX: width,
          targetY: y,
          speed: 0.5 + Math.random() * lightSpeed,
          brightness: 0.8 + Math.random() * 0.2,
          gridLine: "horizontal",
          progress: 0,
        }
      } else {
        const x = Math.floor(Math.random() * (width / gridSize)) * gridSize
        return {
          x,
          y: 0,
          targetX: x,
          targetY: height,
          speed: 0.5 + Math.random() * lightSpeed,
          brightness: 0.8 + Math.random() * 0.2,
          gridLine: "vertical",
          progress: 0,
        }
      }
    }

    const drawGrid = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, width, height)

      const defaultGridColor = isDarkMode() ? "#333333" : "#e5e7eb"
      ctx.strokeStyle = gridColor || defaultGridColor
      ctx.lineWidth = 1

      const centerX = width / 2
      const centerY = height / 2

      // Create wavy grid pattern
      for (let x = -gridSize; x < width + gridSize; x += gridSize) {
        ctx.beginPath()
        for (let y = 0; y <= height; y += 2) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          )
          const wave = Math.sin(distanceFromCenter * 0.02) * 20
          const perspective = 1 - distanceFromCenter / (width * 0.8)
          const adjustedX = x + wave * Math.max(0, perspective)

          if (y === 0) {
            ctx.moveTo(adjustedX, y)
          } else {
            ctx.lineTo(adjustedX, y)
          }
        }
        ctx.stroke()
      }

      for (let y = -gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          )
          const wave = Math.sin(distanceFromCenter * 0.02) * 20
          const perspective = 1 - distanceFromCenter / (height * 0.8)
          const adjustedY = y + wave * Math.max(0, perspective)

          if (x === 0) {
            ctx.moveTo(x, adjustedY)
          } else {
            ctx.lineTo(x, adjustedY)
          }
        }
        ctx.stroke()
      }
    }

    const drawLights = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      const centerX = width / 2
      const centerY = height / 2

      lightsRef.current.forEach((light) => {
        const distanceFromCenter = Math.sqrt(
          Math.pow(light.x - centerX, 2) + Math.pow(light.y - centerY, 2)
        )
        const wave = Math.sin(distanceFromCenter * 0.02) * 20

        let adjustedX = light.x
        let adjustedY = light.y

        if (light.gridLine === "vertical") {
          const perspective = 1 - distanceFromCenter / (width * 0.8)
          adjustedX = light.x + wave * Math.max(0, perspective)
        } else {
          const perspective = 1 - distanceFromCenter / (height * 0.8)
          adjustedY = light.y + wave * Math.max(0, perspective)
        }

        // Create glowing effect with theme colors
        const gradient = ctx.createRadialGradient(
          adjustedX,
          adjustedY,
          0,
          adjustedX,
          adjustedY,
          15
        )

        if (isDarkMode()) {
          gradient.addColorStop(0, `rgba(${primaryColor}, ${light.brightness})`)
          gradient.addColorStop(0.5, `rgba(${primaryColor}, ${light.brightness * 0.5})`)
          gradient.addColorStop(1, `rgba(${primaryColor}, 0)`)
        } else {
          gradient.addColorStop(0, `rgba(${primaryColor}, ${light.brightness})`)
          gradient.addColorStop(0.5, `rgba(${primaryColor}, ${light.brightness * 0.5})`)
          gradient.addColorStop(1, `rgba(${primaryColor}, 0)`)
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(adjustedX, adjustedY, 15, 0, Math.PI * 2)
        ctx.fill()

        // Core light
        ctx.fillStyle = isDarkMode()
          ? `rgba(255, 255, 255, ${light.brightness})`
          : `rgba(${primaryColor}, ${light.brightness})`
        ctx.beginPath()
        ctx.arc(adjustedX, adjustedY, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Update light positions
      lightsRef.current.forEach((light, index) => {
        light.progress += light.speed * deltaTime * 0.001

        if (light.gridLine === "horizontal") {
          light.x = light.progress * light.targetX
        } else {
          light.y = light.progress * light.targetY
        }

        // Remove lights that have completed their journey
        if (light.progress >= 1) {
          lightsRef.current.splice(index, 1)
        }
      })

      // Randomly spawn new lights
      if (Math.random() < lightSpawnRate) {
        lightsRef.current.push(createLight())
      }

      // Keep maximum number of lights reasonable
      if (lightsRef.current.length > maxLights) {
        lightsRef.current.shift()
      }

      drawGrid()
      drawLights()

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animationRef.current = requestAnimationFrame(animate)
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gridSize, lightSpeed, maxLights, lightSpawnRate, primaryColor, secondaryColor, gridColor])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  )
}
