
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Download,
  Eye,
  Calendar,
  ArrowUpRight
} from "lucide-react";

interface PaymentRecord {
  id: string;
  jobTitle: string;
  studentName: string;
  amount: number;
  currency: string;
  status: "paid" | "processing" | "failed";
  completedDate: string;
  payoutDate?: string;
}

const mockPayments: PaymentRecord[] = [
  {
    id: "1",
    jobTitle: "Quantitative Data Analysis",
    studentName: "Kome Divine",
    amount: 7500,
    currency: "XAF",
    status: "paid",
    completedDate: "2024-01-15",
    payoutDate: "2024-01-17"
  },
  {
    id: "2",
    jobTitle: "Thesis Editing - Chapter 3",
    studentName: "Sama Njoya",
    amount: 12000,
    currency: "XAF",
    status: "processing",
    completedDate: "2024-01-20"
  },
  {
    id: "3",
    jobTitle: "GIS Mapping Project",
    studentName: "Paul Biya Jr.",
    amount: 18000,
    currency: "XAF",
    status: "paid",
    completedDate: "2024-01-10",
    payoutDate: "2024-01-12"
  }
];

const ResearchAidPaymentsTab = () => {
  const totalEarnings = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedJobs = mockPayments.length;
  const availableBalance = mockPayments
    .filter(p => p.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payments & Earnings</h2>
        <p className="text-gray-600">Track your income and manage payouts</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                <p className="text-2xl font-bold">{totalEarnings.toLocaleString()} XAF</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Jobs</p>
                <p className="text-2xl font-bold">{completedJobs}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  3 this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold">{availableBalance.toLocaleString()} XAF</p>
                <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                  Withdraw Earnings
                </Button>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Mobile Money</h4>
                <Badge className="bg-green-100 text-green-800">Primary</Badge>
              </div>
              <p className="text-sm text-gray-600">Orange Money - *****1234</p>
              <Button size="sm" variant="outline" className="mt-2">Edit</Button>
            </div>
            <div className="p-4 border rounded-lg border-dashed">
              <h4 className="font-medium mb-2">Bank Transfer</h4>
              <p className="text-sm text-gray-600 mb-3">Add a bank account for payouts</p>
              <Button size="sm" variant="outline">Add Bank Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{payment.jobTitle}</h4>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Client: {payment.studentName}</p>
                  <p className="text-sm text-gray-500">
                    Completed: {new Date(payment.completedDate).toLocaleDateString()}
                    {payment.payoutDate && (
                      <span> • Paid: {new Date(payment.payoutDate).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold">{payment.amount.toLocaleString()} {payment.currency}</p>
                  <Button size="sm" variant="ghost" className="mt-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Earnings Goal</span>
              <span>65,000 / 100,000 XAF</span>
            </div>
            <Progress value={65} className="h-2" />
            <p className="text-sm text-gray-600">
              You're 65% towards your monthly goal. Keep it up!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidPaymentsTab;
