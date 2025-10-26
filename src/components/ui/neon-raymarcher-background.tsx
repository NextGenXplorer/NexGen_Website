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

  varying vec2 vUv;

  #define PI 3.14159265359
  #define MAX_STEPS 100
  #define MAX_DIST 100.0
  #define SURF_DIST 0.001

  // Distance function for Menger Sponge fractal
  float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
  }

  float mengerSponge(vec3 p, int iterations) {
    float d = sdBox(p, vec3(1.0));
    float s = 1.0;

    for (int m = 0; m < 4; m++) {
      if (m >= iterations) break;

      vec3 a = mod(p * s, 2.0) - 1.0;
      s *= 3.0;
      vec3 r = abs(1.0 - 3.0 * abs(a));

      float da = max(r.x, r.y);
      float db = max(r.y, r.z);
      float dc = max(r.z, r.x);
      float c = (min(da, min(db, dc)) - 1.0) / s;

      d = max(d, c);
    }

    return d;
  }

  // Scene distance function
  float getDist(vec3 p) {
    float d = mengerSponge(p, 4);

    // Add rotating elements
    vec3 q = p;
    q.xz *= mat2(cos(time * 0.2), -sin(time * 0.2), sin(time * 0.2), cos(time * 0.2));
    q.yz *= mat2(cos(time * 0.3), -sin(time * 0.3), sin(time * 0.3), cos(time * 0.3));

    float sphere = length(q) - 0.5;
    d = min(d, sphere);

    return d;
  }

  // Normal calculation
  vec3 getNormal(vec3 p) {
    float d = getDist(p);
    vec2 e = vec2(0.001, 0.0);

    vec3 n = d - vec3(
      getDist(p - e.xyy),
      getDist(p - e.yxy),
      getDist(p - e.yyx)
    );

    return normalize(n);
  }

  // Raymarching
  float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;

    for (int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * dO;
      float dS = getDist(p);
      dO += dS;

      if (dO > MAX_DIST || abs(dS) < SURF_DIST) break;
    }

    return dO;
  }

  // Lighting
  float getLight(vec3 p) {
    vec3 lightPos = vec3(2.0 * sin(time * 0.5), 3.0, 2.0 * cos(time * 0.5));
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);

    float dif = clamp(dot(n, l), 0.0, 1.0);

    // Shadow
    float d = rayMarch(p + n * SURF_DIST * 2.0, l);
    if (d < length(lightPos - p)) dif *= 0.3;

    return dif;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= resolution.x / resolution.y;

    // Camera setup with mouse control
    vec3 ro = vec3(0.0, 0.0, -4.0 + mouse.y * 2.0);
    vec3 rd = normalize(vec3(uv.x + mouse.x * 0.5, uv.y, 1.0));

    // Rotate camera
    float angle = time * 0.1;
    ro.xz *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    rd.xz *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    // Raymarch
    float d = rayMarch(ro, rd);

    vec3 col = vec3(0.0);

    if (d < MAX_DIST) {
      vec3 p = ro + rd * d;
      float dif = getLight(p);

      // Fresnel effect
      vec3 n = getNormal(p);
      float fresnel = pow(1.0 - max(0.0, dot(-rd, n)), 3.0);

      // Color based on position and normal
      vec3 baseColor = mix(color1, color2, p.y * 0.5 + 0.5);
      baseColor = mix(baseColor, color3, fresnel);

      col = baseColor * dif * intensity;
      col += color3 * fresnel * 0.5;

      // Glow effect
      float glow = 1.0 - d / MAX_DIST;
      col += color2 * glow * 0.2;
    } else {
      // Background gradient
      float grad = length(uv) * 0.3;
      col = mix(color1 * 0.1, color2 * 0.05, grad);
    }

    // Vignette
    float vignette = 1.0 - length(uv * 0.5);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface NeonRaymarcherBackgroundProps {
  className?: string;
  intensity?: number;
}

export function NeonRaymarcherBackground({
  className = '',
  intensity = 1.2,
}: NeonRaymarcherBackgroundProps) {
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

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Theme-aware colors - Orange/Amber/Yellow palette for 3D effects
    const darkColors = {
      color1: [1.0, 0.58, 0.0],  // Orange
      color2: [1.0, 0.75, 0.2],  // Amber
      color3: [1.0, 0.9, 0.5],   // Light Yellow
    };

    const lightColors = {
      color1: [1.0, 0.58, 0.0],  // Orange
      color2: [1.0, 0.7, 0.1],   // Amber
      color3: [1.0, 0.85, 0.3],  // Yellow
    };

    const colors = theme === 'dark' ? darkColors : lightColors;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
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

      // Normalized mouse coordinates (-0.5 to 0.5)
      mouseRef.current.x = ((x - rect.left) / rect.width - 0.5) * 2.0;
      mouseRef.current.y = ((y - rect.top) / rect.height - 0.5) * 2.0;
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
  }, [theme, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
