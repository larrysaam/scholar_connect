import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const CoAuthorInvitationsTab = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInvitations = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("coauthor_invitations")
        .select("*")
        .eq("invitee_id", user.id)
        .eq("status", "pending");
      if (error) setError(error.message);
      else setInvitations(data || []);
      setLoading(false);
    };
    fetchUserInvitations();
  }, [user?.id]);

  if (!user) return <div>Please log in.</div>;

  const myInvitations = invitations;

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-700" />
          <h2 className="text-2xl font-bold text-gray-900">Co-author Invitations</h2>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-2">{myInvitations.length} Pending</Badge>
      </div>
      <div className="space-y-4">
        {myInvitations.map((inv) => (
          <Card key={inv.id} className="shadow-md border border-gray-200">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
              <div className="flex-1 min-w-0">
                <div className="mb-2 text-gray-700"><b>From:</b> <span className="font-mono text-blue-700">{inv.inviter_id}</span></div>
                <div className="mb-2 text-gray-700"><b>Message:</b> <span className="whitespace-pre-line">{inv.message || "No message"}</span></div>
                <div className="text-xs text-gray-400">Invitation ID: {inv.id}</div>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await supabase
                          .from("coauthor_invitations")
                          .update({ status: "accepted", responded_at: new Date().toISOString() })
                          .eq("id", inv.id);
                        setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
                      } catch (err: any) {
                        alert(err?.message || "Failed to accept invitation");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded shadow"
                    disabled={loading}
                  >
                    Accept
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await supabase
                          .from("coauthor_invitations")
                          .update({ status: "declined", responded_at: new Date().toISOString() })
                          .eq("id", inv.id);
                        setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
                      } catch (err: any) {
                        alert(err?.message || "Failed to decline invitation");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded shadow"
                    disabled={loading}
                  >
                    Decline
                  </button>
                </div>
                
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {myInvitations.length === 0 && !loading && (
        <Card className="shadow-none border border-gray-100">
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No co-authorship invitations yet.</p>
          </CardContent>
        </Card>
      )}
      {loading && <div className="text-center text-blue-600 font-medium">Loading...</div>}
      {error && <div className="text-center text-red-600 font-medium">{error}</div>}
    </div>
  );
};

export default CoAuthorInvitationsTab;
