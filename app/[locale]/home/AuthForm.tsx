"use client";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/lib/navigation";

type AuthMode = "signin" | "signup" | "forgot";

type SignInFormData = { email: string; password: string };
type SignUpFormData = { email: string; password: string; confirmPassword: string };
type ForgotPasswordFormData = { email: string };

export function AuthForm() {
  const tLogin = useTranslations("login");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const signInSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(tLogin("validation.invalidEmail")),
        password: z.string().min(6, tLogin("validation.passwordMin")),
      }),
    [tLogin]
  );

  const signUpSchema = useMemo(
    () =>
      z
        .object({
          email: z
            .string()
            .email(tAuth("validation.invalidEmail"))
            .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
              message: tAuth("validation.invalidEmail"),
            }),
          password: z
            .string()
            .min(6, tAuth("validation.passwordMinLength"))
            .regex(/[A-Z]/, tAuth("validation.passwordUppercase"))
            .regex(/[0-9]/, tAuth("validation.passwordNumber"))
            .regex(/[^A-Za-z0-9]/, tAuth("validation.passwordSpecial")),
          confirmPassword: z.string().min(6, tAuth("validation.passwordMinLength")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: tAuth("validation.passwordsDontMatch"),
          path: ["confirmPassword"],
        }),
    [tAuth]
  );

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(tLogin("validation.invalidEmail")),
      }),
    [tLogin]
  );

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  const onSignIn = async (data: SignInFormData) => {
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      const anonymousProjectId = localStorage.getItem("anonymous_project_id");
      if (anonymousProjectId) {
        await fetch("/api/transfer-project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: anonymousProjectId }),
        });
        localStorage.removeItem("anonymous_project_id");
      }

      router.push("/dashboard");
      router.refresh();
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      signUpForm.reset();
      setMode("signin");
      setError(null);
      setLoading(false);
    }
  };

  const onForgotPassword = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=/${locale}/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setResetEmailSent(true);
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
    setResetEmailSent(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    signInForm.reset();
    signUpForm.reset();
    forgotPasswordForm.reset();
  };

  const handleForgotPassword = () => {
    setMode("forgot");
    setError(null);
    setResetEmailSent(false);
    forgotPasswordForm.reset();
  };

  return (
    <div className="w-full max-w-lg space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-black">
          {mode === "signin" && tLogin("title.signin")}
          {mode === "signup" && tLogin("title.signup")}
          {mode === "forgot" && tLogin("title.forgot")}
        </h2>
        <p className="text-slate-600">
          {mode === "signin" && tLogin("subtitle.signin")}
          {mode === "signup" && tLogin("subtitle.signup")}
          {mode === "forgot" && tLogin("subtitle.forgot")}
        </p>
      </div>

      <div className="space-y-4">
        {mode !== "forgot" && (
          <>
            <Button
              variant="outline"
              className="w-full text-lg px-8 py-6"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              {tLogin("actions.continueWithGoogle")}
            </Button>
            <Separator />
          </>
        )}

        {mode === "signin" ? (
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                {tLogin("fields.email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={tLogin("placeholders.email")}
                className={`h-12 text-base ${
                  signInForm.formState.errors.email ? "border-red-500 focus-visible:border-red-500" : ""
                }`}
                {...signInForm.register("email")}
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-red-600">{signInForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password" className="text-sm">
                  {tLogin("fields.password")}
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-slate-600 hover:text-black hover:underline shrink-0"
                >
                  {tLogin("actions.forgotPassword")}
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={tLogin("placeholders.password")}
                  className={`h-12 text-base pr-10 ${
                    signInForm.formState.errors.password ? "border-red-500 focus-visible:border-red-500" : ""
                  }`}
                  {...signInForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {signInForm.formState.errors.password && (
                <p className="text-sm text-red-600">{signInForm.formState.errors.password.message}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-lg px-8 py-6"
              disabled={loading}
            >
              {loading ? tLogin("actions.loading") : tLogin("actions.signIn")}
            </Button>
          </form>
        ) : mode === "forgot" ? (
          resetEmailSent ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">{tLogin("messages.resetEmailSent")}</p>
              <Button
                type="button"
                variant="outline"
                className="w-full text-lg px-8 py-6"
                onClick={() => {
                  setMode("signin");
                  setResetEmailSent(false);
                }}
              >
                {tLogin("actions.backToSignIn")}
              </Button>
            </div>
          ) : (
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-sm">
                  {tLogin("fields.email")}
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder={tLogin("placeholders.email")}
                  className={`h-12 text-base ${
                    forgotPasswordForm.formState.errors.email
                      ? "border-red-500 focus-visible:border-red-500"
                      : ""
                  }`}
                  {...forgotPasswordForm.register("email")}
                />
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {forgotPasswordForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-black hover:bg-black/90 text-lg px-8 py-6"
                disabled={loading}
              >
                {loading ? tLogin("actions.sending") : tLogin("actions.sendResetLink")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  forgotPasswordForm.reset();
                }}
              >
                {tLogin("actions.backToSignIn")}
              </Button>
            </form>
          )
        ) : (
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm">
                {tLogin("fields.email")}
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder={tLogin("placeholders.email")}
                className={`h-12 text-base ${
                  signUpForm.formState.errors.email ? "border-red-500 focus-visible:border-red-500" : ""
                }`}
                {...signUpForm.register("email")}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-red-600">{signUpForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm">
                {tLogin("fields.password")}
              </Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={tLogin("placeholders.password")}
                  className={`h-12 text-base pr-10 ${
                    signUpForm.formState.errors.password ? "border-red-500 focus-visible:border-red-500" : ""
                  }`}
                  {...signUpForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-red-600">{signUpForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">
                {tLogin("fields.confirmPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={tLogin("placeholders.confirmPassword")}
                  className={`h-12 text-base pr-10 ${
                    signUpForm.formState.errors.confirmPassword
                      ? "border-red-500 focus-visible:border-red-500"
                      : ""
                  }`}
                  {...signUpForm.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {signUpForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-lg px-8 py-6"
              disabled={loading}
            >
              {loading ? tLogin("actions.loading") : tLogin("actions.signUp")}
            </Button>
          </form>
        )}

        {mode !== "forgot" && (
          <p className="text-center text-sm text-slate-500">
            {mode === "signin" ? (
              <>
                {tLogin("footer.noAccount")}{" "}
                <button
                  type="button"
                  className="text-black font-medium hover:underline"
                  onClick={handleModeSwitch}
                >
                  {tLogin("actions.signUp")}
                </button>
              </>
            ) : (
              <>
                {tLogin("footer.hasAccount")}{" "}
                <button
                  type="button"
                  className="text-black font-medium hover:underline"
                  onClick={handleModeSwitch}
                >
                  {tLogin("actions.signIn")}
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
