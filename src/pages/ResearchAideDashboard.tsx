
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, DollarSign, Clock, FileText, Link, Image, Upload, Eye, MessageSquare } from "lucide-react";

const ResearchAideDashboard = () => {
  const [activeProjects, setActiveProjects] = useState([
    {
      id: 1,
      title: "GIS Analysis for Agricultural Study",
      client: "John Doe",
      budget: "$150",
      deadline: "2025-01-15",
      status: "In Progress",
      progress: 60
    },
    {
      id: 2,
      title: "Statistical Analysis for Healthcare Research",
      client: "Jane Smith", 
      budget: "$200",
      deadline: "2025-01-20",
      status: "Review",
      progress: 90
    }
  ]);

  const [portfolio, setPortfolio] = useState([
    {
      id: 1,
      title: "Economic Impact Analysis Dashboard",
      type: "link",
      url: "https://example.com/dashboard",
      description: "Interactive dashboard showing economic trends across West Africa",
      tags: ["GIS", "Data Visualization", "Economics"]
    },
    {
      id: 2,
      title: "Research Methodology Framework",
      type: "document",
      fileName: "methodology_framework.pdf",
      description: "Comprehensive guide for mixed-methods research in social sciences",
      tags: ["Methodology", "Research Design", "Social Sciences"]
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png" />
                <AvatarFallback>MN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Dr. Marie Ngono</h1>
                <p className="text-gray-600">GIS Specialist & Remote Sensing Expert</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">4.9</span>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">$2,450</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="jobs">Job Board</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Projects</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Completed Jobs</p>
                        <p className="text-2xl font-bold">127</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold">$12,350</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Rating</p>
                        <p className="text-2xl font-bold">4.9</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed "Statistical Analysis for Healthcare Research"</span>
                      <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">New message from John Doe</span>
                      <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Applied for "Data Visualization Project"</span>
                      <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{project.title}</h3>
                          <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Client: {project.client}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">{project.budget}</span>
                            <span className="text-sm text-gray-600">Due: {project.deadline}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Chat
                            </Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Portfolio</span>
                    <Button>Add Work Sample</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {portfolio.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold">{item.title}</h3>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.type === "link" ? (
                              <Link className="h-4 w-4 text-blue-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Statistical Analysis for Market Research</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Need help with SPSS analysis for consumer behavior study. Dataset of 500+ responses.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium">Budget: $120-180</span>
                          <span className="text-sm text-gray-600">Due: Jan 25, 2025</span>
                        </div>
                        <Button size="sm">Submit Proposal</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">GIS Mapping for Urban Planning Study</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Create detailed maps showing population density and infrastructure in Yaoundé.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium">Budget: $200-300</span>
                          <span className="text-sm text-gray-600">Due: Feb 5, 2025</span>
                        </div>
                        <Button size="sm">Submit Proposal</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                        <Input id="hourlyRate" defaultValue="45" />
                      </div>
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Select defaultValue="available">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="busy">Busy</SelectItem>
                            <SelectItem value="vacation">On Vacation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea 
                        id="bio" 
                        defaultValue="GIS Specialist with 8+ years of experience in remote sensing and spatial analysis..."
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <Button>Update Profile</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAideDashboard;
