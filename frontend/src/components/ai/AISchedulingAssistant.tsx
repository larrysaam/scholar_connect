
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Brain, Zap, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  duration: string;
  conflictScore: number;
  optimizationReasons: string[];
}

const AISchedulingAssistant = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedSlots, setSuggestedSlots] = useState<TimeSlot[]>([]);
  const { toast } = useToast();

  const sampleSlots: TimeSlot[] = [
    {
      id: "1",
      date: "2024-01-30",
      time: "10:00 AM",
      duration: "1 hour",
      conflictScore: 95,
      optimizationReasons: [
        "Both parties are most productive in the morning",
        "No calendar conflicts detected",
        "Optimal timezone alignment"
      ]
    },
    {
      id: "2",
      date: "2024-01-31",
      time: "2:00 PM",
      duration: "1 hour",
      conflictScore: 88,
      optimizationReasons: [
        "Good availability for both parties",
        "Allows preparation time after lunch",
        "Researcher's preferred afternoon slot"
      ]
    },
    {
      id: "3",
      date: "2024-02-01",
      time: "11:00 AM",
      duration: "1 hour",
      conflictScore: 92,
      optimizationReasons: [
        "High focus time for both participants",
        "No competing commitments",
        "Ideal for collaborative sessions"
      ]
    }
  ];

  const handleAnalyzeSchedule = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setSuggestedSlots(sampleSlots);
      setIsAnalyzing(false);
      toast({
        title: "AI Schedule Analysis Complete!",
        description: "Found optimal meeting times based on both calendars and productivity patterns."
      });
    }, 1500);
  };

  const handleBookSlot = (slot: TimeSlot) => {
    toast({
      title: "Meeting Scheduled!",
      description: `Your consultation is booked for ${slot.date} at ${slot.time}`
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <span>AI Scheduling Assistant</span>
        </CardTitle>
        <p className="text-gray-600">
          Our AI analyzes both calendars, productivity patterns, and preferences to suggest optimal meeting times.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestedSlots.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Ready to find the perfect meeting time?</p>
            <Button 
              onClick={handleAnalyzeSchedule} 
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  Analyzing Schedules...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Find Optimal Times
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              AI-Optimized Time Slots
            </h3>
            
            {suggestedSlots.map((slot) => (
              <Card key={slot.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{slot.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span>{slot.time}</span>
                        </div>
                        <Badge className={getScoreColor(slot.conflictScore)}>
                          {slot.conflictScore}% Optimal
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">Duration: {slot.duration}</p>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-800 mb-2">AI Optimization Factors:</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {slot.optimizationReasons.map((reason, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Button 
                        onClick={() => handleBookSlot(slot)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Book This Time
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleAnalyzeSchedule}>
                Find Alternative Times
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISchedulingAssistant;
