
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About ScholarConnect</h1>
              <p className="text-xl text-emerald-100">
                Bridging the gap in research guidance to elevate research quality, mentorship, and academic excellence
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
                ScholarConnect is a digital platform where researchers, students, and lecturers connect for paid, flexible research and thesis defense consultations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-emerald-700 mb-4">Our Vision</h3>
                  <p className="text-gray-700">
                    To become Africa's leading academic support platform, empowering every student to conduct impactful research, access expert mentorship, and confidently defend their work in a digitally inclusive environment.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-emerald-700 mb-4">Our Mission</h3>
                  <p className="text-gray-700">
                    To provide a full-spectrum academic ecosystem that connects students with expert researchers to elevate research quality, mentorship, and academic excellence across the continent.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Value Proposition</h2>
              <p className="text-lg text-gray-700 mb-12">
                Empowering students to move from research ideation to confident project defense while enabling institutions to digitise and standardise mentorship and evaluation.
              </p>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="p-6 border rounded-lg bg-emerald-50">
                  <h3 className="font-semibold text-lg text-emerald-700 mb-3">Access</h3>
                  <p className="text-gray-700">
                    We believe every student, regardless of background or location, deserves access to quality academic support.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-emerald-50">
                  <h3 className="font-semibold text-lg text-emerald-700 mb-3">Integrity</h3>
                  <p className="text-gray-700">
                    We promote honest, ethical academic collaboration and mentorship, upholding academic integrity at every level.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-emerald-50">
                  <h3 className="font-semibold text-lg text-emerald-700 mb-3">Excellence</h3>
                  <p className="text-gray-700">
                    We are committed to raising the standard of research and defense across Africa's higher education systems.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-emerald-50">
                  <h3 className="font-semibold text-lg text-emerald-700 mb-3">Innovation</h3>
                  <p className="text-gray-700">
                    We use cutting-edge technology, including AI, to reimagine how students learn, research, and defend their ideas.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-emerald-50">
                  <h3 className="font-semibold text-lg text-emerald-700 mb-3">Collaboration</h3>
                  <p className="text-gray-700">
                    We foster strong partnerships between students, lecturers, and institutions to enhance academic and societal outcomes.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-emerald-50">
                  <h3 className="font-semibold text-lg text-emerald-700 mb-3">Empowerment</h3>
                  <p className="text-gray-700">
                    We empower students to grow intellectually and professionally by building confidence in their research capabilities.
                  </p>
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
