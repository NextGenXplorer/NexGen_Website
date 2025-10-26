'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { channelInfo } from '@/lib/content';
import { Code, BrainCircuit, Rocket, Cpu, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Typewriter } from '@/components/ui/typewriter';
import { LightningSplit } from '@/components/ui/lightning-split';

export default function Home() {
  return (
    <>
      {/* Lightning Split Section - Full Screen Interactive */}
      <section className="w-full">
        <LightningSplit
          leftComponent={
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
              <div className="relative z-10 text-center px-8 max-w-2xl">
                <Code className="mx-auto h-24 w-24 text-blue-400 mb-6" />
                <h2 className="text-5xl md:text-6xl font-black font-headline mb-6 text-white">
                  Technology
                </h2>
                <p className="text-xl md:text-2xl text-blue-200 mb-4">
                  Cutting-edge innovations
                </p>
                <p className="text-lg text-blue-300/80">
                  Exploring AI, Quantum Computing, Space Tech, and the frontiers of human innovation
                </p>
              </div>
            </div>
          }
          rightComponent={
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-fuchsia-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#a855f710_1px,transparent_1px),linear-gradient(to_bottom,#a855f710_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
              <div className="relative z-10 text-center px-8 max-w-2xl">
                <Cpu className="mx-auto h-24 w-24 text-purple-400 mb-6" />
                <h2 className="text-5xl md:text-6xl font-black font-headline mb-6 text-white">
                  Future
                </h2>
                <p className="text-xl md:text-2xl text-purple-200 mb-4">
                  Tomorrow's possibilities
                </p>
                <p className="text-lg text-purple-300/80">
                  Decoding the technological forces reshaping our world and defining humanity's next chapter
                </p>
              </div>
            </div>
          }
        />
      </section>

      <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <section className="text-center mb-24 md:mb-32">
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
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/youtube">
                <Rocket className="mr-2 h-5 w-5" /> Begin Exploration
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
              <Link href="/socials">Join the Collective</Link>
            </Button>
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

