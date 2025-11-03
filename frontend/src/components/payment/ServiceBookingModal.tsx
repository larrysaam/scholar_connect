
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, User } from "lucide-react";
import { format } from "date-fns";
import PaymentCheckout from "./PaymentCheckout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    name: string;
    title: string;
    rating: number;
    hourlyRate: number;
  };
  serviceType: "consultation" | "service";
}

const ServiceBookingModal = ({ isOpen, onClose, provider, serviceType }: ServiceBookingModalProps) => {
  const [step, setStep] = useState(1); // 1: Service Details, 2: Payment
  const [serviceDetails, setServiceDetails] = useState({
    title: "",
    description: "",
    duration: serviceType === "consultation" ? "1" : "",
    deadline: undefined as Date | undefined,
    files: [] as File[],
    amount: 0
  });
  const { toast } = useToast();

  const predefinedServices = {
    consultation: [
      { title: "Academic Consultation", basePrice: provider.hourlyRate },
      { title: "Research Methodology Review", basePrice: provider.hourlyRate * 1.5 },
      { title: "Thesis Review Session", basePrice: provider.hourlyRate * 2 }
    ],
    service: [
      { title: "Data Analysis (SPSS/R)", basePrice: 15000 },
      { title: "GIS Mapping", basePrice: 12000 },
      { title: "Academic Editing", basePrice: 8000 },
      { title: "Statistical Analysis", basePrice: 18000 },
      { title: "Literature Review", basePrice: 10000 }
    ]
  };

  const handleServiceSelect = (selectedService: string) => {
    const service = predefinedServices[serviceType].find(s => s.title === selectedService);
    if (service) {
      setServiceDetails(prev => ({
        ...prev,
        title: service.title,
        amount: service.basePrice
      }));
    }
  };

  const calculateAmount = () => {
    if (serviceType === "consultation" && serviceDetails.duration) {
      return provider.hourlyRate * parseFloat(serviceDetails.duration);
    }
    return serviceDetails.amount || 0;
  };

  const handleNext = () => {
    if (!serviceDetails.title || !serviceDetails.description) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (serviceType === "service" && !serviceDetails.deadline) {
      toast({
        title: "Deadline Required",
        description: "Please select a deadline for this service.",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (serviceType === "consultation") {
        // Create consultation record
        const { error } = await supabase
          .from("consultations")
          .insert({
            expert_id: provider.id,
            student_id: user.id,
            title: serviceDetails.title,
            description: serviceDetails.description,
            timeslot: serviceDetails.deadline?.toISOString() || new Date(Date.now() + 24*60*60*1000).toISOString(),
            duration_hours: parseFloat(serviceDetails.duration),
            amount: calculateAmount(),
            status: "pending"
          });

        if (error) throw error;
      } else {
        // Create job record - add the missing title field
        const { error } = await supabase
          .from("jobs")
          .insert({
            title: serviceDetails.title,
            description: serviceDetails.description,
            amount: calculateAmount(),
            deadline: serviceDetails.deadline?.toISOString(),
            student_id: user.id,
            aid_id: provider.id,
            status: "pending"
          });

        if (error) throw error;
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your ${serviceType} has been booked successfully.`,
      });

      onClose();
      setStep(1);
      setServiceDetails({
        title: "",
        description: "",
        duration: serviceType === "consultation" ? "1" : "",
        deadline: undefined,
        files: [],
        amount: 0
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Book {serviceType === "consultation" ? "Consultation" : "Service"} with {provider.name}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6 p-6">
            {/* Provider Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="text-sm text-gray-600">{provider.title}</p>
                <p className="text-sm text-green-600">
                  {provider.hourlyRate.toLocaleString()} XAF/hour
                </p>
              </div>
            </div>

            {/* Service Selection */}
            <div className="space-y-3">
              <Label>Select Service Type</Label>
              <Select onValueChange={handleServiceSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedServices[serviceType].map((service) => (
                    <SelectItem key={service.title} value={service.title}>
                      {service.title} - {service.basePrice.toLocaleString()} XAF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Title */}
            <div className="space-y-3">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={serviceDetails.title}
                onChange={(e) => setServiceDetails(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter service title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={serviceDetails.description}
                onChange={(e) => setServiceDetails(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you need help with..."
                rows={4}
              />
            </div>

            {/* Duration (for consultations) */}
            {serviceType === "consultation" && (
              <div className="space-y-3">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Select 
                  value={serviceDetails.duration} 
                  onValueChange={(value) => setServiceDetails(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">30 minutes</SelectItem>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="1.5">1.5 hours</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Deadline */}
            <div className="space-y-3">
              <Label>
                {serviceType === "consultation" ? "Preferred Date & Time" : "Deadline"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {serviceDetails.deadline ? format(serviceDetails.deadline, "PPP") : "Select date..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={serviceDetails.deadline}
                    onSelect={(date) => setServiceDetails(prev => ({ ...prev, deadline: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Custom Amount (for services) */}
            {serviceType === "service" && (
              <div className="space-y-3">
                <Label htmlFor="amount">Amount (XAF)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={serviceDetails.amount}
                  onChange={(e) => setServiceDetails(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter amount..."
                />
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-3">
              <Label>Attach Files (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            </div>

            {/* Total Amount Display */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {calculateAmount().toLocaleString()} XAF
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue to Payment
              </Button>
            </div>
          </div>
        ) : (
          <PaymentCheckout
            serviceType={serviceType}
            provider={provider}
            service={{
              title: serviceDetails.title,
              description: serviceDetails.description,
              amount: calculateAmount(),
              duration: serviceType === "consultation" ? `${serviceDetails.duration} hour(s)` : undefined,
              deadline: serviceDetails.deadline ? format(serviceDetails.deadline, "PPP") : undefined
            }}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => setStep(1)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingModal;
