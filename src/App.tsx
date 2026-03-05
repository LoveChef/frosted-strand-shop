import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { usePageTracking } from "@/hooks/usePageTracking";
import { FlyToCartAnimation } from "@/components/FlyToCartAnimation";
import { CookieBanner } from "@/components/CookieBanner";
import UnderConstruction from "./pages/UnderConstruction";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import PolicyPage from "./pages/PolicyPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  usePageTracking();
  return (
    <>
      <FlyToCartAnimation />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<UnderConstruction />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/policy/:slug" element={<PolicyPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
