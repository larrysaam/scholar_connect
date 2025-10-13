import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Plus, History, AlertCircle, Wallet, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  description: string | null;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  payment_id: string | null;
}

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositing, setDepositing] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const { toast } = useToast();
  const { user } = useAuth();

  const fetchWalletBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setWalletBalance(data?.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // If wallet doesn't exist, balance is 0
      setWalletBalance(0);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['topup', 'refund'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, [user]);

  const handleDeposit = async () => {
    if (!user) return;

    const amount = parseFloat(depositAmount);
    if (!amount || amount < 1000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is 1,000 XAF",
        variant: "destructive"
      });
      return;
    }

    if (!selectedService || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please select a payment service and enter your phone number",
        variant: "destructive"
      });
      return;
    }

    setDepositing(true);

    try {
      // Create transaction record first with pending status
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'topup',
          description: `Deposit via ${selectedService}`,
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Call MeSomb payment API
      const response = await fetch('http://localhost:4000/api/mesomb-topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          service: selectedService,
          payer: phoneNumber,
          country: 'CM',
          currency: 'XAF',
          description: `Wallet top-up - ${amount} XAF`,
          customer: {
            id: user.id,
            phone: phoneNumber
          },
          location: {
            town: 'Douala',
            region: 'Littoral',
            country: 'CM'
          },
          products: [
            {
              name: 'Wallet Top-up',
              category: 'deposit',
              quantity: 1,
              amount: amount
            }
          ]
        }),
      });

      const result = await response.json();

      console.log('Payment API response:', result);

      if (result.operationSuccess && result.transactionSuccess) {
        // Update transaction status to topup
        await supabase
          .from('transactions')
          .update({
            status: 'topup',
            payment_id: result.raw?.transaction?.id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', transactionData.id);

        // Update wallet balance
        const { error: walletError } = await supabase
          .from('wallet')
          .upsert({
            user_id: user.id,
            balance: walletBalance + amount
          }, {
            onConflict: 'user_id'
          });

        if (walletError) {
          console.error('Error updating wallet:', walletError);
          // Don't fail the deposit if wallet update fails, but log it
        }

        toast({
          title: "Deposit Successful",
          description: `Your wallet has been credited with ${amount.toLocaleString()} XAF`,
        });

        // Refresh data
        fetchWalletBalance();
        fetchTransactions();

        // Reset form
        setDepositAmount("");
        setSelectedService("");
        setPhoneNumber("");
        setShowDepositDialog(false);
      } else {
        // Update transaction status to failed
        await supabase
          .from('transactions')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', transactionData.id);

        toast({
          title: "Deposit Failed",
          description: result.raw?.message || "Payment was not successful. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your deposit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDepositing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'topup':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Wallet Balance</p>
                <p className="text-2xl font-bold">{walletBalance.toLocaleString()} XAF</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <History className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Successful Deposits</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.status === 'topup').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wallet & Transactions</h2>
          <p className="text-gray-600">Manage your wallet balance and view transaction history</p>
        </div>
        <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Funds to Wallet</DialogTitle>
              <DialogDescription>
                Deposit money into your ResearchWow wallet using mobile money
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (XAF)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (min. 1,000 XAF)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1000"
                />
              </div>
              <div>
                <Label htmlFor="service">Payment Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                    <SelectItem value="ORANGE">Orange Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-700">
                  You will receive a payment prompt on your phone. Complete the payment to add funds to your wallet.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDepositDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeposit}
                  disabled={depositing}
                  className="flex-1"
                >
                  {depositing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Deposit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-4">Make your first deposit to get started</p>
              <Button onClick={() => setShowDepositDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description || 'Wallet deposit'}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      +{transaction.amount.toLocaleString()} XAF
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTab;
