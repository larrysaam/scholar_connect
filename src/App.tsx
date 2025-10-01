
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ResearcherDashboard = lazy(() => import("./pages/ResearcherDashboard"));
const ResearchAidsDashboard = lazy(() => import("./pages/ResearchAidsDashboard"));
const ResearcherProfile = lazy(() => import("./pages/ResearcherProfile"));
const CoAuthorWorkspace = lazy(() => import("./pages/CoAuthorWorkspace"));
const WorkspaceDetails = lazy(() => import("./pages/WorkspaceDetails"));
const ProjectWorkspace = lazy(() => import("./pages/ProjectWorkspace"));

// Public pages accessible to unauthenticated users
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const Blogs = lazy(() => import("./pages/Blogs"));

// Protected pages that require authentication
const Researchers = lazy(() => import("./pages/Researchers"));
const ResearchAides = lazy(() => import("./pages/ResearchAides"));

// Authentication pages
const Login = lazy(() => import("./pages/Login"));
const StudentSignup = lazy(() => import("./pages/StudentSignup"));
const ResearcherSignup = lazy(() => import("./pages/ResearcherSignup"));
const ResearchAidSignup = lazy(() => import("./pages/ResearchAidSignup"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminSignup = lazy(() => import("./pages/AdminSignup"));

// Student appointment pages
const StudentAppointmentsPage = lazy(() => import("./pages/StudentAppointmentsPage"));

// Research Aid Profile page
const ResearchAidProfile = lazy(() => import("./pages/ResearchAidProfile"));

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
                {/* Public routes - accessible without authentication */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/partnerships" element={<Partnerships />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/co-author-workspace" element={<CoAuthorWorkspace />} />
                
                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/student-signup" element={<StudentSignup />} />
                <Route path="/researcher-signup" element={<ResearcherSignup />} />
                <Route path="/research-aid-signup" element={<ResearchAidSignup />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
                
                {/* Protected routes - require authentication */}
                <Route path="/researchers" element={
                  <ProtectedRoute>
                    <Researchers />
                  </ProtectedRoute>
                } />
                <Route path="/research-aids" element={
                  <ProtectedRoute>
                    <ResearchAides />
                  </ProtectedRoute>
                } />
                <Route path="/researcher/:id" element={
                  <ProtectedRoute>
                    <ResearcherProfile />
                  </ProtectedRoute>
                } />
                <Route path="/research-aids/:id" element={
                  <ProtectedRoute>
                    <ResearchAidProfile />
                  </ProtectedRoute>
                } />                <Route path="/workspace/:projectId" element={
                  <ProtectedRoute>
                    <ProjectWorkspace />
                  </ProtectedRoute>
                } />
                  {/* Dashboard routes - require authentication and specific roles */}
                <Route path="/dashboard" element={
                  <ProtectedRoute requiredRole="student">
                    <Dashboard />
                  </ProtectedRoute>
                } />                <Route path="/researcher-dashboard" element={
                  <ProtectedRoute requiredRole="expert">
                    <ResearcherDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/research-aids-dashboard" element={
                  <ProtectedRoute requiredRole="aid">
                    <ResearchAidsDashboard />
                  </ProtectedRoute>
                } />                {/* Student appointment routes */}
                <Route path="/appointments" element={
                  <ProtectedRoute requiredRole="student">
                    <StudentAppointmentsPage />
                  </ProtectedRoute>
                } />

                {/* Admin route */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
