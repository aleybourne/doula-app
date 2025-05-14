
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
import { BottomNav } from "@/components/dashboard/BottomNav";

// Create a wrapper component to get the clientName parameter
const DynamicClientPage = () => {
  const { clientName } = useParams();
  return <NewClientPage clientName={clientName || ''} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/Benita Mendez" element={<ClientBenita />} />
            <Route path="/clients/Sam Williams" element={<ClientSam />} />
            <Route path="/clients/Julie Hill" element={<ClientJulie />} />
            <Route path="/clients/Jasmine Jones" element={<ClientJasmine />} />
            <Route path="/clients/Jane Miller" element={<ClientJane />} />
            <Route path="/clients/Austin Leybourne" element={<ClientAustin />} />
            <Route path="/clients/:clientName" element={<DynamicClientPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
