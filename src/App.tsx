import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Landing } from "./pages/Landing";
import { SellerDashboard } from "./pages/SellerDashboard";
import { UserView } from "./pages/UserView";

const queryClient = new QueryClient();

interface User {
  name: string;
  email: string;
  role: "seller" | "buyer";
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {!user ? (
          <Landing onLogin={handleLogin} />
        ) : user.role === "seller" ? (
          <SellerDashboard user={user} onLogout={handleLogout} />
        ) : (
          <UserView user={user} onLogout={handleLogout} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
