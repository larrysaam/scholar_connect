import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Researchers from "./pages/Researchers";
import ResearcherProfile from "./pages/ResearcherProfile";
import Dashboard from "./pages/Dashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearchAidsDashboard from "./pages/ResearchAidsDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResearchAideSignup from "./pages/ResearchAideSignup";
import ResearchAidSignup from "./pages/ResearchAidSignup";
import ResearchAides from "./pages/ResearchAides";
import ResearchAids from "./pages/ResearchAids";
import Blogs from "./pages/Blogs";
import Partnerships from "./pages/Partnerships";
import CoAuthorWorkspace from "./pages/CoAuthorWorkspace";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentPayments from "./pages/StudentPayments";
import ProviderEarnings from "./pages/ProviderEarnings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/researchers" element={<Researchers />} />
            <Route path="/researcher/:id" element={<ResearcherProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
            <Route path="/research-aids-dashboard" element={<ResearchAidsDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/research-aide-signup" element={<ResearchAideSignup />} />
            <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
            <Route path="/research-aides" element={<ResearchAides />} />
            <Route path="/research-aids" element={<ResearchAids />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/co-author-workspace" element={<CoAuthorWorkspace />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/student-payments" element={<StudentPayments />} />
            <Route path="/provider-earnings" element={<ProviderEarnings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
