'use client';

import { useState, useEffect } from 'react';
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

/**
 * AdminPanel — client-side admin UI for managing YouTube videos.
 *
 * Renders a protected admin interface that lists existing videos, lets an authenticated admin add new videos (YouTube URL, related links, public/private), delete videos, and sign out. The component subscribes to Firebase auth state to include the user's ID token as a Bearer Authorization header for API requests, fetches video data on mount, and refreshes the list after successful create/delete operations. Validation errors and server errors are surfaced via a local error state.
 */
function AdminPanel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [relatedLinks, setRelatedLinks] = useState<{ label: string; url: string }[]>([
    { label: '', url: '' },
  ]);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  const getAuthHeader = async (): Promise<HeadersInit> => {
    const headers: HeadersInit = {};
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchVideos = async () => {
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
  };

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
      <Card>
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
    </div>
  );
}

/**
     * Default admin page that enforces admin access and renders the admin UI.
     *
     * This component wraps the AdminPanel with AdminGuard to ensure only authorized
     * admin users can access the admin interface (add/delete videos, manage settings).
     */
export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  );
    }
    
