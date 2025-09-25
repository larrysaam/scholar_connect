import CoauthorInviteForm from "./CoauthorInviteForm";
import CoauthorInvitations from "./CoauthorInvitations";
import CoauthorMembers from "./CoauthorMembers";

interface CoauthorPanelProps {
  projectId: string;
  currentUserId: string;
  isOwner: boolean;
}

const CoauthorPanel = ({ projectId, currentUserId, isOwner }: CoauthorPanelProps) => {
  return (
    <div className="space-y-6">
      <CoauthorInviteForm projectId={projectId} />
      <CoauthorInvitations projectId={projectId} userId={currentUserId} />
      <CoauthorMembers projectId={projectId} currentUserId={currentUserId} isOwner={isOwner} />
    </div>
  );
};

export default CoauthorPanel;
