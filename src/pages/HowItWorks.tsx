
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Calendar, Video, FileText, Users, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How ScholarConnect Works</h1>
              <p className="text-xl text-blue-100">
                Connect with expert researchers in just a few simple steps
              </p>
            </div>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">Getting Started is Easy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">1. Search & Discover</h3>
                    <p className="text-gray-600">
                      Browse our extensive network of researchers by field, expertise, institution, or specific research interests.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">2. Book Consultation</h3>
                    <p className="text-gray-600">
                      Select your preferred researcher and book a consultation at a time that works for both of you.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Video className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">3. Connect & Learn</h3>
                    <p className="text-gray-600">
                      Meet virtually with your chosen expert and get personalized guidance for your research project.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">Platform Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Research Guidance</h3>
                    <p className="text-gray-600">
                      Get expert help with research ideas, methodology, literature reviews, and thesis defense preparation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Co-Authoring Opportunities</h3>
                    <p className="text-gray-600">
                      Collaborate with researchers on publications, from journal articles to conference papers.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
                    <p className="text-gray-600">
                      All researchers are verified experts with proven track records in their respective fields.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                    <p className="text-gray-600">
                      Book sessions that fit your schedule, with options for one-time consultations or ongoing mentorship.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* For Researchers Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">For Researchers</h2>
              <p className="text-lg text-gray-600 mb-8">
                Share your expertise, build your reputation, and earn additional income by mentoring the next generation of researchers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <p className="text-gray-600">Active Researchers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                  <p className="text-gray-600">Students Helped</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                  <p className="text-gray-600">Satisfaction Rate</p>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/register">Join as a Researcher</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of students who have already improved their research with expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link to="/researchers">Find Researchers</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link to="/register">Sign Up</Link>
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
