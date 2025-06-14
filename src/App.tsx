
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
const SecureRegister = lazy(() => import("./pages/SecureRegister"));
const ResearchAideSignup = lazy(() => import("./pages/ResearchAideSignup"));
const ResearchAidSignup = lazy(() => import("./pages/ResearchAidSignup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ResearcherDashboard = lazy(() => import("./pages/ResearcherDashboard"));
const ResearchAidsDashboard = lazy(() => import("./pages/ResearchAidsDashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const ResearcherProfile = lazy(() => import("./pages/ResearcherProfile"));
const CoAuthorWorkspace = lazy(() => import("./pages/CoAuthorWorkspace"));
const WorkspaceDetails = lazy(() => import("./pages/WorkspaceDetails"));

// Import other pages that should be accessible without auth
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Researchers = lazy(() => import("./pages/Researchers"));
const ResearchAides = lazy(() => import("./pages/ResearchAides"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Routes>
              {/* Public routes - no authentication required */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/researchers" element={<Researchers />} />
              <Route path="/research-aids" element={<ResearchAides />} />
              <Route path="/researcher/:id" element={<ResearcherProfile />} />
              
              {/* Co-author workspace routes */}
              <Route path="/co-author-workspace" element={<CoAuthorWorkspace />} />
              <Route path="/workspace/:projectId" element={<WorkspaceDetails />} />
              
              {/* Authentication routes */}
              <Route path="/auth" element={<SecureAuth />} />
              <Route path="/register" element={<Register />} />
              <Route path="/secure-register" element={<SecureRegister />} />
              <Route path="/research-aide-signup" element={<ResearchAideSignup />} />
              <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
              
              {/* Protected dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="student" requireAuth={false}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/researcher-dashboard" 
                element={
                  <ProtectedRoute requiredRole="expert" requireAuth={false}>
                    <ResearcherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/research-aids-dashboard" 
                element={
                  <ProtectedRoute requiredRole="aid" requireAuth={false}>
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
