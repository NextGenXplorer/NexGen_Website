'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { formatYoutubeUrl } from '@/lib/utils';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';

interface Video {
  id: string;
  youtubeUrl: string;
  relatedLinks: { label: string; url: string }[];
  isPublic?: boolean;
}

interface App {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  downloadUrl: string;
}

function AdminPanel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [relatedLinks, setRelatedLinks] = useState<{ label: string; url: string }[]>([
    { label: '', url: '' },
  ]);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Apps state
  const [apps, setApps] = useState<App[]>([]);
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [appLogoUrl, setAppLogoUrl] = useState('');
  const [appDownloadUrl, setAppDownloadUrl] = useState('');
  const [isUploadingApp, setIsUploadingApp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const fetchVisitorStats = useCallback(async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setVisitorCount(data.count);
    } catch (error) {
      console.error('Failed to load visitor stats:', error);
    }
  }, []);

  const getAuthHeader = useCallback(async (): Promise<HeadersInit> => {
    const headers: HeadersInit = {};
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [currentUser]);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = await getAuthHeader(); // ✅ Include admin token
      const response = await fetch('/api/videos', { headers });
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      setError('Failed to load videos.');
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeader]);

  const fetchApps = useCallback(async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch('/api/apps', { headers });
      if (!response.ok) throw new Error('Failed to fetch apps');
      const data = await response.json();
      setApps(data);
    } catch (error) {
      console.error('Failed to load apps:', error);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchVideos();
    fetchVisitorStats();
    fetchApps();
  }, [fetchVideos, fetchVisitorStats, fetchApps]);

  const handleAddLink = () => setRelatedLinks([...relatedLinks, { label: '', url: '' }]);

  const handleRemoveLink = (index: number) =>
    setRelatedLinks(relatedLinks.filter((_, i) => i !== index));

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...relatedLinks];
    newLinks[index][field] = value;
    setRelatedLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!youtubeUrl) {
      setError('YouTube URL is required.');
      return;
    }
    try {
      const headers = await getAuthHeader();
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          youtubeUrl,
          relatedLinks: relatedLinks.filter((l) => l.label && l.url),
          isPublic,
        }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to add video');
      }
      setYoutubeUrl('');
      setRelatedLinks([{ label: '', url: '' }]);
      setIsPublic(true);
      fetchVideos();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleDelete = async (videoId: string) => {
    setError(null);
    try {
      const headers = await getAuthHeader();
      const response = await fetch('/api/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ id: videoId }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to delete video');
      }
      fetchVideos();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!appName || !appLogoUrl || !appDownloadUrl) {
      setError('App name, logo URL, and download URL are required.');
      return;
    }
    setIsUploadingApp(true);
    try {
      const headers = await getAuthHeader();
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          name: appName,
          description: appDescription,
          logoUrl: appLogoUrl,
          downloadUrl: appDownloadUrl,
        }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to add app');
      }
      setAppName('');
      setAppDescription('');
      setAppLogoUrl('');
      setAppDownloadUrl('');
      fetchApps();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsUploadingApp(false);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    setError(null);
    try {
      const headers = await getAuthHeader();
      const response = await fetch('/api/apps', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ id: appId }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to delete app');
      }
      fetchApps();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <Button
        onClick={handleLogout}
        variant="outline"
        className="absolute top-4 right-4"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>

      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      {/* Visitor Stats */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Site Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Total Visitors:{" "}
            {visitorCount !== null ? (
              <span className="font-bold">{visitorCount}</span>
            ) : (
              <Spinner className="inline-block h-5 w-5" />
            )}
          </p>
        </CardContent>
      </Card>

      {/* Add New Video Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
              <Input
                id="youtubeUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(formatYoutubeUrl(e.target.value))}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Related Links</Label>
              {relatedLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 border rounded-lg"
                >
                  <Input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) =>
                      handleLinkChange(index, 'label', e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(index, 'url', e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddLink}>
                Add Another Link
              </Button>
            </div>

            {/* Public/Private toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label>{isPublic ? 'Public' : 'Private'}</Label>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Add Video</Button>
          </form>
        </CardContent>
      </Card>

      {/* Manage Videos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Videos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : videos.length > 0 ? (
            <ul className="space-y-4">
              {videos.map((video) => (
                <li
                  key={video.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline truncate"
                  >
                    {video.youtubeUrl}
                  </a>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(video.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No videos found. Add one above to get started.</p>
          )}
        </CardContent>
      </Card>

      {/* Add New App Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New App</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAppSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                type="text"
                placeholder="My App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appDescription">Description (Optional)</Label>
              <Input
                id="appDescription"
                type="text"
                placeholder="App description"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appLogoUrl">App Logo URL</Label>
              <Input
                id="appLogoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                value={appLogoUrl}
                onChange={(e) => setAppLogoUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appDownloadUrl">App Download URL</Label>
              <Input
                id="appDownloadUrl"
                type="url"
                placeholder="https://example.com/app.apk"
                value={appDownloadUrl}
                onChange={(e) => setAppDownloadUrl(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isUploadingApp}>
              {isUploadingApp ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Adding...
                </>
              ) : (
                'Add App'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Manage Apps */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Apps</CardTitle>
        </CardHeader>
        <CardContent>
          {apps.length > 0 ? (
            <ul className="space-y-4">
              {apps.map((app) => (
                <li
                  key={app.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={app.logoUrl}
                      alt={app.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">{app.name}</p>
                      {app.description && (
                        <p className="text-sm text-muted-foreground">
                          {app.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteApp(app.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No apps found. Add one above to get started.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap with admin guard
export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  );
    }
    
