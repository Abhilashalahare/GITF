
import { useEffect, useState } from 'react';

const API_URL = `${
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
}/api/website-media`;

export default function useWebsiteMedia() {
  const [media, setMedia] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMedia() {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch website media');
        }

        // Your API returns the array in result.data.
        const items = Array.isArray(result.data)
          ? result.data
          : [];

        const mediaMap = {};

        items.forEach((item) => {
          if (item.isActive && item.key) {
            mediaMap[item.key] = item;
          }
        });

        if (!cancelled) {
          setMedia(mediaMap);
        }
      } catch (error) {
        console.error('Error fetching website media:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  return { media, loading };
}
