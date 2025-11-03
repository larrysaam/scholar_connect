import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, Eye } from "lucide-react";
import PostJobHeader from "@/components/dashboard/post-job/PostJobHeader";
import JobPostingForm from "@/components/dashboard/post-job/JobPostingForm";
import PostJobTips from "@/components/dashboard/post-job/PostJobTips";
import JobManagement from "@/components/dashboard/post-job/JobManagement";
import JobApplicationsManagement from "@/components/dashboard/post-job/JobApplicationsManagement"; // New import
import { useJobManagement } from "@/hooks/useJobManagement";

const PostJobTab = () => {
  const [activeTab, setActiveTab] = useState("post");
  const { jobs, loading } = useJobManagement();

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <PostJobHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10 gap-1 sm:gap-0">
          <TabsTrigger value="post" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Post New Job</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Manage Jobs ({jobs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Job Applications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <JobPostingForm />
          <PostJobTips />
        </TabsContent>

        <TabsContent value="manage" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <JobManagement />
        </TabsContent>

        <TabsContent value="applications" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <JobApplicationsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostJobTab;
