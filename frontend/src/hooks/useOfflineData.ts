import { useState, useEffect } from 'react';

interface CachedData {
  [key: string]: {
    data: any;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
  };
}

export const useOfflineData = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheData = (key: string, data: any, ttlMinutes: number = 60) => {
    try {
      const cached: CachedData = JSON.parse(localStorage.getItem('pwa-cache') || '{}');
      cached[key] = {
        data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000
      };
      localStorage.setItem('pwa-cache', JSON.stringify(cached));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  const getCachedData = (key: string) => {
    try {
      const cached: CachedData = JSON.parse(localStorage.getItem('pwa-cache') || '{}');
      const item = cached[key];
      
      if (!item) return null;
      
      // Check if data is still valid
      if (Date.now() - item.timestamp > item.ttl) {
        // Data expired, remove it
        delete cached[key];
        localStorage.setItem('pwa-cache', JSON.stringify(cached));
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  };

  const clearExpiredCache = () => {
    try {
      const cached: CachedData = JSON.parse(localStorage.getItem('pwa-cache') || '{}');
      const now = Date.now();
      let hasChanges = false;

      Object.keys(cached).forEach(key => {
        if (now - cached[key].timestamp > cached[key].ttl) {
          delete cached[key];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem('pwa-cache', JSON.stringify(cached));
      }
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  };

  const trackPageVisit = (path: string) => {
    try {
      const visited = JSON.parse(localStorage.getItem('pwa-visited-pages') || '[]');
      if (!visited.includes(path)) {
        visited.unshift(path);
        // Keep only last 10 visited pages
        const recent = visited.slice(0, 10);
        localStorage.setItem('pwa-visited-pages', JSON.stringify(recent));
      }
    } catch (error) {
      console.error('Failed to track page visit:', error);
    }
  };

  // Enhanced fetch with offline fallback
  const fetchWithFallback = async (url: string, options?: RequestInit, cacheKey?: string, ttlMinutes: number = 60) => {
    try {
      if (isOnline) {
        const response = await fetch(url, options);
        const data = await response.json();
        
        // Cache successful responses
        if (response.ok && cacheKey) {
          cacheData(cacheKey, data, ttlMinutes);
        }
        
        return { data, error: null, fromCache: false };
      }
    } catch (error) {
      console.warn('Network request failed, trying cache:', error);
    }

    // Try cache if offline or network failed
    if (cacheKey) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return { data: cachedData, error: null, fromCache: true };
      }
    }

    return { 
      data: null, 
      error: isOnline ? 'Network error' : 'No cached data available offline', 
      fromCache: false 
    };
  };

  // Periodic cache cleanup
  useEffect(() => {
    clearExpiredCache();
    const interval = setInterval(clearExpiredCache, 10 * 60 * 1000); // Every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return {
    isOnline,
    cacheData,
    getCachedData,
    clearExpiredCache,
    trackPageVisit,
    fetchWithFallback
  };
};

// Hook for caching component state
export const useOfflineState = <T>(key: string, initialValue: T, ttlMinutes: number = 60) => {
  const { cacheData, getCachedData } = useOfflineData();
  const [state, setState] = useState<T>(() => {
    const cached = getCachedData(key);
    return cached !== null ? cached : initialValue;
  });

  const setOfflineState = (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state) : value;
    setState(newValue);
    cacheData(key, newValue, ttlMinutes);
  };

  return [state, setOfflineState] as const;
};
