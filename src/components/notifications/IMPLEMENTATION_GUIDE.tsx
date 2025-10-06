// Integration guide for implementing comprehensive onsite notifications

/**
 * STEP 1: Install required dependencies
 * npm install framer-motion
 */

/**
 * STEP 2: Update your main App.tsx to include the ToastProvider
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ToastProvider from '@/components/notifications/ToastProvider';
import RealTimeNotificationManager from '@/components/notifications/RealTimeNotificationManager';
import useNotificationTriggers from '@/hooks/useNotificationTriggers';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <ToastProvider>
        {/* Your existing app content */}
        <div className="App">
          {/* Your routes and components */}
        </div>
        
        {/* Real-time notification managers */}
        {user && (
          <>
            <RealTimeNotificationManager 
              userId={user.id} 
              enableBrowserNotifications={true}
            />
            <NotificationTriggersManager />
          </>
        )}
      </ToastProvider>
    </BrowserRouter>
  );
}

// Component to initialize notification triggers
function NotificationTriggersManager() {
  useNotificationTriggers();
  return null;
}

export default App;

/**
 * STEP 3: Update your Navbar/Header to include the NotificationCenter
 */

import React from 'react';
import { NotificationCenter } from '@/components/notifications/NotificationCenterNew';

function Navbar({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  return (
    <nav className="navbar">
      {/* Your existing navbar content */}
      
      {/* Add notification center to the right side */}
      <div className="flex items-center gap-4">
        <NotificationCenter 
          onNavigate={onTabChange}
          className="ml-4"
        />
        {/* Other navbar items */}
      </div>
    </nav>
  );
}

/**
 * STEP 4: Use toast notifications in your components
 */

import { useToast } from '@/components/notifications/ToastProvider';

function SomeComponent() {
  const { addToast } = useToast();

  const handleAction = () => {
    addToast({
      title: 'Success!',
      message: 'Your action was completed successfully',
      type: 'success',
      category: 'system',
      duration: 5000
    });
  };

  return (
    <button onClick={handleAction}>
      Click me
    </button>
  );
}

/**
 * STEP 5: Enhanced notification hook for manual notifications
 */

import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/components/notifications/ToastProvider';

export const useEnhancedNotifications = () => {
  const notifications = useNotifications();
  const { addToast } = useToast();

  const notify = {
    success: (title: string, message: string, options?: any) => {
      addToast({
        title,
        message,
        type: 'success',
        category: 'system',
        ...options
      });
    },
    
    error: (title: string, message: string, options?: any) => {
      addToast({
        title,
        message,
        type: 'error',
        category: 'system',
        persistent: true, // Errors should be persistent
        ...options
      });
    },
    
    warning: (title: string, message: string, options?: any) => {
      addToast({
        title,
        message,
        type: 'warning',
        category: 'system',
        ...options
      });
    },
    
    info: (title: string, message: string, options?: any) => {
      addToast({
        title,
        message,
        type: 'info',
        category: 'system',
        ...options
      });
    },

    // Specific notification types
    booking: {
      confirmed: (details: any) => {
        addToast({
          title: 'Booking Confirmed',
          message: `Your consultation is confirmed for ${details.date} at ${details.time}`,
          type: 'success',
          category: 'consultation',
          action_url: '/dashboard?tab=my-bookings',
          action_label: 'View Booking'
        });
      },
      
      reminder: (details: any) => {
        addToast({
          title: 'Upcoming Consultation',
          message: `Reminder: You have a consultation in ${details.timeUntil}`,
          type: 'warning',
          category: 'consultation',
          persistent: true,
          action_url: '/dashboard?tab=upcoming',
          action_label: 'View Details'
        });
      }
    },

    payment: {
      success: (amount: number) => {
        addToast({
          title: 'Payment Successful',
          message: `Payment of ${amount} XAF processed successfully`,
          type: 'success',
          category: 'payment',
          action_url: '/dashboard?tab=payments',
          action_label: 'View Transaction'
        });
      },
      
      failed: (reason?: string) => {
        addToast({
          title: 'Payment Failed',
          message: reason || 'Your payment could not be processed',
          type: 'error',
          category: 'payment',
          persistent: true,
          action_url: '/dashboard?tab=payments',
          action_label: 'Retry Payment'
        });
      }
    }
  };

  return {
    ...notifications,
    notify,
    addToast
  };
};

/**
 * STEP 6: Database triggers for automatic notifications (SQL)
 * Run these in your Supabase SQL editor:
 */

/*
-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'system',
  p_action_url TEXT DEFAULT NULL,
  p_action_label TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id, title, message, type, category, action_url, action_label
  ) VALUES (
    p_user_id, p_title, p_message, p_type, p_category, p_action_url, p_action_label
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking confirmations
CREATE OR REPLACE FUNCTION notify_booking_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    PERFORM create_notification(
      NEW.client_id,
      'Booking Confirmed',
      'Your consultation booking has been confirmed for ' || NEW.scheduled_date || ' at ' || NEW.scheduled_time,
      'success',
      'consultation',
      '/dashboard?tab=my-bookings',
      'View Booking'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_confirmed_notification
  AFTER UPDATE ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_confirmed();

-- Trigger for payment confirmations
CREATE OR REPLACE FUNCTION notify_payment_received()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    PERFORM create_notification(
      NEW.user_id,
      'Payment Processed',
      'Payment of ' || NEW.amount || ' XAF has been successfully processed',
      'success',
      'payment',
      '/dashboard?tab=payments',
      'View Transaction'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_received_notification
  AFTER UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_received();
*/

export default {};
