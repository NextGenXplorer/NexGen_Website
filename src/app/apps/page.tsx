'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Typewriter } from '@/components/ui/typewriter';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

interface App {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  downloadUrl: string;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/apps');
        if (!response.ok) throw new Error('Failed to fetch apps');
        const data = await response.json();
        setApps(data);
      } catch (error) {
        console.error('Failed to load apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  const handleDownload = (app: App) => {
    window.open(app.downloadUrl, '_blank');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <ContainerScroll
        titleComponent={
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4">
              <Typewriter
                text={[
                  "Our Apps",
                  "Download Tools",
                  "Mobile Apps",
                  "Get Started"
                ]}
                speed={70}
                className="text-primary"
                waitTime={3000}
                deleteSpeed={40}
                cursorChar="|"
              />
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Download our apps and tools
            </p>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Spinner className="h-8 w-8" />
          </div>
        ) : apps.length > 0 ? (
          <div className="h-full w-full overflow-auto flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-7xl mx-auto">
              {apps.map((app) => (
                <Card key={app.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-background/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={app.logoUrl}
                        alt={app.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <CardTitle className="text-xl">{app.name}</CardTitle>
                    </div>
                    {app.description && (
                      <CardDescription>{app.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleDownload(app)}
                      className="w-full"
                      size="lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
            <p className="text-xl text-muted-foreground mb-2">No apps available yet</p>
            <p className="text-sm text-muted-foreground">Check back later for updates</p>
          </div>
        )}
      </ContainerScroll>
    </div>
  );
}
