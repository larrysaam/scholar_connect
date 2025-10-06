
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecentSummary {
  id: string;
  researcher: string;
  topic: string;
  date: string;
  notes: string;
}

interface RecentSummariesCardProps {
  summaries: RecentSummary[];
  onViewNotes: (summaryId: string) => void;
}

const RecentSummariesCard = ({ summaries, onViewNotes }: RecentSummariesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Consultation Summaries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaries.map((summary) => (
            <div key={summary.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{summary.topic}</h4>
                <p className="text-sm text-gray-600">with {summary.researcher} • {summary.date}</p>
                <p className="text-sm text-green-600 mt-1">{summary.notes}</p>
              </div>
              {/* <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewNotes(summary.id)}
              >
                View Notes
              </Button> */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSummariesCard;
