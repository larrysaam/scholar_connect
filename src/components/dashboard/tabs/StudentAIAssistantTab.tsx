
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIResearcherMatcher from "@/components/ai/AIResearcherMatcher";
import AISchedulingAssistant from "@/components/ai/AISchedulingAssistant";
import AITopicRecommender from "@/components/ai/AITopicRecommender";
import { Brain, Users, Calendar, Lightbulb } from "lucide-react";

const StudentAIAssistantTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <Brain className="mr-2 h-6 w-6 text-purple-600" />
          AI Assistant
        </h2>
        <p className="text-gray-600">
          Leverage artificial intelligence to enhance your research experience
        </p>
      </div>

      <Tabs defaultValue="matcher" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matcher" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Smart Matching</span>
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>AI Scheduling</span>
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Topic Ideas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matcher" className="mt-6">
          <AIResearcherMatcher />
        </TabsContent>
        
        <TabsContent value="scheduling" className="mt-6">
          <AISchedulingAssistant />
        </TabsContent>
        
        <TabsContent value="topics" className="mt-6">
          <AITopicRecommender />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAIAssistantTab;
