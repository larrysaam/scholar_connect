
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
}

const VersionHistory = ({ projectId, permissions }: VersionHistoryProps) => {
  const { versions, loading, createVersion, restoreVersion, compareVersions } = useVersionHistory(projectId);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newVersionTitle, setNewVersionTitle] = useState("");
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    {
      id: 1,
      version: "v1.4",
      title: "Added methodology section",
      author: "Dr. Sarah Johnson",
      avatar: null,
      timestamp: "2024-01-15T10:30:00Z",
      changes: 47,
      isCurrent: true
    },
    {
      id: 2,
      version: "v1.3",
      title: "Updated literature review",
      author: "Prof. Michael Chen",
      avatar: null,
      timestamp: "2024-01-15T08:15:00Z",
      changes: 23,
      isCurrent: false
    },
    {
      id: 3,
      version: "v1.2",
      title: "Revised abstract and introduction",
      author: "Dr. Emily Rodriguez",
      avatar: null,
      timestamp: "2024-01-14T16:45:00Z",
      changes: 15,
      isCurrent: false
    },
    {
      id: 4,
      version: "v1.1",
      title: "Initial draft structure",
      author: "Dr. Sarah Johnson",
      avatar: null,
      timestamp: "2024-01-14T09:30:00Z",
      changes: 89,
      isCurrent: false
    },
    {
      id: 5,
      version: "v1.0",
      title: "Project created",
      author: "Dr. Sarah Johnson",
      avatar: null,
      timestamp: "2024-01-10T14:20:00Z",
      changes: 0,
      isCurrent: false
    }
  ]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleRestore = (versionId: number) => {
    console.log("Restoring version:", versionId);
  };

  const handlePreview = (versionId: number) => {
    console.log("Previewing version:", versionId);
  };

  const handleExport = (versionId: number) => {
    console.log("Exporting version:", versionId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {versions.map((version, index) => (
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
              </div>
            </div>
          ))}
          
          {versions.length === 0 && (
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
