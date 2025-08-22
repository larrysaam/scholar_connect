
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, File, Image, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  sharedBy: string;
  date: string;
  url: string;
}

const DocumentsTab = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (!user || !profile) return;

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      const isResearcher = profile.role === 'expert' || profile.role === 'aid';
      const userIdField = isResearcher ? 'provider_id' : 'client_id';
      const otherUserSelect = isResearcher 
        ? 'client:users!service_bookings_client_id_fkey(name)' 
        : 'provider:users!service_bookings_provider_id_fkey(name)';

      try {
        const { data, error } = await supabase
          .from('service_bookings')
          .select(`id, shared_documents, ${otherUserSelect}`)
          .eq(userIdField, user.id)
          .not('shared_documents', 'is', null);

        if (error) throw error;

        const allDocuments = data.flatMap(booking => {
          if (!booking.shared_documents || booking.shared_documents.length === 0) {
            return [];
          }
          const sharedBy = isResearcher ? (booking as any).client?.name : (booking as any).provider?.name;
          return booking.shared_documents.map((doc: any) => ({
            ...doc,
            id: `${booking.id}-${doc.name}`,
            sharedBy: sharedBy || 'Unknown',
          }));
        });

        const mappedDocuments: Document[] = allDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: formatBytes(doc.size),
          sharedBy: doc.sharedBy,
          date: new Date(doc.uploadedAt).toLocaleDateString(),
          url: doc.url,
        }));

        setDocuments(mappedDocuments);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user, profile]);

  const handleDownload = (docToDownload: any) => {
    toast({
      title: "Downloading Document",
      description: `Downloading ${docToDownload.name}...`
    });
    const link = document.createElement('a');
    link.href = docToDownload.url;
    link.download = docToDownload.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      default:
        return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'docx':
      case 'doc':
        return 'bg-blue-100 text-blue-800';
      case 'xlsx':
      case 'xls':
        return 'bg-green-100 text-green-800';
      case 'pptx':
      case 'ppt':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documents</h2>
        <Badge variant="secondary">
          {documents.length} Documents
        </Badge>
      </div>

      <p className="text-gray-600">Access shared documents and resources from your consultations.</p>

      <div className="space-y-4">
        {documents.map((document) => {
          const IconComponent = getFileIcon(document.type);
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{document.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getFileTypeColor(document.type)}>
                          {document.type}
                        </Badge>
                        <span className="text-sm text-gray-500">{document.size}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Shared by {document.sharedBy} • {document.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(document)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {documents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500">Documents shared in consultations will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsTab;
