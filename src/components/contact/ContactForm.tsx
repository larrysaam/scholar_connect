import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { emailNotificationService } from "@/services/emailNotificationService";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const emailContent = `
New Contact Form Submission

From: ${fullName}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
      `.trim();

      const success = await emailNotificationService.sendCustomEmail({
        email: 'support@researchwhoa.com', // Support email address
        subject: `Contact Form: ${formData.subject}`,
        title: 'New Contact Form Submission',
        content: emailContent.replace(/\n/g, '<br>'),
        notificationType: 'contact'
      });

      if (success) {
        toast({
          title: t("contact.form.successTitle") || "Message Sent!",
          description: t("contact.form.successMessage") || "Thank you for your message. We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast({
        title: t("contact.form.errorTitle") || "Error",
        description: t("contact.form.errorMessage") || "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contact.form.title") || "Send us a message"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t("contact.form.firstName") || "First Name"}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder={t("contact.form.firstNamePlaceholder") || "Enter your first name"}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t("contact.form.lastName") || "Last Name"}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder={t("contact.form.lastNamePlaceholder") || "Enter your last name"}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">{t("contact.form.email") || "Email"}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={t("contact.form.emailPlaceholder") || "Enter your email"}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <Label htmlFor="subject">{t("contact.form.subject") || "Subject"}</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder={t("contact.form.subjectPlaceholder") || "Enter subject"}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <Label htmlFor="message">{t("contact.form.message") || "Message"}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder={t("contact.form.messagePlaceholder") || "Enter your message"}
              className="min-h-[120px]"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting 
              ? (t("contact.form.sending") || "Sending...") 
              : (t("contact.form.send") || "Send Message")
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
