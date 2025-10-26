'use client';

import { Typewriter } from '@/components/ui/typewriter';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          <Typewriter
            text={[
              "Terms and Conditions",
              "User Agreement",
              "Service Terms",
              "Legal Terms"
            ]}
            speed={70}
            className="text-primary"
            waitTime={3000}
            deleteSpeed={40}
            cursorChar="|"
          />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Please read these terms and conditions carefully before using our service.
        </p>
      </div>
      <div className="max-w-4xl mx-auto text-muted-foreground">
        <p>
          Welcome to NextGenXplorer! These terms and conditions outline the rules and regulations for the use of our website.
        </p>
        <br />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mt-8 mb-4">1. Introduction</h2>
        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use NextGenXplorer if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        <br />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mt-8 mb-4">2. Intellectual Property Rights</h2>
        <p>
          Other than the content you own, under these Terms, NextGenXplorer and/or its licensors own all the intellectual property rights and materials contained in this Website.
        </p>
      </div>
    </div>
  );
}
      
