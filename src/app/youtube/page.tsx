import { VideoCard } from '@/components/video-card';
import { socials } from '@/lib/content';
import { ButtonGradient } from '@/components/ui/button-gradient';
import { Youtube } from 'lucide-react';
import Link from 'next/link';
import { getVideos } from '@/lib/content';

export default async function YouTubePage() {
  const videos = await getVideos();

  const videoSummaries = videos.map((video) => {
    const summary = video.description
      ? video.description.slice(0, 150) + '...'
      : 'No description available.';
    return { id: video.id, summary };
  });

  const summariesMap = new Map(videoSummaries.map((s) => [s.id, s.summary]));
  const youtubeSocial = socials.find((s) => s.name === 'YouTube');

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-fluid-h2 font-bold font-headline mb-4">
          The Archives
        </h1>
        <p className="text-fluid-p text-muted-foreground max-w-3xl mx-auto">
          Explore our repository of deep dives into future-forward technologies and concepts.
        </p>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              summary={summariesMap.get(video.id) || ''}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
    </div>
  );
}
