
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Researchers from "./pages/Researchers";
import ResearcherProfile from "./pages/ResearcherProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HowItWorks from "./pages/HowItWorks";
import CoAuthorWorkspace from "./pages/CoAuthorWorkspace";
import ResearchAids from "./pages/ResearchAids";
import Contact from "./pages/Contact";
import Partnerships from "./pages/Partnerships";
import ResearchAideSignup from "./pages/ResearchAideSignup";
import ResearchAideDashboard from "./pages/ResearchAideDashboard";

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/researchers" element={<Researchers />} />
                <Route path="/researchers/:id" element={<ResearcherProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/co-author-workspace" element={<CoAuthorWorkspace />} />
                <Route path="/research-aids" element={<ResearchAids />} />
                <Route path="/research-aide-signup" element={<ResearchAideSignup />} />
                <Route path="/research-aide-dashboard" element={<ResearchAideDashboard />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/partnerships" element={<Partnerships />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
