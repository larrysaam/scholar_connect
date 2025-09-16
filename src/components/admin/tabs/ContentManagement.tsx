
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, FileText, Video, BookOpen, Bell, Plus, Download, Eye, File, Users, Calendar, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ContentManagement = () => {
  const { toast } = useToast();
  const [sharedFiles, setSharedFiles] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    target_audience: 'all',
    priority: 'normal',
    expires_at: ''
  });

  const blogPosts = [
    {
      id: 1,
      title: "How to Write an Effective Research Proposal",
      author: "Admin Team",
      status: "published",
      views: 1243,
      publishDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Top 10 Research Methodologies for Graduate Students",
      author: "Dr. Sarah Wilson",
      status: "draft",
      views: 0,
      publishDate: null
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: "Getting Started with ScholarConnect",
      duration: "5:32",
      views: 2847,
      status: "published",
      uploadDate: "2024-01-10"
    },
    {
      id: 2,
      title: "How to Book Your First Consultation",
      duration: "3:45",
      views: 1923,
      status: "published",
      uploadDate: "2024-01-12"
    }
  ];

  const researchTemplates = [
    {
      id: 1,
      name: "PhD Thesis Template",
      category: "Academic Writing",
      downloads: 234,
      lastUpdated: "2024-01-14"
    },
    {
      id: 2,
      name: "Policy Brief Template",
      category: "Policy Research",
      downloads: 156,
      lastUpdated: "2024-01-10"
    },
    {
      id: 3,
      name: "Research Proposal Template",
      category: "Proposal Writing",
      downloads: 389,
      lastUpdated: "2024-01-08"
    }
  ];  // Fetch shared files from service bookings
  const fetchSharedFiles = async () => {
    try {
      console.log('Fetching shared files from service_bookings...');
      
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          id,
          created_at,
          status,
          shared_documents,
          client:users!service_bookings_client_id_fkey(name, email),
          provider:users!service_bookings_provider_id_fkey(name, email),
          service:consultation_services(title)
        `)
        .not('shared_documents', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.log('Error fetching service bookings:', error.message);
        // Use mock data as fallback
        const mockData = [
          {
            id: '1',
            shared_documents: [
              { name: 'research_proposal.pdf', url: 'https://example.com/file1.pdf', size: 2048000, uploadedAt: new Date().toISOString() },
              { name: 'thesis_outline.docx', url: 'https://example.com/file2.docx', size: 1536000, uploadedAt: new Date().toISOString() }
            ],
            created_at: new Date().toISOString(),
            status: 'completed',
            client: { name: 'John Doe', email: 'john@example.com' },
            provider: { name: 'Dr. Smith', email: 'smith@example.com' },
            service: { title: 'Thesis Consultation' }
          },
          {
            id: '2',
            shared_documents: [
              { name: 'data_analysis.xlsx', url: 'https://example.com/file3.xlsx', size: 3072000, uploadedAt: new Date(Date.now() - 86400000).toISOString() }
            ],
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'pending',
            client: { name: 'Jane Wilson', email: 'jane@example.com' },
            provider: { name: 'Prof. Johnson', email: 'johnson@example.com' },
            service: { title: 'Statistical Analysis' }
          }
        ];
        
        const formattedMockData = mockData.map(booking => ({
          id: booking.id,
          files: booking.shared_documents || [],
          uploadDate: booking.created_at,
          status: booking.status,
          studentName: booking.client?.name || 'Unknown Student',
          researcherName: booking.provider?.name || 'Unknown Researcher',
          serviceName: booking.service?.title || 'Unknown Service',
          bookingId: booking.id
        }));
        
        setSharedFiles(formattedMockData);
        return;
      }

      // Process real data
      const processedFiles = data
        .filter(booking => booking.shared_documents && 
                (Array.isArray(booking.shared_documents) ? booking.shared_documents.length > 0 : 
                 typeof booking.shared_documents === 'object'))
        .map(booking => {
          let files = [];
          
          // Handle different formats of shared_documents
          if (Array.isArray(booking.shared_documents)) {
            files = booking.shared_documents;
          } else if (typeof booking.shared_documents === 'object') {
            // If it's an object, convert to array format
            files = [booking.shared_documents];
          }
          
          return {
            id: booking.id,
            files: files.map(file => ({
              name: file.name || file.fileName || 'Unknown File',
              url: file.url || file.fileUrl || '#',
              size: file.size || file.fileSize || 0,
              uploadedAt: file.uploadedAt || file.created_at || booking.created_at
            })),
            uploadDate: booking.created_at,
            status: booking.status,
            studentName: booking.client?.name || 'Unknown Student',
            researcherName: booking.provider?.name || 'Unknown Researcher',
            serviceName: booking.service?.title || 'Unknown Service',
            bookingId: booking.id
          };
        });

      console.log('Processed shared files:', processedFiles.length);
      setSharedFiles(processedFiles);
      
    } catch (error) {
      console.error('Error fetching shared files:', error);
      setSharedFiles([]);
    }
  };// Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching announcements:', error.message);
        
        if (error.message.includes('permission denied') || error.message.includes('RLS')) {
          // Permission error - show limited mock data with message
          const mockAnnouncements = [
            {
              id: 'mock-1',
              title: 'Permission Required',
              content: 'Admin permissions are required to view and manage announcements. Please ensure you are logged in with an admin account.',
              target_audience: 'all',
              priority: 'high',
              status: 'active',
              created_at: new Date().toISOString(),
              expires_at: null
            }
          ];
          setAnnouncements(mockAnnouncements);
        } else {
          // Other error - use demo data
          const mockAnnouncements = [
            {
              id: 'demo-1',
              title: 'Welcome to Scholar Connect',
              content: 'Thank you for joining our platform. Start exploring consultation services today!',
              target_audience: 'all',
              priority: 'normal',
              status: 'active',
              created_at: new Date().toISOString(),
              expires_at: null
            },
            {
              id: 'demo-2',
              title: 'System Maintenance',
              content: 'Scheduled maintenance will occur this weekend. Please plan accordingly.',
              target_audience: 'all',
              priority: 'high',
              status: 'active',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              expires_at: null
            },
            {
              id: 'demo-3',
              title: 'New Research Categories Available',
              content: 'We have added new research categories including Data Science and AI/ML. Check them out!',
              target_audience: 'students',
              priority: 'normal',
              status: 'active',
              created_at: new Date(Date.now() - 172800000).toISOString(),
              expires_at: null
            }
          ];
          setAnnouncements(mockAnnouncements);
        }
        return;
      }
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Use mock data as fallback
      const mockAnnouncements = [
        {
          id: 'fallback-1',
          title: 'Welcome to Scholar Connect',
          content: 'Thank you for joining our platform. Start exploring consultation services today!',
          target_audience: 'all',
          priority: 'normal',
          status: 'active',
          created_at: new Date().toISOString(),
          expires_at: null
        }
      ];
      setAnnouncements(mockAnnouncements);
    }
  };// Create announcement
  const createAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // First, try to insert the announcement
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          target_audience: newAnnouncement.target_audience,
          priority: newAnnouncement.priority,
          expires_at: newAnnouncement.expires_at || null,
          status: 'active'
        })
        .select();

      if (error) {
        console.log('Database error when creating announcement:', error.message);
        
        if (error.message.includes('permission denied') || error.message.includes('RLS')) {
          toast({
            title: "Permission Error",
            description: "You don't have sufficient permissions to create announcements. Please ensure you're logged in as an admin.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Database Error",
            description: `Failed to create announcement: ${error.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      // If successful, add to local state for immediate feedback
      if (data && data.length > 0) {
        const newAnnouncementData = {
          ...data[0],
          created_at: data[0].created_at || new Date().toISOString()
        };
        setAnnouncements(prev => [newAnnouncementData, ...prev]);
      }

      toast({
        title: "Success",
        description: "Announcement created successfully"
      });

      setNewAnnouncement({
        title: '',
        content: '',
        target_audience: 'all',
        priority: 'normal',
        expires_at: ''
      });
      setShowCreateAnnouncement(false);
      
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement. Please check your permissions and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };  // Toggle announcement status
  const toggleAnnouncementStatus = async (id: string, currentStatus: string) => {
    // Don't allow toggling mock/demo announcements
    if (id.startsWith('mock-') || id.startsWith('demo-') || id.startsWith('fallback-')) {
      toast({
        title: "Demo Mode",
        description: "This is demonstration data. Admin permissions are required for real announcements.",
        variant: "destructive"
      });
      return;
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.log('Database error when updating announcement status:', error.message);
        
        if (error.message.includes('permission denied') || error.message.includes('RLS')) {
          toast({
            title: "Permission Error",
            description: "You don't have sufficient permissions to modify announcements. Please ensure you're logged in as an admin.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Database Error",
            description: `Failed to update announcement: ${error.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      // Update local state
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === id 
            ? { ...announcement, status: newStatus }
            : announcement
        )
      );

      toast({
        title: "Success",
        description: `Announcement ${newStatus === 'active' ? 'activated' : 'deactivated'}`
      });

    } catch (error) {
      console.error('Error updating announcement status:', error);
      toast({
        title: "Error",
        description: "Failed to update announcement. Please check your permissions and try again.",
        variant: "destructive"
      });
    }
  };
  // Handle file downloads and views
  const handleViewDetails = (booking: any) => {
    toast({
      title: "Booking Details",
      description: `Viewing details for booking ${booking.id}`
    });
  };

  const handleDownloadFiles = (booking: any) => {
    if (booking.files && booking.files.length > 0) {
      booking.files.forEach((file: any) => {
        if (file.url) {
          const link = document.createElement('a');
          link.href = file.url;
          link.download = file.name || 'document';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
      toast({
        title: "Downloads Started",
        description: `Downloading ${booking.files.length} file(s)`
      });
    }
  };

  useEffect(() => {
    fetchSharedFiles();
    fetchAnnouncements();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content & Platform Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>      {/* Database & Permission Status Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">System Status</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Some features may be in demonstration mode due to permissions or database configuration:
              </p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li><strong>Admin Permissions:</strong> Ensure you're logged in with an admin account to create announcements</li>
                <li><strong>Database RLS:</strong> Row Level Security policies may need adjustment for admin access</li>
                <li><strong>Migration Status:</strong> Verify that migration <code className="bg-amber-100 px-1 rounded">20250822180000_add_shared_documents_to_bookings.sql</code> is applied</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="shared-files" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="shared-files">Shared Files</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>        </TabsList>
        
        <TabsContent value="shared-files" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <File className="mr-2 h-5 w-5" />
                Files Shared During Bookings & Job Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Researcher</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>                  {sharedFiles.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.studentName}</TableCell>
                      <TableCell>{booking.researcherName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{booking.serviceName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {booking.files.map((file, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="text-blue-600 hover:underline cursor-pointer">
                                {file.name || file.url || 'Document'}
                              </span>
                              {file.size && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(booking.uploadDate).toLocaleDateString()}</TableCell>                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="View Details"
                            onClick={() => handleViewDetails(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            title="Download Files" 
                            disabled={!booking.files.some(f => f.url)}
                            onClick={() => handleDownloadFiles(booking)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {sharedFiles.length === 0 && (
                  <TableBody>                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No shared files found. Files will appear here when users share documents during bookings.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Announcements & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div></div>
                <Dialog open={showCreateAnnouncement} onOpenChange={setShowCreateAnnouncement}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Announcement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="Announcement title"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                          placeholder="Announcement content"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Target Audience</label>
                        <Select value={newAnnouncement.target_audience} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, target_audience: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="students">Students</SelectItem>
                            <SelectItem value="researchers">Researchers</SelectItem>
                            <SelectItem value="research_aids">Research Aids</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select value={newAnnouncement.priority} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Expires At (Optional)</label>
                        <Input
                          type="datetime-local"
                          value={newAnnouncement.expires_at}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, expires_at: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={createAnnouncement} disabled={loading} className="flex-1">
                          <Send className="mr-2 h-4 w-4" />
                          {loading ? 'Creating...' : 'Create Announcement'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{announcement.content}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{announcement.target_audience}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          announcement.priority === 'urgent' ? 'destructive' :
                          announcement.priority === 'high' ? 'default' : 
                          'secondary'
                        }>
                          {announcement.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={announcement.status === "active" ? "default" : "secondary"}>
                          {announcement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(announcement.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleAnnouncementStatus(announcement.id, announcement.status)}
                          >
                            {announcement.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {announcements.length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No announcements found. Create your first announcement to get started.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blog" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Blog & Articles Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div></div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog Post
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Publish Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.views}</TableCell>
                      <TableCell>{post.publishDate || "Not published"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          {post.status === "draft" ? (
                            <Button size="sm">Publish</Button>
                          ) : (
                            <Button size="sm" variant="outline">Unpublish</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5" />
                Video Tutorials & Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div></div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoTutorials.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell>{video.duration}</TableCell>
                      <TableCell>{video.views}</TableCell>
                      <TableCell>
                        <Badge variant="default">{video.status}</Badge>
                      </TableCell>
                      <TableCell>{video.uploadDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Analytics</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Research Templates Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div></div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Template
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {researchTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.category}</Badge>
                      </TableCell>
                      <TableCell>{template.downloads}</TableCell>
                      <TableCell>{template.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Download</Button>
                          <Button size="sm" variant="outline">Replace</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
