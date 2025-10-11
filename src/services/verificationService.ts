import { supabase } from '@/integrations/supabase/client';

export interface VerificationDocument {
  id: string;
  type: string;
  url: string;
  filename: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface Verifications {
  [key: string]: {
    documents: VerificationDocument[];
    otherDetails?: string;
  };
}

export interface VerificationCategory {
  name: string;
  label: string;
  description: string;
  required: boolean;
  allowMultiple: boolean;
  maxFiles?: number;
}

const BUCKET_NAME = 'lovable-uploads';

export const VERIFICATION_CATEGORIES: VerificationCategory[] = [
  {
    name: 'identity',
    label: 'Identity Document',
    description: 'A government-issued ID (passport, national ID, or driver\'s license)',
    required: true,
    allowMultiple: false
  },
  {
    name: 'academic',
    label: 'Academic Credentials',
    description: 'Your highest academic qualification (degree, diploma, or certificate)',
    required: true,
    allowMultiple: true,
    maxFiles: 3
  },
  {
    name: 'professional',
    label: 'Professional Certifications',
    description: 'Any relevant professional certifications or licenses',
    required: false,
    allowMultiple: true,
    maxFiles: 5
  }
];

export const verificationService = {
  async uploadDocument(
    file: File,
    documentType: string,
    userId: string,
    profileType: 'researcher' | 'research_aid'
  ): Promise<{ error: Error | null; document: VerificationDocument | null }> {
    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const filename = `${userId}/${documentType}-${Date.now()}.${fileExt}`;
      const filePath = `${profileType}/${filename}`;

      // Upload file to storage
      const { error: uploadError, data } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

        console.log('File uploaded successfully:', data);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // Get current verifications
      const { data: profile, error: fetchError } = await supabase
        .from(profileType === 'researcher' ? 'researcher_profiles' : 'research_aid_profiles')
        .select('verifications')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const verifications = profile?.verifications || {};
      
      // Create document object
      const document: VerificationDocument = {
        id: data.path,
        type: documentType,
        url: publicUrl,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Update verifications
      if (!verifications[documentType]) {
        verifications[documentType] = { documents: [] };
      }
      verifications[documentType].documents.push(document);

      // Update profile's verifications
      const { error: updateError } = await supabase
        .from(profileType === 'researcher' ? 'researcher_profiles' : 'research_aid_profiles')
        .update({ verifications })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      return { error: null, document };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { error: error as Error, document: null };
    }
  },

  async deleteDocument(
    documentType: string,
    documentId: string,
    userId: string,
    profileType: 'researcher' | 'research_aid'
  ): Promise<{ error: Error | null }> {
    try {
      // Get current verifications
      const { data: profile, error: fetchError } = await supabase
        .from(profileType === 'researcher' ? 'researcher_profiles' : 'research_aid_profiles')
        .select('verifications')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const verifications = profile.verifications || {};
      const category = verifications[documentType];

      if (!category?.documents) {
        return { error: null }; // Category or documents don't exist
      }

      // Find document index
      const docIndex = category.documents.findIndex(doc => doc.id === documentId);
      if (docIndex === -1) {
        return { error: null }; // Document not found
      }

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([category.documents[docIndex].id]);

      if (deleteError) throw deleteError;

      // Remove from verifications array
      category.documents.splice(docIndex, 1);
      
      // If no documents left and no other details, remove the category
      if (category.documents.length === 0 && !category.otherDetails) {
        delete verifications[documentType];
      }

      // Update profile
      const { error: updateError } = await supabase
        .from(profileType === 'researcher' ? 'researcher_profiles' : 'research_aid_profiles')
        .update({ verifications })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      return { error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { error: error as Error };
    }
  },

  async getVerifications(
    userId: string,
    profileType: 'researcher' | 'research_aid'
  ): Promise<{ error: Error | null; verifications: Verifications | null }> {
    try {
      const { data, error } = await supabase
        .from(profileType === 'researcher' ? 'researcher_profiles' : 'research_aid_profiles')
        .select('verifications')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return { error: null, verifications: data.verifications || {} };
    } catch (error) {
      console.error('Error fetching verifications:', error);
      return { error: error as Error, verifications: null };
    }
  }
};
