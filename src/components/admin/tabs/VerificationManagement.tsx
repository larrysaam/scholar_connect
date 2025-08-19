
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

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

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('researcher_profiles')
        .select(`
          user_id,
          verifications,
          users ( name, email )
        `);

      if (error) throw error;

      const pendingProfiles = data.filter(profile =>
        Object.values(profile.verifications || {}).some(category =>
          category.documents.some(doc => doc.status === 'pending')
        )
      );

      setProfiles(pendingProfiles);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch verification requests.');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const handleVerification = async (
    userId: string,
    categoryKey: string,
    documentType: string,
    newStatus: 'verified' | 'rejected'
  ) => {
    const profile = profiles.find(p => p.user_id === userId);
    if (!profile) return;

    const newVerifications = JSON.parse(JSON.stringify(profile.verifications));
    const docIndex = newVerifications[categoryKey]?.documents.findIndex((d: VerificationDocument) => d.documentType === documentType);

    if (docIndex > -1) {
      newVerifications[categoryKey].documents[docIndex].status = newStatus;
    }

    const { error } = await supabase
      .from('researcher_profiles')
      .update({ verifications: newVerifications })
      .eq('user_id', userId);

    if (error) {
      setError(`Failed to update status: ${error.message}`);
    } else {
      // Refresh the list
      fetchPendingVerifications();
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
        <CardDescription>Review and process pending document verifications from researchers.</CardDescription>
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
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(profile.verifications).flatMap(([categoryKey, category]) =>
                        category.documents
                          .filter(doc => doc.status === 'pending')
                          .map(doc => (
                            <TableRow key={`${categoryKey}-${doc.documentType}`}>
                              <TableCell>{categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} - {doc.documentType}</TableCell>
                              <TableCell>
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                  {doc.fileName} <ExternalLink className="h-4 w-4 ml-1" />
                                </a>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" className="mr-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={() => handleVerification(profile.user_id, categoryKey, doc.documentType, 'verified')}>
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleVerification(profile.user_id, categoryKey, doc.documentType, 'rejected')}>
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
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
            <p>No pending verifications.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationManagement;
