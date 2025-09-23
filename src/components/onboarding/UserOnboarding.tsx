
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ArrowRight, BookOpen, Users, Search, Star } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action: string;
}

const UserOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your academic background and research interests",
      icon: <Users className="h-5 w-5" />,
      completed: false,
      action: "Complete Profile"
    },
    {
      id: "preferences",
      title: "Set Learning Preferences",
      description: "Tell us about your preferred learning style and goals",
      icon: <BookOpen className="h-5 w-5" />,
      completed: false,
      action: "Set Preferences"
    },
    {
      id: "search",
      title: "Find Your First Researcher",
      description: "Use our AI matching to find the perfect researcher for you",
      icon: <Search className="h-5 w-5" />,
      completed: false,
      action: "Start Searching"
    },
    {
      id: "booking",
      title: "Book Your First Consultation",
      description: "Schedule your first consultation and get started",
      icon: <Star className="h-5 w-5" />,
      completed: false,
      action: "Book Now"
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const completeStep = (stepId: string) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Welcome to ResearchWhoa!</span>
          <Badge variant="secondary">
            {completedSteps}/{steps.length} Complete
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Setup Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`p-4 border rounded-lg transition-all ${
                index === currentStep ? 'border-blue-500 bg-blue-50' : 
                step.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    step.completed ? 'bg-green-100 text-green-600' : 
                    index === currentStep ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                
                {!step.completed && index === currentStep && (
                  <Button size="sm" onClick={() => completeStep(step.id)}>
                    {step.action}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
                
                {step.completed && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
          
          {completedSteps === steps.length && (
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900">Setup Complete!</h3>
              <p className="text-green-700 mb-4">
                You're all set to start your academic journey with ResearchWhoa.
              </p>
              <Button>Explore Researchers</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserOnboarding;
