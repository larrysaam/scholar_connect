
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { validateFile } from '@/utils/security';
import { Upload, FileCheck, AlertTriangle, X } from 'lucide-react';

interface SecureFileUploadProps {
  onFileUpload: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  allowedTypes: string[];
  maxSize?: number;
  label: string;
  required?: boolean;
  multiple?: boolean;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileUpload,
  allowedTypes,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label,
  required = false,
  multiple = false
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelection = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Validate each file
    selectedFiles.forEach(file => {
      const validation = validateFile(file, allowedTypes, maxSize);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        newErrors.push(`${file.name}: ${validation.error}`);
      }
    });

    // Check file count limits
    if (!multiple && validFiles.length > 1) {
      newErrors.push('Only one file is allowed');
      return;
    }

    if (files.length + validFiles.length > 10) {
      newErrors.push('Maximum 10 files allowed');
      return;
    }

    setErrors(newErrors);
    if (validFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    }

    // Clear the input
    e.target.value = '';
  }, [allowedTypes, maxSize, multiple, files.length]);

  const uploadFile = useCallback(async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 200);

      const result = await onFileUpload(file);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

      if (result.success && result.url) {
        setUploadedFiles(prev => [...prev, { name: file.name, url: result.url! }]);
        setFiles(prev => prev.filter(f => f !== file));
      } else {
        setErrors(prev => [...prev, `${file.name}: ${result.error || 'Upload failed'}`]);
      }

      // Clean up progress after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }, 2000);

    } catch (error) {
      console.error('File upload error:', error);
      setErrors(prev => [...prev, `${file.name}: Upload failed`]);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  }, [onFileUpload]);

  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setErrors([]);

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (const file of files) {
        await uploadFile(file);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const removeUploadedFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="mt-2">
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileSelection}
            accept={allowedTypes.map(type => `.${type}`).join(',')}
            multiple={multiple}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-600 mt-1">
            Allowed types: {allowedTypes.join(', ')} • Max size: {maxSize / (1024 * 1024)}MB
          </p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearErrors}
              className="mt-2"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Selected files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Files:</h4>
          {files.map((file, index) => {
            const fileId = `${file.name}-${Date.now()}`;
            const progress = uploadProgress[fileId] || 0;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                {progress > 0 && progress < 100 ? (
                  <div className="w-24">
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          
          <Button
            onClick={handleUploadAll}
            disabled={isUploading || files.length === 0}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      )}

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
              <div className="flex items-center space-x-2">
                <FileCheck className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-green-600">Successfully uploaded</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeUploadedFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;
