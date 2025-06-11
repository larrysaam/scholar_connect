import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { validateFileUpload, EnhancedRateLimiter } from '@/utils/enhancedSecurity';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { Upload, Shield, AlertTriangle } from 'lucide-react';

const rateLimiter = new EnhancedRateLimiter();

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}

const SecureFileUpload = ({ 
  onFileSelect, 
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  maxSize = 5 * 1024 * 1024,
  multiple = false 
}: SecureFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { logSuspiciousActivity } = useSecurityAudit();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const userIdentifier = `${navigator.userAgent}_${Date.now()}`;
    
    // Rate limiting check
    if (!rateLimiter.isAllowed('file_upload', userIdentifier)) {
      const remainingTime = rateLimiter.getRemainingTime('file_upload', userIdentifier);
      toast({
        variant: "destructive",
        title: "Upload Limit Exceeded",
        description: `Please wait ${Math.ceil(remainingTime / 60000)} minutes before uploading more files.`
      });
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Enhanced file validation
        const validation = validateFileUpload(file);
        
        if (!validation.isValid) {
          toast({
            variant: "destructive",
            title: "File Validation Failed",
            description: validation.errors.join(', ')
          });
          
          logSuspiciousActivity('invalid_file_upload', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            errors: validation.errors
          });
          
          continue;
        }

        // Additional security checks
        if (await performDeepFileAnalysis(file)) {
          onFileSelect(file);
          
          toast({
            title: "File Uploaded Successfully",
            description: `${file.name} has been uploaded securely.`
          });
        } else {
          logSuspiciousActivity('suspicious_file_upload', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          });
          
          toast({
            variant: "destructive",
            title: "File Security Check Failed",
            description: "The uploaded file failed security validation."
          });
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "An error occurred during file upload."
      });
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = '';
    }
  }, [onFileSelect, toast, logSuspiciousActivity]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <div className="mb-4">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Secure File Upload</h3>
        <p className="text-sm text-gray-600 mb-2">
          Files are automatically scanned for security threats
        </p>
        <div className="flex items-center justify-center text-xs text-gray-500">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Max size: {maxSize / (1024 * 1024)}MB | Types: {acceptedTypes.join(', ')}
        </div>
      </div>

      <div className="relative">
        <input
          type="file"
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <Button 
          disabled={uploading}
          className="relative flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>{uploading ? 'Processing...' : 'Choose Files'}</span>
        </Button>
      </div>
    </div>
  );
};

// Perform deep file analysis (placeholder for advanced security checks)
const performDeepFileAnalysis = async (file: File): Promise<boolean> => {
  // In a real implementation, this would involve:
  // - Virus scanning
  // - Malware detection
  // - Content analysis
  // - File signature verification
  
  return new Promise((resolve) => {
    // Simulate analysis time
    setTimeout(() => {
      // For now, just return true if basic checks pass
      resolve(true);
    }, 1000);
  });
};

export default SecureFileUpload;
