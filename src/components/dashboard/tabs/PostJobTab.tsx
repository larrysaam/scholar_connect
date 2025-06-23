
import PostJobHeader from "@/components/dashboard/post-job/PostJobHeader";
import JobPostingForm from "@/components/dashboard/post-job/JobPostingForm";
import PostJobTips from "@/components/dashboard/post-job/PostJobTips";

const PostJobTab = () => {
  return (
    <div className="space-y-6">
      <PostJobHeader />
      <JobPostingForm />
      <PostJobTips />
    </div>
  );
};

export default PostJobTab;
