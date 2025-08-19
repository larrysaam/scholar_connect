import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useDocumentUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (file: File, bucket: string, path: string) => {
    try {
      setIsUploading(true);
      setError(null);

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      toast({
        title: 'Success',
        description: 'Document uploaded successfully!',
      });

      return publicUrlData.publicUrl;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: `Failed to upload document: ${err.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, uploadDocument };
};