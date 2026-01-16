// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (default)
const BLOG_CACHE_DURATION = 30 * 1000; // 30 seconds for blog posts (shorter for freshness)

export const getCached = (key: string): any | null => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  // Use shorter cache duration for blog posts
  const duration = key.includes('blog-posts') ? BLOG_CACHE_DURATION : CACHE_DURATION;
  const age = Date.now() - cached.timestamp;
  if (age > duration) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const setCached = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (pattern?: string): void => {
  if (!pattern) {
    cache.clear();
    return;
  }
  
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

