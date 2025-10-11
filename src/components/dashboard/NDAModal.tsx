
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface NDAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const NDAModal = ({ isOpen, onClose, onAccept }: NDAModalProps) => {
  const [hasRead, setHasRead] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const { toast } = useToast();

  const handleAccept = () => {
    if (!hasRead || !hasAgreed) {
      toast({
        title: "Agreement Required",
        description: "Please read and agree to the terms before proceeding",
        variant: "destructive"
      });
      return;
    }

    onAccept();
    toast({
      title: "NDA Signed",
      description: "You have successfully signed the Non-Disclosure Agreement"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Non-Disclosure Agreement (NDA) - ResearchWow Platform
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. PURPOSE AND SCOPE</h3>
              <p className="text-gray-700 leading-relaxed">
                This Non-Disclosure Agreement ("Agreement") is entered into by and between ResearchWow 
                ("Platform") and the Research Aid ("Recipient") to protect confidential and proprietary 
                information shared through the platform during research collaboration services.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. DEFINITION OF CONFIDENTIAL INFORMATION</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Confidential Information includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Research data, methodologies, and findings</li>
                <li>Unpublished manuscripts, proposals, and academic materials</li>
                <li>Personal information of students and researchers</li>
                <li>Financial information and payment details</li>
                <li>Platform proprietary technology and algorithms</li>
                <li>Client lists and contact information</li>
                <li>Any information marked as confidential or that would reasonably be considered confidential</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. OBLIGATIONS OF RESEARCH AID</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                The Research Aid agrees to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Maintain strict confidentiality of all information received</li>
                <li>Use confidential information solely for the purpose of providing research services</li>
                <li>Not disclose confidential information to any third party without prior written consent</li>
                <li>Implement reasonable security measures to protect confidential information</li>
                <li>Return or destroy all confidential materials upon request or termination of services</li>
                <li>Report any suspected breaches of confidentiality immediately</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. EXCEPTIONS</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                This Agreement does not apply to information that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Is publicly available at the time of disclosure</li>
                <li>Becomes publicly available through no breach of this Agreement</li>
                <li>Is independently developed without use of confidential information</li>
                <li>Is required to be disclosed by law or court order (with prior notice to the disclosing party)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. INTELLECTUAL PROPERTY</h3>
              <p className="text-gray-700 leading-relaxed">
                All intellectual property rights in confidential information remain with the original owner. 
                No license or rights are granted except as explicitly stated in separate agreements. 
                Research Aids acknowledge that they do not acquire any ownership rights to client materials or research data.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. DATA PROTECTION AND PRIVACY</h3>
              <p className="text-gray-700 leading-relaxed">
                Research Aids must comply with all applicable data protection laws and regulations, including 
                but not limited to GDPR where applicable. Personal data must be processed lawfully, fairly, 
                and in a transparent manner, and only for the specific purposes of providing research services.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. CONSEQUENCES OF BREACH</h3>
              <p className="text-gray-700 leading-relaxed">
                Any breach of this Agreement may result in immediate termination from the platform, 
                legal action for damages, and injunctive relief. Research Aids acknowledge that monetary 
                damages may be inadequate and that equitable relief may be sought.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. TERM AND TERMINATION</h3>
              <p className="text-gray-700 leading-relaxed">
                This Agreement remains in effect for the duration of the Research Aid's participation 
                on the platform and for a period of 3 years following termination. Confidentiality 
                obligations survive termination of this Agreement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. GOVERNING LAW</h3>
              <p className="text-gray-700 leading-relaxed">
                This Agreement is governed by the laws of Cameroon. Any disputes arising from this 
                Agreement shall be resolved through binding arbitration in Yaoundé, Cameroon.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. ACKNOWLEDGMENT</h3>
              <p className="text-gray-700 leading-relaxed">
                By signing this Agreement, the Research Aid acknowledges that they have read, understood, 
                and agree to be bound by all terms and conditions set forth herein.
              </p>
            </section>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Important Notice:</strong> This is a legally binding agreement. By accepting these terms, 
                you acknowledge that you understand your obligations regarding confidentiality and data protection. 
                Violation of this agreement may result in legal consequences and immediate removal from the platform.
              </p>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="has-read" 
              checked={hasRead} 
              onCheckedChange={(checked) => setHasRead(checked as boolean)}
            />
            <label htmlFor="has-read" className="text-sm">
              I have read and understood the entire Non-Disclosure Agreement
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="has-agreed" 
              checked={hasAgreed} 
              onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
            />
            <label htmlFor="has-agreed" className="text-sm">
              I agree to be bound by the terms and conditions of this NDA
            </label>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAccept}
              disabled={!hasRead || !hasAgreed}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Accept and Continue
            </Button>
          </div>
        </div>
        </ScrollArea>

        
      </DialogContent>
    </Dialog>
  );
};

export default NDAModal;
