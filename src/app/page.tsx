'use client';

import { ButtonGradient } from '@/components/ui/button-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { channelInfo } from '@/lib/content-client';
import { Code, BrainCircuit, Rocket, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Typewriter } from '@/components/ui/typewriter';
import { FluidSwirlShader } from '@/components/ui/fluid-swirl-shader';

export default function Home() {
  return (
    <>
      {/* Fluid Swirl Shader - Full Page Background */}
      <div className="fixed inset-0 z-[-1]">
        <FluidSwirlShader
          intensity={0.36}
          speed={1.0}
          className="!fixed !inset-0"
        />
      </div>

      {/* Hero Section - Full Page */}
      <section className="w-full h-screen relative overflow-hidden">
        {/* Gradient Overlay for Content Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-[1]" />

        {/* Content - Full Height Centered */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <div className="text-center w-full max-w-7xl mx-auto">
            {/* Logo */}
            <Image
              src="https://avatars.githubusercontent.com/u/223625668?s=400&u=3760cffbf5cec0e95bc14deac3725202dfa2eb8e&v=4"
              alt="NextGenXplorer Logo"
              width={200}
              height={200}
              className="mb-6 sm:mb-8 rounded-full w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 mx-auto animate-in fade-in duration-700"
              data-ai-hint="logo"
              priority
            />

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-headline mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
              NextGenXplorer
            </h1>

            {/* Typewriter Tagline */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-foreground mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 max-w-4xl mx-auto px-4 min-h-[3rem] sm:min-h-[4rem] flex flex-wrap items-center justify-center">
              <span className="mr-2 font-medium">Exploring</span>
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

            {/* CTA Buttons */}
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

      {/* Content Section with Background Overlay */}
      <div className="relative">
        {/* Semi-transparent background for readability */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 animate-in fade-in duration-500">

      <section className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-headline mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          <Typewriter
            text={[
              "Discover the Future",
              "Explore Innovation",
              "Embrace Technology",
              "Join the Revolution"
            ]}
            speed={70}
            className="text-primary"
            waitTime={3000}
            deleteSpeed={40}
            cursorChar="|"
          />
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Your gateway to cutting-edge technology and innovation
        </p>
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
      </div>
    </>
  );
}

