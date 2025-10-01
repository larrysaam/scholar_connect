
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Upload, File, Download, Trash2, Eye, Loader2, FileText, Image, Archive, Presentation } from "lucide-react";
import { useProjectFiles } from "@/hooks/useProjectFiles";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface FileManagerProps {
  projectId: string;
  permissions: {
    canUpload?: boolean;
    canDelete?: boolean;
  };
}

const FileManager = ({ projectId, permissions }: FileManagerProps) => {
  const {
    files,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    downloadFile,
    getFileTypeInfo,
    formatFileSize,
  } = useProjectFiles(projectId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState("");
  const [fileCategory, setFileCategory] = useState<'general' | 'research' | 'data' | 'images' | 'documents' | 'references'>('general');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'document':
        return FileText;
      case 'spreadsheet':
        return File;
      case 'presentation':
        return Presentation;
      case 'archive':
        return Archive;
      case 'text':
        return FileText;
      default:
        return File;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadDialog(true);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    const success = await uploadFile(selectedFile, fileCategory, fileDescription);
    if (success) {
      setShowUploadDialog(false);
      setSelectedFile(null);
      setFileDescription("");
      setFileCategory('general');
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (fileId: string) => {
    await deleteFile(fileId);
  };

  const handleDownload = async (fileId: string) => {
    await downloadFile(fileId);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600">Loading files...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt,.md,.png,.jpg,.jpeg,.gif,.zip,.rar,.ppt,.pptx"
      />

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedFile && (
              <div className="p-3 bg-gray-50 rounded border">
                <div className="flex items-center gap-3">
                  <File className="h-6 w-6 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={fileCategory} onValueChange={(value: any) => setFileCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="images">Images</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="references">References</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for this file..."
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={!selectedFile || uploading}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Upload File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              File Manager
              <Badge variant="outline" className="ml-2">
                {files.length} {files.length === 1 ? 'file' : 'files'}
              </Badge>
            </CardTitle>
            
            {permissions.canUpload && (
              <Button onClick={handleFileUpload} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload File
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {files.map((file) => {
            const typeInfo = getFileTypeInfo(file.mime_type, file.original_name);
            const FileIcon = getFileIcon(typeInfo.type);
            
            return (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FileIcon className="h-8 w-8 text-gray-500" />
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{file.original_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>by {file.uploader?.name || 'Unknown'}</span>
                        <span>•</span>
                        <span>{formatDate(file.created_at)}</span>
                        <span>•</span>
                        <span>{file.download_count} downloads</span>
                      </div>
                      {file.description && (
                        <p className="text-sm text-gray-500 mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={typeInfo.color}>
                      {file.category}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(file.id)}
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      {file.file_url && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(file.file_url, '_blank')}
                          title="View file"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {permissions.canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              title="Delete file"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{file.original_name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(file.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {files.length === 0 && (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
              <p className="text-gray-600 mb-4">Upload files to share with your collaborators</p>
              {permissions.canUpload && (
                <Button onClick={handleFileUpload} disabled={uploading}>
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload First File
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileManager;
