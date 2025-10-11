import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, Clock, FileText, Search, Mail } from "lucide-react";
import StartNewProjectModal from "@/components/coauthor/StartNewProjectModal";
import JoinProjectModal from "@/components/coauthor/JoinProjectModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CoAuthorWorkspace = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const userRole = profile?.role || "student";
  const fetchProjects = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    
    try {
      // Fetch projects where user is owner - simple query without joins
      const { data: owned, error: ownedErr } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user.id);
      
      if (ownedErr) throw ownedErr;

      // Fetch projects where user is a member - simple queries without complex joins
      const { data: memberships, error: memberErr } = await supabase
        .from("coauthor_memberships")
        .select("project_id, role")
        .eq("user_id", user.id);
      
      if (memberErr) throw memberErr;

      let memberProjects: any[] = [];
      if (memberships && memberships.length > 0) {
        const ids = memberships.map((m) => m.project_id);
        const { data: memberProjectsData } = await supabase
          .from("projects")
          .select("*")
          .in("id", ids);
        
        memberProjects = (memberProjectsData || []).map((proj) => {
          const membership = memberships.find((m) => m.project_id === proj.id);
          return { ...proj, role: membership?.role || "Co-Author" };
        });
      }

      // Combine owned and member projects
      let allProjects = [
        ...(owned || []).map((p) => ({ ...p, role: "Primary Author" })),
        ...memberProjects,
      ];

      // Remove duplicates (if user is both owner and member)
      allProjects = allProjects.filter(
        (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx
      );

      setProjects(allProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setError(error?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Refresh after creating/joining
  const handleProjectCreatedOrJoined = () => {
    fetchProjects();
    setShowNewProjectModal(false);
    setShowJoinModal(false);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase());
    switch (activeTab) {
      case "primary":
        return matchesSearch && project.role === "Primary Author";
      case "archived":
        return matchesSearch && project.status === "Archived";
      default:
        return matchesSearch && project.status !== "Archived";
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-500";
      case "Review": return "bg-yellow-500";
      case "Completed": return "bg-green-500";
      case "Archived": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Primary Author": return "bg-purple-100 text-purple-800";
      case "Co-Author": return "bg-blue-100 text-blue-800";
      case "Commenter": return "bg-green-100 text-green-800";
      case "Viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatLastModified = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={null} setActiveTab={() => {}} />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Co-Author Workspace</h1>
            <p className="text-gray-600">Collaborate on research publications in real-time</p>
          </div>
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowJoinModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Join Project
              </Button>
              {(userRole === "researcher" || userRole === "student") && (
                <Button
                  onClick={() => setShowNewProjectModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              )}
            </div>
          </div>
          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="primary">I'm Primary Author</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading projects...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                            <span className="text-xs text-gray-500">{project.status}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Badge className={getRoleColor(project.role)}>{project.role}</Badge>
                            <Badge variant="outline" className="text-xs">{project.visibility}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{project.collaborators || 1} collaborators</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Updated {formatLastModified(project.updated_at || project.lastModified)}</span>
                          </div>
                          <div className="pt-3 border-t">
                            <Button
                              className="w-full"
                              onClick={() => navigate(`/workspace/${project.id}`)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Open Project
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {!loading && !error && filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Start your first collaborative project"}
                  </p>
                  {!searchTerm && (userRole === "researcher" || userRole === "student") && (
                    <Button onClick={() => setShowNewProjectModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      {/* Modals */}
      <StartNewProjectModal
        open={showNewProjectModal}
        onOpenChange={(open) => {
          setShowNewProjectModal(open);
          if (!open) fetchProjects();
        }}
        userRole={userRole}

      />
      <JoinProjectModal
        open={showJoinModal}
        onOpenChange={(open) => {
          setShowJoinModal(open);
          if (!open) fetchProjects();
        }}

      />
    </div>
  );
};

export default CoAuthorWorkspace;
