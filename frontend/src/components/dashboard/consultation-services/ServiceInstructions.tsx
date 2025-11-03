
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const ServiceInstructions = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Instructions for Service Setup</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Dear Esteemed Researcher, please refer to the price grid before setting a price that corresponds to your academic level. 
              Note that you can add several service categories and academic levels and prices. The duration of the contract delivery depends on the type of service. 
              For instance, 1 hour for General Research Consultation, 7 days for Chapter Review, 30 days for Full Thesis Review and up to 18 months for Full Thesis Cycle Support 
              (typically 3–6 months undergraduate, 6–9 months Master's, 9–18 months PhD). The platform will deduct 15% of any amount 
              paid by research students. We are passionate about supporting researchers and students.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInstructions;
