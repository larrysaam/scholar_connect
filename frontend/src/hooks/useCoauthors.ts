import { useState } from "react";
import { supabase } from "@/integrations/supabase/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { NotificationService } from "@/services/notificationService";
import { useNotifications } from "@/hooks/useNotifications";

export interface CoauthorInvitation {
  id: string;
  project_id: string;
  inviter_id: string;
  invitee_id?: string;
  invitee_email: string;
  status: "pending" | "accepted" | "declined" | "revoked";
  created_at: string;
  responded_at?: string;
  message?: string;
}

export interface CoauthorMembership {
  id: string;
  project_id: string;
  user_id: string;
  joined_at: string;
  role: string;
}

export function useCoauthors(projectId: string) {
  const { user } = useAuth();
  const { sendCoauthorInvitationEmail } = useNotifications();
  const [invitations, setInvitations] = useState<CoauthorInvitation[]>([]);
  const [members, setMembers] = useState<CoauthorMembership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch invitations for this project
  const fetchInvitations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("coauthor_invitations")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setInvitations(data || []);
  };

  // Fetch members for this project
  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("coauthor_memberships")
      .select("*")
      .eq("project_id", projectId)
      .order("joined_at", { ascending: true });
    setLoading(false);
    if (error) setError(error.message);
    else setMembers(data || []);
  };
  // Invite a co-author by email or userId
  const inviteCoauthor = async (invitee_id: string, message?: string, invitee_email?: string) => {
    setLoading(true);
    if (!user?.id) {
      setError('You must be logged in to send invitations.');
      setLoading(false);
      console.warn('[inviteCoauthor] Not authenticated');
      return { data: null, error: { message: 'Not authenticated' } };
    }
    if (!projectId) {
      setError('No project selected.');
      setLoading(false);
      console.warn('[inviteCoauthor] No project selected');
      return { data: null, error: { message: 'No project selected' } };
    }

    // Get invitee's email if not provided but invitee_id is available
    let finalInviteeEmail = invitee_email;
    if (invitee_id && !invitee_email) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', invitee_id)
        .single();
      
      if (userError) {
        console.error('Error fetching user email:', userError);
        setError('Failed to fetch user email');
        setLoading(false);
        return { data: null, error: { message: 'Failed to fetch user email' } };
      }
      finalInviteeEmail = userData.email;
    }

    const insertObj: any = {
      project_id: projectId,
      inviter_id: user.id,
      message: message || '',
      status: "pending"
    };
    
    if (invitee_id) insertObj.invitee_id = invitee_id;
    if (finalInviteeEmail) insertObj.invitee_email = finalInviteeEmail;
    
    console.log('[inviteCoauthor] Insert object:', insertObj);
      const { data, error } = await supabase
      .from("coauthor_invitations")
      .insert(insertObj)
      .select()
      .single();
    
    setLoading(false);
    if (error) {
      setError(error.message);
      console.error('[inviteCoauthor] Supabase error:', error, 'Insert object:', insertObj);
    } else {
      console.log('[inviteCoauthor] Success:', data);
      
      // Create onsite notification for invitee
      if (invitee_id && data) {
        try {
          // Get project details for better notification context
          const { data: projectData } = await supabase
            .from('projects')
            .select('title, description')
            .eq('id', projectId)
            .single();

          // Get inviter details
          const { data: inviterData } = await supabase
            .from('users')
            .select('name')
            .eq('id', user.id)
            .single();

          await NotificationService.createNotification({
            userId: invitee_id,
            title: 'New Collaboration Invitation',
            message: `${inviterData?.name || 'Someone'} invited you to collaborate on "${projectData?.title || 'a research project'}"`,
            type: 'info',
            category: 'collaboration',
            actionUrl: `/researcher-dashboard?tab=co-author-invitations&invitation=${data.id}`,
            actionLabel: 'View Invitation',
            metadata: {
              invitation_id: data.id,
              project_id: projectId,
              inviter_id: user.id
            }
          });

          // Send email notification
          await sendCoauthorInvitationEmail(data.id);
          
        } catch (notificationError) {
          console.error('Error creating coauthor invitation notifications:', notificationError);
          // Don't fail the invitation creation if notifications fail
        }
      }
      
      fetchInvitations();
    }
    return { data, error };
  };
  // Accept an invitation
  const acceptInvitation = async (invitationId: string) => {
    setLoading(true);
    
    try {
      // Get invitation details before accepting
      const invitation = invitations.find(i => i.id === invitationId);
      if (!invitation) {
        setError('Invitation not found');
        setLoading(false);
        return;
      }

      // Update invitation status
      const { error: updateError } = await supabase
        .from("coauthor_invitations")
        .update({ status: "accepted", responded_at: new Date().toISOString() })
        .eq("id", invitationId);
      
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      // Add to memberships
      if (invitation) {
        await supabase.from("coauthor_memberships").insert({
          project_id: invitation.project_id,
          user_id: invitation.invitee_id,
          role: "coauthor"
        });

        // Notify the inviter that their invitation was accepted
        try {
          const { data: projectData } = await supabase
            .from('projects')
            .select('title, owner_id')
            .eq('id', invitation.project_id)
            .single();

          const { data: accepterData } = await supabase
            .from('users')
            .select('name')
            .eq('id', invitation.invitee_id || user?.id)
            .single();

          if (projectData?.owner_id) {
            await NotificationService.createNotification({
              userId: projectData.owner_id,
              title: 'Collaboration Invitation Accepted',
              message: `${accepterData?.name || 'Someone'} accepted your invitation to collaborate on "${projectData.title || 'your project'}"`,
              type: 'success',
              category: 'collaboration',
              actionUrl: `/dashboard?tab=collaborations&project=${invitation.project_id}`,
              actionLabel: 'View Project',
              metadata: {
                invitation_id: invitationId,
                project_id: invitation.project_id,
                accepter_id: invitation.invitee_id || user?.id
              }
            });
          }
        } catch (notificationError) {
          console.error('Error creating acceptance notification:', notificationError);
        }
      }
      
      setLoading(false);
      fetchInvitations();
      fetchMembers();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Failed to accept invitation');
      setLoading(false);
    }
  };
  // Decline an invitation
  const declineInvitation = async (invitationId: string) => {
    setLoading(true);
    
    try {
      // Get invitation details before declining
      const invitation = invitations.find(i => i.id === invitationId);
      if (!invitation) {
        setError('Invitation not found');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("coauthor_invitations")
        .update({ status: "declined", responded_at: new Date().toISOString() })
        .eq("id", invitationId);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Notify the inviter that their invitation was declined
      try {
        const { data: projectData } = await supabase
          .from('projects')
          .select('title, owner_id')
          .eq('id', invitation.project_id)
          .single();

        const { data: declinerData } = await supabase
          .from('users')
          .select('name')
          .eq('id', invitation.invitee_id || user?.id)
          .single();

        if (projectData?.owner_id) {
          await NotificationService.createNotification({
            userId: projectData.owner_id,
            title: 'Collaboration Invitation Declined',
            message: `${declinerData?.name || 'Someone'} declined your invitation to collaborate on "${projectData.title || 'your project'}"`,
            type: 'info',
            category: 'collaboration',
            actionUrl: `/dashboard?tab=collaborations&project=${invitation.project_id}`,
            actionLabel: 'View Project',
            metadata: {
              invitation_id: invitationId,
              project_id: invitation.project_id,
              decliner_id: invitation.invitee_id || user?.id
            }
          });
        }
      } catch (notificationError) {
        console.error('Error creating decline notification:', notificationError);
      }

      setLoading(false);
      fetchInvitations();
    } catch (error) {
      console.error('Error declining invitation:', error);
      setError('Failed to decline invitation');
      setLoading(false);
    }
  };

  // Remove a co-author
  const removeCoauthor = async (userId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("coauthor_memberships")
      .delete()
      .eq("project_id", projectId)
      .eq("user_id", userId);
    setLoading(false);
    if (error) setError(error.message);
    fetchMembers();
  };

  return {
    invitations,
    members,
    loading,
    error,
    fetchInvitations,
    fetchMembers,
    inviteCoauthor,
    acceptInvitation,
    declineInvitation,
    removeCoauthor
  };
}

