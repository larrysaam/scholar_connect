import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  original_name: string;
  file_path: string;
  file_url?: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  description?: string;
  category: 'general' | 'research' | 'data' | 'images' | 'documents' | 'references';
  is_public: boolean;
  download_count: number;
  uploader?: {
    name: string;
    email: string;
  };
}

export const useProjectFiles = (projectId: string) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch files for the project
  const fetchFiles = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('project_files')
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setFiles(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching project files:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Upload file to storage and database
  const uploadFile = async (
    file: File,
    category: ProjectFile['category'] = 'general',
    description?: string
  ): Promise<boolean> => {
    if (!user || !projectId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload files.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setUploading(true);
      setError(null);

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${projectId}/${fileName}`;

      // Upload to Supabase storage (lovable-uploads bucket)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lovable-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(filePath);

      // Save file metadata to database
      const { data: fileData, error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          name: fileName,
          original_name: file.name,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
          description,
          category,
          is_public: false,
          download_count: 0,
        })
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .single();

      if (dbError) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage.from('lovable-uploads').remove([filePath]);
        throw dbError;
      }

      // Add to local state
      setFiles(prev => [fileData, ...prev]);

      toast({
        title: 'Success',
        description: `File "${file.name}" uploaded successfully!`,
      });

      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Upload Failed',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Delete file from storage and database
  const deleteFile = async (fileId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to delete files.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Get file info first
      const fileToDelete = files.find(f => f.id === fileId);
      if (!fileToDelete) {
        throw new Error('File not found');
      }

      // Delete from database first
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw dbError;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('lovable-uploads')
        .remove([fileToDelete.file_path]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError);
        // Don't throw error as database deletion succeeded
      }

      // Remove from local state
      setFiles(prev => prev.filter(f => f.id !== fileId));

      toast({
        title: 'Success',
        description: `File "${fileToDelete.original_name}" deleted successfully!`,
      });

      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Delete Failed',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Download file (increment counter and trigger download)
  const downloadFile = async (fileId: string): Promise<void> => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) {
        throw new Error('File not found');
      }

      // Increment download counter
      await supabase
        .from('project_files')
        .update({ download_count: file.download_count + 1 })
        .eq('id', fileId);

      // Update local state
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, download_count: f.download_count + 1 }
          : f
      ));

      // Trigger download
      if (file.file_url) {
        const link = document.createElement('a');
        link.href = file.file_url;
        link.download = file.original_name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: 'Download Started',
        description: `Downloading "${file.original_name}"`,
      });
    } catch (err: any) {
      toast({
        title: 'Download Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Update file metadata
  const updateFile = async (
    fileId: string, 
    updates: Partial<Pick<ProjectFile, 'description' | 'category' | 'is_public'>>
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .update(updates)
        .eq('id', fileId)
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setFiles(prev => prev.map(f => f.id === fileId ? data : f));

      toast({
        title: 'Success',
        description: 'File updated successfully!',
      });

      return true;
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Get file type icon and color
  const getFileTypeInfo = (mimeType: string, fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (mimeType.startsWith('image/')) {
      return { type: 'image', color: 'bg-green-100 text-green-800' };
    } else if (mimeType.includes('pdf')) {
      return { type: 'document', color: 'bg-red-100 text-red-800' };
    } else if (mimeType.includes('spreadsheet') || ['xlsx', 'xls', 'csv'].includes(ext)) {
      return { type: 'spreadsheet', color: 'bg-emerald-100 text-emerald-800' };
    } else if (mimeType.includes('presentation') || ['ppt', 'pptx'].includes(ext)) {
      return { type: 'presentation', color: 'bg-orange-100 text-orange-800' };
    } else if (mimeType.includes('text') || ['txt', 'md', 'rtf'].includes(ext)) {
      return { type: 'text', color: 'bg-blue-100 text-blue-800' };
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return { type: 'archive', color: 'bg-purple-100 text-purple-800' };
    } else {
      return { type: 'file', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load files on mount and when projectId changes
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return {
    files,
    loading,
    uploading,
    error,
    uploadFile,
    deleteFile,
    downloadFile,
    updateFile,
    fetchFiles,
    getFileTypeInfo,
    formatFileSize,
  };
};
