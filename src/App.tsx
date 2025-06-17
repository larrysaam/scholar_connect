
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ResearcherDashboard = lazy(() => import("./pages/ResearcherDashboard"));
const ResearchAidsDashboard = lazy(() => import("./pages/ResearchAidsDashboard"));
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

// Import authentication pages
const Login = lazy(() => import("./pages/Login"));
const StudentSignup = lazy(() => import("./pages/StudentSignup"));
const ResearcherSignup = lazy(() => import("./pages/ResearcherSignup"));
const ResearchAidSignup = lazy(() => import("./pages/ResearchAidSignup"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/partnerships" element={<Partnerships />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/researchers" element={<Researchers />} />
                <Route path="/research-aids" element={<ResearchAides />} />
                <Route path="/researcher/:id" element={<ResearcherProfile />} />
                
                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/student-signup" element={<StudentSignup />} />
                <Route path="/researcher-signup" element={<ResearcherSignup />} />
                <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
                
                {/* Co-author workspace routes */}
                <Route path="/co-author-workspace" element={<CoAuthorWorkspace />} />
                <Route path="/workspace/:projectId" element={<WorkspaceDetails />} />
                
                {/* Dashboard routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
                <Route path="/research-aids-dashboard" element={<ResearchAidsDashboard />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
