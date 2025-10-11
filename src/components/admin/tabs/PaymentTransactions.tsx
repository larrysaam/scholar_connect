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
  description: string | null;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  payment_id: string | null;
  user_name: string;
}

const PaymentTransactions = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

        console.log('Fetched transactions:', transactionsData);

      if (transactionsError) throw transactionsError;

      // Fetch user names for transactions
      const transactionsWithNames = await Promise.all(
        (transactionsData || []).map(async (transaction) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name')
            .eq('id', transaction.user_id)
            .single();

          return {
            ...transaction,
            user_name: userError ? 'Unknown User' : userData.name,
          };
        })
      );
      setRecentTransactions(transactionsWithNames);

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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Total Transactions</p>
                <p className="text-2xl font-bold">{recentTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(
                    recentTransactions.reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Pending</p>
                <p className="text-2xl font-bold">
                  {recentTransactions.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Failed</p>
                <p className="text-2xl font-bold">
                  {recentTransactions.filter(t => t.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
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
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">{transaction.id.slice(0, 8)}...</TableCell>
                      <TableCell>{transaction.user_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.type}</Badge>
                      </TableCell>
                      <TableCell>{transaction.description || 'N/A'}</TableCell>
                      <TableCell className="font-semibold">
                        {new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(transaction.amount)}
                      </TableCell>
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
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Financial reporting features will be available soon. This will include detailed analytics, export capabilities, and revenue tracking.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" disabled>
                    Generate Monthly Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentTransactions;
