
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactFAQs = () => {
  const { t } = useLanguage();

  // Fallback FAQ data
  const defaultFaqs = [
    {
      question: "How do I sign up as a researcher?",
      answer: "Click on 'Join as a Researcher' and fill out the registration form with your academic credentials and expertise."
    },
    {
      question: "What are the fees for using ResearchTandem?",
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
      question: "Is my data secure on ResearchTandem?",
      answer: "Yes, we use industry-standard security measures to protect all user data and communications on our platform."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t("contact.faqs.title") || "Frequently Asked Questions"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {defaultFaqs.map((faq, index) => (
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
  );
};

export default ContactFAQs;
