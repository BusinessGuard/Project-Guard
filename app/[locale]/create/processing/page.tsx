"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAnonymousProjectId } from "@/lib/utils/anonymousProject";
import { LoadingScreen } from "../components/LoadingScreen";

interface JobStatusResponse {
  success: boolean;
  jobId?: string;
  status?: "pending" | "processing" | "completed" | "failed";
  projectId?: string | null;
  error?: string | null;
}

export default function ProcessingPage() {
  const t = useTranslations("create");
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const startedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || startedRef.current) return;
    
    // Global protection against duplicate requests
    const globalKey = `analysis_running_${jobId}`;
    if (typeof window !== 'undefined' && (window as any)[globalKey]) {
      console.log('⚠️ Analysis already running for jobId:', jobId);
      return;
    }
    if (typeof window !== 'undefined') {
      (window as any)[globalKey] = true;
    }
    
    startedRef.current = true;

    const pollJobUntilDone = async (activeJobId: string): Promise<string> => {
      const maxAttempts = 240; // ~8 minutes with 2s interval

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const statusResponse = await fetch(`/api/projects/jobs/${activeJobId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!statusResponse.ok) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }

        const statusData = (await statusResponse.json()) as JobStatusResponse;
        if (statusData.status === "completed" && statusData.projectId) {
          return statusData.projectId;
        }

        if (statusData.status === "failed") {
          throw new Error(statusData.error || "Analysis job failed");
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      throw new Error("Timed out while waiting for analysis result");
    };

    const run = async () => {
      try {
        const payloadRaw = sessionStorage.getItem("analysisRequestPayload");
        if (!payloadRaw) {
          throw new Error("Missing analysis payload");
        }

        const payload = JSON.parse(payloadRaw) as { projectData: any; projectId?: string };
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000);

        try {
          const response = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, jobId }),
            signal: controller.signal,
            keepalive: true,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const result = await response.json();
          const resolvedProjectId = result?.projectId as string | undefined;
          if (!resolvedProjectId) {
            throw new Error("No projectId in response");
          }

          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            setAnonymousProjectId(resolvedProjectId);
          }

          sessionStorage.removeItem("analysisRequestPayload");
          router.replace(`/dashboard/projects/${resolvedProjectId}`);
          return;
        } catch (networkError) {
          clearTimeout(timeoutId);

          if (!(networkError instanceof TypeError)) {
            throw networkError;
          }
        }

        const resolvedProjectId = await pollJobUntilDone(jobId);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setAnonymousProjectId(resolvedProjectId);
        }

        sessionStorage.removeItem("analysisRequestPayload");
        router.replace(`/dashboard/projects/${resolvedProjectId}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to process analysis";
        setError(message);
      }
    };

    run();
  }, [jobId, router]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-xl font-semibold text-black">{error}</p>
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={() => router.push("/create")}
        >
          {t("title")}
        </button>
      </div>
    );
  }

  return <LoadingScreen text={t("analyzing")} />;
}
