import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, TrendingUp, AlertCircle, Download, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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

// PDF Generation Function
const generatePaymentReport = (
  transactions: Transaction[],
  totalCount: number,
  totalRevenue: number,
  pendingCount: number,
  failedCount: number
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('Payment Transactions Report', 20, 20);

  // Report Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 35);

  // Summary Statistics
  doc.setFontSize(16);
  doc.text('Summary Statistics', 20, 55);

  doc.setFontSize(12);
  doc.text(`Total Transactions: ${totalCount}`, 20, 70);
  doc.text(`Total Revenue: ${new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(totalRevenue)}`, 20, 80);
  doc.text(`Pending Transactions: ${pendingCount}`, 20, 90);
  doc.text(`Failed Transactions: ${failedCount}`, 20, 100);

  // Transactions Table
  const tableData = transactions.map(transaction => [
    transaction.id.slice(0, 8) + '...',
    transaction.user_name,
    transaction.type,
    transaction.description || 'N/A',
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(transaction.amount),
    transaction.status,
    new Date(transaction.created_at).toLocaleDateString()
  ]);

  doc.autoTable({
    head: [['ID', 'User', 'Type', 'Description', 'Amount', 'Status', 'Date']],
    body: tableData,
    startY: 120,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }

  // Save the PDF
  doc.save(`payment-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

// CSV Export Function
const exportTransactionsToCSV = async () => {
  try {
    // Fetch all transactions for export (not just paginated ones)
    const { data: allTransactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch user names for all transactions
    const transactionsWithNames = await Promise.all(
      (allTransactions || []).map(async (transaction) => {
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

    // Create CSV content
    const headers = ['Transaction ID', 'User', 'Type', 'Description', 'Amount', 'Status', 'Date', 'Payment ID'];
    const csvContent = [
      headers.join(','),
      ...transactionsWithNames.map(transaction => [
        `"${transaction.id}"`,
        `"${transaction.user_name}"`,
        `"${transaction.type}"`,
        `"${transaction.description || 'N/A'}"`,
        transaction.amount,
        `"${transaction.status}"`,
        `"${new Date(transaction.created_at).toLocaleString()}"`,
        `"${transaction.payment_id || 'N/A'}"`
      ].join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Failed to export CSV. Please try again.');
  }
};

const PaymentTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const transactionsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get total count and overview statistics
      const { data: allTransactions, error: allError, count } = await supabase
        .from('transactions')
        .select('amount, status', { count: 'exact' });

      if (allError) throw allError;

      // Calculate overview statistics
      const totalRevenueCalc = (allTransactions || []).reduce((sum, t) => sum + t.amount, 0);
      const pendingCountCalc = (allTransactions || []).filter(t => t.status === 'pending').length;
      const failedCountCalc = (allTransactions || []).filter(t => t.status === 'failed').length;

      setTotalCount(count || 0);
      setTotalRevenue(totalRevenueCalc);
      setPendingCount(pendingCountCalc);
      setFailedCount(failedCountCalc);

      // Fetch paginated transactions with user names
      const from = (currentPage - 1) * transactionsPerPage;
      const to = from + transactionsPerPage - 1;
      
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

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
      setTransactions(transactionsWithNames);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment data.');
      console.error('Error fetching payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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
        <div className="flex space-x-2">
          {/* <Button onClick={() => generatePaymentReport(transactions, totalCount, totalRevenue, pendingCount, failedCount)}>
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button> */}
          <Button onClick={exportTransactionsToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Total Transactions</p>
                <p className="text-2xl font-bold">{totalCount}</p>
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
                  {new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(totalRevenue)}
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
                <p className="text-2xl font-bold">{pendingCount}</p>
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
                <p className="text-2xl font-bold">{failedCount}</p>
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
                    {/* <TableHead>Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
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
                      {/* <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          {transaction.status === "failed" && (
                            <Button size="sm" variant="outline">Retry</Button>
                          )}
                        </div>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {Math.ceil(totalCount / transactionsPerPage)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === Math.ceil(totalCount / transactionsPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
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
                  Export your transaction data in CSV format or generate a comprehensive PDF report with statistics and transaction details.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={exportTransactionsToCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={() => generatePaymentReport(transactions, totalCount, totalRevenue, pendingCount, failedCount)}>
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
