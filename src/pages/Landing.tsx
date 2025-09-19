import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, Users, Recycle } from "lucide-react";
import { registerUser, loginUser } from "@/services/auth.service";

interface LandingProps {
  onLogin: (user: { name: string; email: string; role: "seller" | "buyer" }) => void;
}

export const Landing = ({ onLogin }: LandingProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer" as "seller" | "buyer",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (isLogin) {
            const user = await loginUser({ email: formData.email, password: formData.password, role: formData.role });
            localStorage.setItem('token', user.token); // Save token to localStorage
            onLogin(user);
        } else {
            const user = await registerUser(formData);
            localStorage.setItem('token', user.token); // Save token to localStorage
            onLogin(user);
        }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">EquipX</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={isLogin ? "default" : "outline"}
              onClick={() => setIsLogin(true)}
              className={isLogin ? "gradient-medical shadow-button" : ""}
            >
              Login
            </Button>
            <Button 
              variant={!isLogin ? "default" : "outline"}
              onClick={() => setIsLogin(false)}
              className={!isLogin ? "gradient-medical shadow-button" : ""}
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Extend the Life of{" "}
                <span className="text-primary">Medical Equipment</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Connect healthcare providers to redistribute unused and gently used medical equipment, 
                reducing waste while making healthcare more accessible.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card shadow-card">
                <Heart className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-semibold">Healthcare Impact</p>
                  <p className="text-sm text-muted-foreground">Improve accessibility</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card shadow-card">
                <Recycle className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-semibold">Sustainability</p>
                  <p className="text-sm text-muted-foreground">Reduce waste</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card shadow-card">
                <Users className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-semibold">Community</p>
                  <p className="text-sm text-muted-foreground">Connect providers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-card shadow-card">
                <Activity className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-semibold">Verified</p>
                  <p className="text-sm text-muted-foreground">Trusted platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="shadow-medical">
            <CardHeader className="gradient-medical text-primary-foreground">
              <CardTitle className="text-2xl">
                {isLogin ? "Welcome Back" : "Join EquipX"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Dr. Sarah Johnson"
                      required={!isLogin}
                      className="transition-smooth"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="sarah@hospital.com"
                    required
                    className="transition-smooth"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    className="transition-smooth"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">I want to</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: "seller" | "buyer") => 
                      setFormData(prev => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger className="transition-smooth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Find Equipment (Receiver)</SelectItem>
                      <SelectItem value="seller">Donate Equipment (Donor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full gradient-medical shadow-button transition-bounce hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};