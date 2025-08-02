import {
  Card,
  CardContent,
} from '@/components/ui/card';
import type { SocialLink } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';


interface SocialCardProps {
  social: SocialLink;
}

export function SocialCard({ social }: SocialCardProps) {
  return (
    <a href={social.url} target="_blank" rel="noopener noreferrer" className="group block">
      <Card className="h-full border-border/50 hover:border-accent/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-accent/20">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <social.Icon className="h-16 w-16 mb-4 text-accent transition-transform duration-300 group-hover:scale-110" />
            <ArrowUpRight className="h-5 w-5 absolute top-0 right-0 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <p className="text-xl font-bold font-headline">{social.name}</p>
          <p className="text-muted-foreground">{social.handle}</p>
        </CardContent>
      </Card>
    </a>
  );
}
