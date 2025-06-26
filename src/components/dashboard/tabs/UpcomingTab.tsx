
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConsultationCard from '../consultation/ConsultationCard';

const UpcomingTab = () => {
  const [uploadedDocuments] = useState<string[]>([]);

  const mockConsultations = [
    {
      id: '1',
      researcher: {
        id: 'r1',
        name: 'Dr. Sarah Johnson',
        field: 'Data Science',
        imageUrl: '/placeholder-avatar.jpg'
      },
      date: '2024-01-15',
      time: '10:00 AM',
      topic: 'Machine Learning Research Methods',
      status: 'confirmed' as const
    }
  ];

  const handleJoinMeet = (consultationId: string) => {
    console.log('Joining meet for consultation:', consultationId);
  };

  const handleUploadDocument = (consultationId: string) => {
    console.log('Uploading document for consultation:', consultationId);
  };

  const handleSubmitDocumentLink = (consultationId: string, documentLink: string) => {
    console.log('Submitting document link:', consultationId, documentLink);
  };

  const handleContactResearcher = (researcherId: string, consultationId: string) => {
    console.log('Contacting researcher:', researcherId, consultationId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockConsultations.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
                uploadedDocuments={uploadedDocuments}
                userType="student"
                onJoinMeet={handleJoinMeet}
                onUploadDocument={handleUploadDocument}
                onSubmitDocumentLink={handleSubmitDocumentLink}
                onContactResearcher={handleContactResearcher}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingTab;
