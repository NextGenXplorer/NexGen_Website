'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { cn } from '@/lib/utils';
import React from 'react';
import { ThemeToggle } from '../theme-toggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/youtube', label: 'Archives' },
  { href: '/apps', label: 'Apps' },
  { href: '/socials', label: 'Socials' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'sm';
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const NavContent = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant="link" asChild>
          <Link
            href={link.href}
            className={cn(
              'text-base md:text-lg text-foreground/80 hover:text-foreground',
              pathname === link.href && 'text-primary font-semibold'
            )}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-md animate-slide-down">
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Image
            src="https://avatars.githubusercontent.com/u/223625668?s=400&u=3760cffbf5cec0e95bc14deac3725202dfa2eb8e&v=4"
            alt="NextGenXplorer Logo"
            width={48}
            height={48}
            className="rounded-full"
            data-ai-hint="logo"
            priority
          />
          <span className="text-xl font-bold font-headline">NextGenX</span>
        </Link>
        {isMobile ? (
          <>
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 justify-center text-center">
                    <Image
                      src="https://avatars.githubusercontent.com/u/223625668?s=400&u=3760cffbf5cec0e95bc14deac3725202dfa2eb8e&v=4"
                      alt="NextGenXplorer Logo"
                      width={40}
                      height={40}
                      className="rounded-full"
                      data-ai-hint="logo"
                    />
                    <span className="text-lg font-bold font-headline">NextGenX</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col items-center gap-4 mt-8">
                  <NavContent />
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <nav className="flex items-center gap-4">
            <NavContent />
            <ThemeToggle />
          </nav>
        )}
      </div>
    </header>
  );
}
