import type { UserProgress } from './types';

const STORAGE_KEY = 'cat4-ai-dashboard-progress';

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function loadProgress(): UserProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProgress;
  } catch (e) {
    console.error('Failed to load progress:', e);
    return null;
  }
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
