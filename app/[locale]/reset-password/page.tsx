"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/lib/navigation";

type FormData = { password: string; confirmPassword: string };

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(6, t("validation.passwordMin")),
          confirmPassword: z.string().min(6, t("validation.passwordMin")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("validation.passwordsDontMatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    document.title = `${tNav("appName")} | ${t("documentTitle")}`;
  }, [tNav, t]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!cancelled) {
        setHasSession(!!session);
        setSessionChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      form.setError("root", { message: error.message });
      return;
    }
    setDone(true);
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
        <p className="text-slate-600">{t("checkingSession")}</p>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 px-4 gap-6">
        <p className="text-slate-700 text-center max-w-md">{t("sessionMissing")}</p>
        <Button type="button" onClick={() => router.push("/login")}>
          {t("goToLogin")}
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 px-4 gap-4 max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-bold text-black">{t("successTitle")}</h1>
        <p className="text-slate-600">{t("successMessage")}</p>
        <Button type="button" onClick={() => router.push("/login")}>
          {t("goToLogin")}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white rounded-xl shadow-sm p-8 border border-slate-100">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black">{t("title")}</h1>
          <p className="text-slate-600">{t("subtitle")}</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">{t("newPassword")}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("placeholder")}
                className={`h-12 pr-10 ${form.formState.errors.password ? "border-red-500" : ""}`}
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">{t("confirmPassword")}</Label>
            <div className="relative">
              <Input
                id="confirm-new-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("confirmPlaceholder")}
                className={`h-12 pr-10 ${form.formState.errors.confirmPassword ? "border-red-500" : ""}`}
                {...form.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showConfirm ? t("hidePassword") : t("showPassword")}
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
          )}

          <Button type="submit" className="w-full h-12 text-base" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t("loading") : t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
