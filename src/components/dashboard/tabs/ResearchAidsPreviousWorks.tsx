import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Calendar, FileText, Download, Eye, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsPreviousWorks = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    category: "",
    institution: "",
    duration: "",
    outcomes: ""
  });
  const { toast } = useToast();

  const platformWorks = [
    {
      id: 1,
      title: "Statistical Analysis for Agricultural Study",
      client: "Dr. Sarah Johnson",
      clientAvatar: "/placeholder-avatar.jpg",
      completedDate: "2024-01-15",
      duration: "3 weeks",
      rating: 5,
      review: "Excellent work on the statistical analysis. Very thorough and professional.",
      tags: ["Statistics", "Agriculture", "Data Analysis"],
      deliverables: ["Final Report", "SPSS Output", "Presentation"],
      projectValue: "75,000 XAF"
    },
    {
      id: 2,
      title: "Literature Review on Climate Change",
      client: "Prof. Michael Chen",
      clientAvatar: "/placeholder-avatar.jpg",
      completedDate: "2024-01-08",
      duration: "2 weeks",
      rating: 4,
      review: "Good quality literature review with comprehensive coverage of recent studies.",
      tags: ["Literature Review", "Climate Change", "Environmental Science"],
      deliverables: ["Literature Review Document", "Bibliography", "Summary"],
      projectValue: "50,000 XAF"
    },
    {
      id: 3,
      title: "Survey Data Collection",
      client: "Dr. Marie Dubois",
      clientAvatar: "/placeholder-avatar.jpg",
      completedDate: "2023-12-20",
      duration: "4 weeks",
      rating: 5,
      review: "Outstanding data collection work. Very organized and efficient.",
      tags: ["Data Collection", "Surveys", "Field Work"],
      deliverables: ["Raw Data", "Data Entry", "Quality Report"],
      projectValue: "120,000 XAF"
    }
  ];

  const prePlatformWorks = [
    {
      id: 1,
      title: "PhD Dissertation Research Support",
      institution: "University of Yaoundé I",
      completedDate: "2023-06-15",
      duration: "6 months",
      description: "Provided comprehensive research support for doctoral dissertation on agricultural productivity in Cameroon.",
      tags: ["PhD Support", "Agricultural Research", "Statistical Analysis"],
      outcomes: ["Successful PhD Defense", "2 Publications", "Conference Presentation"]
    },
    {
      id: 2,
      title: "Research Project for Ministry of Agriculture",
      institution: "Ministry of Agriculture",
      completedDate: "2023-03-10",
      duration: "4 months",
      description: "Conducted impact assessment study on agricultural extension programs in rural communities.",
      tags: ["Impact Assessment", "Government Project", "Rural Development"],
      outcomes: ["Policy Recommendations", "Government Report", "Community Feedback"]
    },
    {
      id: 3,
      title: "NGO Research Initiative",
      institution: "Green Earth Foundation",
      completedDate: "2022-11-20",
      duration: "3 months",
      description: "Led research on sustainable farming practices and their economic impact on smallholder farmers.",
      tags: ["Sustainability", "NGO", "Economic Impact"],
      outcomes: ["Research Report", "Training Materials", "Impact Metrics"]
    }
  ];

  const handleAddWork = () => {
    if (!newWork.title.trim() || !newWork.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Work Added",
      description: "Your previous work has been added to your portfolio"
    });
    setNewWork({ title: "", description: "", category: "", institution: "", duration: "", outcomes: "" });
    setIsAddWorkOpen(false);
  };

  const handleViewDetails = (workId: number, type: string) => {
    toast({
      title: "View Details",
      description: `Viewing details for work ID: ${workId}`
    });
  };

  const handleDownloadPortfolio = (workId: number, title: string) => {
    toast({
      title: "Download Started",
      description: `Downloading portfolio for: ${title}`
    });
  };

  const handleViewCertificate = (workId: number, title: string) => {
    toast({
      title: "Certificate Viewer",
      description: `Opening certificate for: ${title}`
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Previous Works</h2>
        <div className="flex space-x-2">
          <Dialog open={isAddWorkOpen} onOpenChange={setIsAddWorkOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Include Previous Work
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Previous Work</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={newWork.title}
                      onChange={(e) => setNewWork(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newWork.category}
                      onChange={(e) => setNewWork(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Research, Analysis"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newWork.description}
                    onChange={(e) => setNewWork(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the project and your role"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution">Institution/Client</Label>
                    <Input
                      id="institution"
                      value={newWork.institution}
                      onChange={(e) => setNewWork(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="Organization name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={newWork.duration}
                      onChange={(e) => setNewWork(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 3 months"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="outcomes">Key Outcomes</Label>
                  <Textarea
                    id="outcomes"
                    value={newWork.outcomes}
                    onChange={(e) => setNewWork(prev => ({ ...prev, outcomes: e.target.value }))}
                    placeholder="List key achievements or deliverables"
                    rows={2}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddWork} className="flex-1">
                    Add Work
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddWorkOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant={activeTab === "platform" ? "default" : "outline"} 
            onClick={() => setActiveTab("platform")}
          >
            Platform Projects
          </Button>
          <Button 
            variant={activeTab === "pre-platform" ? "default" : "outline"} 
            onClick={() => setActiveTab("pre-platform")}
          >
            Previous Experience
          </Button>
        </div>
      </div>

      {activeTab === "platform" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {platformWorks.map((work) => (
              <Card key={work.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{work.title}</CardTitle>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={work.clientAvatar} alt={work.client} />
                          <AvatarFallback>{work.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{work.client}</p>
                          <div className="flex items-center space-x-1">
                            {renderStars(work.rating)}
                            <span className="text-sm text-gray-600 ml-2">({work.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-600">{work.projectValue}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Completed: {work.completedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Duration: {work.duration}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Client Review</h4>
                    <p className="text-gray-700 text-sm italic">"{work.review}"</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills & Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Deliverables</h4>
                    <div className="flex flex-wrap gap-2">
                      {work.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center space-x-1 text-sm bg-blue-50 px-2 py-1 rounded">
                          <FileText className="h-3 w-3 text-blue-600" />
                          <span>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(work.id, "platform")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadPortfolio(work.id, work.title)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "pre-platform" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {prePlatformWorks.map((work) => (
              <Card key={work.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{work.title}</CardTitle>
                    <p className="text-sm text-gray-600 font-medium">{work.institution}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Completed: {work.completedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Duration: {work.duration}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Project Description</h4>
                    <p className="text-gray-700 text-sm">{work.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Skills & Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Outcomes</h4>
                    <div className="flex flex-wrap gap-2">
                      {work.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-center space-x-1 text-sm bg-green-50 px-2 py-1 rounded">
                          <FileText className="h-3 w-3 text-green-600" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(work.id, "pre-platform")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCertificate(work.id, work.title)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{platformWorks.length}</p>
              <p className="text-sm text-gray-600">Platform Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{prePlatformWorks.length}</p>
              <p className="text-sm text-gray-600">Previous Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {(platformWorks.reduce((sum, work) => sum + work.rating, 0) / platformWorks.length).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {platformWorks.reduce((sum, work) => sum + parseInt(work.projectValue.replace(/[^\d]/g, '')), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Earnings (XAF)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsPreviousWorks;
