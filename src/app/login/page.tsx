'use client';

import { useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) must be
      // authorized in the Firebase console.
      url: `${window.location.origin}/finish-login`,
      // This must be true.
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
      setIsLinkSent(true);
    } catch (error: any) {
      console.error("Failed to send sign-in link:", error);
      setError(`Failed to send login link: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          {isLinkSent ? (
             <CardDescription>A login link has been sent to your email address. Please check your inbox.</CardDescription>
          ) : (
            <CardDescription>Enter your email to receive a passwordless login link.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!isLinkSent ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Login Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300">You can close this window now.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
