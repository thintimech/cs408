import { LessonProgress } from "@/types";

export function getProgress(storageKey: string): Record<string, LessonProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLessonProgress(storageKey: string, lessonId: string): LessonProgress {
  const all = getProgress(storageKey);
  return all[lessonId] || { lessonId, sectionsRead: [], completed: false };
}

export function markSectionRead(storageKey: string, lessonId: string, sectionId: string) {
  const all = getProgress(storageKey);
  const current = all[lessonId] || { lessonId, sectionsRead: [], completed: false };
  if (!current.sectionsRead.includes(sectionId)) {
    current.sectionsRead.push(sectionId);
  }
  current.lastVisit = new Date().toISOString();
  all[lessonId] = current;
  try { localStorage.setItem(storageKey, JSON.stringify(all)); } catch { /* quota exceeded */ }
}

export function markLessonCompleted(storageKey: string, lessonId: string) {
  const all = getProgress(storageKey);
  const current = all[lessonId] || { lessonId, sectionsRead: [], completed: false };
  current.completed = true;
  current.lastVisit = new Date().toISOString();
  all[lessonId] = current;
  try { localStorage.setItem(storageKey, JSON.stringify(all)); } catch { /* quota exceeded */ }
}
