import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsOfService = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-pulse">
                Terms of Service
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Please read these terms carefully before using our platform
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <p className="text-white font-medium">Your research journey starts here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <p className="text-sm text-gray-600 mb-8 text-center">
                  Effective Date: October 1, 2025
                </p>

                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-8 text-center font-medium">
                    Welcome to ResearchTandem – a platform that connects students with researchers and research aids for thesis and academic support. By using ResearchTandem, you agree to the following Terms and Conditions. Please read them carefully.
                  </p>

                  <div className="space-y-12">
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Who Can Use ResearchTandem</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Students:</strong> Must be at least 16 years old.</li>
                        <li><strong>Researchers:</strong> Must hold a PhD (or equivalent) and provide verifiable proof of qualifications.</li>
                        <li><strong>Research Aids:</strong> Must have the technical skills to support tasks like data analysis, cartography, formatting, proofreading, and similar research-related work.</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">2. What ResearchTandem Provides</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                        <li>A safe space to book consultations with verified researchers.</li>
                        <li>Access to research aids for specific tasks that support, but do not replace, your own academic work.</li>
                        <li>Online sessions via video/audio calls or task submissions through the platform.</li>
                      </ul>
                      <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <strong>Important:</strong> ResearchTandem does not allow ghostwriting or unethical academic assistance. Our role is to support learning, not to replace it.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bookings & Payments</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>All bookings are prepaid through our secure system (Mobile Money, Orange Money, debit/credit card).</li>
                        <li>Payments are held in escrow until the service is delivered.</li>
                        <li>Researchers and Aids set their own rates within platform guidelines.</li>
                        <li>ResearchTandem charges a 15% service fee on each transaction.</li>
                        <li>Experts are paid within 2–3 working days after service completion.</li>
                        <li>Taxes are the responsibility of the experts receiving payment.</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-red-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cancellations & Refunds</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Cancel at least 6 hours before your session for a full refund.</li>
                        <li>Cancellations less than 6 hours before are non-refundable (unless due to a verified emergency).</li>
                        <li>If a Researcher or Aid does not show up, students get a full refund. Repeat no-shows may lead to expert removal.</li>
                        <li>If a student does not show up, the session is non-refundable.</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-indigo-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Code of Conduct</h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-3">For Students</h3>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Be respectful and professional.</li>
                            <li>Do not request unethical help (e.g., "write my thesis").</li>
                            <li>Keep all communication within ResearchTandem.</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-3">For Researchers</h3>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Provide evidence-based, ethical guidance.</li>
                            <li>Be punctual and prepared.</li>
                            <li>Do not promote services outside the platform.</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-3">For Research Aids</h3>
                          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Deliver tasks on time and to agreed standards.</li>
                            <li>Maintain accuracy and confidentiality.</li>
                            <li>Do not subcontract or share student work outside ResearchTandem.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-teal-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Ownership of Work</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Students own the outputs they pay for (e.g., data analysis results, maps, formatted documents).</li>
                        <li>Research Aids and Researchers retain ownership of their methods, tools, or templates used to create the work.</li>
                        <li>All work must remain confidential and may not be shared, sold, or reused without permission.</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Dispute Resolution</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>If you are unhappy with a service, you can raise a complaint within 48 hours of delivery.</li>
                        <li>ResearchTandem will review evidence from both sides and make a final decision (refund, partial refund, or release of funds).</li>
                        <li>Our decision will be binding to keep the system fair.</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Integrity & Fair Use</h2>
                      <p className="text-gray-700 leading-relaxed">
                        ResearchTandem is for learning support only. Misuse (plagiarism, academic dishonesty, or bypassing the platform to pay experts directly) may lead to suspension or termination.
                      </p>
                    </div>

                    <div className="border-l-4 border-cyan-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy & Data</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>We collect only necessary personal data (name, email, academic field, etc.) to provide services.</li>
                        <li>Data is stored securely and never sold to third parties.</li>
                        <li>For more details, see our Privacy Policy.</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-gray-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Liability</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">ResearchTandem is not responsible for:</p>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>The academic outcome of your work (grades, thesis acceptance, defense results).</li>
                        <li>Internet or technical failures during sessions.</li>
                        <li>Advice quality beyond what is reasonably expected from verified experts.</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-emerald-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to These Terms</h2>
                      <p className="text-gray-700 leading-relaxed">
                        We may update these Terms from time to time. You will be notified through email or platform alerts. Continued use means you agree to the new Terms.
                      </p>
                    </div>

                    <div className="border-l-4 border-violet-500 pl-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                      <p className="text-gray-700 leading-relaxed">
                        For questions or support:<br />
                        Email: support@ResearchTandem.com<br />
                        Tel: +237 674 511 174 / +237 687 082 958
                      </p>
                    </div>
                  </div>

                  {/* Pricing Policy Annex */}
                  <div className="mt-16 pt-12 border-t-2 border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">ResearchTandem Pricing Policy Annex</h2>
                    <p className="text-sm text-gray-600 mb-8 text-center">
                      Effective Date: October 1, 2025
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-8 text-center font-medium">
                      This Pricing Policy explains how fees are set and charged on ResearchTandem. It applies to all students, researchers, and research aids using the platform.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">1. General Rules</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                          <li><strong>Transparency:</strong> Students always see the price before booking.</li>
                          <li><strong>Flexibility:</strong> Researchers and Aids set their own rates within platform-approved ranges.</li>
                          <li><strong>Security:</strong> Payments are prepaid and released only after the service is completed.</li>
                          <li><strong>Platform Fee:</strong> ResearchTandem charges a 15% commission on each successful transaction.</li>
                          <li><strong>Currency:</strong> All prices are listed in Central African CFA francs (XAF).</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Standard Pricing Ranges</h3>
                        <div className="space-y-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-700">A. Consultation Sessions (Researchers)</h4>
                            <p className="text-gray-600">6,000 – 10,000 XAF (per 30-60 min session)</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">B. Chapter Review Services</h4>
                            <p className="text-gray-600">10,000 – 30,000 XAF (per chapter)</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">C. Full Thesis Review</h4>
                            <p className="text-gray-600">40,000 – 180,000 XAF</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">D. Full Thesis Cycle Support</h4>
                            <p className="text-gray-600">70,000 – 320,000 XAF</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">E. Research Aid Services</h4>
                            <p className="text-gray-600">2,000 – 40,000 XAF (task-based)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Notes & Special Conditions</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                        <li><strong>Complexity & Page Count:</strong> More technical work may be priced at the higher end.</li>
                        <li><strong>Urgency:</strong> Express requests may attract a 10–25% surcharge.</li>
                        <li><strong>Free Services:</strong> Experts may offer free sessions at their discretion.</li>
                        <li><strong>No Hidden Fees:</strong> What you see before booking is exactly what you pay.</li>
                      </ul>
                    </div>

                    <div className="mt-8 text-center">
                      <p className="text-gray-600 text-sm">
                        This Pricing Policy may be updated from time to time. The latest version will always be available on the ResearchTandem platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Questions about our Terms?</h3>
                  <p className="text-blue-100 mb-6 text-lg">
                    Our support team is here to help clarify any aspect of our Terms of Service.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:support@ResearchTandem.com"
                      className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Email Support
                    </a>
                    <div className="text-blue-100">
                      <p className="font-medium">Phone: +237 674 511 174</p>
                      <p className="text-sm opacity-90">Available Mon-Fri, 9AM-6PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
