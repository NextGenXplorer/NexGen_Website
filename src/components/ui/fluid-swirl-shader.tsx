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
  uniform float speed;

  varying vec2 vUv;

  #define PI 3.14159265359
  #define SPIN_EASE 1.0

  vec2 polar_coords(vec2 uv, vec2 center, float zoom, float repeat) {
    vec2 dir = uv - center;
    float radius = length(dir) * 2.0;
    float angle = atan(dir.y, dir.x) * 1.0 / (PI * 2.0);
    return mod(vec2(radius * zoom, angle * repeat), 1.0);
  }

  vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / 700.0;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy);
    float uv_len = length(uv);

    float spinSpeed = (time * speed * SPIN_EASE * 0.2) + 302.2;
    float new_pixel_angle = atan(uv.y, uv.x) + spinSpeed - SPIN_EASE * 20.0 * (intensity * uv_len + (1.0 - intensity));
    vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

    uv *= 30.0;
    float animSpeed = time * speed;
    vec2 uv2 = vec2(uv.x + uv.y);

    for(int i = 0; i < 5; i++) {
      uv2 += sin(max(uv.x, uv.y)) + uv;
      uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + animSpeed * 0.131121), sin(uv2.x - 0.113 * animSpeed));
      uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
    }

    float contrast_mod = (0.25 * 2.0 + 0.5 * intensity + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);

    vec3 ret_col = (0.3 / 2.0) * color1 +
                   (1.0 - 0.3 / 2.0) * (color1 * c1p + color2 * c2p + color3 * c3p);

    return vec4(ret_col, 1.0);
  }

  void main() {
    vec2 coords = vUv;
    vec2 screenSize = resolution;
    vec2 screen_coords = coords * resolution;

    gl_FragColor = effect(screenSize, screen_coords);
  }
`;

interface FluidSwirlShaderProps {
  className?: string;
  intensity?: number;
  speed?: number;
}

export function FluidSwirlShader({
  className = '',
  intensity = 0.36,
  speed = 1.0,
}: FluidSwirlShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
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
    const speedLoc = gl.getUniformLocation(program, 'speed');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Theme-aware colors
    const darkColors = {
      color1: [1.0, 0.58, 0.0],  // Orange
      color2: [1.0, 0.75, 0.2],  // Amber
      color3: [1.0, 0.9, 0.4],   // Yellow
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

      mouseRef.current.x = (x - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (y - rect.top) / rect.height;
    };

    const render = () => {
      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      // Clear with transparency
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);

      gl.uniform3fv(color1Loc, colors.color1);
      gl.uniform3fv(color2Loc, colors.color2);
      gl.uniform3fv(color3Loc, colors.color3);

      gl.uniform1f(intensityLoc, intensity);
      gl.uniform1f(speedLoc, speed);

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
  }, [theme, intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
