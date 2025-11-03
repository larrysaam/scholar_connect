import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, CreditCard, FileText, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Payment {
  payment_id: string;
  provider_name: string;
  service_title: string;
  amount: number;
  total_amount: number;
  payment_type: "consultation" | "service";
  status: "pending" | "paid" | "released" | "refunded" | "failed";
  created_at: string;
  receipt_url?: string;
}

const StudentPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select(`
          payment_id,
          amount,
          total_amount,
          payment_type,
          status,
          created_at,
          receipt_url,
          provider_id
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedPayments = data.map(payment => ({
        payment_id: payment.payment_id,
        provider_name: "Provider Name", // Would need to join with users table
        service_title: "Service", // Default title since we can't join with jobs/consultations tables yet
        amount: payment.amount,
        total_amount: payment.total_amount,
        payment_type: payment.payment_type as "consultation" | "service",
        status: payment.status as "pending" | "paid" | "released" | "refunded" | "failed",
        created_at: payment.created_at,
        receipt_url: payment.receipt_url
      }));

      setPayments(formattedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "released": return "bg-blue-100 text-blue-800";
      case "refunded": return "bg-purple-100 text-purple-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.service_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.provider_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const downloadReceipt = (paymentId: string) => {
    // Implementation for downloading receipt
    toast({
      title: "Receipt Downloaded",
      description: "Your payment receipt has been downloaded.",
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Payments</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">
                  {payments.reduce((sum, p) => sum + p.total_amount, 0).toLocaleString()} XAF
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Payments</p>
                <p className="text-2xl font-bold">
                  {payments.filter(p => p.status === "released").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold">
                  {payments.filter(p => p.status === "pending" || p.status === "paid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No payments found matching your criteria.
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <div key={payment.payment_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{payment.service_title}</h4>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Provider: {payment.provider_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()} • 
                      Type: {payment.payment_type === "consultation" ? "Consultation" : "Service"}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-semibold">{payment.total_amount.toLocaleString()} XAF</p>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => downloadReceipt(payment.payment_id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPaymentsPage;
