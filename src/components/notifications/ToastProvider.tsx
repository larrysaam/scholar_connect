import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NotificationToast from './NotificationToast';
import { AnimatePresence } from 'framer-motion';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  action_url?: string;
  action_label?: string;
  duration?: number;
  persistent?: boolean;
}

interface ToastContextType {
  addToast: (notification: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: ToastNotification = {
      id,
      duration: 5000, // default 5 seconds
      ...notification,
    };

    setToasts(prev => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const handleAction = useCallback((actionUrl: string) => {
    // Handle navigation based on URL type
    if (actionUrl.startsWith('http')) {
      window.open(actionUrl, '_blank');
    } else if (actionUrl.startsWith('/')) {
      window.location.href = actionUrl;
    } else {
      // Handle internal navigation (e.g., tab switching)
      const event = new CustomEvent('navigate', { detail: { url: actionUrl } });
      window.dispatchEvent(event);
    }
  }, []);

  // Create portal root if it doesn't exist
  useEffect(() => {
    let toastRoot = document.getElementById('toast-root');
    if (!toastRoot) {
      toastRoot = document.createElement('div');
      toastRoot.id = 'toast-root';
      toastRoot.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(toastRoot);
    }

    return () => {
      // Cleanup on unmount
      const root = document.getElementById('toast-root');
      if (root && toasts.length === 0) {
        document.body.removeChild(root);
      }
    };
  }, [toasts]);

  const toastElements = (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <NotificationToast
              notification={toast}
              onDismiss={removeToast}
              onAction={handleAction}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      {typeof document !== 'undefined' && createPortal(toastElements, document.body)}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
