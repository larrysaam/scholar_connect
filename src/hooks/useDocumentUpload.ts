
import { useState } from 'react';
import { CONSULTATION_CONSTANTS } from '@/constants/consultationConstants';

export const useDocumentUpload = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: string[]}>({});
  const [isUploading, setIsUploading] = useState<{[key: string]: boolean}>({});

  const handleUploadDocument = (consultationId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = CONSULTATION_CONSTANTS.FILE_UPLOAD.MULTIPLE;
    input.accept = CONSULTATION_CONSTANTS.FILE_UPLOAD.ACCEPTED_TYPES;
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setIsUploading(prev => ({ ...prev, [consultationId]: true }));
        
        // Simulate upload delay
        setTimeout(() => {
          const fileNames = Array.from(files).map(f => f.name);
          setUploadedDocuments(prev => ({
            ...prev,
            [consultationId]: [...(prev[consultationId] || []), ...fileNames]
          }));
          
          console.log("Documents uploaded for consultation:", consultationId, fileNames);
          alert(`${files.length} ${CONSULTATION_CONSTANTS.MESSAGES.DOCUMENTS_UPLOADED}`);
          setIsUploading(prev => ({ ...prev, [consultationId]: false }));
        }, 1000);
      }
    };
    
    input.click();
  };

  return {
    uploadedDocuments,
    isUploading,
    handleUploadDocument
  };
};
