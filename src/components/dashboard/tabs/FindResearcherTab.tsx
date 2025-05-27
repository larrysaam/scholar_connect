import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Filter, Users, Award, BookOpen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Researcher {
  id: string;
  name: string;
  title: string;
  institution: string;
  field: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  featured: boolean;
}

const FindResearcherTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const navigate = useNavigate();

  const [featuredResearchers] = useState<Researcher[]>([
    {
      id: "1",
      name: "Dr. Marie Ngono Abega",
      title: "Senior Research Fellow",
      institution: "University of Yaoundé I",
      field: "Geographic Information Systems",
      specializations: ["Remote Sensing", "Spatial Analysis", "Environmental Modeling"],
      rating: 4.9,
      reviewCount: 47,
      hourlyRate: 15000,
      location: "Cameroon",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: true
    },
    {
      id: "2",
      name: "Prof. James Akinyemi",
      title: "Professor of Public Health",
      institution: "University of Lagos",
      field: "Epidemiology",
      specializations: ["Disease Surveillance", "Health Policy", "Biostatistics"],
      rating: 4.8,
      reviewCount: 32,
      hourlyRate: 18000,
      location: "Nigeria",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: true
    },
    {
      id: "3",
      name: "Dr. Fatima Al-Rashid",
      title: "Research Scientist",
      institution: "American University of Cairo",
      field: "Computer Science",
      specializations: ["Machine Learning", "Data Science", "AI Ethics"],
      rating: 4.7,
      reviewCount: 28,
      hourlyRate: 12000,
      location: "Egypt",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: true
    }
  ]);

  const [allResearchers] = useState<Researcher[]>([
    ...featuredResearchers,
    {
      id: "4",
      name: "Dr. Sarah Osei",
      title: "Associate Professor",
      institution: "University of Ghana",
      field: "Economics",
      specializations: ["Development Economics", "Poverty Analysis"],
      rating: 4.6,
      reviewCount: 19,
      hourlyRate: 14000,
      location: "Ghana",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: false
    }
  ]);

  const filteredResearchers = allResearchers.filter(researcher => {
    const matchesSearch = searchQuery === "" || 
      researcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      researcher.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      researcher.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesField = selectedField === "all" || researcher.field === selectedField;
    
    return matchesSearch && matchesField;
  });

  const ResearcherCard = ({ researcher }: { researcher: Researcher }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={researcher.imageUrl} 
              alt={researcher.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />
            {researcher.featured && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Award className="h-3 w-3 text-yellow-800" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{researcher.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{researcher.title}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {researcher.institution}
                </p>
              </div>
              {researcher.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                {researcher.field}
              </Badge>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{researcher.location}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {researcher.specializations.map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {spec}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{researcher.rating}</span>
                  <span className="text-sm text-gray-500">({researcher.reviewCount})</span>
                </div>
                <div className="text-sm font-bold text-green-600">
                  {researcher.hourlyRate.toLocaleString()} XAF/hr
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate(`/researcher/${researcher.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Find Expert Researchers</h2>
        <p className="text-gray-600">Connect with verified academic experts for personalized research guidance</p>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-500" />
              <Input
                placeholder="Search by name, topic, institution, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Research Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="Geographic Information Systems">GIS</SelectItem>
                  <SelectItem value="Epidemiology">Epidemiology</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-10000">0 - 10,000 XAF</SelectItem>
                  <SelectItem value="10000-15000">10,000 - 15,000 XAF</SelectItem>
                  <SelectItem value="15000+">15,000+ XAF</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center border-blue-100">
          <CardContent className="p-4">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Expert Researchers</div>
          </CardContent>
        </Card>
        <Card className="text-center border-blue-100">
          <CardContent className="p-4">
            <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-sm text-gray-600">Research Fields</div>
          </CardContent>
        </Card>
        <Card className="text-center border-blue-100">
          <CardContent className="p-4">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Experts */}
      {searchQuery === "" && selectedField === "all" && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            Featured Experts
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featuredResearchers.map((researcher) => (
              <ResearcherCard key={researcher.id} researcher={researcher} />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {searchQuery || selectedField !== "all" ? "Search Results" : "All Researchers"} 
          <span className="text-gray-500 font-normal ml-2">({filteredResearchers.length} found)</span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredResearchers.map((researcher) => (
            <ResearcherCard key={researcher.id} researcher={researcher} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindResearcherTab;
