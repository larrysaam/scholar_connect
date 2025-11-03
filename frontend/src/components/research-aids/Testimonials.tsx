
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-700 mb-4">"My thesis transcription was done in 48 hours — affordable and high quality!"</p>
                <div className="flex items-center">
                  <User className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Dr. Marie Kouadio</p>
                    <p className="text-sm text-gray-500">PhD Student, University of Abidjan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-700 mb-4">"The statistician helped me correct my SPSS output and even explained it in simple terms."</p>
                <div className="flex items-center">
                  <User className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">James Osei</p>
                    <p className="text-sm text-gray-500">Research Fellow, University of Ghana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
