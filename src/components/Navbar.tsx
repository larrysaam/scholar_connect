
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "You have been logged out successfully"
    });
    
    // In a real app, this would clear the session and redirect to login
    console.log("Logging out user...");
    
    // Simulate logout by redirecting to home page
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

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
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
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
              <Button variant="outline" onClick={handleLogout} className="w-full flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
