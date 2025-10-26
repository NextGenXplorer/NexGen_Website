'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ButtonGradient } from '@/components/ui/button-gradient';
import { Spinner } from '@/components/ui/spinner';

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  youtubeId: string;
  relatedLinks?: { label: string; url: string }[];
}

export default function VideoPage() {
  const params = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) throw new Error('Failed to fetch videos');
        const videos = await response.json();
        const foundVideo = videos.find((v: Video) => v.id === params.id);

        if (foundVideo) {
          setVideo(foundVideo);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Failed to load video:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Video Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/youtube">
            <ButtonGradient icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Archives
            </ButtonGradient>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-500">
      <div className="mb-8">
        <Link href="/youtube">
          <ButtonGradient icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Archives
          </ButtonGradient>
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="aspect-video mb-6 rounded-lg overflow-hidden border shadow-lg shadow-primary/20">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            {video.title}
          </h1>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {video.description}
          </p>

          <div className="mt-6">
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ButtonGradient icon={<ExternalLink className="w-3.5 h-3.5" />}>
                Watch on YouTube
              </ButtonGradient>
            </a>
          </div>
        </div>
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                Related Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {video.relatedLinks && video.relatedLinks.length > 0 ? (
                <ul className="space-y-3">
                  {video.relatedLinks.map((link, index) => (
                    <li key={`${link.label}-${link.url}-${index}`}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No related links available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
