import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  userRole: string;
}

const TermsAndConditionsModal = ({ isOpen, onAccept, userRole }: TermsAndConditionsModalProps) => {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAcceptTerms = async () => {
    if (!hasReadTerms) {
      toast({
        title: "Please read and accept the terms",
        description: "You must read and accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('users')
          .update({ 
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating terms acceptance:', error);
          toast({
            title: "Error",
            description: "Failed to save terms acceptance. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }

      toast({
        title: "Terms Accepted",
        description: "Thank you for accepting our terms and conditions.",
      });
      onAccept();
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-center">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription className="text-center">
            Please read and accept our terms and conditions to continue using ResearchTandem
          </DialogDescription>
        </DialogHeader>        
        <div 
          className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
          style={{ maxHeight: 'calc(85vh - 200px)' }}
        >
          <div className="space-y-6 text-sm text-gray-700 pb-4">
            <div className="text-center mb-6">
              <p className="text-base font-medium text-gray-900">
                Welcome to ResearchTandem – a platform that connects students with researchers and research aids for thesis and academic support. By using ResearchTandem, you agree to the following Terms and Conditions. Please read them carefully.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">1. Who Can Use ResearchTandem</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Students:</strong> Must be at least 16 years old.</li>
                <li><strong>Researchers:</strong> Must hold a PhD (or equivalent) and provide verifiable proof of qualifications.</li>
                <li><strong>Research Aids:</strong> Must have the technical skills to support tasks like data analysis, cartography, formatting, proofreading, and similar research-related work.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">2. What ResearchTandem Provides</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>A safe space to book consultations with verified researchers.</li>
                <li>Access to research aids for specific tasks that support, but do not replace, your own academic work.</li>
                <li>Online sessions via video/audio calls or task submissions through the platform.</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mt-3">
                <p className="text-yellow-800 font-medium">
                  <strong>Important:</strong> ResearchTandem does not allow ghostwriting or unethical academic assistance. Our role is to support learning, not to replace it.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">3. Bookings & Payments</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>All bookings are prepaid through our secure system (Mobile Money, Orange Money, debit/credit card).</li>
                <li>Payments are held in escrow until the service is delivered.</li>
                <li>Researchers and Aids set their own rates within platform guidelines.</li>
                <li>ResearchTandem charges a 15% service fee on each transaction.</li>
                <li>Experts are paid within 2–3 working days after service completion.</li>
                <li>Taxes are the responsibility of the experts receiving payment.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">4. Cancellations & Refunds</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Cancel at least 6 hours before your session for a full refund.</li>
                <li>Cancellations less than 6 hours before are non-refundable (unless due to a verified emergency).</li>
                <li>If a Researcher or Aid does not show up, students get a full refund. Repeat no-shows may lead to expert removal.</li>
                <li>If a student does not show up, the session is non-refundable.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">5. Code of Conduct</h3>
              
              <h4 className="font-medium mb-2">For Students</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Be respectful and professional.</li>
                <li>Do not request unethical help (e.g., "write my thesis").</li>
                <li>Keep all communication within ResearchTandem.</li>
              </ul>

              <h4 className="font-medium mb-2">For Researchers</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Provide evidence-based, ethical guidance.</li>
                <li>Be punctual and prepared.</li>
                <li>Do not promote services outside the platform.</li>
              </ul>

              <h4 className="font-medium mb-2">For Research Aids</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Deliver tasks on time and to agreed standards.</li>
                <li>Maintain accuracy and confidentiality.</li>
                <li>Do not subcontract or share student work outside ResearchTandem.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">6. Ownership of Work</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Students own the outputs they pay for (e.g., data analysis results, maps, formatted documents).</li>
                <li>Research Aids and Researchers retain ownership of their methods, tools, or templates used to create the work.</li>
                <li>All work must remain confidential and may not be shared, sold, or reused without permission.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">7. Dispute Resolution</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>If you are unhappy with a service, you can raise a complaint within 48 hours of delivery.</li>
                <li>ResearchTandem will review evidence from both sides and make a final decision (refund, partial refund, or release of funds).</li>
                <li>Our decision will be binding to keep the system fair.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">8. Integrity & Fair Use</h3>
              <p className="mb-4">
                ResearchTandem is for learning support only. Misuse (plagiarism, academic dishonesty, or bypassing the platform to pay experts directly) may lead to suspension or termination.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">9. Privacy & Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>We collect only necessary personal data (name, email, academic field, etc.) to provide services.</li>
                <li>Data is stored securely and never sold to third parties.</li>
                <li>For more details, see our Privacy Policy.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">10. Liability</h3>
              <p className="mb-2">ResearchTandem is not responsible for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The academic outcome of your work (grades, thesis acceptance, defense results).</li>
                <li>Internet or technical failures during sessions.</li>
                <li>Advice quality beyond what is reasonably expected from verified experts.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">11. Changes to These Terms</h3>
              <p className="mb-4">
                We may update these Terms from time to time. You will be notified through email or platform alerts. Continued use means you agree to the new Terms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">12. Contact Us</h3>
              <p className="mb-2">For questions or support:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email: support@ResearchTandem.com</li>
                <li>Tel: +237 674 511 174 / +237 687 082 958</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <p className="text-sm text-blue-800 font-medium">
                Effective Date: October 1, 2025
              </p>
              <p className="text-sm text-blue-700 mt-2">
                By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 px-6 pb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="terms-checkbox"
              checked={hasReadTerms}
              onCheckedChange={(checked) => setHasReadTerms(checked === true)}
            />
            <label 
              htmlFor="terms-checkbox" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and accept the Terms and Conditions
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              onClick={handleAcceptTerms}
              disabled={!hasReadTerms || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isLoading ? "Accepting..." : "I Accept"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsModal;
