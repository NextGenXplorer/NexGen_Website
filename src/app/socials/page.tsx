import { SocialCard } from '@/components/social-card';
import { authors, socials } from '@/lib/content';

export default function SocialsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Connect With Us
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Follow our journey and join the conversation on your favorite platforms.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {socials.map((social) => (
          <SocialCard key={social.name} social={social} />
        ))}
      </div>

      <div className="text-center my-12 md:my-16">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
          Authors & Maintainers
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          The team behind NextGenXplorer.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {authors.map((author) => (
          <SocialCard key={author.name} social={author} />
        ))}
      </div>
    </div>
  );
}
