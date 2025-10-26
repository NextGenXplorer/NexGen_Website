import { Instagram, Github, Youtube, LucideIcon, Send, MessageCircle, Smartphone } from 'lucide-react';
import content from '../data/content.json';
import { notFound } from 'next/navigation';
import { adminDb } from './firebase-admin';

export interface VideoConfig {
  youtubeUrl: string;
  relatedLinks: { label: string; url: string }[];
}

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  relatedLinks: { label: string; url: string }[];
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  Icon: LucideIcon;
}

const iconMap: { [key: string]: LucideIcon } = {
  YouTube: Youtube,
  Instagram: Instagram,
  GitHub: Github,
  Telegram: Send,
  'Telegram Group': Send,
  'Telegram Channel': Send,
  'WhatsApp Channel': MessageCircle,
  'Google Play Store': Smartphone,
};

const authorIconMap: { [key: string]: LucideIcon } = {
  dynamic_nithi_: Instagram,
  '_.appu_kannadiga': Instagram,
  'mithun.gowda.b': Instagram,
};

function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v=)|(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v%3D))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

async function fetchYouTubeDetails(video: VideoConfig): Promise<YouTubeVideo | null> {
  const youtubeId = getYouTubeId(video.youtubeUrl);

  if (!youtubeId) {
    console.error('Invalid YouTube URL, missing video ID:', video.youtubeUrl);
    return {
      ...video,
      id: 'invalid-video-id-' + Math.random(),
      youtubeId: 'invalid-video-id',
      title: 'Invalid YouTube URL',
      description:
        'The provided YouTube URL could not be parsed. Please check the format.',
      thumbnailUrl: `https://placehold.co/1280x720.png`,
    };
  }

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
    );

    if (!response.ok) {
      console.error('Failed to fetch video data for', video.youtubeUrl);
      return {
        ...video,
        id: youtubeId,
        youtubeId,
        title: 'Video Title Unavailable',
        description:
          'Could not load video details. The video may be private or have embedding disabled.',
        thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
      };
    }

    const data = await response.json();

    return {
      ...video,
      id: youtubeId,
      youtubeId,
      title: data.title,
      description: data.title, // oEmbed doesn't provide full description
      thumbnailUrl: data.thumbnail_url.replace('hqdefault.jpg', 'maxresdefault.jpg'),
    };
  } catch (error) {
    console.error('Error fetching video details for', video.youtubeUrl, error);
    return {
      ...video,
      id: youtubeId,
      youtubeId,
      title: 'Video Title Unavailable',
      description: 'An error occurred while trying to load video details.',
      thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
    };
  }
}

export const channelInfo = content.channelInfo;

export const socials: SocialLink[] = content.socials.map((social) => ({
  ...social,
  Icon: iconMap[social.name] || Instagram,
}));

export const authors: SocialLink[] = content.authors.map((author) => ({
  ...author,
  Icon: authorIconMap[author.name] || Instagram,
}));

export async function getVideos(): Promise<YouTubeVideo[]> {
  try {
    const snapshot = await adminDb
      .collection('videos')
      .orderBy('createdAt', 'desc')
      .get();

    const videoPromises = snapshot.docs.map((doc) => {
      const data = doc.data() as VideoConfig;
      return fetchYouTubeDetails(data);
    });

    const resolvedVideos = await Promise.all(videoPromises);
    return resolvedVideos.filter((v): v is YouTubeVideo => v !== null);
  } catch (err) {
    console.error('Error fetching videos:', err);
    return [];
  }
}

export async function getVideoById(id: string): Promise<YouTubeVideo> {
  const videos = await getVideos();
  const video = videos.find((v) => v.id === id);
  if (!video) {
    notFound();
  }
  return video;
      }
      
