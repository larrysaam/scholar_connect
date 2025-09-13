import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Download, 
  CreditCard, 
  Plus, 
  Edit,
  TrendingUp,
  Calendar,
  Loader2,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePayments } from "@/hooks/usePayments";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import { Select as OperatorSelect, SelectContent as OperatorSelectContent, SelectItem as OperatorSelectItem, SelectTrigger as OperatorSelectTrigger, SelectValue as OperatorSelectValue } from "@/components/ui/select";

const PaymentsEarningsTab = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("earnings");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<Tables<'withdrawals'>[]>([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [withdrawalPhone, setWithdrawalPhone] = useState("");
  const [withdrawalOperator, setWithdrawalOperator] = useState("");
  const { toast } = useToast();

  const {
    earnings,
    transactions,
    paymentMethods,
    availableBalance,
    loading,
    requestWithdrawal,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  } = usePayments();

  const totalEarnings = earnings.reduce((sum, earning) => 
    earning.status === "completed" ? sum + earning.amount : sum, 0
  );

  const pendingEarnings = earnings.reduce((sum, earning) => 
    earning.status === "pending" ? sum + earning.amount : sum, 0
  );

  const handleExport = (type: string) => {
    toast({
      title: "Exporting Data",
      description: `Generating ${type} export file...`
    });
    
    const headers = type === "earnings" ? 
      ["Project", "Client", "Amount", "Date", "Status", "Type"] :
      ["Type", "Description", "Amount", "Date", "Status"];
    
    const data = type === "earnings" ? earnings : transactions;
    const csvContent = [
      headers.join(","),
      ...data.map(item => 
        type === "earnings" ? 
        // @ts-ignore
        [item.project, item.client, item.amount, item.date, item.status, item.type].join(",") :
        [item.type, item.description, item.amount, item.date, item.status].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddPaymentMethod = () => {
    if (!paymentMethodType || !paymentDetails) {
      toast({ title: "Error", description: "Please fill all details", variant: "destructive" });
      return;
    }
    addPaymentMethod({ type: paymentMethodType as 'bank' | 'mobile', name: paymentMethodType === 'bank' ? 'Bank Account' : 'Mobile Money', details: paymentDetails });
    setPaymentMethodType("");
    setPaymentDetails({});
  };

  const handleEditPaymentMethod = (method: any) => {
    if (!paymentDetails) {
      toast({ title: "Error", description: "Please enter payment details", variant: "destructive" });
      return;
    }
    updatePaymentMethod({ ...method, details: paymentDetails });
    setEditingPaymentMethod(null);
    setPaymentDetails({});
  };

  const handleRequestWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Error", description: "Invalid amount", variant: "destructive" });
      return;
    }
    if (!withdrawalPhone || !withdrawalOperator) {
      toast({ title: "Error", description: "Please enter phone number and select operator", variant: "destructive" });
      return;
    }
    if (amount > availableToWithdraw) {
      toast({ title: "Error", description: "Insufficient balance (pending withdrawals included)", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch("/api/mesomb-withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver: withdrawalPhone,
          amount,
          service: withdrawalOperator,
          customer: user.id,
        }),
      });
      const result = await response.json();
      if (result.operationSuccess && result.transactionSuccess) {
        const { error } = await supabase.from('withdrawals').insert({
          researcher_id: user.id,
          amount,
          status: 'requested',
          notes: `Withdrawal via MeSomb (${withdrawalOperator}) to ${withdrawalPhone}`,
        });
        if (!error) {
          toast({ title: "Withdrawal Requested", description: `Withdrawal of ${amount.toLocaleString()} XAF has been requested.` });
          setWithdrawalAmount("");
          setWithdrawalPhone("");
          setWithdrawalOperator("");
          const { data } = await supabase
            .from('withdrawals')
            .select('*')
            .eq('researcher_id', user.id)
            .order('requested_at', { ascending: false });
          setWithdrawals(data || []);
        } else {
          toast({ title: "Error", description: "Failed to record withdrawal", variant: "destructive" });
        }
      } else {
        toast({ title: "Error", description: "Withdrawal failed at payment provider", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Withdrawal failed", variant: "destructive" });
    }
  };

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

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!user) return;
      setWithdrawalsLoading(true);
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("researcher_id", user.id)
        .order("requested_at", { ascending: false });
      if (!error) setWithdrawals(data || []);
      setWithdrawalsLoading(false);
    };
    if (user) fetchWithdrawals();
  }, [user]);

  const totalWithdrawn = withdrawals.filter(w => w.status === "completed").reduce((sum, w) => sum + Number(w.amount), 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending" || w.status === "requested").reduce((sum, w) => sum + Number(w.amount), 0);
  const availableToWithdraw = availableBalance - pendingWithdrawals;

  // Calculate available balance as: Total Earnings - (Total Withdrawn + Pending Withdrawals)
  const computedAvailableBalance = totalEarnings - (totalWithdrawn + pendingWithdrawals);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading payment data...</span>
      </div>
    );
  }

  // Main render
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments & Earnings</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "earnings" ? "default" : "outline"} 
            onClick={() => setActiveTab("earnings")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Earnings
          </Button>
          <Button 
            variant={activeTab === "transactions" ? "default" : "outline"} 
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </Button>
          <Button 
            variant={activeTab === "methods" ? "default" : "outline"} 
            onClick={() => setActiveTab("methods")}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Methods
          </Button>
          <Button 
            variant={activeTab === "withdrawals" ? "default" : "outline"} 
            onClick={() => setActiveTab("withdrawals")}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Withdrawals
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">{totalEarnings.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold">{pendingEarnings.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold">{computedAvailableBalance.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-700" />
              <div>
                <p className="text-sm text-gray-600">Total Withdrawn</p>
                <p className="text-2xl font-bold">{totalWithdrawn.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Content */}
      {activeTab === "earnings" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Earnings Overview</h3>
            <Button onClick={() => handleExport("earnings")}> 
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          {earnings.map((earning) => (
            <Card key={earning.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{earning.project}</h4>
                    <p className="text-sm text-gray-600">Client: {earning.client}</p>
                    <p className="text-xs text-blue-600 capitalize">{earning.type} payment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{earning.amount.toLocaleString()} XAF</p>
                    <p className="text-sm text-gray-500">{earning.date}</p>
                    {getStatusBadge(earning.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <Button onClick={() => handleExport("transactions")}> 
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <p className="text-sm text-gray-600 capitalize">{transaction.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString()} XAF
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "methods" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="payment-type">Payment Type</Label>
                    <Select value={paymentMethodType} onValueChange={setPaymentMethodType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="payment-details">
                      {paymentMethodType === "bank" ? "Account Number" : "Phone Number"}
                    </Label>
                    <Input
                      id="payment-details"
                      placeholder={paymentMethodType === "bank" ? "Enter account number" : "Enter phone number"}
                      onChange={(e) => setPaymentDetails({ value: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddPaymentMethod} className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.details.value}</p>
                      {method.is_default && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setDefaultPaymentMethod(method.id)} disabled={method.is_default}>
                      Set as Default
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingPaymentMethod(method)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Payment Method</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-payment-details">
                              {method.type === "bank" ? "Account Number" : "Phone Number"}
                            </Label>
                            <Input
                              id="edit-payment-details"
                              placeholder={method.type === "bank" ? "Enter account number" : "Enter phone number"}
                              onChange={(e) => setPaymentDetails({ value: e.target.value })}
                            />
                          </div>
                          <Button onClick={() => handleEditPaymentMethod(method)} className="w-full">
                            Update Payment Method
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => deletePaymentMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "withdrawals" && (
        <div className="space-y-4">
          <div className="w-full md:w-1/3 space-y-2">
            <div className="bg-blue-100 rounded p-2 text-blue-800 mb-2">
              Available Balance: <span className="font-bold">{computedAvailableBalance.toLocaleString()} XAF</span>
            </div>
            <Label htmlFor="withdrawal-amount">Amount (XAF)</Label>
            <Input
              id="withdrawal-amount"
              type="number"
              placeholder="Enter amount"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
            />
            <Label htmlFor="withdrawal-phone">Phone Number</Label>
            <Input
              id="withdrawal-phone"
              type="tel"
              placeholder="Enter phone number"
              value={withdrawalPhone}
              onChange={(e) => setWithdrawalPhone(e.target.value)}
            />
            <Label htmlFor="withdrawal-operator">Operator</Label>
            <OperatorSelect value={withdrawalOperator} onValueChange={setWithdrawalOperator}>
              <OperatorSelectTrigger>
                <OperatorSelectValue placeholder="Select operator" />
              </OperatorSelectTrigger>
              <OperatorSelectContent>
                <OperatorSelectItem value="MTN">MTN</OperatorSelectItem>
                <OperatorSelectItem value="ORANGE">ORANGE</OperatorSelectItem>
                
              </OperatorSelectContent>
            </OperatorSelect>
            <Button onClick={handleRequestWithdrawal} className="w-full mt-2">
              Request Withdrawal
            </Button>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Withdrawal History</h4>
            {withdrawalsLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-2">
                {withdrawals.length === 0 && <div className="text-gray-500">No withdrawals yet.</div>}
                {withdrawals.map((w) => (
                  <Card key={w.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{Number(w.amount).toLocaleString()} XAF</div>
                        <div className="text-xs text-gray-500">Requested: {new Date(w.requested_at).toLocaleString()}</div>
                        {w.processed_at && <div className="text-xs text-gray-400">Processed: {new Date(w.processed_at).toLocaleString()}</div>}
                        {w.notes && <div className="text-xs text-gray-400">{w.notes}</div>}
                      </div>
                      <div>{getStatusBadge(w.status)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsEarningsTab;
