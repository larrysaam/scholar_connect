
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-blue-600">
              ScholarConnect
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
              <a href="/researchers" className="text-gray-600 hover:text-blue-600">
                Researchers
              </a>
              <a href="/research-aids" className="text-gray-600 hover:text-blue-600">
                Research Aids
              </a>
              <a href="/how-it-works" className="text-gray-600 hover:text-blue-600">
                How It Works
              </a>
              <a href="/about" className="text-gray-600 hover:text-blue-600">
                About Us
              </a>
              <a href="/partnerships" className="text-gray-600 hover:text-blue-600">
                Partnerships
              </a>
              <a href="/blogs" className="text-gray-600 hover:text-blue-600">
                Blogs
              </a>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/auth">Sign In</a>
            </Button>
            <Button asChild>
              <a href="/auth">Sign Up</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
              <a href="/researchers" className="text-gray-600 hover:text-blue-600">
                Researchers
              </a>
              <a href="/research-aids" className="text-gray-600 hover:text-blue-600">
                Research Aids
              </a>
              <a href="/how-it-works" className="text-gray-600 hover:text-blue-600">
                How It Works
              </a>
              <a href="/about" className="text-gray-600 hover:text-blue-600">
                About Us
              </a>
              <a href="/partnerships" className="text-gray-600 hover:text-blue-600">
                Partnerships
              </a>
              <a href="/blogs" className="text-gray-600 hover:text-blue-600">
                Blogs
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" asChild className="w-full">
                  <a href="/auth">Sign In</a>
                </Button>
                <Button asChild className="w-full">
                  <a href="/auth">Sign Up</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
