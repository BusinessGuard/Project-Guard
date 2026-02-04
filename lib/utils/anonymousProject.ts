// Utility functions for managing anonymous user's project in localStorage

const ANONYMOUS_PROJECT_KEY = 'anonymous_project_id';

export function getAnonymousProjectId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ANONYMOUS_PROJECT_KEY);
}

export function setAnonymousProjectId(projectId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ANONYMOUS_PROJECT_KEY, projectId);
}

export function clearAnonymousProjectId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ANONYMOUS_PROJECT_KEY);
}

export function hasAnonymousProject(): boolean {
  return getAnonymousProjectId() !== null;
}
