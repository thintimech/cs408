import { Lesson } from "@/types";

export const datapathMethodLessons: Lesson[] = [
  {
    id: "datapath-method",
    title: "数据通路分析题解题方法",
    brief: "系统掌握数据通路题的分析框架:从指令功能出发,逐步确定微操作序列和控制信号",
    keyTakeaways: [
      "解题核心:指令功能 → 微操作序列 → 控制信号取值",
      "取指阶段对所有指令相同(PC→MAR, M(MAR)→MDR, MDR→IR, PC+1)",
      "分析执行阶段的关键:明确\"数据从哪来、到哪去、经过什么运算\"",
      "MUX选择信号由数据来源决定,ALU控制信号由运算类型决定",
      "写回阶段注意区分:结果写寄存器(RegWSrc) vs 结果写内存(MemWrite)",
      "画数据流图是最有效的分析工具",
    ],
    sections: [
      {
        id: "method-overview",
        title: "解题总框架",
        type: "concept",
        content: `数据通路题的本质是"给你一条指令和一个硬件结构图,问你每个时钟周期各部件做什么、控制信号取什么值"。

## 解题三步法

**Step 1: 明确指令功能**
这条指令要做什么?操作数从哪来?结果存到哪?

**Step 2: 分解为微操作序列**
按时钟周期,每拍做一件事

**Step 3: 确定控制信号**
每个MUX选哪路?ALU做什么运算?哪些写使能打开?

## 关键原则

- 单总线结构:同一时刻总线上只能有一个数据
- 多总线/专用通路:可以并行传送
- 每个时钟周期只能做一次ALU运算`,
      },
      {
        id: "fetch-phase",
        title: "取指阶段(所有指令通用)",
        type: "detail",
        content: `取指阶段是固定的,不管什么指令都一样:

\`\`\`
T0: PC → MAR, 1→R (将PC送MAR,启动读)
    控制信号:MAR_Src=PC, MemRead=1
T1: M(MAR) → MDR (从主存读出指令到MDR)
    控制信号:等待主存响应
T2: MDR → IR, (PC)+1 → PC (指令送IR,PC自增)
    控制信号:PCin=+1
\`\`\`

记忆口诀:"PC找地址,内存给指令,IR存指令PC加一"`,
      },
      {
        id: "execute-analysis",
        title: "【方法】执行阶段分析技巧",
        type: "detail",
        content: `执行阶段因指令而异。分析方法:

## 第一步:画数据流图

问自己三个问题:
1. 源操作数在哪?(寄存器?立即数?内存?)
2. 要做什么运算?(加?减?逻辑?移位?不运算直接传?)
3. 结果送到哪?(寄存器?内存?PC?)

## 第二步:确定数据路径

从源到目的,数据必须经过哪些部件?
- 寄存器→ALU:经过busA/busB → MUX → ALU
- 立即数→ALU:经过扩展器 → MUX → ALU
- ALU→寄存器:经过MUX_W → busW → GPRS
- ALU→内存:经过MAR → 主存

## 第三步:确定MUX选择

每个MUX的选择信号 = "我要让哪路数据通过"
- AluASrc:busA(寄存器) or PC?
- AluBSrc:busB(寄存器) or 扩展器(立即数/偏移)?
- MAR_Src:ALU输出(计算地址) or PC(取指)?
- RegWSrc:ALU结果 or MDR(从内存读的数据)?`,
      },
      {
        id: "instruction-types",
        title: "各类指令的微操作模板",
        type: "detail",
        content: `## 运算类指令(ADD rd, rs, rt)

功能:R[rd] <- R[rs] op R[rt]

执行阶段:
- 读rs→busA, 读rt→busB
- ALU运算
- 结果→busW→rd

控制信号:AluASrc=busA, AluBSrc=busB, AluOp=运算码, RegWSrc=ALU, RegWr=1

## 立即数运算(ADDI rt, rs, imm)

功能:R[rt] <- R[rs] + sign_ext(imm)

执行阶段:
- 读rs→busA, imm经扩展器→MUX_B
- ALU加法
- 结果→busW→rt

控制信号:AluASrc=busA, AluBSrc=Ext, Extop=sign, AluOp=ADD, RegWSrc=ALU, RegWr=1

## 取数指令(LW rt, offset(rs))

功能:R[rt] <- M[R[rs] + offset]

执行阶段:
- 读rs→busA, offset经扩展器→MUX_B
- ALU计算地址
- ALU结果→MAR, 读内存
- MDR→busW→rt

控制信号:AluASrc=busA, AluBSrc=Ext, AluOp=ADD, MAR_Src=ALU, MemRead=1, RegWSrc=MDR, RegWr=1

## 存数指令(SW rt, offset(rs))

功能:M[R[rs] + offset] <- R[rt]

执行阶段:
- 读rs→busA, offset经扩展器→MUX_B
- ALU计算地址
- ALU结果→MAR, 读rt→MDR
- MDR→主存

控制信号:AluASrc=busA, AluBSrc=Ext, AluOp=ADD, MAR_Src=ALU, MemWrite=1

## 分支指令(BEQ rs, rt, offset)

功能:if R[rs]==R[rt] then PC<-PC+offset

执行阶段:
- 读rs→busA, 读rt→busB
- ALU做减法,检查Zero标志
- 若Zero=1:PC+offset→PC

控制信号:AluASrc=busA, AluBSrc=busB, AluOp=SUB, Branch=1`,
      },
      {
        id: "common-traps",
        title: "常见陷阱与易错点",
        type: "detail",
        content: `## 陷阱1:单总线冲突

单总线结构中,同一时刻只能有一个数据在总线上。如果需要两个操作数,必须分两拍:
- T1: R[rs]→暂存器A
- T2: R[rt]→暂存器B
- T3: A op B → 结果

## 陷阱2:忘记取指阶段

题目问"写出完整微操作序列"时,必须包含取指阶段!

## 陷阱3:MAR/MDR的方向

- MAR只能接收地址(从PC或ALU来)
- MDR是双向的:可以从内存读入,也可以向内存写出

## 陷阱4:PC更新时机

- 顺序执行:取指阶段PC+1
- 分支/跳转:执行阶段修改PC(覆盖取指阶段的+1)

## 陷阱5:扩展方式

- 算术运算的立即数:符号扩展(sign extension)
- 逻辑运算的立即数:零扩展(zero extension)
- 地址偏移:通常符号扩展`,
      },
      {
        id: "exam-strategy",
        title: "考试答题策略",
        type: "detail",
        content: `## 拿到题目后的操作顺序

1. 先看硬件结构图,标注每个MUX的输入编号(0/1/2...)
2. 确认是单总线还是多总线(决定每拍能做多少事)
3. 写出取指阶段(固定的,先拿这部分分)
4. 分析指令功能,画出数据流向
5. 按时钟周期逐拍写微操作
6. 对照结构图确定每个控制信号的值

## 答题格式模板

\`\`\`
T0: PC→MAR, 1→R          [MAR_Src=0, MemRead=1]
T1: M(MAR)→MDR            [等待]
T2: MDR→IR, (PC)+1→PC     [PCin=1]
T3: R[rs]→busA            [ra=rs字段]
T4: ...
\`\`\`

每一行写清楚:微操作 + 对应控制信号值`,
      },
    ],
    exercises: [
      {
        id: "ex-add-single-bus",
        title: "ADD指令单总线微操作序列",
        description: `已知单总线CPU结构,指令 ADD R1, R2, R3 的功能为 R[R1] <- R[R2] + R[R3]。

要求:写出该指令从取指到执行完毕的完整微操作序列,注明每个时钟周期的操作。

提示:单总线结构中,同一时刻总线上只能传送一个数据。`,
        difficulty: "medium",
        hints: [
          "取指阶段是固定的三拍:PC→MAR→读内存→MDR→IR, PC+1",
          "单总线结构下,两个源操作数不能同时上总线,需要用暂存器",
          "执行阶段需要:取第一个操作数→暂存,取第二个操作数→ALU运算→写回",
        ],
        referenceSolution: `完整微操作序列:

取指阶段:
T0: PC→Bus→MAR, 1→R
T1: M(MAR)→MDR, (PC)+1→PC
T2: MDR→Bus→IR

执行阶段:
T3: R[R2]→Bus→暂存器Y
T4: R[R3]→Bus, Y→ALU的A端, Bus→ALU的B端, ALU做加法, 结果→暂存器Z
T5: Z→Bus→R[R1]

关键点:
- T3和T4必须分开,因为单总线同一时刻只能有一个数据
- ALU的一个输入来自暂存器Y(不占总线),另一个来自总线
- 共需6个时钟周期完成`,
      },
      {
        id: "ex-load-multi-bus",
        title: "LOAD指令多总线微操作与控制信号",
        description: `已知三总线CPU结构(busA, busB, busW),指令 LW R5, 100(R6) 的功能为 R[R5] <- M[R[R6] + 100]。

数据通路包含:
- AluASrc MUX: 0=busA, 1=PC
- AluBSrc MUX: 0=busB, 1=符号扩展器输出
- RegWSrc MUX: 0=ALU输出, 1=MDR
- MAR_Src MUX: 0=PC, 1=ALU输出

要求:
1. 写出执行阶段的微操作序列
2. 标注每拍所有控制信号的取值`,
        difficulty: "hard",
        hints: [
          "多总线结构下busA和busB可以同时提供数据,一拍就能完成ALU运算",
          "LW指令执行阶段分两步:先算地址,再读内存",
          "注意RegWSrc应选MDR(从内存读来的数据),不是ALU输出",
        ],
        referenceSolution: `执行阶段微操作序列:

T3: R[R6]→busA, 100经符号扩展→MUX_B, ALU做加法, 结果→MAR, 启动读
    控制信号:
    - ra(读端口A) = R6编号
    - AluASrc = 0 (选busA)
    - AluBSrc = 1 (选扩展器输出)
    - AluOp = ADD
    - MAR_Src = 1 (选ALU输出)
    - MemRead = 1

T4: 等待主存响应, M(MAR)→MDR
    控制信号:无新控制,等待Memory Ready

T5: MDR→MUX_W→busW→R[R5]
    控制信号:
    - RegWSrc = 1 (选MDR)
    - rw(写端口) = R5编号
    - RegWr = 1

关键点:
- 多总线结构下T3一拍完成地址计算(busA和扩展器同时提供数据)
- 必须等内存响应后才能写回寄存器
- RegWSrc=1选MDR而非ALU,这是LW与算术指令的区别`,
      },
      {
        id: "ex-swap-design",
        title: "设计SWAP指令的微操作序列",
        description: `假设需要实现一条新指令 SWAP Rs, Rt,功能为交换两个寄存器的内容:
temp <- R[Rs]; R[Rs] <- R[Rt]; R[Rt] <- temp

在单总线结构CPU中(有暂存器Y和Z可用),设计该指令执行阶段的微操作序列。

思考:
1. 最少需要几个时钟周期?
2. 如果只有一个暂存器Y,还能实现吗?`,
        difficulty: "hard",
        hints: [
          "交换需要保存一个中间值,否则会丢失数据",
          "单总线每拍只能传一个数据,所以每次寄存器→暂存器或暂存器→寄存器都要一拍",
          "如果只有一个暂存器,考虑能否利用ALU或其他部件临时存储",
        ],
        referenceSolution: `使用两个暂存器(Y和Z)的方案:

执行阶段:
T3: R[Rs]→Bus→Y        (保存Rs的值到Y)
T4: R[Rt]→Bus→Z        (保存Rt的值到Z)
T5: Y→Bus→R[Rt]        (原Rs的值写入Rt)  [RegWr=1, rw=Rt]
T6: Z→Bus→R[Rs]        (原Rt的值写入Rs)  [RegWr=1, rw=Rs]

共需4个时钟周期。

只有一个暂存器Y的方案:
T3: R[Rs]→Bus→Y        (保存Rs到Y)
T4: R[Rt]→Bus→R[Rs]    (Rt直接写入Rs)  [RegWr=1, rw=Rs]
T5: Y→Bus→R[Rt]        (原Rs的值写入Rt)  [RegWr=1, rw=Rt]

只需3个时钟周期!关键技巧:T4中Rt的值直接从总线写入Rs,不需要经过暂存器。

设计要点:
- 必须先保存一个值,否则覆盖后无法恢复
- 单暂存器方案更高效,利用了"读寄存器不破坏原值"的特性
- 这类设计题考察对数据通路的深入理解`,
      },
    ],
  },
];
