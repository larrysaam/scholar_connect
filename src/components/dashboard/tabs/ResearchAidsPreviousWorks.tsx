
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Eye, Download, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsPreviousWorks = () => {
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkDescription, setNewWorkDescription] = useState("");
  const [newWorkCategory, setNewWorkCategory] = useState("");
  const { toast } = useToast();

  const previousWorks = [
    {
      id: 1,
      title: "Statistical Analysis of Student Performance Data",
      description: "Comprehensive analysis of academic performance patterns using SPSS and R",
      category: "Statistical Analysis",
      rating: 4.8,
      clientFeedback: "Excellent work with clear insights and professional presentation. Dr. Neba delivered beyond expectations.",
      completedDate: "2024-01-15",
      client: "Dr. Sarah Johnson",
      university: "University of Yaoundé I",
      tags: ["SPSS", "R Programming", "Education Research"],
      previewImage: "/placeholder-image.jpg"
    },
    {
      id: 2,
      title: "Systematic Literature Review on Climate Change Adaptation",
      description: "Conducted comprehensive review of 150+ papers on climate adaptation strategies in Sub-Saharan Africa",
      category: "Literature Review",
      rating: 4.9,
      clientFeedback: "Outstanding literature review with excellent synthesis of complex information. Highly recommended.",
      completedDate: "2024-01-08",
      client: "Prof. Michael Chen",
      university: "University of Douala",
      tags: ["Climate Change", "Systematic Review", "Environmental Science"],
      previewImage: "/placeholder-image.jpg"
    },
    {
      id: 3,
      title: "Qualitative Research on Rural Healthcare Access",
      description: "Field research and analysis of healthcare accessibility in rural Cameroon communities",
      category: "Qualitative Research",
      rating: 4.7,
      clientFeedback: "Thorough fieldwork and insightful analysis. Dr. Neba's expertise in qualitative methods is evident.",
      completedDate: "2023-12-20",
      client: "Dr. Marie Dubois",
      university: "University of Buea",
      tags: ["Qualitative Methods", "Healthcare", "Field Research"],
      previewImage: "/placeholder-image.jpg"
    },
    {
      id: 4,
      title: "Meta-Analysis of Educational Interventions",
      description: "Statistical meta-analysis of 45 studies on educational intervention effectiveness",
      category: "Meta-Analysis",
      rating: 4.6,
      clientFeedback: "Solid methodological approach and clear presentation of complex statistical concepts.",
      completedDate: "2023-12-10",
      client: "Dr. James Njoku",
      university: "University of Bamenda",
      tags: ["Meta-Analysis", "Education", "Statistical Methods"],
      previewImage: "/placeholder-image.jpg"
    }
  ];

  const handleAddWork = () => {
    if (!newWorkTitle.trim() || !newWorkDescription.trim() || !newWorkCategory.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Work Added",
      description: "Your previous work has been added to your portfolio"
    });
    setNewWorkTitle("");
    setNewWorkDescription("");
    setNewWorkCategory("");
  };

  const handleDeleteWork = (workId: number, title: string) => {
    toast({
      title: "Work Removed",
      description: `"${title}" has been removed from your portfolio`
    });
  };

  const averageRating = previousWorks.reduce((sum, work) => sum + work.rating, 0) / previousWorks.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Previous Works Portfolio</h2>
          <p className="text-gray-600">Showcase your completed projects to attract new clients</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Work
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Previous Work</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="work-title">Title *</Label>
                <Input
                  id="work-title"
                  placeholder="Enter work title"
                  value={newWorkTitle}
                  onChange={(e) => setNewWorkTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="work-description">Description *</Label>
                <Textarea
                  id="work-description"
                  placeholder="Describe the work you completed..."
                  value={newWorkDescription}
                  onChange={(e) => setNewWorkDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="work-category">Category *</Label>
                <Input
                  id="work-category"
                  placeholder="e.g., Statistical Analysis, Literature Review"
                  value={newWorkCategory}
                  onChange={(e) => setNewWorkCategory(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="work-image">Preview Image</Label>
                <Input
                  id="work-image"
                  type="file"
                  accept="image/*"
                />
              </div>
              <div>
                <Label htmlFor="work-file">Attach Sample File (optional)</Label>
                <Input
                  id="work-file"
                  type="file"
                />
              </div>
              <Button onClick={handleAddWork} className="w-full">
                Add Work to Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{previousWorks.length}</p>
              <p className="text-sm text-gray-600">Completed Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">100%</p>
              <p className="text-sm text-gray-600">Client Satisfaction</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previous Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousWorks.map((work) => (
          <Card key={work.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{work.title}</CardTitle>
                  <Badge variant="secondary" className="mb-2">
                    {work.category}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteWork(work.id, work.title)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Preview Image */}
              <div className="mb-3">
                <img
                  src={work.previewImage}
                  alt={work.title}
                  className="w-full h-32 object-cover rounded-md bg-gray-200"
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{work.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {work.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(work.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">{work.rating}/5</span>
              </div>
              
              {/* Client Feedback */}
              <blockquote className="text-sm italic text-gray-600 mb-3 border-l-2 border-gray-200 pl-3">
                "{work.clientFeedback}"
              </blockquote>
              
              {/* Project Details */}
              <div className="text-xs text-gray-500 mb-3">
                <p>Client: {work.client}</p>
                <p>Institution: {work.university}</p>
                <p>Completed: {new Date(work.completedDate).toLocaleDateString()}</p>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResearchAidsPreviousWorks;
