
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Filter, Users, Award, BookOpen, Eye, CheckCircle, Clock, Shield, MessageCircle, FileText, Target, User, TrendingUp, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ResearchAids = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const serviceTypes = [
    {
      title: "Statisticians",
      services: "Data analysis (SPSS, R, STATA), model building, interpretation, consultations",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "GIS Specialists", 
      services: "Map creation, spatial analysis, remote sensing, GIS data visualization",
      icon: MapPin,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "Academic Editors",
      services: "Proofreading, formatting, language polishing, plagiarism checks", 
      icon: FileText,
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      title: "Research Assistants",
      services: "Data collection (field or online), survey administration, transcription",
      icon: Users,
      color: "bg-orange-50 text-orange-700 border-orange-200"
    },
    {
      title: "Transcribers",
      services: "Converting interview audio into clean text; coding where needed",
      icon: MessageCircle,
      color: "bg-pink-50 text-pink-700 border-pink-200"
    },
    {
      title: "Publishers / Advisors",
      services: "Journal submission support, peer review readiness, open access guidance",
      icon: BookOpen,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
      title: "Survey Tool Experts",
      services: "ODK, KoboToolbox, SurveyMonkey setup, custom questionnaire building",
      icon: Target,
      color: "bg-cyan-50 text-cyan-700 border-cyan-200"
    },
    {
      title: "Design & Visualization",
      services: "Infographics, charts, diagrams, research posters, presentation design",
      icon: Award,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200"
    },
    {
      title: "Translators",
      services: "Translating research abstracts or instruments into local/international languages",
      icon: Globe,
      color: "bg-red-50 text-red-700 border-red-200"
    }
  ];

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = searchQuery === "" || 
      aid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesField = selectedField === "all" || aid.expertise.some(exp => exp.includes(selectedField));
    
    return matchesSearch && matchesField;
  });

  const handleBrowseAids = () => {
    const aidsSection = document.getElementById('research-aids-listing');
    if (aidsSection) {
      aidsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePostTask = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post a task.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    // Navigate to task posting page
    navigate('/dashboard');
  };

  const handleBecomeResearchAid = () => {
    navigate('/research-aid-signup');
  };

  const handleViewProfile = (aidId: string) => {
    navigate(`/research-aid/${aidId}`);
  };

  const ResearchAidCard = ({ aid }: { aid: typeof researchAids[0] }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img 
              src={aid.imageUrl} 
              alt={aid.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            {aid.featured && (
              <div className="absolute -top-1 -right-1 bg-accent rounded-full p-1">
                <Award className="h-3 w-3 text-accent-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{aid.name}</h3>
                <p className="text-sm text-primary font-medium">{aid.title}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {aid.location}
                </p>
              </div>
              {aid.featured && (
                <Badge className="bg-accent text-accent-foreground border-0">
                  Featured
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{aid.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {aid.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
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
                <div className="text-sm font-bold text-primary">
                  {aid.hourlyRate.toLocaleString()} XAF/hr
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleViewProfile(aid.id)}
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Enhanced Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Find Specialized Assistance For Your Research Projects, When You Need It Most
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4">
                On-demand academic support from trusted specialists — from statisticians to editors.
              </p>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-4xl mx-auto">
                Find and hire verified research professionals to help you with data analysis, GIS mapping, transcription, publishing, editing, and more — all in one platform built for serious students and researchers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-50 px-8 py-3 text-lg"
                  onClick={handleBrowseAids}
                >
                  Browse Research Aids
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg"
                  onClick={handlePostTask}
                >
                  Post a Task
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Value Propositions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose ScholarConnect Research Aids?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Precision Help, On-Demand</h3>
                    <p className="text-gray-600">Get matched with statisticians, editors, GIS experts, and more — exactly when you need them.</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Verified Experts Only</h3>
                    <p className="text-gray-600">Every Research Aid is vetted based on academic credentials and relevant experience.</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Seamless Collaboration</h3>
                    <p className="text-gray-600">Chat, share files, and manage tasks directly on ScholarConnect's secure platform.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h3 className="text-lg font-semibold mb-3">Post Your Task</h3>
                  <p className="text-gray-600 text-sm">Describe the help you need and available budget: editing a thesis chapter, analysing survey data, designing a map, etc.</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h3 className="text-lg font-semibold mb-3">Get Matched</h3>
                  <p className="text-gray-600 text-sm">Browse expert profiles or receive suggested matches based on your task type.</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h3 className="text-lg font-semibold mb-3">Hire & Collaborate</h3>
                  <p className="text-gray-600 text-sm">Agree on price and timeline. Chat, share documents, and track progress right from your dashboard. Then make payment before they commence work.</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                  <h3 className="text-lg font-semibold mb-3">Approve & Review</h3>
                  <p className="text-gray-600 text-sm">Once the job is complete, approve delivery and leave a rating. The expert gets paid, you get results.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Research Aids */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Types of Research Aids Available</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceTypes.map((service, index) => (
                  <Card key={index} className={`border-2 ${service.color} hover:shadow-lg transition-shadow`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <service.icon className="h-6 w-6" />
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{service.services}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="border-primary/20 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-primary" />
                    <Input
                      placeholder="Search by name, skills, or expertise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 border-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select value={selectedField} onValueChange={setSelectedField}>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue placeholder="Expertise Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        <SelectItem value="Statistician">Statistician</SelectItem>
                        <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                        <SelectItem value="Academic Editing">Academic Editing</SelectItem>
                        <SelectItem value="GIS">GIS & Mapping</SelectItem>
                        <SelectItem value="Research">Research Assistance</SelectItem>
                        <SelectItem value="Translators">Translators</SelectItem>
                        <SelectItem value="Design & Visualization">Design & Visualization</SelectItem>
                        <SelectItem value="Transcribers">Transcribers</SelectItem>
                        <SelectItem value="Publishers / Advisors">Publishers / Advisors</SelectItem>
                        <SelectItem value="Survey Tool Experts">Survey Tool Experts</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="mandarin">Mandarin</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Price</SelectItem>
                        <SelectItem value="0-10000">0 - 10,000 XAF</SelectItem>
                        <SelectItem value="10000-15000">10,000 - 15,000 XAF</SelectItem>
                        <SelectItem value="15000+">15,000+ XAF</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
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
              <Card className="text-center border-primary/20">
                <CardContent className="p-4">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Expert Research Aids</div>
                </CardContent>
              </Card>
              <Card className="text-center border-primary/20">
                <CardContent className="p-4">
                  <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Service Categories</div>
                </CardContent>
              </Card>
              <Card className="text-center border-primary/20">
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
        <section id="research-aids-listing" className="py-16">
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

        {/* Testimonials */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </div>
                    <p className="text-gray-700 mb-4">"My thesis transcription was done in 48 hours — affordable and high quality!"</p>
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">Dr. Marie Kouadio</p>
                        <p className="text-sm text-gray-500">PhD Student, University of Abidjan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </div>
                    <p className="text-gray-700 mb-4">"The statistician helped me correct my SPSS output and even explained it in simple terms."</p>
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">James Osei</p>
                        <p className="text-sm text-gray-500">Research Fellow, University of Ghana</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">Are these services allowed by my university?</h3>
                    <p className="text-gray-600">Most universities allow academic support services like editing, statistical consultation, and data transcription. However, we recommend checking your institution's academic integrity policies to ensure compliance.</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">What if I'm not satisfied with the work?</h3>
                    <p className="text-gray-600">We offer revision requests and our secure payment system ensures you only pay when satisfied. If issues persist, our support team will help resolve disputes fairly.</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">How secure are my documents and payments?</h3>
                    <p className="text-gray-600">All file transfers are encrypted, payments are secured through our escrow system, and we maintain strict confidentiality agreements with all Research Aids.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Expert Help?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Join thousands of researchers who trust ScholarConnect for their academic support needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-50 px-8 py-3"
                  onClick={handleBrowseAids}
                >
                  Browse Research Aids
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
                  onClick={handleBecomeResearchAid}
                >
                  Become a Research Aid
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
