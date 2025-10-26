'use client';

import { useState, useEffect } from 'react';
import { VideoCard } from '@/components/video-card';
import { socials } from '@/lib/content-client';
import { ButtonGradient } from '@/components/ui/button-gradient';
import { Youtube } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Typewriter } from '@/components/ui/typewriter';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  youtubeId: string;
}

export default function YouTubePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) throw new Error('Failed to fetch videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const videoSummaries = videos.map((video) => {
    const summary = video.description
      ? video.description.slice(0, 150) + '...'
      : 'No description available.';
    return { id: video.id, summary };
  });

  const summariesMap = new Map(videoSummaries.map((s) => [s.id, s.summary]));
  const youtubeSocial = socials.find((s) => s.name === 'YouTube');

  return (
    <div className="animate-in fade-in duration-500">
      <ContainerScroll
        titleComponent={
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4">
              <Typewriter
                text={[
                  "The Archives",
                  "Video Library",
                  "Tech Deep Dives",
                  "Future Forward"
                ]}
                speed={70}
                className="text-primary"
                waitTime={3000}
                deleteSpeed={40}
                cursorChar="|"
              />
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Explore our repository of deep dives into future-forward technologies and concepts.
            </p>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Spinner className="h-8 w-8" />
          </div>
        ) : videos.length > 0 ? (
          <div className="h-full w-full overflow-auto flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-7xl mx-auto">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  summary={summariesMap.get(video.id) || ''}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
            <p className="text-2xl text-muted-foreground mb-6">
              No videos available at the moment.
            </p>
            {youtubeSocial && (
              <a
                href={youtubeSocial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <ButtonGradient icon={<Youtube className="w-3.5 h-3.5" />}>
                  Subscribe on YouTube
                </ButtonGradient>
              </a>
            )}
          </div>
        )}
      </ContainerScroll>
    </div>
  );
}
