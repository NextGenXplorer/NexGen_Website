import { socials } from '@/lib/content';
import Link from 'next/link';
import { Button } from '../ui/button';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-transparent mt-12">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://avatars.githubusercontent.com/u/223625668?s=400&u=3760cffbf5cec0e95bc14deac3725202dfa2eb8e&v=4"
              alt="NextGenXplorer Logo"
              width={40}
              height={40}
              className="rounded-full"
              data-ai-hint="logo"
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {year} All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <Button
              key={social.name}
              variant="ghost"
              size="icon"
              asChild
            >
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                <social.Icon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                <span className="sr-only">{social.name}</span>
              </a>
            </Button>
          ))}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
        </div>
        </div>
      </div>
    </footer>
  );
}
