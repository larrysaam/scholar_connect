
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RatingReviewModal from '../RatingReviewModal';

const PastTab = () => {
  const mockPastConsultations = [
    {
      id: '1',
      researcher: {
        name: 'Dr. Sarah Johnson'
      },
      date: '2024-01-10',
      time: '10:00 AM',
      topic: 'Machine Learning Research Methods',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Past Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPastConsultations.map((consultation) => (
              <div key={consultation.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{consultation.researcher.name}</h3>
                    <p className="text-gray-600">{consultation.topic}</p>
                    <p className="text-sm text-gray-500">{consultation.date} at {consultation.time}</p>
                  </div>
                  <RatingReviewModal consultation={consultation} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PastTab;
