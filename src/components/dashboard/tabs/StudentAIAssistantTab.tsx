
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIResearcherMatcher from "@/components/ai/AIResearcherMatcher";
import AISchedulingAssistant from "@/components/ai/AISchedulingAssistant";
import AITopicRecommender from "@/components/ai/AITopicRecommender";
import { Brain, Users, Calendar, Lightbulb } from "lucide-react";

const StudentAIAssistantTab = () => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center">
          <Brain className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
          <span className="truncate">AI Assistant</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Leverage artificial intelligence to enhance your research experience
        </p>
      </div>

      <Tabs defaultValue="matcher" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-0 h-auto sm:h-10">
          <TabsTrigger value="matcher" className="flex items-center justify-center space-x-1 sm:space-x-2 p-2 sm:p-3">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Smart Matching</span>
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center justify-center space-x-1 sm:space-x-2 p-2 sm:p-3">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">AI Scheduling</span>
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center justify-center space-x-1 sm:space-x-2 p-2 sm:p-3">
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Topic Ideas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matcher" className="mt-4 sm:mt-6">
          <AIResearcherMatcher />
        </TabsContent>
        
        <TabsContent value="scheduling" className="mt-4 sm:mt-6">
          <AISchedulingAssistant />
        </TabsContent>
        
        <TabsContent value="topics" className="mt-4 sm:mt-6">
          <AITopicRecommender />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAIAssistantTab;
