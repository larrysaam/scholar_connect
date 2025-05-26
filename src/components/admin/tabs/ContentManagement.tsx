
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, BookOpen, Bell, Plus } from "lucide-react";

const ContentManagement = () => {
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
  ];

  const announcements = [
    {
      id: 1,
      title: "Platform Maintenance Scheduled",
      message: "Scheduled maintenance on January 25th from 2-4 AM",
      targetAudience: "All Users",
      status: "scheduled",
      scheduledDate: "2024-01-25"
    },
    {
      id: 2,
      title: "New Research Aid Categories Available",
      message: "We've added GIS specialists and data visualization experts",
      targetAudience: "Students",
      status: "sent",
      scheduledDate: "2024-01-18"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content & Platform Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        
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
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Announcement
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{announcement.message}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{announcement.targetAudience}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={announcement.status === "sent" ? "default" : "secondary"}>
                          {announcement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{announcement.scheduledDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          {announcement.status === "scheduled" && (
                            <Button size="sm">Send Now</Button>
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
      </Tabs>
    </div>
  );
};

export default ContentManagement;
