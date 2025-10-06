import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { NotificationService } from '@/services/notificationService';
import { useNotifications } from '@/hooks/useNotifications';

export const useCoauthorNotifications = () => {
  const { user } = useAuth();
  const { sendCoauthorInvitationEmail } = useNotifications();

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for coauthor invitations
    const channel = supabase
      .channel('coauthor_invitations_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coauthor_invitations',
        },
        async (payload) => {
          try {
            const invitation = payload.new;
            
            // Only create notification if the current user is the invitee
            if (invitation.invitee_id === user.id) {
              // Get project and inviter details
              const { data: projectData } = await supabase
                .from('projects')
                .select('title, description, owner_id')
                .eq('id', invitation.project_id)
                .single();

              const { data: inviterData } = await supabase
                .from('users')
                .select('name')
                .eq('id', invitation.inviter_id)
                .single();

              // Create onsite notification
              await NotificationService.createNotification({
                userId: invitation.invitee_id,
                title: 'New Collaboration Invitation',
                message: `${inviterData?.name || 'Someone'} invited you to collaborate on "${projectData?.title || 'a research project'}"`,
                type: 'info',
                category: 'collaboration',
                actionUrl: `/dashboard?tab=collaborations&invitation=${invitation.id}`,
                actionLabel: 'View Invitation',
                metadata: {
                  invitation_id: invitation.id,
                  project_id: invitation.project_id,
                  inviter_id: invitation.inviter_id
                }
              });

              // The email will be sent automatically by the database trigger
              console.log('Coauthor invitation notification created');
            }
          } catch (error) {
            console.error('Error handling coauthor invitation notification:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coauthor_invitations',
        },
        async (payload) => {
          try {
            const oldInvitation = payload.old;
            const newInvitation = payload.new;
            
            // Handle status changes (accepted/declined)
            if (oldInvitation.status !== newInvitation.status) {
              // Get project and user details
              const { data: projectData } = await supabase
                .from('projects')
                .select('title, owner_id')
                .eq('id', newInvitation.project_id)
                .single();

              const { data: respondentData } = await supabase
                .from('users')
                .select('name')
                .eq('id', newInvitation.invitee_id)
                .single();

              // Notify the project owner about the response
              if (projectData?.owner_id && projectData.owner_id === user.id) {
                if (newInvitation.status === 'accepted') {
                  await NotificationService.createNotification({
                    userId: projectData.owner_id,
                    title: 'Collaboration Invitation Accepted',
                    message: `${respondentData?.name || 'Someone'} accepted your invitation to collaborate on "${projectData.title || 'your project'}"`,
                    type: 'success',
                    category: 'collaboration',
                    actionUrl: `/dashboard?tab=collaborations&project=${newInvitation.project_id}`,
                    actionLabel: 'View Project',
                    metadata: {
                      invitation_id: newInvitation.id,
                      project_id: newInvitation.project_id,
                      accepter_id: newInvitation.invitee_id
                    }
                  });
                } else if (newInvitation.status === 'declined') {
                  await NotificationService.createNotification({
                    userId: projectData.owner_id,
                    title: 'Collaboration Invitation Declined',
                    message: `${respondentData?.name || 'Someone'} declined your invitation to collaborate on "${projectData.title || 'your project'}"`,
                    type: 'info',
                    category: 'collaboration',
                    actionUrl: `/dashboard?tab=collaborations&project=${newInvitation.project_id}`,
                    actionLabel: 'View Project',
                    metadata: {
                      invitation_id: newInvitation.id,
                      project_id: newInvitation.project_id,
                      decliner_id: newInvitation.invitee_id
                    }
                  });
                }
              }
            }
          } catch (error) {
            console.error('Error handling coauthor invitation status change:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {};
};
