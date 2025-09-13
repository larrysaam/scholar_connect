
import { useState, useEffect, useMemo } from "react";
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
  uploadedAt: string;
}

const ITEMS_PER_PAGE = 10;

const DocumentsTab = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
          uploadedAt: doc.uploadedAt
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

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [documents]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedDocuments, currentPage]);

  const totalPages = Math.ceil(sortedDocuments.length / ITEMS_PER_PAGE);

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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">Documents</h2>
        <Badge variant="secondary" className="w-fit text-xs">
          {documents.length} Documents
        </Badge>
      </div>

      <p className="text-gray-600 text-sm sm:text-base">Access shared documents and resources from your consultations.</p>

      <div className="space-y-3 sm:space-y-4">
        {paginatedDocuments.map((document) => {
          const IconComponent = getFileIcon(document.type);
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{document.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <Badge className={`${getFileTypeColor(document.type)} text-xs w-fit`}>
                          {document.type}
                        </Badge>
                        <span className="text-xs sm:text-sm text-gray-500">{document.size}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                        Shared by {document.sharedBy} • {document.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(document)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 sm:gap-2 text-xs w-full sm:w-auto"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center mt-4 sm:mt-6 gap-2">
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto text-xs"
          >
            Previous
          </Button>
          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto text-xs"
          >
            Next
          </Button>
        </div>
      )}

      {documents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500 text-sm sm:text-base">Documents shared in consultations will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsTab;
