
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccountStatisticsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">47</p>
            <p className="text-sm text-gray-600">Total Consultations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">4.8</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">2.5 years</p>
            <p className="text-sm text-gray-600">Member Since</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStatisticsSection;
