
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResearchSummaryTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Research Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Create your research summary to help experts understand your project better.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchSummaryTab;
