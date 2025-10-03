import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  title: string;
  content: any;
  changes_summary?: string;
  created_by: string;
  created_at: string;
  author?: {
    name: string;
    email: string;
  };
}

export function useVersionHistory(projectId: string) {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_versions')
        .select(`
          *,
          author:created_by(name, email)
        `)
        .eq('project_id', projectId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error: any) {
      console.error('Error fetching versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load version history',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (title: string, content: any, changesSummary?: string): Promise<boolean> => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      // Get the next version number
      const nextVersionNumber = versions.length > 0 ? Math.max(...versions.map(v => v.version_number)) + 1 : 1;

      const { error } = await supabase
        .from('project_versions')
        .insert({
          project_id: projectId,
          version_number: nextVersionNumber,
          title,
          content,
          changes_summary: changesSummary,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Version created successfully'
      });

      await fetchVersions();
      return true;
    } catch (error: any) {
      console.error('Error creating version:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create version',
        variant: 'destructive'
      });
      return false;
    }
  };

  const restoreVersion = async (versionId: string): Promise<boolean> => {
    try {
      // Get the version content
      const { data: versionData, error: versionError } = await supabase
        .from('project_versions')
        .select('content, title')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      // Update the project with the version content
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          content: versionData.content,
          title: versionData.title,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Version restored successfully'
      });

      return true;
    } catch (error: any) {
      console.error('Error restoring version:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to restore version',
        variant: 'destructive'
      });
      return false;
    }
  };

  const compareVersions = (version1Id: string, version2Id: string) => {
    const v1 = versions.find(v => v.id === version1Id);
    const v2 = versions.find(v => v.id === version2Id);
    
    if (!v1 || !v2) {
      toast({
        title: 'Error',
        description: 'Cannot find versions to compare',
        variant: 'destructive'
      });
      return null;
    }

    // Simple text comparison - in a real app you'd use a more sophisticated diff library
    return {
      version1: v1,
      version2: v2,
      differences: {
        title: v1.title !== v2.title,
        content: JSON.stringify(v1.content) !== JSON.stringify(v2.content)
      }
    };
  };

  const downloadVersion = async (versionId: string) => {
    try {
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error('Version not found');

      const dataStr = JSON.stringify(version.content, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${version.title}_v${version.version_number}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Version downloaded successfully'
      });
    } catch (error: any) {
      console.error('Error downloading version:', error);
      toast({
        title: 'Error',
        description: 'Failed to download version',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchVersions();
    }
  }, [projectId]);

  return {
    versions,
    loading,
    createVersion,
    restoreVersion,
    compareVersions,
    downloadVersion,
    refreshVersions: fetchVersions
  };
}