// TODO: Replace all mock data and local state with backend integration (e.g., Supabase or REST API)
// Example: usePayments hook for fetching and mutating earnings, transactions, payment methods
// const { earnings, transactions, paymentMethods, addPaymentMethod, updatePaymentMethod, requestWithdrawal, loading } = usePayments(userId);
// For now, the UI and state logic is ready for backend integration.

import { useState } from "react";
import { usePayments } from "@/hooks/usePayments";
import { useAuth } from "@/hooks/useAuth";
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
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsPaymentsEarnings = () => {
  const { user } = useAuth();
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

  const [activeTab, setActiveTab] = useState("earnings");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<any>(null);
  const { toast } = useToast();

  if (loading) {
    return <div className="text-center py-10">Loading payments data...</div>;
  }

  const totalEarnings = earnings.reduce((sum, earning) => 
    earning.status === "completed" ? sum + earning.amount : sum, 0
  );

  const pendingEarnings = earnings.reduce((sum, earning) => 
    earning.status === "pending" ? sum + earning.amount : sum, 0
  );

  const handleExport = (type: string) => {
    toast({
      title: "Exporting Data",
      description: `Exporting ${type} data to CSV file`
    });
  };

  const handleAddPaymentMethod = () => {
    if (!paymentMethodType || !paymentDetails) {
      toast({
        title: "Error",
        description: "Please fill in all payment method details",
        variant: "destructive"
      });
      return;
    }

    addPaymentMethod({
      type: paymentMethodType as "bank" | "mobile",
      name: paymentMethodType === "bank" ? "New Bank Account" : "New Mobile Money",
      details: `****${paymentDetails.slice(-4)}`
    });

    setPaymentMethodType("");
    setPaymentDetails("");

    toast({
      title: "Payment Method Added",
      description: "New payment method has been added successfully"
    });
  };

  const handleEditPaymentMethod = (method: any) => {
    if (!paymentDetails) {
      toast({
        title: "Error",
        description: "Please enter payment details",
        variant: "destructive"
      });
      return;
    }

    updatePaymentMethod({
      ...method,
      details: `****${paymentDetails.slice(-4)}`
    });

    setEditingPaymentMethod(null);
    setPaymentDetails("");

    toast({
      title: "Payment Method Updated",
      description: "Payment method has been updated successfully"
    });
  };

  const handleRequestWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    if (amount > availableBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance for withdrawal",
        variant: "destructive"
      });
      return;
    }

    requestWithdrawal(amount);

    setWithdrawalAmount("");
    
    toast({
      title: "Withdrawal Requested",
      description: `Withdrawal of ${amount.toLocaleString()} XAF has been requested`
    });
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

  return (    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">Payments & Earnings</h2>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold">{totalEarnings.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Earnings</p>
                <p className="text-xl sm:text-2xl font-bold">{pendingEarnings.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-xl sm:text-2xl font-bold">{availableBalance.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    {earning.source === 'job' && (
                      <Badge className="bg-yellow-500 text-white mt-1">Job</Badge>
                    )}
                    {earning.source === 'appointment' && (
                      <Badge className="bg-green-500 text-white mt-1">Appointment</Badge>
                    )}
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
              <CardContent className="p-4">                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <p className="text-sm text-gray-600 capitalize">{transaction.type}</p>
                  </div>
                  <div className="text-left sm:text-right">
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
          
          {/* Withdrawal Request */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdrawal-amount">Amount (XAF)</Label>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available balance: {availableBalance.toLocaleString()} XAF
                  </p>
                </div>
                <Button onClick={handleRequestWithdrawal} className="w-full">
                  Request Withdrawal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "methods" && (
        <div className="space-y-4">          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
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
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
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
                      <p className="text-sm text-gray-600">{method.details}</p>
                      {method.is_default && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </div>
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
                            value={paymentDetails}
                            onChange={(e) => setPaymentDetails(e.target.value)}
                          />
                        </div>
                        <Button onClick={() => updatePaymentMethod({ ...method, details: `****${paymentDetails.slice(-4)}` })} className="w-full">
                          Update Payment Method
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchAidsPaymentsEarnings;
