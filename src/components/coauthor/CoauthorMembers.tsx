import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCoauthors } from "@/hooks/useCoauthors";

interface CoauthorMembersProps {
  projectId: string;
  currentUserId: string;
  isOwner: boolean;
}

const CoauthorMembers = ({ projectId, currentUserId, isOwner }: CoauthorMembersProps) => {
  const { members, fetchMembers, removeCoauthor, loading, error } = useCoauthors(projectId);

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  return (
    <div>
      <h3 className="font-semibold mb-2">Co-authors</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {members.length === 0 && <div>No co-authors yet.</div>}
      <ul>
        {members.map((member) => (
          <li key={member.user_id} className="flex items-center justify-between border-b py-2">
            <span>{member.user_id}</span>
            {isOwner && member.user_id !== currentUserId && (
              <Button size="sm" variant="outline" onClick={() => removeCoauthor(member.user_id)}>
                Remove
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoauthorMembers;
