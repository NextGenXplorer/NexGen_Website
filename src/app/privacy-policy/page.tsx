'use client';

import { Typewriter } from '@/components/ui/typewriter';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          <Typewriter
            text={[
              "Privacy Policy",
              "Your Privacy Matters",
              "Data Protection",
              "Privacy First"
            ]}
            speed={70}
            className="text-primary"
            waitTime={3000}
            deleteSpeed={40}
            cursorChar="|"
          />
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your privacy is important to us.
        </p>
      </div>
      <div className="max-w-4xl mx-auto text-muted-foreground">
        <p>
          This privacy policy explains how NextGenXplorer collects, uses, and protects your personal information. We are committed to ensuring that your privacy is protected.
        </p>
        <br />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mt-8 mb-4">Information We Collect</h2>
        <p>We may collect the following information:</p>
        <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
          <li>Name and contact information including email address</li>
          <li>Demographic information such as postcode, preferences and interests</li>
          <li>Other information relevant to customer surveys and/or offers</li>
        </ul>
        <br />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline mt-8 mb-4">How We Use Your Information</h2>
        <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
        <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
          <li>Internal record keeping.</li>
          <li>We may use the information to improve our products and services.</li>
          <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
        </ul>
      </div>
    </div>
  );
}
          
