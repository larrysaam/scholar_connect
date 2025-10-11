
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Calendar, MessageSquare, FileText, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your account as a student, researcher, or research aid. Complete your profile with relevant information about your expertise or research needs."
    },
    {
      icon: Search,
      title: "Browse & Search",
      description: "Use our advanced search filters to find researchers or research aids that match your specific requirements, field of study, and budget."
    },
    {
      icon: Calendar,
      title: "Book Consultation",
      description: "Schedule one-on-one consultations with experts. Choose from available time slots and specify your research challenges."
    },
    {
      icon: MessageSquare,
      title: "Collaborate",
      description: "Engage in meaningful discussions, receive guidance, and collaborate on research projects through our secure platform."
    },
    {
      icon: FileText,
      title: "Co-Author & Publish",
      description: "Work together on publications, from research papers to book chapters. Get support throughout the entire publication process."
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "Share your experience by rating and reviewing researchers and research aids to help build our community."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How ResearchWow Works</h1>
              <p className="text-xl text-blue-100">
                Connecting researchers and students for collaborative academic success
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Simple Steps to Get Started</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <step.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Why Choose ResearchWow?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4 text-blue-700">For Students & Researchers</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Access to expert researchers and research aids</li>
                    <li>• Personalized guidance for your research projects</li>
                    <li>• Collaborative publication opportunities</li>
                    <li>• Flexible scheduling and consultation options</li>
                    <li>• Secure and professional platform</li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4 text-blue-700">For Research Aids & Experts</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Share your expertise with the academic community</li>
                    <li>• Set your own consultation rates and schedule</li>
                    <li>• Build your professional network</li>
                    <li>• Collaborate on exciting research projects</li>
                    <li>• Earn income from your knowledge and skills</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-x-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <a href="/register">Get Started Today</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/researchers">Browse Researchers</a>
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

export default HowItWorks;
