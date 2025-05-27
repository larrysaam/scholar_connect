
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeedbackAreas = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Help Us Improve</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">What's Working Well?</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>• Easy job application process</li>
              <li>• Quick payment processing</li>
              <li>• Good communication tools</li>
              <li>• Helpful client matching</li>
            </ul>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium mb-2 text-orange-800">Areas for Enhancement</h4>
            <ul className="text-sm space-y-1 text-orange-700">
              <li>• Mobile app performance</li>
              <li>• Advanced search filters</li>
              <li>• Real-time notifications</li>
              <li>• Enhanced profile customization</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium mb-2 text-green-800">Your Voice Matters</h4>
          <p className="text-sm text-green-700">
            Every piece of feedback helps us create a better platform for research aids and clients. 
            We review all submissions and prioritize improvements based on user needs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackAreas;
