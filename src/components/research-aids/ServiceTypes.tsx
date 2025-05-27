
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, MapPin, FileText, Users, MessageCircle, BookOpen, Target, Award, Globe } from "lucide-react";

const ServiceTypes = () => {
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

  return (
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
  );
};

export default ServiceTypes;
