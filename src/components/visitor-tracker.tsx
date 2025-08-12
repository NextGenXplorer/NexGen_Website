"use client";

import { useEffect } from 'react';

export function VisitorTracker() {
  useEffect(() => {
    const hasBeenCounted = sessionStorage.getItem('hasBeenCounted');

    if (!hasBeenCounted) {
      fetch('/api/stats', {
        method: 'POST',
      })
        .then(response => {
          if (response.ok) {
            sessionStorage.setItem('hasBeenCounted', 'true');
            console.log('Visitor count incremented.');
          } else {
            console.error('Failed to increment visitor count.');
          }
        })
        .catch(error => {
          console.error('Error incrementing visitor count:', error);
        });
    }
  }, []);

  return null;
}
