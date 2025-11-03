import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, TrendingUp, MessageSquare, Clock, DollarSign, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResearchAidsOverviewProps {
  setActiveTab: (tab: string) => void;
}

const ResearchAidsOverview = ({ setActiveTab }: ResearchAidsOverviewProps) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();

  // Real data state
  const [aidProfile, setAidProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    jobsInProgress: 0,
    newMessages: 0,
    totalEarnings: 0, // changed from earningsThisWeek
    profileViews: 0,
    rating: 0,
    totalJobs: 0,
    successRate: 0,
    name: '',
    avatar: '',
    title: '',
  });
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true); // Move isAvailable here for controlled state
  const [pendingAppointments, setPendingAppointments] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch user info
        const { data: userData } = await supabase
          .from('users')
          .select('id, name, avatar_url, email')
          .eq('id', user.id)
          .single();
        // Fetch research aid profile
        const { data: profileData } = await supabase
          .from('research_aid_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        // Fetch jobs in progress
        const { count: jobsInProgress } = await supabase
          .from('service_bookings')
          .select('id', { count: 'exact', head: true })
          .eq('provider_id', user.id)
          .eq('status', 'in_progress');
        // Fetch total jobs completed
        const { count: totalJobs } = await supabase
          .from('service_bookings')
          .select('id', { count: 'exact', head: true })
          .eq('provider_id', user.id)
          .eq('status', 'completed');
        // Fetch new messages (unread)
        let newMessages = 0;
        try {
          const { count } = await supabase
            .from('messages' as any)
            .select('id', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .is('read', false);
          newMessages = count || 0;
        } catch {
          newMessages = 0;
        }
        // Fetch earnings (total, not just this week)
        const { data: earningsRows } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('status', 'completed');
        const totalEarnings = (earningsRows || []).reduce((sum, row) => sum + (row.amount || 0), 0);
        // Profile views fallback (not in schema)
        const profileViews = 0;
        // Calculate success rate
        const successRate = totalJobs + jobsInProgress > 0 ? Math.round((totalJobs / (totalJobs + jobsInProgress)) * 100) : 0;
        // Fetch pending appointments count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('service_bookings')
          .select('id', { count: 'exact', head: true })
          .eq('provider_id', user.id)
          .eq('status', 'pending');
        if (!pendingError && typeof pendingCount === 'number') {
          setPendingAppointments(pendingCount);
        }
        setAidProfile(profileData);
        setStats({
          jobsInProgress: jobsInProgress || 0,
          newMessages: newMessages || 0,
          totalEarnings, // changed from earningsThisWeek
          profileViews,
          rating: profileData?.rating || 0,
          totalJobs: totalJobs || 0,
          successRate,
          name: userData?.name || '',
          avatar: userData?.avatar_url || '/placeholder-avatar.jpg',
          title: profileData?.title || '',
        });
        // Set availability from availability JSON if present
        if (profileData && profileData.availability && typeof profileData.availability === 'object' && 'isAvailable' in profileData.availability) {
          setIsAvailable(!!profileData.availability.isAvailable);
        }
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Handler to update availability in DB (store in availability JSON)
  const handleAvailabilityChange = async (checked: boolean) => {
    setIsAvailable(checked);
    if (!user) return;
    // Update in research_aid_profiles (store in availability JSON)
    const { error } = await supabase
      .from('research_aid_profiles')
      .update({ availability: { ...(aidProfile?.availability || {}), isAvailable: checked } })
      .eq('id', user.id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update availability', variant: 'destructive' });
    }
  };

  const getWelcomeMessage = () => {
    if (!profile?.name) return "Welcome!";
    
    const nameParts = profile.name.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    // Check for academic rank first (Professor takes precedence)
    if (profile.academic_rank && 
        (profile.academic_rank.includes('Professor') || 
         profile.academic_rank.includes('Prof'))) {
      return `Welcome, Prof. ${lastName}!`;
    }
    
    // Check for PhD/Postdoc in level_of_study or highest_education
    const hasPhD = profile.level_of_study?.toLowerCase().includes('phd') ||
                   profile.level_of_study?.toLowerCase().includes('postdoc') ||
                   profile.highest_education?.toLowerCase().includes('phd') ||
                   profile.highest_education?.toLowerCase().includes('postdoc');
    
    if (hasPhD) {
      return `Welcome, Dr. ${lastName}!`;
    }
    
    return `Welcome, ${lastName}!`;
  };

  const handleViewJobRequests = () => {
    setActiveTab("job-requests");
  };

  const handleCheckMessages = () => {
    setActiveTab("messages");
  };

  const handleUpdateProfile = () => {
    setActiveTab("profile-ratings");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card>        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.title && stats.name ? `Welcome, ${stats.title} ${stats.name}!` : getWelcomeMessage()}</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                You have <span className="font-semibold text-orange-600">{pendingAppointments} pending appointment{pendingAppointments === 1 ? '' : 's'}</span>.
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-sm font-medium">Available</span>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleAvailabilityChange}
                className="data-[state=checked]:bg-green-600"
              />
              <Badge variant={isAvailable ? "default" : "secondary"} className={isAvailable ? "bg-green-600" : ""}>
                {isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card>        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto sm:mx-0">
              <AvatarImage src={stats.avatar} alt={stats.name} />
              <AvatarFallback>{stats.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold">{stats.title ? `${stats.title} ${stats.name}` : stats.name}</h3>
              <p className="text-sm text-gray-600">{stats.title}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-lg font-semibold">{stats.rating}</span>
              </div>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
              <p className="text-sm text-gray-600">Total Jobs Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>      {/* Weekly Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jobs in Progress</p>
                <p className="text-2xl font-bold">{stats.jobsInProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Messages</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.newMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.totalEarnings} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.profileViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button className="w-full" onClick={handleViewJobRequests}>
              View Job Requests
            </Button>
            <Button variant="outline" className="w-full" onClick={handleCheckMessages}>
              Check Messages
            </Button>
            <Button variant="outline" className="w-full" onClick={handleUpdateProfile}>
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsOverview;
