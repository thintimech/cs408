export type Difficulty = "easy" | "medium" | "hard";

// 教学内容的一个步骤（用于算法执行过程演示）
export interface AlgorithmStep {
  description: string;
  pseudocode?: string;
  // 用于可视化的状态数据（如数组快照）
  state?: Record<string, unknown>;
}

// 课程的一个章节
export interface LessonSection {
  id: string;
  title: string;
  type: "motivation" | "concept" | "walkthrough" | "detail" | "comparison" | "practice";
  content: string; // Markdown 格式
  steps?: AlgorithmStep[]; // walkthrough 类型使用
}

// 练习题（附属于课程）
export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  hints: string[];
  referenceSolution: string;
}

// 一节课（一个算法/知识点）
export interface Lesson {
  id: string;
  title: string;
  brief: string; // 一句话概括
  prerequisites?: string[]; // 前置知识（帮助学生判断是否准备好）
  analogy?: string; // 生活化类比（一句话，降低认知门槛）
  commonMistakes?: string[]; // 常见误区/易错点
  sections: LessonSection[];
  exercises?: Exercise[];
  keyTakeaways: string[]; // 本节要点
  relatedLessons?: string[]; // 关联课程 id
  memoryAids?: string[]; // 记忆口诀/助记
}

// 一个大章节（如"排序"）
export interface Chapter {
  id: string;
  name: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface EvaluationResult {
  verdict: "correct" | "partial" | "incorrect";
  feedback: string;
  suggestions: string[];
}

export interface ExerciseAttempt {
  exerciseId: string;
  lessonId: string;
  exerciseTitle: string;
  userAnswer: string;
  result: EvaluationResult;
  timestamp: string;
}

export interface LessonProgress {
  lessonId: string;
  sectionsRead: string[]; // 已阅读的 section id
  completed: boolean;
  lastVisit?: string;
}
