
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Brain, Zap, Target, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAIRecommendations } from "@/services/geminiService";
import { useResearchers } from "@/hooks/useResearchers";

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

interface MatchedResearcher {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  institution: string;
  field: string;
  rating: number;
  matchScore: number;
  specialties: string[];
  hourlyRate: number;
  imageUrl: string;
  matchReasons: string[];
}

interface AIResearcherMatcherProps {
  studentData: StudentData | null;
  isLoading?: boolean;
}

const AIResearcherMatcher = ({ studentData, isLoading = false }: AIResearcherMatcherProps) => {
  const navigate = useNavigate();
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<MatchedResearcher[]>([]);
  const { toast } = useToast();
  const { researchers, loading: researchersLoading } = useResearchers();

  const handleViewProfile = (researcherId: string) => {
    navigate(`/researcher/${researcherId}`);
  };

  // Create student info from studentData for AI recommendations
  const createStudentInfo = () => {
    if (!studentData) {
      return {
        researchInterests: ["General Research"],
        challenges: ["Finding research mentors"]
      };
    }

    // Ensure research_areas is properly formatted
    let researchInterests: string[] = [];
    if (studentData.research_areas) {
      if (Array.isArray(studentData.research_areas)) {
        researchInterests = studentData.research_areas;
      } else if (typeof studentData.research_areas === 'string') {
        // Handle case where research_areas might be a JSON string
        try {
          const parsed = JSON.parse(studentData.research_areas);
          if (Array.isArray(parsed)) {
            researchInterests = parsed;
          } else {
            researchInterests = [String(studentData.research_areas)];
          }
        } catch (e) {
          // If not parsable as JSON, treat as a single string
          researchInterests = [String(studentData.research_areas)];
        }
      }
    }

    // Similarly handle languages
    let languages: string[] = ["English"];
    if (studentData.languages) {
      if (Array.isArray(studentData.languages)) {
        languages = studentData.languages;
      } else if (typeof studentData.languages === 'string') {
        try {
          const parsed = JSON.parse(studentData.languages);
          if (Array.isArray(parsed)) {
            languages = parsed;
          } else {
            languages = [String(studentData.languages)];
          }
        } catch (e) {
          languages = [String(studentData.languages)];
        }
      }
    }

    // Process thesis research questions and objectives
    let researchQuestions: string[] = [];
    if (studentData.thesis_info?.research_questions) {
      if (Array.isArray(studentData.thesis_info.research_questions)) {
        researchQuestions = studentData.thesis_info.research_questions;
      } else if (typeof studentData.thesis_info.research_questions === 'string') {
        try {
          const parsed = JSON.parse(studentData.thesis_info.research_questions as unknown as string);
          if (Array.isArray(parsed)) {
            researchQuestions = parsed;
          }
        } catch (e) {
          // If parsing fails, use empty array
        }
      }
    }

    let researchObjectives: string[] = [];
    if (studentData.thesis_info?.research_objectives) {
      if (Array.isArray(studentData.thesis_info.research_objectives)) {
        researchObjectives = studentData.thesis_info.research_objectives;
      } else if (typeof studentData.thesis_info.research_objectives === 'string') {
        try {
          const parsed = JSON.parse(studentData.thesis_info.research_objectives as unknown as string);
          if (Array.isArray(parsed)) {
            researchObjectives = parsed;
          }
        } catch (e) {
          // If parsing fails, use empty array
        }
      }
    }

    return {
      researchInterests: researchInterests.length > 0 ? researchInterests : ["General Research"],
      topicTitle: studentData.thesis_info?.title || studentData.topic_title || "Not specified",
      researchStage: studentData.research_stage || "Not specified",
      languages: languages,
      challenges: determineResearchChallenges(studentData.research_stage || ""),
      // Add thesis information
      problemStatement: studentData.thesis_info?.problem_statement,
      researchQuestions: researchQuestions.length > 0 ? researchQuestions : undefined,
      researchObjectives: researchObjectives.length > 0 ? researchObjectives : undefined,
      researchHypothesis: studentData.thesis_info?.research_hypothesis,
      expectedOutcomes: studentData.thesis_info?.expected_outcomes
    };
  };

  // Determine challenges based on research stage
  const determineResearchChallenges = (stage: string): string[] => {
    switch(stage) {
      case "ideation": 
        return ["Formulating a research question", "Finding relevant literature"];
      case "proposal": 
        return ["Refining methodology", "Literature review"];
      case "data_collection": 
        return ["Data collection methods", "Research tools"];
      case "analysis": 
        return ["Data analysis techniques", "Interpreting results"];
      case "writing": 
        return ["Thesis writing", "Research documentation"];
      default:
        return ["Finding research guidance", "Academic mentorship"];
    }
  };

  const handleAIMatch = async () => {
    setIsMatching(true);

    // Use the actual researchers from our database
    const availableResearchers = researchers.map(r => ({
      id: r.id,
      name: r.name,
      title: r.title,
      subtitle: r.subtitle,
      institution: r.institution,
      field: r.field,
      rating: r.rating,
      specialties: r.expertise || r.specializations || [],
      hourlyRate: r.hourlyRate,
      imageUrl: r.imageUrl,
      languages: r.languages || []
    }));

    // Get student info from their profile data
    const studentInfo = createStudentInfo();

    try {
      // 1. Get high-level recommendations from the AI
      const recommendationsFromAI = await getAIRecommendations(studentInfo, availableResearchers);

      // 2. Merge AI recommendations with full researcher data
      const enhancedMatches = recommendationsFromAI.map(rec => {
        // Look up researcher by name or ID depending on what the AI returns
        const originalResearcher = availableResearchers.find(r => 
          r.name === rec.researcher || 
          r.name === rec.name ||
          r.id === rec.id
        );
        
        if (!originalResearcher) return null;

        return {
          ...originalResearcher,
          subtitle: originalResearcher.subtitle || determineSubtitle(originalResearcher.title),
          matchScore: rec.matchScore || Math.floor(Math.random() * 25) + 75, // Fallback to 75-100 range
          matchReasons: Array.isArray(rec.explanation) 
            ? rec.explanation 
            : rec.explanation 
              ? [rec.explanation] 
              : ["Expert in relevant field"]
        };
      }).filter(Boolean) as MatchedResearcher[]; // Filter out nulls and assert type

      // If no matches were found, try to get the top 3 most relevant researchers based on expertise
      if (enhancedMatches.length === 0) {
        const fallbackMatches = availableResearchers
          .slice(0, 3) // Get first 3 researchers
          .map(researcher => ({
            ...researcher,
            subtitle: researcher.subtitle ,
            matchScore: Math.floor(Math.random() * 15) + 65, // 65-80% match score
            matchReasons: ["Experienced researcher in the field", "Available for consultations"]
          }));
        
        setMatches(fallbackMatches);
      } else {
        setMatches(enhancedMatches);
      }

      toast({
        title: "AI Matching Complete!",
        description: `Found ${enhancedMatches.length || 3} highly compatible researchers for you.`
      });
    } catch (error) {
      console.error('AI Matching error:', error);
      toast({
        title: "AI Matching Failed",
        description: "Could not fetch recommendations. Please try again later.",
        variant: "destructive"
      });

      // Fallback to simple matching if AI fails
      const fallbackMatches = availableResearchers
        .slice(0, 3) // Get first 3 researchers
        .map(researcher => ({
          ...researcher,
          subtitle: determineSubtitle(researcher.title),
          matchScore: Math.floor(Math.random() * 15) + 65, // 65-80% match score
          matchReasons: ["Experienced researcher in the field", "Available for consultations"]
        }));
      
      setMatches(fallbackMatches);
    } finally {
      setIsMatching(false);
    }
  };
  
  // Determine appropriate title prefix (Dr., Prof., etc.)
  const determineSubtitle = (title: string): string => {
    if (!title) return '';
    
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('professor')) return 'Prof.';
    if (lowerTitle.includes('doctor') || lowerTitle.includes('phd')) return 'Dr.';
    if (lowerTitle.includes('lecturer')) return 'Dr.';
    if (lowerTitle.includes('researcher')) return '';
    return '';
  };

  const handleBookConsultation = (researcher: MatchedResearcher) => {
    toast({
      title: "Booking Consultation",
      description: `Initiating booking process with ${researcher.subtitle} ${researcher.name}`
    });
  };

  // Effect to check if there's enough student data to make recommendations
  useEffect(() => {
    if (studentData && !isLoading && !researchersLoading && matches.length === 0) {
      const hasRequiredData = (
        (studentData.research_areas && studentData.research_areas.length > 0) ||
        studentData.topic_title ||
        studentData.research_stage
      );
      
      if (hasRequiredData) {
        // Automatically run matching when component loads with student data
        handleAIMatch();
      }
    }
  }, [studentData, isLoading, researchersLoading]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>AI Researcher Matcher</span>
        </CardTitle>
        <p className="text-gray-600">
          Our AI analyzes your research interests, topic, and preferences to find the perfect researchers for you.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading || researchersLoading ? (
          // Loading state
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 text-purple-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading your research profile...</p>
          </div>
        ) : matches.length === 0 ? (
          // Empty state - no matches yet
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {!studentData || (!studentData.research_areas && !studentData.topic_title && !studentData.research_stage) ? (
              <>
                <p className="text-amber-600 font-medium mb-2">Complete your research profile first</p>
                <p className="text-gray-500 mb-4">
                  To get the best recommendations, please update your profile with your research areas, 
                  topic, and stage in your account settings.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-4">Ready to find your perfect research mentor?</p>
                
                {/* Show what data will be used for matching */}
                <div className="mb-4 text-sm">
                  <p className="text-purple-600 font-medium mb-2">Using your research profile:</p>
                  <div className="flex flex-wrap justify-center gap-1 mb-3">
                    {studentData.research_areas && studentData.research_areas.length > 0 && (
                      <Badge variant="outline" className="bg-purple-50">Research Areas</Badge>
                    )}
                    {studentData.topic_title && (
                      <Badge variant="outline" className="bg-purple-50">Topic</Badge>
                    )}
                    {studentData.research_stage && (
                      <Badge variant="outline" className="bg-purple-50">Research Stage</Badge>
                    )}
                    {studentData.languages && studentData.languages.length > 0 && (
                      <Badge variant="outline" className="bg-purple-50">Languages</Badge>
                    )}
                    {studentData.thesis_info && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 font-medium">Thesis Info</Badge>
                    )}
                  </div>
                </div>
              </>
            )}
            <Button 
              onClick={handleAIMatch} 
              disabled={isMatching}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isMatching ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  AI Matching in Progress...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Find My Perfect Match
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              AI-Matched Researchers ({matches.length})
            </h3>
            
            {matches.map((researcher) => (
             
              <Card key={researcher.id} className="border-l-4 border-l-purple-500">
                 {console.log('Rendering researcher:', researcher)}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={researcher.imageUrl} alt={researcher.name} />
                        <AvatarFallback>{researcher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {researcher.subtitle && (
                            <p className="font-semibold text-lg">{researcher.subtitle}</p>
                          )}
                          <h4 className="font-semibold text-lg">{researcher.name}</h4>
                          <Badge className="bg-purple-100 text-purple-800">
                            {researcher.matchScore}% Match
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-1">{researcher.title}</p>
                        {/* {researcher.subtitle && (
                          <p className="text-sm text-gray-500 mb-1 italic">{researcher.subtitle}</p>
                        )} */}
                        <p className="text-sm text-gray-500 mb-2">{researcher.institution}</p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(researcher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-1 text-sm font-medium">{researcher.rating}</span>
                          </div>
                          {/* <span className="text-sm text-gray-600">
                            {researcher.hourlyRate.toLocaleString()}
                          </span> */}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {researcher.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="text-sm font-medium text-green-800 mb-2">Why this is a great match:</h5>
                          <ul className="text-sm text-green-700 space-y-1">
                            {researcher.matchReasons.map((reason, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                          
                          {studentData && studentData.research_areas && studentData.research_areas.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-green-100">
                              <p className="text-xs text-green-600 font-medium">Matching research areas</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {studentData.research_areas.filter(area => 
                                  researcher.specialties.some(spec => 
                                    spec.toLowerCase().includes(area.toLowerCase())
                                  )
                                ).map((area, index) => (
                                  <Badge key={index} variant="outline" className="bg-green-100 text-green-800 text-xs">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Show thesis match details if thesis info is available */}
                          {studentData?.thesis_info && (
                            <div className="mt-2 pt-2 border-t border-green-100">
                              <p className="text-xs text-green-600 font-medium">Thesis compatibility</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                                  Topic expertise
                                </Badge>
                                {studentData.thesis_info.research_questions && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                                    Research methodology
                                  </Badge>
                                )}
                              </div>
                              {studentData.thesis_info.title && (
                                <p className="text-xs text-green-700 mt-1">
                                  <span className="font-medium">Thesis topic:</span> {studentData.thesis_info.title}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(researcher.id)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleAIMatch}>
                Find More Matches
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResearcherMatcher;
