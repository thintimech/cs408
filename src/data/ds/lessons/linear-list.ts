import { Lesson } from "@/types";

export const linearListLessons: Lesson[] = [
  {
    id: "sequential-list",
    title: "顺序表的实现与操作",
    brief: "用数组实现线性表，插入删除查找的代码与时间复杂度分析",
    analogy: "顺序表就像电影院的一排座位——座位号连续，找第几个人很快（O(1)），但中间插人需要后面所有人挪位子。",
    prerequisites: ["C语言指针与数组基础", "时间复杂度 O 记号"],
    commonMistakes: [
      "插入位序范围是 [1, n+1]，不是 [1, n]——可以在表尾后面插入",
      "删除位序范围是 [1, n]，不是 [0, n-1]——位序从1开始",
      "动态分配 realloc 后原指针可能失效，需要重新赋值",
    ],
    memoryAids: [
      "插入从后往前移（防覆盖），删除从前往后移（补空位）",
      "插入移 n/2，删除移 (n-1)/2——记住分母都是2",
    ],
    keyTakeaways: [
      "顺序表用一段连续的存储空间存放元素，支持随机访问 O(1)",
      "插入操作平均移动 n/2 个元素，时间复杂度 O(n)",
      "删除操作平均移动 (n-1)/2 个元素，时间复杂度 O(n)",
      "按值查找平均比较 n/2 次，O(n)；按位查找 O(1)",
    ],
    sections: [
      {
        id: "seq-list-struct",
        title: "顺序表的定义",
        type: "detail",
        content: `**静态分配：**

\`\`\`
#define MaxSize 50
typedef struct {
    int data[MaxSize];  // 数组存放元素
    int length;         // 当前长度
} SqList;
\`\`\`

**动态分配：**

\`\`\`
typedef struct {
    int *data;      // 动态分配的数组指针
    int length;     // 当前长度
    int maxSize;    // 最大容量
} SeqList;

void InitList(SeqList *L) {
    L->data = (int*)malloc(MaxSize * sizeof(int));
    L->length = 0;
    L->maxSize = MaxSize;
}
\`\`\`

两者的区别：静态分配大小固定，满了就溢出；动态分配满了可以 realloc 扩容（但需要复制数据，代价大）。

**顺序表的核心特征**：逻辑上相邻的元素，物理上也相邻。可以通过起始地址 + 偏移量直接算出任意元素的地址：

\`\`\`
LOC(a[i]) = LOC(a[0]) + i * sizeof(ElemType)
\`\`\``,
      },
      {
        id: "seq-list-insert",
        title: "插入操作",
        type: "detail",
        content: `在第 i 个位置插入元素 e（位序从1开始）：

\`\`\`
bool ListInsert(SqList *L, int i, int e) {
    if (i < 1 || i > L->length + 1)  // 判断位序合法性
        return false;
    if (L->length >= MaxSize)          // 判满
        return false;
    for (int j = L->length; j >= i; j--)
        L->data[j] = L->data[j-1];    // 从后往前逐个后移
    L->data[i-1] = e;                  // 插入新元素
    L->length++;
    return true;
}
\`\`\`

**为什么从后往前移？** 如果从前往后移，后面的元素会被覆盖。

**时间复杂度分析：**
- 最好情况：插在表尾（i = n+1），不需要移动，O(1)
- 最坏情况：插在表头（i = 1），移动 n 个元素，O(n)
- 平均情况：假设每个位置等概率，平均移动 n/2 个元素，**O(n)**`,
      },
      {
        id: "seq-list-delete",
        title: "删除操作",
        type: "detail",
        content: `删除第 i 个位置的元素，用 e 返回其值：

\`\`\`
bool ListDelete(SqList *L, int i, int *e) {
    if (i < 1 || i > L->length)       // 判断位序合法性
        return false;
    *e = L->data[i-1];                 // 取出被删元素
    for (int j = i; j < L->length; j++)
        L->data[j-1] = L->data[j];    // 从前往后逐个前移
    L->length--;
    return true;
}
\`\`\`

**为什么从前往后移？** 删除后留下空位，后面的元素依次往前补。如果从后往前移会覆盖。

**时间复杂度分析：**
- 最好情况：删除表尾元素，不需要移动，O(1)
- 最坏情况：删除表头元素，移动 n-1 个元素，O(n)
- 平均情况：平均移动 (n-1)/2 个元素，**O(n)**`,
      },
      {
        id: "seq-list-search",
        title: "查找操作",
        type: "detail",
        content: `**按位查找**（随机访问）：

\`\`\`
int GetElem(SqList L, int i) {
    return L.data[i-1];  // 直接通过下标访问
}
\`\`\`

时间复杂度：**O(1)**。这是顺序表最大的优势。

---

**按值查找**（顺序查找）：

\`\`\`
int LocateElem(SqList L, int e) {
    for (int i = 0; i < L.length; i++)
        if (L.data[i] == e)
            return i + 1;  // 返回位序
    return 0;              // 未找到
}
\`\`\`

时间复杂度：
- 最好情况：第一个就是，O(1)
- 最坏情况：最后一个或不存在，O(n)
- 平均情况：**O(n)**

---

**顺序表优缺点总结：**

| 优点 | 缺点 |
|------|------|
| 随机访问 O(1) | 插入删除需要移动大量元素 O(n) |
| 存储密度高（不需要额外指针） | 需要预先分配连续空间 |
| 缓存友好（空间局部性好） | 扩容代价大（需要复制整个数组） |`,
      },
    ],
    exercises: [
      {
        id: "seq-insert-complexity",
        title: "顺序表插入的平均移动次数",
        description: "一个长度为 n 的顺序表，在任意合法位置等概率插入一个元素，平均需要移动多少个元素？请写出推导过程。",
        difficulty: "easy",
        hints: ["插入位置有 n+1 种可能（位序 1 到 n+1）", "在位序 i 插入需要移动 n-i+1 个元素"],
        referenceSolution: "在位序 i 插入需移动 n-i+1 个元素。\n共有 n+1 个合法位置（i=1,2,...,n+1），等概率 p=1/(n+1)。\n平均移动次数 = Σ(n-i+1)/(n+1)，i从1到n+1\n= (n + n-1 + ... + 1 + 0) / (n+1)\n= n(n+1)/2 / (n+1)\n= n/2",
      },
      {
        id: "seq-delete-error",
        title: "找出代码错误",
        description: "以下顺序表删除代码有什么问题？\n\nbool ListDelete(SqList *L, int i, int *e) {\n    if (i < 1 || i > L->length + 1) return false;\n    *e = L->data[i-1];\n    for (int j = i; j < L->length; j++)\n        L->data[j-1] = L->data[j];\n    L->length--;\n    return true;\n}",
        difficulty: "easy",
        hints: ["注意删除操作的合法位序范围", "对比插入操作的范围判断"],
        referenceSolution: "错误在判断条件：i > L->length + 1 应改为 i > L->length。\n删除只能删已有元素，位序范围是 [1, n]，不是 [1, n+1]。\n插入可以在 n+1 位置插（表尾之后），但删除不能删不存在的位置。",
      },
    ],
  },
  {
    id: "singly-linked-list",
    title: "单链表的实现与建表",
    brief: "单链表基本操作代码，头插法与尾插法建立链表",
    analogy: "链表像寻宝游戏——每个线索（结点）告诉你下一个线索在哪里，想找第5个必须从头一个个跟过去。",
    prerequisites: ["顺序表的基本概念", "C语言结构体与指针"],
    commonMistakes: [
      "忘记判断 p->next 是否为 NULL 就直接访问，导致空指针崩溃",
      "头插法建表结果是逆序的——输入 1,2,3 得到 3→2→1",
      "删除结点后忘记 free，造成内存泄漏（考研代码题常扣分点）",
      "混淆「在第 i 个位置插入」和「在第 i 个结点后面插入」",
    ],
    memoryAids: [
      "头插逆序，尾插顺序",
      "找前驱用「前插变后插」：先插后面再交换数据",
    ],
    keyTakeaways: [
      "头结点使空表和非空表的操作统一，简化边界处理",
      "头插法建表：每次插在头结点后面，结果与输入顺序相反",
      "尾插法建表：维护尾指针，每次接在末尾，结果与输入顺序相同",
      "单链表不支持随机访问，按位查找 O(n)，但插入删除只需改指针 O(1)",
    ],
    sections: [
      {
        id: "linked-list-struct",
        title: "单链表的结构定义",
        type: "detail",
        content: `\`\`\`
typedef struct LNode {
    int data;            // 数据域
    struct LNode *next;  // 指针域，指向下一个结点
} LNode, *LinkList;
\`\`\`

\`LNode *\` 和 \`LinkList\` 是同一个类型。习惯上用 LinkList 强调"这是一个链表"，用 LNode* 强调"这是一个结点指针"。

**带头结点 vs 不带头结点：**

| | 带头结点 | 不带头结点 |
|--|----------|------------|
| 空表 | head->next == NULL | head == NULL |
| 第一个数据结点 | head->next | head |
| 插入/删除第一个元素 | 和其他位置操作一样 | 需要特殊处理（修改头指针） |

**考研默认带头结点**，除非题目特别说明。`,
      },
      {
        id: "linked-list-ops",
        title: "基本操作代码",
        type: "detail",
        content: `**按位查找**（找第 i 个结点）：

\`\`\`
LNode* GetElem(LinkList L, int i) {
    if (i < 0) return NULL;
    LNode *p = L;          // p 指向头结点（第0个）
    int j = 0;
    while (p != NULL && j < i) {
        p = p->next;
        j++;
    }
    return p;              // 返回第 i 个结点，或 NULL
}
\`\`\`

时间复杂度：O(n)

---

**按值查找**：

\`\`\`
LNode* LocateElem(LinkList L, int e) {
    LNode *p = L->next;   // 从第一个数据结点开始
    while (p != NULL && p->data != e)
        p = p->next;
    return p;              // 找到返回结点指针，否则 NULL
}
\`\`\`

---

**在第 i 个位置插入**：

\`\`\`
bool ListInsert(LinkList L, int i, int e) {
    LNode *p = GetElem(L, i-1);  // 找到第 i-1 个结点
    if (p == NULL) return false;
    LNode *s = (LNode*)malloc(sizeof(LNode));
    s->data = e;
    s->next = p->next;           // 新结点指向原第 i 个
    p->next = s;                 // 第 i-1 个指向新结点
    return true;
}
\`\`\`

关键：要找到插入位置的**前驱结点**。找前驱需要 O(n)，改指针只需 O(1)。

---

**删除第 i 个结点**：

\`\`\`
bool ListDelete(LinkList L, int i, int *e) {
    LNode *p = GetElem(L, i-1);  // 找到第 i-1 个结点
    if (p == NULL || p->next == NULL) return false;
    LNode *q = p->next;          // q 指向要删除的结点
    *e = q->data;
    p->next = q->next;           // 跳过 q
    free(q);
    return true;
}
\`\`\``,
      },
      {
        id: "head-insert",
        title: "头插法建立单链表",
        type: "detail",
        content: `每次把新结点插在头结点后面：

\`\`\`
LinkList HeadInsert(LinkList L) {
    L = (LNode*)malloc(sizeof(LNode));  // 创建头结点
    L->next = NULL;
    int x;
    scanf("%d", &x);
    while (x != 9999) {                 // 9999 为结束标志
        LNode *s = (LNode*)malloc(sizeof(LNode));
        s->data = x;
        s->next = L->next;             // 新结点指向原第一个
        L->next = s;                   // 头结点指向新结点
        scanf("%d", &x);
    }
    return L;
}
\`\`\`

**特点**：输入 1, 2, 3, 4 → 链表中顺序为 4, 3, 2, 1（**逆序**）

**应用**：链表逆置可以用头插法思想——把原链表的结点逐个摘下来，头插到新链表。

时间复杂度：O(n)`,
      },
      {
        id: "tail-insert",
        title: "尾插法建立单链表",
        type: "detail",
        content: `维护一个尾指针 r，每次把新结点接在末尾：

\`\`\`
LinkList TailInsert(LinkList L) {
    L = (LNode*)malloc(sizeof(LNode));  // 创建头结点
    L->next = NULL;
    LNode *r = L;                       // r 始终指向尾结点
    int x;
    scanf("%d", &x);
    while (x != 9999) {
        LNode *s = (LNode*)malloc(sizeof(LNode));
        s->data = x;
        s->next = NULL;
        r->next = s;                   // 尾结点指向新结点
        r = s;                         // r 移到新的尾结点
        scanf("%d", &x);
    }
    return L;
}
\`\`\`

**特点**：输入 1, 2, 3, 4 → 链表中顺序为 1, 2, 3, 4（**正序**）

**关键**：必须维护尾指针 r，否则每次都要从头遍历到尾部才能插入，变成 O(n^2)。

时间复杂度：O(n)

---

**头插法 vs 尾插法对比：**

| | 头插法 | 尾插法 |
|--|--------|--------|
| 插入位置 | 头结点之后 | 尾结点之后 |
| 结果顺序 | 与输入相反 | 与输入相同 |
| 是否需要尾指针 | 不需要 | 需要 |
| 时间复杂度 | O(n) | O(n) |`,
      },
    ],
    exercises: [
      {
        id: "linked-list-reverse",
        title: "链表逆置",
        description: "设计一个算法，将带头结点的单链表就地逆置（不能申请新结点，空间复杂度 O(1)）。写出完整代码。",
        difficulty: "medium",
        hints: ["可以用头插法的思想：依次取下每个结点，插到头结点后面", "也可以用三指针法：pre、cur、next 逐个翻转指针方向"],
        referenceSolution: "方法一（头插法）：\nvoid Reverse(LinkList L) {\n    LNode *p = L->next, *q;\n    L->next = NULL;  // 断开\n    while (p != NULL) {\n        q = p->next;      // 保存后继\n        p->next = L->next; // 头插\n        L->next = p;\n        p = q;\n    }\n}\n\n方法二（三指针）：\nvoid Reverse(LinkList L) {\n    LNode *pre = NULL, *cur = L->next, *next;\n    while (cur != NULL) {\n        next = cur->next;\n        cur->next = pre;\n        pre = cur;\n        cur = next;\n    }\n    L->next = pre;\n}",
      },
      {
        id: "linked-list-order",
        title: "头插法建表的输出顺序",
        description: "用头插法依次插入元素 1, 2, 3, 4, 5 建立单链表（带头结点），画出最终链表结构，并写出从头到尾遍历的输出顺序。",
        difficulty: "easy",
        hints: ["头插法每次把新结点插在头结点后面", "后插入的元素在前面"],
        referenceSolution: "最终链表：head → 5 → 4 → 3 → 2 → 1 → NULL\n遍历输出：5, 4, 3, 2, 1\n\n原因：头插法每次在头结点后插入，后来的元素在前面，所以结果与输入顺序相反。",
      },
    ],
  },
  {
    id: "double-circular-static",
    title: "双链表、循环链表与静态链表",
    brief: "双链表的插入删除、循环链表的特点、静态链表的基本概念",
    analogy: "双链表像双向车道——可以往前走也可以往回走；循环链表像环形跑道——跑到终点又回到起点。",
    prerequisites: ["单链表的结构与基本操作"],
    commonMistakes: [
      "双链表插入时指针赋值顺序错误——必须先连新结点的 prior 和 next，再修改相邻结点的指针",
      "循环单链表判空条件是 L->next == L，不是 L->next == NULL",
      "静态链表的「指针」是数组下标（整数），不是真正的内存地址",
    ],
    memoryAids: [
      "双链表插入口诀：先搭桥（新结点连两边），再拆路（旧结点改指向）",
      "循环链表判空：自己指自己就是空",
    ],
    keyTakeaways: [
      "双链表每个结点有 prior 和 next 两个指针，可以双向遍历",
      "双链表插入删除不需要找前驱，操作更方便但空间开销更大",
      "循环链表的尾结点指向头结点，从任意结点都能遍历整个表",
      "静态链表用数组模拟链表，游标（数组下标）代替指针",
    ],
    sections: [
      {
        id: "double-linked-struct",
        title: "双链表的结构与操作",
        type: "detail",
        content: `\`\`\`
typedef struct DNode {
    int data;
    struct DNode *prior;  // 前驱指针
    struct DNode *next;   // 后继指针
} DNode, *DLinkList;
\`\`\`

**双链表的插入**（在 p 结点之后插入 s）：

\`\`\`
bool InsertNextDNode(DNode *p, DNode *s) {
    if (p == NULL || s == NULL) return false;
    s->next = p->next;       // 1. s 的 next 指向 p 的后继
    if (p->next != NULL)
        p->next->prior = s;  // 2. p 的后继的 prior 指向 s
    s->prior = p;            // 3. s 的 prior 指向 p
    p->next = s;             // 4. p 的 next 指向 s
    return true;
}
\`\`\`

**指针修改顺序很重要**：必须先处理 s->next 和原后继结点的 prior，最后才改 p->next。否则会丢失对原后继结点的引用。

---

**双链表的删除**（删除 p 的后继结点 q）：

\`\`\`
bool DeleteNextDNode(DNode *p) {
    if (p == NULL || p->next == NULL) return false;
    DNode *q = p->next;      // q 是要删除的结点
    p->next = q->next;       // p 的 next 跳过 q
    if (q->next != NULL)
        q->next->prior = p;  // q 的后继的 prior 指向 p
    free(q);
    return true;
}
\`\`\`

**双链表的优势**：已知某个结点 p，可以 O(1) 找到前驱并删除自己。单链表做不到这一点（必须从头遍历找前驱）。`,
      },
      {
        id: "circular-linked-list",
        title: "循环链表",
        type: "detail",
        content: `**循环单链表**：尾结点的 next 不是 NULL，而是指向头结点。

\`\`\`
// 判空（带头结点）
bool Empty(LinkList L) {
    return L->next == L;  // 不是 NULL，是指向自己
}
\`\`\`

**循环单链表的特点**：
- 从任意结点出发都能遍历整个链表
- 没有 NULL 指针，遍历终止条件变为 \`p->next == L\`（回到头结点）
- 如果经常需要操作表头和表尾，可以只保留**尾指针** r：
  - 表尾：r
  - 表头（第一个数据结点）：r->next->next
  - 在表头插入和在表尾插入都是 O(1)

---

**循环双链表**：尾结点的 next 指向头结点，头结点的 prior 指向尾结点。

\`\`\`
// 初始化循环双链表
bool InitDLinkList(DLinkList *L) {
    *L = (DNode*)malloc(sizeof(DNode));
    (*L)->prior = *L;  // 头结点的 prior 指向自己
    (*L)->next = *L;   // 头结点的 next 指向自己
}

// 判空
bool Empty(DLinkList L) {
    return L->next == L;
}
\`\`\`

**循环双链表的优势**：
- 插入和删除操作不需要判断是否是最后一个结点（因为没有 NULL）
- 双链表删除代码中的 \`if (q->next != NULL)\` 判断可以去掉

插入操作简化为：
\`\`\`
s->next = p->next;
p->next->prior = s;
s->prior = p;
p->next = s;
\`\`\`

不需要任何 NULL 判断，因为循环结构保证所有指针都有效。`,
      },
      {
        id: "static-linked-list",
        title: "静态链表",
        type: "detail",
        content: `静态链表：用**数组**模拟链表。每个数组元素包含数据和"游标"（下一个元素的数组下标）。

\`\`\`
#define MaxSize 50
typedef struct {
    int data;    // 数据
    int next;    // 游标：下一个元素的数组下标
} SLinkList[MaxSize];
\`\`\`

**为什么需要静态链表？**
- 某些语言没有指针（如早期的 BASIC、Fortran）
- 需要在不支持动态内存分配的环境中使用链式结构

**工作方式**：
- 用下标 0 作为头结点，其 next 指向第一个数据元素的下标
- 空闲结点也用链表串起来（空闲链表），方便分配和回收
- next == -1 表示链表结束（相当于 NULL）

**例**：

| 下标 | data | next |
|------|------|------|
| 0 | - | 2 |
| 1 | (空闲) | 4 |
| 2 | A | 5 |
| 3 | (空闲) | -1 |
| 4 | (空闲) | 3 |
| 5 | B | 6 |
| 6 | C | -1 |

逻辑链表：头 → A(下标2) → B(下标5) → C(下标6) → 结束

**静态链表的特点**：
- 插入删除不需要移动元素（只改游标），保留了链表的优点
- 不能随机访问，容量固定
- 考研中了解概念即可，很少考代码实现`,
      },
    ],
    exercises: [
      {
        id: "double-linked-insert",
        title: "双链表插入操作的指针赋值顺序",
        description: "在双链表中，要在结点 p 之后插入结点 s，以下四条语句的正确执行顺序是什么？\n\n① s->next = p->next;\n② p->next->prior = s;\n③ s->prior = p;\n④ p->next = s;\n\n请给出正确顺序并解释为什么其他顺序会出错。",
        difficulty: "medium",
        hints: ["关键是不能在修改 p->next 之前丢失对原后继结点的引用", "④ 必须最后执行（或至少在 ① ② 之后）"],
        referenceSolution: "正确顺序：① ② ③ ④（或 ① ③ ② ④）\n\n关键约束：\n- ① 必须在 ④ 之前：因为 ④ 修改了 p->next，之后就找不到原后继了\n- ② 必须在 ④ 之前：因为 ② 需要通过 p->next 找到原后继结点\n- ③ 和 ① ② 的顺序无所谓\n- ④ 必须最后\n\n如果先执行 ④，p->next 就指向 s 了，① 会变成 s->next = s（自己指自己），② 会变成 s->prior = s，链表断裂。",
      },
    ],
  },
  {
    id: "list-comparison",
    title: "顺序表与链表的比较",
    brief: "从存取方式、时间性能、空间性能三个维度对比，以及如何选择",
    analogy: "选顺序表还是链表，就像选公寓还是别墅——公寓（顺序表）紧凑高效但扩建难，别墅（链表）灵活但占地大、找邻居要走路。",
    commonMistakes: [
      "不能说「链表插入删除是 O(1)」——找到位置才是 O(1)，找位置本身是 O(n)",
      "不能只看时间复杂度选数据结构——还要考虑缓存命中率，顺序表的实际速度往往比链表快",
    ],
    keyTakeaways: [
      "顺序表支持随机访问 O(1)，链表只能顺序访问 O(n)",
      "顺序表插入删除平均 O(n)（移动元素），链表找到位置后 O(1)（改指针）",
      "顺序表存储密度高（不需要指针），链表每个结点有额外指针开销",
      "表长难以预估或频繁插入删除用链表，表长稳定且常按位访问用顺序表",
    ],
    sections: [
      {
        id: "comparison-table",
        title: "全面对比",
        type: "comparison",
        content: `| 比较维度 | 顺序表 | 链表 |
|----------|--------|------|
| **存取方式** | 随机访问（按下标直接定位） | 顺序访问（必须从头遍历） |
| **按位查找** | O(1) | O(n) |
| **按值查找** | O(n)，有序时可折半 O(log n) | O(n) |
| **插入** | O(n)（平均移动一半元素） | O(1)（已知前驱时） |
| **删除** | O(n)（平均移动一半元素） | O(1)（已知前驱时） |
| **空间分配** | 预先分配，可能浪费或溢出 | 动态分配，按需申请 |
| **存储密度** | 1（不需要额外空间） | < 1（每个结点有指针开销） |
| **缓存性能** | 好（连续存储，空间局部性） | 差（结点分散在内存各处） |

---

**注意"插入 O(1)"的前提**：链表的插入操作本身（改指针）是 O(1)，但**找到插入位置**需要 O(n)。所以如果题目问"在第 i 个位置插入"，链表总体还是 O(n)。只有在"已知某个结点指针，在其后插入"的场景下才是真正的 O(1)。`,
      },
      {
        id: "how-to-choose",
        title: "如何选择存储结构",
        type: "detail",
        content: `**选顺序表的场景：**
- 表长可预估，变化不大
- 频繁按位访问（随机访问）
- 很少插入删除，或只在表尾操作
- 对存储空间要求紧凑

**选链表的场景：**
- 表长无法预估，变化很大
- 频繁插入删除（尤其在表中间）
- 不需要随机访问
- 需要灵活地拆分、合并链表

---

**考研常见问法：**

> "基于存储的考虑"——看空间：表长确定用顺序表（存储密度高），不确定用链表（动态分配）

> "基于运算的考虑"——看时间：按位访问多用顺序表，插入删除多用链表

> "基于环境的考虑"——顺序表容易实现（数组），链表需要指针操作（实现稍复杂）

---

**一句话总结**：顺序表牺牲灵活性换来快速访问（预分配连续空间 → O(1) 随机访问），链表牺牲访问速度换来灵活性（动态分配 → 插入删除只改指针）。实际选择取决于主要操作是什么。`,
      },
    ],
    exercises: [
      {
        id: "list-choice",
        title: "数据结构选择",
        description: "某系统需要维护一个学生名单，主要操作是：(1) 频繁按学号查找学生信息；(2) 偶尔在名单末尾添加新学生；(3) 极少删除学生。应该选择顺序表还是链表？说明理由。",
        difficulty: "easy",
        hints: ["分析各操作的频率和对应的时间复杂度", "顺序表按位查找 O(1)，链表按位查找 O(n)"],
        referenceSolution: "应选择顺序表。\n理由：\n1. 频繁按学号查找 → 如果学号连续可直接按位访问 O(1)，即使按值查找也可以用二分 O(logn)\n2. 末尾添加 → 顺序表尾部插入 O(1)，不需要移动元素\n3. 极少删除 → 偶尔的 O(n) 删除代价可以接受\n\n链表的优势（频繁插入删除）在此场景中用不上，而顺序表的随机访问优势正好匹配主要操作。",
      },
    ],
  },
];
