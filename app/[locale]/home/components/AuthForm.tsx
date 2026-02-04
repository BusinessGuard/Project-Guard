"use client";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/lib/navigation";

type AuthMode = "signin" | "signup";

// Validation schema for sign in
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Validation schema for sign up
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form for sign in
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  // Form for sign up
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const onSignIn = async (data: SignInFormData) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Check for anonymous project and transfer it
      const anonymousProjectId = localStorage.getItem('anonymous_project_id');
      if (anonymousProjectId) {
        await fetch('/api/transfer-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: anonymousProjectId }),
        });
        localStorage.removeItem('anonymous_project_id');
      }
      
      router.push('/dashboard');
      router.refresh();
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Reset form and switch to sign in
      signUpForm.reset();
      setMode("signin");
      setError(null);
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    signInForm.reset();
    signUpForm.reset();
  };

  return (
    <div className="w-full max-w-md space-y-8 px-12 ">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-black">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-600">
          {mode === "signin" 
            ? "Sign in to your account" 
            : "Sign up to get started"}
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full text-lg px-8 py-6"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        <Separator />

        {mode === "signin" ? (
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                className={`h-12 text-base ${
                  signInForm.formState.errors.email ? 'border-red-500 focus-visible:border-red-500' : ''
                }`}
                {...signInForm.register("email")}
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password" 
                  className={`h-12 text-base pr-10 ${
                    signInForm.formState.errors.password ? 'border-red-500 focus-visible:border-red-500' : ''
                  }`}
                  {...signInForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {signInForm.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <Button 
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-lg px-8 py-6"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm">Email</Label>
              <Input 
                id="signup-email" 
                type="email" 
                placeholder="your@email.com" 
                className={`h-12 text-base ${
                  signUpForm.formState.errors.email ? 'border-red-500 focus-visible:border-red-500' : ''
                }`}
                {...signUpForm.register("email")}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm">Password</Label>
              <div className="relative">
                <Input 
                  id="signup-password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password" 
                  className={`h-12 text-base pr-10 ${
                    signUpForm.formState.errors.password ? 'border-red-500 focus-visible:border-red-500' : ''
                  }`}
                  {...signUpForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password" 
                  className={`h-12 text-base pr-10 ${
                    signUpForm.formState.errors.confirmPassword ? 'border-red-500 focus-visible:border-red-500' : ''
                  }`}
                  {...signUpForm.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {signUpForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <Button 
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-lg px-8 py-6"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-slate-500">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button 
                className="text-black font-medium hover:underline"
                onClick={handleModeSwitch}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button 
                className="text-black font-medium hover:underline"
                onClick={handleModeSwitch}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
