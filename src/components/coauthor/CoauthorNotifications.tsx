import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle, XCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationService } from "@/services/notificationService";

interface CoauthorNotification {
  id: string;
  project_id: string;
  inviter_id: string;
  invitee_id?: string;
  invitee_email: string;
  status: "pending" | "accepted" | "declined" | "revoked";
  created_at: string;
  responded_at?: string;
  message?: string;
  project?: {
    title: string;
    description?: string;
    owner?: {
      name: string;
    };
  };
  inviter?: {
    name: string;
  };
  invitee?: {
    name: string;
    email: string;
  };
}

const CoauthorNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendCoauthorInvitationEmail } = useNotifications();
  const [invitations, setInvitations] = useState<CoauthorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  const fetchInvitations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coauthor_invitations')
        .select(`
          *,
          project:projects(
            title,
            description,
            owner:users(name)
          ),
          inviter:users!coauthor_invitations_inviter_id_fkey(name),
          invitee:users!coauthor_invitations_invitee_id_fkey(name, email)
        `)
        .or(`invitee_id.eq.${user.id},inviter_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (err: any) {
      console.error('Error fetching coauthor invitations:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load collaboration invitations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      setActionLoading({ ...actionLoading, [invitationId]: true });
      
      const { error } = await supabase
        .from('coauthor_invitations')
        .update({ 
          status: 'accepted', 
          responded_at: new Date().toISOString() 
        })
        .eq('id', invitationId);

      if (error) throw error;

      // Find the invitation to get details
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (invitation) {
        // Add to memberships
        await supabase.from('coauthor_memberships').insert({
          project_id: invitation.project_id,
          user_id: user?.id,
          role: 'coauthor'
        });

        // Notify the inviter
        await NotificationService.createNotification({
          userId: invitation.inviter_id,
          title: 'Collaboration Invitation Accepted',
          message: `${user?.user_metadata?.name || 'Someone'} accepted your invitation to collaborate on "${invitation.project?.title || 'the project'}"`,
          type: 'success',
          category: 'collaboration',
          actionUrl: `/dashboard?tab=collaborations&project=${invitation.project_id}`,
          actionLabel: 'View Project'
        });
      }

      toast({
        title: "Success",
        description: "Collaboration invitation accepted successfully",
      });

      fetchInvitations();
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive"
      });
    } finally {
      setActionLoading({ ...actionLoading, [invitationId]: false });
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      setActionLoading({ ...actionLoading, [invitationId]: true });
      
      const { error } = await supabase
        .from('coauthor_invitations')
        .update({ 
          status: 'declined', 
          responded_at: new Date().toISOString() 
        })
        .eq('id', invitationId);

      if (error) throw error;

      // Find the invitation to get details
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (invitation) {
        // Notify the inviter
        await NotificationService.createNotification({
          userId: invitation.inviter_id,
          title: 'Collaboration Invitation Declined',
          message: `${user?.user_metadata?.name || 'Someone'} declined your invitation to collaborate on "${invitation.project?.title || 'the project'}"`,
          type: 'info',
          category: 'collaboration',
          actionUrl: `/dashboard?tab=collaborations&project=${invitation.project_id}`,
          actionLabel: 'View Project'
        });
      }

      toast({
        title: "Success",
        description: "Collaboration invitation declined",
      });

      fetchInvitations();
    } catch (err: any) {
      console.error('Error declining invitation:', err);
      toast({
        title: "Error",
        description: "Failed to decline invitation",
        variant: "destructive"
      });
    } finally {
      setActionLoading({ ...actionLoading, [invitationId]: false });
    }
  };

  const handleResendEmailNotification = async (invitationId: string) => {
    try {
      setActionLoading({ ...actionLoading, [`email-${invitationId}`]: true });
      
      const success = await sendCoauthorInvitationEmail(invitationId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Email notification sent successfully",
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err: any) {
      console.error('Error sending email:', err);
      toast({
        title: "Error",
        description: "Failed to send email notification",
        variant: "destructive"
      });
    } finally {
      setActionLoading({ ...actionLoading, [`email-${invitationId}`]: false });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      declined: { color: "bg-red-100 text-red-800", icon: XCircle },
      revoked: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };
    
    const variant = variants[status as keyof typeof variants];
    const IconComponent = variant?.icon || Clock;
    
    return (
      <Badge className={`${variant?.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  useEffect(() => {
    fetchInvitations();

    // Set up real-time subscription
    const channel = supabase
      .channel('coauthor_invitations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coauthor_invitations',
        },
        () => {
          fetchInvitations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={fetchInvitations} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending' && inv.invitee_id === user?.id);
  const sentInvitations = invitations.filter(inv => inv.inviter_id === user?.id);
  const respondedInvitations = invitations.filter(inv => inv.status !== 'pending' && inv.invitee_id === user?.id);

  return (
    <div className="space-y-6">
      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Invitations ({pendingInvitations.length})
          </h3>
          <div className="space-y-4">
            {pendingInvitations.map((invitation) => (
              <Card key={invitation.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{invitation.project?.title || 'Untitled Project'}</CardTitle>
                      <p className="text-sm text-gray-600">
                        From: {invitation.inviter?.name || 'Unknown'} • {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(invitation.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invitation.message && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{invitation.message}</p>
                    </div>
                  )}
                  {invitation.project?.description && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">{invitation.project.description}</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      disabled={actionLoading[invitation.id]}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading[invitation.id] ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      disabled={actionLoading[invitation.id]}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {actionLoading[invitation.id] ? "Declining..." : "Decline"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sent Invitations */}
      {sentInvitations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sent Invitations ({sentInvitations.length})
          </h3>
          <div className="space-y-4">
            {sentInvitations.map((invitation) => (
              <Card key={invitation.id} className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{invitation.project?.title || 'Untitled Project'}</CardTitle>
                      <p className="text-sm text-gray-600">
                        To: {invitation.invitee?.name || invitation.invitee_email} • {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(invitation.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {invitation.message && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{invitation.message}</p>
                    </div>
                  )}
                  {invitation.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendEmailNotification(invitation.id)}
                      disabled={actionLoading[`email-${invitation.id}`]}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {actionLoading[`email-${invitation.id}`] ? "Sending..." : "Resend Email"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Previous Responses */}
      {respondedInvitations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Previous Responses</h3>
          <div className="space-y-4">
            {respondedInvitations.map((invitation) => (
              <Card key={invitation.id} className="opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{invitation.project?.title || 'Untitled Project'}</CardTitle>
                      <p className="text-sm text-gray-600">
                        From: {invitation.inviter?.name || 'Unknown'} • Responded: {invitation.responded_at ? new Date(invitation.responded_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    {getStatusBadge(invitation.status)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {invitations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Collaboration Invitations</h3>
            <p className="text-gray-500">You haven't received or sent any collaboration invitations yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoauthorNotifications;
