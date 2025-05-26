
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, DollarSign, FileText, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface SessionType {
  id: string;
  title: string;
  duration: number;
  price: number;
  description: string;
}

interface BookingStep {
  step: number;
  title: string;
  completed: boolean;
}

const SessionBookingTab = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedResearcher] = useState({
    name: "Dr. Marie Ngono Abega",
    title: "Senior Research Fellow in GIS",
    imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
    rating: 4.9
  });

  const [selectedSessionType, setSelectedSessionType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [currentProgress, setCurrentProgress] = useState("");
  const [specificQuestions, setSpecificQuestions] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const sessionTypes: SessionType[] = [
    {
      id: "proposal_review",
      title: "Proposal Review - 45 mins",
      duration: 45,
      price: 12000,
      description: "Comprehensive review of your research proposal with feedback and suggestions"
    },
    {
      id: "manuscript_feedback",
      title: "1hr Manuscript Feedback",
      duration: 60,
      price: 15000,
      description: "Detailed feedback on your manuscript draft with improvement recommendations"
    },
    {
      id: "methodology_consultation",
      title: "Methodology Consultation - 60 mins",
      duration: 60,
      price: 15000,
      description: "Expert guidance on research methodology and design"
    },
    {
      id: "data_analysis_help",
      title: "Data Analysis Help - 90 mins",
      duration: 90,
      price: 22000,
      description: "Assistance with data analysis techniques and interpretation"
    }
  ];

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
  ];

  const bookingSteps: BookingStep[] = [
    { step: 1, title: "Choose Session Type", completed: currentStep > 1 },
    { step: 2, title: "Select Date/Time", completed: currentStep > 2 },
    { step: 3, title: "Fill Prep Form", completed: currentStep > 3 },
    { step: 4, title: "Confirm & Pay", completed: currentStep > 4 }
  ];

  const selectedSession = sessionTypes.find(session => session.id === selectedSessionType);
  const totalPrice = selectedSession ? selectedSession.price : 0;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = () => {
    // Implementation for completing booking
    console.log("Booking completed");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Book a Session</h2>
        <p className="text-gray-600">Schedule a consultation with expert researchers</p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {bookingSteps.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.completed ? 'bg-green-500 text-white' : 
                  currentStep === step.step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep === step.step ? 'font-semibold' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < bookingSteps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-200 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Researcher Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={selectedResearcher.imageUrl}
              alt={selectedResearcher.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{selectedResearcher.name}</h3>
              <p className="text-gray-600">{selectedResearcher.title}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm">{selectedResearcher.rating}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {bookingSteps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium">Select Session Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessionTypes.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionType(session.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSessionType === session.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{session.title}</h5>
                      <Badge variant="outline">{session.price.toLocaleString()} XAF</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.duration} mins
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Select Date & Time</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Choose Date</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Available Times</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 text-sm border rounded ${
                            selectedTime === time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium">Session Preparation Form</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Research Topic</label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Brief description of your research topic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Progress</label>
                  <Textarea
                    value={currentProgress}
                    onChange={(e) => setCurrentProgress(e.target.value)}
                    placeholder="Describe where you are in your research process"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Specific Questions (1-2 questions)</label>
                  <Textarea
                    value={specificQuestions}
                    onChange={(e) => setSpecificQuestions(e.target.value)}
                    placeholder="What specific questions do you want to discuss?"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h4 className="font-medium">Confirm & Pay</h4>
              
              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium mb-3">Booking Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Session:</span>
                    <span>{selectedSession?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>
                      {selectedDate ? format(selectedDate, "PPP") : "Not selected"} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Researcher:</span>
                    <span>{selectedResearcher.name}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{totalPrice.toLocaleString()} XAF</span>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Promo Code (Optional)</label>
                  <div className="flex space-x-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="orange">Orange Money</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedSessionType) ||
                  (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                  (currentStep === 3 && (!topic || !currentProgress || !specificQuestions))
                }
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleBooking} className="bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Complete Booking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionBookingTab;
