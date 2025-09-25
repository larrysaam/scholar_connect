import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCoauthors } from "@/hooks/useCoauthors";

interface CoauthorInviteFormProps {
  projectId: string;
}

const CoauthorInviteForm = ({ projectId }: CoauthorInviteFormProps) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { inviteCoauthor, loading } = useCoauthors(projectId);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const { error } = await inviteCoauthor(email, message);
    if (error) setError(error.message);
    else {
      setSuccess("Invitation sent!");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-3">
      <Input
        type="email"
        placeholder="Invitee's email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Textarea
        placeholder="Optional message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <Button type="submit" disabled={loading}>Send Invitation</Button>
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
};

export default CoauthorInviteForm;
