import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  Clock, 
  HardDrive, 
  RefreshCw,
  Trash2,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useOfflineData } from '@/hooks/useOfflineData';

export const PWATestDashboard = () => {
  const { isOnline, getCachedData, clearExpiredCache } = useOfflineData();
  const [cacheInfo, setCacheInfo] = useState<any>({});
  const [storageInfo, setStorageInfo] = useState<any>({});
  const [swInfo, setSWInfo] = useState<any>({});

  useEffect(() => {
    loadCacheInfo();
    loadStorageInfo();
    loadServiceWorkerInfo();
  }, []);

  const loadCacheInfo = () => {
    try {
      const cached = JSON.parse(localStorage.getItem('pwa-cache') || '{}');
      const visited = JSON.parse(localStorage.getItem('pwa-visited-pages') || '[]');
      
      setCacheInfo({
        totalEntries: Object.keys(cached).length,
        visitedPages: visited.length,
        cacheSize: JSON.stringify(cached).length,
        entries: Object.entries(cached).map(([key, value]: [string, any]) => ({
          key,
          timestamp: value.timestamp,
          ttl: value.ttl,
          size: JSON.stringify(value.data).length,
          expired: Date.now() - value.timestamp > value.ttl
        }))
      });
    } catch (error) {
      console.error('Failed to load cache info:', error);
    }
  };

  const loadStorageInfo = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setStorageInfo({
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota ? estimate.quota - (estimate.usage || 0) : 0
        });
      }
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const loadServiceWorkerInfo = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        setSWInfo({
          registered: !!registration,
          active: !!registration?.active,
          waiting: !!registration?.waiting,
          scope: registration?.scope,
          updateFound: !!registration?.waiting
        });
      }
    } catch (error) {
      console.error('Failed to load SW info:', error);
    }
  };

  const clearAllCache = () => {
    localStorage.removeItem('pwa-cache');
    localStorage.removeItem('pwa-visited-pages');
    loadCacheInfo();
  };

  const clearExpiredOnly = () => {
    clearExpiredCache();
    loadCacheInfo();
  };

  const forceRefresh = () => {
    window.location.reload();
  };

  const updateServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        loadServiceWorkerInfo();
      }
    } catch (error) {
      console.error('Failed to update SW:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">PWA Test Dashboard</h1>
        <p className="text-gray-600">Monitor offline capabilities and cache performance</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <span className="text-sm text-gray-600">
              {isOnline 
                ? "All features available" 
                : "Running in offline mode with cached data"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Service Worker Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Service Worker Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {swInfo.registered ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Registered</span>
            </div>
            <div className="flex items-center gap-2">
              {swInfo.active ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              {swInfo.waiting ? (
                <Clock className="h-4 w-4 text-yellow-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <span className="text-sm">Up to Date</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={updateServiceWorker}
              className="text-xs"
            >
              Check Updates
            </Button>
          </div>
          {swInfo.scope && (
            <p className="text-xs text-gray-500 mt-2">Scope: {swInfo.scope}</p>
          )}
        </CardContent>
      </Card>

      {/* Storage Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {storageInfo.quota ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Used: {formatBytes(storageInfo.usage || 0)}</span>
                <span>Available: {formatBytes(storageInfo.available || 0)}</span>
                <span>Total: {formatBytes(storageInfo.quota || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${((storageInfo.usage || 0) / (storageInfo.quota || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Storage information not available</p>
          )}
        </CardContent>
      </Card>

      {/* Cache Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Status
          </CardTitle>
          <CardDescription>
            {cacheInfo.totalEntries} cached entries • {formatBytes(cacheInfo.cacheSize || 0)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button size="sm" variant="outline" onClick={clearExpiredOnly}>
              <Clock className="h-4 w-4 mr-1" />
              Clear Expired
            </Button>
            <Button size="sm" variant="outline" onClick={clearAllCache}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All Cache
            </Button>
            <Button size="sm" variant="outline" onClick={loadCacheInfo}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>

          {cacheInfo.entries && cacheInfo.entries.length > 0 ? (
            <div className="space-y-2">
              {cacheInfo.entries.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{entry.key}</div>
                    <div className="text-xs text-gray-600">
                      Cached: {formatTime(entry.timestamp)} • Size: {formatBytes(entry.size)}
                    </div>
                  </div>
                  <Badge variant={entry.expired ? "destructive" : "default"}>
                    {entry.expired ? "Expired" : "Valid"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No cached data found</p>
          )}
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
          <CardDescription>Actions to test PWA functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Alert>
              <AlertDescription>
                <strong>To test offline mode:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Open Developer Tools (F12)</li>
                  <li>Go to Network tab</li>
                  <li>Check "Offline" checkbox</li>
                  <li>Navigate through the app</li>
                  <li>Check this dashboard for cache usage</li>
                </ol>
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={forceRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Force Refresh
              </Button>
              <Button onClick={() => window.open('/offline', '_blank')} variant="outline">
                Open Offline Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWATestDashboard;
