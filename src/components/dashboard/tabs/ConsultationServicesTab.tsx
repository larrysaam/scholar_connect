
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import ServiceInstructions from "../consultation-services/ServiceInstructions";
import ServiceCard from "../consultation-services/ServiceCard";
import AddServiceForm from "../consultation-services/AddServiceForm";

interface AcademicLevelPrice {
  level: "Undergraduate" | "Master's" | "PhD";
  price: number;
}

interface AddOn {
  name: string;
  price: number;
}

interface ServiceType {
  id: string;
  category: "General Consultation" | "Chapter Review" | "Full Thesis Cycle Support" | "Full Thesis Review";
  academicLevelPrices: AcademicLevelPrice[];
  description: string;
  addOns: AddOn[];
}

const ConsultationServicesTab = () => {
  const [services, setServices] = useState<ServiceType[]>([
    {
      id: "1",
      category: "General Consultation",
      academicLevelPrices: [{ level: "Undergraduate", price: 8000 }],
      description: "General research guidance and consultation",
      addOns: []
    }
  ]);

  const addService = (serviceData: Omit<ServiceType, "id">) => {
    setServices(prev => [...prev, {
      ...serviceData,
      id: Date.now().toString()
    }]);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  return (
    <div className="space-y-6">
      <ServiceInstructions />

      <div>
        <h2 className="text-2xl font-bold">Consultation Service Setup</h2>
        <p className="text-gray-600">Configure your service offerings and pricing</p>
      </div>

      {/* Current Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Your Service Offerings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onRemove={removeService}
            />
          ))}

          <AddServiceForm onAddService={addService} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationServicesTab;
