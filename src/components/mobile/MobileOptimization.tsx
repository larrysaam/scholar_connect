
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Tablet, Monitor, Wifi, WifiOff } from "lucide-react";

const MobileOptimization = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect device type
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const optimizations = [
    {
      title: "Touch-Optimized Interface",
      status: deviceType === 'mobile' ? 'active' : 'inactive',
      description: "Larger touch targets and gestures for mobile devices"
    },
    {
      title: "Responsive Layout",
      status: 'active',
      description: "Automatically adjusts to your screen size"
    },
    {
      title: "Offline Support",
      status: isOnline ? 'inactive' : 'active',
      description: "Continue working even without internet connection"
    },
    {
      title: "Fast Loading",
      status: 'active',
      description: "Optimized images and lazy loading for better performance"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <span>Mobile Experience</span>
          </div>
          <div className="flex items-center space-x-2">
            {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Device: <span className="font-medium capitalize">{deviceType}</span>
          </div>
          
          <div className="space-y-3">
            {optimizations.map((opt, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{opt.title}</h4>
                  <p className="text-xs text-gray-600">{opt.description}</p>
                </div>
                <Badge variant={opt.status === 'active' ? 'default' : 'secondary'}>
                  {opt.status}
                </Badge>
              </div>
            ))}
          </div>
          
          {!isOnline && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                You're currently offline. Some features may be limited, but you can still browse cached content.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOptimization;
