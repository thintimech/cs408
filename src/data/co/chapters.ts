import { Chapter } from "@/types";
import { overviewCoLessons } from "./lessons/overview";
import { dataReprLessons } from "./lessons/data-repr";
import { aluLessons } from "./lessons/alu";
import { aluDivisionLessons } from "./lessons/alu-division";
import { memorySysLessons } from "./lessons/memory-sys";
import { instructionLessons } from "./lessons/instruction";
import { cpuLessons } from "./lessons/cpu-design";
import { datapathMethodLessons } from "./lessons/cpu-datapath-method";
import { busIoLessons } from "./lessons/bus-io";

export const chapters: Chapter[] = [
  {
    id: "overview",
    name: "计算机系统概述",
    description: "冯·诺依曼体系结构、计算机硬件组成、性能指标(CPI/MIPS)",
    icon: "Monitor",
    lessons: overviewCoLessons,
  },
  {
    id: "data-repr",
    name: "数据的表示和运算",
    description: "进制转换、定点数与浮点数表示、IEEE 754标准、补码运算",
    icon: "Binary",
    lessons: dataReprLessons,
  },
  {
    id: "alu",
    name: "运算器",
    description: "加法器设计、并行进位、ALU功能、原码/补码乘除法",
    icon: "Calculator",
    lessons: [...aluLessons, ...aluDivisionLessons],
  },
  {
    id: "memory",
    name: "存储系统",
    description: "存储器层次结构、Cache映射与替换、虚拟存储器",
    icon: "Database",
    lessons: memorySysLessons,
  },
  {
    id: "instruction",
    name: "指令系统",
    description: "指令格式设计、寻址方式、CISC与RISC",
    icon: "FileCode",
    lessons: instructionLessons,
  },
  {
    id: "cpu",
    name: "中央处理器",
    description: "数据通路、硬布线与微程序控制器、指令流水线",
    icon: "Cpu",
    lessons: [...cpuLessons, ...datapathMethodLessons],
  },
  {
    id: "bus-io",
    name: "总线与IO",
    description: "总线结构与仲裁、程序查询/中断/DMA方式",
    icon: "Bus",
    lessons: busIoLessons,
  },
];
