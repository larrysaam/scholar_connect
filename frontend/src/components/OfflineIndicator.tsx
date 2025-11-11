import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  // Auto-hide offline message after 3 seconds when back online
  useEffect(() => {
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  const handleGoOffline = () => {
    navigate('/offline');
  };

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert className={`mx-auto max-w-md transition-all duration-300 ${
        isOnline ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-600" />
            )}
            <AlertDescription className={isOnline ? 'text-green-800' : 'text-orange-800'}>
              {isOnline 
                ? 'Connection restored! You\'re back online.' 
                : 'You\'re offline. Some features may be limited.'}
            </AlertDescription>
          </div>
          {!isOnline && location.pathname !== '/offline' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleGoOffline}
              className="ml-2 h-8 px-2 text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              View Offline Mode
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;