// Add a function to create a project and return its id
export async function createProject({ title, description, type, visibility }: {
  title: string;
  description?: string;
  type?: string;
  visibility?: string;
}) {
  // You may want to get the current user for user_id/owner_id
  const { data: authUser } = await supabase.auth.getUser();
  const userId = authUser?.user?.id;
  if (!userId) {
    return { data: null, error: { message: 'Not authenticated' } };
  }
  const insertObj: any = {
    title,
    description: description || '',
    type: type || 'Journal Article',
    visibility: visibility || 'Private',
    owner_id: userId
  };
  const { data, error } = await supabase
    .from('projects')
    .insert(insertObj)
    .select('id')
    .single();
  return { data, error };
}

// Utility function for inviting a coauthor without using React hooks
export async function inviteCoauthorDirect({ projectId, inviterId, inviteeId, message, inviteeEmail }: {
  projectId: string;
  inviterId: string;
  inviteeId?: string;
  message?: string;
  inviteeEmail?: string;
}) {
  if (!inviterId) {
    return { data: null, error: { message: 'Not authenticated' } };
  }
  if (!projectId) {
    return { data: null, error: { message: 'No project selected' } };
  }

  // Get invitee's email if not provided but inviteeId is available
  let finalInviteeEmail = inviteeEmail;
  if (inviteeId && !inviteeEmail) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', inviteeId)
      .single();
    
    if (userError) {
      console.error('Error fetching user email:', userError);
      return { data: null, error: { message: 'Failed to fetch user email' } };
    }
    finalInviteeEmail = userData.email;
  }

  const insertObj: any = {
    project_id: projectId,
    inviter_id: inviterId,
    message: message || '',
    status: "pending"
  };
  
  if (inviteeId) { 
    insertObj.invitee_id = inviteeId; 
  }
  if (finalInviteeEmail) { 
    insertObj.invitee_email = finalInviteeEmail; 
  }

  console.log('Inserting coauthor invitation:', insertObj);

  const { data, error } = await supabase
    .from("coauthor_invitations")
    .insert(insertObj)
    .select()
    .single();
  
  if (error) {
    console.error('Coauthor invitation insert error:', error);
    return { data, error };
  }

  // Create notifications and send email after successful invitation creation
  if (inviteeId && data) {
    try {
      // Get project details for better notification context
      const { data: projectData } = await supabase
        .from('projects')
        .select('title, description')
        .eq('id', projectId)
        .single();

      // Get inviter details
      const { data: inviterData } = await supabase
        .from('users')
        .select('name')
        .eq('id', inviterId)
        .single();      // Create onsite notification
      await NotificationService.createNotification({
        userId: inviteeId,
        title: 'New Collaboration Invitation',
        message: `${inviterData?.name || 'Someone'} invited you to collaborate on "${projectData?.title || 'a research project'}"`,
        type: 'info',
        category: 'collaboration',
        actionUrl: `/dashboard?tab=collaborations&invitation=${data.id}`,
        actionLabel: 'View Invitation',
        metadata: {
          invitation_id: data.id,
          project_id: projectId,
          inviter_id: inviterId
        }
      });

      // Send email notification
      const { data: emailService } = await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: inviteeId,
          to: finalInviteeEmail,
          template: 'coauthor_invitation',
          templateData: {
            projectTitle: projectData?.title || 'Research Project',
            projectDescription: projectData?.description || 'No description provided',
            inviterName: inviterData?.name || 'Project owner',
            role: 'Collaborator',
            acceptUrl: `${window.location.origin}/dashboard?tab=collaborations&invitation=${data.id}`,
            dashboardUrl: `${window.location.origin}/dashboard?tab=collaborations`
          },
          notificationType: 'collaboration'
        }
      });

      console.log('Coauthor invitation notifications and email sent successfully', emailService);
      
    } catch (notificationError) {
      console.error('Error creating coauthor invitation notifications:', notificationError);
      // Don't fail the invitation creation if notifications fail
    }
  }
  
  return { data, error };
}
