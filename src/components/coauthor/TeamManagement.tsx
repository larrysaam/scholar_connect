
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Mail, MoreHorizontal, UserMinus } from "lucide-react";

interface TeamManagementProps {
  projectId: string;
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    status: string;
    joinedAt: string;
  }>;
  permissions: {
    canInvite?: boolean;
    canRemove?: boolean;
    canChangeRoles?: boolean;
  };
}

const TeamManagement = ({ projectId, teamMembers, permissions }: TeamManagementProps) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Co-Author");

  const roles = [
    { value: "Primary Author", label: "Primary Author", description: "Full control over the project" },
    { value: "Co-Author", label: "Co-Author", description: "Can write and edit content" },
    { value: "Commenter", label: "Commenter", description: "Can only add comments" },
    { value: "Viewer", label: "Viewer", description: "Read-only access" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'in-session': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Primary Author": return "bg-purple-100 text-purple-800";
      case "Co-Author": return "bg-blue-100 text-blue-800";
      case "Commenter": return "bg-green-100 text-green-800";
      case "Viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      console.log("Inviting user:", { email: inviteEmail, role: inviteRole });
      setInviteEmail("");
      setInviteRole("Co-Author");
      setShowInviteForm(false);
    }
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    console.log("Changing role for member:", memberId, "to:", newRole);
  };

  const handleRemoveMember = (memberId: string) => {
    console.log("Removing member:", memberId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management ({teamMembers.length} members)
            </CardTitle>
            
            {permissions.canInvite && (
              <Button onClick={() => setShowInviteForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Invite Form */}
          {showInviteForm && permissions.canInvite && (
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <h4 className="font-medium">Invite New Member</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    type="email"
                  />
                </div>
                
                <div>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </div>
          )}

          {/* Team Members List */}
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar || undefined} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500">Joined {formatJoinDate(member.joinedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                    
                    {permissions.canChangeRoles && member.role !== "Primary Author" && (
                      <Select 
                        value={member.role} 
                        onValueChange={(value) => handleChangeRole(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.filter(role => role.value !== "Primary Author").map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {permissions.canRemove && member.role !== "Primary Author" && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {teamMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
              <p className="text-gray-600 mb-4">Invite collaborators to start working together</p>
              {permissions.canInvite && (
                <Button onClick={() => setShowInviteForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite First Member
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
