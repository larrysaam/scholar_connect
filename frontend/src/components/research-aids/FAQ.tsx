
import { Card, CardContent } from "@/components/ui/card";

const FAQ = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Are these services allowed by my university?</h3>
                <p className="text-gray-600">Most universities allow academic support services like editing, statistical consultation, and data transcription. However, we recommend checking your institution's academic integrity policies to ensure compliance.</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">What if I'm not satisfied with the work?</h3>
                <p className="text-gray-600">We offer revision requests and our secure payment system ensures you only pay when satisfied. If issues persist, our support team will help resolve disputes fairly.</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">How secure are my documents and payments?</h3>
                <p className="text-gray-600">All file transfers are encrypted, payments are secured through our escrow system, and we maintain strict confidentiality agreements with all Research Aids.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
