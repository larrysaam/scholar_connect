
import React, { useState, useEffect, useRef } from 'react';
import { useProfileImage } from '../../hooks/useProfileImage';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface ProfileImageProps {
  userId: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ userId }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { uploadProfileImage, removeProfileImage, uploading } = useProfileImage(userId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (data && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };

    fetchProfileImage();
  }, [userId]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageUrl = await uploadProfileImage(file);
      if (newImageUrl) {
        setAvatarUrl(newImageUrl);
      }
    }
  };

  const handleRemoveImage = async () => {
    if (avatarUrl) {
      await removeProfileImage(avatarUrl);
      setAvatarUrl(null);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-4">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200" />
      )}
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          accept="image/*"
        />
        <Button onClick={handleChooseFile} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Choose Image'}
        </Button>
        {avatarUrl && (
          <Button onClick={handleRemoveImage} variant="destructive">
            Remove Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
