
import { Badge } from "@/components/ui/badge";

interface DocumentDisplayProps {
  documents: string[];
}

const DocumentDisplay = ({ documents }: DocumentDisplayProps) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <p className="font-medium text-sm text-green-700">Documents Shared (Preview Only):</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {documents.map((doc, index) => (
          <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
            {doc}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default DocumentDisplay;
