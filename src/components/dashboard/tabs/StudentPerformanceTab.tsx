
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Research Progress</h2>
          <p className="text-gray-600">Track your goals and academic achievements</p>
        </div>
        <Button onClick={addNewGoal}>
          <Target className="h-4 w-4 mr-2" />
          Add New Goal
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">{metrics.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Researchers</p>
                <p className="text-2xl font-bold">{metrics.uniqueResearchers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold">{metrics.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Research Hours</p>
                <p className="text-2xl font-bold">{metrics.researchHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Goals Completed</p>
                <p className="text-2xl font-bold">{metrics.goalsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>My Research Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {researchGoals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Target: {goal.targetDate}</p>
                  </div>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
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
          <CardTitle>Suggested Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm flex-1">{step}</p>
                <Button size="sm" variant="outline">
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
