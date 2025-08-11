'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function FinishLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [needsEmail, setNeedsEmail] = useState(false);

  useEffect(() => {
    const processSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let storedEmail = window.localStorage.getItem('emailForSignIn');
        if (!storedEmail) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the email again.
          setNeedsEmail(true);
          setIsLoading(false);
          return;
        }
        
        try {
          await signInWithEmailLink(auth, storedEmail, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          router.push('/admin');
        } catch (error: any) {
          console.error("Failed to sign in with email link:", error);
          setError('Failed to sign in. The link may be invalid or expired.');
          setIsLoading(false);
        }
      } else {
        setError('This is not a valid login link.');
        setIsLoading(false);
      }
    };

    processSignIn();
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn'); // Clean up just in case
        router.push('/admin');
    } catch (error: any) {
        console.error("Failed to sign in with email link:", error);
        setError('Failed to sign in. The email may not match or the link is expired.');
        setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Spinner size="large" />
        <p className="text-gray-600 dark:text-gray-300">Finalizing login, please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
       <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login Completion</CardTitle>
        </CardHeader>
        <CardContent>
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}
            {needsEmail && !error && (
                 <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <CardDescription className="text-center">
                        To complete your login, please enter your email address again for verification.
                    </CardDescription>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Complete Login
                    </Button>
                </form>
            )}
            {!needsEmail && error && (
                <div className="text-center">
                    <Button onClick={() => router.push('/login')}>
                        Go to Login Page
                    </Button>
                </div>
            )}
        </CardContent>
       </Card>
    </div>
  )
}
