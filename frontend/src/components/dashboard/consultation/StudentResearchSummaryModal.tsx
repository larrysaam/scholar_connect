import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThesisData {
  title: string;
  problem_statement: string;
  research_questions: string[];
  research_objectives: string[];
  research_hypothesis: string;
  expected_outcomes: string;
}

interface StudentResearchSummaryModalProps {
  studentId: string;
  consultationId: string;
}

const StudentResearchSummaryModal = ({ studentId, consultationId }: StudentResearchSummaryModalProps) => {
  console.log("StudentResearchSummaryModal received studentId:", studentId); // Added log
  const [thesisData, setThesisData] = useState<ThesisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThesisInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const userIdToQuery = studentId;
        console.log("Querying with userIdToQuery:", userIdToQuery); // Added log
        const { data, error } = await supabase
          .from("thesis_information")
          .select("*")
          .eq("user_id", userIdToQuery)
          .limit(1);

        console.log("Supabase query data:", data); // Added log
        console.log("Supabase query error:", error); // Added log

        if (error) {
          console.error("Error fetching thesis information:", error);
          setError(error.message);
          setThesisData(null);
        } else if (data && data.length > 0) {
          setThesisData(data[0]);
        } else {
          setThesisData(null);
          setError("No thesis information found for this student.");
        }
      } catch (err: any) {
        console.error("Unexpected error fetching thesis information:", err);
        setError(err.message || "An unexpected error occurred.");
        setThesisData(null);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchThesisInfo();
    }
  }, [studentId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" />
          More Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Research Summary</DialogTitle>
        </DialogHeader>
        {loading && <div className="text-center py-4">Loading thesis information...</div>}
        {error && <div className="text-center py-4 text-red-500">Error: {error}</div>}
        {!loading && !thesisData && !error && <div className="text-center py-4 text-gray-500">No thesis information available.</div>}
        
        {thesisData && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{thesisData.title}</CardTitle>
                {/* Assuming level and projectLocation are not part of ThesisData, or need to be fetched separately */}
                {/* <div className="flex gap-4 text-sm text-gray-600">
                  <span><strong>Level:</strong> {thesisData.level}</span>
                  <span><strong>Location:</strong> {thesisData.projectLocation}</span>
                </div> */}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-lg border-b pb-1">Problem Statement</h4>
                  <p className="text-gray-700 leading-relaxed">{thesisData.problem_statement}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-lg border-b pb-1">Research Questions</h4>
                  <ul className="space-y-2">
                    {thesisData.research_questions?.map((question, index) => (
                      <li key={index} className="text-gray-700 flex">
                        <span className="font-medium text-blue-600 mr-2">{index + 1}.</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-lg border-b pb-1">Research Objectives</h4>
                  <ul className="space-y-2">
                    {thesisData.research_objectives?.map((objective, index) => (
                      <li key={index} className="text-gray-700 flex">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-lg border-b pb-1">Research Hypothesis</h4>
                    <p className="text-gray-700 leading-relaxed">{thesisData.research_hypothesis}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-lg border-b pb-1">Expected Outcomes</h4>
                    <p className="text-gray-700 leading-relaxed">{thesisData.expected_outcomes}</p>
                  </div>
                </div>
                
                {/* Comments are not in ThesisData, or need to be fetched separately */}
                {/* <div>
                  <h4 className="font-semibold mb-3 text-lg border-b pb-1">Additional Comments</h4>
                  <p className="text-gray-700 leading-relaxed italic">{thesisData.comments}</p>
                </div> */}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentResearchSummaryModal;