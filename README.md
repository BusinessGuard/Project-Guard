# ProjectGuard

ProjectGuard is a Next.js (App Router) web app that lets a signed-in user fill a **10-step project canvas**, sends it to OpenAI for analysis, and stores both the raw canvas and analysis results in **Supabase**. The dashboard then shows the latest project and its versioned analyses.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## High-level flow

1. User completes the **10-step form** at `/<locale>/create`.
2. App sends the full `projectData` to `POST /api/projects`.
3. Server:
   - verifies Supabase auth
   - runs OpenAI analysis (JSON response)
   - writes to Supabase: `projects` + `project_versions`
   - logs the OpenAI prompt/response to `openai_analysis_log` (best-effort)
4. App redirects to `/<locale>/dashboard`, which loads the **most recently created** project.

## Routing & pages (App Router)

- **Home / auth**: `app/[locale]/home/*`
- **Create flow** (10-step canvas): `app/[locale]/create/page.tsx`
- **Dashboard** (scoreboard): `app/[locale]/dashboard/page.tsx`
- **Debug log page** (by project version): `app/[locale]/debug/log/[projectVersionId]/page.tsx`
- **API**:
  - `POST /api/projects`: `app/api/projects/route.ts`
  - Supabase auth callback: `app/auth/callback/route.ts`

## 10-step form architecture

### Orchestration

- **Entry**: `app/[locale]/create/page.tsx`
- Renders one of `Step1BasicInfo` … `Step10Growth` based on `currentStep`.
- Per-step completeness is enforced by `validateStep(step, projectData)`; navigation/submit is disabled until required fields are filled.
- On completion of step 10, the create flow submits `projectData` to `/api/projects`.

### State management

- Store: `store/useProjectStore.ts` (Zustand + `persist`)
  - `projectData`: typed as `ProjectData` (`types/project.ts`)
  - `currentStep`: 1…10
  - `updateX(...)` setters per section (basicInfo, valueProposition, …, growth)
  - `resetProject()`
- Persistence key: `project-storage` (browser storage), so the form survives refreshes.

### Step components

Located in `app/[locale]/create/components/`:

- `Step1BasicInfo.tsx` … `Step10Growth.tsx`
- Each step reads/writes only its slice of `projectData` via `useProjectStore()`.

## Analysis pipeline (OpenAI)

### Where analysis happens

- `utils/analizeProject.ts` calls OpenAI `chat.completions.create(...)` (JSON mode).
- Prompts come from `lib/prompts/project.ts`:
  - **System prompt**: `getExpertPanelSystemPrompt(language)`
  - **User prompt**: `createProjectPrompt(projectData, language)` (filled with the submitted canvas)

### Prompt variants (not used)

Additional prompt variants exist for future use and are **not wired anywhere**:

- **Bank**: `getBankCreditCommitteeSystemPrompt`, `createBankProjectPrompt`
- **Corporate**: `getCorporateStrategyReviewSystemPrompt`, `createCorporateProjectPrompt`

## Database (Supabase)

This app expects these main tables (see `supabase/migrations/*` and `database.sql` for reference).

### `projects`

High-level metadata:

- `user_id`
- `name`
- `industry`
- `stage`
- timestamps

### `project_versions`

One row per analysis/version:

- `project_id`
- `version_number`, `is_current`
- `canvas_data` (**full 10-step form** stored as JSONB)
- analysis scores and JSON blobs (`experts`, `recommendations`, `growth_phases`, financial forecast fields, etc.)

### `openai_analysis_log` (optional / best-effort)

Debug logging table used by `POST /api/projects` to store:

- `project_version_id` (links the log to the created version)
- `user_prompt` (the exact user prompt string sent to OpenAI)
- `openai_response` (raw OpenAI response object as JSONB)

Important:
- The API insert into `openai_analysis_log` is **best-effort**. If the table does not exist or RLS blocks it, the error is logged on the server, but the project save still succeeds.
- The debug UI reads from this table (and will show an error if the row/table is missing).

## “Which project does the dashboard show?”

The dashboard loads the **first project** returned by:

```ts
supabase.from('projects').select('*').order('created_at', { ascending: false })
```

So `/ru/dashboard` shows the **most recently created** project for the logged-in user.

## Debug tooling

### OpenAI request/response viewer

Web page:

- `/<locale>/debug/log/<projectVersionId>`

It displays:
- **Request (user prompt)**: full prompt text
- **Response (OpenAI)**: only `choices[0].message.content` (pretty-printed JSON if possible)

## Environment variables (high level)

This project uses Supabase and OpenAI. Do not commit secrets.

Common variables (names may vary by setup):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- OpenAI key used by `lib/openai.ts` (check that file for the exact env var name)

## CI/CD

> **Recommendation**
>
> - Name the merge requests the same as the latest commit message in the branch
>   being merged.
> - Only merges from the `development` branch are allowed into the `main` branch
>   to automatically create a release with the latest version.
> - Only when merging from the `development` branch into the `main` branch, do
>   not use squash commit.

### Using semantic-release

semantic-release automates the package release workflow including: determining
the next version number, generating the release notes, and publishing the
package. This removes the immediate connection between human emotions and
version numbers, strictly following the
[Semantic Versioning Specification](http://semver.org/) and communicating the
impact of changes to consumers.

#### MAJOR.MINOR.PATCH version numbering

Increment the:

- MAJOR version when making incompatible API changes,
- MINOR version when adding functionality in a backward compatible manner,
- PATCH version when making backward compatible bug fixes.

#### Rules for committing to development branch

| commit    | release | next version | sample commit message                               |
| --------- | ------- | ------------ | --------------------------------------------------- |
| refactor: | patch   | 1.0.0->1.0.1 | refactor: implement calculation method as recursion |
| fix:      | patch   | 1.0.0->1.0.1 | fix: add missing parameter to service call          |
| docs:     | patch   | 1.0.0->1.0.1 | docs: update readme                                 |
| style:    | patch   | 1.0.0->1.0.1 | style: update readme                                |
| test:     | patch   | 1.0.0->1.0.1 | test: update unit tes                               |
| build:    | major   | 1.0.0->2.0.0 | build: upated look file                             |
| ci        | patch   | 1.0.0->1.0.1 | ci: add new stage (integration test)                |
| revert    | patch   | 1.0.0->1.0.1 | revert: revert to commit                            |
| feat:     | minor   | 1.0.0->1.1.0 | feat(lang): add Polish language                     |
| chore:    | minor   | 1.0.0->1.1.0 | chore: drop support for Node 6                      |
| perf:     | minor   | 1.0.0->1.1.0 | perf: -//-                                          |

#### Conventional Commits

- The Conventional Commits specification is a lightweight convention on top of
  commit messages. It provides an easy set of rules for creating an explicit
  commit history; which makes it easier to write automated tools on top of. This
  convention dovetails with SemVer, by describing the features, fixes, and
  breaking changes made in commit messages.

- The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- The commit contains the following structural elements, to communicate intent
  to the consumers of your library:

1. fix: a commit of the type fix patches a bug in your codebase (this correlates
   with PATCH in Semantic Versioning).

2. feat: a commit of the type feat introduces a new feature to the codebase
   (this correlates with MINOR in Semantic Versioning).

3. BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a !
   after the type/scope, introduces a breaking API change (correlating with
   MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of
   any type.

4. types other than fix: and feat: are allowed, for example
   @commitlint/config-conventional (based on the Angular convention) recommends
   build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.

https://www.conventionalcommits.org/en/v1.0.0/
