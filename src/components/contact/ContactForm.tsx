
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactForm = () => {
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
            />
          </div>
          
          <Button type="submit" className="w-full">
            {t("contact.form.send") || "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
