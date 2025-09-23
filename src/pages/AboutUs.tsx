
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About ResearchWhoa</h1>
              <p className="text-xl text-blue-100">
                Empowering academic collaboration and research excellence across Africa
              </p>
            </div>
          </div>
        </section>
        
        {/* About Description */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 mb-8">
                ResearchWhoa is a revolutionary platform designed to bridge the gap between students, researchers, and academic experts across Africa and beyond. We facilitate meaningful collaborations that drive research excellence and academic success.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">Our Vision</h3>
                  <p className="text-gray-700">
                    To create a thriving academic ecosystem where knowledge flows freely, research barriers are eliminated, and every student has access to expert guidance regardless of their location or institution.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">Our Mission</h3>
                  <p className="text-gray-700">
                    To democratize access to research expertise, foster academic collaboration, and accelerate knowledge creation through innovative technology and community building.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">What We Offer</h2>
              <p className="text-lg text-gray-700 mb-12">
                ResearchWhoa provides a comprehensive platform where students can connect with experienced researchers and research aids for guidance, collaboration, and support throughout their academic journey. From research ideation to publication, we're here to help.
              </p>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">Accessibility</h3>
                  <p className="text-gray-700">
                    Making quality research support available to all students, regardless of their background or location.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">Integrity</h3>
                  <p className="text-gray-700">
                    Maintaining the highest standards of academic honesty and ethical research practices.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">Excellence</h3>
                  <p className="text-gray-700">
                    Connecting students with top-tier researchers and ensuring quality outcomes in all collaborations.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">Innovation</h3>
                  <p className="text-gray-700">
                    Leveraging cutting-edge technology to create new possibilities for academic collaboration.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">Collaboration</h3>
                  <p className="text-gray-700">
                    Fostering partnerships that lead to groundbreaking research and academic achievements.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">Empowerment</h3>
                  <p className="text-gray-700">
                    Providing students with the tools and connections they need to succeed in their academic pursuits.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
                <p className="text-blue-100 mb-6">
                  Be part of a growing community of researchers, students, and academic professionals working together to advance knowledge and create impact.
                </p>
                <div className="space-x-4">
                  <a href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Get Started
                  </a>
                  <a href="/contact" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                    Contact Us
                  </a>
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

export default AboutUs;
