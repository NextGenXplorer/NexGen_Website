'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface Video {
  id: string;
  youtubeUrl: string;
  relatedLinks: { label: string; url: string }[];
}

function AdminPanel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [relatedLinks, setRelatedLinks] = useState<{ label: string; url: string }[]>([
    { label: '', url: '' },
  ]);
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

  const getAuthHeader = async () => {
    if (!currentUser) return {};
    const token = await currentUser.getIdToken();
    return { 'Authorization': `Bearer ${token}` };
  }

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/videos');
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
  const handleRemoveLink = (index: number) => setRelatedLinks(relatedLinks.filter((_, i) => i !== index));
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
        body: JSON.stringify({ youtubeUrl, relatedLinks: relatedLinks.filter(l => l.label && l.url) }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to add video');
      }
      setYoutubeUrl('');
      setRelatedLinks([{ label: '', url: '' }]);
      fetchVideos();
    } catch (error: any) {
      setError(error.message);
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
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
        <Button onClick={handleLogout} variant="outline" className="absolute top-4 right-4">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
        </Button>
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
      
      <Card className="mb-8">
        <CardHeader><CardTitle>Add New Video</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
              <Input id="youtubeUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required />
            </div>
            <div className="space-y-4">
              <Label>Related Links</Label>
              {relatedLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-4 p-2 border rounded-lg">
                  <Input type="text" placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(index, 'label', e.target.value)} className="flex-1" />
                  <Input type="url" placeholder="https://example.com" value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} className="flex-1" />
                  <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveLink(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddLink}>Add Another Link</Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Add Video</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Manage Videos</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center"><Spinner /></div> : videos.length > 0 ? (
            <ul className="space-y-4">
              {videos.map((video) => (
                <li key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{video.youtubeUrl}</a>
                  <Button variant="destructive" onClick={() => handleDelete(video.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                </li>
              ))}
            </ul>
          ) : <p>No videos found. Add one above to get started.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap the admin panel with the guard
export default function AdminPage() {
    return (
        <AdminGuard>
            <AdminPanel />
        </AdminGuard>
    );
  }
