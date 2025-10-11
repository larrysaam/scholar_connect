import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const FAQ = () => {
  const { t } = useLanguage();

  // State for accordion items (17 Q&As)
  const [openItems, setOpenItems] = useState<boolean[]>(new Array(17).fill(false));
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = (index: number) => {
    setOpenItems(prev => prev.map((item, i) => i === index ? !item : item));
  };

  const faqData = [
    {
      section: "About the Platform",
      items: [
        {
          question: "What is ResearchWow?",
          answer: "ResearchWow is an online platform that connects students with verified PhD-level research experts for one-on-one virtual consultations and Research Aids for task-based thesis support. It's designed to support academic writing, research design, data analysis, and more."
        },
        {
          question: "Who are the experts on the platform?",
          answer: "All experts are PhD holders with proven research experience. They are carefully vetted and verified before being listed on ResearchWow."
        },
        {
          question: "Can I choose my own expert?",
          answer: "Yes. You can browse expert profiles based on expertise, availability, and reviews — or request a recommended match based on your topic."
        }
      ]
    },
    {
      section: "Research Consultation",
      items: [
        {
          question: "What happens during a session?",
          answer: "Each session is a personalized consultation. Depending on your need, the expert can help with topic selection, structuring your thesis, research methods, literature review, referencing, or feedback on your draft."
        },
        {
          question: "How long is a session?",
          answer: "Sessions typically last 30 to 60 minutes. You can choose the duration based on the expert's availability and your needs."
        },
        {
          question: "Are sessions recorded?",
          answer: "No. To protect user privacy, sessions are not recorded. However, you may request a written summary from the expert after the session."
        }
      ]
    },
    {
      section: "Pricing & Payment",
      items: [
        {
          question: "How much does a session cost?",
          answer: "Session rates range from 6,000 XAF to 320,000 XAF, depending on the expert and the service. The price is displayed before booking."
        },
        {
          question: "How is payment made?",
          answer: "We accept Mobile Money (MTN, Orange), and Visa/MasterCard. Payment is processed securely via our platform."
        },
        {
          question: "Is there a subscription or hidden fee?",
          answer: "No subscription is required. ResearchWow charges a flat 15 percent commission per session, already included in the expert's rate."
        }
      ]
    },
    {
      section: "Account & Booking",
      items: [
        {
          question: "Do I need to create an account to use ResearchWow?",
          answer: "Yes. Creating an account helps us tailor recommendations, manage bookings, and ensure secure transactions."
        },
        {
          question: "How do I schedule a session?",
          answer: "After creating an account, browse or search for an expert, select a time slot, and make payment to confirm the session."
        },
        {
          question: "Can I cancel or reschedule a session?",
          answer: "Yes. You can cancel or reschedule up to 12 hours before the session. Late cancellations may not be refunded."
        }
      ]
    },
    {
      section: "Technical & Support",
      items: [
        {
          question: "What if I have technical issues during a session?",
          answer: "If you're unable to connect or experience a platform error, our support team will reschedule your session at no extra cost."
        },
        {
          question: "Is ResearchWow available in other countries?",
          answer: "Yes. ResearchWow is accessible globally, but payment options may vary outside Cameroon."
        },
        {
          question: "How do I contact support?",
          answer: "You can email us at support@ResearchWow.com or use the in-platform chat for help."
        }
      ]
    },
    {
      section: "Trust & Security",
      items: [
        {
          question: "Is my information safe?",
          answer: "Absolutely. We use industry-standard encryption and do not share your personal data with third parties. View our Privacy Policy."
        },
        {
          question: "Are the experts reliable?",
          answer: "Yes. All experts are PhD holders with verifiable credentials. Users also rate and review them after sessions to ensure accountability."
        }
      ]
    }
  ];

  const filteredFaqData = faqData.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

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
                Frequently Asked Questions
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Find answers to common questions about ResearchWow
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <p className="text-white font-medium">Your research journey starts here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="mb-12">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* How ResearchWow Works */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How ResearchWow Works</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Get started with our simple 6-step process to connect with expert researchers
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Sign up & verify", desc: "Create your account and verify your email to get started with ResearchWow.", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
                    { title: "Find an expert", desc: "Browse expert profiles based on your research topic, expertise, and reviews.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                    { title: "Book & pay", desc: "Select a convenient time slot and complete secure payment to confirm.", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                    { title: "Attend session", desc: "Join your personalized virtual consultation with the expert.", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
                    { title: "Post-session", desc: "Receive session summaries, materials, and follow-up support.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                    { title: "Support & follow-up", desc: "Rate your experience and get ongoing support for your research.", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" }
                  ].map((step, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4 group-hover:animate-pulse">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Sections */}
              <div className="space-y-8">
                {filteredFaqData.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                      <h2 className="text-2xl font-bold text-white">{section.section}</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {section.items.map((item, itemIndex) => {
                        const globalIndex = faqData.slice(0, sectionIndex).reduce((acc, s) => acc + s.items.length, 0) + itemIndex;
                        return (
                          <div key={itemIndex} className="group">
                            <button
                              className="w-full text-left px-8 py-6 focus:outline-none focus:bg-blue-50 hover:bg-blue-50 transition-all duration-200 group-hover:shadow-sm"
                              onClick={() => toggleItem(globalIndex)}
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-blue-700 transition-colors">
                                  {item.question}
                                </h4>
                                <div className="flex-shrink-0">
                                  <svg
                                    className={`w-6 h-6 text-blue-600 transform transition-transform duration-300 ${openItems[globalIndex] ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems[globalIndex] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="px-8 pb-6">
                                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                                  <p className="text-gray-700 leading-relaxed">
                                    {item.answer}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                  <p className="text-blue-100 mb-6 text-lg">
                    Our support team is here to help you succeed in your research journey.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:support@ResearchWow.com"
                      className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
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

export default FAQ;
