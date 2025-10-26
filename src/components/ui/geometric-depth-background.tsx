"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface GeometricDepthBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  primaryColor?: string;
  accentColors?: string[];
}

function FloatingShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export function GeometricDepthBackground({
  children,
  className,
  primaryColor,
  accentColors,
}: GeometricDepthBackgroundProps) {
  const { theme } = useTheme();

  // Default colors based on theme
  const defaultLightColors = [
    "from-orange-500/[0.15]", // Primary orange
    "from-amber-500/[0.15]",
    "from-yellow-500/[0.15]",
    "from-orange-600/[0.15]",
    "from-amber-400/[0.15]",
  ];

  const defaultDarkColors = [
    "from-orange-500/[0.15]", // Primary orange
    "from-amber-500/[0.15]",
    "from-yellow-500/[0.12]",
    "from-orange-600/[0.18]",
    "from-amber-400/[0.12]",
  ];

  const gradients = accentColors || (theme === 'dark' ? defaultDarkColors : defaultLightColors);

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-background", className)}
    >
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.05] blur-3xl" />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient={gradients[0]}
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <FloatingShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient={gradients[1]}
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <FloatingShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient={gradients[2]}
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <FloatingShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient={gradients[3]}
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <FloatingShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient={gradients[4]}
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {children}

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
    </div>
  );
}
