'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { motion } from 'framer-motion'

// Global configuration for the "electric arc" divider. Tweak values here.
export const ELECTRIC_CONFIG = {
	timeClampSec: 0.05, // clamp for RAF delta to avoid big jumps
	// SVG/styling
	svg: {
		strokes: {
			outer: { width: 3, color: 'rgba(173,216,230,0.75)' }, // wide soft halo
			mid: { width: 2.2, color: 'rgba(135,206,250,0.55)' }, // sky-blue glow
			core: { width: 1.2, opacity: 0.95, color: 'white' }, // bright inner line
		},
		glowBlur: 0.9,
	},

	speeds: [-1.32, 0.42, 0.95],
	// Extra shimmer/noise layer
	shimmer: {
		speed: 4.2,
		freq: 8.5,
		amp: 0.25,
	},
	// Geometry/details
	segments: 48, // polyline resolution (higher = smoother, heavier)

	freqs: [0.7, 2.7, 3.9],

	// Motion smoothing for divider position
	easeStiffness: 6, // higher = faster easing
	clipOffset: 25, // diagonal offset between top and bottom X in percent

	// Multi-frequency wave settings
	amps: [0.4, -0.8, 0.6],
} as const

interface DiagonalSliderProps {
	leftComponent?: ReactNode
	rightComponent?: ReactNode
}

// Integrated ShaderCanvas component
function ShaderCanvas({ className = '' }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationFrameRef = useRef<number>(0)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true })
		if (!gl) {
			console.error('WebGL not supported')
			return
		}

		const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

		const fragmentShaderSource = `
      precision highp float;

      uniform float iTime;
      uniform vec2 iResolution;

      vec3 random3(vec3 c) {
          float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
          vec3 r;
          r.z = fract(512.0*j);
          j *= .125;
          r.x = fract(512.0*j);
          j *= .125;
          r.y = fract(512.0*j);
          return r-0.5;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float simplex3d(vec3 p) {
           vec3 s = floor(p + dot(p, vec3(F3)));
           vec3 x = p - s + dot(s, vec3(G3));

           vec3 e = step(vec3(0.0), x - x.yzx);
           vec3 i1 = e*(1.0 - e.zxy);
           vec3 i2 = 1.0 - e.zxy*(1.0 - e);

           vec3 x1 = x - i1 + G3;
           vec3 x2 = x - i2 + 2.0*G3;
           vec3 x3 = x - 1.0 + 3.0*G3;

           vec4 w, d;

           w.x = dot(x, x);
           w.y = dot(x1, x1);
           w.z = dot(x2, x2);
           w.w = dot(x3, x3);

           w = max(0.6 - w, 0.0);

           d.x = dot(random3(s), x);
           d.y = dot(random3(s + i1), x1);
           d.z = dot(random3(s + i2), x2);
           d.w = dot(random3(s + 1.0), x3);

           w *= w;
           w *= w;
           d *= w;

           return dot(d, vec4(52.0));
      }

      float noise(vec3 m) {
          return   0.5333333*simplex3d(m)
                  +0.2666667*simplex3d(2.0*m)
                  +0.1333333*simplex3d(4.0*m)
                  +0.0666667*simplex3d(8.0*m);
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec4 fragColor;

        vec2 uv = fragCoord.xy / iResolution.xy;
        uv = uv * 2. -1.;

        vec2 p = fragCoord.xy/iResolution.x;
        vec3 p3 = vec3(p, iTime*0.25);

        float intensity = noise(vec3(p3*12.0+12.0));

        float t = clamp((uv.x * -uv.x * 0.16) + 0.15, 0., 1.);
        float y = abs(intensity * -t + uv.y);

        float g = pow(y, 0.14);

        vec3 col = vec3(2.0, 2.1, 2.3);
        col = col * -g + col;
        col = col * col;
        col = col * col;

        fragColor.rgb = col;
        fragColor.w = dot(col, vec3(0.299, 0.587, 0.114));

        gl_FragColor = fragColor;
      }
    `

		function createShader(gl: WebGLRenderingContext, type: number, source: string) {
			const shader = gl.createShader(type)
			if (!shader) return null

			gl.shaderSource(shader, source)
			gl.compileShader(shader)

			if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == false) {
				console.error('Error compiling shader:', gl.getShaderInfoLog(shader))
				gl.deleteShader(shader)
				return null
			}

			return shader
		}

		function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
			const program = gl.createProgram()
			if (program == null || vertexShader == null || fragmentShader == null || gl == null) return null

			gl.attachShader(program, vertexShader)
			gl.attachShader(program, fragmentShader)
			gl.linkProgram(program)

			if (gl.getProgramParameter(program, gl.LINK_STATUS) == false) {
				console.error('Error linking program:', gl.getProgramInfoLog(program))
				gl.deleteProgram(program)
				return null
			}

			return program
		}

		const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

		if (!vertexShader || !fragmentShader) return

		const program = createProgram(gl, vertexShader, fragmentShader)
		if (!program) return

		const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
		const timeUniformLocation = gl.getUniformLocation(program, 'iTime')
		const resolutionUniformLocation = gl.getUniformLocation(program, 'iResolution')

		const positionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

		function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
			const displayWidth = canvas.clientWidth
			const displayHeight = canvas.clientHeight

			if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
				canvas.width = displayWidth
				canvas.height = displayHeight
			}
		}

		function render(time: number) {
			if (!canvas || !gl) return

			resizeCanvasToDisplaySize(canvas)

			gl.viewport(0, 0, canvas.width, canvas.height)
			gl.clearColor(0, 0, 0, 0)
			gl.clear(gl.COLOR_BUFFER_BIT)
			gl.enable(gl.BLEND)
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

			gl.useProgram(program)

			gl.enableVertexAttribArray(positionAttributeLocation)
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
			gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

			gl.uniform1f(timeUniformLocation, time * 0.001)
			gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

			gl.drawArrays(gl.TRIANGLES, 0, 6)

			animationFrameRef.current = requestAnimationFrame(render)
		}

		animationFrameRef.current = requestAnimationFrame(render)

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			className={`${className} pointer-events-none bg-transparent`}
			style={{ display: 'block' }}
		/>
	)
}

