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
import { useAuth } from "@/hooks/useAuth";
import { ThesisMilestonesService, ThesisMilestone } from '@/services/thesisMilestonesService';
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface FullThesisSupportTabProps {
  userRole: string;
  setActiveTab: (tab: string) => void;
}

const FullThesisSupportTab = ({ userRole, setActiveTab }: FullThesisSupportTabProps) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const isStudent = profile?.roles?.includes('student');
  // Treat both 'researcher' and 'expert' as researcher roles
  const isResearcher = profile?.roles?.includes('researcher') || profile?.roles?.includes('expert');

  const { bookings, studentBookings, loading: bookingsLoading } = useConsultationServices();
  const [newGoal, setNewGoal] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState("");
  const [milestoneProjectId, setMilestoneProjectId] = useState<string | undefined>(undefined);
  const [editingMilestone, setEditingMilestone] = useState<{ projectId: string, milestone: ThesisMilestone } | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  // Upload document dialog state
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadProjectId, setUploadProjectId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [uploadedDocumentsMap, setUploadedDocumentsMap] = useState<Record<string, { name: string, url: string }[]>>({});

  const projectsToDisplay = isStudent ? studentBookings : bookings;

  const activeProjects = useMemo(() => {
    if (bookingsLoading) return [];
    return projectsToDisplay.filter(booking => 
      booking.service?.category === 'Full Thesis Cycle Support' && 
      (booking.status === 'confirmed' || booking.status === 'pending')
    ).map(booking => {
      let progress = 0;
      if (booking.status === 'confirmed') progress = 50;
      if (booking.status === 'completed') progress = 100;

      return {
        id: booking.id,
        title: booking.service?.title || 'Untitled Thesis Project',
        student: isStudent ? booking.provider?.name || 'Unknown Researcher' : booking.client?.name || 'Unknown Student',
        progress: progress,
        nextMilestone: `Session on ${new Date(booking.scheduled_date).toLocaleDateString()} at ${booking.scheduled_time}`,
        dueDate: booking.scheduled_date,
        paymentStatus: booking.payment_status,
        totalPrice: booking.total_price,
        currency: booking.currency,
        meeting_link: booking.meeting_link,
      };
    });
  }, [projectsToDisplay, bookingsLoading]);

  const firstActiveProjectId = useMemo(() => activeProjects.length > 0 ? activeProjects[0].id : undefined, [activeProjects]);
  const { goals, loading: goalsLoading, addGoal, updateGoalStatus, deleteGoal } = useThesisGoals(firstActiveProjectId, user?.id || '', isStudent);
  const { milestones, loading: milestonesLoading, addMilestone, addMilestoneToProject, updateMilestoneStatus, deleteMilestone } = useThesisMilestones(firstActiveProjectId, user?.id || '', isStudent);

  const [projectMilestonesMap, setProjectMilestonesMap] = useState<Record<string, ThesisMilestone[]>>({});
  const [milestonesLoadingMap, setMilestonesLoadingMap] = useState<Record<string, boolean>>({});

  const fetchMilestonesForProject = async (projectId: string) => {
    setMilestonesLoadingMap((prev) => ({ ...prev, [projectId]: true }));
    const milestones = await ThesisMilestonesService.getMilestonesByBookingId(projectId, user?.id || '', isStudent);
    setProjectMilestonesMap((prev) => ({ ...prev, [projectId]: milestones || [] }));
    setMilestonesLoadingMap((prev) => ({ ...prev, [projectId]: false }));
  };

  const fetchUploadedDocuments = async (projectId: string) => {
    const { data, error } = await supabase.storage.from('lovable-uploads').list(`project-documents/${projectId}`);
    if (!error && data) {
      const docs = await Promise.all(
        data.filter(f => f.name !== ".emptyFolderPlaceholder").map(async (file) => {
          const { data: urlData } = supabase.storage.from('lovable-uploads').getPublicUrl(`project-documents/${projectId}/${file.name}`);
          return { name: file.name, url: urlData.publicUrl };
        })
      );
      setUploadedDocumentsMap(prev => ({ ...prev, [projectId]: docs }));
    }
  };

  useEffect(() => {
    async function fetchAllMilestones() {
      const newMap: Record<string, ThesisMilestone[]> = {};
      const loadingMap: Record<string, boolean> = {};
      await Promise.all(
        activeProjects.map(async (project) => {
          loadingMap[project.id] = true;
          const milestones = await ThesisMilestonesService.getMilestonesByBookingId(project.id, user?.id || '', isStudent);
          newMap[project.id] = milestones || [];
          loadingMap[project.id] = false;
        })
      );
      setProjectMilestonesMap(newMap);
      setMilestonesLoadingMap(loadingMap);
    }
    if (activeProjects.length > 0 && user?.id) {
      fetchAllMilestones();
    }
  }, [activeProjects, user?.id, isStudent]);

  useEffect(() => {
    activeProjects.forEach(project => {
      fetchUploadedDocuments(project.id);
    });
  }, [activeProjects]);

  const handleSetMilestone = (projectId: string) => {
    setMilestoneProjectId(projectId);
    setIsMilestoneDialogOpen(true);
  };

  const handleAddMilestone = async (projectId: string, description: string, dueDate?: string) => {
    const added = await ThesisMilestonesService.addMilestone(projectId, description, dueDate);
    if (added) {
      setProjectMilestonesMap((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), added],
      }));
    }
    return added;
  };

  const handleAddMilestoneClick = async () => {
    if (!milestoneProjectId || !newMilestoneDescription) return;
    await handleAddMilestone(milestoneProjectId, newMilestoneDescription, newMilestoneDueDate);
    setNewMilestoneDescription("");
    setNewMilestoneDueDate("");
    setIsMilestoneDialogOpen(false);
    setMilestoneProjectId(undefined);
  };

  const handleEditMilestone = (projectId: string, milestone: ThesisMilestone) => {
    setEditingMilestone({ projectId, milestone });
    setEditDescription(milestone.description);
    setEditDueDate(milestone.due_date || "");
  };

  const handleSaveEditMilestone = async () => {
    if (!editingMilestone) return;
    const { projectId, milestone } = editingMilestone;
    const updated = await ThesisMilestonesService.updateMilestone(milestone.id, editDescription, editDueDate);
    if (updated) {
      setProjectMilestonesMap((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((m) => m.id === milestone.id ? updated : m),
      }));
      setEditingMilestone(null);
    }
  };

  const handleChangeMilestoneStatus = async (projectId: string, milestone: ThesisMilestone, status: 'pending' | 'completed' | 'in_progress') => {
    const updated = await ThesisMilestonesService.updateMilestoneStatus(milestone.id, status);
    if (updated) {
      setProjectMilestonesMap((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((m) => m.id === milestone.id ? updated : m),
      }));
    }
  };

  const handleDeleteMilestone = async (projectId: string, milestoneId: string) => {
    const success = await ThesisMilestonesService.deleteMilestone(milestoneId);
    if (success) {
      setProjectMilestonesMap((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter((m) => m.id !== milestoneId),
      }));
    }
  };

  const handleToggleGoalStatus = async (goalId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateGoalStatus(goalId, newStatus as 'pending' | 'completed' | 'in_progress');
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
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
    setActiveTab("messages");
    toast({
      title: "Chat Opened",
      description: "Navigating to messages..."
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

  const handleUploadDocument = (projectId: string) => {
    setUploadProjectId(projectId);
    setIsUploadDialogOpen(true);
    setUploadFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !uploadProjectId) return;
    const fileExt = uploadFile.name.split('.').pop();
    const filePath = `project-documents/${uploadProjectId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('lovable-uploads').upload(filePath, uploadFile);
    if (error) {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Document Uploaded', description: 'Your document was uploaded successfully.' });
      setIsUploadDialogOpen(false);
      setUploadProjectId(null);
      setUploadFile(null);
      fetchUploadedDocuments(uploadProjectId); // Refresh document list
    }
  };

  // Filter state for active projects
  const [projectFilter, setProjectFilter] = useState<'all' | 'ongoing' | 'complete'>('all');

  // Helper to calculate percent complete for a project
  const getProjectPercentComplete = (projectId: string) => {
    const milestones = projectMilestonesMap[projectId] || [];
    if (milestones.length === 0) return 0;
    return Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100);
  };

  // Filtered active projects based on filter state
  const filteredActiveProjects = useMemo(() => {
    if (projectFilter === 'all') return activeProjects;
    if (projectFilter === 'ongoing') {
      return activeProjects.filter(p => getProjectPercentComplete(p.id) < 100);
    }
    if (projectFilter === 'complete') {
      return activeProjects.filter(p => getProjectPercentComplete(p.id) === 100);
    }
    return activeProjects;
  }, [activeProjects, projectFilter, projectMilestonesMap]);

  // Pagination state for active projects
  const [activeProjectsPage, setActiveProjectsPage] = useState(1);
  const PROJECTS_PER_PAGE = 5;
  const totalActivePages = Math.ceil(filteredActiveProjects.length / PROJECTS_PER_PAGE);
  const paginatedActiveProjects = useMemo(() => {
    const start = (activeProjectsPage - 1) * PROJECTS_PER_PAGE;
    return filteredActiveProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [filteredActiveProjects, activeProjectsPage]);
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Full Thesis Support</h2>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Active Projects
          </CardTitle>
          {/* Filter controls */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <Button size="sm" variant={projectFilter === 'all' ? 'default' : 'outline'} onClick={() => { setProjectFilter('all'); setActiveProjectsPage(1); }} className="text-xs sm:text-sm">All</Button>
            <Button size="sm" variant={projectFilter === 'ongoing' ? 'default' : 'outline'} onClick={() => { setProjectFilter('ongoing'); setActiveProjectsPage(1); }} className="text-xs sm:text-sm">Ongoing</Button>
            <Button size="sm" variant={projectFilter === 'complete' ? 'default' : 'outline'} onClick={() => { setProjectFilter('complete'); setActiveProjectsPage(1); }} className="text-xs sm:text-sm">Complete</Button>
          </div>
        </CardHeader>        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {paginatedActiveProjects.length === 0 && <p className="text-gray-500 text-sm">No active thesis support projects found.</p>}
            {paginatedActiveProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base">{project.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{isStudent ? "Researcher:" : "Student:"} {project.student}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Next: {project.nextMilestone}</p>
                      <p className="text-xs text-gray-500">Due: {project.dueDate}</p>
                    </div>
                    {/* Show Ongoing/Completed badge and percent complete */}
                    <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-0">
                      <Badge variant={getProjectPercentComplete(project.id) === 100 ? "default" : "secondary"} className="text-xs">
                        {getProjectPercentComplete(project.id) === 100 ? 'Completed' : 'Ongoing'}
                      </Badge>
                      <span className="text-xs text-gray-500 sm:mt-1">{getProjectPercentComplete(project.id)}%</span>
                    </div>
                  </div>                  {/* Milestones List for this project */}
                  <div className="mb-2 sm:mb-3">
                    <h5 className="font-semibold text-xs sm:text-sm mb-1">Milestones</h5>
                    {milestonesLoadingMap[project.id] ? (
                      <p className="text-gray-500 text-xs">Loading milestones...</p>
                    ) : (projectMilestonesMap[project.id]?.length === 0 ? (
                      <p className="text-gray-500 text-xs">No milestones yet.</p>
                    ) : (
                      <ul className="space-y-1 sm:space-y-2">
                        {projectMilestonesMap[project.id]?.map((milestone) => (
                          <li key={milestone.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              {milestone.status === 'completed' ? (
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                              )}
                              <span className="flex-1">{milestone.description}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-5 sm:ml-0">
                              {milestone.due_date && (
                                <span className="text-gray-400 text-xs">(Due: {new Date(milestone.due_date).toLocaleDateString()})</span>
                              )}
                              <Badge className={`text-xs ${milestone.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{milestone.status}</Badge>
                            </div>
                            {/* Fix: Only show controls for researchers */}
                            {isResearcher === true && (
                              <>
                                <Button size="sm" variant="outline" className="ml-1" onClick={() => handleEditMilestone(project.id, milestone)}>
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive" className="ml-1" onClick={() => handleDeleteMilestone(project.id, milestone.id)}>
                                  Delete
                                </Button>
                                <select value={milestone.status} onChange={e => handleChangeMilestoneStatus(project.id, milestone, e.target.value as any)} className="ml-2 text-xs border rounded">
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ))}                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    {/* Only show Set Milestones for researchers */}
                    {isResearcher && (
                      <Button size="sm" variant="outline" onClick={() => handleSetMilestone(project.id)} className="w-full sm:w-auto text-xs">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Set Milestones
                      </Button>
                    )}
                    {/* Show Join Google Meet for all users, blue for students */}
                    {project.meeting_link && (
                      <Button size="sm" variant="default" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto text-xs" onClick={() => window.open(project.meeting_link, '_blank')}>
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Join Google Meet
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleUploadDocument(project.id)} className="w-full sm:w-auto text-xs">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Upload Document
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenChat(project.id)} className="w-full sm:w-auto text-xs">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Open Chat
                    </Button>
                  </div>                  {/* Uploaded Documents Preview styled like Upcoming Session Tab */}
                  <div className="mt-3 sm:mt-4">
                    <h6 className="font-semibold text-xs mb-2">Uploaded Documents</h6>
                    {uploadedDocumentsMap[project.id] && uploadedDocumentsMap[project.id].length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {uploadedDocumentsMap[project.id].map((doc, idx) => (
                          <div
                            key={doc.name + idx}
                            className="flex items-center border rounded bg-white px-2 py-2 shadow-sm hover:bg-gray-50 transition cursor-pointer"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            {/* File type icon/preview */}
                            {(() => {
                              const ext = doc.name.split('.').pop()?.toLowerCase();
                              if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext || "")) {
                                return <img src={doc.url} alt={doc.name} className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded mr-2 border flex-shrink-0" />;
                              } else if (["pdf"].includes(ext || "")) {
                                return <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-red-100 text-red-700 rounded mr-2 border text-xs font-bold flex-shrink-0">PDF</span>;
                              } else if (["doc", "docx"].includes(ext || "")) {
                                return <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded mr-2 border text-xs font-bold flex-shrink-0">DOC</span>;
                              } else if (["xls", "xlsx"].includes(ext || "")) {
                                return <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-green-100 text-green-700 rounded mr-2 border text-xs font-bold flex-shrink-0">XLS</span>;
                              } else {
                                return <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded mr-2 border text-xs font-bold flex-shrink-0">FILE</span>;
                              }
                            })()}
                            <span className="truncate flex-1 text-xs" title={doc.name}>{doc.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs">No documents uploaded yet.</p>
                    )}
                  </div>
                </div>
            ))}            {/* Pagination controls */}
            {totalActivePages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setActiveProjectsPage(p => Math.max(1, p - 1))} disabled={activeProjectsPage === 1} className="w-full sm:w-auto text-xs">Previous</Button>
                <span className="text-xs sm:text-sm">Page {activeProjectsPage} of {totalActivePages}</span>
                <Button size="sm" variant="outline" onClick={() => setActiveProjectsPage(p => Math.min(totalActivePages, p + 1))} disabled={activeProjectsPage === totalActivePages} className="w-full sm:w-auto text-xs">Next</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Milestones */}
      {/* <Card>
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
      </Card> */}

      {/* Goals and Milestones */}
      {/* <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Goals and Milestones
            </CardTitle>
            <div className="flex gap-2">
              {isResearcher && (
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
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-lg mb-2">Goals</h4>
            {goalsLoading ? (
              <p className="text-gray-500">Loading goals...</p>
            ) : goals.length === 0 ? (
              <p className="text-gray-500">No goals tracked yet. {isResearcher ? 'Add a new goal above.' : 'Goals will appear here when set by your researcher.'}</p>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className="flex items-center p-3 border rounded">
                  {isResearcher ? (
                    goal.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 cursor-pointer" onClick={() => handleToggleGoalStatus(goal.id, goal.status)} />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 mr-3 cursor-pointer" onClick={() => handleToggleGoalStatus(goal.id, goal.status)} />
                    )
                  ) : (
                    goal.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                    )
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{goal.description}</p>
                    <p className="text-sm text-gray-600">Status: {goal.status}</p>
                  </div>
                  <Badge className={`${goal.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{goal.status === 'completed' ? 'Completed' : 'In Progress'}</Badge>
                  {isResearcher && (
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)} className="ml-2">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))
            )}

            <h4 className="font-semibold text-lg mt-6 mb-2">Milestones</h4>
            {milestonesLoading ? (
              <p className="text-gray-500">Loading milestones...</p>
            ) : milestones.length === 0 ? (
              <p className="text-gray-500">No milestones tracked yet. {isResearcher ? 'Add a new milestone above.' : 'Milestones will appear here when set by your researcher.'}</p>
            ) : (
              milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center p-3 border rounded">
                  {isResearcher ? (
                    milestone.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 cursor-pointer" onClick={() => handleChangeMilestoneStatus(firstActiveProjectId!, milestone, milestone.status)} />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 mr-3 cursor-pointer" onClick={() => handleChangeMilestoneStatus(firstActiveProjectId!, milestone, milestone.status)} />
                    )
                  ) : (
                    milestone.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                    )
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
                  {isResearcher && (
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMilestone(firstActiveProjectId!, milestone.id)} className="ml-2">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card> */}

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
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

      {/* Milestone Dialog */}
      <Dialog open={isMilestoneDialogOpen} onOpenChange={(open) => { setIsMilestoneDialogOpen(open); if (!open) setMilestoneProjectId(undefined); }}>
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
              <Button onClick={handleAddMilestoneClick} disabled={!newMilestoneDescription || !milestoneProjectId}>Add Milestone</Button>
              <Button variant="outline" onClick={() => { setIsMilestoneDialogOpen(false); setMilestoneProjectId(undefined); }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Milestone Dialog */}
      {editingMilestone && (
        <Dialog open={!!editingMilestone} onOpenChange={() => setEditingMilestone(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Milestone description" />
              <Input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} placeholder="Due date" />
              <div className="flex gap-2">
                <Button onClick={handleSaveEditMilestone}>Save</Button>
                <Button variant="outline" onClick={() => setEditingMilestone(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Document Dialog */}
      {isUploadDialogOpen && (
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input type="file" onChange={handleFileChange} />
              <div className="flex gap-2">
                <Button onClick={handleUploadSubmit} disabled={!uploadFile}>Upload</Button>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FullThesisSupportTab;