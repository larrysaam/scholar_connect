
import { useEffect } from 'react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { initializeSecurity } from '@/utils/enhancedSecurity';

const SecurityMonitor = () => {
  const { logSuspiciousActivity } = useSecurityAudit();

  useEffect(() => {
    // Initialize security measures
    const cleanup = initializeSecurity();

    // Monitor for suspicious browser activities
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSuspiciousActivity('tab_hidden', { timestamp: Date.now() });
      }
    };

    const handleDevToolsDetection = () => {
      // Simple dev tools detection
      let devtools = false;
      const threshold = 160;

      const widthCheck = () => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools) {
            devtools = true;
            logSuspiciousActivity('dev_tools_detected', { 
              timestamp: Date.now(),
              windowDimensions: {
                outer: { width: window.outerWidth, height: window.outerHeight },
                inner: { width: window.innerWidth, height: window.innerHeight }
              }
            });
          }
        } else {
          devtools = false;
        }
      };

      const interval = setInterval(widthCheck, 1000);
      return () => clearInterval(interval);
    };

    const handleConsoleWarning = () => {
      // Override console methods to detect usage
      const originalConsole = { ...console };
      
      console.log = (...args) => {
        logSuspiciousActivity('console_usage', { 
          method: 'log', 
          timestamp: Date.now() 
        });
        originalConsole.log(...args);
      };

      return () => {
        Object.assign(console, originalConsole);
      };
    };

    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const devToolsCleanup = handleDevToolsDetection();
    const consoleCleanup = handleConsoleWarning();

    // Monitor for multiple rapid clicks (potential automation)
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;
    
    const handleRapidClicks = () => {
      clickCount++;
      
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        if (clickCount > 10) {
          logSuspiciousActivity('rapid_clicking', { 
            clickCount, 
            timestamp: Date.now() 
          });
        }
        clickCount = 0;
      }, 5000);
    };

    document.addEventListener('click', handleRapidClicks);

    // Cleanup function
    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleRapidClicks);
      devToolsCleanup();
      consoleCleanup();
      clearTimeout(clickTimer);
    };
  }, [logSuspiciousActivity]);

  return null; // This component doesn't render anything
};

export default SecurityMonitor;
