import { Chapter } from "@/types";
import { overviewLessons } from "./lessons/overview";
import { processLessons } from "./lessons/process";
import { syncLessons } from "./lessons/sync";
import { deadlockLessons } from "./lessons/deadlock";
import { memoryLessons } from "./lessons/memory";
import { memoryExtraLessons } from "./lessons/memory-extra";
import { fileLessons } from "./lessons/file";
import { ioLessons } from "./lessons/io";

const allMemoryLessons = [...memoryLessons, ...memoryExtraLessons];

export const chapters: Chapter[] = [
  { id: "overview", name: "操作系统概述", description: "OS定义与特征、中断与异常、系统调用、用户态与核心态", icon: "BookOpen", lessons: overviewLessons },
  { id: "process", name: "进程管理", description: "进程与线程、进程调度算法、调度准则", icon: "Cpu", lessons: processLessons },
  { id: "sync", name: "同步与互斥", description: "临界区、信号量、PV操作、经典同步问题", icon: "Lock", lessons: syncLessons },
  { id: "deadlock", name: "死锁", description: "死锁条件、预防、避免(银行家算法)、检测与解除", icon: "AlertTriangle", lessons: deadlockLessons },
  { id: "memory", name: "内存管理", description: "连续分配、分页、分段、段页式、虚拟内存、页面置换", icon: "HardDrive", lessons: allMemoryLessons },
  { id: "file", name: "文件系统", description: "文件结构、目录、磁盘调度算法", icon: "FolderOpen", lessons: fileLessons },
  { id: "io", name: "IO管理", description: "IO控制方式、缓冲、SPOOLing技术", icon: "Monitor", lessons: ioLessons },
];
