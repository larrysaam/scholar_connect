import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, RefreshCw, UserCheck, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Interfaces based on VerificationTab.tsx
interface VerificationDocument {
  id: string;
  type: string;
  url: string;
  filename: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected' | 'not_started';
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
  admin_verified: boolean;
  admin_verified_at?: string;
  users: {
    name: string;
    email: string;
    role: string;
  } | null;
}

interface ResearchAidProfile {
  id: string;
  user_id?: string; // For compatibility 
  verifications: Verifications;
  admin_verified: boolean;
  admin_verified_at?: string;
  users: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const VerificationManagement = () => {
  const [researcherProfiles, setResearcherProfiles] = useState<ResearcherProfile[]>([]);
  const [researchAidProfiles, setResearchAidProfiles] = useState<ResearchAidProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllVerifications = async () => {
    try {
      setLoading(true);
      
      // Fetch researcher profiles with verifications and user data separately
      const { data: researcherData, error: researcherError } = await supabase
        .from('researcher_profiles')
        .select(`
          user_id,
          verifications,
          admin_verified,
          admin_verified_at
        `)
        .not('verifications', 'is', null);

      if (researcherError) {
        console.error('Researcher fetch error:', researcherError);
        // Try without admin_verified columns if they don't exist yet
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('researcher_profiles')
          .select(`
            user_id,
            verifications
          `)
          .not('verifications', 'is', null);
        
        if (fallbackError) throw fallbackError;
        
        setResearcherProfiles(
          await Promise.all((fallbackData || []).map(async (profile) => {
            const { data: userData } = await supabase
              .from('users')
              .select('name, email, role')
              .eq('id', profile.user_id)
              .single();
            
            return {
              ...profile,
              admin_verified: false,
              admin_verified_at: null,
              users: userData
            };
          }))
        );
      } else if (researcherData) {
        // Fetch user data for each profile
        setResearcherProfiles(
          await Promise.all(researcherData.map(async (profile) => {
            const { data: userData } = await supabase
              .from('users')
              .select('name, email, role')
              .eq('id', profile.user_id)
              .single();
            
            return {
              ...profile,
              users: userData
            };
          }))
        );
      } else {
        setResearcherProfiles([]);
      }

      // Fetch research aid profiles with verifications and user data separately
      // Try with user_id first, then fallback to id if needed
      let researchAidData = null;
      let researchAidError = null;
      
      try {
        const result = await supabase
          .from('research_aid_profiles')
          .select(`
            user_id,
            verifications,
            admin_verified,
            admin_verified_at
          `)
          .not('verifications', 'is', null);
        
        researchAidData = result.data;
        researchAidError = result.error;
      } catch (err) {
        console.error('Error with user_id query:', err);
        // If user_id doesn't exist, try with id column
        try {
          const fallbackResult = await supabase
            .from('research_aid_profiles')
            .select(`
              id,
              verifications,
              admin_verified,
              admin_verified_at
            `)
            .not('verifications', 'is', null);
          
          researchAidData = fallbackResult.data;
          researchAidError = fallbackResult.error;
        } catch (fallbackErr) {
          researchAidError = fallbackErr as any;
        }
      }

      if (researchAidError) {
        console.error('Research aid fetch error:', researchAidError);
        // Final fallback - try basic query without admin columns
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('research_aid_profiles')
          .select(`
            user_id,
            verifications
          `)
          .not('verifications', 'is', null);
        
        if (fallbackError) {
          // If user_id still doesn't work, try with id
          const { data: idFallbackData, error: idFallbackError } = await supabase
            .from('research_aid_profiles')
            .select(`
              id,
              verifications
            `)
            .not('verifications', 'is', null);
          
          if (idFallbackError) throw idFallbackError;
          
          setResearchAidProfiles(
            await Promise.all((idFallbackData || []).map(async (profile) => {
              const { data: userData } = await supabase
                .from('users')
                .select('name, email, role')
                .eq('id', profile.id)
                .single();
              
              return {
                ...profile,
                user_id: profile.id, // Add for compatibility
                admin_verified: false,
                admin_verified_at: null,
                users: userData
              };
            }))
          );
        } else {
          setResearchAidProfiles(
            await Promise.all((fallbackData || []).map(async (profile) => {
              const userId = profile.user_id || profile.id;
              const { data: userData } = await supabase
                .from('users')
                .select('name, email, role')
                .eq('id', userId)
                .single();
              
              return {
                ...profile,
                user_id: userId, // Ensure user_id is set for compatibility
                admin_verified: false,
                admin_verified_at: null,
                users: userData
              };
            }))
          );
        }
      } else if (researchAidData) {
        // Fetch user data for each profile
        setResearchAidProfiles(
          await Promise.all(researchAidData.map(async (profile) => {
            const userId = profile.user_id || profile.id;
            const { data: userData } = await supabase
              .from('users')
              .select('name, email, role')
              .eq('id', userId)
              .single();
            
            return {
              ...profile,
              user_id: userId, // Ensure user_id is set for compatibility
              users: userData
            };
          }))
        );
      } else {
        setResearchAidProfiles([]);
      }
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
    newStatus: 'verified' | 'rejected' | 'pending',
    profileType: 'researcher' | 'research_aid' = 'researcher'
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-verification-status', {
        body: { userId, categoryKey, documentType, newStatus, profileType },
      });

      if (error) {
        throw new Error(`Function invocation failed: ${error.message}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Update local state for both researcher and research aid profiles
      const updateProfileState = (profiles: any[], setProfiles: Function) => {
        const profile = profiles.find(p => p.user_id === userId);
        if (!profile) return;

        const newVerifications = JSON.parse(JSON.stringify(profile.verifications));
        const docIndex = newVerifications[categoryKey]?.documents.findIndex((d: VerificationDocument) => d.type === documentType);

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
      };

      updateProfileState(researcherProfiles, setResearcherProfiles);
      updateProfileState(researchAidProfiles, setResearchAidProfiles);
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
      console.error('Error updating verification status:', err);
    }
  };

  // Handle admin verification status update
  const handleAdminVerification = async (userId: string, profileType: 'researcher' | 'research_aid', verified: boolean) => {
    try {
      const tableName = profileType === 'researcher' ? 'researcher_profiles' : 'research_aid_profiles';
      
      // Try with user_id first, then with id if it fails
      let error = null;
      
      if (profileType === 'research_aid') {
        // For research aid profiles, use id column (since they use id instead of user_id)
        const { error: updateError } = await supabase
          .from(tableName)
          .update({
            admin_verified: verified,
            admin_verified_at: verified ? new Date().toISOString() : null,
          })
          .eq('id', userId);
        
        error = updateError;
      } else {
        // For researcher profiles, use user_id
        const { error: updateError } = await supabase
          .from(tableName)
          .update({
            admin_verified: verified,
            admin_verified_at: verified ? new Date().toISOString() : null,
          })
          .eq('user_id', userId);
        
        error = updateError;
      }

      if (error) throw error;

      // Update local state
      if (profileType === 'researcher') {
        setResearcherProfiles(prevProfiles =>
          prevProfiles.map(p =>
            p.user_id === userId
              ? { 
                  ...p, 
                  admin_verified: verified,
                  admin_verified_at: verified ? new Date().toISOString() : undefined 
                }
              : p
          )
        );
      } else {
        setResearchAidProfiles(prevProfiles =>
          prevProfiles.map(p =>
            p.user_id === userId
              ? { 
                  ...p, 
                  admin_verified: verified,
                  admin_verified_at: verified ? new Date().toISOString() : undefined 
                }
              : p
          )
        );
      }

      toast({
        title: "Success",
        description: `${profileType === 'researcher' ? 'Researcher' : 'Research Aid'} ${verified ? 'verified' : 'unverified'} successfully`,
      });
    } catch (err: any) {
      setError(`Failed to update verification status: ${err.message}`);
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
      console.error('Error updating admin verification:', err);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Render summary table with quick verification actions
  const renderQuickVerificationTable = (profiles: any[], profileType: 'researcher' | 'research_aid', title: string) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="mr-2 h-5 w-5" />
          Quick {title} Verification
        </CardTitle>
        <CardDescription>Quickly verify or unverify {title.toLowerCase()} without detailed document review.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified Date</TableHead>
              <TableHead className="text-right">Quick Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => {
              const profileId = profile.user_id || profile.id;
              return (
                <TableRow key={profileId}>
                  <TableCell className="font-medium">
                    {profile.users?.name || 'Unknown User'}
                  </TableCell>
                  <TableCell>{profile.users?.email}</TableCell>
                  <TableCell>
                    {profile.admin_verified ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not Verified</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {profile.admin_verified_at 
                      ? new Date(profile.admin_verified_at).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant={profile.admin_verified ? "outline" : "default"}
                        size="sm" 
                        className={profile.admin_verified ? "" : "bg-green-600 hover:bg-green-700 text-white"}
                        onClick={() => handleAdminVerification(profileId, profileType, true)}
                        disabled={profile.admin_verified}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> 
                        {profile.admin_verified ? 'Verified' : 'Verify'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleAdminVerification(profileId, profileType, false)}
                        disabled={!profile.admin_verified}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> 
                        Unverify
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {profiles.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>No {title.toLowerCase()} found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProfileAccordion = (profiles: any[], profileType: 'researcher' | 'research_aid', title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          {title} Document Management
        </CardTitle>
        <CardDescription>Detailed document review and verification management for {title.toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent>
        {profiles.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {profiles.map((profile) => {
              const profileId = profile.user_id || profile.id;
              return (
              <AccordionItem value={profileId} key={profileId}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center space-x-2">
                      <span>{profile.users?.name || 'Unknown User'}</span>
                      {profile.admin_verified && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Admin Verified
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline">{profile.users?.email}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Admin Verification Controls */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Admin Verification Status</h4>
                        <p className="text-sm text-gray-600">
                          Mark this {profileType === 'researcher' ? 'researcher' : 'research aid'} as verified by admin
                        </p>
                        {profile.admin_verified_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Verified on: {new Date(profile.admin_verified_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant={profile.admin_verified ? "default" : "outline"}
                          size="sm" 
                          className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"                        onClick={() => handleAdminVerification(profileId, profileType, true)}
                        disabled={profile.admin_verified}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> 
                        {profile.admin_verified ? 'Verified' : 'Mark as Verified'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleAdminVerification(profileId, profileType, false)}
                          disabled={!profile.admin_verified}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> 
                          Remove Verification
                        </Button>
                      </div>
                    </div>

                    {/* Document Verification Table */}
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
                          ((category as VerificationCategory)?.documents ?? []).map((doc: VerificationDocument) => (
                            <TableRow key={`${categoryKey}-${doc.type}`}>
                              <TableCell>{categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} - {doc.type}</TableCell>
                              <TableCell>
                                {doc.url ? (
                                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                    {doc.filename || 'View File'} <ExternalLink className="h-4 w-4 ml-1" />
                                  </a>
                                ) : (
                                  <span>No file uploaded</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={() => handleVerification(profileId, categoryKey, doc.type, 'verified', profileType)} disabled={doc.status === 'verified'}>
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleVerification(profileId, categoryKey, doc.type, 'rejected', profileType)} disabled={doc.status === 'rejected'}>
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleVerification(profileId, categoryKey, doc.type, 'pending', profileType)} disabled={doc.status === 'pending'}>
                                  <RefreshCw className="h-4 w-4 mr-1" /> Set to Pending
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No {title.toLowerCase()} with verification documents found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Verification Management</h2>
        <p className="text-muted-foreground">Manage verification status and document reviews for researchers and research aids.</p>
      </div>

      <Tabs defaultValue="researchers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="researchers">
            Researchers ({researcherProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="research-aids">
            Research Aids ({researchAidProfiles.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="researchers" className="mt-6">
          {renderQuickVerificationTable(researcherProfiles, 'researcher', 'Researchers')}
          {renderProfileAccordion(researcherProfiles, 'researcher', 'Researchers')}
        </TabsContent>
        
        <TabsContent value="research-aids" className="mt-6">
          {renderQuickVerificationTable(researchAidProfiles, 'research_aid', 'Research Aids')}
          {renderProfileAccordion(researchAidProfiles, 'research_aid', 'Research Aids')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationManagement;