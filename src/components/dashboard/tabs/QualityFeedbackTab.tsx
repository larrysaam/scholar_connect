
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QualityFeedbackTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quality & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No feedback available yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityFeedbackTab;
