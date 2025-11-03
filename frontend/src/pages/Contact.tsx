
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactFAQs from "@/components/contact/ContactFAQs";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("contact.title") || "Contact Us"}
            </h1>
            <p className="text-xl text-gray-600">
              {t("contact.subtitle") || "Get in touch with our team"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <ContactForm />
            <div className="space-y-6">
              <ContactInfo />
            </div>
          </div>

          <ContactFAQs />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
