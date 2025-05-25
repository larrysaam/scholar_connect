
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('contact.form.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('contact.form.firstName')}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder={t('contact.form.firstNamePlaceholder')}
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('contact.form.lastName')}</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder={t('contact.form.lastNamePlaceholder')}
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.form.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('contact.form.emailPlaceholder')}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder={t('contact.form.subjectPlaceholder')}
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.message')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t('contact.form.messagePlaceholder')}
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      {t('contact.form.send')}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('contact.info.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{t('contact.info.email.title')}</h3>
                        <p className="text-gray-600">{t('contact.info.email.general')}</p>
                        <p className="text-gray-600">{t('contact.info.email.support')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{t('contact.info.phone.title')}</h3>
                        <p className="text-gray-600">{t('contact.info.phone.main')}</p>
                        <p className="text-gray-600">{t('contact.info.phone.whatsapp')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{t('contact.info.address.title')}</h3>
                        <p className="text-gray-600">{t('contact.info.address.street')}</p>
                        <p className="text-gray-600">{t('contact.info.address.city')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{t('contact.info.hours.title')}</h3>
                        <p className="text-gray-600">{t('contact.info.hours.weekdays')}</p>
                        <p className="text-gray-600">{t('contact.info.hours.weekends')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{t('contact.faqs.title')}</h2>
              
              <div className="space-y-4">
                {t('contact.faqs.questions').map((faq: any, index: number) => (
                  <Card key={index}>
                    <Collapsible>
                      <CollapsibleTrigger 
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => toggleFaq(index)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{faq.question}</h3>
                          {openFaqs.includes(index) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
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
