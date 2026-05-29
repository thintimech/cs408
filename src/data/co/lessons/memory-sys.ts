import { Lesson } from "@/types";

export const memorySysLessons: Lesson[] = [
  {
    id: "memory-hierarchy",
    title: "存储器层次结构",
    brief: "理解寄存器/Cache/主存/辅存的层次关系及SRAM与DRAM的区别",
    sections: [
      {
        id: "mh-motivation",
        title: "为什么需要存储层次",
        type: "motivation",
        content: `CPU速度远快于存储器，如果只用一种存储器，要么太贵（全用SRAM），要么太慢（全用DRAM）。

存储层次结构利用程序的局部性原理，用少量快速存储器缓存常用数据，在成本和性能之间取得平衡。`,
      },
      {
        id: "mh-hierarchy",
        title: "存储器层次",
        type: "concept",
        content: `## 层次结构（从快到慢）

| 层次 | 类型 | 速度 | 容量 | 成本 |
|------|------|------|------|------|
| 寄存器 | 触发器 | <1ns | 几十~几百B | 最高 |
| Cache | SRAM | 1-10ns | KB~MB | 高 |
| 主存 | DRAM | 50-100ns | GB | 中 |
| 辅存 | 磁盘/SSD | ms/us | TB | 低 |

## SRAM vs DRAM

| 特性 | SRAM | DRAM |
|------|------|------|
| 存储元 | 6管触发器 | 1管1电容 |
| 刷新 | 不需要 | 需要定期刷新 |
| 速度 | 快 | 慢 |
| 集成度 | 低 | 高 |
| 成本 | 高 | 低 |
| 用途 | Cache | 主存 |

## DRAM刷新

- **集中刷新**：在固定时间段内刷新所有行（有死区）
- **分散刷新**：每个存取周期后刷新一行（无死区但周期变长）
- **异步刷新**：将刷新分散到各行，每隔一段时间刷新一行

## 存储器扩展

- **位扩展**：增加字长（多片并联，地址线共享）
- **字扩展**：增加存储字数（用高位地址译码选片）
- **字位同时扩展**：同时增加字数和字长`,
      },
      {
        id: "mh-detail",
        title: "存储器扩展设计",
        type: "detail",
        content: `## 设计步骤

1. 确定所需总容量和字长
2. 选择存储芯片规格
3. 计算需要的芯片数量
4. 确定地址线分配（片内地址 + 片选信号）
5. 画出连接图

## 示例

用 16Kx1位 的SRAM芯片组成 64Kx8位 的存储器：

- 字扩展：64K/16K = 4（需要4组）
- 位扩展：8/1 = 8（每组8片并联）
- 总计：4 x 8 = 32片
- 地址线：16位（A0-A13为片内地址，A14-A15为片选译码）`,
      },
    ],
    exercises: [
      {
        id: "mh-ex1",
        title: "存储器扩展设计",
        description: "用 8Kx8位 的SRAM芯片设计一个 32Kx16位 的存储器。说明需要多少芯片，地址线如何分配，画出片选逻辑。",
        difficulty: "medium",
        hints: [
          "字扩展倍数 = 32K/8K = 4",
          "位扩展倍数 = 16/8 = 2",
          "8K需要13位片内地址(A0-A12)",
        ],
        referenceSolution: `字扩展：32K / 8K = 4组
位扩展：16 / 8 = 2片/组
总计：4 x 2 = 8片

地址分配：
- 总地址15位（32K = 2^15）
- A0-A12：13位片内地址（送入每片的地址端）
- A13-A14：2位片选地址（经2-4译码器产生4个片选信号）
- 每个片选信号同时选中2片（位扩展的一组）

数据线：每组2片的8位数据线分别连D0-D7和D8-D15`,
      },
    ],
    keyTakeaways: [
      "存储层次利用局部性原理平衡速度、容量和成本",
      "SRAM快但贵（用于Cache），DRAM慢但容量大（用于主存）",
      "DRAM需要刷新，异步刷新是最优方案",
      "存储器扩展：位扩展增加字长，字扩展增加字数",
    ],
    relatedLessons: ["cache"],
  },
  {
    id: "cache",
    title: "Cache",
    brief: "掌握Cache的映射方式、替换算法和写策略",
    sections: [
      {
        id: "cache-motivation",
        title: "Cache的作用",
        type: "motivation",
        content: `CPU和主存之间存在巨大的速度差距。Cache利用程序的时间局部性和空间局部性，将近期可能访问的数据预先放入高速缓存中，使CPU大部分时间能以接近SRAM的速度获取数据。

Cache对程序员透明，由硬件自动管理。理解其工作原理对优化程序性能至关重要。`,
      },
      {
        id: "cache-mapping",
        title: "Cache映射方式",
        type: "concept",
        content: `主存地址分为：标记(Tag) + 组号/行号 + 块内地址

## 直接映射（Direct Mapping）

主存块只能映射到Cache的固定行：Cache行号 = 主存块号 mod Cache总行数

- 优点：实现简单，判断快
- 缺点：冲突率高，Cache利用率低

## 全相联映射（Fully Associative）

主存块可以映射到Cache的任意行。

- 优点：冲突率最低，利用率高
- 缺点：比较器多，硬件成本高，查找慢

## 组相联映射（Set Associative）

Cache分为若干组，主存块映射到固定组，组内任意行。

组号 = 主存块号 mod 组数

- n路组相联：每组n行
- 直接映射 = 1路组相联
- 全相联 = 只有1组的组相联
- 常用：2路、4路、8路组相联

## 地址结构

| 映射方式 | 标记位 | 索引位 | 块内偏移 |
|----------|--------|--------|----------|
| 直接映射 | Tag | Cache行号 | 块内地址 |
| 全相联 | Tag(含块号) | 无 | 块内地址 |
| 组相联 | Tag | 组号 | 块内地址 |`,
      },
      {
        id: "cache-walkthrough",
        title: "Cache地址映射计算",
        type: "walkthrough",
        content: `## 示例

设Cache容量为4KB，块大小为64B，采用4路组相联映射，主存地址为32位。求地址各字段的位数。

按步骤计算：`,
        steps: [
          {
            description: "计算Cache的基本参数",
            state: {
              cache_size: "4KB = 4096B",
              block_size: "64B",
              total_blocks: "4096 / 64 = 64块",
              ways: "4路",
              sets: "64 / 4 = 16组",
            },
          },
          {
            description: "确定块内偏移位数",
            state: {
              block_offset: "64B = 2^6, 需要6位块内地址",
            },
          },
          {
            description: "确定组号（索引）位数",
            state: {
              set_index: "16组 = 2^4, 需要4位组号",
            },
          },
          {
            description: "确定标记位数",
            state: {
              tag_bits: "32 - 4 - 6 = 22位标记",
              summary: "地址格式：[22位Tag | 4位组号 | 6位块内偏移]",
            },
          },
          {
            description: "验证：访问地址 0x00001234 映射到哪一组",
            state: {
              binary: "0000...0001 0010 0011 0100",
              block_offset: "低6位 = 110100 (块内第52字节)",
              set_index: "接下来4位 = 1000 = 第8组",
              tag: "高22位用于比较",
            },
          },
        ],
      },
      {
        id: "cache-replace",
        title: "替换算法与写策略",
        type: "detail",
        content: `## 替换算法（全相联和组相联需要）

| 算法 | 原理 | 优缺点 |
|------|------|--------|
| FIFO | 替换最先进入的块 | 简单，但可能替换常用块 |
| LRU | 替换最久未使用的块 | 效果好，硬件复杂 |
| LFU | 替换使用次数最少的块 | 需要计数器，开销大 |
| 随机 | 随机选择替换 | 最简单，效果不稳定 |

LRU实现：用计数器记录每行的使用情况，每次访问更新。

## 写策略

### 写命中时
- **写直达（Write Through）**：同时写Cache和主存，一致性好但慢
- **写回（Write Back）**：只写Cache，被替换时才写回主存，需要脏位(dirty bit)

### 写不命中时
- **写分配（Write Allocate）**：先调入Cache再写（常与写回配合）
- **非写分配（No Write Allocate）**：直接写主存不调入Cache（常与写直达配合）`,
      },
      {
        id: "cache-simulator",
        title: "Cache 交互模拟器",
        type: "walkthrough",
        content: `下面是一个交互式 Cache 模拟器。输入内存地址，观察地址分解、查找、命中/缺失的完整过程。可以连续输入多个地址观察命中率变化：`,
        steps: [
          {
            description: "直接映射 Cache：8块，每块16字节，地址8位。试试输入地址 0, 16, 32, 128, 0 观察冲突缺失",
            state: {
              type: "cache",
              config: {
                mode: "direct",
                cacheSize: 128,
                blockSize: 16,
                addressBits: 8,
              },
            },
          },
          {
            description: "2路组相联 Cache：8块(4组×2路)，每块16字节。同样的地址序列，观察冲突减少",
            state: {
              type: "cache",
              config: {
                mode: "set-associative",
                cacheSize: 128,
                blockSize: 16,
                ways: 2,
                addressBits: 8,
              },
            },
          },
          {
            description: "全相联 Cache：8块，每块16字节。任何块可放任何位置，冲突最少但硬件代价最高",
            state: {
              type: "cache",
              config: {
                mode: "full-associative",
                cacheSize: 128,
                blockSize: 16,
                addressBits: 8,
              },
            },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "cache-ex1",
        title: "Cache性能计算",
        description: "某计算机Cache命中率为95%，Cache访问时间为2ns，主存访问时间为50ns。采用同时访问方式，求平均访问时间和加速比。",
        difficulty: "easy",
        hints: [
          "同时访问：命中时时间=Cache时间，不命中时时间=主存时间",
          "平均时间 = 命中率 x Cache时间 + (1-命中率) x 主存时间",
        ],
        referenceSolution: `同时访问方式：
平均访问时间 = 0.95 x 2 + 0.05 x 50 = 1.9 + 2.5 = 4.4ns

加速比 = 无Cache时间 / 有Cache时间 = 50 / 4.4 = 11.36

效率 = Cache访问时间 / 平均访问时间 = 2 / 4.4 = 45.5%

注：若采用先访问Cache再访问主存的方式：
平均时间 = 2 + 0.05 x 50 = 4.5ns`,
      },
    ],
    keyTakeaways: [
      "三种映射：直接(冲突多)、全相联(硬件贵)、组相联(折中最常用)",
      "地址划分：Tag + 索引(组号/行号) + 块内偏移",
      "LRU替换算法效果最好，考研常考LRU的具体执行过程",
      "写回法性能好但需脏位，写直达一致性好但带宽消耗大",
    ],
    relatedLessons: ["memory-hierarchy", "virtual-memory"],
  },
  {
    id: "virtual-memory",
    title: "虚拟存储器",
    brief: "理解页式/段式/段页式虚拟存储及TLB加速地址转换",
    sections: [
      {
        id: "vm-motivation",
        title: "虚拟存储器的意义",
        type: "motivation",
        content: `物理内存有限，但程序可能很大。虚拟存储器让每个程序都认为自己拥有完整的地址空间，由操作系统和硬件协作完成虚实地址转换和页面调度。

这是"主存-辅存"层次的核心机制，也是现代计算机系统的基础。`,
      },
      {
        id: "vm-paging",
        title: "页式虚拟存储",
        type: "concept",
        content: `## 基本概念

- **虚拟地址（逻辑地址）**：程序使用的地址
- **物理地址（实地址）**：实际内存地址
- **页面（Page）**：虚拟地址空间的固定大小块
- **页框（Page Frame）**：物理内存的固定大小块
- **页表**：记录虚页号到实页号的映射

## 地址转换

虚拟地址 = [虚页号 | 页内偏移]
物理地址 = [实页号 | 页内偏移]（页内偏移不变）

页表项内容：有效位 + 实页号 + 修改位 + 访问位 + ...

## 页表的问题

- 页表可能很大（32位地址，4KB页 -> 2^20个页表项）
- 解决方案：多级页表、倒排页表

## TLB（Translation Lookaside Buffer）

快表，是页表的Cache，存放最近使用的页表项。

地址转换过程：
1. 用虚页号查TLB
2. TLB命中 -> 直接得到实页号
3. TLB未命中 -> 查页表 -> 更新TLB
4. 页表也未命中（缺页） -> 缺页中断 -> 从辅存调入`,
      },
      {
        id: "vm-segment",
        title: "段式与段页式",
        type: "comparison",
        content: `## 三种虚拟存储方式对比

| 特性 | 页式 | 段式 | 段页式 |
|------|------|------|--------|
| 划分依据 | 固定大小 | 逻辑意义 | 先分段再分页 |
| 地址结构 | 页号+页内偏移 | 段号+段内偏移 | 段号+页号+页内偏移 |
| 内碎片 | 有（最后一页） | 无 | 有 |
| 外碎片 | 无 | 有 | 无 |
| 共享保护 | 不便 | 方便（按逻辑段） | 方便 |
| 实际应用 | Linux/Windows | 早期系统 | 大型系统 |

## 段页式

- 先按逻辑分段，每段再分页
- 需要段表和页表两级查找
- 兼具段式的逻辑清晰和页式的内存管理方便`,
      },
    ],
    exercises: [
      {
        id: "vm-ex1",
        title: "地址转换计算",
        description: "某系统页面大小为4KB，虚拟地址为32位，物理地址为28位。TLB有16项（全相联）。求：(1)虚页号和页内偏移各多少位？(2)页表最多有多少项？(3)TLB的Tag和数据各是什么？",
        difficulty: "medium",
        hints: [
          "4KB = 2^12，页内偏移12位",
          "虚页号 = 32 - 12 = 20位",
          "TLB全相联，Tag就是完整虚页号",
        ],
        referenceSolution: `(1) 页面4KB = 2^12
   页内偏移 = 12位
   虚页号 = 32 - 12 = 20位

(2) 页表项数 = 2^20 = 1M项（约100万项）
   这就是为什么需要多级页表

(3) TLB结构（全相联）：
   Tag = 20位虚页号
   Data = 有效位(1) + 实页号(28-12=16位) + 其他控制位

   TLB共16项，查找时20位虚页号与所有16项的Tag并行比较`,
      },
    ],
    keyTakeaways: [
      "虚拟存储实现主存-辅存层次，对程序员透明",
      "页式存储：固定大小分页，地址转换通过页表完成",
      "TLB是页表的硬件Cache，大幅加速地址转换",
      "段页式兼具段式的逻辑保护和页式的内存管理优势",
    ],
    relatedLessons: ["cache", "memory-hierarchy"],
  },
];
