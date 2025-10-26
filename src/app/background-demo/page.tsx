"use client"

import { useState } from "react";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { GradientWaveBackground } from "@/components/ui/gradient-wave-background";
import { ParticleBackground } from "@/components/ui/particle-background";
import { PulsarGridBackground } from "@/components/ui/pulsar-grid-background";
import { NeuralVortexBackground } from "@/components/ui/neural-vortex-background";
import { GeometricDepthBackground } from "@/components/ui/geometric-depth-background";
import { NeutrinoShaderBackground } from "@/components/ui/neutrino-shader-background";
import { FluidSwirlShader } from "@/components/ui/fluid-swirl-shader";
import { NeonRaymarcherBackground } from "@/components/ui/neon-raymarcher-background";
import { VolumetricBeamsBackground } from "@/components/ui/volumetric-beams-background";
import { AdvancedParticleField } from "@/components/ui/advanced-particle-field";

export default function BackgroundDemo() {
  const [activeBackground, setActiveBackground] = useState<string>("neural");

  const backgrounds = [
    { id: "neural", name: "Neural Vortex", description: "WebGL neural network shader", tier: "Ultra" },
    { id: "neutrino", name: "Neutrino Shader", description: "Advanced particle shader", tier: "Ultra" },
    { id: "geometric", name: "Geometric Depth", description: "3D floating shapes", tier: "Ultra" },
    { id: "fluid", name: "Fluid Swirl", description: "Fluid simulation shader", tier: "Ultra" },
    { id: "raymarcher", name: "Neon Raymarcher", description: "3D fractal raymarching", tier: "Ultra" },
    { id: "volumetric", name: "Volumetric Beams", description: "God rays and atmospheric effects", tier: "Ultra" },
    { id: "particlefield", name: "Particle Field", description: "Advanced 3D particle system", tier: "Ultra" },
    { id: "grid", name: "Animated Grid", description: "Wavy grid with traveling lights", tier: "Advanced" },
    { id: "wave", name: "Gradient Wave", description: "Smooth animated gradient waves", tier: "Advanced" },
    { id: "particle", name: "3D Particles", description: "Floating 3D particle system", tier: "Advanced" },
    { id: "pulsar", name: "Pulsar Grid", description: "Interactive mouse-reactive dots", tier: "Advanced" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Renderers */}
      <div className="absolute inset-0 z-0">
        {activeBackground === "neural" && (
          <NeuralVortexBackground
            speed={0.001}
            interactive={true}
          />
        )}
        {activeBackground === "neutrino" && (
          <NeutrinoShaderBackground
            intensity={1.0}
            speed={1.0}
          />
        )}
        {activeBackground === "geometric" && (
          <GeometricDepthBackground />
        )}
        {activeBackground === "grid" && (
          <AnimatedGridBackground
            gridSize={40}
            lightSpeed={1.5}
            maxLights={8}
            primaryColor="255, 149, 0"
          />
        )}
        {activeBackground === "wave" && (
          <GradientWaveBackground
            speed={0.00005}
            waveAmplitude={300}
          />
        )}
        {activeBackground === "particle" && (
          <ParticleBackground
            particleCount={300}
            animationDuration={[1, 3]}
          />
        )}
        {activeBackground === "pulsar" && (
          <PulsarGridBackground gridSpacing={30} />
        )}
        {activeBackground === "fluid" && (
          <FluidSwirlShader
            intensity={0.36}
            speed={1.0}
          />
        )}
        {activeBackground === "raymarcher" && (
          <NeonRaymarcherBackground intensity={1.2} />
        )}
        {activeBackground === "volumetric" && (
          <VolumetricBeamsBackground
            intensity={0.8}
            beamCount={50}
          />
        )}
        {activeBackground === "particlefield" && (
          <AdvancedParticleField particleCount={2000} />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground drop-shadow-lg">
            Ultra-Advanced Tech Backgrounds
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from 11 advanced backgrounds featuring WebGL shaders, neural networks, raymarching, fluid simulation, and 3D effects.
          </p>

          {/* Background Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-12">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setActiveBackground(bg.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  activeBackground === bg.id
                    ? "border-primary bg-primary/10 shadow-lg scale-105"
                    : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50"
                }`}
              >
                {bg.tier === "Ultra" && (
                  <div className="inline-block px-2 py-1 mb-2 text-xs font-bold bg-primary text-primary-foreground rounded">
                    ULTRA
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2">{bg.name}</h3>
                <p className="text-sm text-muted-foreground">{bg.description}</p>
              </button>
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="font-semibold mb-2">WebGL Shaders</h3>
              <p className="text-sm text-muted-foreground">
                GPU-accelerated neural network and particle shaders
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold mb-2">Theme Integrated</h3>
              <p className="text-sm text-muted-foreground">
                Automatically adapts to your orange theme and dark/light mode
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">High Performance</h3>
              <p className="text-sm text-muted-foreground">
                Optimized WebGL/Canvas rendering at 60fps
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="font-semibold mb-2">Interactive</h3>
              <p className="text-sm text-muted-foreground">
                Mouse-reactive effects and scroll-based animations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
