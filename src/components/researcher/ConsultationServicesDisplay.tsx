import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Calendar, DollarSign } from "lucide-react";

interface ConsultationService {
  id: string;
  category: "General Consultation" | "Chapter Review" | "Full Thesis Cycle Support" | "Full Thesis Review";
  academicLevelPrices: Array<{
    level: "Undergraduate" | "Master's" | "PhD";
    price: number;
  }>;
  description: string;
}

interface ConsultationServicesDisplayProps {
  researcherId: string;
  researcherName: string;
}

const ConsultationServicesDisplay = ({ researcherId, researcherName }: ConsultationServicesDisplayProps) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [consultationServices, setConsultationServices] = useState<ConsultationService[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      // Fetch all active services for the researcher, including pricing
      const { data, error } = await supabase
        .from("consultation_services")
        .select(`id, category, description, pricing:service_pricing(academic_level, price)`) // fetch pricing as nested
        .eq("user_id", researcherId)
        .eq("is_active", true);
      if (error) {
        setConsultationServices([]);
        setLoading(false);
        return;
      }
      // Transform to match UI structure
      const services = (data || []).map((service: any) => ({
        id: service.id,
        category: service.category,
        description: service.description,
        academicLevelPrices: (service.pricing || []).map((p: any) => ({
          level: p.academic_level === "Masters" ? "Master's" : p.academic_level,
          price: p.price
        }))
      }));
      setConsultationServices(services);
      setLoading(false);
      // Auto-select first service if available
      if (services.length > 0) {
        setSelectedService(services[0].id);
        // Auto-select first academic level if available
        if (services[0].academicLevelPrices.length > 0) {
          setSelectedLevel(services[0].academicLevelPrices[0].level);
        }
      }
    };
    if (researcherId) fetchServices();
  }, [researcherId]);

  const handleBookConsultation = () => {
    if (!selectedService || !selectedLevel) {
      window.alert("Please select a service and academic level");
      return;
    }

    const service = consultationServices.find(s => s.id === selectedService);
    const levelPriceObj = service?.academicLevelPrices.find(p => p.level === selectedLevel);
    const price = levelPriceObj ? levelPriceObj.price : 0;
    
    console.log("Booking consultation:", {
      researcherId,
      serviceId: selectedService,
      academicLevel: selectedLevel,
      price,
      message: bookingMessage
    });

    window.alert(`Consultation booking request sent! You will be redirected to payment for ${price.toLocaleString()} XAF`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          View Consultation Services
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultation Services - {researcherName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Services List */}
          <div className="grid gap-4">
            {consultationServices.map((service) => (
              <Card key={service.id} className="border">
                <CardHeader>
                  <CardTitle className="text-lg">{service.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium">Pricing by Academic Level:</h5>
                    <div className="flex flex-wrap gap-2">
                      {service.academicLevelPrices.map((levelPrice, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                          <Badge variant="secondary">{levelPrice.level}</Badge>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="text-sm font-medium">{levelPrice.price.toLocaleString()} XAF</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Form */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-900">
                <Calendar className="h-5 w-5" />
                <span>Book a Consultation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="service-select">Select Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a consultation service" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && (
                <div>
                  <Label htmlFor="level-select">Academic Level</Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your academic level" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationServices
                        .find(s => s.id === selectedService)
                        ?.academicLevelPrices.map((levelPrice) => (
                          <SelectItem key={levelPrice.level} value={levelPrice.level}>
                            {levelPrice.level} - {levelPrice.price.toLocaleString()} XAF
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="booking-message">Message (Optional)</Label>
                <Textarea
                  id="booking-message"
                  placeholder="Tell the researcher about your specific needs..."
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleBookConsultation}
                className="w-full"
                disabled={!selectedService || !selectedLevel}
              >
                Book Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationServicesDisplay;
