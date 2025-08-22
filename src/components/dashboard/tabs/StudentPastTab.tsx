import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PastConsultationCard from "../consultation/PastConsultationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// This interface matches the props expected by PastConsultationCard
export interface PastConsultation {
  id: string;
  researcher: { id: string; name: string; field: string; imageUrl: string; };
  date: string;
  time: string;
  topic: string;
  status: "completed" | "cancelled";
  rating?: number; // Rating might come from a separate feedback table
  hasRecording: boolean;
  hasAINotes: boolean;
}

const StudentPastTab = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<PastConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedResources, setUploadedResources] = useState<{[key: string]: string[]}>({});

  useEffect(() => {
    if (!user) return;

    const fetchPastConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('service_bookings')
          .select(`
            id, status, scheduled_date, scheduled_time, client_notes,
            has_recording, has_ai_notes,
            provider:users!service_bookings_provider_id_fkey(id, name, topic_title, payout_details)
          `)
          .eq('client_id', user.id)
          .in('status', ['completed', 'cancelled'])
          .order('scheduled_date', { ascending: false });

        if (error) throw error;

        const mappedConsultations: PastConsultation[] = data.map(c => ({
          id: c.id,
          researcher: {
            id: c.provider?.id || 'N/A',
            name: c.provider?.name || 'N/A',
            field: c.provider?.topic_title || 'Researcher',
            imageUrl: c.provider?.payout_details?.avatar_url || '/placeholder.svg'
          },
          date: c.scheduled_date,
          time: c.scheduled_time,
          topic: c.client_notes?.topic || 'No topic provided',
          status: c.status as "completed" | "cancelled",
          rating: 5, // Placeholder for rating
          hasRecording: c.has_recording || false,
          hasAINotes: c.has_ai_notes || false,
        }));

        setConsultations(mappedConsultations);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching past consultations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastConsultations();
  }, [user]);

  // Handlers remain the same, but would need real logic
  const handleViewRecording = (consultationId: string) => console.log("Viewing recording for:", consultationId);
  const handleViewAINotes = (consultationId: string) => console.log("Viewing AI notes for:", consultationId);
  const handleUploadResources = (consultationId: string) => console.log("Uploading resources for:", consultationId);
  const handleSendMessage = (consultationId: string, message: string) => console.log("Sending message for:", consultationId, message);
  const handleOpenChat = (researcherId: string, consultationId: string) => console.log("Opening chat for:", consultationId);
  const handleFollowUpSession = (consultationId: string) => console.log("Booking follow-up for:", consultationId);

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
        </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Past Consultations</h2>
      
      {consultations.length > 0 ? (
        <div className="space-y-6">
          {consultations.map((consultation) => (
            <PastConsultationCard
              key={consultation.id}
              consultation={consultation}
              uploadedResources={uploadedResources[consultation.id] || []}
              userType="student"
              onViewRecording={handleViewRecording}
              onViewAINotes={handleViewAINotes}
              onUploadResources={handleUploadResources}
              onSendMessage={handleSendMessage}
              onOpenChat={handleOpenChat}
              onFollowUpSession={handleFollowUpSession}
            />
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="text-center py-12">
                <p className="text-gray-500">No past consultations available.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentPastTab;