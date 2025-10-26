# Advanced Animated Tech Backgrounds

## Overview

Four advanced animated background components fully integrated with your NextGenXplorer theme, featuring automatic dark mode support and your orange color scheme.

## Components

### 1. AnimatedGridBackground 🌊
**Best for:** Main landing pages, hero sections
**Effect:** Wavy 3D grid with traveling light particles

```tsx
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";

<div className="relative h-screen">
  <AnimatedGridBackground
    gridSize={40}
    lightSpeed={1.5}
    maxLights={8}
    primaryColor="255, 149, 0" // Your theme orange
    secondaryColor="168, 85, 247"
  />
  <div className="relative z-10">Your content here</div>
</div>
```

**Props:**
- `gridSize` - Grid cell size (default: 40)
- `lightSpeed` - Speed of traveling lights (default: 1.5)
- `maxLights` - Maximum concurrent lights (default: 8)
- `lightSpawnRate` - Frequency of new lights (default: 0.02)
- `primaryColor` - RGB string for light color
- `gridColor` - Custom grid line color

---

### 2. GradientWaveBackground 🌈
**Best for:** Section backgrounds, smooth transitions
**Effect:** Animated flowing gradient waves

```tsx
import { GradientWaveBackground } from "@/components/ui/gradient-wave-background";

<div className="relative h-screen">
  <GradientWaveBackground
    speed={0.00005}
    waveAmplitude={300}
  />
  <div className="relative z-10">Your content here</div>
</div>
```

**Props:**
- `colors` - Array of hex colors (auto-theme if not provided)
- `speed` - Animation speed (default: 0.00001)
- `waveAmplitude` - Wave height (default: 250)
- `interactive` - Mouse interaction (default: true)

**Auto-theme colors:**
- Light mode: `["#ff9500", "#ffffff", "#ff9500", "#ffffff"]`
- Dark mode: `["#ff9500", "#1a1a1a", "#ff9500", "#1a1a1a"]`

---

### 3. ParticleBackground ✨
**Best for:** Dynamic sections, tech showcases
**Effect:** 3D floating particles with rotation

```tsx
import { ParticleBackground } from "@/components/ui/particle-background";

<div className="relative h-screen">
  <ParticleBackground
    particleCount={300}
    animationDuration={[1, 3]}
  />
  <div className="relative z-10">Your content here</div>
</div>
```

**Props:**
- `particleCount` - Number of particles (default: 300)
- `colors` - Array of hex colors (auto-theme if not provided)
- `animationDuration` - [min, max] seconds (default: [1, 3])
- `particleWidth` - Particle width (default: "40%")
- `particleHeight` - Particle height (default: "1px")

**Auto-theme colors:**
- Light mode: `['#ff9500', '#f8f3d4', '#f6416c', '#ffde7d']`
- Dark mode: `['#ff9500', '#1a1a1a', '#ff6b6b', '#ffd93d']`

---

### 4. PulsarGridBackground 🎯
**Best for:** Interactive sections, mouse-reactive areas
**Effect:** Mouse-reactive pulsing dot grid

```tsx
import { PulsarGridBackground } from "@/components/ui/pulsar-grid-background";

<PulsarGridBackground gridSpacing={30}>
  <h1>Your content with interactive background</h1>
</PulsarGridBackground>
```

**Props:**
- `gridSpacing` - Space between dots (default: 30)
- `backgroundColor` - Background color (auto-theme if not provided)
- `dotColor` - Dot color (default: theme orange)
- `children` - Content to overlay

**Features:**
- Mouse interaction creates wave effects
- Smooth pulsing animation
- Automatic theme integration

---

## Integration Examples

### Homepage Hero
```tsx
// src/app/page.tsx
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";

export default function Home() {
  return (
    <section className="relative h-screen">
      <AnimatedGridBackground />
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-6xl font-bold">NextGenXplorer</h1>
      </div>
    </section>
  );
}
```

### About Section with Particles
```tsx
import { ParticleBackground } from "@/components/ui/particle-background";

export function AboutSection() {
  return (
    <section className="relative min-h-screen py-20">
      <ParticleBackground particleCount={200} />
      <div className="relative z-10 container mx-auto">
        {/* Your about content */}
      </div>
    </section>
  );
}
```

### Interactive Contact Section
```tsx
import { PulsarGridBackground } from "@/components/ui/pulsar-grid-background";

export function ContactSection() {
  return (
    <PulsarGridBackground>
      <div className="container mx-auto py-20">
        {/* Contact form */}
      </div>
    </PulsarGridBackground>
  );
}
```

---

## Layout Integration (Full Page Background)

### Option 1: Layout-level Background
```tsx
// src/app/layout.tsx
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {/* Replace the simple grid with animated background */}
          <AnimatedGridBackground className="fixed inset-0 z-[-1]" />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Option 2: Page-specific Backgrounds
Different background per page:

```tsx
// src/app/page.tsx - Home with grid
<AnimatedGridBackground />

// src/app/about/page.tsx - About with particles
<ParticleBackground />

// src/app/contact/page.tsx - Contact with pulsar
<PulsarGridBackground />
```

---

## Performance Tips

1. **One background per page** - Don't stack multiple animated backgrounds
2. **Adjust particle count** - Reduce for mobile: `particleCount={150}`
3. **Use className for positioning** - Add `fixed inset-0 z-[-1]` for full-page
4. **Disable during development** - Wrap in condition if needed

```tsx
{process.env.NODE_ENV === 'production' && <AnimatedGridBackground />}
```

---

## Theme Customization

All backgrounds automatically use your theme colors, but you can override:

```tsx
// Use custom colors
<AnimatedGridBackground
  primaryColor="255, 0, 100" // Pink
  gridColor="#333333"
/>

// Use different colors per theme
import { useTheme } from "next-themes";

const { theme } = useTheme();
<GradientWaveBackground
  colors={theme === "dark"
    ? ["#ff0000", "#000000"]
    : ["#00ff00", "#ffffff"]
  }
/>
```

---

## Demo Page

View all backgrounds in action:
```bash
npm run dev
```
Visit: `http://localhost:9002/background-demo`

---

## Next Steps

1. **Replace simple grid** in `layout.tsx:43` with `<AnimatedGridBackground />`
2. **Choose per-section backgrounds** for different pages
3. **Customize colors** to match specific sections
4. **Adjust performance** based on target devices

## Support

All components are:
- ✅ TypeScript ready
- ✅ Dark mode compatible
- ✅ Responsive
- ✅ Performance optimized
- ✅ Theme integrated
