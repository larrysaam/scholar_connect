import { useState } from "react";
import { supabase } from "@/integrations/supabase/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

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
    const insertObj: any = {
      project_id: projectId,
      inviter_id: user.id,
      message,
      status: "pending"
    };
    if (invitee_id) insertObj.invitee_id = invitee_id;
    if (invitee_email) insertObj.invitee_email = invitee_email;
    console.log('[inviteCoauthor] Insert object:', insertObj);
    const { data, error } = await supabase
      .from("coauthor_invitations")
      .insert(insertObj)
      .single();
    setLoading(false);
    if (error) {
      setError(error.message);
      console.error('[inviteCoauthor] Supabase error:', error, 'Insert object:', insertObj);
    } else {
      fetchInvitations();
      console.log('[inviteCoauthor] Success:', data);
    }
    return { data, error };
  };

  // Accept an invitation
  const acceptInvitation = async (invitationId: string) => {
    setLoading(true);
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
    const invitation = invitations.find(i => i.id === invitationId);
    if (invitation) {
      await supabase.from("coauthor_memberships").insert({
        project_id: invitation.project_id,
        user_id: invitation.invitee_id,
        role: "coauthor"
      });
    }
    setLoading(false);
    fetchInvitations();
    fetchMembers();
  };

  // Decline an invitation
  const declineInvitation = async (invitationId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("coauthor_invitations")
      .update({ status: "declined", responded_at: new Date().toISOString() })
      .eq("id", invitationId);
    setLoading(false);
    if (error) setError(error.message);
    fetchInvitations();
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
  const insertObj: any = {
    project_id: projectId,
    inviter_id: inviterId,
    message,
    status: "pending"
  };
  if (inviteeId) { insertObj.invitee_id = inviteeId; }
  if (inviteeEmail) { insertObj.invitee_email = inviteeEmail; }
  const { data, error } = await supabase
    .from("coauthor_invitations")
    .insert(insertObj)
    .single();
  return { data, error };
}
