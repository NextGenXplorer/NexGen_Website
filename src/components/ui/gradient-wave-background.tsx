"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GradientWaveBackgroundProps {
  colors?: string[];
  className?: string;
  speed?: number;
  waveAmplitude?: number;
  interactive?: boolean;
}

export function GradientWaveBackground({
  colors,
  className = "",
  speed = 0.00001,
  waveAmplitude = 250,
  interactive = true,
}: GradientWaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Default colors based on your theme
  const defaultLightColors = ["#ff9500", "#ffffff", "#ff9500", "#ffffff"];
  const defaultDarkColors = ["#ff9500", "#1a1a1a", "#ff9500", "#1a1a1a"];

  const finalColors = colors || (theme === "dark" ? defaultDarkColors : defaultLightColors);

  useEffect(() => {
    if (!containerRef.current) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "wave-gradient");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");

    finalColors.forEach((color, i) => {
      const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", `${(i / (finalColors.length - 1)) * 100}%`);
      stop.setAttribute("style", `stop-color:${color};stop-opacity:1`);
      gradient.appendChild(stop);
    });

    defs.appendChild(gradient);
    svg.appendChild(defs);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "url(#wave-gradient)");

    let animationId: number;
    let time = 0;

    const animate = () => {
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;

      time += speed * 1000;

      const amplitude = waveAmplitude;
      const frequency = 0.002;

      let d = `M 0 ${height / 2}`;

      for (let x = 0; x <= width; x += 10) {
        const y = height / 2 + Math.sin(x * frequency + time) * amplitude;
        d += ` L ${x} ${y}`;
      }

      d += ` L ${width} ${height} L 0 ${height} Z`;
      path.setAttribute("d", d);

      animationId = requestAnimationFrame(animate);
    };

    svg.appendChild(path);
    containerRef.current.appendChild(svg);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (containerRef.current?.contains(svg)) {
        containerRef.current.removeChild(svg);
      }
    };
  }, [finalColors, speed, waveAmplitude, theme]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
    />
  );
}
