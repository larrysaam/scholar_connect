import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Download, X, Smartphone, Monitor, Tablet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast({
        title: "App Installed!",
        description: "ResearchTandem has been successfully installed on your device.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstallDialog(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        toast({
          title: "Installing...",
          description: "ResearchTandem is being installed on your device.",
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during installation:', error);
      toast({
        title: "Installation Error",
        description: "There was an error installing the app. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return {
        browser: 'Chrome',
        steps: [
          'Click the three dots menu in the top right',
          'Select "Install ResearchTandem"',
          'Click "Install" in the confirmation dialog'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        steps: [
          'Look for the install icon in the address bar',
          'Click it and select "Install"',
          'Or go to Menu > Install this site as an app'
        ]
      };
    } else if (userAgent.includes('safari')) {
      return {
        browser: 'Safari',
        steps: [
          'Tap the Share button at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else if (userAgent.includes('edge')) {
      return {
        browser: 'Edge',
        steps: [
          'Click the three dots menu',
          'Select "Apps" > "Install ResearchTandem"',
          'Click "Install" to confirm'
        ]
      };
    }
    
    return {
      browser: 'Your Browser',
      steps: [
        'Look for an install or "Add to Home Screen" option in your browser menu',
        'Follow the prompts to install the app',
        'The app will appear on your device like a native app'
      ]
    };
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Install Button - Show if installable or for manual instructions */}
      {(isInstallable || !isInstalled) && (
        <Button
          onClick={handleInstallClick}
          variant="outline"
          size="sm"
          className="gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          <Download className="h-4 w-4" />
          Install App
        </Button>
      )}

      {/* Manual Installation Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Install ResearchTandem
            </DialogTitle>
            <DialogDescription>
              Get the full app experience with offline access and native performance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Smartphone className="h-8 w-8 mx-auto text-blue-600" />
                <p className="text-sm font-medium">Mobile Ready</p>
                <p className="text-xs text-gray-600">Works like a native app</p>
              </div>
              <div className="space-y-2">
                <Monitor className="h-8 w-8 mx-auto text-green-600" />
                <p className="text-sm font-medium">Offline Access</p>
                <p className="text-xs text-gray-600">Use without internet</p>
              </div>
              <div className="space-y-2">
                <Tablet className="h-8 w-8 mx-auto text-purple-600" />
                <p className="text-sm font-medium">Fast & Secure</p>
                <p className="text-xs text-gray-600">Enhanced performance</p>
              </div>
            </div>

            {/* Installation Instructions */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                Installation Instructions for {getInstallInstructions().browser}:
              </h4>
              <ol className="space-y-2 text-sm text-gray-600">
                {getInstallInstructions().steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowInstallDialog(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  setShowInstallDialog(false);
                  toast({
                    title: "Installation Guide",
                    description: "Follow the steps above to install ResearchTandem on your device.",
                  });
                }}
              >
                Got It
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
