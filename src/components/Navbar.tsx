
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, User } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: t("nav.home") || "Home", href: "/" },
    { label: t("nav.researchers") || "Researchers", href: "/researchers" },
    { label: t("nav.researchAids") || "Research Aids", href: "/research-aids" },
    { label: "Blogs", href: "/blogs" },
    { label: "Partnerships", href: "/partnerships" }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return "/dashboard";
    
    switch (profile.role) {
      case 'expert':
        return "/researcher-dashboard";
      case 'aid':
        return "/research-aids-dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a2f6a2f6-b795-4e93-914c-2b58648099ff.png" 
              alt="ScholarConnect" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-blue-600">ScholarConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  {user ? profile?.name || "Account" : t("nav.account") || "Account"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {!user ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/auth")}>
                      {t("nav.signIn") || "Sign In"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/auth")}>
                      {t("nav.signUp") || "Sign Up"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                      {t("nav.dashboard") || "Dashboard"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    {!user ? (
                      <>
                        <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                          {t("nav.signIn") || "Sign In"}
                        </Button>
                        <Button className="w-full" onClick={() => navigate("/auth")}>
                          {t("nav.signUp") || "Sign Up"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full" onClick={() => navigate(getDashboardLink())}>
                          {t("nav.dashboard") || "Dashboard"}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleSignOut}>
                          Sign Out
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
