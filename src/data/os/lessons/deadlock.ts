import { Lesson } from "@/types";

export const deadlockLessons: Lesson[] = [
  {
    id: "deadlock-concepts",
    title: "死锁的概念与条件",
    brief: "理解死锁的定义、四个必要条件和资源分配图",
    analogy: "死锁像十字路口堵车——东西南北四个方向的车都在等对方让路，谁也不退让，全部卡死。打破任何一个方向的「不让路」规则就能解开。",
    prerequisites: ["进程的基本概念", "资源的概念"],
    commonMistakes: [
      "四个条件是必要条件不是充分条件——四个都满足也不一定死锁，但死锁一定四个都满足",
      "死锁 ≠ 饥饿——死锁是互相等待永远不会解开，饥饿是等得太久但理论上能等到",
      "银行家算法是死锁避免（预防性），不是死锁检测（事后发现）",
      "破坏「循环等待」条件最实用——给资源编号，按序申请",
    ],
    memoryAids: [
      "死锁四条件：互斥、占有等待、不可抢占、循环等待（互占不循）",
      "处理策略：预防（破坏条件）→ 避免（银行家）→ 检测+解除（事后处理）",
    ],
    sections: [
      {
        id: "deadlock-definition",
        title: "死锁的定义",
        type: "concept",
        content: `## 什么是死锁

多个进程因竞争资源而造成的一种僵局：每个进程都在等待其他进程释放资源，导致所有进程都无法继续执行。

## 死锁 vs 饥饿 vs 死循环

| 概念 | 描述 | 区别 |
|------|------|------|
| 死锁 | 多个进程互相等待对方的资源 | 至少两个进程参与 |
| 饥饿 | 进程长期得不到资源 | 可能只涉及一个进程 |
| 死循环 | 程序逻辑错误导致无限循环 | 是程序bug，非资源问题 |

## 死锁产生的原因

1. **系统资源不足**：资源数量少于进程需求
2. **进程推进顺序不当**：请求和释放资源的顺序不合理`,
      },
      {
        id: "four-conditions",
        title: "死锁的四个必要条件",
        type: "concept",
        content: `## 四个必要条件（缺一不可）

1. **互斥条件**：资源一次只能被一个进程使用
2. **占有并等待(Hold and Wait)**：进程持有至少一个资源，同时等待获取其他资源
3. **不可抢占(No Preemption)**：已分配的资源不能被强制收回
4. **循环等待(Circular Wait)**：存在进程的循环等待链

## 预防死锁（破坏必要条件）

| 条件 | 破坏方法 | 代价 |
|------|----------|------|
| 互斥 | 通常无法破坏（资源本身特性） | - |
| 占有并等待 | 一次性申请所有资源 | 资源利用率低 |
| 不可抢占 | 允许抢占（进程释放已有资源） | 实现复杂，可能导致前功尽弃 |
| 循环等待 | 资源有序分配（按编号递增申请） | 限制了申请顺序 |`,
      },
      {
        id: "resource-allocation-graph",
        title: "资源分配图",
        type: "detail",
        content: `## 资源分配图

用有向图表示进程和资源的关系：
- **进程节点**：圆形
- **资源节点**：方形（内部圆点表示实例数）
- **请求边**：进程 -> 资源（进程请求资源）
- **分配边**：资源 -> 进程（资源已分配给进程）

## 死锁判定

- 如果图中**无环**：一定没有死锁
- 如果图中**有环**：
  - 每种资源只有一个实例：一定死锁
  - 每种资源有多个实例：可能死锁（需进一步分析）

## 死锁检测算法

类似银行家算法的安全性检查：
1. 找到一个能满足其需求的进程
2. 假设该进程执行完毕并释放资源
3. 重复直到所有进程都能完成（无死锁）或找不到这样的进程（死锁）`,
      },
    ],
    exercises: [
      {
        id: "deadlock-ex1",
        title: "死锁条件分析",
        description: "系统中有3个进程P1、P2、P3和3种资源R1(1个)、R2(1个)、R3(1个)。当前分配情况：P1持有R1请求R2，P2持有R2请求R3，P3持有R3请求R1。判断是否发生死锁，并说明理由。",
        difficulty: "easy",
        hints: [
          "画出资源分配图",
          "检查是否存在循环等待",
          "每种资源只有1个实例时，有环即死锁",
        ],
        referenceSolution: `发生了死锁。

分析：
1. 画出资源分配图：
   P1 -> R2 -> P2 -> R3 -> P3 -> R1 -> P1
   形成了循环等待链。

2. 验证四个必要条件：
   - 互斥：R1、R2、R3都是互斥资源
   - 占有并等待：每个进程都持有一个资源并等待另一个
   - 不可抢占：已分配的资源不能被抢占
   - 循环等待：P1->P2->P3->P1

3. 由于每种资源只有1个实例，存在环路即表示死锁。

解除方法：终止其中一个进程（如P3），释放R3给P2，打破循环。`,
      },
    ],
    keyTakeaways: [
      "死锁的四个必要条件：互斥、占有并等待、不可抢占、循环等待",
      "预防死锁通过破坏必要条件实现，但都有代价",
      "资源分配图中有环且每种资源只有一个实例时必定死锁",
      "死锁检测的本质是判断是否存在安全序列",
    ],
    relatedLessons: ["banker-algorithm", "classic-problems"],
  },
  {
    id: "banker-algorithm",
    title: "银行家算法",
    brief: "掌握银行家算法的数据结构、安全性算法和资源请求算法",
    sections: [
      {
        id: "banker-data-structures",
        title: "银行家算法的数据结构",
        type: "concept",
        content: `## 银行家算法概述

由Dijkstra提出的死锁避免算法。核心思想：在分配资源前，判断分配后系统是否仍处于安全状态。

## 数据结构（n个进程，m种资源）

- **Available[m]**：每种资源当前可用数量
- **Max[n][m]**：每个进程对每种资源的最大需求
- **Allocation[n][m]**：每个进程当前已分配的资源数
- **Need[n][m]**：每个进程还需要的资源数

**关系：** Need[i][j] = Max[i][j] - Allocation[i][j]

## 安全状态

如果系统能找到一个安全序列（所有进程都能顺利完成的执行顺序），则系统处于安全状态。

**安全状态一定不会死锁，不安全状态不一定死锁（但可能死锁）。**`,
      },
      {
        id: "safety-algorithm",
        title: "安全性算法",
        type: "walkthrough",
        content: `## 安全性算法步骤

1. 设 Work = Available, Finish[i] = false
2. 找到满足条件的进程Pi：Finish[i]=false 且 Need[i] <= Work
3. 若找到：Work = Work + Allocation[i], Finish[i] = true，转步骤2
4. 若所有Finish[i]=true，则系统安全

## 示例

5个进程(P0-P4)，3种资源(A=10, B=5, C=7)

| 进程 | Max(A,B,C) | Allocation(A,B,C) | Need(A,B,C) |
|------|------------|-------------------|-------------|
| P0   | 7,5,3      | 0,1,0             | 7,4,3       |
| P1   | 3,2,2      | 2,0,0             | 1,2,2       |
| P2   | 9,0,2      | 3,0,2             | 6,0,0       |
| P3   | 2,2,2      | 2,1,1             | 0,1,1       |
| P4   | 4,3,3      | 0,0,2             | 4,3,1       |

Available = (10-7, 5-2, 7-5) = (3, 3, 2)`,
        steps: [
          {
            description: "初始化：Work=(3,3,2)，所有Finish=false",
            state: { Work: [3, 3, 2], Finish: [false, false, false, false, false], safeSequence: [] },
          },
          {
            description: "检查P1：Need(1,2,2) <= Work(3,3,2)? 是! P1可执行",
            pseudocode: "Need[1]=(1,2,2) <= Work=(3,3,2) => true",
            state: { Work: [5, 3, 2], Finish: [false, true, false, false, false], safeSequence: ["P1"], note: "Work += Allocation[1]=(2,0,0)" },
          },
          {
            description: "检查P3：Need(0,1,1) <= Work(5,3,2)? 是! P3可执行",
            pseudocode: "Need[3]=(0,1,1) <= Work=(5,3,2) => true",
            state: { Work: [7, 4, 3], Finish: [false, true, false, true, false], safeSequence: ["P1", "P3"], note: "Work += Allocation[3]=(2,1,1)" },
          },
          {
            description: "检查P4：Need(4,3,1) <= Work(7,4,3)? 是! P4可执行",
            pseudocode: "Need[4]=(4,3,1) <= Work=(7,4,3) => true",
            state: { Work: [7, 4, 5], Finish: [false, true, false, true, true], safeSequence: ["P1", "P3", "P4"], note: "Work += Allocation[4]=(0,0,2)" },
          },
          {
            description: "检查P0：Need(7,4,3) <= Work(7,4,5)? 是! P0可执行",
            pseudocode: "Need[0]=(7,4,3) <= Work=(7,4,5) => true",
            state: { Work: [7, 5, 5], Finish: [true, true, false, true, true], safeSequence: ["P1", "P3", "P4", "P0"], note: "Work += Allocation[0]=(0,1,0)" },
          },
          {
            description: "检查P2：Need(6,0,0) <= Work(7,5,5)? 是! P2可执行",
            pseudocode: "Need[2]=(6,0,0) <= Work=(7,5,5) => true",
            state: { Work: [10, 5, 7], Finish: [true, true, true, true, true], safeSequence: ["P1", "P3", "P4", "P0", "P2"] },
          },
          {
            description: "所有Finish=true，系统安全！安全序列为<P1,P3,P4,P0,P2>",
            state: { result: "安全", safeSequence: ["P1", "P3", "P4", "P0", "P2"] },
          },
        ],
      },
      {
        id: "request-algorithm",
        title: "资源请求算法",
        type: "detail",
        content: `## 资源请求算法

当进程Pi发出资源请求Request[i]时：

1. 若 Request[i] > Need[i]，出错（超过最大需求）
2. 若 Request[i] > Available，Pi等待
3. 试探性分配：
   - Available = Available - Request[i]
   - Allocation[i] = Allocation[i] + Request[i]
   - Need[i] = Need[i] - Request[i]
4. 执行安全性算法：
   - 安全：正式分配
   - 不安全：撤销试探分配，Pi等待

## 示例

在上述状态下，P1请求资源(1,0,2)：
1. Request(1,0,2) <= Need[1](1,2,2)? 是
2. Request(1,0,2) <= Available(3,3,2)? 是
3. 试探分配后：
   - Available = (2,3,0)
   - Allocation[1] = (3,0,2)
   - Need[1] = (0,2,0)
4. 运行安全性算法检查...`,
      },
    ],
    exercises: [
      {
        id: "banker-ex1",
        title: "银行家算法完整计算",
        description: "系统有A、B、C三种资源，总量分别为9、3、6。有4个进程，当前状态如下：\n\n| 进程 | Max | Allocation |\n|------|-----|------------|\n| P0 | 3,2,2 | 1,0,0 |\n| P1 | 6,1,3 | 5,1,1 |\n| P2 | 3,1,4 | 2,1,1 |\n| P3 | 4,2,2 | 0,0,2 |\n\n(1) 计算Need矩阵和Available向量\n(2) 判断系统是否安全，若安全给出安全序列\n(3) 若P2请求(1,0,0)，能否分配？",
        difficulty: "hard",
        hints: [
          "Available = 总量 - 各进程Allocation之和",
          "Need = Max - Allocation",
          "安全性检查：找Need<=Work的进程",
        ],
        referenceSolution: `(1) 计算：
- Allocation总和 = (8,2,4)
- Available = (9,3,6)-(8,2,4) = (1,1,2)
- Need矩阵：
  P0: (3,2,2)-(1,0,0) = (2,2,2)
  P1: (6,1,3)-(5,1,1) = (1,0,2)
  P2: (3,1,4)-(2,1,1) = (1,0,3)
  P3: (4,2,2)-(0,0,2) = (4,2,0)

(2) 安全性检查：Work=(1,1,2)
- P1: Need(1,0,2)<=(1,1,2)? 是! Work=(6,2,3)
- P0: Need(2,2,2)<=(6,2,3)? 是! Work=(7,2,3)
- P2: Need(1,0,3)<=(7,2,3)? 是! Work=(9,3,4)
- P3: Need(4,2,0)<=(9,3,4)? 是! Work=(9,3,6)
安全序列：<P1,P0,P2,P3>

(3) P2请求(1,0,0)：
- Request(1,0,0)<=Need[2](1,0,3)? 是
- Request(1,0,0)<=Available(1,1,2)? 是
- 试探分配：Available=(0,1,2), Allocation[2]=(3,1,1), Need[2]=(0,0,3)
- 安全性检查：Work=(0,1,2)
  P2: Need(0,0,3)<=(0,1,2)? 否(3>2)
  P1: Need(1,0,2)<=(0,1,2)? 否(1>0)
  P0: Need(2,2,2)<=(0,1,2)? 否
  P3: Need(4,2,0)<=(0,1,2)? 否
  找不到可执行进程，不安全！不能分配。`,
      },
    ],
    keyTakeaways: [
      "银行家算法是死锁避免策略，在分配前检查安全性",
      "安全状态一定不会死锁，不安全状态可能死锁",
      "Need = Max - Allocation，这是核心关系",
      "安全性算法的时间复杂度为O(mn^2)",
      "资源请求算法先试探分配，再检查安全性",
    ],
    relatedLessons: ["deadlock-concepts"],
  },
];
