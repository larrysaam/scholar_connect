import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ConsultationCard from "../consultation/ConsultationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Assuming this is the shape ConsultationCard expects
export interface Consultation {
  id: string;
  status: string;
  datetime: string;
  duration: number;
  researcher: { name: string; title: string; imageUrl: string; };
  service: { title: string; };
  meetLink?: string;
  sharedDocuments?: any[];
}

const StudentUpcomingTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('service_bookings')
          .select(`
            id, status, scheduled_date, scheduled_time, duration_minutes, meeting_link, shared_documents, client_notes,
            provider:users!service_bookings_provider_id_fkey(name, topic_title, payout_details),
            service:consultation_services(title)
          `)
          .eq('client_id', user.id)
          .in('status', ['pending', 'confirmed'])
          .order('scheduled_date', { ascending: true });


          console.log("Fetched consultations:", data);

        if (error) throw error;

        const mappedConsultations: Consultation[] = data.map(c => {
          const notes = c.client_notes || {};
          return {
            id: c.id,
            status: c.status,
            datetime: `${c.scheduled_date}T${c.scheduled_time}`,
            duration: c.duration_minutes,
            researcher: {
              name: c.provider?.name || 'N/A',
              title: c.provider?.topic_title || 'Researcher',
              imageUrl: c.provider?.payout_details?.avatar_url || '/placeholder.svg'
            },
            service: {
              title: c.service?.title || 'Consultation'
            },
            topic: notes.topic || 'No topic provided',
            meetLink: c.meeting_link,
            sharedDocuments: c.shared_documents || []
          }
        });

        setConsultations(mappedConsultations);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching consultations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  const handleJoinMeet = (meetLink: string | undefined) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    } else {
      toast({ title: "No Meeting Link", description: "The meeting link has not been generated yet.", variant: "destructive" });
    }
  };

  // Other handlers can be updated to use real data as well
  const handleUploadDocument = (consultationId: string) => {
    toast({ title: "Upload Document", description: "Feature not implemented." });
  };
  const handleSubmitDocumentLink = (consultationId: string, documentLink: string) => {
    toast({ title: "Document Link Shared", description: "Feature not implemented." });
  };
  const handleContactResearcher = (researcherId: string, consultationId: string) => {
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'messages' }));
  };
  const handleAccessDocument = (documentLink: string) => {
    window.open(documentLink, '_blank');
  };

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Upcoming Consultations</h2>
      </div>
      
      {consultations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">You have no upcoming consultations scheduled.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              uploadedDocuments={consultation.sharedDocuments}
              userType="student"
              onJoinMeet={() => handleJoinMeet(consultation.meetLink)}
              onUploadDocument={() => handleUploadDocument(consultation.id)}
              onSubmitDocumentLink={(link) => handleSubmitDocumentLink(consultation.id, link)}
              onContactResearcher={() => handleContactResearcher(consultation.researcher.name, consultation.id)} // Assuming name is unique for now
              onAccessDocument={handleAccessDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentUpcomingTab;