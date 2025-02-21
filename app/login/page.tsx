"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/lib/supabase/login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message
    setLoading(true); // Set loading to true when sign-in starts

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    // Optional: Regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false); // Set loading to false if email is invalid
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await login(formData);
      if (result.success) {
        router.push("/dashboard"); // Redirect to dashboard on success
      } else {
        setError(result.message || "An unknown error occurred."); // Provide a default error message
        //console.error("Login error:", result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unknown error occurred."); // Provide a default error message
    } finally {
      setLoading(false); // Set loading to false after sign-in completes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <Card className="w-[400px] bg-white shadow-lg rounded-xl border-primary border-[1px] relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primaryDark text-center">
            Snabbvaccin Admin
          </CardTitle>
          <CardDescription className="text-muted-foreground text-primaryDark text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground text-primaryDark"
              >
                Email
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-background border-input rounded-[7px]"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-foreground text-primaryDark"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-input rounded-[7px]"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="w-full text-white hover:bg-primary/90 rounded-[7px] font-bold"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary bg-opacity-10 z-20">
              <div className="w-20 h-20 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
