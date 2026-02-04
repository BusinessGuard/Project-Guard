import { hasAnonymousProject } from './anonymousProject';

export function hasDemoLimit(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if user already has an anonymous project in localStorage
  return hasAnonymousProject();
}
