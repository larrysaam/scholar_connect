import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BookOpen, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ThesisData {
  title: string;
  problem_statement: string;
  research_questions: string[];
  research_objectives: string[];
  research_hypothesis: string;
  expected_outcomes: string;
  research_methodology: string;
}

const ThesisInformationTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [thesisData, setThesisData] = useState<ThesisData>({
    title: '',
    problem_statement: '',
    research_questions: [''],
    research_objectives: [''],
    research_hypothesis: '',
    expected_outcomes: '',
    research_methodology: '',
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        console.log("Fetched user:", data.user);
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchThesisInfo = async () => {
        const { data, error } = await supabase
          .from("thesis_information")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (data) {
          console.log("Fetched thesis information:", data);
          setThesisData(data);
        }
        if (error) {
          console.error("Error fetching thesis information:", error);
        }
      };
      fetchThesisInfo();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase.from("thesis_information").upsert({
      ...thesisData,
      user_id: user.id,
    });

    if (error) {
      toast({
        title: "Error Saving Thesis Information",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thesis Information Saved",
        description: "Your thesis information has been successfully updated.",
      });
      setIsEditing(false);
    }
  };

  const handleArrayChange = (field: keyof Pick<ThesisData, 'research_questions' | 'research_objectives'>, index: number, value: string) => {
    setThesisData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: keyof Pick<ThesisData, 'research_questions' | 'research_objectives'>) => {
    setThesisData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""]
    }));
  };

  const removeArrayItem = (field: keyof Pick<ThesisData, 'research_questions' | 'research_objectives'>, index: number) => {
    setThesisData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Thesis Information</h2>
          <p className="text-gray-600">
            Manage your thesis details and research information
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span>{isEditing ? "Save Changes" : "Edit"}</span>
        </Button>
      </div>

      {/* Thesis Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Thesis Title
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Input
              value={thesisData.title}
              onChange={(e) => setThesisData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your thesis title"
            />
          ) : (
            <p className="text-gray-800">{thesisData.title}</p>
          )}
        </CardContent>
      </Card>

      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={thesisData.problem_statement}
              onChange={(e) => setThesisData(prev => ({ ...prev, problem_statement: e.target.value }))}
              placeholder="Describe the problem your research addresses"
              rows={4}
            />
          ) : (
            <p className="text-gray-800">{thesisData.problem_statement}</p>
          )}
        </CardContent>
      </Card>

      {/* Research Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Research Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thesisData.research_questions.map((question, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-1">{index + 1}.</span>
              {isEditing ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={question}
                    onChange={(e) => handleArrayChange('research_questions', index, e.target.value)}
                    placeholder="Enter research question"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('research_questions', index)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <p className="text-gray-800 flex-1">{question}</p>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('research_questions')}
            >
              Add Question
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Research Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>Research Objectives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thesisData.research_objectives.map((objective, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-1">{index + 1}.</span>
              {isEditing ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={objective}
                    onChange={(e) => handleArrayChange('research_objectives', index, e.target.value)}
                    placeholder="Enter research objective"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('research_objectives', index)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <p className="text-gray-800 flex-1">{objective}</p>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('research_objectives')}
            >
              Add Objective
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Research Methodology */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Research Methodology</CardTitle>
          {isEditing && (
            <CardDescription>
              Describe your research methodology, including your research design, data collection methods, and analysis approach.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              placeholder="Enter your research methodology"
              value={thesisData.research_methodology || ''}
              onChange={(e) =>
                setThesisData((prev) => ({
                  ...prev,
                  research_methodology: e.target.value,
                }))
              }
              className="min-h-[150px]"
            />
          ) : (
            <p className="whitespace-pre-wrap">
              {thesisData.research_methodology || 'No research methodology provided yet.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Research Hypothesis */}
      <Card>
        <CardHeader>
          <CardTitle>Research Hypothesis</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={thesisData.research_hypothesis}
              onChange={(e) => setThesisData(prev => ({ ...prev, research_hypothesis: e.target.value }))}
              placeholder="State your research hypothesis"
              rows={3}
            />
          ) : (
            <p className="text-gray-800">{thesisData.research_hypothesis}</p>
          )}
        </CardContent>
      </Card>

      {/* Expected Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={thesisData.expected_outcomes}
              onChange={(e) => setThesisData(prev => ({ ...prev, expected_outcomes: e.target.value }))}
              placeholder="Enter expected outcomes"
              rows={4}
            />
          ) : (
            <p className="text-gray-800">{thesisData.expected_outcomes}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThesisInformationTab;
