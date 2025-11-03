import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { verificationService, type VerificationDocument } from '@/services/verificationService';

export function useDocumentUpload(userId: string, profileType: 'researcher' | 'research_aid') {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadDocument = async (file: File, documentType: string) => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload a PDF, DOC, DOCX, or image file.');
      }

      // Maximum file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Show upload starting
      setProgress(10);

      // Upload the document
      const { error, document } = await verificationService.uploadDocument(
        file,
        documentType,
        userId,
        profileType
      );

      if (error) throw error;

      // Show success
      setProgress(100);
      toast({
        title: 'Success',
        description: 'Document uploaded successfully!',
      });

      return document;
    } catch (err: any) {
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

  const deleteDocument = async (documentType: string, documentId: string) => {
    try {
      const { error } = await verificationService.deleteDocument(
        documentType,
        documentId,
        userId,
        profileType
      );

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Document deleted successfully!',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to delete document: ${err.message}`,
        variant: 'destructive',
      });
    }
  };

  return {
    uploadDocument,
    deleteDocument,
    isUploading,
    progress
  };
};