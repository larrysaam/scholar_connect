
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, Shield } from "lucide-react";

const ValuePropositions = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ResearchWhoa Research Aids?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Precision Help, On-Demand</h3>
                <p className="text-gray-600">Get matched with statisticians, editors, GIS experts, and more — exactly when you need them.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Verified Experts Only</h3>
                <p className="text-gray-600">Every Research Aid is vetted based on academic credentials and relevant experience.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Seamless Collaboration</h3>
                <p className="text-gray-600">Chat, share files, and manage tasks directly on ResearchWhoa's secure platform.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;
