'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isAdmin } from '@/lib/auth';
import { Spinner } from '@/components/ui/spinner'; // Assuming a spinner component exists

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, now check if they are an admin.
        const userIsAdmin = await isAdmin(user.uid);
        if (userIsAdmin) {
          setIsAuthorized(true);
        } else {
          // User is not an admin, redirect them.
          console.log("User is not an admin. Redirecting to login.");
          router.push('/login');
        }
      } else {
        // User is not signed in, redirect them.
        console.log("User is not logged in. Redirecting to login.");
        router.push('/login');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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

  // This part will likely not be reached due to the redirects, but it's good practice.
  return null;
    }
    
