'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VideoCard } from '@/components/video-card';
import { socials } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  relatedLinks: { label: string; url: string }[];
}

export default function YouTubePage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosQuery = query(
          collection(db, 'videos'),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(videosQuery);
        const videosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as YouTubeVideo[];
        setVideos(videosData);
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
    <div className="container mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-fluid-h2 font-bold font-headline mb-4">
          The Archives
        </h1>
        <p className="text-fluid-p text-muted-foreground max-w-3xl mx-auto">
          Explore our repository of deep dives into future-forward technologies and concepts.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="large" />
        </div>
      ) : videos.length > 0 ? (
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
            <Button asChild size="lg">
              <a
                href={youtubeSocial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <youtubeSocial.Icon className="mr-2 h-5 w-5" />
                Subscribe on YouTube
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
