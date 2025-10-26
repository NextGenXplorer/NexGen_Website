'use client';

import { Typewriter } from '@/components/ui/typewriter';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          <Typewriter
            text={[
              "About Us",
              "Our Story",
              "Our Mission",
              "Our Vision"
            ]}
            speed={70}
            className="text-primary"
            waitTime={3000}
            deleteSpeed={40}
            cursorChar="|"
          />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn more about our mission, vision, and the team behind NextGenXplorer.
        </p>
      </div>
      <div className="max-w-4xl mx-auto text-muted-foreground">
        <p>
          Welcome to NextGenXplorer! We are dedicated to exploring the future of technology and sharing our discoveries with the world. Our passion is to dive deep into emerging trends, groundbreaking innovations, and the digital frontier.
        </p>
        <br />
        <p>
          Our mission is to make complex technological concepts accessible and exciting for everyone. We believe that by understanding the technology of tomorrow, we can all be better prepared for the future.
        </p>
      </div>
    </div>
  );
}
