'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec2 resolution;
  uniform float time;
  uniform vec2 mouse;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float intensity;
  uniform float beamCount;

  varying vec2 vUv;

  #define PI 3.14159265359

  // Noise function for volumetric effects
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(
      mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
      mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
          mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z
    );
  }

  // Fractal Brownian Motion for complex volumetric patterns
  float fbm(vec3 p) {
    float f = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 5; i++) {
      f += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }

    return f;
  }

  // Volumetric light beam function
  float volumetricBeam(vec3 p, vec3 origin, vec3 direction, float width, float falloff) {
    vec3 toPoint = p - origin;
    float alongBeam = dot(toPoint, direction);
    vec3 perpendicular = toPoint - direction * alongBeam;
    float dist = length(perpendicular);

    float beam = exp(-dist * falloff / width);
    float fade = smoothstep(0.0, 1.0, alongBeam) * smoothstep(10.0, 0.0, alongBeam);

    return beam * fade;
  }

  // God rays / crepuscular rays
  float godRays(vec2 uv, vec2 lightPos, int samples, float density, float weight, float decay) {
    vec2 deltaUV = (uv - lightPos) / float(samples) * density;
    vec2 sampleUV = uv;
    float illuminationDecay = 1.0;
    float totalWeight = 0.0;

    for (int i = 0; i < 100; i++) {
      if (i >= samples) break;

      sampleUV -= deltaUV;
      float sampleDist = length(sampleUV - lightPos);
      float sampleWeight = illuminationDecay * weight;

      totalWeight += sampleWeight * (1.0 - smoothstep(0.0, 1.0, sampleDist));
      illuminationDecay *= decay;
    }

    return totalWeight;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= resolution.x / resolution.y;

    vec3 col = vec3(0.0);

    // Multiple light sources with mouse control
    vec2 lightPos1 = vec2(sin(time * 0.3) * 0.5 + mouse.x * 0.3, cos(time * 0.2) * 0.3 + mouse.y * 0.3);
    vec2 lightPos2 = vec2(-sin(time * 0.4) * 0.6, cos(time * 0.3) * 0.4);
    vec2 lightPos3 = vec2(cos(time * 0.25) * 0.5, -sin(time * 0.35) * 0.5);

    // God rays from multiple sources
    float rays1 = godRays(vUv, lightPos1 * 0.5 + 0.5, int(beamCount), 0.8, 0.3, 0.98);
    float rays2 = godRays(vUv, lightPos2 * 0.5 + 0.5, int(beamCount * 0.8), 0.6, 0.25, 0.97);
    float rays3 = godRays(vUv, lightPos3 * 0.5 + 0.5, int(beamCount * 0.6), 0.7, 0.2, 0.96);

    // 3D volumetric beams
    vec3 p = vec3(uv * 2.0, time * 0.1);
    float vol1 = volumetricBeam(
      p,
      vec3(lightPos1 * 2.0, 0.0),
      normalize(vec3(sin(time * 0.2), cos(time * 0.3), 1.0)),
      0.5,
      3.0
    );

    float vol2 = volumetricBeam(
      p,
      vec3(lightPos2 * 2.0, 0.0),
      normalize(vec3(-cos(time * 0.25), sin(time * 0.2), 1.0)),
      0.4,
      2.5
    );

    // Volumetric fog/atmosphere
    vec3 fogPos = vec3(uv * 1.5, time * 0.05);
    float fog = fbm(fogPos) * 0.5;

    // Animated dust particles in light beams
    vec3 dustPos = vec3(uv * 3.0, time * 0.2);
    float dust = noise(dustPos) * noise(dustPos * 2.0);

    // Combine all volumetric elements with theme colors
    vec3 beam1Color = color1 * (rays1 * 2.0 + vol1);
    vec3 beam2Color = color2 * (rays2 * 1.5 + vol2);
    vec3 beam3Color = color3 * rays3 * 1.2;

    col = beam1Color + beam2Color + beam3Color;
    col += color2 * fog * 0.3;
    col += color3 * dust * 0.2;

    // Atmospheric glow
    float glow = smoothstep(1.5, 0.0, length(uv));
    col += color1 * glow * 0.15;

    // Intensity control
    col *= intensity;

    // Subtle vignette
    float vignette = 1.0 - length(uv * 0.4);
    col *= mix(0.7, 1.0, vignette);

    // Color grading
    col = pow(col, vec3(0.9));

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface VolumetricBeamsBackgroundProps {
  className?: string;
  intensity?: number;
  beamCount?: number;
}

export function VolumetricBeamsBackground({
  className = '',
  intensity = 0.8,
  beamCount = 50,
}: VolumetricBeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const mouseRef = useRef({ x: 0.0, y: 0.0 });
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vShader = createShader(gl.VERTEX_SHADER, vertexShader);
    const fShader = createShader(gl.FRAGMENT_SHADER, fragmentShader);

    if (!vShader || !fShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionLoc = gl.getAttribLocation(program, 'position');
    const resolutionLoc = gl.getUniformLocation(program, 'resolution');
    const timeLoc = gl.getUniformLocation(program, 'time');
    const mouseLoc = gl.getUniformLocation(program, 'mouse');
    const color1Loc = gl.getUniformLocation(program, 'color1');
    const color2Loc = gl.getUniformLocation(program, 'color2');
    const color3Loc = gl.getUniformLocation(program, 'color3');
    const intensityLoc = gl.getUniformLocation(program, 'intensity');
    const beamCountLoc = gl.getUniformLocation(program, 'beamCount');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Theme-aware colors - Warm orange/amber palette for volumetric light
    const darkColors = {
      color1: [1.0, 0.6, 0.2],   // Warm orange
      color2: [1.0, 0.75, 0.3],  // Amber
      color3: [1.0, 0.85, 0.5],  // Light yellow
    };

    const lightColors = {
      color1: [1.0, 0.65, 0.25], // Orange
      color2: [1.0, 0.78, 0.35], // Amber
      color3: [1.0, 0.88, 0.55], // Yellow
    };

    const colors = theme === 'dark' ? darkColors : lightColors;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let x, y;

      if ('touches' in e && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      } else {
        return;
      }

      // Smooth mouse movement with lerp
      const targetX = ((x - rect.left) / rect.width - 0.5) * 2.0;
      const targetY = ((y - rect.top) / rect.height - 0.5) * 2.0;

      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.1;
    };

    const render = () => {
      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      gl.useProgram(program);

      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);

      gl.uniform3fv(color1Loc, colors.color1);
      gl.uniform3fv(color2Loc, colors.color2);
      gl.uniform3fv(color3Loc, colors.color3);

      gl.uniform1f(intensityLoc, intensity);
      gl.uniform1f(beamCountLoc, beamCount);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleMouseMove, { passive: true });

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);

      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(buffer);
    };
  }, [theme, intensity, beamCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
