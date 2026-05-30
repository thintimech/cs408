import { Lesson } from "@/types";

export const cpuLessons: Lesson[] = [
  {
    id: "datapath",
    title: "数据通路",
    brief: "理解CPU内部单总线/多总线结构及指令执行的微操作序列",
    sections: [
      {
        id: "dp-motivation",
        title: "数据通路的作用",
        type: "motivation",
        content: `数据通路是CPU内部各功能部件之间传送数据的路径。理解数据通路就是理解"指令是如何一步步执行的"。

考研中常考：给定一条指令，写出其在单总线结构下的微操作序列。这需要清楚每个寄存器的功能和数据流向。`,
      },
      {
        id: "dp-registers",
        title: "CPU主要寄存器",
        type: "concept",
        content: `## 核心寄存器

| 寄存器 | 全称 | 功能 |
|--------|------|------|
| PC | Program Counter | 程序计数器，存放下一条指令地址 |
| IR | Instruction Register | 指令寄存器，存放当前执行的指令 |
| MAR | Memory Address Register | 存储器地址寄存器，送往地址总线 |
| MDR | Memory Data Register | 存储器数据寄存器，与数据总线交换数据 |
| ACC | Accumulator | 累加器，存放运算结果 |
| MQ | Multiplier-Quotient | 乘商寄存器 |
| X | Operand Register | 操作数寄存器 |
| PSW | Program Status Word | 程序状态字（标志位） |

## 数据通路结构

### 单总线结构
所有寄存器通过一条公共总线连接。
- 优点：结构简单，成本低
- 缺点：同一时刻只能有一个数据传送，效率低

### 多总线结构
使用2-3条总线，允许同时传送多个数据。
- 优点：并行度高，速度快
- 缺点：硬件复杂

### 专用数据通路
部件之间有专用连接线。
- 优点：速度最快
- 缺点：硬件量最大`,
      },
      {
        id: "dp-execution",
        title: "指令执行过程",
        type: "detail",
        content: `## 指令周期的四个阶段

### 1. 取指周期（Fetch）
\`\`\`
PC -> MAR -> 地址总线 -> 主存
主存 -> 数据总线 -> MDR -> IR
OP(IR) -> CU（译码）
PC + 1 -> PC
\`\`\`

### 2. 间址周期（Indirect）—— 间接寻址时
\`\`\`
Ad(IR) -> MAR -> 地址总线 -> 主存
主存 -> 数据总线 -> MDR（得到有效地址）
\`\`\`

### 3. 执行周期（Execute）
根据指令类型执行不同操作（见下方示例）

### 4. 中断周期（Interrupt）—— 有中断请求时
\`\`\`
SP - 1 -> SP -> MAR
PC -> MDR -> 主存（保存断点）
中断向量地址 -> PC
\`\`\`

## 单总线结构下的微操作示例

**ADD X 指令**（将主存X单元的数加到ACC）：
\`\`\`
取指：PC -> MAR, 1 -> R
      M(MAR) -> MDR
      MDR -> IR, (PC)+1 -> PC
执行：Ad(IR) -> MAR, 1 -> R
      M(MAR) -> MDR
      (ACC) + (MDR) -> ACC
\`\`\``,
      },
      {
        id: "dp-animator",
        title: "数据通路动画模拟",
        type: "walkthrough",
        content: `下面是一个交互式数据通路动画。选择不同指令，观察数据在各部件间的流动过程和控制信号的变化：`,
        steps: [
          {
            description: "ADD指令：R[3] ← R[3] + R[2]（寄存器加法）",
            state: {
              type: "datapath",
              config: {
                instruction: "ADD R3, R2",
                semantics: "R[3] <- R[3] + R[2]",
                steps: [
                  { cycle: 1, description: "取指：PC->MAR，读内存", activeComponents: ["PC", "MAR", "MEM"], activeSignals: { "MAR_Src": "PC", "MemRead": "1" }, dataFlow: [{ from: "PC", to: "MAR" }, { from: "MAR", to: "MEM" }] },
                  { cycle: 2, description: "取指：内存->MDR->IR，PC+1", activeComponents: ["MEM", "MDR", "PC"], activeSignals: { "PCin": "+1" }, dataFlow: [{ from: "MEM", to: "MDR" }] },
                  { cycle: 3, description: "译码：读R[3]->busA，读R[2]->busB", activeComponents: ["GPRS", "MUX_A", "MUX_B"], activeSignals: { "AluASrc": "busA", "AluBSrc": "busB" }, dataFlow: [{ from: "GPRS", to: "MUX_A" }, { from: "GPRS", to: "MUX_B" }] },
                  { cycle: 4, description: "执行：ALU做加法", activeComponents: ["MUX_A", "MUX_B", "ALU"], activeSignals: { "AluOp": "ADD" }, dataFlow: [{ from: "MUX_A", to: "ALU" }, { from: "MUX_B", to: "ALU" }] },
                  { cycle: 5, description: "写回：ALU结果->busW->R[3]", activeComponents: ["ALU", "MUX_W", "GPRS"], activeSignals: { "RegWSrc": "ALU", "RegWr": "1" }, dataFlow: [{ from: "ALU", to: "MUX_W" }, { from: "MUX_W", to: "GPRS" }] },
                ],
              },
            },
          },
          {
            description: "LOAD指令：R[0] <- M[R[15] + offset]（取数）",
            state: {
              type: "datapath",
              config: {
                instruction: "LW R0, offset(R15)",
                semantics: "R[0] <- M[R[15] + offset]",
                steps: [
                  { cycle: 1, description: "取指：PC->MAR，读内存", activeComponents: ["PC", "MAR", "MEM"], activeSignals: { "MAR_Src": "PC" }, dataFlow: [{ from: "PC", to: "MAR" }, { from: "MAR", to: "MEM" }] },
                  { cycle: 2, description: "取指完成，PC+1", activeComponents: ["MEM", "MDR", "PC"], activeSignals: { "PCin": "+1" }, dataFlow: [{ from: "MEM", to: "MDR" }] },
                  { cycle: 3, description: "译码：读R[15]->busA，offset经扩展器", activeComponents: ["GPRS", "EXT", "MUX_A", "MUX_B"], activeSignals: { "AluASrc": "busA", "AluBSrc": "Ext" }, dataFlow: [{ from: "GPRS", to: "MUX_A" }, { from: "EXT", to: "MUX_B" }] },
                  { cycle: 4, description: "执行：ALU计算地址 R[15]+offset", activeComponents: ["ALU", "MAR"], activeSignals: { "AluOp": "ADD", "MAR_Src": "ALU" }, dataFlow: [{ from: "MUX_A", to: "ALU" }, { from: "MUX_B", to: "ALU" }, { from: "ALU", to: "MAR" }] },
                  { cycle: 5, description: "访存：MAR->主存，数据->MDR", activeComponents: ["MAR", "MEM", "MDR"], activeSignals: { "MemRead": "1" }, dataFlow: [{ from: "MAR", to: "MEM" }, { from: "MEM", to: "MDR" }] },
                  { cycle: 6, description: "写回：MDR->busW->R[0]", activeComponents: ["MDR", "MUX_W", "GPRS"], activeSignals: { "RegWSrc": "MDR", "RegWr": "1" }, dataFlow: [{ from: "MDR", to: "MUX_W" }, { from: "MUX_W", to: "GPRS" }] },
                ],
              },
            },
          },
          {
            description: "STORE指令：M[R[15] + offset] <- R[0]（存数）",
            state: {
              type: "datapath",
              config: {
                instruction: "SW R0, offset(R15)",
                semantics: "M[R[15] + offset] <- R[0]",
                steps: [
                  { cycle: 1, description: "取指：PC->MAR，读内存", activeComponents: ["PC", "MAR", "MEM"], activeSignals: { "MAR_Src": "PC", "MemRead": "1" }, dataFlow: [{ from: "PC", to: "MAR" }, { from: "MAR", to: "MEM" }] },
                  { cycle: 2, description: "取指完成，PC+1", activeComponents: ["MEM", "MDR", "PC"], activeSignals: { "PCin": "+1" }, dataFlow: [{ from: "MEM", to: "MDR" }] },
                  { cycle: 3, description: "译码：读R[15]->busA，offset经扩展器", activeComponents: ["GPRS", "EXT", "MUX_A", "MUX_B"], activeSignals: { "AluASrc": "busA", "AluBSrc": "Ext" }, dataFlow: [{ from: "GPRS", to: "MUX_A" }, { from: "EXT", to: "MUX_B" }] },
                  { cycle: 4, description: "执行：ALU计算地址，结果->MAR", activeComponents: ["ALU", "MAR"], activeSignals: { "AluOp": "ADD", "MAR_Src": "ALU" }, dataFlow: [{ from: "MUX_A", to: "ALU" }, { from: "MUX_B", to: "ALU" }, { from: "ALU", to: "MAR" }] },
                  { cycle: 5, description: "写存：读R[0]->MDR，MDR->主存", activeComponents: ["GPRS", "MDR", "MEM"], activeSignals: { "MemWrite": "1" }, dataFlow: [{ from: "GPRS", to: "MDR" }, { from: "MDR", to: "MEM" }] },
                ],
              },
            },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "dp-ex1",
        title: "微操作序列",
        description: "在单总线CPU结构中，写出指令 STA X（将ACC的内容存入主存X单元）的完整微操作序列（包括取指和执行阶段）。",
        difficulty: "medium",
        hints: [
          "取指阶段是固定的三步",
          "STA是存数指令，需要将ACC送入主存",
          "注意MAR和MDR的使用顺序",
        ],
        referenceSolution: `取指阶段：
  PC -> MAR, 1 -> R        (将PC送MAR，启动读)
  M(MAR) -> MDR            (从主存读出指令)
  MDR -> IR, (PC)+1 -> PC  (指令送IR，PC自增)

执行阶段：
  Ad(IR) -> MAR, 1 -> W    (指令地址码送MAR，启动写)
  ACC -> MDR               (ACC内容送MDR)
  MDR -> M(MAR)            (MDR写入主存)

共6个微操作，取指3个+执行3个。`,
      },
    ],
    keyTakeaways: [
      "PC存下条指令地址，IR存当前指令，MAR/MDR是CPU与主存的接口",
      "单总线结构简单但同一时刻只能传一个数据",
      "指令执行四阶段：取指->间址->执行->中断",
      "取指阶段的微操作对所有指令相同",
    ],
    relatedLessons: ["control-unit"],
  },
  // PLACEHOLDER_CPU_2
  {
    id: "control-unit",
    title: "控制器",
    brief: "理解硬布线控制器与微程序控制器的设计原理和区别",
    sections: [
      {
        id: "cu-motivation",
        title: "控制器的核心地位",
        type: "motivation",
        content: `控制器是CPU的指挥中心，负责产生各种控制信号来协调各部件工作。同一条指令在不同时刻需要不同的控制信号，控制器就是解决"什么时候发什么信号"的问题。

两种实现方式代表了硬件和软件的权衡：硬布线快但难改，微程序灵活但慢。`,
      },
      {
        id: "cu-hardwired",
        title: "硬布线控制器",
        type: "concept",
        content: `## 基本原理

用组合逻辑电路直接产生控制信号。

控制信号 = f(指令操作码, 时序信号, 状态标志)

## 设计步骤

1. 列出所有微操作及其控制信号
2. 确定每个微操作的执行条件（哪条指令、哪个时钟周期、什么条件）
3. 写出每个控制信号的逻辑表达式
4. 用逻辑门电路实现

## 特点

- 速度快（纯硬件，无需读取微指令）
- 设计复杂，不规整
- 修改困难（改指令集需重新设计电路）
- 适用于RISC处理器（指令简单规整）`,
      },
      {
        id: "cu-microprog",
        title: "微程序控制器",
        type: "concept",
        content: `## 基本思想

将每条机器指令编写成一个微程序，存放在控制存储器(CM)中。执行指令时，从CM中逐条取出微指令，产生控制信号。

## 层次关系

程序 -> 机器指令 -> 微程序 -> 微指令 -> 微操作 -> 微命令

## 微指令格式

### 水平型微指令
- 一条微指令可以同时发出多个微命令
- 格式：[控制字段 | 判别测试字段 | 下地址字段]
- 并行性好，微程序短，但微指令字长长

### 垂直型微指令
- 一条微指令只发出一个微命令（类似机器指令）
- 格式类似机器指令，用操作码区分
- 微指令字短，但微程序长，并行性差

### 混合型
- 在垂直型基础上增加一些并行能力

## 微程序控制器的组成

- **控制存储器(CM)**：存放微程序（ROM实现）
- **微地址寄存器(CMAR)**：存放当前微指令地址
- **微指令寄存器(CMDR/uIR)**：存放当前微指令
- **微地址形成部件**：产生下一条微指令地址`,
      },
      {
        id: "cu-compare",
        title: "两种控制器对比",
        type: "comparison",
        content: `| 特性 | 硬布线控制器 | 微程序控制器 |
|------|-------------|-------------|
| 实现方式 | 组合逻辑电路 | 微程序存储 |
| 速度 | 快 | 慢（需读CM） |
| 规整性 | 不规整 | 规整 |
| 可修改性 | 难（改电路） | 易（改微程序） |
| 扩展性 | 差 | 好 |
| 适用 | RISC | CISC |
| 典型代表 | MIPS, ARM | x86(早期) |`,
      },
    ],
    exercises: [
      {
        id: "cu-ex1",
        title: "微程序设计",
        description: "某微程序控制器，控制存储器容量为512x48位。微指令格式为水平型：36位控制字段（直接编码），4位判别测试字段，8位下地址字段。问：(1)最多能定义多少条微命令？(2)下地址字段能寻址多少微指令？(3)CM的容量是否匹配？",
        difficulty: "medium",
        hints: [
          "直接编码：每一位对应一个微命令",
          "下地址字段8位能表示的地址范围",
          "CM容量512 = 2^9",
        ],
        referenceSolution: `(1) 控制字段36位，直接编码方式下每位对应一个微命令
   最多能定义 36 条微命令

(2) 下地址字段8位
   能寻址 2^8 = 256 条微指令

(3) CM容量为512条微指令，需要9位地址
   但下地址字段只有8位，只能寻址256条
   不匹配！下地址字段应至少9位才能充分利用CM

   修正方案：减少控制字段1位，下地址改为9位
   或者利用判别测试字段辅助寻址`,
      },
    ],
    keyTakeaways: [
      "硬布线控制器：纯逻辑电路实现，速度快但难修改，适合RISC",
      "微程序控制器：用微程序存储控制信号，灵活但慢，适合CISC",
      "水平型微指令并行性好但字长长，垂直型字短但程序长",
      "微程序层次：机器指令->微程序->微指令->微操作",
    ],
    relatedLessons: ["datapath", "pipeline"],
  },
  // PLACEHOLDER_CPU_3
  {
    id: "pipeline",
    title: "指令流水线",
    brief: "掌握流水线原理、加速比计算及三种冒险的检测与解决",
    sections: [
      {
        id: "pipe-motivation",
        title: "流水线的意义",
        type: "motivation",
        content: `不使用流水线时，一条指令执行完才能开始下一条，CPU大部分部件处于空闲状态。

流水线让多条指令的不同阶段重叠执行，就像工厂流水线一样，大幅提高吞吐率。现代CPU都采用流水线技术，理解流水线冒险是理解CPU性能的关键。`,
      },
      {
        id: "pipe-concept",
        title: "流水线基本概念",
        type: "concept",
        content: `## 基本原理

将指令执行分为k个阶段，每个阶段耗时相同(一个时钟周期)。

经典5级流水线：IF(取指) -> ID(译码) -> EX(执行) -> MEM(访存) -> WB(写回)

## 性能指标

### 吞吐率(Throughput)
\`TP = n / T_total\`

n条指令在k级流水线上执行：
\`T_total = (k + n - 1) x t\`（t为时钟周期）

### 加速比(Speedup)
\`S = T_sequential / T_pipeline = (n x k x t) / ((k + n - 1) x t)\`

当 n >> k 时，S 趋近于 k（理想加速比等于流水线级数）

### 效率
\`E = S / k = n / (k + n - 1)\`

## 流水线的分类

- **指令流水线**：将指令执行过程分段
- **算术流水线**：将复杂运算（如浮点加法）分段
- **超标量流水线**：每个时钟周期发射多条指令`,
      },
      {
        id: "pipe-hazards",
        title: "流水线冒险与解决",
        type: "walkthrough",
        content: `## 三种冒险（Hazard）

### 1. 结构冒险（Structural Hazard）
多条指令同时需要同一硬件资源。

解决方法：
- 资源重复（如分离指令Cache和数据Cache）
- 流水线暂停（插入气泡）

### 2. 数据冒险（Data Hazard）
后续指令需要前面指令的运算结果，但结果尚未产生。

类型：RAW(写后读)、WAR(读后写)、WAW(写后写)

解决方法：
- **暂停（Stall）**：插入气泡等待
- **前推/旁路（Forwarding）**：将结果直接从ALU输出送到需要的地方
- **编译器调度**：重排指令顺序避免冒险

### 3. 控制冒险（Control Hazard）
分支指令改变程序流向，后续已取的指令可能无效。

解决方法：
- **暂停**：等分支结果确定
- **延迟分支**：分支后的槽位放有用指令
- **分支预测**：静态预测（总是预测不跳转）或动态预测（BHT/BTB）

下面演示一个数据冒险的检测与前推解决过程：`,
        steps: [
          {
            description: "考虑以下指令序列，检测数据冒险",
            pseudocode: "I1: ADD R1, R2, R3   (R1 = R2 + R3)\nI2: SUB R4, R1, R5   (R4 = R1 - R5)\nI3: AND R6, R1, R7   (R6 = R1 & R7)",
            state: { hazard: "I2和I3都需要读R1，但I1还未写回R1" },
          },
          {
            description: "不使用前推时的流水线时序（需要暂停）",
            pseudocode: "时钟:  1    2    3    4    5    6    7    8    9\nI1:   IF   ID   EX   MEM  WB\nI2:        IF   ID   stall stall EX  MEM  WB\nI3:             IF   stall stall ID  EX   MEM  WB",
            state: { penalty: "插入2个气泡，损失2个时钟周期" },
          },
          {
            description: "使用前推（Forwarding）消除暂停",
            pseudocode: "时钟:  1    2    3    4    5    6    7\nI1:   IF   ID   EX   MEM  WB\nI2:        IF   ID   EX   MEM  WB\nI3:             IF   ID   EX   MEM  WB",
            state: {
              forwarding: "I1的EX阶段结束时，ALU结果直接前推给I2的EX输入",
              note: "I3从MEM/WB阶段获取前推数据，也无需暂停",
            },
          },
          {
            description: "前推无法解决的情况：Load-Use冒险",
            pseudocode: "I1: LW  R1, 0(R2)    (从内存加载)\nI2: ADD R3, R1, R4   (立即使用R1)",
            state: {
              problem: "LW在MEM阶段才得到数据，但ADD在EX阶段就需要",
              solution: "必须插入1个气泡（stall 1 cycle），或编译器调度",
            },
          },
        ],
      },
      {
        id: "pipe-simulator",
        title: "流水线动画模拟",
        type: "walkthrough",
        content: `下面是一个交互式流水线模拟器。点击"播放"观察指令在各阶段的推进过程，观察数据冒险导致的气泡插入：`,
        steps: [
          {
            description: "无冒险：5条指令正常流水执行",
            state: {
              type: "pipeline",
              config: {
                instructions: [
                  { name: "I1" },
                  { name: "I2" },
                  { name: "I3" },
                  { name: "I4" },
                  { name: "I5" },
                ],
                forwarding: false,
              },
            },
          },
          {
            description: "数据冒险（无前推）：I2依赖I1的结果，需要插入2个气泡",
            state: {
              type: "pipeline",
              config: {
                instructions: [
                  { name: "ADD" },
                  { name: "SUB", hazard: { type: "data", afterCycle: 2 } },
                  { name: "AND" },
                  { name: "OR" },
                ],
                forwarding: false,
              },
            },
          },
          {
            description: "数据冒险（有前推）：前推消除了暂停，流水线无气泡",
            state: {
              type: "pipeline",
              config: {
                instructions: [
                  { name: "ADD" },
                  { name: "SUB" },
                  { name: "AND" },
                  { name: "OR" },
                ],
                forwarding: true,
              },
            },
          },
          {
            description: "Load-Use冒险（有前推仍需1个气泡）",
            state: {
              type: "pipeline",
              config: {
                instructions: [
                  { name: "LW" },
                  { name: "ADD", hazard: { type: "data", afterCycle: 1 } },
                  { name: "SUB" },
                  { name: "AND" },
                ],
                forwarding: true,
              },
            },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "pipe-ex1",
        title: "流水线加速比计算",
        description: "一条指令的执行分为取指(2ns)、译码(1ns)、执行(2ns)、访存(2ns)、写回(1ns)五个阶段。(1)求流水线时钟周期；(2)100条指令的执行时间和加速比；(3)与非流水线方式对比。",
        difficulty: "medium",
        hints: [
          "流水线时钟周期取最长阶段的时间",
          "非流水线每条指令耗时为各阶段之和",
          "流水线总时间 = (k + n - 1) x 时钟周期",
        ],
        referenceSolution: `(1) 流水线时钟周期 = max(2,1,2,2,1) = 2ns

(2) 100条指令流水线执行时间：
   T = (5 + 100 - 1) x 2 = 104 x 2 = 208ns

   非流水线执行时间：
   T_seq = 100 x (2+1+2+2+1) = 100 x 8 = 800ns

   加速比 S = 800 / 208 = 3.85

(3) 理想加速比 = 5（流水线级数）
   实际加速比3.85 < 5，原因：
   - 各阶段时间不均衡（最长2ns，最短1ns，浪费时间）
   - 流水线建立时间的开销（前4个周期未满载）
   - 实际中还有冒险导致的暂停`,
      },
    ],
    keyTakeaways: [
      "流水线理想加速比等于级数k，实际因冒险和不均衡而降低",
      "数据冒险用前推(Forwarding)解决，Load-Use冒险仍需暂停1周期",
      "控制冒险用分支预测解决，预测错误需要冲刷流水线",
      "结构冒险通过资源重复（如哈佛结构分离I-Cache和D-Cache）解决",
    ],
    relatedLessons: ["datapath", "control-unit"],
  },
  {
    id: "multiprocessor",
    title: "多处理器与硬件多线程",
    brief: "SISD/SIMD/MIMD分类、多核处理器、硬件多线程和SMP的基本概念",
    keyTakeaways: [
      "Flynn分类：SISD（单处理器）、SIMD（向量机/GPU）、MISD（几乎不存在）、MIMD（多核/集群）",
      "硬件多线程：细粒度（每周期切换）、粗粒度（阻塞时切换）、同时多线程SMT（多线程同时执行）",
      "多核处理器：一个芯片上集成多个处理核心，共享LLC和内存控制器",
      "SMP（对称多处理器）：所有处理器地位平等，共享主存，通过总线或交叉开关互连",
      "NUMA：非一致内存访问，每个处理器有本地内存，访问远程内存延迟更高",
    ],
    commonMistakes: [
      "混淆SIMD和MIMD：SIMD是同一指令操作多个数据，MIMD是多个指令操作多个数据",
      "混淆硬件多线程和软件多线程：硬件多线程需要多套寄存器组",
      "认为多核一定能线性加速（实际受Amdahl定律限制）",
    ],
    sections: [
      {
        id: "flynn-classification",
        title: "Flynn分类法",
        type: "concept",
        content: `## Flynn分类

按指令流和数据流的数量将计算机分为四类：

| 类型 | 指令流 | 数据流 | 说明 | 示例 |
|------|--------|--------|------|------|
| SISD | 单 | 单 | 传统单处理器 | 经典冯·诺依曼机 |
| SIMD | 单 | 多 | 一条指令同时操作多个数据 | 向量处理器、GPU |
| MISD | 多 | 单 | 多条指令操作同一数据 | 理论模型，几乎不存在 |
| MIMD | 多 | 多 | 多个处理器独立执行 | 多核CPU、集群 |

### SIMD的应用

- **向量处理器**：对向量中的每个元素执行相同操作
- **GPU**：大量简单核心并行处理图形/计算任务
- **CPU SIMD扩展**：SSE、AVX指令集，一次处理多个浮点数

### MIMD的两种组织

- **共享内存（紧耦合）**：多处理器共享同一地址空间（SMP、NUMA）
- **分布式内存（松耦合）**：每个处理器有独立内存，通过消息传递通信（集群、MPP）`,
      },
      {
        id: "hardware-multithread",
        title: "硬件多线程",
        type: "detail",
        content: `## 为什么需要硬件多线程

单线程执行时，遇到Cache Miss（等数据从内存来，约100个周期）或长延迟操作，流水线会空转——就像厨师等食材送来的时候只能发呆。硬件多线程的思路：**厨师手头有多道菜的食材，一道菜等食材时就去炒另一道**。

**前提**：处理器需要为每个线程维护独立的**寄存器组**和**PC**（相当于每道菜有自己的砧板和菜谱），切换时无需保存/恢复上下文，一个周期内就能切换。

## 三种硬件多线程

### 细粒度多线程（Fine-Grained）

每个时钟周期**轮流**切换线程执行，像旋转寿司——每个位置轮流上菜。

- 优点：任何一个周期的空闲都能被其他线程填满
- 缺点：单个线程被频繁打断，执行速度变为原来的 1/N（N个线程轮流）
- 适合：线程数多、对单线程延迟不敏感的场景

### 粗粒度多线程（Coarse-Grained）

平时只跑一个线程，仅在遇到**长延迟事件**（如Cache Miss、TLB Miss）时才切换。像一个人同时看两本书——只有读到需要查字典的地方才换另一本。

- 优点：单线程性能损失小（大部分时间独占CPU）
- 缺点：切换时需要排空流水线（几个周期的气泡），短延迟无法隐藏
- 适合：线程少、单线程性能重要的场景

### 同时多线程 SMT（Simultaneous Multithreading）

在同一个时钟周期内，从**多个线程**中选取指令**同时发射**到不同功能单元执行。像一个大厨房有多个灶台，同时从不同订单中取菜来炒。

- 充分利用超标量处理器的多个功能单元（不切换，而是混合执行）
- Intel称为**超线程（Hyper-Threading）**：1个物理核 → 2个逻辑核
- 需要更多硬件资源（多套寄存器、更大的重排序缓冲区、线程标记逻辑）

## 对比

| 类型 | 切换时机 | 每周期线程数 | 单线程性能 | 硬件开销 |
|------|----------|-------------|-----------|----------|
| 细粒度 | 每周期 | 1 | 差（1/N） | 多套寄存器 |
| 粗粒度 | 长延迟时 | 1 | 好 | 多套寄存器 |
| SMT | 不切换（混合） | 多个 | 略降 | 大量额外硬件 |

## 与软件多线程的区别

软件多线程（OS调度）切换开销大（保存/恢复整个上下文，几十~几百周期）。硬件多线程切换开销为0或极小（硬件直接切换寄存器组），但需要额外的硬件资源。`,
      },
      {
        id: "multicore-smp",
        title: "多核处理器与SMP",
        type: "detail",
        content: `## 多核处理器（Multi-Core）

一个芯片上集成多个处理核心，每个核心可独立执行指令。

### 典型结构

\`\`\`
┌─────────────────────────────────┐
│           处理器芯片              │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │Core 0│  │Core 1│  │Core 2│  │
│  │L1 I/D│  │L1 I/D│  │L1 I/D│  │
│  │  L2  │  │  L2  │  │  L2  │  │
│  └──────┘  └──────┘  └──────┘  │
│  ┌─────────────────────────────┐│
│  │      共享 L3 Cache (LLC)     ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │      内存控制器              ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
\`\`\`

- 每个核心有私有的 L1/L2 Cache
- 所有核心共享 L3 Cache（Last Level Cache）
- 共享内存控制器

### Cache一致性问题

多核共享内存时，各核心的私有Cache可能持有同一数据的不同副本。需要**Cache一致性协议**（如MESI协议）保证数据一致。

## SMP（对称多处理器）

- 所有处理器**地位平等**，共享主存和I/O
- 任何处理器都可以运行OS和用户程序
- 通过总线或交叉开关互连
- 访问任何内存位置的延迟相同（UMA）

## NUMA（非一致内存访问）

- 每个处理器有**本地内存**，访问速度快
- 也可以访问其他处理器的内存，但延迟更高
- 适合大规模多处理器系统
- 编程时需要注意数据局部性

## Amdahl定律

加速比 S = 1 / [(1-f) + f/n]

- f：可并行化的比例
- n：处理器数量
- 即使 n→∞，加速比上限为 1/(1-f)`,
      },
    ],
    exercises: [
      {
        id: "mp-ex1",
        title: "多处理器概念",
        description: "回答以下问题：\n(1) 按Flynn分类，GPU属于哪种类型？为什么？\n(2) Intel超线程技术属于哪种硬件多线程？它需要什么额外硬件支持？\n(3) 若程序中80%可并行化，用4核处理器的理论最大加速比是多少？",
        difficulty: "medium",
        hints: [
          "GPU的大量核心执行相同的着色器程序",
          "超线程允许同一周期从多个线程发射指令",
          "Amdahl定律：S = 1/[(1-f) + f/n]",
        ],
        referenceSolution: `(1) GPU属于SIMD。GPU有大量简单核心（如数千个CUDA核心），它们在同一时刻执行相同的指令（着色器程序），但处理不同的数据（不同像素/顶点）。严格来说现代GPU是SIMT（Single Instruction Multiple Threads），是SIMD的变体。

(2) Intel超线程属于SMT（同时多线程）。需要额外硬件：多套寄存器组（每个逻辑核一套）、多个PC、更大的重排序缓冲区、线程选择逻辑。但共享执行单元、Cache等主要资源。

(3) f=0.8, n=4
   S = 1/[(1-0.8) + 0.8/4] = 1/[0.2 + 0.2] = 1/0.4 = 2.5
   理论最大加速比为2.5倍（远小于4倍，因为20%串行部分限制了加速）。`,
      },
    ],
    relatedLessons: ["pipeline"],
  },
];
