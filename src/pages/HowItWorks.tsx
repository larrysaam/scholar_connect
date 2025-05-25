
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Calendar, Video, FileText, Users, CheckCircle, BookOpen, MessageSquare, Star, Award, Clock, Shield } from "lucide-react";

const HowItWorks = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('howItWorks.title')}</h1>
              <p className="text-xl text-blue-100">
                {t('howItWorks.subtitle')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Getting Started Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">{t('howItWorks.gettingStarted')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step1.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.step1.description')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step2.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.step2.description')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Video className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step3.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.step3.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Workflow Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">{t('howItWorks.detailedWorkflow')}</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.workflow.registration.title')}</h3>
                    <p className="text-gray-600 mb-3">{t('howItWorks.workflow.registration.description')}</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t('howItWorks.workflow.registration.step1')}</li>
                      <li>{t('howItWorks.workflow.registration.step2')}</li>
                      <li>{t('howItWorks.workflow.registration.step3')}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.workflow.search.title')}</h3>
                    <p className="text-gray-600 mb-3">{t('howItWorks.workflow.search.description')}</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t('howItWorks.workflow.search.step1')}</li>
                      <li>{t('howItWorks.workflow.search.step2')}</li>
                      <li>{t('howItWorks.workflow.search.step3')}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.workflow.booking.title')}</h3>
                    <p className="text-gray-600 mb-3">{t('howItWorks.workflow.booking.description')}</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t('howItWorks.workflow.booking.step1')}</li>
                      <li>{t('howItWorks.workflow.booking.step2')}</li>
                      <li>{t('howItWorks.workflow.booking.step3')}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.workflow.consultation.title')}</h3>
                    <p className="text-gray-600 mb-3">{t('howItWorks.workflow.consultation.description')}</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t('howItWorks.workflow.consultation.step1')}</li>
                      <li>{t('howItWorks.workflow.consultation.step2')}</li>
                      <li>{t('howItWorks.workflow.consultation.step3')}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.workflow.followUp.title')}</h3>
                    <p className="text-gray-600 mb-3">{t('howItWorks.workflow.followUp.description')}</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{t('howItWorks.workflow.followUp.step1')}</li>
                      <li>{t('howItWorks.workflow.followUp.step2')}</li>
                      <li>{t('howItWorks.workflow.followUp.step3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Platform Features */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">{t('howItWorks.platformFeatures')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.features.guidance.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.features.guidance.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.features.coAuthor.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.features.coAuthor.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.features.quality.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.features.quality.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.features.scheduling.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.features.scheduling.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.features.communication.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.features.communication.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('howItWorks.features.security.title')}</h3>
                    <p className="text-gray-600">
                      {t('howItWorks.features.security.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* For Researchers Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">{t('howItWorks.forResearchers.title')}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('howItWorks.forResearchers.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <p className="text-gray-600">{t('howItWorks.stats.researchers')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                  <p className="text-gray-600">{t('howItWorks.stats.students')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                  <p className="text-gray-600">{t('howItWorks.stats.satisfaction')}</p>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/register">{t('howItWorks.joinAsResearcher')}</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">{t('howItWorks.cta.title')}</h2>
              <p className="text-xl text-blue-100 mb-8">
                {t('howItWorks.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link to="/researchers">{t('hero.findResearchers')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link to="/register">{t('nav.register')}</Link>
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
