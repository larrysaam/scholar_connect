
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('about.title')}</h1>
              <p className="text-xl text-blue-100">
                {t('about.subtitle')}
              </p>
            </div>
          </div>
        </section>
        
        {/* About Description */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">{t('about.whoWeAre')}</h2>
              <p className="text-lg text-gray-700 mb-8">
                {t('about.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">{t('about.vision')}</h3>
                  <p className="text-gray-700">
                    {t('about.visionText')}
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">{t('about.mission')}</h3>
                  <p className="text-gray-700">
                    {t('about.missionText')}
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">{t('about.valueProposition')}</h2>
              <p className="text-lg text-gray-700 mb-12">
                {t('about.valuePropositionText')}
              </p>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">{t('about.coreValues')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">{t('about.access')}</h3>
                  <p className="text-gray-700">
                    {t('about.accessText')}
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">{t('about.integrity')}</h3>
                  <p className="text-gray-700">
                    {t('about.integrityText')}
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">{t('about.excellence')}</h3>
                  <p className="text-gray-700">
                    {t('about.excellenceText')}
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">{t('about.innovation')}</h3>
                  <p className="text-gray-700">
                    {t('about.innovationText')}
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">{t('about.collaboration')}</h3>
                  <p className="text-gray-700">
                    {t('about.collaborationText')}
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg text-blue-700 mb-3">{t('about.empowerment')}</h3>
                  <p className="text-gray-700">
                    {t('about.empowermentText')}
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
