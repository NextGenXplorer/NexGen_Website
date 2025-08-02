import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { YouTubeVideo } from '@/lib/content';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface VideoCardProps {
  video: YouTubeVideo;
  summary: string;
}

export function VideoCard({ video, summary }: VideoCardProps) {
  return (
    <Link href={`/youtube/${video.id}`} className="group block">
      <Card className="h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={video.thumbnailUrl}
              alt={`Thumbnail for ${video.title}`}
              width={1280}
              height={720}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="futuristic technology"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-1">
          <CardTitle className="font-headline text-xl mb-2 line-clamp-2">
            {video.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-muted-foreground">
            {summary}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Badge variant="outline" className="flex items-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
            Watch Video
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
