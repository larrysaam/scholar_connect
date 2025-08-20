import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

// Interfaces based on VerificationTab.tsx
interface VerificationDocument {
  documentType: string;
  status: 'verified' | 'pending' | 'rejected' | 'not_started';
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: string;
  rejectionReason?: string;
}
interface VerificationCategory {
  documents: VerificationDocument[];
}
interface Verifications {
  [key: string]: VerificationCategory;
}
interface ResearcherProfile {
  user_id: string;
  verifications: Verifications;
  users: {
    name: string;
    email: string;
  } | null;
}

const VerificationManagement = () => {
  const [profiles, setProfiles] = useState<ResearcherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllVerifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('researcher_profiles')
        .select(`
          user_id,
          verifications,
          users ( name, email )
        `)
        .not('verifications', 'is', null);

      if (error) throw error;

      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch verification requests.');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVerifications();
  }, []);

  const handleVerification = async (
    userId: string,
    categoryKey: string,
    documentType: string,
    newStatus: 'verified' | 'rejected' | 'pending'
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-verification-status', {
        body: { userId, categoryKey, documentType, newStatus },
      });

      if (error) {
        throw new Error(`Function invocation failed: ${error.message}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Update local state
      const profile = profiles.find(p => p.user_id === userId);
      if (!profile) return;

      const newVerifications = JSON.parse(JSON.stringify(profile.verifications));
      const docIndex = newVerifications[categoryKey]?.documents.findIndex((d: VerificationDocument) => d.documentType === documentType);

      if (docIndex > -1) {
        newVerifications[categoryKey].documents[docIndex].status = newStatus;
      }

      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.user_id === userId
            ? { ...p, verifications: newVerifications }
            : p
        )
      );
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
      console.error('Error updating verification status:', err);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Management</CardTitle>
        <CardDescription>Review and process all document verifications from researchers.</CardDescription>
      </CardHeader>
      <CardContent>
        {profiles.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {profiles.map((profile) => (
              <AccordionItem value={profile.user_id} key={profile.user_id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4">
                    <span>{profile.users?.name || 'Unknown User'}</span>
                    <Badge variant="outline">{profile.users?.email}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Type</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(profile.verifications ?? {}).flatMap(([categoryKey, category]) =>
                        (category.documents ?? []).map(doc => (
                          <TableRow key={`${categoryKey}-${doc.documentType}`}>
                            <TableCell>{categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} - {doc.documentType}</TableCell>
                            <TableCell>
                              {doc.fileUrl ? (
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                  {doc.fileName || 'View File'} <ExternalLink className="h-4 w-4 ml-1" />
                                </a>
                              ) : (
                                <span>No file uploaded</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={() => handleVerification(profile.user_id, categoryKey, doc.documentType, 'verified')} disabled={doc.status === 'verified'}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleVerification(profile.user_id, categoryKey, doc.documentType, 'rejected')} disabled={doc.status === 'rejected'}>
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleVerification(profile.user_id, categoryKey, doc.documentType, 'pending')} disabled={doc.status === 'pending'}>
                                <RefreshCw className="h-4 w-4 mr-1" /> Set to Pending
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No researchers with verification documents found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationManagement;