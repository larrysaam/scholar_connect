
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { History, RotateCcw, Eye, Download, Plus, GitBranch, Clock, User } from "lucide-react";
import { useVersionHistory } from "@/hooks/useVersionHistory";

interface VersionHistoryProps {
  projectId: string;
  permissions: {
    canRestore?: boolean;
    canExport?: boolean;
    canWrite?: boolean;
  };
  currentDocument?: {
    title: string;
    abstract: string;
    content: string;
    references: string;
  };
}

const VersionHistory = ({ projectId, permissions, currentDocument }: VersionHistoryProps) => {
  const { versions, loading, createVersion, restoreVersion, compareVersions } = useVersionHistory(projectId);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newVersionTitle, setNewVersionTitle] = useState("");
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    // Convert real versions to display format
  const convertVersionToDisplayFormat = (version: any, index: number) => ({
    id: version.id,
    version: `v${version.version_number}`,
    title: version.title,
    author: version.author?.name || "Unknown User",
    avatar: null,
    timestamp: version.created_at,
    changes: 0, // Could be calculated if needed
    isCurrent: index === 0 // First version is current
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };  const handleRestore = async (versionId: string) => {
    const success = await restoreVersion(versionId);
    if (success) {
      // Refresh the page or notify parent component
      window.location.reload();
    }
  };

  const handlePreview = (versionId: string) => {
    console.log("Previewing version:", versionId);
    // Could open a modal with version content
  };

  const handleExport = (versionId: string) => {
    console.log("Exporting version:", versionId);
    // Could download the version content
  };  const handleCreateVersion = async () => {
    if (!newVersionTitle.trim()) return;
    
    // Use passed current document or fallback to empty content
    const versionContent = currentDocument || {
      title: "Current Project Title",
      abstract: "",
      content: "",
      references: ""
    };
    
    const success = await createVersion(newVersionTitle, versionContent, "Manual version creation");
    if (success) {
      setShowCreateDialog(false);
      setNewVersionTitle("");
    }
  };

  // Always prioritize real versions from the database
  const displayVersions = versions.length > 0 
    ? versions.map((version, index) => convertVersionToDisplayFormat(version, index))
    : []; // Show empty state instead of mock data
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </CardTitle>
            {permissions.canWrite && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Version
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Version</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Version title (e.g., 'Major revision', 'Final draft')"
                        value={newVersionTitle}
                        onChange={(e) => setNewVersionTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateVersion} disabled={!newVersionTitle.trim()}>
                      Create Version
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">{loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading version history...</p>
            </div>
          ) : (
            displayVersions.map((version, index) => (
            <div 
              key={version.id} 
              className={`border rounded-lg p-4 ${version.isCurrent ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={version.avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {version.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{version.title}</h4>
                      {version.isCurrent && (
                        <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{version.version}</span>
                      <span>•</span>
                      <span>{version.author}</span>
                      <span>•</span>
                      <span>{formatTimestamp(version.timestamp)}</span>
                      {version.changes > 0 && (
                        <>
                          <span>•</span>
                          <span>{version.changes} changes</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handlePreview(version.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {permissions.canExport && (
                    <Button variant="ghost" size="sm" onClick={() => handleExport(version.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {!version.isCurrent && permissions.canRestore && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRestore(version.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>            </div>
          ))
          )}          
          {!loading && displayVersions.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No version history</h3>
              <p className="text-gray-600">Version history will appear as you make changes to the document</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VersionHistory;
