
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png" 
            alt="ScholarConnect Logo" 
            className="h-8"
          />
          <span className="text-xl font-bold text-blue-900">ScholarConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-900 transition-colors">{t('nav.home')}</Link>
          <Link to="/researchers" className="text-gray-700 hover:text-blue-900 transition-colors">{t('nav.researchers')}</Link>
          <Link to="/research-aides" className="text-gray-700 hover:text-blue-900 transition-colors">Research Aides</Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-blue-900 transition-colors">How It Works</Link>
          <Link to="/partnerships" className="text-gray-700 hover:text-blue-900 transition-colors">Partnerships</Link>
          <Link to="/about-us" className="text-gray-700 hover:text-blue-900 transition-colors">{t('nav.about')}</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-900 transition-colors">Contact</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="outline" size="sm" className="border-blue-900 text-blue-900 hover:bg-blue-50">
            <Link to="/login">{t('nav.login')}</Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Link to="/register">{t('nav.register')}</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-900 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/researchers" 
              className="text-gray-700 hover:text-blue-900 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.researchers')}
            </Link>
            <Link 
              to="/research-aides" 
              className="text-gray-700 hover:text-blue-900 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Research Aides
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-gray-700 hover:text-blue-900 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/partnerships" 
              className="text-gray-700 hover:text-blue-900 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Partnerships
            </Link>
            <Link 
              to="/about-us" 
              className="text-gray-700 hover:text-blue-900 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-blue-900 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-blue-900 text-blue-900 hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button 
                asChild 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/register">{t('nav.register')}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
