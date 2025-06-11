
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSecureAuth } from "@/hooks/useSecureAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSecureAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-blue-600">
              ResearchWhao
            </a>
            
            {/* Desktop Menu - Always show navigation links */}
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
              <a href="/co-author-workspace" className="text-gray-600 hover:text-blue-600">
                Co-Author Workspace
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
            {!user ? (
              <>
                <Button variant="outline" asChild>
                  <a href="/auth">Sign In</a>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2">
                      Sign Up
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <a href="/register" className="w-full cursor-pointer">
                        Sign up as Student
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/research-aide-signup" className="w-full cursor-pointer">
                        Sign up as Researcher
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/research-aid-signup" className="w-full cursor-pointer">
                        Sign up as Research Aid
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
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
              {/* Always show navigation links in mobile */}
              <a href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
              <a href="/researchers" className="text-gray-600 hover:text-blue-600">
                Researchers
              </a>
              <a href="/research-aids" className="text-gray-600 hover:text-blue-600">
                Research Aids
              </a>
              <a href="/co-author-workspace" className="text-gray-600 hover:text-blue-600">
                Co-Author Workspace
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
                {!user ? (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <a href="/auth">Sign In</a>
                    </Button>
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <a href="/register">Sign up as Student</a>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <a href="/research-aide-signup">Sign up as Researcher</a>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <a href="/research-aid-signup">Sign up as Research Aid</a>
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <a href="/dashboard">Dashboard</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
