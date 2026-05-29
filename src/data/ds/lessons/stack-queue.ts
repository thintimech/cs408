import { Lesson } from "@/types";

export const stackQueueLessons: Lesson[] = [
  {
    id: "stack-implementation",
    title: "栈的实现与核心操作",
    brief: "top 指针怎么动，push/pop 每一行在干什么",
    analogy: "栈就像一摞盘子——只能从最上面放和取（后进先出）。你不能从中间抽盘子，否则上面的会塌。",
    prerequisites: ["顺序表的基本概念", "数组操作"],
    commonMistakes: [
      "top 初始值有两种约定：top=-1（指向栈顶元素）和 top=0（指向栈顶元素的下一个位置），操作顺序不同",
      "top=-1 时：push 先 ++top 再赋值，pop 先取值再 top--",
      "top=0 时：push 先赋值再 top++，pop 先 --top 再取值",
      "共享栈满的条件是 top1 + 1 == top2，不是 top1 == top2",
    ],
    memoryAids: [
      "top=-1 约定：入栈「先加后压」，出栈「先弹后减」",
      "栈的应用三件套：括号匹配、表达式求值、递归转非递归",
    ],
    keyTakeaways: [
      "顺序栈用 top 指针指示栈顶位置，top==-1 表示空栈",
      "push: 先 top++，再赋值；pop: 先取值，再 top--",
      "共享栈：两个栈共用一个数组，从两端向中间生长",
      "链栈：头插法入栈，删头结点出栈，不需要判满",
    ],
    sections: [
      {
        id: "seq-stack",
        title: "顺序栈的代码拆解",
        type: "detail",
        content: `**数据结构定义：**

\`\`\`
#define MaxSize 50
typedef struct {
    int data[MaxSize];  // 存数据的数组
    int top;            // 栈顶指针
} SqStack;
\`\`\`

top 的含义有两种约定（考研必须分清）：

| 约定 | top 指向 | 初始值 | 栈空条件 | 栈满条件 |
|------|----------|--------|----------|----------|
| 约定A | 栈顶元素 | -1 | top==-1 | top==MaxSize-1 |
| 约定B | 栈顶元素的下一个位置 | 0 | top==0 | top==MaxSize |

**考研默认用约定A**（top 指向栈顶元素，初值-1）。

---

**初始化：**

\`\`\`
void InitStack(SqStack *S) {
    S->top = -1;  // 空栈，没有任何元素
}
\`\`\`

**判空：**

\`\`\`
bool StackEmpty(SqStack S) {
    return S.top == -1;
}
\`\`\`

---

**入栈 Push — 逐行解释：**

\`\`\`
bool Push(SqStack *S, int x) {
    if (S->top == MaxSize - 1)  // 第1步：判满
        return false;            // 满了就失败
    S->top++;                    // 第2步：指针上移（腾出位置）
    S->data[S->top] = x;        // 第3步：放入元素
    return true;
}
\`\`\`

**为什么是先 top++ 再赋值？**
因为 top 指向当前栈顶元素。新元素要放在栈顶的上面，所以先把指针移到上面那个空位，再放东西。

可以合并写成一行：\`S->data[++S->top] = x;\`

---

**出栈 Pop — 逐行解释：**

\`\`\`
bool Pop(SqStack *S, int *x) {
    if (S->top == -1)            // 第1步：判空
        return false;            // 空了就失败
    *x = S->data[S->top];       // 第2步：取出栈顶元素
    S->top--;                    // 第3步：指针下移
    return true;
}
\`\`\`

**为什么是先取值再 top--？**
因为 top 指向栈顶元素，先把它取出来，然后指针下移表示"这个位置不再有效了"。

可以合并：\`*x = S->data[S->top--];\`

**注意**：Pop 并没有真正删除数据，只是 top 下移了。数据还在数组里，但逻辑上已经不属于栈了。`,
      },
      {
        id: "shared-stack",
        title: "共享栈",
        type: "detail",
        content: `两个栈共用一个数组，一个从底部往上长，一个从顶部往下长：

\`\`\`
typedef struct {
    int data[MaxSize];
    int top0;   // 栈0的栈顶，初值-1，向上增长
    int top1;   // 栈1的栈顶，初值MaxSize，向下增长
} ShStack;
\`\`\`

**栈满条件**：\`top0 + 1 == top1\`（两个栈顶相遇）

**栈0入栈**：\`data[++top0] = x\`
**栈1入栈**：\`data[--top1] = x\`

好处：只要总元素数不超过 MaxSize，两个栈可以灵活分配空间。一个栈多用一点，另一个就少用一点。`,
      },
      {
        id: "linked-stack",
        title: "链栈",
        type: "detail",
        content: `链栈就是用单链表实现的栈，**头结点就是栈顶**。

\`\`\`
typedef struct LinkNode {
    int data;
    struct LinkNode *next;
} *LinkStack;
\`\`\`

**入栈**（头插法）：

\`\`\`
void Push(LinkStack *S, int x) {
    LinkNode *p = (LinkNode*)malloc(sizeof(LinkNode));
    p->data = x;
    p->next = *S;   // 新结点指向原栈顶
    *S = p;          // 更新栈顶指针
}
\`\`\`

**出栈**（删头结点）：

\`\`\`
bool Pop(LinkStack *S, int *x) {
    if (*S == NULL) return false;
    LinkNode *p = *S;
    *x = p->data;
    *S = p->next;    // 栈顶下移
    free(p);
    return true;
}
\`\`\`

**链栈的优势**：不需要判满（动态分配内存），适合栈大小不确定的场景。`,
      },
    ],
    exercises: [],
  },
  {
    id: "queue-implementation",
    title: "队列的实现与循环队列",
    brief: "front/rear 怎么动，循环队列判空判满的三种方法",
    keyTakeaways: [
      "顺序队列用 front 和 rear 两个指针，front 指向队头元素，rear 指向队尾元素的下一个位置",
      "循环队列通过取模运算实现逻辑上的环形结构",
      "牺牲一个存储单元区分队空队满：队空 front==rear，队满 (rear+1)%MaxSize==front",
      "链式队列带头结点时，队空条件为 front==rear（都指向头结点）",
    ],
    sections: [
      {
        id: "seq-queue-problem",
        title: "顺序队列的假溢出问题",
        type: "motivation",
        content: `如果用普通数组实现队列，front 和 rear 都只会往后移动：

\`\`\`
入队：data[rear] = x; rear++;
出队：x = data[front]; front++;
\`\`\`

问题来了：随着不断入队出队，front 和 rear 都往右移，**数组前面的空间被浪费了**，即使数组没满也无法入队。这就是"假溢出"。

**解决方案**：把数组想象成一个环——循环队列。当 rear 到达数组末尾时，如果前面有空位，就绕回到数组开头。

实现方式：所有指针运算都加上 \`% MaxSize\`（取模）。`,
      },
      {
        id: "circular-queue-struct",
        title: "循环队列的结构与指针约定",
        type: "detail",
        content: `**数据结构定义：**

\`\`\`
#define MaxSize 10
typedef struct {
    int data[MaxSize];
    int front;  // 队头指针
    int rear;   // 队尾指针
} SqQueue;
\`\`\`

**指针约定（考研默认）：**
- front 指向队头元素
- rear 指向队尾元素的**下一个位置**（即下一个要入队的位置）
- 初始值：front = rear = 0

**基本指针移动：**
- 入队后 rear 前进：\`rear = (rear + 1) % MaxSize\`
- 出队后 front 前进：\`front = (front + 1) % MaxSize\`

取模的作用：当指针到达 MaxSize-1 后，下一步回到 0，形成"环"。

---

**队列元素个数公式：**

\`\`\`
length = (rear - front + MaxSize) % MaxSize
\`\`\`

为什么要加 MaxSize？因为 rear 可能绕回到 front 前面（rear < front），加上 MaxSize 再取模保证结果为正。`,
      },
      {
        id: "circular-queue-empty-full",
        title: "判空判满的三种方法",
        type: "detail",
        content: `循环队列的核心难点：**队空和队满时，front == rear 都成立**。怎么区分？

---

**方法一：牺牲一个存储单元（考研最常考）**

约定：rear 的下一个位置是 front 时为满，即少用一个空间。

| 条件 | 表达式 |
|------|--------|
| 队空 | front == rear |
| 队满 | (rear + 1) % MaxSize == front |
| 队列长度 | (rear - front + MaxSize) % MaxSize |

实际最多存 MaxSize - 1 个元素。

---

**方法二：增设 size 变量**

\`\`\`
typedef struct {
    int data[MaxSize];
    int front, rear;
    int size;  // 当前元素个数
} SqQueue;
\`\`\`

| 条件 | 表达式 |
|------|--------|
| 队空 | size == 0 |
| 队满 | size == MaxSize |

好处：可以用满全部 MaxSize 个空间。

---

**方法三：增设 tag 标志**

\`\`\`
typedef struct {
    int data[MaxSize];
    int front, rear;
    int tag;  // 0表示上次是删除操作，1表示上次是插入操作
} SqQueue;
\`\`\`

| 条件 | 表达式 |
|------|--------|
| 队空 | front == rear && tag == 0 |
| 队满 | front == rear && tag == 1 |

逻辑：只有**入队**操作才可能导致满，只有**出队**操作才可能导致空。所以当 front==rear 时，看上次操作是什么就能判断。`,
      },
      {
        id: "circular-queue-ops",
        title: "循环队列基本操作代码",
        type: "detail",
        content: `以下代码使用**方法一（牺牲一个单元）**：

**初始化：**

\`\`\`
void InitQueue(SqQueue *Q) {
    Q->front = 0;
    Q->rear = 0;
}
\`\`\`

**判空：**

\`\`\`
bool QueueEmpty(SqQueue Q) {
    return Q.front == Q.rear;
}
\`\`\`

**入队：**

\`\`\`
bool EnQueue(SqQueue *Q, int x) {
    if ((Q->rear + 1) % MaxSize == Q->front)  // 判满
        return false;
    Q->data[Q->rear] = x;                     // 放入元素
    Q->rear = (Q->rear + 1) % MaxSize;        // rear 前进
    return true;
}
\`\`\`

注意入队顺序：**先放元素，再移指针**（因为 rear 指向的就是下一个空位）。

**出队：**

\`\`\`
bool DeQueue(SqQueue *Q, int *x) {
    if (Q->front == Q->rear)                   // 判空
        return false;
    *x = Q->data[Q->front];                   // 取出元素
    Q->front = (Q->front + 1) % MaxSize;      // front 前进
    return true;
}
\`\`\`

出队顺序：**先取元素，再移指针**（因为 front 指向的就是队头元素）。

**获取队头元素（不出队）：**

\`\`\`
bool GetHead(SqQueue Q, int *x) {
    if (Q.front == Q.rear) return false;
    *x = Q.data[Q.front];
    return true;
}
\`\`\``,
      },
      {
        id: "linked-queue",
        title: "链式队列",
        type: "detail",
        content: `链式队列用单链表实现，需要两个指针：front 指向头结点，rear 指向尾结点。

**数据结构定义：**

\`\`\`
typedef struct LinkNode {
    int data;
    struct LinkNode *next;
} LinkNode;

typedef struct {
    LinkNode *front;  // 队头指针（指向头结点）
    LinkNode *rear;   // 队尾指针（指向最后一个结点）
} LinkQueue;
\`\`\`

**带头结点的链式队列：**

初始化：front 和 rear 都指向头结点。

\`\`\`
void InitQueue(LinkQueue *Q) {
    Q->front = Q->rear = (LinkNode*)malloc(sizeof(LinkNode));
    Q->front->next = NULL;
}
\`\`\`

**队空条件**：\`Q->front == Q->rear\`（或 \`Q->front->next == NULL\`）

---

**入队（尾插法）：**

\`\`\`
void EnQueue(LinkQueue *Q, int x) {
    LinkNode *s = (LinkNode*)malloc(sizeof(LinkNode));
    s->data = x;
    s->next = NULL;
    Q->rear->next = s;  // 新结点接在队尾后面
    Q->rear = s;         // rear 指向新的队尾
}
\`\`\`

**出队（删除头结点后的第一个结点）：**

\`\`\`
bool DeQueue(LinkQueue *Q, int *x) {
    if (Q->front == Q->rear) return false;  // 队空
    LinkNode *p = Q->front->next;           // p 指向队头元素
    *x = p->data;
    Q->front->next = p->next;              // 头结点指向下一个
    if (Q->rear == p)                       // 如果删的是最后一个结点
        Q->rear = Q->front;                // rear 也要回到头结点
    free(p);
    return true;
}
\`\`\`

**关键细节**：出队时如果删除的是最后一个数据结点（即 rear 指向的结点），必须把 rear 重新指向头结点，否则 rear 变成野指针。

---

**链式队列 vs 循环队列：**

| 特性 | 循环队列 | 链式队列 |
|------|----------|----------|
| 空间 | 固定大小，可能浪费 | 动态分配，按需增长 |
| 判满 | 需要判满 | 不需要（内存够就能入队） |
| 适用场景 | 元素个数可预估 | 元素个数变化大 |`,
      },
    ],
    exercises: [],
  },
  {
    id: "deque",
    title: "双端队列",
    brief: "两端都能进出的队列，以及输出序列的合法性判断",
    keyTakeaways: [
      "双端队列：两端都可以入队和出队",
      "输入受限双端队列：只能从一端入队，两端都能出队",
      "输出受限双端队列：两端都能入队，只能从一端出队",
      "判断输出序列合法性：模拟操作过程，看是否能产生给定序列",
    ],
    sections: [
      {
        id: "deque-concept",
        title: "双端队列的概念",
        type: "concept",
        content: `双端队列（Deque, Double-Ended Queue）是一种两端都可以进行入队和出队操作的线性结构。

**三种变体：**

| 类型 | 前端 | 后端 |
|------|------|------|
| 双端队列 | 可入可出 | 可入可出 |
| 输入受限双端队列 | 只能出 | 可入可出 |
| 输出受限双端队列 | 可入可出 | 只能出 |

注意：
- 如果限制只能从一端入、同一端出 → 就是**栈**
- 如果限制只能从一端入、另一端出 → 就是普通**队列**

所以栈和队列都是双端队列的特例。`,
      },
      {
        id: "deque-simulation",
        title: "双端队列操作模拟",
        type: "walkthrough",
        content: `考研常考题型：给定输入序列 1,2,3,4，判断某个输出序列是否合法。

**解题方法**：模拟操作过程。每个元素按顺序到达，到达时可以选择从前端或后端入队；出队时也可以选择从前端或后端取。

**例题**：输入序列为 1,2,3,4，判断输出序列 4,2,1,3 在输出受限双端队列中是否合法。

输出受限 = 两端都能入，只能从前端出。`,
        steps: [
          {
            description: "元素 1 到达，从后端入队。队列状态：[1]（前端←→后端）",
            state: { queue: [1], front: "左", rear: "右", action: "1 从后端入队" },
          },
          {
            description: "元素 2 到达，从后端入队。队列状态：[1, 2]",
            state: { queue: [1, 2], front: "左", rear: "右", action: "2 从后端入队" },
          },
          {
            description: "元素 3 到达，从前端入队。队列状态：[3, 1, 2]",
            state: { queue: [3, 1, 2], front: "左", rear: "右", action: "3 从前端入队" },
          },
          {
            description: "元素 4 到达，从前端入队。队列状态：[4, 3, 1, 2]",
            state: { queue: [4, 3, 1, 2], front: "左", rear: "右", action: "4 从前端入队" },
          },
          {
            description: "从前端出队：得到 4。队列状态：[3, 1, 2]。输出序列：4",
            state: { queue: [3, 1, 2], front: "左", rear: "右", action: "前端出队 → 4", output: [4] },
          },
          {
            description: "从前端出队：得到 3。但我们需要的是 2！这条路走不通。换一种入队策略试试。",
            state: { queue: [3, 1, 2], front: "左", rear: "右", action: "前端出队 → 3 ≠ 2，需要换策略" },
          },
          {
            description: "重新尝试：1从后端入，2从前端入，3从后端入，4从前端入 → 队列 [4, 2, 1, 3]",
            state: { queue: [4, 2, 1, 3], front: "左", rear: "右", action: "新策略入队完成" },
          },
          {
            description: "依次从前端出队：4, 2, 1, 3。正好是目标序列！所以 4,2,1,3 是合法的。",
            state: { queue: [], output: [4, 2, 1, 3], action: "合法！" },
          },
        ],
      },
      {
        id: "deque-exam-tips",
        title: "考试技巧：快速判断合法性",
        type: "detail",
        content: `**对于普通栈**，输入 1,2,...,n 时，输出序列的充要条件是：不存在 i < j < k 使得输出中 k 在 i 前面且 i 在 j 前面（即不存在 k...i...j 的模式，其中 i<j<k）。

**对于双端队列**，合法序列的范围比栈更大（因为操作更灵活）。

**快速判断方法：**

1. **输入受限双端队列**不能产生的序列：不存在 i < j < k 使得输出顺序为 k, i, j（即不能出现"大小中"的模式）

2. **输出受限双端队列**不能产生的序列：不存在 i < j < k 使得输出顺序为 j, k, i（即不能出现"中大小"的模式）

注意：以上是**必要条件**（出现该模式一定非法），但不是充分条件。没有该模式不代表一定合法，仍需模拟验证。

**考试实战**：如果选择题问"以下哪个不是合法输出序列"，直接模拟操作过程最稳妥。对于 4 个元素的情况，模拟几步就能得出答案。

---

**常见考题形式：**
- 输入 1,2,3,4，以下哪个不能由输入受限双端队列得到？
- 输入 1,2,3，以下哪些是输出受限双端队列的合法输出？

做题时画一个双端队列的图，标明哪端能入哪端能出，然后逐步模拟。`,
      },
    ],
    exercises: [],
  },
  {
    id: "bracket-matching",
    title: "栈的应用：括号匹配",
    brief: "用栈实现括号匹配的完整算法与代码",
    keyTakeaways: [
      "遇到左括号就入栈，遇到右括号就弹栈并检查是否匹配",
      "三种不匹配情况：右括号多余（栈空）、左括号多余（遍历完栈非空）、左右不配对",
      "算法时间复杂度 O(n)，空间复杂度 O(n)",
    ],
    sections: [
      {
        id: "bracket-idea",
        title: "括号匹配的核心思路",
        type: "concept",
        content: `括号匹配是栈最经典的应用之一。

**为什么用栈？** 因为括号匹配具有"最近匹配"的特性——最后出现的左括号要最先被匹配，这正是后进先出（LIFO）。

**算法思路：**
1. 从左到右扫描表达式
2. 遇到**左括号**：入栈（等待匹配）
3. 遇到**右括号**：弹出栈顶，检查是否配对
4. 扫描完毕后，栈为空则匹配成功

**三种失败情况：**
- 遇到右括号时栈已空 → 右括号多余
- 弹出的左括号与当前右括号不配对 → 类型不匹配
- 扫描结束后栈不为空 → 左括号多余`,
      },
      {
        id: "bracket-walkthrough",
        title: "括号匹配过程演示",
        type: "walkthrough",
        content: `以表达式 \`{[()]}\` 为例，演示匹配过程：`,
        steps: [
          {
            description: "读入 '{' — 是左括号，入栈",
            pseudocode: "Push(S, '{')",
            state: { stack: ["{"], input: "{[()]}", pos: 0 },
          },
          {
            description: "读入 '[' — 是左括号，入栈",
            pseudocode: "Push(S, '[')",
            state: { stack: ["{", "["], input: "{[()]}", pos: 1 },
          },
          {
            description: "读入 '(' — 是左括号，入栈",
            pseudocode: "Push(S, '(')",
            state: { stack: ["{", "[", "("], input: "{[()]}", pos: 2 },
          },
          {
            description: "读入 ')' — 是右括号，弹栈得到 '('，与 ')' 配对成功",
            pseudocode: "Pop(S) → '('  匹配 ')'  ✓",
            state: { stack: ["{", "["], input: "{[()]}", pos: 3 },
          },
          {
            description: "读入 ']' — 是右括号，弹栈得到 '['，与 ']' 配对成功",
            pseudocode: "Pop(S) → '['  匹配 ']'  ✓",
            state: { stack: ["{"], input: "{[()]}", pos: 4 },
          },
          {
            description: "读入 '}' — 是右括号，弹栈得到 '{'，与 '}' 配对成功",
            pseudocode: "Pop(S) → '{'  匹配 '}'  ✓",
            state: { stack: [], input: "{[()]}", pos: 5 },
          },
          {
            description: "扫描结束，栈为空 → 括号匹配成功！",
            pseudocode: "StackEmpty(S) == true → 匹配成功",
            state: { stack: [], input: "{[()]}", pos: 6 },
          },
        ],
      },
      {
        id: "bracket-code",
        title: "括号匹配完整代码",
        type: "detail",
        content: `\`\`\`
bool BracketCheck(char str[], int length) {
    SqStack S;
    InitStack(&S);

    for (int i = 0; i < length; i++) {
        if (str[i] == '(' || str[i] == '[' || str[i] == '{') {
            Push(&S, str[i]);       // 左括号入栈
        } else {
            if (StackEmpty(S))      // 右括号但栈空：右括号多余
                return false;

            char topElem;
            Pop(&S, &topElem);      // 弹出栈顶

            // 检查是否配对
            if (str[i] == ')' && topElem != '(') return false;
            if (str[i] == ']' && topElem != '[') return false;
            if (str[i] == '}' && topElem != '{') return false;
        }
    }

    return StackEmpty(S);  // 栈空则成功，非空则左括号多余
}
\`\`\`

**逐行要点：**
- 第 5 行：只有左括号才入栈，其他字符（数字、运算符）直接跳过
- 第 7-8 行：遇到右括号时如果栈已空，说明没有左括号与之匹配
- 第 12-14 行：三种括号分别检查配对关系
- 第 17 行：最后检查栈是否为空，处理"左括号多余"的情况

**复杂度分析：**
- 时间：O(n)，每个字符最多入栈一次出栈一次
- 空间：O(n)，最坏情况全是左括号`,
      },
    ],
    exercises: [],
  },
  {
    id: "expression-evaluation",
    title: "栈的应用：表达式求值",
    brief: "中缀转后缀、后缀表达式求值的完整算法",
    keyTakeaways: [
      "中缀转后缀：操作数直接输出，运算符根据优先级决定入栈还是弹栈",
      "后缀表达式求值：遇到操作数入栈，遇到运算符弹两个操作数计算后结果入栈",
      "左括号入栈后优先级降为最低，遇到右括号时弹到左括号为止",
      "栈实现表达式求值 = 中缀转后缀 + 后缀求值 的合并",
    ],
    sections: [
      {
        id: "expression-types",
        title: "三种表达式形式",
        type: "concept",
        content: `同一个算术表达式可以写成三种形式：

| 形式 | 示例 (A+B)*C-D | 特点 |
|------|----------------|------|
| 中缀 | (A+B)*C-D | 运算符在操作数中间，需要括号 |
| 前缀（波兰式） | -*+ABCD | 运算符在操作数前面，不需要括号 |
| 后缀（逆波兰式） | AB+C*D- | 运算符在操作数后面，不需要括号 |

**为什么要转后缀？**
- 中缀表达式有优先级和括号，计算机处理起来很麻烦
- 后缀表达式没有括号，运算顺序唯一确定，从左到右扫描一遍就能求值
- 所以计算机求值的标准流程：中缀 → 后缀 → 求值

**手工转换技巧（考试用）：**
1. 按运算顺序给每个运算符加括号：((A+B)*C)-D
2. 把每个运算符移到对应右括号**后面**：((AB)+C)* D)-
3. 去掉所有括号：AB+C*D-

具体操作：+ 移到 (A+B) 的右括号后 → (AB)+；* 移到 ((AB)+C) 的右括号后 → (AB)+C)*；- 移到最外层右括号后 → AB+C*D-`,
      },
      {
        id: "infix-to-postfix",
        title: "中缀转后缀算法",
        type: "detail",
        content: `**算法规则（从左到右扫描中缀表达式）：**

1. 遇到**操作数**：直接加入后缀表达式
2. 遇到**左括号 (**：入栈
3. 遇到**右括号 )**：依次弹出栈中运算符加入后缀表达式，直到遇到左括号（左括号弹出但不加入）
4. 遇到**运算符**：
   - 若栈空或栈顶为 (，直接入栈
   - 若当前运算符优先级**高于**栈顶运算符，入栈
   - 否则，弹出栈顶运算符加入后缀表达式，然后继续与新栈顶比较（重复此步）
5. 扫描完毕后，将栈中剩余运算符依次弹出

**优先级规则：**
- \`*\` \`/\` 高于 \`+\` \`-\`
- 左括号入栈后优先级降为最低（不会被普通运算符弹出）

---

**完整代码：**

\`\`\`
void InfixToPostfix(char infix[], char postfix[]) {
    SqStack S;
    InitStack(&S);
    int j = 0;  // postfix 的写入位置

    for (int i = 0; infix[i] != '\\0'; i++) {
        if (IsOperand(infix[i])) {
            postfix[j++] = infix[i];        // 操作数直接输出
        }
        else if (infix[i] == '(') {
            Push(&S, infix[i]);             // 左括号入栈
        }
        else if (infix[i] == ')') {
            char top;
            while (Pop(&S, &top) && top != '(')
                postfix[j++] = top;         // 弹到左括号为止
        }
        else {  // 运算符
            char top;
            while (!StackEmpty(S) && GetTop(S, &top)
                   && top != '(' && Priority(top) >= Priority(infix[i])) {
                Pop(&S, &top);
                postfix[j++] = top;         // 弹出优先级>=自己的
            }
            Push(&S, infix[i]);             // 自己入栈
        }
    }
    // 弹出栈中剩余运算符
    char top;
    while (Pop(&S, &top))
        postfix[j++] = top;
    postfix[j] = '\\0';
}
\`\`\``,
      },
      {
        id: "infix-to-postfix-walkthrough",
        title: "中缀转后缀过程演示",
        type: "walkthrough",
        content: `以表达式 \`A*(B+C)-D\` 为例，演示转换过程：`,
        steps: [
          {
            description: "读入 A — 操作数，直接输出到后缀表达式",
            pseudocode: "输出: A\n栈: (空)",
            state: { output: "A", stack: [], current: "A" },
          },
          {
            description: "读入 * — 运算符，栈空，直接入栈",
            pseudocode: "输出: A\n栈: *",
            state: { output: "A", stack: ["*"], current: "*" },
          },
          {
            description: "读入 ( — 左括号，直接入栈",
            pseudocode: "输出: A\n栈: * (",
            state: { output: "A", stack: ["*", "("], current: "(" },
          },
          {
            description: "读入 B — 操作数，直接输出",
            pseudocode: "输出: AB\n栈: * (",
            state: { output: "AB", stack: ["*", "("], current: "B" },
          },
          {
            description: "读入 + — 运算符，栈顶是 (，直接入栈",
            pseudocode: "输出: AB\n栈: * ( +",
            state: { output: "AB", stack: ["*", "(", "+"], current: "+" },
          },
          {
            description: "读入 C — 操作数，直接输出",
            pseudocode: "输出: ABC\n栈: * ( +",
            state: { output: "ABC", stack: ["*", "(", "+"], current: "C" },
          },
          {
            description: "读入 ) — 右括号，弹出运算符直到遇到 (。弹出 +，输出；弹出 ( 丢弃",
            pseudocode: "弹出 + → 输出\n弹出 ( → 丢弃\n输出: ABC+\n栈: *",
            state: { output: "ABC+", stack: ["*"], current: ")" },
          },
          {
            description: "读入 - — 优先级 <= 栈顶 *，弹出 * 输出，然后 - 入栈",
            pseudocode: "弹出 * → 输出\n- 入栈\n输出: ABC+*\n栈: -",
            state: { output: "ABC+*", stack: ["-"], current: "-" },
          },
          {
            description: "读入 D — 操作数，直接输出",
            pseudocode: "输出: ABC+*D\n栈: -",
            state: { output: "ABC+*D", stack: ["-"], current: "D" },
          },
          {
            description: "扫描结束，弹出栈中剩余运算符 -",
            pseudocode: "弹出 - → 输出\n最终结果: ABC+*D-",
            state: { output: "ABC+*D-", stack: [], current: "结束" },
          },
        ],
      },
      {
        id: "postfix-evaluation",
        title: "后缀表达式求值",
        type: "detail",
        content: `后缀表达式求值非常简单，只需要一个操作数栈：

**算法规则：**
1. 遇到**操作数**：入栈
2. 遇到**运算符**：弹出两个操作数，计算结果入栈
3. 最终栈中唯一的元素就是结果

**注意弹出顺序**：先弹出的是右操作数，后弹出的是左操作数。对于减法和除法，顺序很重要！

---

**代码实现：**

\`\`\`
int EvalPostfix(char postfix[]) {
    SqStack S;
    InitStack(&S);

    for (int i = 0; postfix[i] != '\\0'; i++) {
        if (IsOperand(postfix[i])) {
            Push(&S, postfix[i] - '0');  // 字符转数字入栈
        } else {
            int b, a;
            Pop(&S, &b);  // 先弹出的是右操作数
            Pop(&S, &a);  // 后弹出的是左操作数
            int result;
            switch (postfix[i]) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = a / b; break;
            }
            Push(&S, result);  // 结果入栈
        }
    }
    int ans;
    Pop(&S, &ans);
    return ans;
}
\`\`\`

**例**：求值 \`23+4*\`
- 读 2：入栈 → [2]
- 读 3：入栈 → [2, 3]
- 读 +：弹 3 和 2，算 2+3=5，入栈 → [5]
- 读 4：入栈 → [5, 4]
- 读 *：弹 4 和 5，算 5*4=20，入栈 → [20]
- 结果：20`,
      },
      {
        id: "combined-evaluation",
        title: "用栈直接求值中缀表达式",
        type: "detail",
        content: `实际上可以把"中缀转后缀"和"后缀求值"合并成一个算法，用**两个栈**同时完成：

- **操作数栈**（OPND）：存放操作数
- **运算符栈**（OPTR）：存放运算符

**合并算法规则：**
1. 遇到操作数 → 入操作数栈
2. 遇到运算符 → 与运算符栈顶比较优先级：
   - 若高于栈顶：入运算符栈
   - 若低于或等于栈顶：弹出栈顶运算符，从操作数栈弹两个数计算，结果入操作数栈，然后继续比较
3. 遇到 ( → 入运算符栈
4. 遇到 ) → 弹运算符并计算，直到遇到 (
5. 扫描完毕 → 依次弹出运算符并计算

**本质**：不再生成后缀表达式字符串，而是在"应该输出运算符"的时候直接执行计算。

---

**考研重点总结：**

| 考点 | 要记住的 |
|------|----------|
| 中缀转后缀 | 操作数顺序不变，运算符顺序由优先级决定 |
| 后缀求值 | 遇运算符弹两个数，先弹的是右操作数 |
| 左括号 | 入栈后优先级最低，只有右括号能弹它 |
| 相同优先级 | 左结合则弹出（+ - * / 都是左结合） |
| 栈的作用 | 运算符栈实现了"延迟输出"——等到确定顺序后再输出 |`,
      },
    ],
    exercises: [],
  },
  {
    id: "matrix-compression",
    title: "特殊矩阵的压缩存储",
    brief: "对称矩阵、三角矩阵、三对角矩阵的下标映射公式，稀疏矩阵的存储方式",
    keyTakeaways: [
      "压缩存储的核心：利用矩阵的特殊规律，只存有效数据，用公式算出原下标与一维数组下标的对应关系",
      "对称矩阵只存下三角（含主对角线），元素个数 n(n+1)/2",
      "三对角矩阵每行最多3个非零元素，映射公式 k = 2i + j - 3（行列从1开始）",
      "稀疏矩阵用三元组 (行, 列, 值) 存储，适合顺序表或十字链表",
    ],
    sections: [
      {
        id: "compression-motivation",
        title: "为什么要压缩存储",
        type: "motivation",
        content: `一个 n×n 的矩阵需要 n² 个存储单元。但很多矩阵有大量重复或零元素：

- 对称矩阵：a[i][j] == a[j][i]，将近一半元素是重复的
- 三角矩阵：上三角或下三角全是常数（通常为0）
- 三对角矩阵：只有主对角线及其相邻两条对角线有非零元素
- 稀疏矩阵：绝大多数元素为0

**压缩思路**：只存储有意义的元素，放进一维数组，然后用公式把二维下标 (i,j) 映射到一维下标 k。

考研考什么？**给你 (i,j)，让你算 k；或者给你 k，让你反推 (i,j)**。本质就是记公式、套公式。`,
      },
      {
        id: "symmetric-matrix",
        title: "对称矩阵",
        type: "detail",
        content: `对称矩阵满足 a[i][j] = a[j][i]，所以只需要存**下三角区 + 主对角线**。

**存储元素个数**：1 + 2 + 3 + ... + n = n(n+1)/2

用一维数组 B[0..n(n+1)/2-1] 存储。

---

**下标映射公式（行列从1开始，数组从0开始）：**

存下三角（i >= j 的部分），按行优先存储：

第 i 行前面有 1+2+...+(i-1) = i(i-1)/2 个元素，当前行第 j 个元素的位置：

\`\`\`
当 i >= j 时：k = i(i-1)/2 + j - 1
当 i < j 时：k = j(j-1)/2 + i - 1  （利用对称性，交换 i,j）
\`\`\`

**例**：5×5 对称矩阵，求 a[3][2] 在一维数组中的位置：
- i=3, j=2, i>=j
- k = 3×2/2 + 2 - 1 = 3 + 1 = 4
- 即 B[4]

**例**：求 a[2][4] 的位置：
- i=2, j=4, i<j，交换得 i'=4, j'=2
- k = 4×3/2 + 2 - 1 = 6 + 1 = 7
- 即 B[7]

---

**如果行列从0开始**，公式变为：
\`\`\`
当 i >= j 时：k = i(i+1)/2 + j
当 i < j 时：k = j(j+1)/2 + i
\`\`\`

考试时注意题目说的是"从0开始"还是"从1开始"。`,
      },
      {
        id: "triangular-matrix",
        title: "三角矩阵",
        type: "detail",
        content: `**下三角矩阵**：上三角区（不含主对角线）的元素全部相同（通常为常数 c）。

存储方式：下三角按行优先存入一维数组，最后多存一个常数 c。

数组大小：n(n+1)/2 + 1

**下标映射（行列从1开始）：**

\`\`\`
当 i >= j 时：k = i(i-1)/2 + j - 1    （下三角区，和对称矩阵一样）
当 i < j 时：k = n(n+1)/2              （上三角区，都映射到最后那个常数）
\`\`\`

---

**上三角矩阵**：下三角区元素全为常数 c。

存储方式：上三角按行优先存入一维数组，最后存常数 c。

第 i 行（从1开始）在上三角中有 n-i+1 个元素。第 i 行前面所有行的元素总数：

(n) + (n-1) + ... + (n-i+2) = (i-1)(2n-i+2)/2

**下标映射（行列从1开始）：**

\`\`\`
当 i <= j 时：k = (i-1)(2n-i+2)/2 + (j-i)
当 i > j 时：k = n(n+1)/2              （下三角区，映射到常数）
\`\`\`

---

**考试技巧**：三角矩阵的公式不需要死记。记住思路：
1. 数清当前元素前面有多少个元素（按行累加）
2. 那个数就是一维下标 k（从0开始时）`,
      },
      {
        id: "tridiagonal-matrix",
        title: "三对角矩阵（带状矩阵）",
        type: "detail",
        content: `三对角矩阵：只有主对角线、主对角线上方一条、下方一条有非零元素。即 |i-j| <= 1 时元素非零。

\`\`\`
× × 0 0 0
× × × 0 0
0 × × × 0
0 0 × × ×
0 0 0 × ×
\`\`\`

**非零元素个数**：第1行2个，最后一行2个，中间每行3个 → 总共 3n - 2 个。

---

**下标映射公式（行列从1开始，数组从0开始）：**

按行优先存储。第 i 行前面的元素个数：
- 第1行有2个，第2~(i-1)行各有3个
- 总共：2 + 3×(i-2) = 3i - 4 个（i >= 2）

当前行中，元素 a[i][j] 是该行第 (j-i+2) 个（因为该行从第 i-1 列开始）

\`\`\`
k = 2(i-1) + (j-1) = 2i + j - 3
\`\`\`

**验证**：
- a[1][1]: k = 2+1-3 = 0 ✓
- a[1][2]: k = 2+2-3 = 1 ✓
- a[2][1]: k = 4+1-3 = 2 ✓
- a[2][2]: k = 4+2-3 = 3 ✓

---

**已知 k 反推 (i,j)：**

\`\`\`
i = (k+1) / 3 + 1    （整数除法，向下取整）
j = k - 2i + 3
\`\`\`

或者用：i = ⌊(k+1)/3⌋ + 1

**验证**：k=1 → i = 2/3+1 = 1, j = 1-2+3 = 2 → a[1][2] ✓

**考试常见问法**：a[i][j] 存储在一维数组的第几个位置？直接代入 k = 2i+j-3（注意起始下标）。`,
      },
      {
        id: "sparse-matrix",
        title: "稀疏矩阵",
        type: "detail",
        content: `稀疏矩阵：非零元素个数远少于总元素个数（通常不到5%）。

**不能用公式压缩**——因为非零元素的位置没有规律。只能**记录每个非零元素的位置和值**。

---

**存储方式一：三元组表（顺序存储）**

每个非零元素存为三元组 (i, j, value)：

\`\`\`
typedef struct {
    int i, j;      // 行号、列号
    int value;     // 元素值
} Triple;

typedef struct {
    Triple data[MaxSize];  // 三元组数组
    int rows, cols, nums;  // 行数、列数、非零元素个数
} TSMatrix;
\`\`\`

三元组按**行优先**排列（同一行内按列号递增）。

优点：顺序存储，便于按行遍历
缺点：插入删除需要移动大量元素

---

**存储方式二：十字链表（链式存储）**

每个非零元素是一个结点，同时在两个链表中：
- **行链表**：同一行的非零元素链在一起
- **列链表**：同一列的非零元素链在一起

\`\`\`
typedef struct OLNode {
    int i, j, value;
    struct OLNode *right;  // 同一行的下一个非零元素
    struct OLNode *down;   // 同一列的下一个非零元素
} OLNode;

typedef struct {
    OLNode *rhead[];  // 行头指针数组
    OLNode *chead[];  // 列头指针数组
    int rows, cols, nums;
} CrossList;
\`\`\`

优点：插入删除方便，适合矩阵运算（加法、乘法）
缺点：结构复杂，存储开销大

---

**考研重点对比：**

| 存储方式 | 适用场景 | 优点 | 缺点 |
|----------|----------|------|------|
| 三元组表 | 非零元素不常变化 | 简单，节省空间 | 不便于随机存取和动态修改 |
| 十字链表 | 需要频繁插入删除 | 灵活，便于矩阵运算 | 实现复杂 |

**稀疏矩阵必须存储的信息**：行号、列号、值（三元组），以及矩阵的总行数、总列数、非零元素个数。`,
      },
    ],
    exercises: [],
  },
];
