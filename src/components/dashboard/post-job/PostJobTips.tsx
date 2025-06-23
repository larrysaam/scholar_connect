
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PostJobTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tips for Posting Great Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Be specific about your requirements and expectations</li>
          <li>• Include relevant files or examples when possible</li>
          <li>• Set a realistic budget and timeline</li>
          <li>• List all necessary skills and qualifications</li>
          <li>• Provide clear contact information if needed</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PostJobTips;
