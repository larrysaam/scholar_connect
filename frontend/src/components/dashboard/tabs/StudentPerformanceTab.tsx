import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, BookOpen, CheckCircle, Clock, Award } from "lucide-react";

interface ResearchGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  sessionsLinked: number;
  status: "active" | "completed" | "paused";
}

interface ProgressMetrics {
  totalSessions: number;
  uniqueResearchers: number;
  averageRating: number;
  researchHours: number;
  goalsCompleted: number;
}

const StudentPerformanceTab = () => {
  const [researchGoals, setResearchGoals] = useState<ResearchGoal[]>([
    {
      id: "1",
      title: "Complete PhD Proposal",
      description: "Finalize research proposal for PhD program application",
      targetDate: "2024-06-30",
      progress: 75,
      sessionsLinked: 4,
      status: "active"
    },
    {
      id: "2",
      title: "Publish First Paper",
      description: "Submit manuscript to peer-reviewed journal",
      targetDate: "2024-08-15",
      progress: 40,
      sessionsLinked: 2,
      status: "active"
    },
    {
      id: "3",
      title: "Master Statistical Analysis",
      description: "Learn advanced statistical methods for data analysis",
      targetDate: "2024-05-20",
      progress: 100,
      sessionsLinked: 6,
      status: "completed"
    }
  ]);

  const [metrics] = useState<ProgressMetrics>({
    totalSessions: 12,
    uniqueResearchers: 5,
    averageRating: 4.8,
    researchHours: 18,
    goalsCompleted: 1
  });

  const [nextSteps] = useState([
    "Schedule methodology review session with Dr. Ngono",
    "Complete literature review section by next week",
    "Book data analysis consultation for statistical support",
    "Prepare presentation for thesis committee meeting"
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const addNewGoal = () => {
    // Implementation for adding new goal
    console.log("Add new goal clicked");
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Research Performance & Goals</h2>
        <Button className="w-full sm:w-auto text-xs sm:text-sm">
          <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Set New Goal
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Sessions</p>
                <p className="text-xl sm:text-2xl font-bold">{metrics.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Researchers</p>
                <p className="text-xl sm:text-2xl font-bold">{metrics.uniqueResearchers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Avg. Rating</p>
                <p className="text-xl sm:text-2xl font-bold">{metrics.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Research Hours</p>
                <p className="text-xl sm:text-2xl font-bold">{metrics.researchHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Goals Completed</p>
                <p className="text-xl sm:text-2xl font-bold">{metrics.goalsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Goals */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl">Research Goals</CardTitle>
          <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {researchGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{goal.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{goal.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Target: {goal.targetDate}</p>
                  </div>
                  <Badge className={`${getStatusColor(goal.status)} flex-shrink-0 text-xs`}>
                    {goal.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">Progress</span>
                    <span className="text-xs sm:text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {goal.sessionsLinked} sessions linked to this goal
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Suggested Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium text-blue-600 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-xs sm:text-sm flex-1">{step}</p>
                <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs">
                  Act
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPerformanceTab;
