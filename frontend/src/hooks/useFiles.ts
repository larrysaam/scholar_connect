
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabaseClient';

export const useFiles = (projectId: string) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('project_id', projectId);

        if (error) {
          throw new Error(error.message);
        }

        setFiles(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchFiles();
    }
  }, [projectId]);

  const uploadFile = async (file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .upload(`${projectId}/${file.name}`, file);

      if (error) {
        throw new Error(error.message);
      }

      // Save file metadata to the 'files' table
      const { error: insertError } = await supabase.from('files').insert([
        {
          project_id: projectId,
          name: file.name,
          size: file.size,
          type: file.type,
        },
      ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Refresh the file list
      const { data: refreshedData, error: refreshedError } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', projectId);

      if (refreshedError) {
        throw new Error(refreshedError.message);
      }

      setFiles(refreshedData || []);

      return data;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { files, loading, error, uploadFile };
};
