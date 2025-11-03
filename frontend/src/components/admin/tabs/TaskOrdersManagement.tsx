import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Clock, AlertTriangle, CheckCircle, RefreshCw, Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface JobApplicationWithDetails {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  updated_at: string;
  job: {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    currency: string;
    deadline?: string;
    user_id: string;
    status: string;
  };
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
}

interface Stats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  avgApplicationsPerJob: number;
}

const TaskOrdersManagement = () => {
  const [applications, setApplications] = useState<JobApplicationWithDetails[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    avgApplicationsPerJob: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timePeriodFilter, setTimePeriodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Helper function to get date range based on time period filter
  const getDateRange = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        return { 
          start: today.toISOString().split('T')[0] + 'T00:00:00.000Z',
          end: today.toISOString().split('T')[0] + 'T23:59:59.999Z'
        };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        return {
          start: weekStart.toISOString().split('T')[0] + 'T00:00:00.000Z',
          end: today.toISOString().split('T')[0] + 'T23:59:59.999Z'
        };
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: monthStart.toISOString().split('T')[0] + 'T00:00:00.000Z',
          end: today.toISOString().split('T')[0] + 'T23:59:59.999Z'
        };
      default:
        return null; // No date filter for 'all'
    }
  };
  // Fetch job applications data
  const fetchJobApplicationsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting database query...');
      console.log('Time period filter:', timePeriodFilter);
      
      // First, let's test basic connectivity by checking if tables exist
      console.log('Testing basic table access...');
      
      // Test 1: Check job_applications table directly
      const { data: testApps, error: testAppsError } = await supabase
        .from('job_applications')
        .select('*')
        .limit(5);
      
      console.log('Basic job_applications test:', { 
        count: testApps?.length || 0, 
        error: testAppsError?.message,
        data: testApps
      });

      // Test 2: Check jobs table
      const { data: testJobs, error: testJobsError } = await supabase
        .from('jobs')
        .select('*')
        .limit(5);
      
      console.log('Basic jobs test:', { 
        count: testJobs?.length || 0, 
        error: testJobsError?.message,
        data: testJobs?.slice(0, 2) // Just first 2 for brevity
      });

      // Test 3: Check users table
      const { data: testUsers, error: testUsersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);
      
      console.log('Basic users test:', { 
        count: testUsers?.length || 0, 
        error: testUsersError?.message,
        data: testUsers?.slice(0, 2) // Just first 2 for brevity
      });

      // If no applications exist, let's try without time filtering first
      console.log('Trying job applications query without time filter...');
      
      const { data: allAppsData, error: allAppsError } = await supabase
        .from('job_applications')
        .select(`
          id,
          job_id,
          applicant_id,
          cover_letter,
          status,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      console.log('All applications (no joins):', {
        count: allAppsData?.length || 0,
        error: allAppsError?.message,
        data: allAppsData
      });

      // Get date range for filtering
      const dateRange = getDateRange(timePeriodFilter);
      console.log('Date range for filter:', dateRange);
      
      // Build query for job applications with job and user details
      let query = supabase
        .from('job_applications')
        .select(`
          id,
          job_id,
          applicant_id,
          cover_letter,
          status,
          created_at,
          updated_at,
          job:jobs(
            id,
            title,
            description,
            category,
            budget,
            currency,
            deadline,
            user_id,
            status
          ),
          applicant:users!job_applications_applicant_id_fkey(
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Apply date range filter if specified
      if (dateRange) {
        console.log('Applying date filter:', dateRange);
        query = query
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data: applicationsData, error: applicationsError } = await query;
      
      console.log('Query result:', { applicationsData, applicationsError });
      console.log('Applications found:', applicationsData?.length || 0);
      
      if (applicationsError) throw applicationsError;

      // Get unique job client IDs and fetch client details
      const jobUserIds = [...new Set((applicationsData || [])
        .map(app => app.job?.user_id)
        .filter(Boolean))];      const { data: clientsData } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', jobUserIds);

      console.log('Job user IDs:', jobUserIds);
      console.log('Clients data:', clientsData);

      const clientsMap = new Map((clientsData || []).map(client => [client.id, client]));

      // Combine data
      const applicationsWithDetails = (applicationsData || []).map(app => ({
        ...app,
        client: clientsMap.get(app.job?.user_id) || { id: '', name: 'Unknown Client', email: '' }
      })) as JobApplicationWithDetails[];

      setApplications(applicationsWithDetails);

      // Calculate stats
      const totalApps = applicationsWithDetails.length;
      const pendingApps = applicationsWithDetails.filter(app => app.status === 'pending').length;
      const acceptedApps = applicationsWithDetails.filter(app => app.status === 'accepted').length;
      const rejectedApps = applicationsWithDetails.filter(app => app.status === 'rejected').length;
      
      // Get unique jobs count for average calculation
      const uniqueJobsCount = new Set(applicationsWithDetails.map(app => app.job_id)).size;
      const avgAppsPerJob = uniqueJobsCount > 0 ? totalApps / uniqueJobsCount : 0;

      setStats({
        totalApplications: totalApps,
        pendingApplications: pendingApps,
        acceptedApplications: acceptedApps,
        rejectedApplications: rejectedApps,
        avgApplicationsPerJob: Number(avgAppsPerJob.toFixed(1))
      });

    } catch (err: any) {
      console.error("Error fetching job applications:", err);
      setError(err.message || 'Failed to fetch job applications data');
    } finally {
      setLoading(false);
    }  };

  // Function to create test data
  const createTestData = async () => {
    setLoading(true);
    try {
      console.log('Creating test data...');
      
      // Create test users
      const testUsers = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'John Client',
          email: 'client@test.com',
          role: 'student'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002', 
          name: 'Jane Research Aid',
          email: 'aide@test.com',
          role: 'aid'
        }
      ];

      for (const user of testUsers) {
        const { error: userError } = await supabase
          .from('users')
          .upsert(user, { onConflict: 'id' });
        
        if (userError) {
          console.error('Error creating user:', user.name, userError);
        } else {
          console.log('Created/updated user:', user.name);
        }
      }

      // Create test job
      const testJob = {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: 'Research Paper Assistance',
        description: 'Need help with research methodology and data analysis',
        category: 'Research',
        budget: 500000,
        currency: 'XAF',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        status: 'active'
      };

      const { error: jobError } = await supabase
        .from('jobs')
        .upsert(testJob, { onConflict: 'id' });

      if (jobError) {
        console.error('Error creating job:', jobError);
      } else {
        console.log('Created job:', testJob.title);
      }

      // Create test job application
      const testApplication = {
        id: '550e8400-e29b-41d4-a716-446655440020',
        job_id: '550e8400-e29b-41d4-a716-446655440010',
        applicant_id: '550e8400-e29b-41d4-a716-446655440002',
        status: 'pending',
        cover_letter: 'I am very interested in helping with this research project. I have experience in research methodology and data analysis.'
      };

      const { error: appError } = await supabase
        .from('job_applications')
        .upsert(testApplication, { onConflict: 'id' });

      if (appError) {
        console.error('Error creating job application:', appError);
      } else {
        console.log('Created job application');
      }

      // Refresh the data
      await fetchJobApplicationsData();
      
    } catch (error) {
      console.error('Error creating test data:', error);
      setError('Failed to create test data: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobApplicationsData();
    setCurrentPage(1); // Reset pagination when filters change
  }, [timePeriodFilter]);

  useEffect(() => {
    fetchJobApplicationsData();
  }, []);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === "" || 
      app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Get badge variant for status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'withdrawn': return 'outline';
      default: return 'secondary';
    }
  };

  // Get priority applications (recent pending ones)
  const priorityApplications = applications
    .filter(app => app.status === 'pending')
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Job Applications Management</h2>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
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
        <h2 className="text-2xl font-bold">Job Applications Management</h2>
        <Button 
          variant="outline" 
          onClick={fetchJobApplicationsData} 
          disabled={loading}
          className="flex items-center gap-2"
        >          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
       
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by applicant, client, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timePeriodFilter} onValueChange={setTimePeriodFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>        </div>
      </div>

      

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
            <p className="text-xs text-muted-foreground">Successfully hired</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg/Job</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgApplicationsPerJob}</div>
            <p className="text-xs text-muted-foreground">Applications per job</p>
          </CardContent>
        </Card>
      </div>      <Tabs defaultValue="all-applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-applications">All Applications</TabsTrigger>
          <TabsTrigger value="pending-review">Pending Review</TabsTrigger>
          <TabsTrigger value="priority-alerts">Priority Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.applicant?.name || 'Unknown'}</TableCell>
                      <TableCell>{application.client?.name || 'Unknown'}</TableCell>
                      <TableCell className="max-w-xs truncate">{application.job?.title || 'Unknown Job'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{application.job?.category || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>{application.job?.budget?.toLocaleString()} {application.job?.currency || 'XAF'}</TableCell>
                      <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(application.status)}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              alert(`Application Details:\n\nApplicant: ${application.applicant?.name}\nJob: ${application.job?.title}\nCover Letter: ${application.cover_letter || 'No cover letter provided'}\nStatus: ${application.status}\nApplied: ${new Date(application.created_at).toLocaleDateString()}`);
                            }}
                          >
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {filteredApplications.length === 0 && applications.length > 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No applications match your current filters.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {applications.length === 0 && !loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No job applications found. Applications will appear here when research aids apply for jobs.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
                      {currentPage} / {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending-review" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Days Pending</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.filter(app => app.status === 'pending').map((application) => {
                    const daysPending = Math.floor((new Date().getTime() - new Date(application.created_at).getTime()) / (1000 * 3600 * 24));
                    return (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.applicant?.name || 'Unknown'}</TableCell>
                        <TableCell>{application.client?.name || 'Unknown'}</TableCell>
                        <TableCell className="max-w-xs truncate">{application.job?.title || 'Unknown Job'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{application.job?.category || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>{application.job?.budget?.toLocaleString()} {application.job?.currency || 'XAF'}</TableCell>
                        <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={daysPending > 7 ? "destructive" : daysPending > 3 ? "secondary" : "outline"}>
                            {daysPending} {daysPending === 1 ? 'day' : 'days'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Review</Button>
                            <Button size="sm" variant="outline">Contact</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {applications.filter(app => app.status === 'pending').length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No pending applications found.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="priority-alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Priority Alerts & Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityApplications.length > 0 ? (
                  priorityApplications.map((application) => {
                    const daysPending = Math.floor((new Date().getTime() - new Date(application.created_at).getTime()) / (1000 * 3600 * 24));
                    const isUrgent = daysPending > 7;
                    
                    return (
                      <div key={application.id} className={`p-4 border rounded-lg ${isUrgent ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isUrgent ? (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            )}
                            <div>
                              <h4 className="font-medium">{application.job?.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Applied by {application.applicant?.name} • {daysPending} days pending
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Escalate</Button>
                            <Button size="sm" variant={isUrgent ? "destructive" : "secondary"}>
                              {isUrgent ? 'Urgent Review' : 'Review'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>No priority alerts at the moment. All applications are being processed in a timely manner.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskOrdersManagement;
