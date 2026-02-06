"use client";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/lib/navigation";

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Validation schemas with translations
  const signInSchema = useMemo(() => z.object({
    email: z.string().email(t('validation.invalidEmail')),
    password: z.string().min(6, t('validation.passwordMinLength')),
  }), [t]);

  const signUpSchema = useMemo(() => z.object({
    email: z.string().email(t('validation.invalidEmail')),
    password: z.string().min(6, t('validation.passwordMinLength')),
    confirmPassword: z.string().min(6, t('validation.passwordMinLength')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordsDontMatch'),
    path: ["confirmPassword"],
  }), [t]);

  type SignInFormData = {
    email: string;
    password: string;
  };

  type SignUpFormData = {
    email: string;
    password: string;
    confirmPassword: string;
  };

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
    <div className="w-full max-w-lg space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-black">
          {mode === "signin" ? t('welcomeBack') : t('createAccount')}
        </h2>
        <p className="text-slate-600">
          {mode === "signin" 
            ? t('signInToAccount') 
            : t('signUpToGetStarted')}
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
          {t('continueWithGoogle')}
        </Button>

        <Separator />

        {mode === "signin" ? (
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">{t('email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('emailPlaceholder')} 
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
              <Label htmlFor="password" className="text-sm">{t('password')}</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder={t('passwordPlaceholder')} 
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
              {loading ? tCommon('loading') : t('signIn')}
            </Button>
          </form>
        ) : (
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm">{t('email')}</Label>
              <Input 
                id="signup-email" 
                type="email" 
                placeholder={t('emailPlaceholder')} 
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
              <Label htmlFor="signup-password" className="text-sm">{t('password')}</Label>
              <div className="relative">
                <Input 
                  id="signup-password" 
                  type={showPassword ? "text" : "password"}
                  placeholder={t('passwordPlaceholder')} 
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
              <Label htmlFor="confirmPassword" className="text-sm">{t('confirmPassword')}</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('confirmPasswordPlaceholder')} 
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
              {loading ? tCommon('loading') : t('signUp')}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-slate-500">
          {mode === "signin" ? (
            <>
              {t('noAccount')}{" "}
              <button 
                className="text-black font-medium hover:underline"
                onClick={handleModeSwitch}
              >
                {t('signUp')}
              </button>
            </>
          ) : (
            <>
              {t('hasAccount')}{" "}
              <button 
                className="text-black font-medium hover:underline"
                onClick={handleModeSwitch}
              >
                {t('signIn')}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
