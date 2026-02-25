import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PostEditor from "./pages/PostEditor";
import PostDetail from "./pages/PostDetail";
import Feed from "./pages/Feed";
import ResetPassword from "./pages/ResetPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/ui/LoadingScreen";
import Plasma from "./components/animations/Plasma";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();


const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Prevent scrolling while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" />
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen key="loading-screen" onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>
        
        {!isLoading && (
          <>
            {/* Global Plasma Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-10">
              <Plasma color="hsl(var(--primary))" speed={0.5} opacity={0.3} />
            </div>
            
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/write" element={<PostEditor />} />
                <Route path="/write/:id" element={<PostEditor />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/blog/:slug" element={<PostDetail />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
