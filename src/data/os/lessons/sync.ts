import { Lesson } from "@/types";

export const syncLessons: Lesson[] = [
  {
    id: "mutex-concepts",
    title: "互斥的基本概念",
    brief: "理解临界资源、临界区和互斥的实现方法",
    sections: [
      {
        id: "critical-section",
        title: "临界资源与临界区",
        type: "concept",
        content: `## 临界资源

一次仅允许一个进程使用的资源称为临界资源。例如：打印机、共享变量、共享缓冲区。

## 临界区

进程中访问临界资源的那段代码称为临界区(Critical Section)。

\`\`\`
entry section    // 进入区：检查是否可进入
critical section // 临界区：访问临界资源
exit section     // 退出区：释放临界资源
remainder section // 剩余区
\`\`\`

## 同步机制应遵循的准则

1. **空闲让进**：临界区空闲时，允许一个进程进入
2. **忙则等待**：已有进程在临界区时，其他进程必须等待
3. **有限等待**：等待进入临界区的进程不能无限等待
4. **让权等待**：不能进入临界区的进程应释放CPU（非必须但推荐）`,
      },
      {
        id: "peterson",
        title: "Peterson算法",
        type: "walkthrough",
        content: `## Peterson算法

一种经典的软件实现互斥的方法，适用于两个进程的情况。

\`\`\`c
// 共享变量
bool flag[2] = {false, false}; // 表示进程是否想进入临界区
int turn;                       // 表示该谁进入临界区

// 进程Pi (i=0或1, j=1-i)
flag[i] = true;    // 表明自己想进入
turn = j;          // 谦让：让对方先
while(flag[j] && turn == j); // 等待
// 临界区
flag[i] = false;   // 退出
\`\`\``,
        steps: [
          {
            description: "P0想进入临界区，设置flag[0]=true, turn=1",
            pseudocode: "flag[0] = true; turn = 1;",
            state: { flag: [true, false], turn: 1, P0: "想进入", P1: "不想进入" },
          },
          {
            description: "P0检查条件：flag[1]=false，条件不满足，P0进入临界区",
            pseudocode: "while(flag[1] && turn==1); // flag[1]=false, 跳出",
            state: { flag: [true, false], turn: 1, P0: "在临界区", P1: "不想进入" },
          },
          {
            description: "此时P1也想进入，设置flag[1]=true, turn=0",
            pseudocode: "flag[1] = true; turn = 0;",
            state: { flag: [true, true], turn: 0, P0: "在临界区", P1: "想进入" },
          },
          {
            description: "P1检查条件：flag[0]=true且turn=0，条件满足，P1等待",
            pseudocode: "while(flag[0] && turn==0); // 条件成立, 循环等待",
            state: { flag: [true, true], turn: 0, P0: "在临界区", P1: "等待中" },
          },
          {
            description: "P0退出临界区，设置flag[0]=false",
            pseudocode: "flag[0] = false;",
            state: { flag: [false, true], turn: 0, P0: "退出", P1: "等待中" },
          },
          {
            description: "P1检查条件：flag[0]=false，条件不满足，P1进入临界区",
            state: { flag: [false, true], turn: 0, P0: "剩余区", P1: "在临界区" },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "mutex-ex1",
        title: "互斥准则判断",
        description: "以下方案能否实现互斥？分析是否满足四个准则：\n\n```c\n// 共享变量 int turn = 0;\n// P0:\nwhile(turn != 0); // 等待\n临界区\nturn = 1;\n// P1:\nwhile(turn != 1); // 等待\n临界区\nturn = 0;\n```",
        difficulty: "easy",
        hints: [
          "考虑如果P0不想进入临界区，P1能否进入？",
          "这就是单标志法(轮换法)",
        ],
        referenceSolution: `这是单标志法(轮换法)，分析如下：

- 空闲让进：不满足。如果P0不想进入临界区，但turn=0，P1无法进入，即使临界区空闲。
- 忙则等待：满足。turn只能为0或1，同一时刻只有一个进程能通过while。
- 有限等待：满足。一个进程退出后必定将turn设为对方的值。
- 让权等待：不满足。等待时进行忙等(busy waiting)。

结论：能实现互斥，但不满足"空闲让进"，必须交替进入临界区。`,
      },
    ],
    keyTakeaways: [
      "临界区的四个准则：空闲让进、忙则等待、有限等待、让权等待",
      "Peterson算法通过flag数组+turn变量实现两进程互斥",
      "软件方法的缺点：忙等待，不满足让权等待",
    ],
    relatedLessons: ["semaphore"],
  },
  {
    id: "semaphore",
    title: "信号量机制",
    brief: "掌握信号量的定义、P/V操作以及用信号量实现互斥和同步",
    sections: [
      {
        id: "semaphore-types",
        title: "信号量的类型",
        type: "concept",
        content: `## 整型信号量

用一个整数值表示资源数量，通过P(wait)和V(signal)操作访问：

\`\`\`c
int S = 1; // 信号量初值
P(S): while(S <= 0); S--;  // 忙等待
V(S): S++;
\`\`\`

缺点：不满足让权等待（忙等）。

## 记录型信号量（重点）

\`\`\`c
typedef struct {
    int value;          // 资源数量
    struct PCB *list;   // 等待队列
} semaphore;

void P(semaphore *S) {
    S->value--;
    if (S->value < 0) {
        // 将当前进程加入S->list
        block(S->list); // 自我阻塞
    }
}

void V(semaphore *S) {
    S->value++;
    if (S->value <= 0) {
        // 从S->list中唤醒一个进程
        wakeup(S->list);
    }
}
\`\`\`

**value的含义：**
- value > 0：表示可用资源数
- value = 0：表示无可用资源，无等待进程
- value < 0：|value| 表示等待队列中的进程数`,
      },
      {
        id: "semaphore-usage",
        title: "信号量实现互斥与同步",
        type: "walkthrough",
        content: `## 用信号量实现互斥

\`\`\`c
semaphore mutex = 1; // 初值为1

// 进程Pi:
P(mutex);
临界区;
V(mutex);
\`\`\`

## 用信号量实现同步

让事件A在事件B之前发生：

\`\`\`c
semaphore S = 0; // 初值为0

// 进程P1(先执行A):
A;
V(S);  // A完成后发信号

// 进程P2(后执行B):
P(S);  // 等待A完成的信号
B;
\`\`\``,
        steps: [
          {
            description: "互斥示例：P1和P2竞争打印机(mutex=1)",
            state: { mutex: 1, P1: "就绪", P2: "就绪" },
          },
          {
            description: "P1执行P(mutex)：mutex变为0，P1进入临界区",
            pseudocode: "P(mutex); // mutex: 1->0",
            state: { mutex: 0, P1: "在临界区", P2: "就绪" },
          },
          {
            description: "P2执行P(mutex)：mutex变为-1，P2阻塞",
            pseudocode: "P(mutex); // mutex: 0->-1, P2阻塞",
            state: { mutex: -1, P1: "在临界区", P2: "阻塞" },
          },
          {
            description: "P1退出临界区，执行V(mutex)：mutex变为0，唤醒P2",
            pseudocode: "V(mutex); // mutex: -1->0, 唤醒P2",
            state: { mutex: 0, P1: "退出", P2: "就绪" },
          },
          {
            description: "P2被唤醒，进入临界区",
            state: { mutex: 0, P1: "剩余区", P2: "在临界区" },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "semaphore-ex1",
        title: "信号量值的含义",
        description: "某系统中有3台打印机，用信号量S管理。若当前S.value=-2，请分析系统状态：有多少台打印机空闲？有多少个进程在等待？",
        difficulty: "easy",
        hints: [
          "S的初值为资源总数3",
          "value<0时，|value|为等待进程数",
        ],
        referenceSolution: `分析：
- 信号量初值 = 3（3台打印机）
- 当前 S.value = -2

状态分析：
- 空闲打印机数 = 0（所有打印机都已分配）
- 已分配打印机数 = 3
- 等待进程数 = |S.value| = |-2| = 2

解释：从初值3到当前值-2，共执行了5次P操作（3-5=-2）。前3次P操作各分配一台打印机，后2次P操作使进程阻塞等待。`,
      },
    ],
    keyTakeaways: [
      "P操作：申请资源，可能阻塞；V操作：释放资源，可能唤醒",
      "互斥信号量初值为1，同步信号量初值为0",
      "value<0时，|value|等于等待队列中的进程数",
      "P/V操作必须成对出现",
    ],
    relatedLessons: ["mutex-concepts", "classic-problems"],
  },
  {
    id: "classic-problems",
    title: "经典同步问题",
    brief: "掌握生产者-消费者、读者-写者、哲学家进餐问题的PV操作解法",
    sections: [
      {
        id: "producer-consumer",
        title: "生产者-消费者问题",
        type: "walkthrough",
        content: `## 问题描述

一组生产者和一组消费者共享一个大小为n的缓冲区：
- 生产者：生产产品放入缓冲区
- 消费者：从缓冲区取出产品消费
- 缓冲区满时生产者等待，空时消费者等待

## PV操作解法

\`\`\`c
semaphore mutex = 1;  // 互斥访问缓冲区
semaphore empty = n;  // 空缓冲区数量
semaphore full = 0;   // 满缓冲区数量

// 生产者
void producer() {
    while(1) {
        produce_item();
        P(empty);    // 申请空缓冲区
        P(mutex);    // 进入临界区
        put_item();  // 放入产品
        V(mutex);    // 离开临界区
        V(full);     // 增加满缓冲区
    }
}

// 消费者
void consumer() {
    while(1) {
        P(full);     // 申请满缓冲区
        P(mutex);    // 进入临界区
        get_item();  // 取出产品
        V(mutex);    // 离开临界区
        V(empty);    // 增加空缓冲区
        consume_item();
    }
}
\`\`\`

**注意：** P(empty)/P(full)必须在P(mutex)之前，否则可能死锁！`,
        steps: [
          {
            description: "初始状态：缓冲区大小n=3，全部为空",
            state: { empty: 3, full: 0, mutex: 1, buffer: ["_", "_", "_"] },
          },
          {
            description: "生产者P1生产一个产品，执行P(empty)和P(mutex)",
            pseudocode: "P(empty); // 3->2\nP(mutex); // 1->0",
            state: { empty: 2, full: 0, mutex: 0, buffer: ["_", "_", "_"], action: "P1进入临界区" },
          },
          {
            description: "P1放入产品，执行V(mutex)和V(full)",
            pseudocode: "put_item();\nV(mutex); // 0->1\nV(full);  // 0->1",
            state: { empty: 2, full: 1, mutex: 1, buffer: ["A", "_", "_"], action: "P1放入产品A" },
          },
          {
            description: "消费者C1执行P(full)和P(mutex)，取出产品",
            pseudocode: "P(full);  // 1->0\nP(mutex); // 1->0\nget_item();\nV(mutex); // 0->1\nV(empty); // 2->3",
            state: { empty: 3, full: 0, mutex: 1, buffer: ["_", "_", "_"], action: "C1取出产品A" },
          },
          {
            description: "缓冲区为空，消费者C2执行P(full)被阻塞",
            pseudocode: "P(full); // 0->-1, C2阻塞",
            state: { empty: 3, full: -1, mutex: 1, buffer: ["_", "_", "_"], action: "C2阻塞等待产品" },
          },
        ],
      },
      {
        id: "readers-writers",
        title: "读者-写者问题",
        type: "detail",
        content: `## 问题描述

多个进程共享一个数据对象：
- 读者：只读数据，可以多个同时读
- 写者：修改数据，写时不允许其他读者或写者访问

## 读者优先解法

\`\`\`c
semaphore rw = 1;      // 读写互斥
semaphore mutex = 1;   // 保护readcount
int readcount = 0;     // 当前读者数

// 读者
void reader() {
    P(mutex);
    readcount++;
    if (readcount == 1)
        P(rw);         // 第一个读者加锁
    V(mutex);

    // 读数据

    P(mutex);
    readcount--;
    if (readcount == 0)
        V(rw);         // 最后一个读者解锁
    V(mutex);
}

// 写者
void writer() {
    P(rw);
    // 写数据
    V(rw);
}
\`\`\`

**问题：** 读者优先可能导致写者饥饿。

## 写者优先（公平方案）

增加一个信号量w，使新到的读者在有写者等待时也需等待：

\`\`\`c
semaphore rw = 1, mutex = 1, w = 1;
int readcount = 0;

// 读者
void reader() {
    P(w);       // 检查是否有写者等待
    P(mutex);
    readcount++;
    if (readcount == 1) P(rw);
    V(mutex);
    V(w);
    // 读数据
    P(mutex);
    readcount--;
    if (readcount == 0) V(rw);
    V(mutex);
}

// 写者
void writer() {
    P(w);       // 阻止后续读者
    P(rw);
    // 写数据
    V(rw);
    V(w);
}
\`\`\``,
      },
      {
        id: "dining-philosophers",
        title: "哲学家进餐问题",
        type: "walkthrough",
        content: `## 问题描述

5个哲学家围坐圆桌，每人两侧各一根筷子(共5根)。哲学家交替思考和进餐，进餐需同时拿起左右两根筷子。

## 简单解法（可能死锁）

\`\`\`c
semaphore chopstick[5] = {1,1,1,1,1};

void philosopher(int i) {
    while(1) {
        think();
        P(chopstick[i]);       // 拿左筷子
        P(chopstick[(i+1)%5]); // 拿右筷子
        eat();
        V(chopstick[i]);
        V(chopstick[(i+1)%5]);
    }
}
\`\`\`

**死锁场景：** 5人同时拿起左筷子，都等待右筷子。

## 解决死锁的方案

1. **限制人数**：最多允许4人同时进餐
2. **奇偶策略**：奇数号先拿左再拿右，偶数号先拿右再拿左
3. **一次性申请**：同时申请两根筷子`,
        steps: [
          {
            description: "方案2演示：哲学家0(偶数)先拿右筷子，哲学家1(奇数)先拿左筷子",
            state: { chopsticks: [1, 1, 1, 1, 1], philosophers: ["思考", "思考", "思考", "思考", "思考"] },
          },
          {
            description: "哲学家0先拿右筷子(chopstick[1])，哲学家1先拿左筷子(chopstick[1])",
            pseudocode: "P0: P(chopstick[1]); // 竞争chopstick[1]",
            state: { chopsticks: [1, 0, 1, 1, 1], philosophers: ["等右", "等左", "思考", "思考", "思考"], note: "假设P0抢到chopstick[1]" },
          },
          {
            description: "P0继续拿左筷子(chopstick[0])成功，开始进餐",
            pseudocode: "P0: P(chopstick[0]); // 成功",
            state: { chopsticks: [0, 0, 1, 1, 1], philosophers: ["进餐", "阻塞", "思考", "思考", "思考"] },
          },
          {
            description: "P0进餐完毕，释放两根筷子",
            pseudocode: "P0: V(chopstick[1]); V(chopstick[0]);",
            state: { chopsticks: [1, 1, 1, 1, 1], philosophers: ["思考", "就绪", "思考", "思考", "思考"] },
          },
          {
            description: "P1获得chopstick[1]，继续拿chopstick[2]，开始进餐",
            state: { chopsticks: [1, 0, 0, 1, 1], philosophers: ["思考", "进餐", "思考", "思考", "思考"] },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "classic-ex1",
        title: "生产者-消费者变形",
        description: "桌上有一个盘子，每次只能放一个水果。爸爸放苹果，妈妈放橘子，儿子只吃橘子，女儿只吃苹果。请用PV操作实现同步。",
        difficulty: "hard",
        hints: [
          "盘子是大小为1的缓冲区",
          "需要区分苹果和橘子两种产品",
          "考虑哪些进程之间存在同步关系",
        ],
        referenceSolution: `分析同步关系：
- 盘子空时爸爸或妈妈才能放水果（互斥+同步）
- 有苹果时女儿才能取
- 有橘子时儿子才能取

信号量设置：
\`\`\`c
semaphore plate = 1;   // 盘子是否为空
semaphore apple = 0;   // 盘中苹果数
semaphore orange = 0;  // 盘中橘子数

void father() {        // 爸爸放苹果
    while(1) {
        P(plate);
        放苹果;
        V(apple);
    }
}

void mother() {        // 妈妈放橘子
    while(1) {
        P(plate);
        放橘子;
        V(orange);
    }
}

void daughter() {      // 女儿吃苹果
    while(1) {
        P(apple);
        取苹果;
        V(plate);
    }
}

void son() {           // 儿子吃橘子
    while(1) {
        P(orange);
        取橘子;
        V(plate);
    }
}
\`\`\`

注意：这里不需要mutex信号量，因为plate=1已经保证了互斥。`,
      },
    ],
    keyTakeaways: [
      "生产者-消费者：互斥信号量+两个同步信号量(empty/full)",
      "P操作顺序很重要：同步P操作必须在互斥P操作之前",
      "读者-写者：用readcount记录读者数，第一个读者加锁，最后一个解锁",
      "哲学家进餐：简单方案会死锁，需要破坏死锁条件",
    ],
    relatedLessons: ["semaphore", "deadlock-concepts"],
  },
  {
    id: "monitor",
    title: "管程",
    brief: "一种高级同步机制，将共享数据和操作封装在一起，编译器保证互斥",
    analogy: "管程像银行柜台——所有对账户（共享数据）的操作（存取款）都必须通过柜台窗口（管程的过程）进行，柜台一次只服务一个客户（互斥自动保证）。如果需要等待（余额不足），客户在等候区坐下（条件变量wait），等条件满足时被叫号（signal）。",
    prerequisites: ["信号量机制", "互斥的基本概念"],
    commonMistakes: [
      "管程的互斥是由编译器保证的——程序员不需要显式写P/V操作来实现互斥",
      "条件变量的signal和信号量的V操作不同——signal如果没有等待者则什么都不做（信号丢失），V操作总会使信号量+1",
      "管程中同一时刻只能有一个进程活动——即使有多个过程，也只有一个进程能在管程内执行",
      "条件变量本身没有值——它只是一个等待队列，不像信号量有计数值",
    ],
    memoryAids: [
      "管程 = 共享数据 + 一组操作过程 + 初始化代码（面向对象的思想）",
      "管程互斥自动保证（编译器负责），条件同步用条件变量(wait/signal)",
      "Hoare管程：signal后立即让被唤醒者执行（唤醒者等待）",
      "MESA管程：signal后继续执行，被唤醒者稍后竞争进入（Java用的就是这种）",
    ],
    keyTakeaways: [
      "管程是一种程序设计语言结构，由编译器保证互斥访问",
      "管程由四部分组成：名称、共享数据、操作过程、初始化代码",
      "条件变量用于实现进程同步（wait阻塞、signal唤醒）",
      "管程比信号量更安全——不会因为P/V顺序错误导致死锁或互斥失效",
      "Java的synchronized和wait/notify就是管程的实现",
    ],
    relatedLessons: ["semaphore", "classic-problems"],
    sections: [
      {
        id: "monitor-concept",
        title: "管程的定义与组成",
        type: "concept",
        content: `## 为什么需要管程

信号量机制的问题：
- P/V操作分散在各进程中，难以管理
- 容易出错：P/V顺序错误→死锁，遗漏P/V→互斥失效
- 程序可读性差

管程将同步机制集中管理，由编译器保证正确性。

## 管程的定义

管程是由一组共享变量及对这些变量的操作过程组成的一种程序结构。

## 管程的组成

\`\`\`
monitor MonitorName {
    // 1. 共享数据（局部变量）
    int buffer[N];
    int count = 0;

    // 2. 条件变量
    condition notFull, notEmpty;

    // 3. 对共享数据的操作过程
    procedure insert(item) { ... }
    procedure remove() { ... }

    // 4. 初始化代码
    initialization { count = 0; }
}
\`\`\`

## 管程的特性

1. **封装性**：共享数据只能通过管程的过程访问
2. **互斥性**：同一时刻最多一个进程在管程内活动（编译器自动加锁）
3. **同步性**：通过条件变量实现进程间的等待与唤醒`,
      },
      {
        id: "condition-variable",
        title: "条件变量",
        type: "detail",
        content: `## 条件变量的操作

条件变量 x 支持两种操作：

- **x.wait()**：调用进程阻塞，挂到条件变量x的等待队列上，释放管程的使用权
- **x.signal()**：唤醒条件变量x等待队列中的一个进程；若队列为空，则什么都不做

## 条件变量 vs 信号量

| | 条件变量 | 信号量 |
|--|---------|--------|
| 有无值 | 无值（只是等待队列） | 有值（计数器） |
| wait | 一定会阻塞 | S>0时不阻塞 |
| signal/V | 队列空则无效果 | 一定会S+1 |
| 互斥 | 管程自动保证 | 需要程序员写P/V |

## Hoare管程 vs MESA管程

**signal之后谁先执行？**

| | Hoare管程 | MESA管程 |
|--|----------|----------|
| signal后 | 唤醒者让出管程，被唤醒者立即执行 | 唤醒者继续执行，被唤醒者稍后竞争 |
| 被唤醒者 | 可以确信条件成立 | 需要重新检查条件（用while不是if） |
| 实现 | 复杂 | 简单（Java/pthread采用） |

> MESA管程中，signal只是一个"提示"，被唤醒的进程需要重新检查条件是否仍然满足。`,
      },
      {
        id: "monitor-example",
        title: "管程实现生产者-消费者",
        type: "walkthrough",
        content: `用管程解决生产者-消费者问题`,
        steps: [
          {
            description: "定义管程：共享缓冲区buffer[N]，计数器count，条件变量notFull和notEmpty",
            state: { phase: "define", code: "monitor ProducerConsumer { buffer[N]; count=0; condition notFull, notEmpty; }" },
          },
          {
            description: "insert过程：if count==N then notFull.wait(); 将item放入buffer; count++; notEmpty.signal();",
            state: { phase: "insert", note: "缓冲区满则等待notFull，放入后唤醒notEmpty" },
          },
          {
            description: "remove过程：if count==0 then notEmpty.wait(); 从buffer取出item; count--; notFull.signal();",
            state: { phase: "remove", note: "缓冲区空则等待notEmpty，取出后唤醒notFull" },
          },
          {
            description: "生产者调用 ProducerConsumer.insert(item); 消费者调用 ProducerConsumer.remove();",
            state: { phase: "usage", note: "进程只需调用管程过程，互斥由编译器保证" },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "monitor-ex1",
        title: "管程与信号量对比",
        description: "说明以下两种情况下管程相比信号量的优势：\n(1) 程序员不小心把P(mutex)和P(empty)的顺序写反了\n(2) 程序员忘记写V(full)操作",
        difficulty: "medium" as const,
        hints: ["思考信号量方案中这些错误的后果", "管程如何避免这些问题"],
        referenceSolution: "(1) 信号量方案中，如果先P(mutex)再P(empty)，当缓冲区满时：生产者持有mutex等待empty，消费者需要mutex才能取走产品释放empty→死锁。管程中不存在这个问题，因为互斥由编译器自动管理，程序员只需写wait/signal的逻辑。\n\n(2) 信号量方案中，忘记V(full)会导致消费者永远等待在P(full)上，即使缓冲区有产品也取不到→饥饿。管程中，对应操作是signal(notEmpty)，即使忘记写，编译器可以通过静态分析发现管程过程中修改了count但没有signal对应的条件变量，更容易发现错误。",
      },
    ],
  },
];
