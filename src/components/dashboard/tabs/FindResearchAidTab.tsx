
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Filter, Users, Award, BookOpen, Eye, MessageCircle } from "lucide-react";

interface ResearchAid {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  completedJobs: number;
  responseTime: string;
  featured: boolean;
}

const FindResearchAidTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const [researchAids] = useState<ResearchAid[]>([
    {
      id: "1",
      name: "Sarah Mballa",
      title: "Statistics & Data Analysis Specialist",
      specializations: ["SPSS", "R Programming", "Survey Analysis"],
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 8000,
      location: "Cameroon",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      completedJobs: 89,
      responseTime: "< 2 hours",
      featured: true
    },
    {
      id: "2",
      name: "Jean-Claude Fokou",
      title: "Academic Editor & Translator",
      specializations: ["Academic Writing", "French-English Translation", "APA Style"],
      rating: 4.8,
      reviewCount: 95,
      hourlyRate: 6000,
      location: "Cameroon",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      completedJobs: 156,
      responseTime: "< 1 hour",
      featured: true
    },
    {
      id: "3",
      name: "Marie Tchounga",
      title: "GIS & Mapping Expert",
      specializations: ["ArcGIS", "QGIS", "Remote Sensing"],
      rating: 4.7,
      reviewCount: 73,
      hourlyRate: 10000,
      location: "Cameroon",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      completedJobs: 64,
      responseTime: "< 4 hours",
      featured: false
    }
  ]);

  const categories = [
    "Statistics & Data Analysis",
    "Academic Editing",
    "GIS Specialists",
    "Research Assistants",
    "Transcription Services",
    "Translation Services",
    "Literature Review",
    "Data Collection",
    "Report Writing"
  ];

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = searchQuery === "" || 
      aid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || aid.title.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const ResearchAidCard = ({ aid }: { aid: ResearchAid }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={aid.imageUrl} 
              alt={aid.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
            />
            {aid.featured && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Award className="h-3 w-3 text-yellow-800" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{aid.name}</h3>
                <p className="text-sm text-green-600 font-medium">{aid.title}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {aid.location}
                </p>
              </div>
              {aid.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {aid.specializations.map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                  {spec}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{aid.rating}</span>
                  <span className="text-sm text-gray-500">({aid.reviewCount})</span>
                </div>
                <div className="text-sm text-gray-600">
                  {aid.completedJobs} jobs completed
                </div>
              </div>
              <div className="text-sm font-bold text-green-600">
                {aid.hourlyRate.toLocaleString()} XAF/hr
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Response time: {aid.responseTime}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Eye className="h-4 w-4 mr-1" />
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Find Research Aids</h2>
        <p className="text-gray-600">Connect with skilled research aids to help with specific tasks and projects</p>
      </div>

      {/* Search and Filters */}
      <Card className="border-green-100 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-green-500" />
              <Input
                placeholder="Search by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-green-200 focus:border-green-400"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-green-200">
                  <SelectValue placeholder="Service Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="border-green-200">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-5000">0 - 5,000 XAF</SelectItem>
                  <SelectItem value="5000-10000">5,000 - 10,000 XAF</SelectItem>
                  <SelectItem value="10000+">10,000+ XAF</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center border-green-100">
          <CardContent className="p-4">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">200+</div>
            <div className="text-sm text-gray-600">Active Research Aids</div>
          </CardContent>
        </Card>
        <Card className="text-center border-green-100">
          <CardContent className="p-4">
            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">15+</div>
            <div className="text-sm text-gray-600">Service Categories</div>
          </CardContent>
        </Card>
        <Card className="text-center border-green-100">
          <CardContent className="p-4">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.7</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Available Research Aids
          <span className="text-gray-500 font-normal ml-2">({filteredAids.length} found)</span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAids.map((aid) => (
            <ResearchAidCard key={aid.id} aid={aid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindResearchAidTab;
