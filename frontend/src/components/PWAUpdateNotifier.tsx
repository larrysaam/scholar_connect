import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PWAUpdateNotifier = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're in a PWA environment
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const handleUpdateFound = () => {
      setShowUpdateNotification(true);
    };

    const handleControllerChange = () => {
      setIsUpdating(false);
      setShowUpdateNotification(false);
      toast({
        title: "App Updated!",
        description: "ResearchWow has been updated to the latest version.",
      });
    };

    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    // Check for updates periodically
    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting) {
            handleUpdateFound();
          }
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    // Check for updates on load
    checkForUpdates();

    // Check for updates every 30 minutes
    const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      clearInterval(updateInterval);
    };
  }, [toast]);

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration && registration.waiting) {
        // Tell the waiting service worker to skip waiting and become active
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Reload the page to get the new version
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating app:', error);
      setIsUpdating(false);
      toast({
        title: "Update Error",
        description: "There was an error updating the app. Please refresh manually.",
        variant: "destructive"
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdateNotification(false);
    toast({
      title: "Update Postponed",
      description: "You can update later by refreshing the page.",
    });
  };

  if (!showUpdateNotification) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Alert className="bg-blue-50 border-blue-200 shadow-lg">
        <RefreshCw className="h-4 w-4 text-blue-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="pr-2">
            <p className="font-medium text-blue-900">New version available!</p>
            <p className="text-sm text-blue-700">Update ResearchWow for the latest features and improvements.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              disabled={isUpdating}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleUpdateClick}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
