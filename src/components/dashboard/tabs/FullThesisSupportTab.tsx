
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MessageSquare, Target, DollarSign, Mail, CheckCircle, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FullThesisSupportTab = () => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const activeProjects = [
    {
      id: "1",
      title: "AI in Healthcare Research",
      student: "Marie Kouadio",
      progress: 65,
      nextMilestone: "Literature Review Completion",
      dueDate: "2024-07-15"
    },
    {
      id: "2", 
      title: "Machine Learning Applications",
      student: "Jean Baptiste",
      progress: 40,
      nextMilestone: "Data Collection Phase",
      dueDate: "2024-07-20"
    }
  ];

  const handleScheduleSession = (projectId: string) => {
    toast({
      title: "Session Scheduled",
      description: "A consultation session has been scheduled with the student"
    });
  };

  const handleSetMilestone = (projectId: string) => {
    toast({
      title: "Milestone Set",
      description: "New milestone has been added to the project timeline"
    });
  };

  const handleSendEmail = () => {
    if (!emailSubject || !emailContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and email content",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Email Sent",
      description: "Your email has been sent to the student"
    });
    setEmailSubject("");
    setEmailContent("");
    setIsEmailDialogOpen(false);
  };

  const handleOpenChat = (projectId: string) => {
    toast({
      title: "Chat Opened",
      description: "Opening chat with the student"
    });
  };

  const handleAddGoal = () => {
    if (!newGoal) {
      toast({
        title: "Missing Goal",
        description: "Please enter a goal description",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Goal Added",
      description: "New goal has been added to tracking"
    });
    setNewGoal("");
    setIsGoalDialogOpen(false);
  };

  const handleOpenMessages = () => {
    toast({
      title: "Messages Opened",
      description: "Opening message center"
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Full Thesis Support</h2>
      
      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm text-gray-600">Student: {project.student}</p>
                    <p className="text-sm text-gray-600">Next: {project.nextMilestone}</p>
                    <p className="text-xs text-gray-500">Due: {project.dueDate}</p>
                  </div>
                  <Badge variant="secondary">{project.progress}% Complete</Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => handleScheduleSession(project.id)}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule Session
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSetMilestone(project.id)}>
                    <Target className="h-4 w-4 mr-1" />
                    Set Milestones
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEmailDialogOpen(true)}>
                    <Mail className="h-4 w-4 mr-1" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenChat(project.id)}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Open Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Payment Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <div>
                <p className="font-medium">Initial Payment - Marie Kouadio</p>
                <p className="text-sm text-gray-600">Received: $500</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <div>
                <p className="font-medium">Mid-term Payment - Jean Baptiste</p>
                <p className="text-sm text-gray-600">Expected: $300</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal and Tracking */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Goal and Tracking
            </CardTitle>
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Enter goal description..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddGoal}>Add Goal</Button>
                    <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 border rounded">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium">Complete literature review</p>
                <p className="text-sm text-gray-600">Marie Kouadio - Due: July 15</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <div className="flex items-center p-3 border rounded">
              <Clock className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium">Data collection phase</p>
                <p className="text-sm text-gray-600">Jean Baptiste - Due: July 20</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => setIsEmailDialogOpen(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Compose Email
            </Button>
            <Button variant="outline" onClick={handleOpenMessages}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Open Messages
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject..."
            />
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Email content..."
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={handleSendEmail}>Send Email</Button>
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullThesisSupportTab;
