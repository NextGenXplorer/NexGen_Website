'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

/**
 * Protects child content by verifying the user's authentication status on mount.
 *
 * Renders a full-screen Spinner while an auth check (GET /api/auth/status) is in progress.
 * If the user is authenticated, renders the provided children; otherwise initiates a redirect to `/login`
 * and renders nothing.
 *
 * @param children - UI to render when the user is authorized
 * @returns The authorized children when authenticated, a loading spinner during the check, or `null` after initiating a redirect
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            setIsAuthorized(true);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  // User is not authorized, redirect has already been triggered.
  // Return null to avoid rendering children during the redirect.
  return null;
}
