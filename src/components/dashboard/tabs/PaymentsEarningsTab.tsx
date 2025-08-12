
import { useState } from "react";
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

const PaymentsEarningsTab = () => {
  const [activeTab, setActiveTab] = useState("earnings");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<any>(null);
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
    addPaymentMethod({ type: paymentMethodType, name: paymentMethodType === 'bank' ? 'Bank Account' : 'Mobile Money', details: paymentDetails });
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

  const handleRequestWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Error", description: "Invalid amount", variant: "destructive" });
      return;
    }
    requestWithdrawal(amount);
    setWithdrawalAmount("");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading payment data...</span>
      </div>
    );
  }

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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-2xl font-bold">{availableBalance.toLocaleString()} XAF</p>
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
    </div>
  );
};

export default PaymentsEarningsTab;
