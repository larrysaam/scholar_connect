
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Download,
  Smartphone,
  Building,
  Eye,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Earning {
  payment_id: string;
  student_name: string;
  service_title: string;
  amount: number;
  status: "paid" | "released" | "pending";
  created_at: string;
  payment_type: "consultation" | "service";
}

const ProviderEarningsPage = () => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEarnings();
    fetchWalletBalance();
  }, []);

  const fetchEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select(`
          payment_id,
          amount,
          status,
          created_at,
          payment_type,
          jobs (title),
          consultations (title)
        `)
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedEarnings = data.map(payment => ({
        payment_id: payment.payment_id,
        student_name: "Student Name", // Would need to join with users table
        service_title: payment.jobs?.title || payment.consultations?.title || "Service",
        amount: payment.amount,
        status: payment.status,
        created_at: payment.created_at,
        payment_type: payment.payment_type
      }));

      setEarnings(formattedEarnings);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("wallet_balance")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setWalletBalance(data?.wallet_balance || 0);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (walletBalance <= 0) {
        toast({
          title: "No Funds Available",
          description: "You don't have any funds available for withdrawal.",
          variant: "destructive",
        });
        return;
      }

      // Create withdrawal request
      const { error } = await supabase
        .from("withdrawals")
        .insert({
          user_id: user.id,
          amount: walletBalance,
          payout_method: "mobile_money",
          payout_details: { phone: "+237xxxxxxxx" }, // Would be user's actual payout details
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal of ${walletBalance.toLocaleString()} XAF has been requested.`,
      });

      // Reset wallet balance
      setWalletBalance(0);
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal request.",
        variant: "destructive",
      });
    }
  };

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const completedJobs = earnings.filter(e => e.status === "released").length;
  const monthlyGoal = 100000; // XAF
  const monthlyProgress = (totalEarnings / monthlyGoal) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "released": return "bg-green-100 text-green-800";
      case "paid": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading earnings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Earnings</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                <p className="text-3xl font-bold">{totalEarnings.toLocaleString()} XAF</p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Jobs</p>
                <p className="text-3xl font-bold">{completedJobs}</p>
                <p className="text-sm text-blue-600 flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {earnings.filter(e => e.status === "released" && new Date(e.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length} this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-3xl font-bold">{walletBalance.toLocaleString()} XAF</p>
                <Button 
                  size="sm" 
                  className="mt-3 bg-green-600 hover:bg-green-700"
                  onClick={handleWithdraw}
                  disabled={walletBalance <= 0}
                >
                  Withdraw Earnings
                </Button>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="h-8 w-8 text-purple-600" />
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
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-6 w-6 text-orange-600" />
                  <h4 className="font-medium">Mobile Money</h4>
                </div>
                <Badge className="bg-green-100 text-green-800">Primary</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">Orange Money - *****1234</p>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
            <div className="p-4 border rounded-lg border-dashed">
              <div className="flex items-center space-x-3 mb-3">
                <Building className="h-6 w-6 text-blue-600" />
                <h4 className="font-medium">Bank Transfer</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Add a bank account for payouts</p>
              <Button size="sm" variant="outline">Add Bank Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No earnings yet. Start completing jobs to see your earnings here.
              </div>
            ) : (
              earnings.map((earning) => (
                <div key={earning.payment_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{earning.service_title}</h4>
                      <Badge className={getStatusColor(earning.status)}>
                        {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Client: {earning.student_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(earning.created_at).toLocaleDateString()} • 
                      Type: {earning.payment_type === "consultation" ? "Consultation" : "Service"}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-semibold">{earning.amount.toLocaleString()} XAF</p>
                    <Button size="sm" variant="ghost" className="mt-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
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
              <span>{totalEarnings.toLocaleString()} / {monthlyGoal.toLocaleString()} XAF</span>
            </div>
            <Progress value={Math.min(monthlyProgress, 100)} className="h-3" />
            <p className="text-sm text-gray-600">
              You're {Math.round(monthlyProgress)}% towards your monthly goal. Keep it up!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderEarningsPage;
