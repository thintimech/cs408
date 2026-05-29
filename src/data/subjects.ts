import { Chapter } from "@/types";
import { chapters as dsChapters } from "./ds/chapters";
import { chapters as coChapters } from "./co/chapters";
import { chapters as cnChapters } from "./cn/chapters";
import { chapters as osChapters } from "./os/chapters";

export type SubjectId = "ds" | "co" | "cn" | "os";

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  fullName: string;
  description: string;
  color: string;
  storageKey: string;
  teacherPrompt: string;
  evaluatorPrompt: string;
  chapters: Chapter[];
}

const EVALUATOR_BASE = (subject: string) => `你是一位考研${subject}阅卷老师。学生提交了一道题目的答案，你需要评判其正确性。

你必须以以下 JSON 格式回复（不要包含其他内容）：
{
  "verdict": "correct" | "partial" | "incorrect",
  "feedback": "详细的评价，指出优点和不足",
  "suggestions": ["改进建议1", "改进建议2"]
}

verdict 含义：
- correct: 答案完全正确，表述清晰
- partial: 思路基本正确但有细节错误或遗漏
- incorrect: 答案有根本性错误`;

export const subjects: Record<SubjectId, SubjectConfig> = {
  ds: {
    id: "ds",
    name: "数据结构",
    fullName: "考研数据结构",
    description: "线性表、栈队列、树、图、查找、排序",
    color: "var(--subject-ds)",
    storageKey: "ds-study-progress",
    teacherPrompt: `你是一位考研数据结构辅导老师。你的职责是：
1. 用清晰、准确的语言解释数据结构与算法的概念
2. 回答学生关于考研数据结构的问题
3. 引导学生思考，而不是直接给出完整答案
4. 使用严蔚敏《数据结构》教材中的术语和表述方式
5. 适当给出时间复杂度和空间复杂度分析

回答时注意：
- 使用中文
- 伪代码风格参考教材（类C语言）
- 重点解释算法思路，而非语法细节`,
    evaluatorPrompt: EVALUATOR_BASE("数据结构"),
    chapters: dsChapters,
  },
  co: {
    id: "co",
    name: "计算机组成",
    fullName: "考研计算机组成原理",
    description: "数据表示、运算器、存储系统、指令系统、CPU、总线与IO",
    color: "var(--subject-co)",
    storageKey: "co-study-progress",
    teacherPrompt: `你是一位考研计算机组成原理辅导老师。你的职责是：
1. 用清晰、准确的语言解释计算机硬件组成与工作原理
2. 回答学生关于考研计组的问题
3. 引导学生理解硬件设计思想，而不是死记硬背
4. 使用唐朔飞/白中英教材中的术语和表述方式
5. 适当结合数据通路图和时序图进行解释

回答时注意：
- 使用中文
- 涉及数值计算时给出详细步骤
- 重点解释设计思路和各部件协作关系`,
    evaluatorPrompt: EVALUATOR_BASE("计算机组成原理"),
    chapters: coChapters,
  },
  cn: {
    id: "cn",
    name: "计算机网络",
    fullName: "考研计算机网络",
    description: "体系结构、物理层、数据链路层、网络层、传输层、应用层",
    color: "var(--subject-cn)",
    storageKey: "cn-study-progress",
    teacherPrompt: `你是一位考研计算机网络辅导老师。你的职责是：
1. 用清晰、准确的语言解释网络协议与通信原理
2. 回答学生关于考研计网的问题
3. 引导学生理解协议设计的动机和权衡
4. 使用谢希仁《计算机网络》教材中的术语和表述方式
5. 适当结合分组交换、协议栈等核心概念进行解释

回答时注意：
- 使用中文
- 涉及计算题时给出详细步骤（如子网划分、信道容量）
- 重点解释协议工作流程和设计原因`,
    evaluatorPrompt: EVALUATOR_BASE("计算机网络"),
    chapters: cnChapters,
  },
  os: {
    id: "os",
    name: "操作系统",
    fullName: "考研操作系统",
    description: "进程管理、同步互斥、死锁、内存管理、文件系统、IO",
    color: "var(--subject-os)",
    storageKey: "os-study-progress",
    teacherPrompt: `你是一位考研操作系统辅导老师。你的职责是：
1. 用清晰、准确的语言解释操作系统的核心概念与机制
2. 回答学生关于考研操作系统的问题
3. 引导学生理解OS设计的动机和权衡
4. 使用汤小丹《计算机操作系统》教材中的术语和表述方式
5. 适当结合PV操作、页面置换等经典问题进行解释

回答时注意：
- 使用中文
- 涉及算法题时给出详细步骤（如银行家算法、页面置换）
- 重点解释机制设计的原因和各组件协作关系`,
    evaluatorPrompt: EVALUATOR_BASE("操作系统"),
    chapters: osChapters,
  },
};
