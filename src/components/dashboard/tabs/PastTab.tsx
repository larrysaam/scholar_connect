
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pastConsultations } from "../mockData";

const PastTab = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Past Consultations</h2>
      
      {pastConsultations.map((consultation) => (
        <Card key={consultation.id} className="mb-6 last:mb-0">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img 
                    src={consultation.researcher.imageUrl} 
                    alt={consultation.researcher.name}
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{consultation.researcher.name}</CardTitle>
                  <CardDescription>{consultation.researcher.field}</CardDescription>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{consultation.date}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{consultation.time}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium">Topic:</p>
              <p className="text-gray-700">{consultation.topic}</p>
            </div>
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="font-medium">Session Notes:</p>
              <p className="text-gray-700 text-sm">{consultation.notes}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" size="sm">Download Notes</Button>
            <Button size="sm">Book Again</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PastTab;
