import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: string;
  expires_at: string | null;
  created_at: string;
}

const AnnouncementsBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  // Get user role for filtering announcements
  const getUserRole = () => {
    if (!profile?.role) return 'all';
    switch (profile.role) {
      case 'student': return 'students';
      case 'expert': return 'researchers';
      case 'aid': return 'research_aids';
      default: return 'all';
    }
  };
  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'active')
        .or(`target_audience.eq.all,target_audience.eq.${getUserRole()}`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Could not fetch announcements:', error.message);
        // Use fallback announcements for demo
        const fallbackAnnouncements: Announcement[] = [
          {
            id: 'demo-banner-1',
            title: 'Welcome to Scholar Connect!',
            content: 'Start exploring our consultation services and connect with expert researchers in your field.',
            target_audience: 'all',
            priority: 'normal',
            status: 'active',
            created_at: new Date().toISOString(),
            expires_at: null
          }
        ];
        setAnnouncements(fallbackAnnouncements);
        return;
      }

      // Filter out expired announcements
      const activeAnnouncements = (data || []).filter(announcement => {
        if (!announcement.expires_at) return true;
        return new Date(announcement.expires_at) > new Date();
      });

      setAnnouncements(activeAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dismiss announcement
  const dismissAnnouncement = (id: string) => {
    const dismissed = [...dismissedAnnouncements, id];
    setDismissedAnnouncements(dismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(dismissed));
  };

  // Load dismissed announcements from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('dismissedAnnouncements');
    if (dismissed) {
      setDismissedAnnouncements(JSON.parse(dismissed));
    }
  }, []);

  useEffect(() => {
    if (profile) {
      fetchAnnouncements();
    }
  }, [profile]);

  // Get announcement icon based on priority
  const getAnnouncementIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Bell className="h-4 w-4" />;
      case 'normal': return <Info className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  // Get alert variant based on priority
  const getAlertVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      default: return 'default';
    }
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  );

  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {visibleAnnouncements.map((announcement) => (
        <Alert key={announcement.id} variant={getAlertVariant(announcement.priority)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              {getAnnouncementIcon(announcement.priority)}
              <div className="flex-1">
                <AlertTitle className="flex items-center gap-2">
                  {announcement.title}
                  <Badge variant="outline" className="text-xs">
                    {announcement.priority}
                  </Badge>
                  {announcement.target_audience !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      {announcement.target_audience}
                    </Badge>
                  )}
                </AlertTitle>
                <AlertDescription className="mt-1">
                  {announcement.content}
                </AlertDescription>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(announcement.created_at).toLocaleDateString()}
                  {announcement.expires_at && (
                    <span>• Expires: {new Date(announcement.expires_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAnnouncement(announcement.id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default AnnouncementsBanner;
