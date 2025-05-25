
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.contact?.title || "Contact Us"}
            </h1>
            <p className="text-xl text-gray-600">
              {t.contact?.subtitle || "Get in touch with our team"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t.contact?.form?.title || "Send us a message"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t.contact?.form?.firstName || "First Name"}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder={t.contact?.form?.firstNamePlaceholder || "Enter your first name"}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t.contact?.form?.lastName || "Last Name"}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder={t.contact?.form?.lastNamePlaceholder || "Enter your last name"}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{t.contact?.form?.email || "Email"}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder={t.contact?.form?.emailPlaceholder || "Enter your email"}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">{t.contact?.form?.subject || "Subject"}</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder={t.contact?.form?.subjectPlaceholder || "Enter subject"}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">{t.contact?.form?.message || "Message"}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder={t.contact?.form?.messagePlaceholder || "Enter your message"}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {t.contact?.form?.send || "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.contact?.info?.title || "Contact Information"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{t.contact?.info?.email?.title || "Email"}</h4>
                      <p className="text-gray-600">{t.contact?.info?.email?.general || "info@scholarconnect.com"}</p>
                      <p className="text-gray-600">{t.contact?.info?.email?.support || "support@scholarconnect.com"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{t.contact?.info?.phone?.title || "Phone"}</h4>
                      <p className="text-gray-600">{t.contact?.info?.phone?.main || "+237 123 456 789"}</p>
                      <p className="text-gray-600">{t.contact?.info?.phone?.whatsapp || "WhatsApp: +237 987 654 321"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{t.contact?.info?.address?.title || "Address"}</h4>
                      <p className="text-gray-600">{t.contact?.info?.address?.street || "123 University Avenue"}</p>
                      <p className="text-gray-600">{t.contact?.info?.address?.city || "Yaoundé, Cameroon"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{t.contact?.info?.hours?.title || "Business Hours"}</h4>
                      <p className="text-gray-600">{t.contact?.info?.hours?.weekdays || "Monday - Friday: 8:00 AM - 6:00 PM"}</p>
                      <p className="text-gray-600">{t.contact?.info?.hours?.weekends || "Saturday - Sunday: 10:00 AM - 4:00 PM"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">{t.contact?.faqs?.title || "Frequently Asked Questions"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {(t.contact?.faqs?.questions || [
                  {
                    question: "How do I sign up as a researcher?",
                    answer: "Click on 'Join as a Researcher' and fill out the registration form with your academic credentials and expertise."
                  },
                  {
                    question: "What are the fees for using ScholarConnect?",
                    answer: "Basic membership is free. Premium features and consultations have varying rates set by individual researchers and research aids."
                  },
                  {
                    question: "How do I book a consultation?",
                    answer: "Browse researcher profiles, select your preferred expert, and use the 'Book Consultation' button to schedule a session."
                  },
                  {
                    question: "Can I collaborate on research projects?",
                    answer: "Yes! You can send co-author invitations and collaborate on various types of publications through our platform."
                  },
                  {
                    question: "What types of research support are available?",
                    answer: "We offer various services including literature review, methodology guidance, data analysis, academic writing, and publication support."
                  },
                  {
                    question: "Is my data secure on ScholarConnect?",
                    answer: "Yes, we use industry-standard security measures to protect all user data and communications on our platform."
                  }
                ]).map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
