import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MessageSquare, Target, DollarSign, Mail, CheckCircle, Clock, Plus, Trash2, FileText, Download } from "lucide-react";
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
  
  // Document management state
  const [projectDocuments, setProjectDocuments] = useState<Record<string, any[]>>({});
  const [documentsLoadingMap, setDocumentsLoadingMap] = useState<Record<string, boolean>>({});
  const [uploadingDocuments, setUploadingDocuments] = useState<Record<string, boolean>>({});

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
  }, [activeProjects, user?.id, isStudent]);  const fetchProjectDocuments = async (projectId: string) => {
    setDocumentsLoadingMap(prev => ({ ...prev, [projectId]: true }));
    
    try {
      const { data, error } = await supabase.storage.from('lovable-uploads').list(`project-documents/${projectId}`);
      if (!error && data) {
        const docs = await Promise.all(
          data.filter(f => f.name !== ".emptyFolderPlaceholder").map(async (file) => {
            const { data: urlData } = supabase.storage.from('lovable-uploads').getPublicUrl(`project-documents/${projectId}/${file.name}`);
            return { 
              id: file.name,
              filename: file.name, 
              uploaded_at: file.updated_at || file.created_at || new Date().toISOString(),
              url: urlData.publicUrl 
            };
          })
        );
        setProjectDocuments(prev => ({ ...prev, [projectId]: docs }));
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setDocumentsLoadingMap(prev => ({ ...prev, [projectId]: false }));
    }
  };

  useEffect(() => {
    activeProjects.forEach(project => {
      fetchUploadedDocuments(project.id);
      fetchProjectDocuments(project.id);
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
    
    setUploadingDocuments(prev => ({ ...prev, [uploadProjectId]: true }));
    
    const fileExt = uploadFile.name.split('.').pop();
    const filePath = `project-documents/${uploadProjectId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('lovable-uploads').upload(filePath, uploadFile);
    
    setUploadingDocuments(prev => ({ ...prev, [uploadProjectId]: false }));
    
    if (error) {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Document Uploaded', description: 'Your document was uploaded successfully.' });
      setIsUploadDialogOpen(false);
      setUploadProjectId(null);
      setUploadFile(null);
      fetchProjectDocuments(uploadProjectId); // Refresh document list
    }  };

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

  const handleDownloadDocument = (document: any) => {
    window.open(document.url, '_blank');
  };

  const handleDeleteDocument = async (projectId: string, documentId: string) => {
    try {
      const { error } = await supabase.storage.from('lovable-uploads').remove([`project-documents/${projectId}/${documentId}`]);
      if (!error) {
        toast({ title: 'Document Deleted', description: 'Document has been removed successfully.' });
        fetchProjectDocuments(projectId); // Refresh document list
      } else {
        toast({ title: 'Delete Failed', description: error.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Delete Failed', description: 'An error occurred while deleting the document.', variant: 'destructive' });
    }
  };return (
    <div className="space-y-6 sm:space-y-8 p-1 sm:p-0">
      {/* Modern Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Full Thesis Support
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Comprehensive guidance for your research journey
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{filteredActiveProjects.filter(p => getProjectPercentComplete(p.id) < 100).length} Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{filteredActiveProjects.filter(p => getProjectPercentComplete(p.id) === 100).length} Complete</span>
          </div>
        </div>
      </div>

      {/* Modern Active Projects Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center text-lg sm:text-xl font-semibold text-gray-800">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              Active Projects
            </CardTitle>
            {/* Modern Filter Pills */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              <Button 
                size="sm" 
                variant={projectFilter === 'all' ? 'default' : 'ghost'} 
                onClick={() => { setProjectFilter('all'); setActiveProjectsPage(1); }} 
                className={`text-xs sm:text-sm rounded-lg px-4 py-2 transition-all duration-200 ${
                  projectFilter === 'all' 
                    ? 'bg-white shadow-sm font-medium' 
                    : 'hover:bg-white/50'
                }`}
              >
                All
              </Button>
              <Button 
                size="sm" 
                variant={projectFilter === 'ongoing' ? 'default' : 'ghost'} 
                onClick={() => { setProjectFilter('ongoing'); setActiveProjectsPage(1); }} 
                className={`text-xs sm:text-sm rounded-lg px-4 py-2 transition-all duration-200 ${
                  projectFilter === 'ongoing' 
                    ? 'bg-white shadow-sm font-medium' 
                    : 'hover:bg-white/50'
                }`}
              >
                Ongoing
              </Button>
              <Button 
                size="sm" 
                variant={projectFilter === 'complete' ? 'default' : 'ghost'} 
                onClick={() => { setProjectFilter('complete'); setActiveProjectsPage(1); }} 
                className={`text-xs sm:text-sm rounded-lg px-4 py-2 transition-all duration-200 ${
                  projectFilter === 'complete' 
                    ? 'bg-white shadow-sm font-medium' 
                    : 'hover:bg-white/50'
                }`}
              >
                Complete
              </Button>
            </div>
          </div>
        </CardHeader>        <CardContent className="p-6">
          <div className="space-y-6">
            {paginatedActiveProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No active projects found</p>
                <p className="text-gray-400 text-sm mt-1">Your thesis support projects will appear here</p>
              </div>
            )}
            {paginatedActiveProjects.map((project) => (
                <div key={project.id} className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                  {/* Progress bar background */}
                  <div className="absolute top-0 left-0 h-1 bg-gray-100 rounded-t-xl w-full">
                    <div 
                      className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl transition-all duration-500"
                      style={{ width: `${getProjectPercentComplete(project.id)}%` }}
                    ></div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-1">{project.title}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="font-medium">{isStudent ? "Researcher:" : "Student:"}</span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{project.student}</span>
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>Next: {project.nextMilestone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {/* Modern Status Badge */}
                    <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3 sm:gap-2">
                      <div className={`px-4 py-2 rounded-full text-xs font-semibold ${
                        getProjectPercentComplete(project.id) === 100 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      }`}>
                        {getProjectPercentComplete(project.id) === 100 ? 'Completed' : 'In Progress'}
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{getProjectPercentComplete(project.id)}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>                  </div>

                  {/* Enhanced Milestones Section with Timeline Design */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-base sm:text-lg bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                        Project Milestones
                      </h5>
                      <div className="text-xs text-gray-500">
                        {projectMilestonesMap[project.id]?.filter(m => m.status === 'completed').length || 0} / {projectMilestonesMap[project.id]?.length || 0} Complete
                      </div>
                    </div>
                      {milestonesLoadingMap[project.id] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-500 text-sm">Loading milestones...</span>
                      </div>
                    ) : projectMilestonesMap[project.id]?.length === 0 ? (
                      <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                          <Target className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No milestones set yet</p>
                        <p className="text-gray-400 text-sm mt-1">Milestones help track project progress</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {projectMilestonesMap[project.id]?.map((milestone, index) => (
                          <div key={milestone.id} className="relative">
                            {/* Timeline connector line */}
                            {index < (projectMilestonesMap[project.id]?.length || 0) - 1 && (
                              <div className="absolute left-4 top-8 w-0.5 h-6 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                            )}
                            
                            <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                              milestone.status === 'completed' 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
                                : milestone.status === 'in_progress'
                                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300'
                                : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300'
                            }`}>
                              {/* Status indicator with enhanced design */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                milestone.status === 'completed' 
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200' 
                                  : milestone.status === 'in_progress'
                                  ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-200'
                                  : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg shadow-gray-200'
                              }`}>
                                {milestone.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : milestone.status === 'in_progress' ? (
                                  <Clock className="h-4 w-4 text-white" />
                                ) : (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm sm:text-base leading-relaxed">
                                      {milestone.description}
                                    </p>
                                    {milestone.due_date && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                          Due: {new Date(milestone.due_date).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Badge className={`text-xs font-medium px-3 py-1 ${
                                      milestone.status === 'completed' 
                                        ? 'bg-green-100 text-green-700 border-green-200' 
                                        : milestone.status === 'in_progress'
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}>
                                      {milestone.status === 'completed' ? 'Completed' : 
                                       milestone.status === 'in_progress' ? 'In Progress' : 'Pending'}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Researcher Controls with Enhanced Styling */}
                                {isResearcher && (
                                  <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t border-gray-200/50">
                                    <div className="flex gap-2">
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => handleEditMilestone(project.id, milestone)}
                                        className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                      >
                                        Edit
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="destructive" 
                                        onClick={() => handleDeleteMilestone(project.id, milestone.id)}
                                        className="text-xs hover:bg-red-600 transition-all duration-200"
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                    <select 
                                      value={milestone.status} 
                                      onChange={e => handleChangeMilestoneStatus(project.id, milestone, e.target.value as any)} 
                                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="in_progress">In Progress</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Action Buttons Section */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 flex-1">
                      {/* Only show Set Milestones for researchers */}
                      {isResearcher && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleSetMilestone(project.id)} 
                          className="group flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 font-medium"
                        >
                          <div className="p-1 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                            <Target className="h-3 w-3" />
                          </div>
                          <span className="text-xs sm:text-sm">Set Milestones</span>
                        </Button>
                      )}
                      
                      {/* Enhanced Google Meet Button */}
                      {project.meeting_link && (
                        <Button 
                          size="sm" 
                          onClick={() => window.open(project.meeting_link, '_blank')}
                          className="group flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all duration-200 font-medium"
                        >
                          <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                            <Calendar className="h-3 w-3" />
                          </div>
                          <span className="text-xs sm:text-sm">Join Meeting</span>
                        </Button>
                      )}
                      
                      {/* Enhanced Upload Document Button */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUploadDocument(project.id)} 
                        className="group flex items-center justify-center gap-2 px-4 py-2 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 font-medium"
                      >
                        <div className="p-1 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                          <Plus className="h-3 w-3" />
                        </div>
                        <span className="text-xs sm:text-sm">Upload Doc</span>
                      </Button>
                      
                      {/* Enhanced Chat Button */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleOpenChat(project.id)} 
                        className="group flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 font-medium"
                      >
                        <div className="p-1 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                          <MessageSquare className="h-3 w-3" />
                        </div>
                        <span className="text-xs sm:text-sm">Open Chat</span>
                      </Button>
                    </div>
                  </div>                  {/* Uploaded Documents Preview styled like Upcoming Session Tab */}
                  
                  {/* Enhanced Document Upload Area */}
                  {uploadingDocuments[project.id] && (
                    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                      <div className="flex items-center justify-center mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                      <p className="text-center text-blue-700 font-medium">
                        Uploading document...
                      </p>
                      <p className="text-center text-blue-600 text-sm mt-1">
                        Please wait while we process your file
                      </p>
                    </div>
                  )}

                  {/* Enhanced Documents Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-base sm:text-lg bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                        Project Documents
                      </h5>
                      <div className="text-xs text-gray-500">
                        {(projectDocuments[project.id] || []).length} files
                      </div>
                    </div>                    
                    {documentsLoadingMap[project.id] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-500 text-sm">Loading documents...</span>
                      </div>
                    ) : (projectDocuments[project.id] || []).length === 0 ? (
                      <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all duration-200">
                        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-gray-600 font-medium">No documents uploaded yet</p>
                        <p className="text-gray-500 text-sm mt-1">Share files to collaborate on your project</p>
                        <Button 
                          size="sm" 
                          onClick={() => handleUploadDocument(project.id)}
                          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Upload First Document
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {(projectDocuments[project.id] || []).map((doc) => (
                          <div key={doc.id} className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 text-sm truncate">
                                  {doc.filename}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownloadDocument(doc)}
                                className="text-xs hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              {isResearcher && (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleDeleteDocument(project.id, doc.id)}
                                  className="text-xs hover:bg-red-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
            ))}

            {/* Pagination controls */}
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