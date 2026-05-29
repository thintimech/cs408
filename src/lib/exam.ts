import { Exercise, Chapter, Difficulty } from "@/types";

export interface ExamConfig {
  questionCount: number;
  timeLimit: number; // minutes, 0 = no limit
  chapters: string[]; // chapter IDs, empty = all
  difficulty: Difficulty | "all";
}

export interface ExamQuestion {
  exercise: Exercise;
  chapterName: string;
  lessonTitle: string;
}

export function selectQuestions(
  chapters: Chapter[],
  config: ExamConfig
): ExamQuestion[] {
  const pool: ExamQuestion[] = [];

  const targetChapters = config.chapters.length > 0
    ? chapters.filter((c) => config.chapters.includes(c.id))
    : chapters;

  for (const chapter of targetChapters) {
    for (const lesson of chapter.lessons) {
      if (!lesson.exercises) continue;
      for (const exercise of lesson.exercises) {
        if (config.difficulty !== "all" && exercise.difficulty !== config.difficulty) continue;
        pool.push({ exercise, chapterName: chapter.name, lessonTitle: lesson.title });
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, config.questionCount);
}
