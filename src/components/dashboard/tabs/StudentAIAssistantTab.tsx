import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIResearcherMatcher from "@/components/ai/AIResearcherMatcher";
import AISchedulingAssistant from "@/components/ai/AISchedulingAssistant";
import AITopicRecommender from "@/components/ai/AITopicRecommender";
import { Brain, Users, Calendar, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface ThesisInformation {
  id: string;
  user_id: string;
  title?: string;
  problem_statement?: string;
  research_questions?: string[];
  research_objectives?: string[];
  research_hypothesis?: string;
  expected_outcomes?: string;
  created_at: string;
  updated_at: string;
}

interface StudentData {
  id: string;
  name: string;
  research_areas?: string[];
  topic_title?: string;
  research_stage?: string;
  languages?: string[];
  thesis_info?: ThesisInformation;
}

const StudentAIAssistantTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  // Fetch student profile data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch student data including research info
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, research_areas, topic_title, research_stage, languages')
          .eq('id', user.id)
          .single();
          
        if (userError) throw userError;
        
        // Also fetch thesis information if available
        const { data: thesisData, error: thesisError } = await supabase
          .from('thesis_information')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (thesisError && thesisError.code !== 'PGRST116') { // Ignore "no rows returned" error
          console.warn('Error fetching thesis data:', thesisError);
        }
        
        const combinedData: StudentData = {
          ...userData,
          thesis_info: thesisData || undefined
        };
        
        console.log('Combined student data:', combinedData);
        setStudentData(combinedData);
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast({
          title: "Error",
          description: "Failed to load your research data. Some AI features may be limited.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [user?.id, toast]);

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
          <AIResearcherMatcher studentData={studentData} isLoading={loading} />
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
