import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountStatisticsSectionProps {
  totalConsultations: number;
  averageRating: number;
  memberSince: string;
  loading?: boolean;
}

const AccountStatisticsSection = ({
  totalConsultations,
  averageRating,
  memberSince,
  loading = false
}: AccountStatisticsSectionProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{totalConsultations}</p>
            <p className="text-sm text-gray-600">Total Consultations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{memberSince}</p>
            <p className="text-sm text-gray-600">Member Since</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStatisticsSection;
