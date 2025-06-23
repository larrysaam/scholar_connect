
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { Shield, Upload, X } from 'lucide-react';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  accept?: string;
  maxSize?: number;
  selectedFile?: File | null;
  className?: string;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  accept = "image/*,.pdf,.doc,.docx,.txt",
  maxSize = 10 * 1024 * 1024, // 10MB
  selectedFile,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const { validationErrors, validateFileUpload, clearValidationErrors } = useSecurityValidation();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    clearValidationErrors();

    try {
      const isValid = await validateFileUpload(file);
      if (isValid) {
        onFileSelect(file);
      }
    } catch (error) {
      console.error('File validation error:', error);
    } finally {
      setUploading(false);
    }
  }, [validateFileUpload, onFileSelect, clearValidationErrors]);

  const handleRemoveFile = () => {
    clearValidationErrors();
    onFileRemove();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Security indicator */}
      <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
        <Shield className="h-4 w-4" />
        <span>Secure file upload with validation</span>
      </div>

      {/* File input */}
      {!selectedFile && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Select a file to upload (Max: {formatFileSize(maxSize)})
            </p>
            <Input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="max-w-xs mx-auto"
            />
          </div>
        </div>
      )}

      {/* Selected file display */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
          <div className="flex items-center space-x-3">
            <Upload className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {validationErrors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Upload status */}
      {uploading && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Validating file...</p>
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;
