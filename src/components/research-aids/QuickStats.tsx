import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, Loader2 } from "lucide-react";
import { useResearchAidStats } from "@/hooks/useResearchAidStats";

const QuickStats = () => {
  const { totalAids, totalFields, totalConsultations, completionRate, loading, error } = useResearchAidStats();

  if (error) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-red-500 text-center">Failed to load statistics</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center border-primary/20">
            <CardContent className="p-4">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${totalAids}+`}
              </div>
              <div className="text-sm text-gray-600">Expert Research Aids</div>
            </CardContent>
          </Card>
          <Card className="text-center border-primary/20">
            <CardContent className="p-4">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${totalFields}+`}
              </div>
              <div className="text-sm text-gray-600">Research Fields</div>
            </CardContent>
          </Card>
          <Card className="text-center border-primary/20">
            <CardContent className="p-4">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" /> 
                ) : (
                  <div className="flex items-center justify-center space-x-1">
                    <span>{totalConsultations}</span>
                    <span className="text-sm text-green-600">({completionRate}%)</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">Completed Consultations</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default QuickStats;
