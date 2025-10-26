'use client';

import { ButtonGradient } from '@/components/ui/button-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { channelInfo } from '@/lib/content-client';
import { Code, BrainCircuit, Rocket, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Typewriter } from '@/components/ui/typewriter';
import { SplineScene } from '@/components/ui/spline-scene';

export default function Home() {
  return (
    <>
      {/* Hero Section with 3D Robot - Fully Responsive */}
      <section className="w-full min-h-screen h-screen relative overflow-hidden bg-black/[0.96]">
        {/* Spline 3D Scene - Responsive */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Overlay - Responsive Text & Buttons */}
        <div className="relative z-10 flex items-center justify-center min-h-screen h-full bg-gradient-to-t from-black/60 via-transparent to-transparent px-4 sm:px-6 lg:px-8">
          <div className="text-center w-full max-w-7xl mx-auto py-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black font-headline mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
              Welcome to the Future
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/80 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 max-w-4xl mx-auto px-4">
              Explore the intersection of AI and innovation
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 px-4">
              <Link href="/youtube" className="w-full sm:w-auto">
                <ButtonGradient className="w-full sm:w-auto min-w-[200px]" icon={<Rocket className="w-3.5 h-3.5" />}>
                  Begin Exploration
                </ButtonGradient>
              </Link>
              <Link href="/socials" className="w-full sm:w-auto">
                <ButtonGradient className="w-full sm:w-auto min-w-[200px]" icon={<Users className="w-3.5 h-3.5" />}>
                  Join the Collective
                </ButtonGradient>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 animate-in fade-in duration-500">
      <section className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="https://avatars.githubusercontent.com/u/223625668?s=400&u=3760cffbf5cec0e95bc14deac3725202dfa2eb8e&v=4"
            alt="NextGenXplorer Logo"
            width={200}
            height={200}
            className="mb-4 sm:mb-6 rounded-full w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52"
            data-ai-hint="logo"
            priority
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black font-headline mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            NextGenXplorer
          </h1>
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 min-h-[2.5rem] sm:min-h-[3rem] flex flex-wrap items-center justify-center px-4">
            <span className="mr-2">Exploring</span>
            <Typewriter
              text={[
                "Artificial Intelligence",
                "Quantum Computing",
                "Space Technology",
                "Future Innovations",
                "Tomorrow's Technology"
              ]}
              speed={70}
              className="text-primary font-semibold"
              waitTime={2000}
              deleteSpeed={40}
              cursorChar="_"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <BrainCircuit className="mr-3 text-primary h-8 w-8" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{channelInfo.goal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Code className="mr-3 text-accent h-8 w-8" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{channelInfo.about}</p>
          </CardContent>
        </Card>
      </section>
    </div>
    </>
  );
}

