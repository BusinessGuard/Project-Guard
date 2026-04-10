import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';

interface PageProps {
  params: Promise<{ projectVersionId: string }>;
}

export default async function DebugLogPage({ params }: PageProps) {
  const { projectVersionId } = await params;
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'debugLog' });

  const { data: row, error } = await supabase
    .from('openai_analysis_log')
    .select('id, project_version_id, user_prompt, system_prompt, openai_response, created_at')
    .eq('project_version_id', projectVersionId)
    .maybeSingle();

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 font-sans">
        <div className="max-w-4xl mx-auto rounded-lg bg-red-50 border border-red-200 p-6 text-red-800">
          <h1 className="text-xl font-bold mb-2">{t('errorTitle')}</h1>
          <p className="text-sm font-mono">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!row) {
    notFound();
  }

  const res = row.openai_response as {
    choices?: Array<{ message?: { content?: string | null } }>;
  } | null;
  const rawContent = res?.choices?.[0]?.message?.content ?? '';
  let responseDisplay: string;
  if (rawContent) {
    const trimmed = rawContent.trim().replace(/^```json\n?/g, '').replace(/\n?```$/g, '');
    try {
      responseDisplay = JSON.stringify(JSON.parse(trimmed), null, 2);
    } catch {
      responseDisplay = rawContent;
    }
  } else {
    responseDisplay = t('noContent');
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            {t('pageTitle')}
          </h1>
          <p className="text-sm text-slate-500">
            {new Date(row.created_at).toISOString()} · {row.project_version_id}
          </p>
        </header>

        {row.system_prompt != null && (
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="bg-slate-700 text-white px-4 py-2 text-sm font-semibold">
              System prompt
            </h2>
            <pre className="p-4 text-sm text-slate-800 overflow-x-auto whitespace-pre-wrap font-mono border-t border-slate-200 max-h-[40vh] overflow-y-auto">
              {row.system_prompt}
            </pre>
          </section>
        )}

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <h2 className="bg-slate-800 text-white px-4 py-2 text-sm font-semibold">
            {t('requestHeading')}
          </h2>
          <pre className="p-4 text-sm text-slate-800 overflow-x-auto whitespace-pre-wrap font-mono border-t border-slate-200 max-h-[60vh] overflow-y-auto">
            {row.user_prompt}
          </pre>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <h2 className="bg-slate-800 text-white px-4 py-2 text-sm font-semibold">
            {t('responseHeading')}
          </h2>
          <pre className="p-4 text-sm text-slate-800 overflow-x-auto whitespace-pre-wrap font-mono border-t border-slate-200 max-h-[60vh] overflow-y-auto">
            {responseDisplay}
          </pre>
        </section>
      </div>
    </div>
  );
}
