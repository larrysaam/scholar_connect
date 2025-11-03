import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { ConsultationDocument } from '@/types/bookings';

export const useLiveDocumentReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const shareDocumentLink = useCallback(async (bookingId: string, documentLink: string): Promise<boolean> => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to share documents.', variant: 'destructive' });
      return false;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultation_documents')
        .insert({
          booking_id: bookingId,
          document_url: documentLink,
          shared_by_user_id: user.id,
          status: 'shared',
        })
        .select()
        .single();

      if (error) {
        toast({ title: 'Error', description: `Failed to share document: ${error.message}`, variant: 'destructive' });
        return false;
      }

      toast({ title: 'Success', description: 'Document link shared successfully!', variant: 'default' });
      return true;
    } catch (error: any) {
      console.error('Error sharing document:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while sharing the document.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateDocumentStatus = useCallback(async (documentId: string, status: ConsultationDocument['status']): Promise<boolean> => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to update document status.', variant: 'destructive' });
      return false;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_documents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', documentId);

      if (error) {
        toast({ title: 'Error', description: `Failed to update document status: ${error.message}`, variant: 'destructive' });
        return false;
      }

      toast({ title: 'Success', description: 'Document status updated.', variant: 'default' });
      return true;
    } catch (error: any) {
      console.error('Error updating document status:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while updating document status.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const fetchLiveReviewDocuments = useCallback(async (bookingId: string): Promise<ConsultationDocument[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultation_documents')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching live review documents:', error);
        toast({ title: 'Error', description: `Failed to fetch live review documents: ${error.message}`, variant: 'destructive' });
        return [];
      }
      return data as ConsultationDocument[];
    } catch (error: any) {
      console.error('Error fetching live review documents:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred while fetching live review documents.', variant: 'destructive' });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    shareDocumentLink,
    updateDocumentStatus,
    fetchLiveReviewDocuments,
    loading,
  };
};