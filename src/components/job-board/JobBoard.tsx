
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, DollarSign, MapPin, User, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  duration: string;
  postedBy: string;
  postedDate: string;
  deadline: string;
  location: string;
  urgency: "low" | "medium" | "high";
  status: "open" | "in_progress" | "completed";
  skills: string[];
  applicants: number;
}

const JobBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const { toast } = useToast();

  const jobs: Job[] = [
    {
      id: "1",
      title: "Statistical Analysis for Climate Change Research",
      description: "Need help with SPSS analysis of climate data collected over 5 years. Require correlation analysis, regression modeling, and interpretation of results for my PhD thesis.",
      category: "Statistics",
      budget: 75000,
      duration: "2 weeks",
      postedBy: "Dr. Amina Kone",
      postedDate: "2024-01-15",
      deadline: "2024-02-01",
      location: "Remote",
      urgency: "high",
      status: "open",
      skills: ["SPSS", "Regression Analysis", "Climate Data", "Statistical Modeling"],
      applicants: 8
    },
    {
      id: "2",
      title: "GIS Mapping for Urban Planning Study",
      description: "Create detailed maps showing urban development patterns in Yaoundé. Need spatial analysis and visualization using ArcGIS or QGIS.",
      category: "GIS",
      budget: 120000,
      duration: "3 weeks",
      postedBy: "Prof. Jean Baptiste",
      postedDate: "2024-01-14",
      deadline: "2024-02-15",
      location: "Cameroon",
      urgency: "medium",
      status: "open",
      skills: ["ArcGIS", "QGIS", "Urban Planning", "Spatial Analysis"],
      applicants: 12
    },
    {
      id: "3",
      title: "Academic Editing for Journal Submission",
      description: "Need professional editing for a 8,000-word research paper on renewable energy. Paper is ready for submission to an international journal.",
      category: "Editing",
      budget: 45000,
      duration: "1 week",
      postedBy: "Dr. Sarah Mbeki",
      postedDate: "2024-01-13",
      deadline: "2024-01-25",
      location: "Remote",
      urgency: "high",
      status: "open",
      skills: ["Academic Editing", "Journal Standards", "Technical Writing", "Renewable Energy"],
      applicants: 15
    },
    {
      id: "4",
      title: "Survey Design and Data Collection",
      description: "Design a comprehensive survey for agricultural research and collect data from 200 farmers across 3 regions. Include questionnaire design and field data collection.",
      category: "Research Assistance",
      budget: 200000,
      duration: "6 weeks",
      postedBy: "Prof. Emmanuel Talla",
      postedDate: "2024-01-12",
      deadline: "2024-03-01",
      location: "Multi-region",
      urgency: "medium",
      status: "open",
      skills: ["Survey Design", "Data Collection", "Agricultural Research", "Field Work"],
      applicants: 6
    },
    {
      id: "5",
      title: "Interview Transcription - Qualitative Research",
      description: "Transcribe 15 hours of interviews in French and English. Interviews are about healthcare access in rural areas. Need verbatim transcription with timestamps.",
      category: "Transcription",
      budget: 60000,
      duration: "10 days",
      postedBy: "Dr. Grace Nyong",
      postedDate: "2024-01-11",
      deadline: "2024-01-30",
      location: "Remote",
      urgency: "medium",
      status: "open",
      skills: ["Transcription", "French", "English", "Healthcare Research"],
      applicants: 9
    },
    {
      id: "6",
      title: "Research Poster Design for Conference",
      description: "Create a professional research poster for presentation at the African Development Conference. Need compelling visual design with charts and infographics.",
      category: "Design",
      budget: 35000,
      duration: "5 days",
      postedBy: "Dr. Paul Biya",
      postedDate: "2024-01-10",
      deadline: "2024-01-22",
      location: "Remote",
      urgency: "high",
      status: "open",
      skills: ["Poster Design", "Infographics", "Academic Presentation", "Visual Design"],
      applicants: 11
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesUrgency = selectedUrgency === "all" || job.urgency === selectedUrgency;
    
    let matchesBudget = true;
    if (selectedBudget !== "all") {
      const [min, max] = selectedBudget.split("-").map(Number);
      if (max) {
        matchesBudget = job.budget >= min && job.budget <= max;
      } else {
        matchesBudget = job.budget >= min;
      }
    }
    
    return matchesSearch && matchesCategory && matchesUrgency && matchesBudget && job.status === "open";
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return <AlertCircle className="h-3 w-3" />;
      case "medium": return <Clock className="h-3 w-3" />;
      case "low": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleApplyToJob = (jobId: string, jobTitle: string) => {
    toast({
      title: "Application Submitted",
      description: `Your application for "${jobTitle}" has been submitted successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
          <p className="text-gray-600">Discover and apply to research assistance opportunities</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredJobs.length} jobs available
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <Input
                placeholder="Search jobs by title, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Statistics">Statistics</SelectItem>
                  <SelectItem value="GIS">GIS & Mapping</SelectItem>
                  <SelectItem value="Editing">Academic Editing</SelectItem>
                  <SelectItem value="Research Assistance">Research Assistance</SelectItem>
                  <SelectItem value="Transcription">Transcription</SelectItem>
                  <SelectItem value="Design">Design & Visualization</SelectItem>
                  <SelectItem value="Translation">Translation</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="0-50000">0 - 50,000 XAF</SelectItem>
                  <SelectItem value="50000-100000">50,000 - 100,000 XAF</SelectItem>
                  <SelectItem value="100000-200000">100,000 - 200,000 XAF</SelectItem>
                  <SelectItem value="200000">200,000+ XAF</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="w-full">
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <Badge className={`${getUrgencyColor(job.urgency)} flex items-center gap-1`}>
                      {getUrgencyIcon(job.urgency)}
                      {job.urgency} priority
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {job.postedBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.duration}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-2xl font-bold text-primary mb-1">
                    <DollarSign className="h-5 w-5" />
                    {job.budget.toLocaleString()} XAF
                  </div>
                  <div className="text-sm text-gray-500">{job.applicants} applicants</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-700 mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {job.category}
                </Badge>
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className="text-sm text-gray-500">
                  Posted on {new Date(job.postedDate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleApplyToJob(job.id, job.title)}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobBoard;
