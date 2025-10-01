import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Settings, FileText, MessageSquare, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileManager from "@/components/coauthor/FileManager";
import CollaborativeEditor from "@/components/coauthor/CollaborativeEditor";
import TaskTracker from "@/components/coauthor/TaskTracker";
import TeamManagement from "@/components/coauthor/TeamManagement";
import VersionHistory from "@/components/coauthor/VersionHistory";
import CommentsSection from "@/components/coauthor/CommentsSection";

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  visibility: string;
  status: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  content: any;
  tags: string[];
  word_count: number;
  page_count: number;
}

const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("editor");
  const [document, setDocument] = useState({
    title: "",
    abstract: "",
    content: "",
    references: ""
  });
  // User permissions in this project
  const [permissions, setPermissions] = useState({
    canWrite: false,
    canUpload: false,
    canDelete: false,
    canExport: false,
    canManageTeam: false,
  });

  // Team members
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>>([]);
  useEffect(() => {
    if (projectId && user) {
      fetchProject();
      checkPermissions();
      fetchTeamMembers();
    }
  }, [projectId, user]);

  const fetchProject = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        throw error;
      }

      setProject(data);
      
      // Initialize document from project content
      if (data.content) {
        setDocument({
          title: data.content.title || data.title || "",
          abstract: data.content.abstract || "",
          content: data.content.content || "",
          references: data.content.references || ""
        });
      } else {
        setDocument({
          title: data.title || "",
          abstract: "",
          content: "",
          references: ""
        });
      }
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive"
      });
      navigate('/coauthor-workspace');
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    if (!projectId || !user) return;

    try {
      // Check if user is project owner
      const { data: projectData } = await supabase
        .from('projects')
        .select('owner_id')
        .eq('id', projectId)
        .single();

      const isOwner = projectData?.owner_id === user.id;

      // Check if user is a team member
      const { data: membership } = await supabase
        .from('coauthor_memberships')
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single();

      const isMember = !!membership;
      const memberRole = membership?.role || 'viewer';

      // Set permissions based on role
      setPermissions({
        canWrite: isOwner || isMember,
        canUpload: isOwner || isMember,
        canDelete: isOwner || memberRole === 'editor',
        canExport: isOwner || isMember,
        canManageTeam: isOwner,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
      // Default to minimal permissions
      setPermissions({
        canWrite: false,
        canUpload: false,
        canDelete: false,
        canExport: false,
        canManageTeam: false,
      });
    }
  };

  const fetchTeamMembers = async () => {
    if (!projectId) return;

    try {
      // For now, we'll use mock data since we don't have project_members table yet
      // In a real implementation, you would query project_members with user profiles
      const mockTeamMembers = [
        {
          id: "1",
          name: "Dr. Sarah Wilson",
          email: "sarah.wilson@university.edu",
          role: "Principal Investigator"
        },
        {
          id: "2", 
          name: "John Smith",
          email: "john.smith@university.edu",
          role: "Research Assistant"
        },
        {
          id: "3",
          name: "Prof. Michael Chen", 
          email: "michael.chen@university.edu",
          role: "Co-Investigator"
        }
      ];
      
      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!projectId || !project) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: document.title,
          content: {
            title: document.title,
            abstract: document.abstract,
            content: document.content,
            references: document.references
          },
          word_count: document.content.split(/\s+/).length,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project saved successfully!"
      });

      // Refresh project data
      fetchProject();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive"
      });
    }
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting project as ${format.toUpperCase()}...`
    });
    // Implementation would depend on chosen export library
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading project...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/coauthor-workspace')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workspace
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/coauthor-workspace')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workspace
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              <Badge variant="outline">
                {project.visibility}
              </Badge>
              <Badge variant="outline">
                {project.type}
              </Badge>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            {project.description && (
              <p className="text-gray-600 mb-4">{project.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                <span>Last updated: {new Date(project.updated_at).toLocaleDateString()}</span>
                {project.word_count > 0 && (
                  <span>{project.word_count.toLocaleString()} words</span>
                )}
              </div>
              
              {permissions.canWrite && (
                <Button onClick={handleSave}>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Versions
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-6">
            <CollaborativeEditor
              document={document}
              setDocument={setDocument}
              permissions={permissions}
              onSave={handleSave}
              onExport={handleExport}
            />
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <FileManager
              projectId={projectId!}
              permissions={{
                canUpload: permissions.canUpload,
                canDelete: permissions.canDelete,
              }}
            />
          </TabsContent>          <TabsContent value="tasks" className="mt-6">
            <TaskTracker
              projectId={projectId!}
              permissions={{
                canAssignTasks: permissions.canWrite,
              }}
              teamMembers={teamMembers}
            />
          </TabsContent>          <TabsContent value="team" className="mt-6">
            <TeamManagement
              projectId={projectId!}
              teamMembers={teamMembers}
              permissions={{
                canInvite: permissions.canManageTeam,
                canRemove: permissions.canManageTeam,
                canChangeRoles: permissions.canManageTeam,
              }}
            />
          </TabsContent>

          <TabsContent value="versions" className="mt-6">
            <VersionHistory
              projectId={projectId!}
              permissions={permissions}
            />
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <CommentsSection
              projectId={projectId!}
              permissions={permissions}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectWorkspace;
