'use client';

import { SocialCard } from '@/components/social-card';
import { authors, socials } from '@/lib/content-client';
import { Typewriter } from '@/components/ui/typewriter';

export default function SocialsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          <Typewriter
            text={[
              "Connect With Us",
              "Join Our Community",
              "Follow Our Journey",
              "Stay Connected"
            ]}
            speed={70}
            className="text-primary"
            waitTime={3000}
            deleteSpeed={40}
            cursorChar="|"
          />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Follow our journey and join the conversation on your favorite platforms.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {socials.map((social) => (
          <SocialCard key={social.name} social={social} />
        ))}
      </div>

      <div className="text-center my-12 md:my-16">
        <h2 className="text-fluid-h3 font-bold font-headline mb-4">
          Authors & Maintainers
        </h2>
        <p className="text-fluid-p text-muted-foreground max-w-3xl mx-auto">
          The team behind NextGenXplorer.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {authors.map((author) => (
          <SocialCard key={author.name} social={author} />
        ))}
      </div>
    </div>
  );
}
