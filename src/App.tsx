import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient } from "react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearchAidsDashboard from "./pages/ResearchAidsDashboard";
import ResearchAidSignup from "./pages/ResearchAidSignup";
import ExpertSignup from "./pages/ExpertSignup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./hooks/useAuth";
import SecureAuth from "@/pages/SecureAuth";

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/register" element={<Register />} />
              <Route path="/research-aide-signup" element={<ExpertSignup />} />
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
    </QueryClient>
  );
}

export default App;
