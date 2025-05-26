
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MapPin, Star, Clock, Circle, CheckCircle, Users, Shield, MessageSquare, FileText, BarChart, Globe, Edit, Mic, BookOpen, Palette, Languages } from "lucide-react";

const ResearchAids = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Services" },
    { value: "statistics", label: "Statistics" },
    { value: "gis", label: "GIS Specialists" },
    { value: "editing", label: "Academic Editing" },
    { value: "research-assistants", label: "Research Assistants" },
    { value: "transcription", label: "Transcription" },
    { value: "publishing", label: "Publishing Support" },
    { value: "survey-tools", label: "Survey Tools" },
    { value: "design", label: "Design & Visualization" },
    { value: "translation", label: "Translation" }
  ];

  const researchAidServices = [
    {
      title: "Statisticians",
      icon: BarChart,
      description: "Data analysis (SPSS, R, STATA), model building, interpretation, consultations",
      category: "statistics"
    },
    {
      title: "GIS Specialists", 
      icon: Globe,
      description: "Map creation, spatial analysis, remote sensing, GIS data visualization",
      category: "gis"
    },
    {
      title: "Academic Editors",
      icon: Edit,
      description: "Proofreading, formatting, language polishing, plagiarism checks",
      category: "editing"
    },
    {
      title: "Research Assistants",
      icon: Users,
      description: "Data collection (field or online), survey administration, transcription",
      category: "research-assistants"
    },
    {
      title: "Transcribers",
      icon: Mic,
      description: "Converting interview audio into clean text; coding where needed",
      category: "transcription"
    },
    {
      title: "Publishers / Advisors",
      icon: BookOpen,
      description: "Journal submission support, peer review readiness, open access guidance",
      category: "publishing"
    },
    {
      title: "Survey Tool Experts",
      icon: FileText,
      description: "ODK, KoboToolbox, SurveyMonkey setup, custom questionnaire building",
      category: "survey-tools"
    },
    {
      title: "Design & Visualization",
      icon: Palette,
      description: "Infographics, charts, diagrams, research posters, presentation design",
      category: "design"
    },
    {
      title: "Translators",
      icon: Languages,
      description: "Translating research abstracts or instruments into local/international languages",
      category: "translation"
    }
  ];

  const getStatusIcon = (status: "online" | "offline" | "in-session") => {
    switch (status) {
      case "online":
        return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
      case "offline":
        return <Circle className="h-3 w-3 fill-gray-500 text-gray-500" />;
      case "in-session":
        return <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />;
      default:
        return <Circle className="h-3 w-3 fill-gray-500 text-gray-500" />;
    }
  };

  const researchAids = [
    {
      id: 1,
      name: "Dr. Marie Ngono",
      category: "statistics",
      title: "Statistical Analysis Expert",
      location: "Yaoundé, Cameroon",
      rating: 4.9,
      reviews: 127,
      image: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      skills: ["SPSS", "R", "STATA", "Data Analysis"],
      hourlyRate: "15,000 FCFA/hour",
      availability: "Available",
      onlineStatus: "online" as const
    },
    {
      id: 2,
      name: "Prof. James Asong",
      category: "gis",
      title: "GIS & Remote Sensing Specialist",
      location: "Buea, Cameroon",
      rating: 4.8,
      reviews: 89,
      image: "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
      skills: ["ArcGIS", "QGIS", "Remote Sensing", "Spatial Analysis"],
      hourlyRate: "18,000 FCFA/hour",
      availability: "Busy",
      onlineStatus: "in-session" as const
    },
    {
      id: 3,
      name: "Dr. Fatima Bello",
      category: "editing",
      title: "Academic Editor & Language Specialist",
      location: "Douala, Cameroon",
      rating: 4.7,
      reviews: 156,
      image: "/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png",
      skills: ["Proofreading", "Academic Writing", "Language Editing", "Formatting"],
      hourlyRate: "12,000 FCFA/hour",
      availability: "Available",
      onlineStatus: "online" as const
    }
  ];

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = aid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aid.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || aid.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Find Specialized Assistance For Your Research Projects, When You Need It Most
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Find and hire verified research professionals to help you with data analysis, GIS mapping, transcription, publishing, editing, and more — all in one platform built for serious students and researchers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Browse Research Aids
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Post a Task
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Precision Help, On-Demand</h3>
                <p className="text-gray-600">Get matched with statisticians, editors, GIS experts, and more — exactly when you need them.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Experts Only</h3>
                <p className="text-gray-600">Every Research Aid is vetted based on academic credentials and relevant experience.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Seamless Collaboration</h3>
                <p className="text-gray-600">Chat, share files, and manage tasks directly on ScholarConnect's secure platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg">Four simple steps to get expert help with your research</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-lg font-semibold mb-2">Post Your Task</h3>
                <p className="text-gray-600 text-sm">Describe the help you need and available budget: editing a thesis chapter, analysing survey data, designing a map, etc.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-lg font-semibold mb-2">Get Matched</h3>
                <p className="text-gray-600 text-sm">Browse expert profiles or receive suggested matches based on your task type.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-lg font-semibold mb-2">Hire & Collaborate</h3>
                <p className="text-gray-600 text-sm">Agree on price and timeline. Chat, share documents, and track progress right from your dashboard. Then make payment before they commence work.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="text-lg font-semibold mb-2">Approve & Review</h3>
                <p className="text-gray-600 text-sm">Once the job is complete, approve delivery and leave a rating. The expert gets paid, you get results.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Research Aids */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Types of Research Aids Available</h2>
              <p className="text-gray-600 text-lg">Specialized expertise across all research domains</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchAidServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Search and Browse Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Browse Available Research Aids</h2>
              <p className="text-gray-600">Find the perfect expert for your project</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by name, expertise, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAids.map((aid) => (
                <Card key={aid.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={aid.image} alt={aid.name} />
                          <AvatarFallback>{aid.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          {getStatusIcon(aid.onlineStatus)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{aid.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-2">{aid.title}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {aid.location}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{aid.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({aid.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {aid.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {aid.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{aid.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {aid.hourlyRate}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={aid.availability === "Available" ? "default" : "secondary"}
                          className={aid.availability === "Available" ? "bg-green-100 text-green-800" : ""}
                        >
                          {aid.availability}
                        </Badge>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">"My thesis transcription was done in 48 hours — affordable and high quality!"</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Sarah T.</p>
                      <p className="text-sm text-gray-500">PhD Student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">"The statistician helped me correct my SPSS output and even explained it in simple terms."</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Michael K.</p>
                      <p className="text-sm text-gray-500">Master's Student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Are these services allowed by my university?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Yes, getting help with data analysis, editing, transcription, and other research support services is generally acceptable. Always check your institution's academic integrity policies to ensure compliance.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What if I'm not satisfied with the work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">We offer a satisfaction guarantee. If you're not happy with the delivered work, you can request revisions or get a full refund through our dispute resolution process.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How secure are my documents and data?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">All data transfers are encrypted end-to-end, and we maintain strict confidentiality agreements with all research aids. Your intellectual property is fully protected.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Want to become a Research Aid?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join our network of verified experts and help researchers achieve their goals while earning income
              </p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <a href="/research-aid-signup">Apply Now</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAids;
