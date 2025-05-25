
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactInfo = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contact.info.title") || "Contact Information"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold">{t("contact.info.email.title") || "Email"}</h4>
            <p className="text-gray-600">{t("contact.info.email.general") || "info@scholarconnect.com"}</p>
            <p className="text-gray-600">{t("contact.info.email.support") || "support@scholarconnect.com"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold">{t("contact.info.phone.title") || "Phone"}</h4>
            <p className="text-gray-600">{t("contact.info.phone.main") || "+237 123 456 789"}</p>
            <p className="text-gray-600">{t("contact.info.phone.whatsapp") || "WhatsApp: +237 987 654 321"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold">{t("contact.info.address.title") || "Address"}</h4>
            <p className="text-gray-600">{t("contact.info.address.street") || "123 University Avenue"}</p>
            <p className="text-gray-600">{t("contact.info.address.city") || "Yaoundé, Cameroon"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold">{t("contact.info.hours.title") || "Business Hours"}</h4>
            <p className="text-gray-600">{t("contact.info.hours.weekdays") || "Monday - Friday: 8:00 AM - 6:00 PM"}</p>
            <p className="text-gray-600">{t("contact.info.hours.weekends") || "Saturday - Sunday: 10:00 AM - 4:00 PM"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
