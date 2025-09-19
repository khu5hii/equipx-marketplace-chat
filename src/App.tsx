import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SellerDashboard } from "./pages/SellerDashboard";
import { UserView } from "./pages/UserView";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Landing } from "@/pages/Landing";
import { User } from "./models/models";

const queryClient = new QueryClient();

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); // Add useNavigate hook

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);

    // Navigate to the appropriate dashboard based on the user's role
    if (userData.role === "seller") {
      navigate("/seller", { replace: true });
    } else if (userData.role === "buyer") {
      navigate("/user", { replace: true });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    // Check if a user is already logged in (e.g., from a token in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      // Simulate fetching user data from the token
      const loggedInUser: User = {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "seller", // Replace with actual role from the token
      };
      setUser(loggedInUser);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route
            path="/login"
            element={
              <Landing
                onLogin={(userData) => handleLogin(userData)} // Pass the login handler
              />
            }
          />
          <Route
            path="/user"
            element={
              <AuthGuard>
                {user ? (
                  <UserView user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )}
              </AuthGuard>
            }
          />
          <Route
            path="/seller"
            element={
              <AuthGuard>
                {user ? (
                  <SellerDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )}
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
