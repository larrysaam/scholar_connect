import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Your privacy matters to us. Learn how we protect your data.
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <p className="text-white font-medium">Data protection & transparency</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <p className="text-sm text-gray-600 mb-8 text-center">
                  Effective Date: October 1, 2025
                </p>

                <div className="prose prose-lg max-w-none">
                  <div className="border-l-4 border-blue-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                    <p className="text-gray-700 leading-relaxed">
                      ResearchWow ("ResearchWow", "we", "us" or "our") is committed to protecting your privacy and personal data. This Privacy Policy explains what information we collect, why we collect it, how we use it, how we share it, and the choices you have. By using ResearchWow you agree to the terms of this policy.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Information we collect</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">a) Personal information</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                          <li>Full name, email address, phone number</li>
                          <li>Academic institution, field of study, and profile information</li>
                          <li>PhD credentials or professional qualifications (for verified researchers)</li>
                          <li>Payment information: we do not store card details on our servers; payments are processed by third-party gateways (see Section 4).</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">b) Usage information</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                          <li>Session history, account activity, profile preferences, messages exchanged on the platform</li>
                          <li>Device/browser information, IP address, and location data inferred from IP</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">c) Cookies & tracking</h3>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        We use cookies and similar technologies to operate the site, remember preferences, and provide analytics. You can manage cookie preferences in your browser or via our cookie banner.
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How we use your information (purposes & lawful bases)</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">We use information to:</p>
                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Create, operate and manage user accounts (lawful basis: contract/necessary to provide service)</li>
                        <li>Match students with experts and schedule consultations (contract / legitimate interest)</li>
                        <li>Process and record payments (contract / legal obligation)</li>
                        <li>Communicate account notices, reminders, and security alerts (contract)</li>
                        <li>Send promotional emails where you have consented (consent — you can opt out)</li>
                        <li>Improve the platform and perform analytics (legitimate interest)</li>
                        <li>Comply with legal obligations (legal obligation)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing & third-parties</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">We do not sell personal data. We may share data with:</p>
                    <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Verified experts for consultation purposes (e.g., your name, research topic)</li>
                        <li>Payment processors (e.g., Mobile Money, Stripe). These providers process payment info according to their own policies; we recommend reviewing their privacy statements. We follow PCI-DSS or applicable standards via our providers.</li>
                        <li>Service providers (hosting, analytics, email delivery) under contract with confidentiality and security obligations.</li>
                        <li>Legal authorities if required by law or to protect rights.</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <strong>Note:</strong> We will maintain a current list of categories of processors on request.
                    </p>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">5. International transfers</h2>
                    <p className="text-gray-700 leading-relaxed">
                      ResearchWow is based in Cameroon and may transfer data to other countries. Where required by law, we will safeguard transfers using appropriate mechanisms (e.g., standard contractual clauses, adequacy decisions) and will notify users as necessary.
                    </p>
                  </div>

                  <div className="border-l-4 border-teal-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data retention</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We retain personal data only as long as necessary for the purposes described. Typical retention periods:
                    </p>
                    <div className="bg-teal-50 rounded-xl p-6 border-l-4 border-teal-500">
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Account data: while account is active and up to 24 months after last activity (unless a longer retention is required)</li>
                        <li>Payment and billing records: retained for X years to comply with tax and accounting obligations (replace X with local requirement)</li>
                        <li>Logs and backups: retained as required for security and operational purposes.</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Users may request deletion sooner (see Section 9).
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your rights</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">Depending on where you live, you may have rights including:</p>
                    <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Access, rectify or update your personal data</li>
                        <li>Request deletion (right to be forgotten)</li>
                        <li>Restrict or object to processing</li>
                        <li>Data portability (where applicable)</li>
                        <li>Withdraw consent at any time (for processing relying on consent)</li>
                        <li>Lodge a complaint with a supervisory authority</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <strong>Contact:</strong> To exercise rights, contact privacy@researchwow.com. We will verify identity before fulfilling sensitive requests.
                    </p>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children</h2>
                    <p className="text-gray-700 leading-relaxed">
                      ResearchWow is not intended for children under 16. We do not knowingly collect data from minors. If we learn we have collected a child's data we will delete it. Parents/guardians should contact us if they believe their child's data was collected.
                    </p>
                  </div>

                  <div className="border-l-4 border-cyan-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Security & breach notification</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We use administrative, physical and technical safeguards (for example, SSL/TLS in transit, encryption at rest where feasible, access controls, staff training, routine security assessments). No system is perfect; in case of a data breach we will notify affected users and regulators as required under applicable law without undue delay.
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies & tracking details</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We use essential cookies required for the service and optional cookies for analytics and marketing. Our cookie banner allows users to accept or reject non-essential cookies. See our Cookie Policy [link] for full details.
                    </p>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to this policy</h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may update this Policy. Material changes will be communicated via email and/or a notice on the platform. Continued use after the effective date means you accept the updated policy.
                    </p>
                  </div>

                  <div className="border-l-4 border-violet-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing law</h2>
                    <p className="text-gray-700 leading-relaxed">
                      This Policy and any dispute related to it are governed by the laws of Cameroon (or specify applicable jurisdiction).
                    </p>
                  </div>

                  <div className="border-l-4 border-rose-500 pl-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact us</h2>
                    <div className="bg-rose-50 rounded-xl p-6 border-l-4 border-rose-500">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Privacy email:</strong> privacy@researchwow.com<br />
                        <strong>Support:</strong> support@researchwow.com<br />
                        <strong>Phone:</strong> +237 674 511 174 / +237 687 082 958<br />
                        <strong>Address:</strong> Yaounde, Cameroon
                      </p>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <strong>Confirmation:</strong> By using ResearchWow you confirm you have read and understood this Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Questions about your privacy?</h3>
                  <p className="text-blue-100 mb-6 text-lg">
                    Our privacy team is here to help you understand how we protect your data.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:privacy@researchwow.com"
                      className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Contact Privacy Team
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

export default PrivacyPolicy;
