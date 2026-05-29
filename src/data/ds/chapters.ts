import { Chapter } from "@/types";
import { introductionLessons } from "./lessons/introduction";
import { searchLessons } from "./search-lessons";
import { searchTreeLessons } from "./lessons/search-tree";
import { searchHashLessons } from "./lessons/search-hash";
import { searchBtreeLessons } from "./lessons/search-btree";
import { graphLessons } from "./graph-lessons";
import { graphBasicsLessons } from "./lessons/graph-basics";
import { graphAoeLessons } from "./lessons/graph-aoe";
import { stringLessons } from "./string-lessons";
import { stringBasicsLessons } from "./lessons/string-basics";
import { sortLessons } from "./lessons/sort-insertion";
import { sortExchangeLessons } from "./lessons/sort-exchange-selection";
import { sortQuickLessons } from "./lessons/sort-quick";
import { sortOtherLessons } from "./lessons/sort-other";
import { sortExternalLessons } from "./lessons/sort-external";
import { stackQueueLessons } from "./lessons/stack-queue";
import { linearListLessons } from "./lessons/linear-list";
import { treeLessons } from "./lessons/tree";

const allSortLessons = [...sortLessons, ...sortExchangeLessons, ...sortQuickLessons, ...sortOtherLessons, ...sortExternalLessons];
const allSearchLessons = [...searchLessons, ...searchTreeLessons, ...searchHashLessons, ...searchBtreeLessons];
const allGraphLessons = [...graphBasicsLessons, ...graphLessons, ...graphAoeLessons];
const allStringLessons = [...stringBasicsLessons, ...stringLessons];

export const chapters: Chapter[] = [
  {
    id: "introduction",
    name: "绪论",
    description: "数据结构基本概念、算法定义与特性、时间/空间复杂度分析",
    icon: "BookOpen",
    lessons: introductionLessons,
  },
  {
    id: "linear-list",
    name: "线性表",
    description: "顺序表与链表的实现、操作、对比与选择",
    icon: "List",
    lessons: linearListLessons,
  },
  {
    id: "stack-queue",
    name: "栈和队列",
    description: "栈与队列的实现、循环队列、双端队列、括号匹配、表达式求值",
    icon: "Layers",
    lessons: stackQueueLessons,
  },
  {
    id: "string",
    name: "串",
    description: "串的基本概念、存储结构、BF朴素匹配、KMP算法与next/nextval优化",
    icon: "Type",
    lessons: allStringLessons,
  },
  {
    id: "tree",
    name: "树与二叉树",
    description: "树的性质、二叉树遍历、线索化、哈夫曼树、并查集",
    icon: "GitBranch",
    lessons: treeLessons,
  },
  {
    id: "graph",
    name: "图",
    description: "图的存储结构、DFS/BFS遍历、最短路径、最小生成树、拓扑排序、关键路径",
    icon: "Share2",
    lessons: allGraphLessons,
  },
  {
    id: "search",
    name: "查找",
    description: "顺序查找、折半查找、分块查找、BST、AVL、B树/B+树、散列表",
    icon: "Search",
    lessons: allSearchLessons,
  },
  {
    id: "sort",
    name: "排序",
    description: "插入排序、交换排序、快速排序、选择排序、归并排序、基数排序、外部排序",
    icon: "ArrowUpDown",
    lessons: allSortLessons,
  },
];
