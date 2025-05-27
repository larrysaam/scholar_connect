
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Filter, Users, Award, BookOpen, Eye } from "lucide-react";

const ResearchAids = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const researchAids = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Statistical Analyst & Data Scientist",
      expertise: ["Data Analysis", "SPSS", "R Programming", "Statistical Modeling"],
      rating: 4.9,
      reviews: 45,
      hourlyRate: 12000,
      location: "South Africa",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: true,
      description: "Expert in statistical analysis with 8+ years of experience helping researchers with data interpretation and visualization."
    },
    {
      id: "2", 
      name: "Ahmed Hassan",
      title: "Academic Editor & Publisher",
      expertise: ["Academic Editing", "Publication Support", "Journal Submission", "Grant Writing"],
      rating: 4.8,
      reviews: 62,
      hourlyRate: 15000,
      location: "Egypt",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: true,
      description: "Professional academic editor with extensive experience in peer review and publication processes."
    },
    {
      id: "3",
      name: "Grace Okonkwo",
      title: "GIS Specialist & Field Data Collector",
      expertise: ["GIS Mapping", "Remote Sensing", "Field Data Collection", "Spatial Analysis"],
      rating: 4.7,
      reviews: 33,
      hourlyRate: 10000,
      location: "Nigeria",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: false,
      description: "Specialized in geographic information systems and environmental data collection across West Africa."
    },
    {
      id: "4",
      name: "Jean-Pierre Mukendi",
      title: "Research Assistant & Transcriber",
      expertise: ["Research Assistance", "Data Transcription", "Survey Design", "Qualitative Analysis"],
      rating: 4.6,
      reviews: 28,
      hourlyRate: 8000,
      location: "DR Congo",
      imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      featured: false,
      description: "Experienced research assistant fluent in French, English, and local languages."
    }
  ];

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = searchQuery === "" || 
      aid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesField = selectedField === "all" || aid.expertise.some(exp => exp.includes(selectedField));
    
    return matchesSearch && matchesField;
  });

  const ResearchAidCard = ({ aid }: { aid: typeof researchAids[0] }) => (
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
            
            <p className="text-sm text-gray-600 mb-3">{aid.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {aid.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{aid.rating}</span>
                  <span className="text-sm text-gray-500">({aid.reviews})</span>
                </div>
                <div className="text-sm font-bold text-green-600">
                  {aid.hourlyRate.toLocaleString()} XAF/hr
                </div>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Find Expert Research Aids</h1>
              <p className="text-xl text-green-100">
                Connect with skilled professionals for data analysis, editing, field work, and more
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select value={selectedField} onValueChange={setSelectedField}>
                      <SelectTrigger className="border-green-200">
                        <SelectValue placeholder="Expertise Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                        <SelectItem value="Academic Editing">Academic Editing</SelectItem>
                        <SelectItem value="GIS">GIS & Mapping</SelectItem>
                        <SelectItem value="Research">Research Assistance</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="border-green-200">
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
                      <SelectTrigger className="border-green-200">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Price</SelectItem>
                        <SelectItem value="0-10000">0 - 10,000 XAF</SelectItem>
                        <SelectItem value="10000-15000">10,000 - 15,000 XAF</SelectItem>
                        <SelectItem value="15000+">15,000+ XAF</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center border-green-100">
                <CardContent className="p-4">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Expert Research Aids</div>
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
          </div>
        </section>

        {/* Research Aids Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">
                Available Research Aids 
                <span className="text-gray-500 font-normal ml-2">({filteredAids.length} found)</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAids.map((aid) => (
                  <ResearchAidCard key={aid.id} aid={aid} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help with Your Research?</h2>
              <p className="text-gray-600 mb-8">
                Our expert research aids are ready to help you with data analysis, editing, field work, and more.
              </p>
              <div className="space-x-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Post a Job Request
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/research-aid-signup">Join as Research Aid</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAids;
