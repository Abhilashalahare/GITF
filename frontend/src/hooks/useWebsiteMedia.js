import { useEffect, useState } from 'react';

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const API_URL = `${BACKEND_URL}/api/website-media`;

// Convert local upload paths into absolute backend URLs.
// Existing absolute URLs, including Cloudinary URLs, remain unchanged.
const resolveMediaUrl = (mediaUrl) => {
  if (!mediaUrl || typeof mediaUrl !== 'string') {
    return '';
  }

  if (/^https?:\/\//i.test(mediaUrl)) {
    return mediaUrl;
  }

  if (mediaUrl.startsWith('/')) {
    return `${BACKEND_URL}${mediaUrl}`;
  }

  return `${BACKEND_URL}/${mediaUrl}`;
};

export default function useWebsiteMedia() {
  const [media, setMedia] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMedia() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch website media: ${response.status}`
          );
        }

        const result = await response.json();

        const items = Array.isArray(result.data)
          ? result.data
          : [];

        const mediaMap = {};

        items.forEach((item) => {
          if (item.isActive && item.key) {
            mediaMap[item.key] = {
              ...item,
              mediaUrl: resolveMediaUrl(item.mediaUrl),
            };
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