# ProjectGuard AI — Project Instructions

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode, no `any`)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york, slate base)
- **State**: Zustand (with persist) + TanStack React Query
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **AI**: OpenAI GPT-4o mini (`lib/openai.ts`)
- **i18n**: next-intl (locales: `en`, `ru`; default: `en`)
- **Forms**: react-hook-form + Zod
- **PDF**: @react-pdf/renderer
- **Charts**: recharts

## Project Structure

```
app/[locale]/         # All pages (localized)
  home/               # Landing + auth
  create/             # 10-step project canvas form
  dashboard/          # Scoreboard + project details
  pdf/[id]/           # PDF export
  debug/log/[id]/     # OpenAI debug log viewer
app/api/projects/     # POST: analyze & save project
components/ui/        # shadcn/ui components
lib/
  supabase/           # client.ts (browser), server.ts (SSR)
  prompts/project.ts  # OpenAI prompt generation
  hooks/              # useProjects, useTranslations
store/
  useProjectStore.ts  # 10-step form state (Zustand + persist)
  useAnalizeStore.ts  # Analysis results & versions
types/                # project.ts, analyses.ts, analysis-api.ts
utils/
  analizeProject.ts   # OpenAI call + JSON parsing
  saveAnalysisToDatabase.ts
  mapFormToDatabase.ts
messages/             # en.json, ru.json, uk.json
i18n/config.ts        # Locales config
middleware.ts         # next-intl routing + Supabase auth
```

## Path Aliases

Always use `@/` imports:
```ts
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # optional locally
```

## Key Conventions

### Components
- PascalCase filenames: `AuthForm.tsx`, `Step1BasicInfo.tsx`
- Add `'use client'` only when needed (hooks, browser APIs)
- Shared UI → `components/ui/`, page-specific → co-located

### Utilities & Hooks
- camelCase filenames: `analizeProject.ts`, `useProjects.ts`
- Hooks prefix: `use*`
- Stores prefix: `use*Store.ts`

### i18n
- All user-facing strings must use `useTranslations()`
- Never hardcode UI text — add keys to `messages/en.json` and `messages/ru.json`
- Namespaces map to pages/sections (e.g., `auth`, `dashboard`, `create`)

### Supabase
- Browser components → `lib/supabase/client.ts`
- Server components / API routes → `lib/supabase/server.ts`
- Always verify auth in API routes: `supabase.auth.getUser()`

### Forms (10-step canvas)
- State lives in Zustand (`useProjectStore`) — not local React state
- Per-step validation via `validateStep(step, projectData)` in `create/page.tsx`

### API Routes
- Return `NextResponse.json({ success, data?, error? })`
- Max duration: 300s (long-running OpenAI analysis)
- Auth check mandatory in every protected route

## Analysis Pipeline

```
POST /api/projects
  → analizeProject.ts        # OpenAI call (JSON mode, temp 0.1, 6000 tokens)
  → saveAnalysisToDatabase.ts # Save to project_versions
  → Redirect to /dashboard
```

Prompt generation: `lib/prompts/project.ts`
- `getSystemPrompt(audienceType, language)` — venture | bank | corporate
- `createProjectPrompt(projectData, audienceType)` — user prompt

## Database Tables

- `projects` — project metadata
- `project_versions` — versioned analyses (canvas_data + scores as JSONB)
- `analysis_jobs` — async job status tracking
- `openai_analysis_log` — optional debug logging (best-effort, non-blocking)

## Dev Commands

```bash
npm run dev     # localhost:3000
npm run build   # production build
npm run lint    # ESLint
```

Local Supabase (if using): port 54321 (API), 54322 (DB), 54323 (Studio)

## Commit Convention (Conventional Commits)

```
feat:      new feature           → minor version bump
fix:       bug fix               → patch version bump
refactor:  code restructure      → patch
style:     formatting only       → patch
docs:      documentation         → patch
chore:     maintenance/cleanup   → minor
perf:      performance           → minor
ci:        CI/CD changes         → patch
test:      tests                 → patch
```

Example: `feat(dashboard): add version comparison tab`

## Git Remotes

- `origin` → GitLab (protected branches, no force push)
- `github` → GitHub (BusinessGuard/Project-Guard)

Main working branch: `development`

## Known Issues

- `messages/uk.json` added but not fully integrated (locale not in i18n/config.ts yet)
- Bank & Corporate prompt variants exist in `lib/prompts/project.ts` but unused in API
- `openai_analysis_log` insert is best-effort — errors are logged but don't fail the request
