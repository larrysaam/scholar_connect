import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, TrendingUp, AlertCircle, Download, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  recipient_id: string;
  users: {
    name: string;
  } | null;
  recipient: {
    name: string;
  } | null;
}

interface Payout {
  id: string;
  recipient_id: string;
  amount: number;
  method: string;
  scheduled_date: string;
  status: string;
  sessions: number;
  users: {
    name: string;
  } | null;
}

const PaymentTransactions = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [payoutSchedule, setPayoutSchedule] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          users ( name ),
          recipient:recipient_id ( name )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setRecentTransactions(transactions || []);

      const { data: payouts, error: payoutsError } = await supabase
        .from('payouts')
        .select(`
          *,
          users ( name )
        `)
        .order('scheduled_date', { ascending: true })
        .limit(10);

      if (payoutsError) throw payoutsError;
      setPayoutSchedule(payouts || []);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment data.');
      console.error('Error fetching payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment & Transactions</h2>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ... overview cards ... */}
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout Schedule</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">{transaction.id}</TableCell>
                      <TableCell>{transaction.users?.name || 'Unknown User'}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="font-semibold">{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(transaction.amount)}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>{transaction.recipient?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === "completed" ? "default" : 
                            transaction.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          {transaction.status === "failed" && (
                            <Button size="sm" variant="outline">Retry</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutSchedule.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono">{payout.id}</TableCell>
                      <TableCell>{payout.users?.name || 'Unknown User'}</TableCell>
                      <TableCell className="font-semibold">{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(payout.amount)}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>{payout.sessions} sessions</TableCell>
                      <TableCell>{new Date(payout.scheduled_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payout.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Process Now</Button>
                          <Button size="sm" variant="outline">Modify</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          {/* ... reports content ... */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentTransactions;