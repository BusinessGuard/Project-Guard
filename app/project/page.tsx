import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full border-b px-8 py-4">
        <div className="max-w-4xl mx-auto flex justify-end items-center">
          <form action={handleSignOut}>
            <Button type="submit" variant="ghost" className="text-sm">
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-black mb-4">
                {userName ? `Welcome, ${userName}` : 'Welcome'}
              </h1>
              <p className="text-xl text-slate-700">
                Let's evaluate your startup in 3 simple steps:
              </p>
            </div>

            {/* Steps - Highlighted Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="text-2xl font-bold text-slate-400 w-8">1</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">
                    Fill out your business model (7-step form)
                  </h3>
                  <p className="text-sm text-slate-500">Takes 10-15 minutes</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="text-2xl font-bold text-slate-400 w-8">2</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">
                    AI analyzes with 6 expert perspectives
                  </h3>
                  <p className="text-sm text-slate-500">Takes 30 seconds</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="text-2xl font-bold text-slate-400 w-8">3</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">
                    Get actionable insights & growth roadmap
                  </h3>
                  <p className="text-sm text-slate-500">Download PDF report</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 ">
              <Link href="/project/create">
                <Button 
                  size="lg"
                  className="bg-black hover:bg-black/90 text-lg px-8 py-6"
                >
                  Start Your First Project
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
              >
                Watch Quick Tutorial (2min)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
