
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const SecureAuth = lazy(() => import("./pages/SecureAuth"));
const Register = lazy(() => import("./pages/Register"));
const ResearchAideSignup = lazy(() => import("./pages/ResearchAideSignup"));
const ResearchAidSignup = lazy(() => import("./pages/ResearchAidSignup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ResearcherDashboard = lazy(() => import("./pages/ResearcherDashboard"));
const ResearchAidsDashboard = lazy(() => import("./pages/ResearchAidsDashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<SecureAuth />} />
              <Route path="/register" element={<Register />} />
              <Route path="/research-aide-signup" element={<ResearchAideSignup />} />
              <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/researcher-dashboard" 
                element={
                  <ProtectedRoute requiredRole="expert">
                    <ResearcherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/research-aids-dashboard" 
                element={
                  <ProtectedRoute requiredRole="aid">
                    <ResearchAidsDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
