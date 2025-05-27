
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const ResearchAidsPaymentsEarnings = () => {
  const [timeframe, setTimeframe] = useState("this-month");

  const earningsData = {
    total: 145750,
    thisMonth: 45750,
    pending: 25000,
    completed: 120750,
    growth: 15.2
  };

  const recentTransactions = [
    {
      id: 1,
      project: "Statistical Analysis Project",
      client: "Dr. Sarah Johnson",
      amount: 25000,
      status: "completed",
      date: "2024-01-25",
      type: "payment"
    },
    {
      id: 2,
      project: "Literature Review - Chapter 1",
      client: "Prof. Michael Chen",
      amount: 15000,
      status: "pending",
      date: "2024-01-28",
      type: "payment"
    },
    {
      id: 3,
      project: "Platform Fee",
      client: "ScholarConnect",
      amount: -2500,
      status: "completed",
      date: "2024-01-25",
      type: "fee"
    },
    {
      id: 4,
      project: "Data Collection Protocol",
      client: "Dr. Marie Dubois",
      amount: 30000,
      status: "completed",
      date: "2024-01-20",
      type: "payment"
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Mobile Money",
      details: "MTN (***678)",
      isDefault: true
    },
    {
      id: 2,
      type: "Bank Account",
      details: "UBA (***1234)",
      isDefault: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-600">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) {
      return <ArrowDownRight className="h-4 w-4 text-green-600" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments & Earnings</h2>
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === "this-month" ? "default" : "outline"} 
            onClick={() => setTimeframe("this-month")}
          >
            This Month
          </Button>
          <Button 
            variant={timeframe === "all-time" ? "default" : "outline"} 
            onClick={() => setTimeframe("all-time")}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">{earningsData.total.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{earningsData.thisMonth.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{earningsData.pending.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth</p>
                <p className="text-2xl font-bold">+{earningsData.growth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type, transaction.amount)}
                  <div>
                    <h4 className="font-medium">{transaction.project}</h4>
                    <p className="text-sm text-gray-600">{transaction.client}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} XAF
                  </p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{method.type}</p>
                    <p className="text-sm text-gray-600">{method.details}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && <Badge variant="outline">Default</Badge>}
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Withdraw Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Available for withdrawal</p>
              <p className="text-2xl font-bold text-green-600">{earningsData.completed.toLocaleString()} XAF</p>
            </div>
            <Button className="w-full">
              Request Withdrawal
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Withdrawals are processed within 1-3 business days
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsPaymentsEarnings;