export function LightningSplit({
	rightComponent,
	leftComponent,
}: DiagonalSliderProps) {
	const containerRef = useRef<HTMLDivElement>(null)

	// Position states: 50% = center, 5% = show mostly right, 95% = show mostly left
	const [position, setPosition] = useState(60)

	// Electric mode states
	const [displayPos, setDisplayPos] = useState(60) // Smooth display position for electric mode
	const [time, setTime] = useState(0) // Time accumulator for wave animation

	// Animation loop: advance time and gently ease displayPos towards target position
	useEffect(() => {
		let raf = 0
		let last = performance.now()
		const tick = (now: number) => {
			const dt = Math.min(ELECTRIC_CONFIG.timeClampSec, (now - last) / 1000) // clamp to avoid large jumps
			last = now

			// Advance time for wave motion
			setTime(t => t + dt)

			// Critically damped-like easing (manual spring-ish)
			setDisplayPos(p => {
				const target = position
				const stiffness = ELECTRIC_CONFIG.easeStiffness // larger = faster
				return p + (target - p) * (1 - Math.exp(-stiffness * dt))
			})

			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [position])

	// Simple hover system: left half vs right half
	const handleMouseMove = (e: React.MouseEvent) => {
		if (!containerRef.current) return

		const rect = containerRef.current.getBoundingClientRect()
		const x = ((e.clientX - rect.left) / rect.width) * 100

		if (x < 50) {
			// Hover left side - expand left image (push line to right)
			setPosition(110) // Fixed position to show more left
		} else {
			// Hover right side - expand right image (push line to left)
			setPosition(20) // Fixed position to show more right
		}
	}

	const handleMouseLeave = () => {
		setPosition(60) // Back to center
	}

	// Utility: clamp a number between 0..100
	const clamp01_100 = (v: number) => Math.max(0, Math.min(100, v))

	// Generate wavy diagonal points and corresponding clip-path polygon
	const { polyPointsStr, clipPolygonStr } = useMemo<{ polyPointsStr: string; clipPolygonStr: string }>(() => {
		// How many segments to approximate the wave (more => smoother but heavier)
		const SEGMENTS = ELECTRIC_CONFIG.segments
		// Wave palette: multi-frequency sines for "electric" chaos
		const AMPS = ELECTRIC_CONFIG.amps
		const FREQS = ELECTRIC_CONFIG.freqs
		const SPEEDS = ELECTRIC_CONFIG.speeds

		const topX = clamp01_100(displayPos)
		const bottomX = clamp01_100(displayPos - ELECTRIC_CONFIG.clipOffset)

		const pts: Array<{ x: number; y: number }> = []
		for (let i = 0; i <= SEGMENTS; i++) {
			const tNorm = i / SEGMENTS // 0..1 top->bottom
			const y = tNorm * 100
			const base = topX * (1 - tNorm) + bottomX * tNorm
			// Multi-layer wave offset
			let off = 0
			for (let k = 0; k < AMPS.length; k++) {
				off += AMPS[k] * Math.sin(2 * Math.PI * (FREQS[k] * tNorm + SPEEDS[k] * time) + k * 1.3)
			}
			// A tiny high-frequency shimmer
			off +=
				ELECTRIC_CONFIG.shimmer.amp *
				Math.sin(2 * Math.PI * (ELECTRIC_CONFIG.shimmer.freq * tNorm + ELECTRIC_CONFIG.shimmer.speed * time))

			const x = clamp01_100(base + off)
			pts.push({ y, x })
		}

		// Build SVG polyline points string (viewBox 0..100)
		const polyPointsStr = pts.map(p => `${p.x},${p.y}`).join(' ')

		// Build CSS polygon() for clipping the left layer (clockwise)
		// Start top-left corner, then along the wavy edge from top->bottom, then bottom-left
		const edgePoints = pts
			// Ensure we include explicit top and bottom edge with precise y (already have 0 and 100)
			.map(p => `${p.x}% ${p.y}%`)
			.join(', ')
		const clipPolygonStr = `polygon(0% 0%, ${edgePoints}, 0% 100%)`

		return { polyPointsStr, clipPolygonStr }
	}, [displayPos, time])

	// Classic mode calculations (preserved from original)
	const x1 = position
	const x2 = Math.max(0, Math.min(100, position - 25))
	const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
	const containerHeight = typeof window !== 'undefined' ? window.innerHeight : 1080

	// Real coordinates in pixels
	const realX1 = (x1 / 100) * containerWidth
	const realY1 = 0
	const realX2 = (x2 / 100) * containerWidth
	const realY2 = containerHeight

	// Calculate angle and positioning for perfect alignment
	const angle = Math.atan2(realY2 - realY1, realX2 - realX1) * (180 / Math.PI)
	const lineLength = Math.sqrt(Math.pow(realX2 - realX1, 2) + Math.pow(realY2 - realY1, 2))

	// Position the overlay div at the start of the line (top point)
	const overlayX = realX1
	const overlayY = realY1

	// Typed style for vendor-prefixed clip-path (electric wavy clipping)
	const leftClipStyle: CSSProperties & { WebkitClipPath?: string } = {
		WebkitClipPath: clipPolygonStr,
		clipPath: clipPolygonStr,
	}

	return (
		<motion.div
			ref={containerRef}
			className="relative h-screen w-full overflow-hidden select-none"
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
			style={{ pointerEvents: 'auto' }}
		>
			{/* Right Component - Base Layer */}
			<div
				className="pointer-events-auto absolute inset-0 overflow-hidden"
				onMouseMove={handleMouseMove}
				onMouseEnter={handleMouseMove}
			>
				<div className="h-full w-full">
					{rightComponent}
				</div>
			</div>

			{/* Left Component - Wavy Electric Clipped Layer */}
			<div
				className="pointer-events-auto absolute inset-0 overflow-hidden"
				style={leftClipStyle}
				onMouseMove={handleMouseMove}
				onMouseEnter={handleMouseMove}
			>
				<div className="h-full w-full">
					{leftComponent}
				</div>
			</div>

			{/* SVG electric arc divider */}
			<svg
				className="pointer-events-none absolute inset-0 z-30 select-none"
				width="100%"
				height="100%"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				style={{ userSelect: 'none' }}
			>
				<defs>
					<filter id="electric-glow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation={ELECTRIC_CONFIG.svg.glowBlur} result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Electric multi-layer polylines */}
				<polyline
					points={polyPointsStr}
					fill="none"
					stroke={ELECTRIC_CONFIG.svg.strokes.mid.color}
					strokeWidth={ELECTRIC_CONFIG.svg.strokes.mid.width}
					vectorEffect="non-scaling-stroke"
					filter="url(#electric-glow)"
				/>
				<polyline
					points={polyPointsStr}
					fill="none"
					stroke={ELECTRIC_CONFIG.svg.strokes.core.color}
					strokeOpacity={ELECTRIC_CONFIG.svg.strokes.core.opacity}
					strokeWidth={ELECTRIC_CONFIG.svg.strokes.core.width}
					vectorEffect="non-scaling-stroke"
				/>
				<polyline
					points={polyPointsStr}
					fill="none"
					stroke={ELECTRIC_CONFIG.svg.strokes.outer.color}
					strokeWidth={ELECTRIC_CONFIG.svg.strokes.outer.width}
					vectorEffect="non-scaling-stroke"
					filter="url(#electric-glow)"
				/>
			</svg>

			{/* Shader overlay */}
			<motion.div
				className="absolute z-20 select-none"
				animate={{
					y: overlayY,
					x: overlayX,
					rotate: angle,
				}}
				transition={{
					type: 'spring',
					stiffness: 120,
					restSpeed: 0.001,
					restDelta: 0.001,
					mass: 1.2,
					damping: 20,
				}}
				style={{
					width: `${lineLength}px`,
					userSelect: 'none',
					transformOrigin: 'left center',
				}}
			>
				<div className="h-8 w-[120vw] -translate-x-16 translate-y-2">
					<div className="pointer-events-none relative h-screen w-screen opacity-[90]">
						<div className="pointer-events-none absolute inset-0 z-20 h-screen w-[100vw] translate-x-[10%] -translate-y-[48%] scale-150 lg:w-screen lg:translate-x-0">
							<ShaderCanvas className="pointer-events-none h-[100vh] w-[200vw]" />
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}
