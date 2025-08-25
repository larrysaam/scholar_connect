import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MessageSquare, Target, DollarSign, Mail, CheckCircle, Clock, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConsultationServices } from "@/hooks/useConsultationServices";
import { useThesisGoals } from "@/hooks/useThesisGoals";
import { useThesisMilestones } from "@/hooks/useThesisMilestones";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

interface FullThesisSupportTabProps {
  userRole: string;
}

const FullThesisSupportTab = ({ userRole }: FullThesisSupportTabProps) => {
  const { toast } = useToast();
  const { user, profile } = useAuth(); // Get the current user and profile
  const isStudent = profile?.roles?.includes('student');

  const { bookings, studentBookings, loading: bookingsLoading } = useConsultationServices();
  const [newGoal, setNewGoal] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState("");

  const projectsToDisplay = isStudent ? studentBookings : bookings;

  const activeProjects = useMemo(() => {
    if (bookingsLoading) return [];
    return projectsToDisplay.filter(booking => 
      booking.service?.category === 'Full Thesis Cycle Support' && 
      (booking.status === 'confirmed' || booking.status === 'pending')
    ).map(booking => {
      let progress = 0;
      if (booking.status === 'confirmed') progress = 50;
      if (booking.status === 'completed') progress = 100; // Assuming completed means 100% for now

      return {
        id: booking.id,
        title: booking.service?.title || 'Untitled Thesis Project',
        student: booking.client?.name || 'Unknown Student',
        progress: progress,
        nextMilestone: `Session on ${new Date(booking.scheduled_date).toLocaleDateString()} at ${booking.scheduled_time}`,
        dueDate: booking.scheduled_date,
        paymentStatus: booking.payment_status,
        totalPrice: booking.total_price,
        currency: booking.currency,
      };
    });
  }, [projectsToDisplay, bookingsLoading]);

  // For simplicity, manage goals and milestones for the first active project found
  const firstActiveProjectId = useMemo(() => activeProjects.length > 0 ? activeProjects[0].id : undefined, [activeProjects]);
  const { goals, loading: goalsLoading, addGoal, updateGoalStatus, deleteGoal } = useThesisGoals(firstActiveProjectId, user?.id || '', isStudent);
  const { milestones, loading: milestonesLoading, addMilestone, updateMilestoneStatus, deleteMilestone } = useThesisMilestones(firstActiveProjectId, user?.id || '', isStudent);

  const handleScheduleSession = (projectId: string) => {
    toast({
      title: "Session Scheduled",
      description: "A consultation session has been scheduled with the student"
    });
  };

  const handleSetMilestone = (projectId: string) => {
    // This will now open the dialog instead of directly setting a milestone
    setIsMilestoneDialogOpen(true);
  };

  const handleAddMilestone = async () => {
    if (!newMilestoneDescription) {
      toast({
        title: "Missing Milestone",
        description: "Please enter a milestone description",
        variant: "destructive"
      });
      return;
    }
    if (!firstActiveProjectId) {
      toast({
        title: "No Active Project",
        description: "Please select an active project to add a milestone.",
        variant: "destructive"
      });
      return;
    }
    
    const added = await addMilestone(newMilestoneDescription, newMilestoneDueDate);
    if (added) {
      setNewMilestoneDescription("");
      setNewMilestoneDueDate("");
      setIsMilestoneDialogOpen(false);
    }
  };

  const handleToggleGoalStatus = async (goalId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateGoalStatus(goalId, newStatus as 'pending' | 'completed' | 'in_progress');
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
  };

  const handleToggleMilestoneStatus = async (milestoneId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateMilestoneStatus(milestoneId, newStatus as 'pending' | 'completed' | 'in_progress');
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    await deleteMilestone(milestoneId);
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

  const handleAddGoal = async () => {
    if (!newGoal) {
      toast({
        title: "Missing Goal",
        description: "Please enter a goal description",
        variant: "destructive"
      });
      return;
    }
    if (!firstActiveProjectId) {
      toast({
        title: "No Active Project",
        description: "Please select an active project to add a goal.",
        variant: "destructive"
      });
      return;
    }
    
    const added = await addGoal(newGoal);
    if (added) {
      setNewGoal("");
      setIsGoalDialogOpen(false);
    }
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
            {activeProjects.length === 0 && <p className="text-gray-500">No active thesis support projects found.</p>}
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
                  {userRole !== 'student' && (
                    <Button size="sm" onClick={() => handleScheduleSession(project.id)}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Session
                    </Button>
                  )}
                  {userRole !== 'student' && (
                    <Button size="sm" variant="outline" onClick={() => handleSetMilestone(project.id)}>
                      <Target className="h-4 w-4 mr-1" />
                      Set Milestones
                    </Button>
                  )}
                  {userRole !== 'student' && (
                    <Button size="sm" variant="outline" onClick={() => setIsEmailDialogOpen(true)}>
                      <Mail className="h-4 w-4 mr-1" />
                      Send Email
                    </Button>
                  )}
                  { (
                    <Button size="sm" variant="outline" onClick={() => handleOpenChat(project.id)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Open Chat
                    </Button>
                  )}
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
            {activeProjects.length === 0 && <p className="text-gray-500">No active projects with payment milestones.</p>}
            {activeProjects.map((project) => (
              <div key={project.id} className={`flex justify-between items-center p-3 rounded ${project.paymentStatus === 'paid' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div>
                  <p className="font-medium">{project.title} - {project.student}</p>
                  <p className="text-sm text-gray-600">
                    {project.paymentStatus === 'paid' ? 'Received' : 'Expected'}: {project.currency} {project.totalPrice}
                  </p>
                </div>
                <Badge className={`${project.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {project.paymentStatus === 'paid' ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals and Milestones */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Goals and Milestones
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!firstActiveProjectId}>
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
                      <Button onClick={handleAddGoal} disabled={!newGoal || !firstActiveProjectId}>Add Goal</Button>
                      <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
                <DialogTrigger asChild>
                  {/* This trigger is intentionally hidden as the button in the project card will open it */}
                  <Button className="hidden">Set Milestone Trigger</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Milestone</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      value={newMilestoneDescription}
                      onChange={(e) => setNewMilestoneDescription(e.target.value)}
                      placeholder="Enter milestone description..."
                      rows={3}
                    />
                    <Input
                      type="date"
                      value={newMilestoneDueDate}
                      onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddMilestone} disabled={!newMilestoneDescription || !firstActiveProjectId}>Add Milestone</Button>
                      <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-lg mb-2">Goals</h4>
            {goalsLoading ? (
              <p className="text-gray-500">Loading goals...</p>
            ) : goals.length === 0 ? (
              <p className="text-gray-500">No goals tracked yet. Add a new goal above.</p>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className="flex items-center p-3 border rounded">
                  {goal.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 cursor-pointer" onClick={() => handleToggleGoalStatus(goal.id, goal.status)} />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600 mr-3 cursor-pointer" onClick={() => handleToggleGoalStatus(goal.id, goal.status)} />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{goal.description}</p>
                    <p className="text-sm text-gray-600">Status: {goal.status}</p>
                  </div>
                  <Badge className={`${goal.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {goal.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)} className="ml-2">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}

            <h4 className="font-semibold text-lg mt-6 mb-2">Milestones</h4>
            {milestonesLoading ? (
              <p className="text-gray-500">Loading milestones...</p>
            ) : milestones.length === 0 ? (
              <p className="text-gray-500">No milestones tracked yet. Add a new milestone above.</p>
            ) : (
              milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center p-3 border rounded">
                  {milestone.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 cursor-pointer" onClick={() => handleToggleMilestoneStatus(milestone.id, milestone.status)} />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600 mr-3 cursor-pointer" onClick={() => handleToggleMilestoneStatus(milestone.id, milestone.status)} />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{milestone.description}</p>
                    <p className="text-sm text-gray-600">
                      {milestone.due_date ? `Due: ${new Date(milestone.due_date).toLocaleDateString()}` : 'No due date'}
                    </p>
                    <p className="text-sm text-gray-600">Status: {milestone.status}</p>
                  </div>
                  <Badge className={`${milestone.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {milestone.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteMilestone(milestone.id)} className="ml-2">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
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
            {!isStudent && (
              <Button onClick={() => setIsEmailDialogOpen(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
            )}
            {userRole === 'researcher' && (
              <Button variant="outline" onClick={handleOpenMessages}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Messages
              </Button>
            )}
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