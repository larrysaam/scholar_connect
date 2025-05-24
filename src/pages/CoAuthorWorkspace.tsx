
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, MessageSquare, Download, Save } from "lucide-react";

const CoAuthorWorkspace = () => {
  const [document, setDocument] = useState({
    title: "Impact of AI on Educational Research Methodologies",
    abstract: "This research explores how artificial intelligence is transforming traditional research methodologies in education...",
    content: "# Introduction\n\nArtificial Intelligence (AI) has emerged as a transformative force across various sectors, with education being no exception...",
    references: "1. Smith, J. (2023). AI in Education: A Comprehensive Review. Journal of Educational Technology.\n2. Brown, A. et al. (2022). Machine Learning Applications in Academic Research. Academic Press."
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Dr. Sarah Johnson",
      content: "Great introduction! Consider adding more recent statistics on AI adoption in education.",
      timestamp: "2024-01-15 10:30",
      section: "Introduction"
    },
    {
      id: 2,
      author: "Prof. Michael Chen",
      content: "The methodology section needs more detail on data collection procedures.",
      timestamp: "2024-01-15 14:20",
      section: "Methodology"
    }
  ]);

  const coAuthors = [
    { name: "Dr. Sarah Johnson", role: "Lead Author", status: "online", contributions: "Introduction, Literature Review" },
    { name: "Prof. Michael Chen", role: "Co-Author", status: "offline", contributions: "Methodology, Data Analysis" },
    { name: "Dr. Emily Rodriguez", role: "Contributing Author", status: "in-session", contributions: "Results, Discussion" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'in-session': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Co-Authoring Workspace</h1>
            <p className="text-gray-600">Collaborate on your research publication in real-time</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Document Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {document.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="abstract">Abstract</TabsTrigger>
                      <TabsTrigger value="references">References</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={document.title}
                            onChange={(e) => setDocument({...document, title: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            value={document.content}
                            onChange={(e) => setDocument({...document, content: e.target.value})}
                            className="mt-1 min-h-[400px]"
                            placeholder="Write your research content here..."
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="abstract" className="mt-4">
                      <div>
                        <Label htmlFor="abstract">Abstract</Label>
                        <Textarea
                          id="abstract"
                          value={document.abstract}
                          onChange={(e) => setDocument({...document, abstract: e.target.value})}
                          className="mt-1 min-h-[200px]"
                          placeholder="Write your abstract here..."
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="references" className="mt-4">
                      <div>
                        <Label htmlFor="references">References</Label>
                        <Textarea
                          id="references"
                          value={document.references}
                          onChange={(e) => setDocument({...document, references: e.target.value})}
                          className="mt-1 min-h-[300px]"
                          placeholder="Add your references here..."
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Publication Type</Label>
                          <select className="w-full mt-1 p-2 border rounded-md">
                            <option>Journal Article</option>
                            <option>Conference Paper</option>
                            <option>Book Chapter</option>
                            <option>Policy Paper</option>
                          </select>
                        </div>
                        <div>
                          <Label>Target Journal</Label>
                          <Input placeholder="Enter target journal name" className="mt-1" />
                        </div>
                        <div>
                          <Label>Submission Deadline</Label>
                          <Input type="date" className="mt-1" />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Co-Authors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Co-Authors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {coAuthors.map((author, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg border">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(author.status)}`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{author.name}</p>
                        <p className="text-xs text-gray-600">{author.role}</p>
                        <p className="text-xs text-gray-500">{author.contributions}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{comment.author}</p>
                        <Badge variant="outline" className="text-xs">{comment.section}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      <p className="text-xs text-gray-500">{comment.timestamp}</p>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <Textarea 
                      placeholder="Add a comment..." 
                      className="mb-2"
                      rows={3}
                    />
                    <Button size="sm" className="w-full">Add Comment</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Version History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Version History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>v1.3</span>
                      <span className="text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>v1.2</span>
                      <span className="text-gray-500">1 day ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>v1.1</span>
                      <span className="text-gray-500">3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoAuthorWorkspace;
