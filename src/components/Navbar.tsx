
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-blue-600">
              ResearchWhao
            </a>
            
            {/* Desktop Menu - Only show if user is authenticated */}
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <a href="/researchers" className="text-gray-600 hover:text-blue-600">
                  Researchers
                </a>
                <a href="/research-aids" className="text-gray-600 hover:text-blue-600">
                  Research Aids
                </a>
                <a href="/dashboard" className="text-gray-600 hover:text-blue-600">
                  Dashboard
                </a>
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <a href="/login">Sign In</a>
                </Button>
                <div className="relative group">
                  <Button>Join Platform</Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <a href="/student-signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Join as Student
                      </a>
                      <a href="/researcher-signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Join as Researcher
                      </a>
                      <a href="/research-aid-signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Join as Research Aid
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
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
              {user ? (
                <>
                  <a href="/researchers" className="text-gray-600 hover:text-blue-600">
                    Researchers
                  </a>
                  <a href="/research-aids" className="text-gray-600 hover:text-blue-600">
                    Research Aids
                  </a>
                  <a href="/dashboard" className="text-gray-600 hover:text-blue-600">
                    Dashboard
                  </a>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" asChild className="w-full">
                      <a href="/login">Sign In</a>
                    </Button>
                    <Button asChild className="w-full">
                      <a href="/student-signup">Join as Student</a>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <a href="/researcher-signup">Join as Researcher</a>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <a href="/research-aid-signup">Join as Research Aid</a>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
