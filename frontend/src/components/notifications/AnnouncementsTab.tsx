import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Calendar, FileText, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
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

const AnnouncementsTab = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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
        .order('created_at', { ascending: false });      if (error) {
        console.log('Could not fetch announcements:', error.message);
        // Use fallback announcements for demo
        const fallbackAnnouncements: Announcement[] = [
          {
            id: 'demo-tab-1',
            title: 'Welcome to Scholar Connect Platform',
            content: 'We are excited to have you join our community of researchers, students, and research aids. Explore our consultation services and connect with experts in your field.',
            target_audience: 'all',
            priority: 'normal',
            status: 'active',
            created_at: new Date().toISOString(),
            expires_at: null
          },
          {
            id: 'demo-tab-2',
            title: 'New Research Categories Added',
            content: 'We have expanded our platform with new research categories including Data Science, Artificial Intelligence, and Machine Learning. Check out the updated consultation services!',
            target_audience: 'students',
            priority: 'high',
            status: 'active',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            expires_at: null
          },
          {
            id: 'demo-tab-3',
            title: 'Researcher Spotlight Program',
            content: 'Introducing our new Researcher Spotlight program where we feature outstanding researchers and their contributions to the community.',
            target_audience: 'researchers',
            priority: 'normal',
            status: 'active',
            created_at: new Date(Date.now() - 172800000).toISOString(),
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

  useEffect(() => {
    if (profile) {
      fetchAnnouncements();
    }
  }, [profile]);

  // Get announcement icon based on priority
  const getAnnouncementIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high': return <Bell className="h-5 w-5 text-orange-500" />;
      case 'normal': return <Info className="h-5 w-5 text-blue-500" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'normal': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <Badge variant="secondary">
          {announcements.length} Active
        </Badge>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-500">
              You're all caught up! New announcements will appear here when available.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAnnouncementIcon(announcement.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        <Badge variant={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        {announcement.target_audience !== 'all' && (
                          <Badge variant="outline">
                            {announcement.target_audience}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                        {announcement.expires_at && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            Expires: {new Date(announcement.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsTab;
