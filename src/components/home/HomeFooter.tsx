
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const HomeFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">{t("footer.about")}</h3>
              <p className="text-gray-400 text-sm">
                {t("footer.description")}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t("footer.getStarted")}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="text-gray-400 hover:text-white">{t("footer.links.signIn")}</Link></li>
                <li><Link to="/student-signup" className="text-gray-400 hover:text-white">{t("footer.links.studentSignup")}</Link></li>
                <li><Link to="/researcher-signup" className="text-gray-400 hover:text-white">{t("footer.links.researcherSignup")}</Link></li>
                <li><Link to="/research-aid-signup" className="text-gray-400 hover:text-white">{t("footer.links.researchAidSignup")}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
