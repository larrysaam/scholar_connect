
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Register from "./pages/Register";
import Researchers from "./pages/Researchers";
import ResearcherProfile from "./pages/ResearcherProfile";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearchAidsDashboard from "./pages/ResearchAidsDashboard";
import ResearchAidSignup from "./pages/ResearchAidSignup";
import ResearchAideSignup from "./pages/ResearchAideSignup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import SecureAuth from "@/pages/SecureAuth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<HowItWorks />} />
                <Route path="/register" element={<Register />} />
                <Route path="/researchers" element={<Researchers />} />
                <Route path="/researcher/:id" element={<ResearcherProfile />} />
                <Route path="/research-aide-signup" element={<ResearchAideSignup />} />
                <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
                <Route path="/research-aids-dashboard" element={<ResearchAidsDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                
                {/* Replace the existing auth route with secure version */}
                <Route path="/auth" element={<SecureAuth />} />
                <Route path="/secure-auth" element={<SecureAuth />} />
                
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
