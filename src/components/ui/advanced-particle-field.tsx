'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

const vertexShader = `
  attribute vec3 position;
  attribute vec3 velocity;
  attribute float size;
  attribute float life;

  uniform mat4 projection;
  uniform mat4 view;
  uniform float time;
  uniform vec2 mouse;

  varying float vLife;
  varying vec3 vPosition;

  void main() {
    vLife = life;
    vPosition = position;

    // Particle position with time-based animation
    vec3 pos = position + velocity * time;

    // Mouse attraction/repulsion
    vec3 mousePos = vec3(mouse * 2.0, 0.0);
    vec3 toMouse = mousePos - pos;
    float mouseDist = length(toMouse);
    if (mouseDist < 3.0) {
      pos += normalize(toMouse) * (3.0 - mouseDist) * 0.1;
    }

    // Orbital rotation
    float angle = time * 0.1;
    mat3 rotation = mat3(
      cos(angle), 0.0, sin(angle),
      0.0, 1.0, 0.0,
      -sin(angle), 0.0, cos(angle)
    );
    pos = rotation * pos;

    vec4 mvPosition = view * vec4(pos, 1.0);
    gl_Position = projection * mvPosition;

    // Size attenuation based on distance
    float dist = length(mvPosition.xyz);
    gl_PointSize = size * (300.0 / dist) * life;
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float time;

  varying float vLife;
  varying vec3 vPosition;

  void main() {
    // Circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    if (dist > 0.5) discard;

    // Smooth edges
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

    // Color based on position and life
    vec3 color = mix(color1, color2, vPosition.y * 0.5 + 0.5);
    color = mix(color, color3, vLife);

    // Pulsing effect
    float pulse = sin(time * 2.0 + vPosition.x * 10.0) * 0.3 + 0.7;
    color *= pulse;

    // Glow effect
    float glow = 1.0 - dist * 2.0;
    color += color3 * glow * 0.3;

    gl_FragColor = vec4(color, alpha * vLife * 0.8);
  }
`;

interface ParticleData {
  positions: Float32Array;
  velocities: Float32Array;
  sizes: Float32Array;
  lives: Float32Array;
}

function createParticles(count: number): ParticleData {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const lives = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Spherical distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 2 + Math.random() * 3;

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Outward velocities with some randomness
    const speed = 0.01 + Math.random() * 0.02;
    velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
    velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
    velocities[i3 + 2] = Math.cos(phi) * speed;

    sizes[i] = 5 + Math.random() * 15;
    lives[i] = Math.random();
  }

  return { positions, velocities, sizes, lives };
}

function createMatrix4(): Float32Array {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

function setPerspective(out: Float32Array, fov: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fov / 2);
  const nf = 1 / (near - far);

  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
}

function setLookAt(out: Float32Array, eyeX: number, eyeY: number, eyeZ: number) {
  const z0 = -eyeX, z1 = -eyeY, z2 = -eyeZ;
  const len = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  const nz0 = z0 / len, nz1 = z1 / len, nz2 = z2 / len;

  const x0 = 0, x1 = 1, x2 = 0;
  const y0 = nz1 * x2 - nz2 * x1;
  const y1 = nz2 * x0 - nz0 * x2;
  const y2 = nz0 * x1 - nz1 * x0;

  const ylen = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  const ny0 = y0 / ylen, ny1 = y1 / ylen, ny2 = y2 / ylen;

  out[0] = ny1 * nz2 - ny2 * nz1;
  out[1] = ny2 * nz0 - ny0 * nz2;
  out[2] = ny0 * nz1 - ny1 * nz0;
  out[4] = ny0;
  out[5] = ny1;
  out[6] = ny2;
  out[8] = nz0;
  out[9] = nz1;
  out[10] = nz2;
  out[12] = -eyeX;
  out[13] = -eyeY;
  out[14] = -eyeZ;
}

interface AdvancedParticleFieldProps {
  className?: string;
  particleCount?: number;
}

export function AdvancedParticleField({
  className = '',
  particleCount = 2000,
}: AdvancedParticleFieldProps) {
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

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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

    // Get attribute and uniform locations
    const positionLoc = gl.getAttribLocation(program, 'position');
    const velocityLoc = gl.getAttribLocation(program, 'velocity');
    const sizeLoc = gl.getAttribLocation(program, 'size');
    const lifeLoc = gl.getAttribLocation(program, 'life');

    const projectionLoc = gl.getUniformLocation(program, 'projection');
    const viewLoc = gl.getUniformLocation(program, 'view');
    const timeLoc = gl.getUniformLocation(program, 'time');
    const mouseLoc = gl.getUniformLocation(program, 'mouse');
    const color1Loc = gl.getUniformLocation(program, 'color1');
    const color2Loc = gl.getUniformLocation(program, 'color2');
    const color3Loc = gl.getUniformLocation(program, 'color3');

    // Create particle data
    const particles = createParticles(particleCount);

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles.positions, gl.STATIC_DRAW);

    const velocityBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles.velocities, gl.STATIC_DRAW);

    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles.sizes, gl.STATIC_DRAW);

    const lifeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles.lives, gl.DYNAMIC_DRAW);

    // Theme-aware colors
    const darkColors = {
      color1: [1.0, 0.6, 0.0],   // Orange
      color2: [1.0, 0.75, 0.2],  // Amber
      color3: [1.0, 0.9, 0.5],   // Light Yellow
    };

    const lightColors = {
      color1: [1.0, 0.65, 0.1],  // Orange
      color2: [1.0, 0.78, 0.25], // Amber
      color3: [1.0, 0.88, 0.45], // Yellow
    };

    const colors = theme === 'dark' ? darkColors : lightColors;

    // Matrices
    const projection = createMatrix4();
    const view = createMatrix4();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);

      const aspect = canvas.width / canvas.height;
      setPerspective(projection, Math.PI / 4, aspect, 0.1, 100);
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

      const targetX = ((x - rect.left) / rect.width - 0.5) * 2.0;
      const targetY = -((y - rect.top) / rect.height - 0.5) * 2.0;

      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.05;
    };

    const render = () => {
      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      // Update particle lives
      for (let i = 0; i < particleCount; i++) {
        particles.lives[i] -= 0.003;
        if (particles.lives[i] <= 0) {
          particles.lives[i] = 1.0;
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, particles.lives, gl.DYNAMIC_DRAW);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Set camera
      const camX = Math.sin(currentTime * 0.1) * 8;
      const camY = Math.cos(currentTime * 0.15) * 3;
      const camZ = Math.cos(currentTime * 0.1) * 8;
      setLookAt(view, camX, camY, camZ);

      // Set uniforms
      gl.uniformMatrix4fv(projectionLoc, false, projection);
      gl.uniformMatrix4fv(viewLoc, false, view);
      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
      gl.uniform3fv(color1Loc, colors.color1);
      gl.uniform3fv(color2Loc, colors.color2);
      gl.uniform3fv(color3Loc, colors.color3);

      // Set attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
      gl.enableVertexAttribArray(velocityLoc);
      gl.vertexAttribPointer(velocityLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
      gl.enableVertexAttribArray(lifeLoc);
      gl.vertexAttribPointer(lifeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, particleCount);

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
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(velocityBuffer);
      gl.deleteBuffer(sizeBuffer);
      gl.deleteBuffer(lifeBuffer);
    };
  }, [theme, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
