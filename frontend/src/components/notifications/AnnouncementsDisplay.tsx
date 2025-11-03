import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X, Calendar, Clock, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience: 'all' | 'students' | 'researchers' | 'aids';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  published_date: string;
  expires_at?: string;
  is_pinned: boolean;
  is_read?: boolean;
}

interface AnnouncementsDisplayProps {
  compact?: boolean;
  maxAnnouncements?: number;
}

const AnnouncementsDisplay = ({ compact = false, maxAnnouncements = 5 }: AnnouncementsDisplayProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, profile } = useAuth();

  // Get user role mapping
  const getUserRole = () => {
    if (!profile?.role) return 'students';
    switch (profile.role) {
      case 'student': return 'students';
      case 'expert': return 'researchers';
      case 'aid': return 'aids';
      default: return 'students';
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userRole = getUserRole();
      
      // Fetch published announcements for the user
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'published')
        .or(`target_audience.eq.all,target_audience.eq.${userRole}`)
        .order('is_pinned', { ascending: false })
        .order('published_date', { ascending: false })
        .limit(maxAnnouncements);

      if (announcementsError) throw announcementsError;

      // Fetch read status for each announcement
      const announcementIds = announcementsData?.map(a => a.id) || [];
      const { data: readsData } = await supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('user_id', user.id)
        .in('announcement_id', announcementIds);

      const readIds = new Set(readsData?.map(r => r.announcement_id) || []);

      const announcementsWithReadStatus = (announcementsData || []).map(announcement => ({
        ...announcement,
        is_read: readIds.has(announcement.id)
      }));

      setAnnouncements(announcementsWithReadStatus);
      setUnreadCount(announcementsWithReadStatus.filter(a => !a.is_read).length);

    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark announcement as read
  const markAsRead = async (announcementId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('announcement_reads')
        .upsert({
          announcement_id: announcementId,
          user_id: user.id
        }, {
          onConflict: 'announcement_id,user_id'
        });

      if (error) throw error;

      // Update local state
      setAnnouncements(prev => 
        prev.map(a => 
          a.id === announcementId ? { ...a, is_read: true } : a
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Info className="h-4 w-4 text-blue-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-blue-200 bg-blue-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  // Handle announcement click
  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDialogOpen(true);
    if (!announcement.is_read) {
      markAsRead(announcement.id);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [user, profile]);

  if (!user || announcements.length === 0) {
    return null;
  }

  // Compact view for notifications panel
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Announcements</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {announcements.slice(0, 3).map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                !announcement.is_read ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2">
                {getPriorityIcon(announcement.priority)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{announcement.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {announcement.message.substring(0, 60)}...
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.published_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full view for dedicated announcements page
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Platform Announcements</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Button variant="outline" onClick={fetchAnnouncements} disabled={loading}>
            <Bell className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="space-y-3">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              className={`cursor-pointer transition-all hover:shadow-md ${
                announcement.is_pinned ? 'ring-2 ring-blue-200' : ''
              } ${!announcement.is_read ? 'bg-blue-50 border-blue-200' : ''} ${
                getPriorityColor(announcement.priority)
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getPriorityIcon(announcement.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{announcement.title}</h3>
                        {announcement.is_pinned && (
                          <Badge variant="outline" className="text-xs">
                            Pinned
                          </Badge>
                        )}
                        {!announcement.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(announcement.published_date).toLocaleDateString()}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {announcement.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Announcement Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {getPriorityIcon(selectedAnnouncement.priority)}
                  <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
                  {selectedAnnouncement.is_pinned && (
                    <Badge variant="outline">Pinned</Badge>
                  )}
                </div>
                <DialogDescription className="text-left">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Published: {new Date(selectedAnnouncement.published_date).toLocaleDateString()}
                    </div>
                    <Badge variant="outline">
                      {selectedAnnouncement.priority} priority
                    </Badge>
                    <Badge variant="outline">
                      For: {selectedAnnouncement.target_audience}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-96 w-full">
                <div className="text-sm text-gray-700 whitespace-pre-wrap p-1">
                  {selectedAnnouncement.message}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnnouncementsDisplay;
