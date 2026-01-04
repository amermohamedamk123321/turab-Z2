"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, Home } from "lucide-react";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Server-side authentication via NextAuth
      // Credentials are validated against database with bcrypt comparison
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // NextAuth returns specific error messages
        if (result.error === "Invalid email or password") {
          setError("Invalid email or password. Please try again.");
        } else if (result.error === "Account is disabled") {
          setError("Your account has been disabled. Contact administrator.");
        } else if (result.error === "Insufficient permissions") {
          setError("Your account does not have admin access.");
        } else if (result.error === "Email and password are required") {
          setError("Please enter both email and password.");
        } else {
          setError(result.error || "Authentication failed. Please try again.");
        }
      } else if (result?.ok) {
        // Successful authentication
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-cyan-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-900/50"></div>

      {/* Decorative glowing elements */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="group text-cyan-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-600 hover:to-purple-600 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 backdrop-blur-sm border border-cyan-500/40 rounded-3xl px-6 py-3 transition-all duration-300 ease-in-out transform hover:border-purple-500/40"
          >
            <Home className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">Back to Home</span>
          </Button>
        </div>

        {/* Login Card with dark theme */}
        <Card className="border-0 bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-cyan-500/30 rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
            <CardDescription className="text-cyan-400/70">
              Secure server-side authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-500/50 bg-red-900/40 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-400 font-semibold text-sm">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-700/50 border-cyan-500/30 text-white placeholder-cyan-400/50 backdrop-blur-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 hover:bg-gray-700/70 hover:border-cyan-500/50 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-400 font-semibold text-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-gray-700/50 border-cyan-500/30 text-white placeholder-cyan-400/50 backdrop-blur-sm pr-12 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 hover:bg-gray-700/70 hover:border-cyan-500/50 transition-all duration-300"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-cyan-400/60 hover:text-cyan-300 transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
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
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm">
                  Credentials are securely validated on the server using bcrypt
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
