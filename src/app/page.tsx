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
      {/* Hero Section */}
      <section className="w-full h-screen relative bg-gradient-to-b from-background via-background/95 to-background flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black font-headline mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            Welcome to the Future
          </h2>
          <p className="text-xl md:text-3xl text-muted-foreground mb-8">
            Explore the intersection of AI and innovation
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <section className="text-center mb-16 md:mb-24">
        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="https://avatars.githubusercontent.com/u/223625668?s=400&u=3760cffbf5cec0e95bc14deac3725202dfa2eb8e&v=4"
            alt="NextGenXplorer Logo"
            width={200}
            height={200}
            className="mb-4 rounded-full"
            data-ai-hint="logo"
            priority
          />
          <h1 className="text-fluid-h1 font-black font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            NextGenXplorer
          </h1>
          <div className="text-fluid-p text-muted-foreground max-w-3xl mx-auto mb-8 min-h-[3rem] flex items-center justify-center">
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
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/youtube">
              <ButtonGradient className="w-full md:w-auto" icon={<Rocket className="w-3.5 h-3.5" />}>
                Begin Exploration
              </ButtonGradient>
            </Link>
            <Link href="/socials">
              <ButtonGradient className="w-full md:w-auto" icon={<Users className="w-3.5 h-3.5" />}>
                Join the Collective
              </ButtonGradient>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
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

