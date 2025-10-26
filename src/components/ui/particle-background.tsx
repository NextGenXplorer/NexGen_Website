"use client"

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ParticleBackgroundProps {
  particleCount?: number;
  colors?: string[];
  animationDuration?: [number, number];
  containerSize?: string;
  particleWidth?: string;
  particleHeight?: string;
  className?: string;
}

export function ParticleBackground({
  gridSize = 500,
  containerSize = '100%',
  particleCount = 300,
  colors,
  animationDuration = [1, 3],
  particleWidth = '40%',
  particleHeight = '1px',
  className = '',
}: ParticleBackgroundProps & { gridSize?: number }) {
  const [particles, setParticles] = useState<any[]>([]);
  const { theme } = useTheme();

  // Default colors from your theme
  const defaultLightColors = ['#ff9500', '#f8f3d4', '#f6416c', '#ffde7d'];
  const defaultDarkColors = ['#ff9500', '#1a1a1a', '#ff6b6b', '#ffd93d'];

  const finalColors = colors || (theme === 'dark' ? defaultDarkColors : defaultLightColors);

  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  const randomColor = () => finalColors[Math.floor(Math.random() * finalColors.length)];
  const randomRotation = () => random(-180, 180);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      duration: random(animationDuration[0], animationDuration[1]),
      delay: -random(0.1, 2),
      rotateX: randomRotation(),
      rotateY: randomRotation(),
      rotateZ: randomRotation(),
      color: randomColor(),
      transparentStop: random(50, 100)
    }));
    setParticles(newParticles);
  }, [particleCount, animationDuration, finalColors, theme]);

  return (
    <div
      className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden ${className}`}
      style={{
        perspective: '10vmin'
      }}
    >
      <div
        className="relative grid place-items-center"
        style={{
          width: containerSize,
          height: containerSize,
          gridTemplateColumns: '1fr'
        }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-particle"
            style={{
              width: particleWidth,
              height: particleHeight,
              willChange: 'transform, opacity',
              transformStyle: 'preserve-3d',
              background: `linear-gradient(to left, ${particle.color}, transparent ${particle.transparentStop}%)`,
              animation: `move-particle-${particle.id} ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
              transformOrigin: '0 center',
              '--rotateX': `${particle.rotateX}deg`,
              '--rotateY': `${particle.rotateY}deg`,
              '--rotateZ': `${particle.rotateZ}deg`
            } as React.CSSProperties}
          />
        ))}
      </div>

      <style jsx>{`
        ${particles.map(particle => `
          @keyframes move-particle-${particle.id} {
            0% {
              transform: translateX(50%) rotateX(${particle.rotateX}deg) rotateY(${particle.rotateY}deg) rotateZ(${particle.rotateZ}deg) scale(2);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              transform: translateX(50%) rotateX(${particle.rotateX}deg) rotateY(${particle.rotateY}deg) rotateZ(${particle.rotateZ}deg) scale(0);
              opacity: 1;
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
