
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  GraduationCap, 
  Calendar, 
  Mail, 
  MessageSquare, 
  DollarSign, 
  Target,
  Clock,
  Users,
  FileText,
  Plus
} from "lucide-react";

interface ThesisProject {
  id: string;
  studentName: string;
  thesisTitle: string;
  academicLevel: "Undergraduate" | "Master's" | "PhD";
  startDate: string;
  currentPhase: string;
  totalAmount: number;
  paidAmount: number;
  nextSession: string;
  status: "active" | "completed" | "paused";
}

interface PaymentMilestone {
  id: string;
  phase: string;
  percentage: number;
  amount: number;
  description: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
}

interface Goal {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: "researcher" | "student" | "both";
}

const FullThesisSupportTab = () => {
  const [activeProjects, setActiveProjects] = useState<ThesisProject[]>([
    {
      id: "1",
      studentName: "Marie Dupont",
      thesisTitle: "Machine Learning Applications in Agricultural Prediction",
      academicLevel: "PhD",
      startDate: "2024-01-15",
      currentPhase: "Literature Review",
      totalAmount: 350000,
      paidAmount: 105000,
      nextSession: "2024-06-15 14:00",
      status: "active"
    }
  ]);

  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>([
    {
      id: "1",
      phase: "Topic Approval & Proposal",
      percentage: 30,
      amount: 105000,
      description: "Initial payment for topic development and proposal guidance",
      dueDate: "2024-02-01",
      status: "paid"
    },
    {
      id: "2",
      phase: "Data Collection & Analysis",
      percentage: 40,
      amount: 140000,
      description: "Payment for methodology design and data analysis support",
      dueDate: "2024-07-01",
      status: "pending"
    },
    {
      id: "3",
      phase: "Final Submission & Defense Prep",
      percentage: 30,
      amount: 105000,
      description: "Final payment for thesis completion and defense preparation",
      dueDate: "2024-12-01",
      status: "pending"
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete Literature Review Chapter",
      description: "Finalize the literature review chapter with at least 50 relevant sources",
      dueDate: "2024-06-20",
      status: "in-progress",
      assignedTo: "student"
    },
    {
      id: "2",
      title: "Review and Provide Feedback",
      description: "Review submitted literature review draft and provide detailed feedback",
      dueDate: "2024-06-25",
      status: "pending",
      assignedTo: "researcher"
    }
  ]);

  const handleScheduleSession = (projectId: string) => {
    console.log("Scheduling session for project:", projectId);
    // Open calendar scheduling modal
  };

  const handleSendEmail = (projectId: string) => {
    console.log("Sending email for project:", projectId);
    // Open email composer
  };

  const handleOpenChat = (projectId: string) => {
    console.log("Opening chat for project:", projectId);
    // Open in-platform messaging
  };

  const handleSetMilestones = (projectId: string) => {
    console.log("Setting payment milestones for project:", projectId);
    // Open milestone setting modal
  };

  const handleAddGoal = () => {
    console.log("Adding new goal");
    // Open goal creation modal
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Full Thesis Support</h2>
        <p className="text-gray-600">Manage comprehensive thesis support projects</p>
      </div>

      <Tabs defaultValue="active-projects" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active-projects">Active Projects</TabsTrigger>
          <TabsTrigger value="payment-milestones">Payment Milestones</TabsTrigger>
          <TabsTrigger value="goals-tracking">Goals & Tracking</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="active-projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Active Thesis Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{project.studentName}</h4>
                      <p className="text-sm text-gray-600">{project.thesisTitle}</p>
                    </div>
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Level:</span>
                      <p>{project.academicLevel}</p>
                    </div>
                    <div>
                      <span className="font-medium">Current Phase:</span>
                      <p>{project.currentPhase}</p>
                    </div>
                    <div>
                      <span className="font-medium">Progress:</span>
                      <p>{((project.paidAmount / project.totalAmount) * 100).toFixed(0)}% paid</p>
                    </div>
                    <div>
                      <span className="font-medium">Next Session:</span>
                      <p>{new Date(project.nextSession).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleScheduleSession(project.id)}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Session
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSendEmail(project.id)}>
                      <Mail className="h-4 w-4 mr-1" />
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenChat(project.id)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Open Chat
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSetMilestones(project.id)}>
                      <DollarSign className="h-4 w-4 mr-1" />
                      Set Milestones
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Payment Milestones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMilestones.map((milestone) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{milestone.phase}</h4>
                      <Badge variant={
                        milestone.status === "paid" ? "default" : 
                        milestone.status === "overdue" ? "destructive" : "secondary"
                      }>
                        {milestone.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Amount:</span>
                        <p>{milestone.amount.toLocaleString()} XAF ({milestone.percentage}%)</p>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p>{new Date(milestone.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Description:</span>
                        <p>{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Goals & Progress Tracking</span>
                </div>
                <Button onClick={handleAddGoal}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Goal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{goal.assignedTo}</Badge>
                        <Badge variant={
                          goal.status === "completed" ? "default" :
                          goal.status === "in-progress" ? "secondary" : "outline"
                        }>
                          {goal.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    <p className="text-sm">
                      <span className="font-medium">Due:</span> {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Communications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Recent email exchanges and scheduled communications</p>
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Compose Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>In-Platform Messaging</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Real-time messaging with thesis support students</p>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FullThesisSupportTab;
