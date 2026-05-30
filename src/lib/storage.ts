import { LessonProgress, ExerciseAttempt, EvaluationResult } from "@/types";

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

export function markSectionRead(storageKey: string, lessonId: string, sectionId: string): boolean {
  const all = getProgress(storageKey);
  const current = all[lessonId] || { lessonId, sectionsRead: [], completed: false };
  if (!current.sectionsRead.includes(sectionId)) {
    current.sectionsRead.push(sectionId);
  }
  current.lastVisit = new Date().toISOString();
  all[lessonId] = current;
  try {
    localStorage.setItem(storageKey, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

export function markLessonCompleted(storageKey: string, lessonId: string): boolean {
  const all = getProgress(storageKey);
  const current = all[lessonId] || { lessonId, sectionsRead: [], completed: false };
  current.completed = true;
  current.lastVisit = new Date().toISOString();
  all[lessonId] = current;
  try {
    localStorage.setItem(storageKey, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

const MAX_MISTAKES = 200;

function getMistakesKey(storageKey: string): string {
  return `${storageKey}-mistakes`;
}

export function saveExerciseAttempt(
  storageKey: string,
  attempt: Omit<ExerciseAttempt, "timestamp">
): void {
  if (typeof window === "undefined") return;
  const key = getMistakesKey(storageKey);
  try {
    const raw = localStorage.getItem(key);
    const all: ExerciseAttempt[] = raw ? JSON.parse(raw) : [];

    const entry: ExerciseAttempt = { ...attempt, timestamp: new Date().toISOString() };

    if (entry.result.verdict === "correct") {
      const filtered = all.filter((a) => a.exerciseId !== attempt.exerciseId);
      localStorage.setItem(key, JSON.stringify(filtered));
      return;
    }

    const idx = all.findIndex((a) => a.exerciseId === attempt.exerciseId);
    if (idx >= 0) {
      all[idx] = entry;
    } else {
      all.push(entry);
    }

    const trimmed = all.length > MAX_MISTAKES ? all.slice(-MAX_MISTAKES) : all;
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch {}
}

export function getWrongAnswers(storageKey: string): ExerciseAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getMistakesKey(storageKey));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function removeWrongAnswer(storageKey: string, exerciseId: string): void {
  if (typeof window === "undefined") return;
  const key = getMistakesKey(storageKey);
  try {
    const raw = localStorage.getItem(key);
    const all: ExerciseAttempt[] = raw ? JSON.parse(raw) : [];
    const filtered = all.filter((a) => a.exerciseId !== exerciseId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch {}
}
