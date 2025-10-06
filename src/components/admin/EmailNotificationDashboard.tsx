import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  BarChart, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Activity,
  RefreshCw,
  Download
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailSystemTester, EmailSystemTestPanel } from '@/utils/emailSystemTester';

interface EmailStats {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  last24Hours: number;
  last7Days: number;
  byTemplate: { [key: string]: number };
  recentLogs: EmailLog[];
}

interface EmailLog {
  id: string;
  email: string;
  subject: string;
  notification_type: string;
  template_used: string;
  sent_at: string;
  success: boolean;
  error_message?: string;
  metadata?: any;
}

interface UserEmailPreferences {
  userId: string;
  userName: string;
  email: string;
  emailNotifications: boolean;
  consultationNotifications: boolean;
  paymentNotifications: boolean;
  jobNotifications: boolean;
  collaborationNotifications: boolean;
}

const EmailNotificationDashboard: React.FC = () => {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserEmailPreferences[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchEmailStats();
    fetchUserPreferences();
  }, []);

  const fetchEmailStats = async () => {
    try {
      setLoading(true);

      // Fetch email logs
      const { data: logs, error: logsError } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      // Calculate statistics
      const totalSent = logs?.length || 0;
      const totalFailed = logs?.filter(log => !log.success).length || 0;
      const successRate = totalSent > 0 ? ((totalSent - totalFailed) / totalSent) * 100 : 0;

      // Last 24 hours
      const last24Hours = logs?.filter(log => {
        const logDate = new Date(log.sent_at);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return logDate > dayAgo;
      }).length || 0;

      // Last 7 days
      const last7Days = logs?.filter(log => {
        const logDate = new Date(log.sent_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return logDate > weekAgo;
      }).length || 0;

      // By template
      const byTemplate: { [key: string]: number } = {};
      logs?.forEach(log => {
        const template = log.template_used || 'unknown';
        byTemplate[template] = (byTemplate[template] || 0) + 1;
      });

      // Recent logs
      const recentLogs = logs?.slice(0, 10) || [];

      setStats({
        totalSent,
        totalFailed,
        successRate,
        last24Hours,
        last7Days,
        byTemplate,
        recentLogs
      });

    } catch (error: any) {
      console.error('Error fetching email stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, notification_preferences')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const preferences: UserEmailPreferences[] = users?.map(user => {
        const prefs = user.notification_preferences || {};
        return {
          userId: user.id,
          userName: user.name || 'Unknown User',
          email: user.email,
          emailNotifications: prefs.email_notifications !== false,
          consultationNotifications: prefs.consultation_notifications !== false,
          paymentNotifications: prefs.payment_notifications !== false,
          jobNotifications: prefs.job_notifications !== false,
          collaborationNotifications: prefs.collaboration_notifications !== false
        };
      }) || [];

      setUserPreferences(preferences);
    } catch (error: any) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const refreshData = () => {
    fetchEmailStats();
    fetchUserPreferences();
  };

  const exportEmailLogs = async () => {
    try {
      const { data: logs, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;

      // Convert to CSV
      const headers = ['Date', 'Email', 'Subject', 'Type', 'Template', 'Success', 'Error'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.sent_at,
          log.email,
          `"${log.subject}"`,
          log.notification_type,
          log.template_used,
          log.success ? 'Yes' : 'No',
          log.error_message || ''
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Email logs exported successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to export email logs",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Email Notification Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportEmailLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSent || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.last24Hours || 0} in last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successRate.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalFailed || 0} failed emails
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Volume</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.last7Days || 0}</div>
            <p className="text-xs text-muted-foreground">
              Emails sent this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPreferences.length}</div>
            <p className="text-xs text-muted-foreground">
              {userPreferences.filter(u => u.emailNotifications).length} subscribed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          <TabsTrigger value="testing">System Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Email Templates Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats?.byTemplate || {}).map(([template, count]) => (
                    <div key={template} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{template}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Email Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recentLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{log.subject}</p>
                          <p className="text-xs text-muted-foreground">{log.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.sent_at).toLocaleString()}
                        </p>
                        <Badge variant={log.success ? "default" : "destructive"} className="text-xs">
                          {log.template_used}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.sent_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{log.email}</TableCell>
                      <TableCell className="text-sm">{log.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.template_used}</Badge>
                      </TableCell>
                      <TableCell>
                        {log.success ? (
                          <Badge variant="default">Sent</Badge>
                        ) : (
                          <Badge variant="destructive" title={log.error_message}>
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'consultation_confirmed', title: 'Consultation Confirmed', description: 'Sent when a booking is confirmed' },
              { name: 'payment_received', title: 'Payment Received', description: 'Sent when payment is processed' },
              { name: 'job_application_accepted', title: 'Job Application Accepted', description: 'Sent when application is approved' },
              { name: 'coauthor_invitation', title: 'Coauthor Invitation', description: 'Sent for collaboration invites' },
              { name: 'booking_reminder', title: 'Booking Reminder', description: 'Automated reminder emails' },
              { name: 'generic', title: 'Generic Template', description: 'For custom notifications' }
            ].map((template) => (
              <Card key={template.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {stats?.byTemplate[template.name] || 0} sent
                    </Badge>
                    <Badge variant="outline">{template.name}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Email Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>All Emails</TableHead>
                    <TableHead>Consultations</TableHead>
                    <TableHead>Payments</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Collaborations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPreferences.slice(0, 20).map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.emailNotifications ? "default" : "secondary"}>
                          {user.emailNotifications ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.consultationNotifications ? "default" : "secondary"}>
                          {user.consultationNotifications ? "✓" : "✗"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.paymentNotifications ? "default" : "secondary"}>
                          {user.paymentNotifications ? "✓" : "✗"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.jobNotifications ? "default" : "secondary"}>
                          {user.jobNotifications ? "✓" : "✗"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.collaborationNotifications ? "default" : "secondary"}>
                          {user.collaborationNotifications ? "✓" : "✗"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <EmailSystemTestPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailNotificationDashboard;
