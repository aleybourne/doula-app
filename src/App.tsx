
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { MigrationRunner } from "@/components/migration/MigrationRunner";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { NetworkStatusIndicator } from "@/components/network/NetworkStatusIndicator";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import ClientBenita from "./pages/ClientBenita";
import ClientSam from "./pages/clients/ClientSam";
import ClientJulie from "./pages/clients/ClientJulie";
import ClientJasmine from "./pages/clients/ClientJasmine";
import ClientJane from "./pages/clients/ClientJane";
import ClientAustin from "./pages/clients/ClientAustin";
import NewClientPage from "@/components/clients/NewClientTemplate";
import NewClient from "./pages/NewClient";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";

// Create wrapper components to get parameters
const DynamicClientByNamePage = () => {
  const { clientName } = useParams();
  return <NewClientPage clientName={clientName || ''} />;
};

const DynamicClientByIdPage = () => {
  const { clientId } = useParams();
  return <NewClientPage clientId={clientId || ''} />;
};

const FirstClientPage = () => {
  return <NewClientPage mode="first" />;
};

const NewClientFormPage = () => {
  return <NewClientPage mode="new" />;
};

// Protected route component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const queryClient = new QueryClient();

// Routes component that uses auth context
const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Network Status Indicator */}
      <div className="fixed top-4 left-4 z-50">
        <NetworkStatusIndicator />
      </div>
      
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route path="/onboarding" element={
            <RequireAuth>
              <Onboarding />
            </RequireAuth>
          } />
          <Route path="/home" element={
            <RequireAuth>
              <Index />
            </RequireAuth>
          } />
          <Route path="/clients" element={
            <RequireAuth>
              <Clients />
            </RequireAuth>
          } />
          <Route path="/clients/Benita Mendez" element={
            <RequireAuth>
              <ClientBenita />
            </RequireAuth>
          } />
          <Route path="/clients/Sam Williams" element={
            <RequireAuth>
              <ClientSam />
            </RequireAuth>
          } />
          <Route path="/clients/Julie Hill" element={
            <RequireAuth>
              <ClientJulie />
            </RequireAuth>
          } />
          <Route path="/clients/Jasmine Jones" element={
            <RequireAuth>
              <ClientJasmine />
            </RequireAuth>
          } />
          <Route path="/clients/Jane Miller" element={
            <RequireAuth>
              <ClientJane />
            </RequireAuth>
          } />
          <Route path="/clients/Austin Leybourne" element={
            <RequireAuth>
              <ClientAustin />
            </RequireAuth>
          } />
          
          {/* New flexible client routes */}
          <Route path="/clients/first" element={
            <RequireAuth>
              <FirstClientPage />
            </RequireAuth>
          } />
          <Route path="/clients/new" element={
            <RequireAuth>
              <NewClientFormPage />
            </RequireAuth>
          } />
          <Route path="/clients/new-page" element={
            <RequireAuth>
              <NewClient />
            </RequireAuth>
          } />
          
          {/* ID-based client route (preferred) */}
          <Route path="/clients/id/:clientId" element={
            <RequireAuth>
              <DynamicClientByIdPage />
            </RequireAuth>
          } />
          
          {/* Legacy name-based client route (for backward compatibility) */}
          <Route path="/clients/:clientName" element={
            <RequireAuth>
              <DynamicClientByNamePage />
            </RequireAuth>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {/* Only show BottomNav when user is authenticated */}
      {user && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalErrorBoundary>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
          <MigrationRunner />
        </BrowserRouter>
      </AuthProvider>
    </GlobalErrorBoundary>
  </QueryClientProvider>
);

export default App;
