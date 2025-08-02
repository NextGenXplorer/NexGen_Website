import { getVideoById, getVideos } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

interface VideoPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((video) => ({
    id: video.id,
  }));
}

export default async function VideoPage({ params }: VideoPageProps) {
  const video = await getVideoById(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-in fade-in duration-500">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/youtube">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Link>
        </Button>
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
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            {video.title}
          </h1>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {video.description}
          </p>
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
                  {video.relatedLinks.map((link) => (
                    <li key={`${link.label}-${link.url}`}>
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
