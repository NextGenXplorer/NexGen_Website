"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface NeutrinoShaderBackgroundProps {
  className?: string;
  intensity?: number;
  speed?: number;
}

export function NeutrinoShaderBackground({
  className = "",
  intensity = 1.0,
  speed = 1.0,
}: NeutrinoShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    let disposed = false;

    const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

    // Neutrino-style shader with theme colors
    const FRAG_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform int   iFrame;
uniform vec3  iColor1;
uniform vec3  iColor2;
uniform vec3  iColor3;
uniform float iIntensity;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2  r  = iResolution.xy;
    float t  = iTime;
    vec3  FC = vec3(fragCoord, t);
    vec4  o  = vec4(0.0);

    for (float i, z, d, s; i++ < 2e2; o += (cos(s + vec4(0.0, 2.0, 4.0, 0.0)) + 2.0) / d / s) {
        vec3 v = vec3(0.3, 0.7, 2.0);
        vec3 p = z * normalize(FC.rgb * 2.0 - r.xyy);
        vec3 a = normalize(cos(v - t + s));
        p.z += 9.0;
        a = a * dot(a, p) - cross(a, p);
        s = length(a);
        z += d = 0.03 + abs(length(sin(a * v + v) / v) - 2.0) / 7.0;
    }
    o = tanh(o * o / 2e6);

    // Apply theme colors
    vec3 color = o.rgb * iColor1 * iIntensity;
    color = mix(color, o.rgb * iColor2, 0.3);
    color += o.rgb * iColor3 * 0.2;

    fragColor = vec4(color, 1.0);
}

void main(){
  mainImage(fragColor, gl_FragCoord.xy);
}
`;

    // Shader compilation
    const safeCompile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
      const log = gl.getShaderInfoLog(sh) || "";
      return { shader: ok ? sh : null, log };
    };

    const safeLink = (vs: WebGLShader, fs: WebGLShader) => {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      const ok = gl.getProgramParameter(prog, gl.LINK_STATUS);
      const log = gl.getProgramInfoLog(prog) || "";
      return { program: ok ? prog : null, log };
    };

    const { shader: vs, log: vsLog } = safeCompile(gl.VERTEX_SHADER, VERT_SRC);
    if (!vs) {
      console.error(`Vertex compile error:\n${vsLog}`);
      return;
    }

    const { shader: fs, log: fsLog } = safeCompile(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!fs) {
      console.error(`Fragment compile error:\n${fsLog}`);
      gl.deleteShader(vs);
      return;
    }

    const { program, log: linkLog } = safeLink(vs, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!program) {
      console.error(`Program link error:\n${linkLog}`);
      return;
    }

    // Setup geometry
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");
    const uFrame = gl.getUniformLocation(program, "iFrame");
    const uColor1 = gl.getUniformLocation(program, "iColor1");
    const uColor2 = gl.getUniformLocation(program, "iColor2");
    const uColor3 = gl.getUniformLocation(program, "iColor3");
    const uIntensity = gl.getUniformLocation(program, "iIntensity");

    // Theme colors (RGB 0-1)
    const darkColors = {
      color1: [1.0, 0.58, 0.0], // Orange
      color2: [1.0, 0.75, 0.0], // Amber
      color3: [1.0, 0.9, 0.5],  // Light yellow
    };

    const lightColors = {
      color1: [1.0, 0.58, 0.0], // Orange
      color2: [1.0, 0.7, 0.2],  // Amber
      color3: [1.0, 0.85, 0.4], // Light yellow
    };

    const colors = theme === 'dark' ? darkColors : lightColors;

    const getDpr = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let resizeScheduled = false;
    const applySize = () => {
      resizeScheduled = false;
      if (disposed) return;
      const dpr = getDpr();

      const cssW = Math.max(1, canvas.clientWidth | 0);
      const cssH = Math.max(1, canvas.clientHeight | 0);
      const w = Math.max(1, Math.floor(cssW * dpr));
      const h = Math.max(1, Math.floor(cssH * dpr));

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const scheduleSize = () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(applySize);
    };

    const ro = new ResizeObserver(scheduleSize);
    ro.observe(canvas);
    scheduleSize();

    startRef.current = performance.now();
    frameRef.current = 0;

    const tick = (now: number) => {
      if (disposed) return;
      if (gl.isContextLost()) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const t = ((now - startRef.current) / 1000) * speed;
      frameRef.current += 1;

      try {
        gl.useProgram(program);
        if (resizeScheduled) applySize();
        const dpr = getDpr();
        const w = canvas.width;
        const h = canvas.height;

        uResolution && gl.uniform3f(uResolution, w, h, dpr);
        uTime && gl.uniform1f(uTime, t);
        uFrame && gl.uniform1i(uFrame, frameRef.current);
        uColor1 && gl.uniform3f(uColor1, colors.color1[0], colors.color1[1], colors.color1[2]);
        uColor2 && gl.uniform3f(uColor2, colors.color2[0], colors.color2[1], colors.color2[2]);
        uColor3 && gl.uniform3f(uColor3, colors.color3[0], colors.color3[1], colors.color3[2]);
        uIntensity && gl.uniform1f(uIntensity, intensity);

        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } catch (err) {
        console.error((err as Error)?.message ?? String(err));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      try {
        gl.deleteBuffer(vbo);
      } catch {}
      try {
        gl.deleteVertexArray(vao);
      } catch {}
    };
  }, [theme, intensity, speed]);

  return (
    <div className={`fixed inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
