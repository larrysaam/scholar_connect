
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const FileUploadSection = ({ files, onFilesChange }: FileUploadSectionProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Attachments (Optional)</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Choose Files
        </Button>
      </div>
      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Uploaded files:</p>
          {files.map((file, index) => (
            <div key={index} className="text-sm text-gray-600">{file.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
