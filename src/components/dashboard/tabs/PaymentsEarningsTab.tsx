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
import { Select as OperatorSelect, SelectContent as OperatorSelectContent, SelectItem as OperatorSelectItem, SelectTrigger as OperatorSelectTrigger, SelectValue as OperatorSelectValue } from "@/components/ui/select";

const PaymentsEarningsTab = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("earnings");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);  const [withdrawalPhone, setWithdrawalPhone] = useState("");
  const [withdrawalOperator, setWithdrawalOperator] = useState("");
  const [lastWithdrawalAttempt, setLastWithdrawalAttempt] = useState(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
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
  // Pagination state for transactions
  const [transactionPage, setTransactionPage] = useState(1);
  const transactionsPerPage = 10;
  const [paginatedTransactions, setPaginatedTransactions] = useState<any[]>([]);
  const [totalTransactionPages, setTotalTransactionPages] = useState(1);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  // Rate limiting function
  const canAttemptWithdrawal = () => {
    const timeSinceLastAttempt = Date.now() - lastWithdrawalAttempt;
    const minimumWaitTime = 30 * 1000; // 30 seconds in milliseconds

    if (timeSinceLastAttempt < minimumWaitTime) {
      const waitSeconds = Math.ceil((minimumWaitTime - timeSinceLastAttempt) / 1000);
      toast({
        title: "Rate Limited",
        description: `Please wait ${waitSeconds} seconds before attempting another withdrawal`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  // Check if withdrawal is allowed without showing toast
  const isWithdrawalAllowed = () => {
    if (isWithdrawing) return false;
    const timeSinceLastAttempt = Date.now() - lastWithdrawalAttempt;
    const minimumWaitTime = 30 * 1000; // 30 seconds in milliseconds
    return timeSinceLastAttempt >= minimumWaitTime;
  };
  // Get remaining cooldown time
  const getRemainingCooldown = () => {
    const timeSinceLastAttempt = Date.now() - lastWithdrawalAttempt;
    const minimumWaitTime = 30 * 1000; // 30 seconds in milliseconds
    const remaining = Math.max(0, minimumWaitTime - timeSinceLastAttempt);
    return Math.ceil(remaining / 1000);
  };  // Send withdrawal success email notification using Supabase function
  const sendWithdrawalSuccessEmail = async (withdrawalId: string, amount: number, phone: string, operator: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: user.id,
          to: user.email,
          template: 'withdrawal_successful',
          templateData: {
            amount: amount.toLocaleString(),
            currency: 'XAF',
            paymentMethod: `${operator} Mobile Money`,
            phoneNumber: phone,
            date: new Date().toLocaleDateString(),
            transactionId: withdrawalId,
            dashboardUrl: `${window.location.origin}/dashboard?tab=earnings`
          },
          notificationType: 'withdrawal'
        }
      });

      if (error) {
        console.error('Email notification error:', error);
        throw new Error('Failed to send email notification');
      }
      
      console.log('Email notification sent successfully:', data);
    } catch (error) {
      console.error('Email notification error:', error);
      throw error;
    }
  };

  // Fetch transactions from Supabase (replace 'transactions' with your table name if needed)
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      setTransactionsLoading(true);
      const { data, error, count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .range((transactionPage - 1) * transactionsPerPage, transactionPage * transactionsPerPage - 1);
      if (!error) {
        setPaginatedTransactions(data || []);
        setTotalTransactionPages(count ? Math.ceil(count / transactionsPerPage) : 1);
      }
      setTransactionsLoading(false);
    };
    if (user) fetchTransactions();
  }, [user, transactionPage]);

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
  };  const handleRequestWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Error", description: "Invalid amount", variant: "destructive" });
      return;
    }
    if (!withdrawalPhone || !withdrawalOperator) {
      toast({ title: "Error", description: "Please enter phone number and select operator", variant: "destructive" });
      return;
    }
    // Use computedAvailableBalance for withdrawal check
    if (amount > computedAvailableBalance) {
      toast({ title: "Error", description: "Insufficient balance (pending withdrawals included)", variant: "destructive" });
      return;
    }
    
    // Check rate limiting
    if (!canAttemptWithdrawal()) {
      return;
    }

    // Prevent multiple simultaneous requests
    if (isWithdrawing) {
      toast({ title: "Error", description: "Withdrawal already in progress", variant: "destructive" });
      return;
    }

    setIsWithdrawing(true);

    try {
      const response = await fetch("http://localhost:4000/api/mesomb-withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver: withdrawalPhone,
          amount,
          service: withdrawalOperator,
          country: "CM",
          currency: "XAF",
          customer: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      
      // Determine withdrawal status based on both API response and operation success
      const withdrawalStatus = response.ok && result.operationSuccess && result.transactionSuccess 
        ? 'completed' 
        : 'failed';

      // Construct detailed notes including failure reason if applicable
      const failureReason = !result.operationSuccess ? 'Operation failed at payment provider' :
                           !result.transactionSuccess ? 'Transaction failed' : '';
      const withdrawalNotes = `Withdrawal via MeSomb (${withdrawalOperator}) to ${withdrawalPhone}${failureReason ? ` - ${failureReason}` : ''}`;

      const { data: withdrawal, error } = await supabase.from('withdrawals').insert({
        researcher_id: user.id,
        amount,
        status: withdrawalStatus,
        notes: withdrawalNotes,
      }).select().single();

      if (!error && withdrawal) {
        // Update last withdrawal attempt time
        setLastWithdrawalAttempt(Date.now());

        // Show appropriate toast based on status
        const message = withdrawalStatus === 'completed'
          ? `Withdrawal of ${amount.toLocaleString()} XAF has been completed successfully.`
          : `Withdrawal of ${amount.toLocaleString()} XAF has failed. ${failureReason}`;

        toast({
          title: withdrawalStatus === 'completed' ? "Withdrawal Successful" : "Withdrawal Failed",
          description: message,
          variant: withdrawalStatus === 'completed' ? "default" : "destructive"
        });

        // Send email notification for successful withdrawals
        if (withdrawalStatus === 'completed') {
          try {
            await sendWithdrawalSuccessEmail(withdrawal.id, amount, withdrawalPhone, withdrawalOperator);
          } catch (emailError) {
            console.error('Error sending withdrawal success email:', emailError);
            // Don't show error to user as withdrawal was successful
          }
        }

        // Reset form only on success or after recording the attempt
        setWithdrawalAmount("");
        setWithdrawalPhone("");
        setWithdrawalOperator("");

        // Refresh withdrawals list
        const { data } = await supabase
          .from('withdrawals')
          .select('*')
          .eq('researcher_id', user.id)
          .order('requested_at', { ascending: false });
        setWithdrawals(data || []);
      } else {
        throw new Error('Failed to record withdrawal');
      }
    } catch (err) {
      // Update rate limit timer even on error to prevent spam
      setLastWithdrawalAttempt(Date.now());
      
      toast({ 
        title: "Error", 
        description: err instanceof Error ? err.message : "Withdrawal failed", 
        variant: "destructive" 
      });
    } finally {
      setIsWithdrawing(false);
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
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>;
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
  // Timer to update button text during cooldown
  useEffect(() => {
    if (!isWithdrawalAllowed() && !isWithdrawing) {
      const interval = setInterval(() => {
        // Force re-render to update button text by triggering a minimal state change
        setLastWithdrawalAttempt(prev => prev);
      }, 1000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, getRemainingCooldown() * 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [lastWithdrawalAttempt, isWithdrawing]);
  const totalWithdrawn = withdrawals.filter(w => w.status === "completed").reduce((sum, w) => sum + Number(w.amount), 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending" || w.status === "processing").reduce((sum, w) => sum + Number(w.amount), 0);
  // Calculate available balance as: Total Earnings - (Total Withdrawn + Pending Withdrawals)
  // Failed withdrawals are not included in pending or completed, so they don't affect balance
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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0 overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold whitespace-nowrap truncate">Payments & Earnings</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeTab === "earnings" ? "default" : "outline"} 
            onClick={() => setActiveTab("earnings")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Earnings
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Total Earnings</p>
                <p className="text-base sm:text-lg font-bold truncate max-w-[120px] sm:max-w-[160px]">{totalEarnings.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Pending Earnings</p>
                <p className="text-base sm:text-lg font-bold truncate max-w-[120px] sm:max-w-[160px]">{pendingEarnings.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Available Balance</p>
                <p className="text-base sm:text-lg font-bold truncate max-w-[120px] sm:max-w-[160px]">{computedAvailableBalance.toLocaleString()} XAF</p>
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
                <p className="text-base sm:text-lg font-bold truncate max-w-[120px] sm:max-w-[160px]">{totalWithdrawn.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Content */}
      <div className="overflow-x-auto w-full">
      {activeTab === "earnings" && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold whitespace-nowrap truncate">Earnings Overview</h3>
            <Button onClick={() => handleExport("earnings")}> 
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          {earnings.map((earning) => (
            <Card key={earning.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="min-w-0">
                    <h4 className="font-medium truncate max-w-[180px]">{earning.project}</h4>
                    <p className="text-sm text-gray-600 truncate max-w-[140px]">Client: {earning.client}</p>
                    <p className="text-xs text-blue-600 capitalize truncate">{earning.type} payment</p>
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-lg font-semibold truncate">{earning.amount.toLocaleString()} XAF</p>
                    <p className="text-sm text-gray-500 truncate">{earning.date}</p>
                    {getStatusBadge(earning.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold whitespace-nowrap truncate">Transaction History</h3>
            <Button onClick={() => handleExport("transactions")}> 
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          {transactionsLoading ? (
            <div>Loading...</div>
          ) : (
            paginatedTransactions.length === 0 ? (
              <div className="text-gray-500">No transactions found.</div>
            ) : (
              paginatedTransactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="min-w-0">
                        <h4 className="font-medium truncate max-w-[180px]">{transaction.description}</h4>
                        <p className="text-sm text-gray-600 capitalize truncate max-w-[120px]">{transaction.type}</p>
                      </div>
                      <div className="text-right min-w-0">
                        <p className={`text-lg font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"} truncate`}>
                          {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString()} XAF
                        </p>
                        <p className="text-sm text-gray-500 truncate">{transaction.date}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}
          {/* Pagination Controls */}
          {totalTransactionPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionPage((p) => Math.max(1, p - 1))}
                disabled={transactionPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {transactionPage} of {totalTransactionPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionPage((p) => Math.min(totalTransactionPages, p + 1))}
                disabled={transactionPage === totalTransactionPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "methods" && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold whitespace-nowrap truncate">Payment Methods</h3>
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
            <Card key={method.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div className="min-w-0">
                      <h4 className="font-medium truncate max-w-[120px]">{method.name}</h4>
                      <p className="text-sm text-gray-600 truncate max-w-[120px]">{method.details.value}</p>
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
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="w-full md:w-1/3 space-y-2 min-w-[220px]">
            <div className="bg-blue-100 rounded p-2 text-blue-800 mb-2">
              Available Balance: <span className="font-bold">{computedAvailableBalance.toLocaleString()} XAF</span>
            </div>
            <Label htmlFor="withdrawal-amount">Amount (XAF)</Label>            <Input
              id="withdrawal-amount"
              type="number"
              placeholder="Enter amount"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              disabled={isWithdrawing}
            />
            <Label htmlFor="withdrawal-phone">Phone Number</Label>
            <Input
              id="withdrawal-phone"
              type="tel"
              placeholder="Enter phone number"
              value={withdrawalPhone}
              onChange={(e) => setWithdrawalPhone(e.target.value)}
              disabled={isWithdrawing}
            />
            <Label htmlFor="withdrawal-operator">Operator</Label>
            <OperatorSelect value={withdrawalOperator} onValueChange={setWithdrawalOperator} disabled={isWithdrawing}>
              <OperatorSelectTrigger>
                <OperatorSelectValue placeholder="Select operator" />
              </OperatorSelectTrigger>
              <OperatorSelectContent>
                <OperatorSelectItem value="MTN">MTN</OperatorSelectItem>
                <OperatorSelectItem value="ORANGE">ORANGE</OperatorSelectItem>
                
              </OperatorSelectContent>
            </OperatorSelect>            <Button 
              onClick={handleRequestWithdrawal} 
              className="w-full mt-2" 
              disabled={!isWithdrawalAllowed() || isWithdrawing}
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isWithdrawalAllowed() ? (
                "Request Withdrawal" 
              ) : (
                `Wait ${getRemainingCooldown()}s`
              )}
            </Button>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Withdrawal History</h4>
            {withdrawalsLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                {withdrawals.length === 0 && <div className="text-gray-500">No withdrawals yet.</div>}
                {withdrawals.map((w) => (
                  <Card key={w.id} className="overflow-hidden">
                    <CardContent className="p-4 flex justify-between items-center flex-wrap gap-2">
                      <div className="min-w-0">
                        <div className="font-medium truncate max-w-[120px]">{Number(w.amount).toLocaleString()} XAF</div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px]">Requested: {new Date(w.requested_at).toLocaleString()}</div>
                        {w.processed_at && <div className="text-xs text-gray-400 truncate max-w-[120px]">Processed: {new Date(w.processed_at).toLocaleString()}</div>}
                        {w.notes && <div className="text-xs text-gray-400 truncate max-w-[120px]">{w.notes}</div>}
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
    </div>
  );
};

export default PaymentsEarningsTab;
