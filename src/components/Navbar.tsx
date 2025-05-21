
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png" 
            alt="ScholarConnect Logo" 
            className="h-8"
          />
          <span className="text-xl font-bold text-emerald-600">ScholarConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors">Home</Link>
          <Link to="/researchers" className="text-gray-700 hover:text-emerald-600 transition-colors">Researchers</Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors">How It Works</Link>
          <Link to="/about-us" className="text-gray-700 hover:text-emerald-600 transition-colors">About Us</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors">Dashboard</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">Sign up</Link>
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
              className="text-gray-700 hover:text-emerald-600 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/researchers" 
              className="text-gray-700 hover:text-emerald-600 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Researchers
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-gray-700 hover:text-emerald-600 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/about-us" 
              className="text-gray-700 hover:text-emerald-600 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-emerald-600 transition-colors py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button 
                asChild 
                variant="outline" 
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button 
                asChild 
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
