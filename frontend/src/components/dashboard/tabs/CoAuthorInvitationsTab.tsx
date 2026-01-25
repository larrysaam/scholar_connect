import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, UserCheck, UserX, Clock, MessageSquare, CheckCircle, XCircle, Mail } from "lucide-react";
import { toast } from "sonner";

const CoAuthorInvitationsTab = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviterNames, setInviterNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Dialog states
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
  const [acceptReason, setAcceptReason] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (error) {
        setError(error.message);
      } else {
        setInvitations(data || []);
        
        // Fetch inviter names
        const inviterIds = [...new Set((data || []).map(inv => inv.inviter_id))];
        if (inviterIds.length > 0) {
          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("id, name")
            .in("id", inviterIds);
          
          if (!usersError && usersData) {
            const namesMap: Record<string, string> = {};
            usersData.forEach(user => {
              namesMap[user.id] = user.name || "Unknown User";
            });
            setInviterNames(namesMap);
          }
        }
      }
      setLoading(false);
    };
    fetchUserInvitations();
  }, [user?.id]);

  if (!user) return <div>Please log in.</div>;

  const myInvitations = invitations;
  const totalPages = Math.ceil(myInvitations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvitations = myInvitations.slice(startIndex, endIndex);
  // Reset to first page when invitations change
  useEffect(() => {
    setCurrentPage(1);
  }, [invitations.length]);

  const handleAcceptInvitation = async () => {
    if (!selectedInvitation || !acceptReason.trim()) {
      toast.error("Please provide a reason for accepting");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("coauthor_invitations")
        .update({ 
          status: "accepted", 
          responded_at: new Date().toISOString(),
          response_reason: acceptReason.trim()
        })
        .eq("id", selectedInvitation.id);

      if (error) throw error;

      setInvitations((prev) => prev.filter((i) => i.id !== selectedInvitation.id));
      toast.success("Invitation accepted successfully!");
      setShowAcceptDialog(false);
      setAcceptReason("");
      setSelectedInvitation(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to accept invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!selectedInvitation || !declineReason.trim()) {
      toast.error("Please provide a reason for declining");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("coauthor_invitations")
        .update({ 
          status: "declined", 
          responded_at: new Date().toISOString(),
          response_reason: declineReason.trim()
        })
        .eq("id", selectedInvitation.id);

      if (error) throw error;

      setInvitations((prev) => prev.filter((i) => i.id !== selectedInvitation.id));
      toast.success("Invitation declined");
      setShowDeclineDialog(false);
      setDeclineReason("");
      setSelectedInvitation(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to decline invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Co-author Invitations</h1>
              <p className="text-gray-600 mt-1">Manage your collaboration requests</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            <Clock className="h-4 w-4 mr-2" />
            {myInvitations.length} Pending
          </Badge>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Invitations List */}
      {!loading && !error && (
        <div className="space-y-4">
          {currentInvitations.map((inv) => (
            <Card key={inv.id} className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6 overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">                  {/* Inviter Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 border-2 border-blue-100 flex-shrink-0">
                      <AvatarImage src="" alt={inviterNames[inv.inviter_id] || "User"} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {(inviterNames[inv.inviter_id] || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <UserCheck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-500 flex-shrink-0">From</span>
                        <span className="font-semibold text-gray-900 text-lg break-words">
                          {inviterNames[inv.inviter_id] || "Unknown User"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm font-medium text-gray-500 mb-1">Message</p>
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
                            {inv.message || "No message provided"}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded break-all">
                        ID: {inv.id}
                      </div>
                    </div>
                  </div>                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:items-end">
                    <Button
                      onClick={() => {
                        setSelectedInvitation(inv);
                        setShowAcceptDialog(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                      disabled={loading || isSubmitting}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedInvitation(inv);
                        setShowDeclineDialog(true);
                      }}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all duration-200"
                      disabled={loading || isSubmitting}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {myInvitations.length === 0 && !loading && !error && (
        <Card className="shadow-sm border-dashed border-2 border-gray-200">
          <CardContent className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invitations yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              When researchers invite you to collaborate on their projects, you'll see them here.
            </p>          </CardContent>
        </Card>
      )}
      
      {/* Accept Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Accept Co-author Invitation
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for accepting this invitation. This will be shared with the inviter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accept-reason">Reason for Acceptance *</Label>
              <Textarea
                id="accept-reason"
                placeholder="E.g., I'm excited to collaborate on this research project because..."
                value={acceptReason}
                onChange={(e) => setAcceptReason(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                {acceptReason.length}/500 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAcceptDialog(false);
                setAcceptReason("");
                setSelectedInvitation(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptInvitation}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || !acceptReason.trim()}
            >
              {isSubmitting ? "Accepting..." : "Accept Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Decline Co-author Invitation
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this invitation. This will be shared with the inviter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="decline-reason">Reason for Declining *</Label>
              <Textarea
                id="decline-reason"
                placeholder="E.g., Thank you for the invitation, but I'm currently committed to other projects..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                {declineReason.length}/500 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeclineDialog(false);
                setDeclineReason("");
                setSelectedInvitation(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeclineInvitation}
              variant="destructive"
              disabled={isSubmitting || !declineReason.trim()}
            >
              {isSubmitting ? "Declining..." : "Decline Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoAuthorInvitationsTab;
