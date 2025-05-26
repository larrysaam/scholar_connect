
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoAuthorInvitation from "@/components/researcher/CoAuthorInvitation";

// Mock data for co-author invitations
const mockInvitations = [
  {
    id: "1",
    fromUser: {
      name: "Dr. Sarah Johnson",
      title: "Assistant Professor",
      institution: "University of California, Berkeley",
      email: "sarah.johnson@berkeley.edu"
    },
    publicationType: "Article",
    researchTopic: "AI Ethics in Healthcare Decision Making",
    researchProblem: "Current AI systems in healthcare lack transparency and accountability mechanisms, leading to potential bias in patient care decisions.",
    objectives: "To develop a framework for ethical AI implementation in healthcare settings that ensures transparency, accountability, and bias mitigation.",
    methodology: "Mixed-methods approach including systematic literature review, stakeholder interviews, and case study analysis of existing AI systems.",
    roles: "I would lead the technical implementation and data analysis, while seeking collaboration on the ethical framework development and healthcare domain expertise.",
    nextSteps: "I propose a 30-minute video call to discuss the collaboration details and establish a timeline for the research project.",
    dateSent: "2024-01-15",
    status: "pending" as const
  },
  {
    id: "2",
    fromUser: {
      name: "Prof. Michael Chen",
      title: "Professor of Computer Science",
      institution: "Stanford University",
      email: "m.chen@stanford.edu"
    },
    publicationType: "Conference Paper",
    researchTopic: "Quantum Computing Applications in Cryptography",
    researchProblem: "Traditional cryptographic methods are becoming vulnerable to quantum computing attacks, requiring new quantum-resistant algorithms.",
    objectives: "To develop and validate new quantum-resistant cryptographic protocols suitable for real-world applications.",
    methodology: "Theoretical analysis combined with simulation studies and performance benchmarking against existing cryptographic standards.",
    roles: "I bring expertise in quantum algorithms, seeking collaboration on cryptographic protocol design and security analysis.",
    nextSteps: "Let's schedule a meeting to discuss the technical details and potential publication venues for this work.",
    dateSent: "2024-01-10",
    status: "accepted" as const
  }
];

const CoAuthorInvitationsTab = () => {
  const [invitations, setInvitations] = useState(mockInvitations);

  const handleAccept = (id: string) => {
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, status: "accepted" as const } : inv
      )
    );
    console.log("Accepted invitation:", id);
  };

  const handleDecline = (id: string) => {
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, status: "declined" as const } : inv
      )
    );
    console.log("Declined invitation:", id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Co-author Invitations</h2>
      
      {invitations.length > 0 ? (
        <div className="space-y-6">
          {invitations.map((invitation) => (
            <CoAuthorInvitation
              key={invitation.id}
              invitation={invitation}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No co-author invitations at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoAuthorInvitationsTab;
