import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { channelInfo } from '@/lib/content';
import { Code, BrainCircuit, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-500">
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
          <h1 className="text-5xl md:text-7xl font-black font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            NextGenXplorer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Charting the course of tomorrow's technology, today.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/youtube">
                <Rocket className="mr-2 h-5 w-5" /> Begin Exploration
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
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
  );
}
