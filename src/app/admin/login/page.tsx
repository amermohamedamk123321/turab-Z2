"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, Home } from "lucide-react";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate against specific admin credentials
      if (formData.username === "TurabAcademy99" && formData.password === "TurabAcademy99") {
        // Simulate successful login
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminUser", JSON.stringify({
          username: formData.username,
          name: "Turab Admin"
        }));
        
        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F1F1] p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F6F1F1] via-[#AFD3E2] to-[#19A7CE] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#F6F1F1]/50 to-[#F6F1F1]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#19A7CE]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#146C94]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#AFD3E2]/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="group text-[#146C94]/80 hover:text-white hover:bg-gradient-to-r hover:from-[#146C94]/60 hover:to-[#19A7CE]/60 hover:shadow-lg hover:scale-105 backdrop-blur-sm border border-[#146C94]/30 rounded-3xl px-6 py-3 transition-all duration-300 ease-in-out transform hover:border-[#19A7CE]/40"
          >
            <Home className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Back to Home</span>
          </Button>
        </div>

        {/* Login Card with light theme */}
        <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl border border-[#AFD3E2]/30">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#19A7CE] via-[#146C94] to-[#146C94] bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#146C94] font-medium">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-[#F6F1F1] border-[#AFD3E2] text-[#146C94] placeholder-[#146C94]/50 backdrop-blur-sm focus:ring-2 focus:ring-[#19A7CE]/50 focus:border-[#19A7CE]/50 hover:bg-white/90 hover:border-[#19A7CE]/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#146C94] font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-[#F6F1F1] border-[#AFD3E2] text-[#146C94] placeholder-[#146C94]/50 backdrop-blur-sm pr-12 focus:ring-2 focus:ring-[#19A7CE]/50 focus:border-[#19A7CE]/50 hover:bg-white/90 hover:border-[#19A7CE]/30"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#146C94]/50 hover:text-[#146C94]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#19A7CE] via-[#146C94] to-[#146C94] hover:from-[#146C94] hover:via-[#146C94] hover:to-[#19A7CE] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="bg-[#F6F1F1] backdrop-blur-sm rounded-lg p-3 border border-[#AFD3E2]/30">
                <p className="text-sm text-[#146C94]/70">
                  <span className="font-medium text-[#146C94]/90">Demo Credentials:</span>
                </p>
                <p className="text-xs text-[#146C94]/60 mt-1">
                  Username & Password: TurabAcademy99
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
