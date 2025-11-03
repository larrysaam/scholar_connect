import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCoauthors } from "@/hooks/useCoauthors";

interface CoauthorInvitationsProps {
  projectId: string;
  userId: string;
}

const CoauthorInvitations = ({ projectId, userId }: CoauthorInvitationsProps) => {
  const {
    invitations,
    fetchInvitations,
    acceptInvitation,
    declineInvitation,
    loading,
    error
  } = useCoauthors(projectId);

  useEffect(() => {
    fetchInvitations();
  }, [projectId]);

  const myInvitations = invitations.filter(
    (inv) => inv.invitee_id === userId && inv.status === "pending"
  );

  return (
    <div>
      <h3 className="font-semibold mb-2">Co-author Invitations</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {myInvitations.length === 0 && <div>No pending invitations.</div>}
      {myInvitations.map((inv) => (
        <div key={inv.id} className="border rounded p-3 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div><b>From:</b> {inv.inviter_id}</div>
            <div><b>Message:</b> {inv.message || "No message"}</div>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button size="sm" onClick={() => acceptInvitation(inv.id)}>Accept</Button>
            <Button size="sm" variant="outline" onClick={() => declineInvitation(inv.id)}>Decline</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoauthorInvitations;
