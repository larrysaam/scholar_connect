import { supabase } from '@/integrations/supabase'; // Assuming you have a supabase client setup

interface ResearchAidProfileData {
  userId: string;
  fullName: string;
  sex: string;
  dateOfBirth: string;
  phoneNumber: string;
  country: string;
  languages: string[];
  experience: string;
  linkedInUrl: string;
  expertise: string[];
  otherExpertise: string;
}

export const createResearchAidProfile = async (
  data: ResearchAidProfileData,
  cvFile: File | null,
  certFile: File | null
) => {
  try {
    // Insert data into research_aid_profile table
    const { data: profile, error: profileError } = await supabase
      .from('research_aid_profile')
      .insert([
        {
          user_id: data.userId,
          full_name: data.fullName,
          sex: data.sex,
          date_of_birth: data.dateOfBirth,
          phone_number: data.phoneNumber,
          country: data.country,
          languages: data.languages,
          experience: data.experience,
          linkedin_url: data.linkedInUrl,
          expertise: data.expertise,
          other_expertise: data.otherExpertise,
        },
      ])
      .select();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const profileId = profile[0].id; // Assuming the insert returns the new profile's ID

    // Handle CV file upload
    if (cvFile) {
      const cvFilePath = `research_aids/${profileId}/cv_${cvFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents') // Assuming a 'documents' bucket in Supabase Storage
        .upload(cvFilePath, cvFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload CV: ${uploadError.message}`);
      }

      // Update profile with CV URL
      const { error: updateError } = await supabase
        .from('research_aid_profile')
        .update({ cv_url: cvFilePath })
        .eq('id', profileId);

      if (updateError) {
        throw new Error(`Failed to update CV URL: ${updateError.message}`);
      }
    }

    // Handle Certifications file upload
    if (certFile) {
      const certFilePath = `research_aids/${profileId}/cert_${certFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents') // Assuming a 'documents' bucket in Supabase Storage
        .upload(certFilePath, certFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload Certifications: ${uploadError.message}`);
      }

      // Update profile with Certifications URL
      const { error: updateError } = await supabase
        .from('research_aid_profile')
        .update({ certifications_url: certFilePath })
        .eq('id', profileId);

      if (updateError) {
        throw new Error(`Failed to update Certifications URL: ${updateError.message}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating research aid profile:', error);
    return { success: false, error: error.message };
  }
};