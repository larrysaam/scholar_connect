import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useCoAuthorInvitations = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingInvitationsCount = async () => {
      if (!user?.id) {
        setPendingCount(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { count, error } = await supabase
          .from("coauthor_invitations")
          .select("*", { count: "exact", head: true })
          .eq("invitee_id", user.id)
          .eq("status", "pending");

        if (error) {
          console.error("Error fetching co-author invitations count:", error);
          setError(error.message);
          setPendingCount(0);
        } else {
          setPendingCount(count || 0);
        }
      } catch (err: any) {
        console.error("Error fetching co-author invitations count:", err);
        setError(err.message || "Failed to fetch invitations count");
        setPendingCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingInvitationsCount();

    // Set up real-time subscription for co-author invitations
    const channel = supabase
      .channel("coauthor_invitations_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "coauthor_invitations",
          filter: `invitee_id=eq.${user?.id}`,
        },
        () => {
          // Refetch count when invitations change
          fetchPendingInvitationsCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    pendingCount,
    loading,
    error,
  };
};
