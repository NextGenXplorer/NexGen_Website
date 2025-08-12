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

function getYouTubeId(url: string): string | null {
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v=)|(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v%3D))([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
}

async function fetchAndEnrichVideo(doc: FirebaseFirestore.QueryDocumentSnapshot): Promise<YouTubeVideo> {
    const videoData = doc.data() as Partial<YouTubeVideo>;
    const docId = doc.id;

    // If title exists, data is already enriched. Return it as is.
    if (videoData.title && videoData.thumbnailUrl) {
        return { id: docId, ...videoData } as YouTubeVideo;
    }

    // Data is incomplete, fetch from YouTube and update Firestore
    const youtubeId = getYouTubeId(videoData.youtubeUrl || '');
    if (!youtubeId) {
        // Return what we have if the URL is invalid
        return { id: docId, ...videoData, title: 'Invalid URL', description: '', thumbnailUrl: '' } as YouTubeVideo;
    }

    try {
        console.log(`Enriching video data for: ${youtubeId}`);
        const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);
        if (!oembedResponse.ok) {
            throw new Error('Failed to fetch video details from YouTube oEmbed API.');
        }
        const oembedData = await oembedResponse.json();

        const enrichedData = {
            ...videoData,
            youtubeId,
            title: oembedData.title,
            description: oembedData.title,
            thumbnailUrl: oembedData.thumbnail_url.replace('hqdefault.jpg', 'maxresdefault.jpg'),
        };

        // Update the document in Firestore with the enriched data
        await adminDb.collection('videos').doc(docId).update(enrichedData);

        return { id: docId, ...enrichedData } as YouTubeVideo;

    } catch (error) {
        console.error(`Failed to enrich video ${docId}:`, error);
        // Return the original data on failure to avoid crashing the page
        return { id: docId, ...videoData, title: 'Details Unavailable', description: '', thumbnailUrl: '' } as YouTubeVideo;
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
        const videosCollection = adminDb.collection('videos');
        const snapshot = await videosCollection.orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }

        // Process all videos, enriching them if necessary
        const videoPromises = snapshot.docs.map(fetchAndEnrichVideo);
        const resolvedVideos = await Promise.all(videoPromises);

        return resolvedVideos;

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

    // Enrich the single video if needed
    const enrichedVideo = await fetchAndEnrichVideo(doc as FirebaseFirestore.QueryDocumentSnapshot);
    return enrichedVideo;

  } catch (error) {
    console.error("Error fetching video by ID from Firestore:", error);
    notFound();
  }
}
