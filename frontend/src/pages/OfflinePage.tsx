import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, RefreshCw, Home, Users, BookOpen, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OfflinePage = () => {
  const [lastVisited, setLastVisited] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get cached pages from localStorage
    const cached = localStorage.getItem('pwa-visited-pages');
    if (cached) {
      setLastVisited(JSON.parse(cached));
    }
  }, []);

  const handleRetry = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      } catch (error) {
        console.error('Failed to update service worker:', error);
      }
    }
    window.location.reload();
  };

  const cachedRoutes = [
    { path: '/', label: 'Home', icon: Home, description: 'Browse available services' },
    { path: '/researchers', label: 'Researchers', icon: Users, description: 'Find academic experts' },
    { path: '/dashboard', label: 'Dashboard', icon: BookOpen, description: 'Your personal workspace' },
    { path: '/appointments', label: 'Appointments', icon: Calendar, description: 'Manage your bookings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Offline Status */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <WifiOff className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800">You're Offline</CardTitle>
            <CardDescription className="text-orange-700">
              Don't worry! You can still use cached features of ResearchTandem while offline.
            </CardDescription>
          </CardHeader>
        </Card>


        {/* Available Cached Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Available Offline Features
            </CardTitle>
            <CardDescription>
              These sections are cached and available without an internet connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {cachedRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Button
                    key={route.path}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => navigate(route.path)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">{route.label}</div>
                        <div className="text-sm text-gray-500">{route.description}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recently Visited */}
        {lastVisited.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Visited</CardTitle>
              <CardDescription>
                Your recently visited pages are also available offline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {lastVisited.slice(0, 5).map((page, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => navigate(page)}
                  >
                    {page === '/' ? 'Home' : page.replace('/', '').charAt(0).toUpperCase() + page.slice(2)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Offline Capabilities */}
        <Alert>
          <AlertDescription>
            <strong>What works offline:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Browse cached researcher profiles</li>
              <li>• View your dashboard and past appointments</li>
              <li>• Access saved documents and notes</li>
              <li>• Use basic app navigation</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Retry Connection */}
        <div className="text-center">
          <Button onClick={handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try to Reconnect
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            The app will automatically reconnect when your internet is restored
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
