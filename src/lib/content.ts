import { Instagram, Github, Youtube, LucideIcon, Send } from 'lucide-react';
import content from '../data/content.json';
import { notFound } from 'next/navigation';
import { adminDb } from './firebase-admin';

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  relatedLinks: { label: string; url: string }[];
  createdAt: { seconds: number, nanoseconds: number };
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
};

const authorIconMap: { [key: string]: LucideIcon } = {
  dynamic_nithi_: Instagram,
  '_.appu_kannadiga': Instagram,
  'mithun.gowda.b': Instagram,
};

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
        const videosCollection = adminDb.collection('videos');
        // Order by creation date, newest first
        const snapshot = await videosCollection.orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YouTubeVideo));
    } catch (error) {
        console.error("Error fetching videos from Firestore:", error);
        return [];
    }
}

export async function getVideoById(id: string): Promise<YouTubeVideo> {
  try {
    const docRef = adminDb.collection('videos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        notFound();
    }

    return { id: doc.id, ...doc.data() } as YouTubeVideo;
  } catch (error) {
    console.error("Error fetching video by ID from Firestore:", error);
    notFound();
  }
}
