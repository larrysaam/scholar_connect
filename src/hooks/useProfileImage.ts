
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProfileImage = (userId: string) => {
  const [uploading, setUploading] = useState(false);

  const uploadProfileImage = async (file: File) => {
    try {
      setUploading(true);
      const fileName = `${userId}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('lovable-uploads')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(data.path);

        console.log('Uploaded file public URL:', publicUrlData.publicUrl);

      // Update user profile with the new image URL
      await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', userId);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeProfileImage = async (profileImageUrl: string) => {
    try {
      const fileName = profileImageUrl.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from('lovable-uploads')
        .remove([fileName]);

      if (error) {
        throw error;
      }

      // Update user profile to remove the image URL
      await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', userId);
    } catch (error) {
      console.error('Error removing profile image:', error);
    }
  };

  return { uploadProfileImage, removeProfileImage, uploading };
};
