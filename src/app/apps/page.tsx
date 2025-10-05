'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

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
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Apps</h1>
        <p className="text-muted-foreground">
          Download our apps and tools
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner className="h-8 w-8" />
        </div>
      ) : apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-xl text-muted-foreground mb-2">No apps available yet</p>
          <p className="text-sm text-muted-foreground">Check back later for updates</p>
        </div>
      )}
    </div>
  );
}
