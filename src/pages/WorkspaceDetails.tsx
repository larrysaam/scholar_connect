
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  Upload, 
  History, 
  Save, 
  Download, 
  Share2,
  MoreHorizontal
} from "lucide-react";
import CollaborativeEditor from "@/components/coauthor/CollaborativeEditor";
import CommentSidebar from "@/components/coauthor/CommentSidebar";
import TaskTracker from "@/components/coauthor/TaskTracker";
import FileManager from "@/components/coauthor/FileManager";
import VersionHistory from "@/components/coauthor/VersionHistory";
import TeamManagement from "@/components/coauthor/TeamManagement";

const WorkspaceDetails = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("editor");
  const [projectData, setProjectData] = useState({
    id: projectId,
    title: "Impact of AI on Educational Research Methodologies",
    type: "Journal Article",
    description: "A comprehensive study exploring how artificial intelligence is transforming traditional research methodologies in education.",
    status: "In Progress",
    visibility: "Private",
    created: "2024-01-10",
    lastModified: "2024-01-15T10:30:00Z"
  });

  const [document, setDocument] = useState({
    title: "Impact of AI on Educational Research Methodologies",
    abstract: "This research explores how artificial intelligence is transforming traditional research methodologies in education...",
    content: "# Introduction\n\nArtificial Intelligence (AI) has emerged as a transformative force across various sectors, with education being no exception...",
    references: "1. Smith, J. (2023). AI in Education: A Comprehensive Review. Journal of Educational Technology.\n2. Brown, A. et al. (2022). Machine Learning Applications in Academic Research. Academic Press."
  });

  // Mock user permissions - in real app this would come from auth and project membership
  const userPermissions = {
    canWrite: true,
    canComment: true,
    canAssignTasks: true,
    canInvite: false,
    canExport: true,
    role: "Co-Author"
  };

  const teamMembers = [
    { 
      id: "1", 
      name: "Dr. Sarah Johnson", 
      email: "sarah.johnson@university.edu",
      role: "Primary Author", 
      avatar: null,
      status: "online",
      joinedAt: "2024-01-10"
    },
    { 
      id: "2", 
      name: "Prof. Michael Chen", 
      email: "m.chen@institute.org",
      role: "Co-Author", 
      avatar: null,
      status: "offline",
      joinedAt: "2024-01-11"
    },
    { 
      id: "3", 
      name: "Dr. Emily Rodriguez", 
      email: "emily.r@college.edu",
      role: "Co-Author", 
      avatar: null,
      status: "in-session",
      joinedAt: "2024-01-12"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'in-session': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const handleSave = () => {
    // In real app, this would save to the database
    console.log("Saving document...", document);
  };

  const handleExport = (format: string) => {
    // In real app, this would generate and download the file
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{projectData.title}</h1>
                  <Badge variant="outline">{projectData.type}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">{projectData.status}</Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Project ID: {projectId}</span>
                  <span>•</span>
                  <span>Your role: {userPermissions.role}</span>
                  <span>•</span>
                  <span>{teamMembers.length} collaborators</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Team Avatars */}
                <div className="flex -space-x-2">
                  {teamMembers.slice(0, 4).map((member) => (
                    <div key={member.id} className="relative">
                      <Avatar className="border-2 border-white w-8 h-8">
                        <AvatarImage src={member.avatar || undefined} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                  ))}
                  {teamMembers.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium">+{teamMembers.length - 4}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="container mx-auto px-4 md:px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor">
              <CollaborativeEditor 
                document={document}
                setDocument={setDocument}
                permissions={userPermissions}
                onSave={handleSave}
                onExport={handleExport}
              />
            </TabsContent>
            
            <TabsContent value="comments">
              <CommentSidebar 
                projectId={projectId || ""}
                permissions={userPermissions}
              />
            </TabsContent>
            
            <TabsContent value="tasks">
              <TaskTracker 
                projectId={projectId || ""}
                permissions={userPermissions}
                teamMembers={teamMembers}
              />
            </TabsContent>
            
            <TabsContent value="files">
              <FileManager 
                projectId={projectId || ""}
                permissions={userPermissions}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <VersionHistory 
                projectId={projectId || ""}
                permissions={userPermissions}
              />
            </TabsContent>
            
            <TabsContent value="team">
              <TeamManagement 
                projectId={projectId || ""}
                teamMembers={teamMembers}
                permissions={userPermissions}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkspaceDetails;
