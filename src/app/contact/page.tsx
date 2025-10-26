'use client';

import { Typewriter } from '@/components/ui/typewriter';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          <Typewriter
            text={[
              "Contact Us",
              "Get In Touch",
              "Reach Out",
              "Say Hello"
            ]}
            speed={70}
            className="text-primary"
            waitTime={3000}
            deleteSpeed={40}
            cursorChar="|"
          />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We&apos;d love to hear from you. Reach out to us with any questions or feedback.
        </p>
      </div>
      <div className="max-w-4xl mx-auto text-muted-foreground">
        <p>
          You can reach us by email at <a href="mailto:nxgennxx@gmail.com" className="text-primary hover:underline">nxgennxx@gmail.com</a>.
        </p>
      </div>
    </div>
  );
            }
    
