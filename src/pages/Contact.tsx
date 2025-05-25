
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('contact.title')}</h1>
              <p className="text-xl text-blue-100">
                {t('contact.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-semibold mb-6">{t('contact.form.title')}</h2>
                  <Card>
                    <CardContent className="p-6">
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">{t('contact.form.firstName')}</Label>
                            <Input id="firstName" placeholder={t('contact.form.firstNamePlaceholder')} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">{t('contact.form.lastName')}</Label>
                            <Input id="lastName" placeholder={t('contact.form.lastNamePlaceholder')} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('contact.form.email')}</Label>
                          <Input id="email" type="email" placeholder={t('contact.form.emailPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                          <Input id="subject" placeholder={t('contact.form.subjectPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">{t('contact.form.message')}</Label>
                          <Textarea 
                            id="message" 
                            placeholder={t('contact.form.messagePlaceholder')}
                            rows={6}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          {t('contact.form.send')}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Details */}
                <div>
                  <h2 className="text-2xl font-semibold mb-6">{t('contact.info.title')}</h2>
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{t('contact.info.email.title')}</h3>
                            <p className="text-gray-600">{t('contact.info.email.general')}</p>
                            <p className="text-gray-600">{t('contact.info.email.support')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{t('contact.info.phone.title')}</h3>
                            <p className="text-gray-600">{t('contact.info.phone.main')}</p>
                            <p className="text-gray-600">{t('contact.info.phone.whatsapp')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{t('contact.info.address.title')}</h3>
                            <p className="text-gray-600">{t('contact.info.address.street')}</p>
                            <p className="text-gray-600">{t('contact.info.address.city')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{t('contact.info.hours.title')}</h3>
                            <p className="text-gray-600">{t('contact.info.hours.weekdays')}</p>
                            <p className="text-gray-600">{t('contact.info.hours.weekends')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
