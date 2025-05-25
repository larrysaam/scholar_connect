
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
import { Search, MapPin, Star, Clock } from "lucide-react";

const ResearchAides = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: t('researchAides.categories.all') },
    { value: "gis", label: t('researchAides.categories.gis') },
    { value: "statistics", label: t('researchAides.categories.statistics') },
    { value: "cartography", label: t('researchAides.categories.cartography') },
    { value: "data-collection", label: t('researchAides.categories.dataCollection') },
    { value: "journal-publishing", label: t('researchAides.categories.journalPublishing') },
    { value: "academic-editing", label: t('researchAides.categories.academicEditing') }
  ];

  const researchAides = [
    {
      id: 1,
      name: "Dr. Marie Ngono",
      category: "gis",
      title: "GIS Specialist & Remote Sensing Expert",
      location: "Yaoundé, Cameroon",
      rating: 4.9,
      reviews: 127,
      image: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      skills: ["ArcGIS", "QGIS", "Remote Sensing", "Spatial Analysis"],
      experience: "8 years",
      availability: "Available"
    },
    {
      id: 2,
      name: "Prof. James Asong",
      category: "statistics",
      title: "Statistical Analysis & Data Science Consultant",
      location: "Buea, Cameroon",
      rating: 4.8,
      reviews: 89,
      image: "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
      skills: ["SPSS", "R", "Python", "Machine Learning"],
      experience: "12 years",
      availability: "Busy"
    },
    {
      id: 3,
      name: "Dr. Fatima Bello",
      category: "cartography",
      title: "Cartographer & Map Design Specialist",
      location: "Douala, Cameroon",
      rating: 4.7,
      reviews: 156,
      image: "/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png",
      skills: ["Map Design", "Cartographic Visualization", "Geographic Information Systems"],
      experience: "6 years",
      availability: "Available"
    },
    {
      id: 4,
      name: "Dr. Paul Mbarga",
      category: "data-collection",
      title: "Data Collection & Survey Design Expert",
      location: "Bamenda, Cameroon",
      rating: 4.6,
      reviews: 78,
      image: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      skills: ["Survey Design", "KoBo Toolbox", "Field Data Collection", "Interview Techniques"],
      experience: "5 years",
      availability: "Available"
    },
    {
      id: 5,
      name: "Dr. Sarah Tankou",
      category: "journal-publishing",
      title: "Journal Publishing & Manuscript Preparation Aide",
      location: "Yaoundé, Cameroon",
      rating: 4.9,
      reviews: 203,
      image: "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
      skills: ["Manuscript Preparation", "Journal Selection", "Peer Review Process", "Citation Management"],
      experience: "10 years",
      availability: "Available"
    },
    {
      id: 6,
      name: "Dr. Michael Fru",
      category: "academic-editing",
      title: "Academic Editor & Writing Coach",
      location: "Dschang, Cameroon",
      rating: 4.8,
      reviews: 145,
      image: "/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png",
      skills: ["Academic Writing", "Proofreading", "Language Editing", "Thesis Review"],
      experience: "9 years",
      availability: "Available"
    }
  ];

  const filteredAides = researchAides.filter(aide => {
    const matchesSearch = aide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aide.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || aide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('researchAides.title')}</h1>
              <p className="text-xl text-blue-100 mb-8">
                {t('researchAides.subtitle')}
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={t('researchAides.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-white text-gray-900">
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
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">{t('researchAides.results.title')}</h2>
              <p className="text-gray-600">
                {t('researchAides.results.found')} {filteredAides.length} {t('researchAides.results.specialists')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAides.map((aide) => (
                <Card key={aide.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={aide.image} alt={aide.name} />
                        <AvatarFallback>{aide.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{aide.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-2">{aide.title}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {aide.location}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{aide.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({aide.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{t('researchAides.card.skills')}</h4>
                        <div className="flex flex-wrap gap-1">
                          {aide.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {aide.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{aide.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {aide.experience} {t('researchAides.card.experience')}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={aide.availability === "Available" ? "default" : "secondary"}
                          className={aide.availability === "Available" ? "bg-green-100 text-green-800" : ""}
                        >
                          {aide.availability === "Available" ? t('researchAides.card.available') : t('researchAides.card.busy')}
                        </Badge>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          {t('researchAides.card.contact')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAides.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('researchAides.noResults')}</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t('researchAides.cta.title')}</h2>
              <p className="text-xl text-blue-100 mb-8">
                {t('researchAides.cta.description')}
              </p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <a href="/register">{t('researchAides.cta.joinButton')}</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAides;
