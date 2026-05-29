import { Lesson } from "@/types";

export const treeLessons: Lesson[] = [
  {
    id: "tree-basics",
    title: "树的基本概念与性质",
    brief: "树的术语、结点关系、森林的定义，以及考研必背的性质公式",
    analogy: "树像家族族谱——根结点是祖先，每个人（结点）可以有多个孩子，同一个父亲的孩子互为兄弟，从根到任何人只有一条路径。",
    commonMistakes: [
      "树的度是所有结点度的最大值，不是根结点的度",
      "结点的深度从根开始数（根是第1层），高度从叶子开始数",
      "n 个结点的树有 n-1 条边——这是最基本的性质，很多公式由此推导",
      "空树的高度是 0（有些教材定义为 -1，以考研教材为准）",
    ],
    memoryAids: [
      "边数 = 结点数 - 1（每个非根结点贡献一条到父亲的边）",
      "度为 m 的树 vs m 叉树：度为 m 的树至少有一个结点度为 m，m 叉树允许所有结点度 < m",
    ],
    keyTakeaways: [
      "树的结点数 = 总度数 + 1（即边数 = n - 1）",
      "度为 m 的树中第 i 层最多有 m^(i-1) 个结点",
      "高度为 h 的 m 叉树最多有 (m^h - 1)/(m - 1) 个结点",
      "森林是 m 棵互不相交的树的集合，去掉根结点就得到森林",
    ],
    sections: [
      {
        id: "tree-terminology",
        title: "基本术语",
        type: "concept",
        content: `**树的定义**：树是 n (n>=0) 个结点的有限集合。n=0 时为空树；n>0 时有且仅有一个根结点，其余结点可分为若干互不相交的子树。

---

**结点关系：**

| 术语 | 含义 |
|------|------|
| 根结点 | 没有前驱的结点（整棵树只有一个） |
| 叶子（终端结点） | 度为 0 的结点（没有孩子） |
| 分支结点（非终端结点） | 度 > 0 的结点 |
| 孩子 | 结点的子树的根 |
| 双亲（父结点） | 该结点的上层结点 |
| 兄弟 | 同一个双亲的孩子 |
| 祖先 | 从根到该结点路径上的所有结点 |
| 子孙 | 该结点的子树中所有结点 |
| 堂兄弟 | 双亲在同一层的结点 |

---

**度、层次、高度：**

| 术语 | 含义 |
|------|------|
| 结点的度 | 该结点拥有的子树数（孩子个数） |
| 树的度 | 树中所有结点度的最大值 |
| 结点的层次 | 根为第1层，根的孩子为第2层，依此类推 |
| 树的高度（深度） | 树中结点的最大层次 |
| 路径长度 | 路径上经过的边数 |

---

**树 vs 森林：**
- **森林**：m (m>=0) 棵互不相交的树的集合
- 一棵树去掉根结点，其各子树就构成一个森林
- 给森林加一个根结点，森林就变成一棵树
- 森林中树的棵数 = 根结点的个数`,
      },
      {
        id: "tree-properties",
        title: "树的性质（必背公式）",
        type: "detail",
        content: `**性质1：结点数与边数的关系**

\`\`\`
边数 = 结点数 - 1
即 n - 1 = 所有结点度数之和
\`\`\`

为什么？每条边连接一个结点和它的双亲，除了根结点外每个结点恰好有一条边连向双亲。

---

**性质2：度与结点数的关系**

设度为 i 的结点有 n_i 个，树的度为 m，则：

\`\`\`
n = n_0 + n_1 + n_2 + ... + n_m        （总结点数）
n - 1 = 0*n_0 + 1*n_1 + 2*n_2 + ... + m*n_m  （总边数 = 总度数）
\`\`\`

两式相减得：\`1 = n_0 - n_2 - 2*n_3 - ... - (m-1)*n_m\`

**常用推论**：对于二叉树，\`n_0 = n_2 + 1\`（叶子数 = 度为2的结点数 + 1）

---

**性质3：第 i 层最多结点数**

度为 m 的树，第 i 层最多有 **m^(i-1)** 个结点（i >= 1）

---

**性质4：高度为 h 的 m 叉树最多结点数**

\`\`\`
1 + m + m^2 + ... + m^(h-1) = (m^h - 1) / (m - 1)
\`\`\`

（等比数列求和）

---

**性质5：n 个结点的 m 叉树最小高度**

所有结点尽量"满"排列时高度最小：

\`\`\`
h_min = ⌈log_m(n(m-1) + 1)⌉
\`\`\`

对于二叉树：h_min = ⌈log_2(n+1)⌉

---

**考试常见题型**：给出某些 n_i 的值，求其他 n_i 或总结点数。解题套路：列两个方程（总结点数、总度数），联立求解。`,
      },
    ],
    exercises: [],
  },
  {
    id: "binary-tree-properties",
    title: "二叉树的定义、性质与存储",
    brief: "二叉树与普通树的区别，五条核心性质，顺序存储与链式存储",
    keyTakeaways: [
      "二叉树每个结点最多两个孩子，且区分左右（有序树）",
      "满二叉树：所有层都满；完全二叉树：最后一层从左到右连续",
      "完全二叉树的顺序存储可以用下标关系找父子：parent=⌊i/2⌋, left=2i, right=2i+1",
      "链式存储用二叉链表（data, lchild, rchild），n个结点有 n+1 个空指针",
    ],
    sections: [
      {
        id: "binary-tree-def",
        title: "二叉树的定义",
        type: "concept",
        content: `**二叉树**：每个结点最多有两棵子树，且子树有左右之分（即使只有一棵子树也要区分是左子树还是右子树）。

**二叉树 vs 度为2的树：**

| | 二叉树 | 度为2的有序树 |
|--|--------|--------------|
| 子树 | 最多2棵，区分左右 | 最多2棵，区分左右 |
| 空树 | 允许（n=0） | 不允许（至少有3个结点） |
| 只有一棵子树 | 必须说明是左还是右 | 有序树中是"第一棵" |

---

**特殊二叉树：**

**满二叉树**：每一层的结点数都达到最大值。高度为 h 的满二叉树有 2^h - 1 个结点。

**完全二叉树**：除最后一层外每层都满，最后一层的结点从左到右连续排列（中间不能有空缺）。

完全二叉树的性质：
- 叶子只出现在最后两层
- 度为1的结点最多1个（且只有左孩子）
- n 个结点的完全二叉树高度为 ⌈log_2(n+1)⌉ 或 ⌊log_2(n)⌋ + 1

**二叉排序树（BST）**：左子树所有结点 < 根 < 右子树所有结点

**平衡二叉树（AVL）**：任意结点左右子树高度差的绝对值不超过1`,
      },
      {
        id: "binary-tree-props",
        title: "二叉树的五条性质",
        type: "detail",
        content: `**性质1**：非空二叉树的叶子数 = 度为2的结点数 + 1

\`\`\`
n_0 = n_2 + 1
\`\`\`

推导：n = n_0 + n_1 + n_2，边数 = n-1 = n_1 + 2*n_2，联立得 n_0 = n_2 + 1

---

**性质2**：第 i 层最多有 2^(i-1) 个结点（i >= 1）

---

**性质3**：高度为 h 的二叉树最多有 2^h - 1 个结点（满二叉树）

---

**性质4**：完全二叉树的结点编号关系（编号从1开始）

对于编号为 i 的结点：
- 双亲编号：⌊i/2⌋（i > 1 时）
- 左孩子编号：2i（2i <= n 时存在）
- 右孩子编号：2i + 1（2i+1 <= n 时存在）
- 判断叶子：i > ⌊n/2⌋ 的结点都是叶子

---

**性质5**：n 个结点的完全二叉树，度为1的结点数：
- n 为奇数时：n_1 = 0
- n 为偶数时：n_1 = 1

（因为完全二叉树中度为1的结点最多只有1个）`,
      },
      {
        id: "binary-tree-storage",
        title: "二叉树的存储结构",
        type: "detail",
        content: `**一、顺序存储（数组）**

用一维数组按完全二叉树的编号存储。编号为 i 的结点存在 data[i] 中。

\`\`\`
#define MaxSize 100
typedef struct {
    int data[MaxSize];  // 下标0不用，从1开始
    int n;              // 结点个数
} SqBiTree;
\`\`\`

**适用场景**：完全二叉树或接近完全的二叉树。

**不适用**：稀疏二叉树（如右斜树），大量空间被浪费。最坏情况：高度为 h 的右斜树只有 h 个结点，却需要 2^h - 1 个存储单元。

---

**二、链式存储（二叉链表）**

\`\`\`
typedef struct BiTNode {
    int data;
    struct BiTNode *lchild;  // 左孩子指针
    struct BiTNode *rchild;  // 右孩子指针
} BiTNode, *BiTree;
\`\`\`

每个结点有两个指针域。n 个结点共 2n 个指针域，其中：
- 非空指针：n - 1 个（每条边对应一个非空指针）
- **空指针：n + 1 个**（这些空指针后面会被线索二叉树利用）

---

**三、三叉链表（带父指针）**

\`\`\`
typedef struct TriTNode {
    int data;
    struct TriTNode *lchild, *rchild, *parent;
} TriTNode;
\`\`\`

增加 parent 指针，方便从任意结点向上回溯到根。空间开销更大，但某些算法（如求最近公共祖先）更方便。`,
      },
    ],
    exercises: [],
  },
  {
    id: "binary-tree-traversal",
    title: "二叉树的遍历",
    brief: "前序/中序/后序/层序的递归与非递归实现，逐行代码讲解",
    keyTakeaways: [
      "前/中/后序的区别仅在于访问根结点的时机，递归结构完全相同",
      "非递归前序和中序用栈模拟递归过程，后序需要额外标记或用两个栈",
      "层序遍历用队列，每次出队一个结点并将其孩子入队",
      "时间复杂度都是 O(n)；前/中/后序空间 O(h)，层序空间 O(w)（w为最大宽度）",
    ],
    sections: [
      {
        id: "traversal-concept",
        title: "四种遍历方式",
        type: "concept",
        content: `遍历 = 按某种规则访问树中每个结点恰好一次。

对于二叉树，每个结点有三个"时机"可以被访问：第一次经过时、从左子树返回时、从右子树返回时。这对应三种遍历：

| 遍历方式 | 访问顺序 | 递归描述 |
|----------|----------|----------|
| 前序（PreOrder） | 根 → 左 → 右 | 先访问根，再前序遍历左子树，再前序遍历右子树 |
| 中序（InOrder） | 左 → 根 → 右 | 先中序遍历左子树，再访问根，再中序遍历右子树 |
| 后序（PostOrder） | 左 → 右 → 根 | 先后序遍历左子树，再后序遍历右子树，再访问根 |
| 层序（LevelOrder） | 从上到下、从左到右 | 用队列逐层处理 |

**记忆技巧**：前/中/后指的是**根**被访问的位置——根在前面、中间、后面。左右的相对顺序始终是先左后右。`,
      },
      {
        id: "traversal-recursive",
        title: "【算法】递归遍历代码",
        type: "detail",
        content: `三种递归遍历的代码结构完全相同，只是 visit(T) 的位置不同：

**前序遍历：**

\`\`\`
void PreOrder(BiTree T) {
    if (T == NULL) return;
    visit(T);            // 访问根结点
    PreOrder(T->lchild); // 递归遍历左子树
    PreOrder(T->rchild); // 递归遍历右子树
}
\`\`\`

**中序遍历：**

\`\`\`
void InOrder(BiTree T) {
    if (T == NULL) return;
    InOrder(T->lchild);  // 递归遍历左子树
    visit(T);            // 访问根结点
    InOrder(T->rchild);  // 递归遍历右子树
}
\`\`\`

**后序遍历：**

\`\`\`
void PostOrder(BiTree T) {
    if (T == NULL) return;
    PostOrder(T->lchild); // 递归遍历左子树
    PostOrder(T->rchild); // 递归遍历右子树
    visit(T);             // 访问根结点
}
\`\`\`

递归的本质：系统用**栈**保存每次函数调用的现场（局部变量、返回地址）。所以非递归版本需要我们手动用栈来模拟这个过程。`,
      },
      {
        id: "traversal-nonrecursive",
        title: "【算法】非递归遍历（用栈）",
        type: "detail",
        content: `**非递归中序遍历（最重要，考研必会）：**

思路：沿着左子树一路入栈，到底后弹栈访问，然后转向右子树。

\`\`\`
void InOrder_NonRec(BiTree T) {
    SqStack S;
    InitStack(&S);
    BiTNode *p = T;
    while (p != NULL || !StackEmpty(S)) {
        if (p != NULL) {
            Push(&S, p);       // 当前结点入栈
            p = p->lchild;    // 一路向左走到底
        } else {
            Pop(&S, &p);      // 左边走到头了，弹栈
            visit(p);         // 访问该结点
            p = p->rchild;   // 转向右子树
        }
    }
}
\`\`\`

**逐行解读：**
- 第5行：循环条件——p非空（还有路可走）或栈非空（还有结点没处理）
- 第6-8行：p非空说明还能往左走，把当前结点压栈，继续往左
- 第9-12行：p为空说明左边到头了，弹出栈顶（它的左子树已处理完），访问它，然后去它的右子树

---

**非递归前序遍历：**

只需把 visit 移到入栈之前：

\`\`\`
void PreOrder_NonRec(BiTree T) {
    SqStack S;
    InitStack(&S);
    BiTNode *p = T;
    while (p != NULL || !StackEmpty(S)) {
        if (p != NULL) {
            visit(p);         // 先访问（前序：根在最前）
            Push(&S, p);
            p = p->lchild;
        } else {
            Pop(&S, &p);
            p = p->rchild;
        }
    }
}
\`\`\`

---

**非递归后序遍历（较难）：**

后序的难点：弹栈时不能立即访问，要先确认右子树是否已处理。

方法：用一个 r 指针记录上次访问的结点。如果栈顶的右孩子就是 r，说明右子树已处理完，可以访问栈顶。

\`\`\`
void PostOrder_NonRec(BiTree T) {
    SqStack S;
    InitStack(&S);
    BiTNode *p = T, *r = NULL;
    while (p != NULL || !StackEmpty(S)) {
        if (p != NULL) {
            Push(&S, p);
            p = p->lchild;       // 一路向左
        } else {
            GetTop(S, &p);       // 看栈顶（不弹出）
            if (p->rchild != NULL && p->rchild != r) {
                p = p->rchild;   // 右子树未处理，转向右子树
            } else {
                Pop(&S, &p);
                visit(p);        // 左右都处理完了，访问根
                r = p;           // 记录刚访问的结点
                p = NULL;        // 置空，继续弹栈
            }
        }
    }
}
\`\`\``,
      },
      {
        id: "traversal-level",
        title: "【算法】层序遍历（用队列）",
        type: "detail",
        content: `层序遍历：从上到下、从左到右逐层访问。

\`\`\`
void LevelOrder(BiTree T) {
    if (T == NULL) return;
    SqQueue Q;
    InitQueue(&Q);
    EnQueue(&Q, T);              // 根结点入队
    while (!QueueEmpty(Q)) {
        BiTNode *p;
        DeQueue(&Q, &p);         // 出队一个结点
        visit(p);                // 访问它
        if (p->lchild != NULL)
            EnQueue(&Q, p->lchild);  // 左孩子入队
        if (p->rchild != NULL)
            EnQueue(&Q, p->rchild);  // 右孩子入队
    }
}
\`\`\`

**为什么用队列？** 队列是先进先出，保证同一层的结点按从左到右的顺序被处理。当一个结点出队时，它的孩子入队排在队尾，等本层全部处理完后才会轮到下一层。

**层序遍历的应用：**
- 求树的宽度（哪一层结点最多）
- 判断是否为完全二叉树
- 求某结点所在层次`,
      },
    ],
    exercises: [],
  },
  {
    id: "traversal-applications",
    title: "遍历应用与线索二叉树",
    brief: "由遍历序列构造二叉树、线索化算法、线索树的遍历",
    keyTakeaways: [
      "前序+中序 或 后序+中序 可以唯一确定一棵二叉树，前序+后序不行",
      "构造方法：在中序中找到根，划分左右子树，递归处理",
      "线索二叉树利用 n+1 个空指针存储前驱/后继信息",
      "中序线索化后可以不用栈实现中序遍历，时间 O(n) 空间 O(1)",
    ],
    sections: [
      {
        id: "construct-from-traversal",
        title: "【算法】由遍历序列构造二叉树",
        type: "detail",
        content: `**核心原理：**
- 前序序列的第一个元素是根（后序序列的最后一个元素是根）
- 在中序序列中找到根，根左边是左子树的中序，根右边是右子树的中序
- 由左子树的长度可以在前序/后序中划分出左右子树的序列
- 递归处理左右子树

---

**例**：前序 ABDECFG，中序 DBEAFCG

1. 前序第一个 A 是根
2. 在中序中找到 A：左边 DBE 是左子树，右边 FCG 是右子树
3. 左子树有3个结点，所以前序中 BDE 是左子树的前序，CFG 是右子树的前序
4. 对左子树递归：前序 BDE，中序 DBE → B 是根，D 是左孩子，E 是右孩子
5. 对右子树递归：前序 CFG，中序 FCG → C 是根，F 是左孩子，G 是右孩子

---

**为什么前序+后序不能唯一确定？**

当某个结点只有一棵子树时，无法确定它是左子树还是右子树。

例：前序 AB，后序 BA → A 是根，B 是 A 的孩子，但不知道 B 是左孩子还是右孩子。

**结论**：必须有中序序列参与才能唯一确定（因为中序能区分左右）。

---

**层序+中序也可以唯一确定**：层序第一个是根，在中序中找根划分左右，然后在层序中按出现顺序分出左右子树的层序序列。`,
      },
      {
        id: "thread-concept",
        title: "线索二叉树的概念",
        type: "concept",
        content: `**问题**：n 个结点的二叉链表有 n+1 个空指针，能否利用这些空指针存储有用信息？

**线索**：将空指针改为指向该结点在某种遍历序列中的前驱或后继。

\`\`\`
typedef struct ThreadNode {
    int data;
    struct ThreadNode *lchild, *rchild;
    int ltag, rtag;  // 0: 指针指向孩子  1: 指针是线索
} ThreadNode, *ThreadTree;
\`\`\`

**tag 的含义：**
- ltag == 0：lchild 指向左孩子
- ltag == 1：lchild 指向前驱（线索）
- rtag == 0：rchild 指向右孩子
- rtag == 1：rchild 指向后继（线索）

---

**线索的指向（以中序线索为例）：**

中序遍历序列：D B E A F C G

对于结点 E：
- 中序前驱是 B → E 的 lchild 指向 B（ltag=1）
- 中序后继是 A → E 的 rchild 指向 A（rtag=1）

对于结点 A：
- A 有左孩子 B → lchild 指向 B（ltag=0，不是线索）
- A 有右孩子 C → rchild 指向 C（rtag=0，不是线索）

**规律**：只有空指针才会变成线索，有孩子的指针保持不变。`,
      },
      {
        id: "thread-construction",
        title: "【算法】中序线索化",
        type: "detail",
        content: `中序线索化 = 在中序遍历的过程中，顺便把空指针改成线索。

需要一个全局指针 pre 记录当前结点的前驱（即中序遍历中刚刚访问过的结点）。

\`\`\`
ThreadNode *pre = NULL;  // 全局变量，指向当前结点的前驱

void InThread(ThreadTree T) {
    if (T == NULL) return;
    InThread(T->lchild);          // 递归线索化左子树

    // 处理当前结点的前驱线索
    if (T->lchild == NULL) {
        T->lchild = pre;          // 左指针为空，指向前驱
        T->ltag = 1;
    }
    // 处理前驱结点的后继线索
    if (pre != NULL && pre->rchild == NULL) {
        pre->rchild = T;          // 前驱的右指针为空，指向当前（后继）
        pre->rtag = 1;
    }
    pre = T;                      // 更新 pre 为当前结点

    InThread(T->rchild);          // 递归线索化右子树
}

void CreateInThread(ThreadTree T) {
    pre = NULL;
    if (T != NULL) {
        InThread(T);
        // 处理最后一个结点的后继
        if (pre->rchild == NULL)
            pre->rtag = 1;        // 最后一个结点的 rchild 为空，标记为线索
    }
}
\`\`\`

**逐行要点：**
- 第6行：先递归处理左子树（中序：左→根→右）
- 第8-11行：当前结点没有左孩子 → 左指针指向前驱
- 第13-16行：前驱结点没有右孩子 → 前驱的右指针指向当前结点（后继）
- 第17行：pre 后移，为下一个结点做准备
- 第19行：再递归处理右子树

**本质**：线索化就是在中序遍历的 visit 位置，做"建立线索"的操作。`,
      },
      {
        id: "thread-traversal",
        title: "【算法】线索树的遍历",
        type: "detail",
        content: `中序线索二叉树可以不用栈、不用递归，直接按线索找后继遍历：

**找中序后继的规则：**
- 如果 rtag == 1：后继就是 rchild（线索直接指向）
- 如果 rtag == 0：后继是右子树中最左下的结点

\`\`\`
// 找以 p 为根的子树中最左下结点
ThreadNode* FirstNode(ThreadNode *p) {
    while (p->ltag == 0)
        p = p->lchild;
    return p;
}

// 找 p 的中序后继
ThreadNode* NextNode(ThreadNode *p) {
    if (p->rtag == 0)
        return FirstNode(p->rchild);  // 右子树最左下
    else
        return p->rchild;             // 线索直接指向后继
}

// 中序遍历（利用线索，无需栈）
void InOrder_Thread(ThreadTree T) {
    for (ThreadNode *p = FirstNode(T); p != NULL; p = NextNode(p))
        visit(p);
}
\`\`\`

**优势**：空间复杂度 O(1)（不需要栈），时间复杂度 O(n)。

---

**找中序前驱的规则：**
- 如果 ltag == 1：前驱就是 lchild
- 如果 ltag == 0：前驱是左子树中最右下的结点

\`\`\`
ThreadNode* LastNode(ThreadNode *p) {
    while (p->rtag == 0)
        p = p->rchild;
    return p;
}

ThreadNode* PreNode(ThreadNode *p) {
    if (p->ltag == 0)
        return LastNode(p->lchild);
    else
        return p->lchild;
}
\`\`\`

这样就可以实现逆序遍历（从最后一个结点往前走）。`,
      },
    ],
    exercises: [],
  },
  {
    id: "tree-storage-conversion",
    title: "树的存储与树/森林/二叉树转换",
    brief: "三种存储表示法，树与二叉树的互相转换规则，森林的遍历",
    keyTakeaways: [
      "双亲表示法找父结点 O(1)，找孩子需遍历；孩子表示法找孩子方便，找双亲不便",
      "孩子兄弟表示法（左孩子右兄弟）本质上就是把树转成了二叉树",
      "树转二叉树：每个结点的第一个孩子作为左孩子，右兄弟作为右孩子",
      "树的先根遍历 = 对应二叉树的前序遍历，树的后根遍历 = 对应二叉树的中序遍历",
    ],
    sections: [
      {
        id: "parent-representation",
        title: "双亲表示法",
        type: "detail",
        content: `用数组存储，每个结点记录其双亲的下标：

\`\`\`
#define MaxSize 100
typedef struct {
    int data;
    int parent;  // 双亲在数组中的下标，根结点为-1
} PTNode;

typedef struct {
    PTNode nodes[MaxSize];
    int n;  // 结点总数
} PTree;
\`\`\`

**例**：

| 下标 | data | parent |
|------|------|--------|
| 0 | A | -1 |
| 1 | B | 0 |
| 2 | C | 0 |
| 3 | D | 1 |
| 4 | E | 1 |
| 5 | F | 2 |

**优点**：找双亲 O(1)，直接查 parent 字段
**缺点**：找孩子需要遍历整个数组 O(n)

适合以"找双亲"为主要操作的场景（如并查集）。`,
      },
      {
        id: "child-representation",
        title: "孩子表示法",
        type: "detail",
        content: `每个结点有一个孩子链表，记录它所有孩子的下标：

\`\`\`
// 孩子链表中的结点
typedef struct ChildNode {
    int child;              // 孩子在数组中的下标
    struct ChildNode *next; // 下一个孩子
} ChildNode;

// 数组中的结点
typedef struct {
    int data;
    ChildNode *firstChild;  // 孩子链表头指针
} CTBox;

typedef struct {
    CTBox nodes[MaxSize];
    int n, root;  // 结点数，根的位置
} CTree;
\`\`\`

**优点**：找孩子方便，遍历孩子链表即可
**缺点**：找双亲需要遍历所有结点的孩子链表

可以结合双亲表示法：在 CTBox 中增加 parent 字段，兼顾两个方向。`,
      },
      {
        id: "child-sibling-representation",
        title: "孩子兄弟表示法（二叉树表示法）",
        type: "detail",
        content: `每个结点有两个指针：指向第一个孩子、指向右兄弟。

\`\`\`
typedef struct CSNode {
    int data;
    struct CSNode *firstChild;   // 第一个孩子
    struct CSNode *nextSibling;  // 右兄弟
} CSNode, *CSTree;
\`\`\`

**这个结构和二叉链表完全一样！** 只是指针的含义不同：
- 二叉树：lchild = 左孩子，rchild = 右孩子
- 孩子兄弟：firstChild = 第一个孩子，nextSibling = 右兄弟

这就是树与二叉树转换的物理基础。

**优点**：方便实现树的各种操作，且可以利用二叉树的算法
**缺点**：找双亲不方便（可增加 parent 指针解决）`,
      },
      {
        id: "tree-to-binary",
        title: "树、森林与二叉树的转换",
        type: "detail",
        content: `**树 → 二叉树（左孩子右兄弟）：**

规则：
1. 每个结点的**第一个孩子**作为二叉树的**左孩子**
2. 每个结点的**右兄弟**作为二叉树的**右孩子**

口诀：**左孩子右兄弟**

结果：转换后的二叉树**根结点没有右子树**（因为根没有兄弟）。

---

**森林 → 二叉树：**

1. 把森林中每棵树各自转为二叉树
2. 第一棵树的根作为二叉树的根
3. 后面每棵树的根作为前一棵树根的**右孩子**

即：森林中各树的根互为"兄弟"，用右指针串起来。

---

**二叉树 → 树：**

1. 若结点 p 是其双亲的左孩子，则 p 的右孩子、右孩子的右孩子...都是 p 双亲的孩子
2. 把这些右链上的结点都连到双亲上，删除原来的右指针

---

**二叉树 → 森林：**

1. 根结点及其左子树构成第一棵树对应的二叉树
2. 根的右子树是剩余森林对应的二叉树
3. 递归处理右子树

判断方法：如果二叉树的根有右子树，则对应森林；没有右子树，则对应一棵树。`,
      },
      {
        id: "tree-forest-traversal",
        title: "树和森林的遍历",
        type: "detail",
        content: `**树的遍历：**

| 树的遍历 | 方式 | 对应二叉树的遍历 |
|----------|------|------------------|
| 先根遍历 | 先访问根，再依次先根遍历各子树 | **前序遍历** |
| 后根遍历 | 先依次后根遍历各子树，再访问根 | **中序遍历** |
| 层次遍历 | 从上到下从左到右 | — |

**森林的遍历：**

| 森林的遍历 | 方式 | 对应二叉树的遍历 |
|------------|------|------------------|
| 先序遍历 | 访问第一棵树的根 → 先序遍历第一棵树的子树森林 → 先序遍历剩余树的森林 | **前序遍历** |
| 中序遍历 | 中序遍历第一棵树的子树森林 → 访问第一棵树的根 → 中序遍历剩余树的森林 | **中序遍历** |

---

**记忆方法**：

转换后的二叉树就是原来树/森林的另一种表示。在二叉树上做前序遍历，等价于在原树上做先根遍历；在二叉树上做中序遍历，等价于在原树上做后根遍历。

这个对应关系考研选择题经常考：
> "树的后根遍历序列与其对应二叉树的____遍历序列相同" → 中序`,
      },
    ],
    exercises: [],
  },
  {
    id: "huffman-tree",
    title: "哈夫曼树与哈夫曼编码",
    brief: "WPL最小的树如何构造，前缀编码的原理与应用",
    keyTakeaways: [
      "哈夫曼树是 WPL（带权路径长度）最小的二叉树",
      "构造方法：每次选两个权值最小的结点合并，重复直到只剩一棵树",
      "哈夫曼编码是前缀编码：任何字符的编码都不是另一个字符编码的前缀",
      "哈夫曼树没有度为1的结点，n个叶子结点的哈夫曼树共有 2n-1 个结点",
    ],
    sections: [
      {
        id: "huffman-concept",
        title: "哈夫曼树的概念",
        type: "concept",
        content: `**带权路径长度（WPL）**：所有叶子结点的 (权值 × 路径长度) 之和。

\`\`\`
WPL = Σ w_i × l_i
\`\`\`

其中 w_i 是第 i 个叶子的权值，l_i 是根到该叶子的路径长度（边数）。

**哈夫曼树（最优二叉树）**：给定 n 个权值，构造一棵有 n 个叶子结点的二叉树，使得 WPL 最小。

**直觉**：权值大的叶子应该离根近（路径短），权值小的叶子可以离根远。这样加权总和最小。

---

**哈夫曼树的性质：**
- 不存在度为1的结点（每个非叶子结点都有两个孩子）
- n 个叶子结点的哈夫曼树共有 **2n - 1** 个结点
- 哈夫曼树不唯一（左右子树可以交换），但 WPL 唯一确定
- 权值越大的结点离根越近`,
      },
      {
        id: "huffman-construction",
        title: "【算法】哈夫曼树的构造",
        type: "walkthrough",
        content: `**构造算法（贪心策略）：**

1. 将 n 个权值看作 n 棵只有根结点的树，构成森林
2. 从森林中选出两棵根结点权值**最小**的树，合并为一棵新树（新根的权值 = 两棵子树根的权值之和）
3. 从森林中删除这两棵树，加入新树
4. 重复步骤 2-3，直到森林中只剩一棵树

**例**：权值集合 {2, 3, 5, 7, 11}`,
        steps: [
          {
            description: "初始森林：5棵独立的树，权值分别为 2, 3, 5, 7, 11",
            pseudocode: "森林: {2} {3} {5} {7} {11}",
            state: { forest: [2, 3, 5, 7, 11], action: "初始状态" },
          },
          {
            description: "选最小的两个：2 和 3，合并为新树，根权值 = 2+3 = 5",
            pseudocode: "合并 2+3 → 5\n森林: {5(新)} {5} {7} {11}",
            state: { forest: ["5*", 5, 7, 11], merged: "2+3=5", action: "合并最小两个" },
          },
          {
            description: "选最小的两个：5(新) 和 5，合并为新树，根权值 = 5+5 = 10",
            pseudocode: "合并 5+5 → 10\n森林: {10(新)} {7} {11}",
            state: { forest: ["10*", 7, 11], merged: "5+5=10", action: "合并最小两个" },
          },
          {
            description: "选最小的两个：7 和 10，合并为新树，根权值 = 7+10 = 17",
            pseudocode: "合并 7+10 → 17\n森林: {17(新)} {11}",
            state: { forest: ["17*", 11], merged: "7+10=17", action: "合并最小两个" },
          },
          {
            description: "选最小的两个：11 和 17，合并为新树，根权值 = 11+17 = 28",
            pseudocode: "合并 11+17 → 28\n森林: {28}\n构造完成！",
            state: { forest: [28], merged: "11+17=28", action: "构造完成" },
          },
          {
            description: "计算 WPL：2×4 + 3×4 + 5×3 + 7×2 + 11×1 = 8+12+15+14+11 = 60",
            pseudocode: "WPL = 2×4 + 3×4 + 5×3 + 7×2 + 11×1 = 8+12+15+14+11 = 60",
            state: { wpl: 60, action: "WPL 计算" },
          },
        ],
      },
      {
        id: "huffman-coding",
        title: "哈夫曼编码",
        type: "detail",
        content: `**前缀编码**：任何一个字符的编码都不是另一个字符编码的前缀。这保证了解码的唯一性（不需要分隔符）。

**哈夫曼编码的生成方法**：
1. 统计各字符出现频率（作为权值）
2. 构造哈夫曼树
3. 从根到每个叶子的路径就是该字符的编码：左分支为 0，右分支为 1

---

**例**：字符频率 A:5, B:2, C:3, D:7, E:11

构造哈夫曼树后，编码可能为：
- E(11): 0（离根最近，编码最短）
- D(7): 10
- A(5): 110
- C(3): 1110
- B(2): 1111

**验证前缀性**：0 不是 10 的前缀，10 不是 110 的前缀...任何编码都不是其他编码的前缀。

---

**为什么哈夫曼编码是前缀编码？**

因为所有字符都在叶子结点上。从根到任何叶子的路径不可能经过另一个叶子（叶子没有孩子）。所以一个字符的编码路径不可能是另一个字符编码路径的前缀。`,
      },
      {
        id: "huffman-vs-fixed",
        title: "哈夫曼编码 vs 定长编码",
        type: "comparison",
        content: `**定长编码**：每个字符用相同长度的二进制串表示。n 个字符需要 ⌈log_2(n)⌉ 位。

**例**：5个字符，定长编码需要 3 位（因为 ⌈log_2(5)⌉ = 3）

| 字符 | 频率 | 定长编码(3位) | 哈夫曼编码 |
|------|------|---------------|------------|
| A | 5 | 000 | 110 |
| B | 2 | 001 | 1111 |
| C | 3 | 010 | 1110 |
| D | 7 | 011 | 10 |
| E | 11 | 100 | 0 |

**总编码长度对比**（假设共28个字符）：
- 定长：28 × 3 = 84 位
- 哈夫曼：5×3 + 2×4 + 3×4 + 7×2 + 11×1 = 15+8+12+14+11 = 60 位

哈夫曼编码节省了 (84-60)/84 ≈ 28.6% 的空间。

---

**关键区别：**

| | 定长编码 | 哈夫曼编码 |
|--|----------|------------|
| 编码长度 | 所有字符相同 | 频率高的短，频率低的长 |
| 总长度 | 较长 | 最短（WPL最小） |
| 解码 | 简单（按固定长度切分） | 需要逐位匹配（但前缀性保证唯一） |
| 适用场景 | 字符频率均匀 | 字符频率差异大时优势明显 |

**考研常见题型**：给定字符频率，求哈夫曼编码的总长度（即 WPL），与定长编码对比。`,
      },
    ],
    exercises: [],
  },
  {
    id: "union-find",
    title: "并查集",
    brief: "用树的双亲表示法实现集合的合并与查找，路径压缩与按秩合并优化",
    keyTakeaways: [
      "并查集用双亲表示法存储，根结点的 parent 为负数（表示树的结点数或秩）",
      "Find 操作：沿 parent 链向上找到根，路径压缩后接近 O(1)",
      "Union 操作：将一棵树的根指向另一棵树的根",
      "按秩合并 + 路径压缩后，m 次操作的时间复杂度为 O(m·α(n))，α 是反阿克曼函数",
    ],
    sections: [
      {
        id: "union-find-concept",
        title: "并查集的概念与存储",
        type: "concept",
        content: `**并查集（Disjoint Set Union）** 用于管理一组不相交的集合，支持两种操作：
- **Find(x)**：找到 x 所属集合的代表元素（根）
- **Union(x, y)**：将 x 和 y 所在的两个集合合并

**存储方式**：用数组实现双亲表示法。

\`\`\`
#define MaxSize 100
int parent[MaxSize];  // parent[i] 存储 i 的双亲下标
\`\`\`

约定：
- parent[i] >= 0：表示 i 的双亲是 parent[i]
- parent[i] < 0：表示 i 是根结点，|parent[i]| 是该集合的结点数

**初始化**：每个元素自成一个集合（每个都是根）

\`\`\`
void Init(int parent[], int n) {
    for (int i = 0; i < n; i++)
        parent[i] = -1;  // 每个元素都是根，集合大小为1
}
\`\`\``,
      },
      {
        id: "union-find-basic",
        title: "【算法】基本的 Find 和 Union",
        type: "detail",
        content: `**Find — 找根结点：**

\`\`\`
int Find(int parent[], int x) {
    while (parent[x] >= 0)  // 不是根就继续往上
        x = parent[x];
    return x;               // 返回根结点下标
}
\`\`\`

时间复杂度：O(h)，h 是树的高度。最坏情况树退化为链，O(n)。

---

**Union — 合并两个集合：**

\`\`\`
void Union(int parent[], int x, int y) {
    int rootX = Find(parent, x);
    int rootY = Find(parent, y);
    if (rootX == rootY) return;  // 已经在同一集合
    parent[rootX] = rootY;       // 把 x 的根挂到 y 的根下面
}
\`\`\`

问题：如果总是把大树挂到小树下面，树会越来越高，Find 越来越慢。`,
      },
      {
        id: "union-find-optimize",
        title: "【算法】优化：按秩合并 + 路径压缩",
        type: "detail",
        content: `**优化一：按秩合并（Union by Rank/Size）**

合并时，把**小树**挂到**大树**下面，避免树变高。

\`\`\`
void Union_Size(int parent[], int x, int y) {
    int rootX = Find(parent, x);
    int rootY = Find(parent, y);
    if (rootX == rootY) return;

    // parent[root] 存的是负数，绝对值是集合大小
    if (parent[rootX] > parent[rootY]) {
        // rootX 的集合更小（负数更大 = 绝对值更小）
        parent[rootY] += parent[rootX];  // 更新大树的结点数
        parent[rootX] = rootY;           // 小树挂到大树
    } else {
        parent[rootX] += parent[rootY];
        parent[rootY] = rootX;
    }
}
\`\`\`

效果：树的高度不超过 ⌊log_2(n)⌋ + 1，Find 变为 O(log n)。

---

**优化二：路径压缩（Path Compression）**

Find 时，把路径上所有结点直接挂到根下面，下次查找就是 O(1)。

\`\`\`
int Find_Compress(int parent[], int x) {
    int root = x;
    while (parent[root] >= 0)
        root = parent[root];     // 先找到根

    // 路径压缩：把 x 到根路径上所有结点的 parent 都改为 root
    while (x != root) {
        int temp = parent[x];
        parent[x] = root;       // 直接指向根
        x = temp;               // 继续处理上一个结点
    }
    return root;
}
\`\`\`

---

**两种优化结合使用**：m 次操作的总时间复杂度为 O(m·α(n))，其中 α 是反阿克曼函数，增长极其缓慢（对于实际可能的 n，α(n) ≤ 4）。可以认为**每次操作接近 O(1)**。

---

**考研重点：**

| 考点 | 要记住的 |
|------|----------|
| 存储结构 | 双亲表示法，根结点存负数 |
| Find | 沿 parent 链向上找根 |
| Union | 把一个根指向另一个根 |
| 按秩合并 | 小树挂大树，控制高度 |
| 路径压缩 | Find 时顺便把路径上结点直接连到根 |
| 时间复杂度 | 两种优化结合后接近 O(1) |
| 应用 | 判断连通性、Kruskal 算法中判断是否成环 |`,
      },
      {
        id: "union-find-walkthrough",
        title: "并查集操作演示",
        type: "walkthrough",
        content: `演示对集合 {0,1,2,3,4} 执行一系列 Union 和 Find 操作（使用按秩合并）：`,
        steps: [
          {
            description: "初始状态：每个元素自成一个集合，parent 都是 -1",
            pseudocode: "parent: [-1, -1, -1, -1, -1]\n集合: {0} {1} {2} {3} {4}",
            state: { parent: [-1, -1, -1, -1, -1] },
          },
          {
            description: "Union(0, 1)：两个集合大小相同，把1挂到0下面",
            pseudocode: "parent[1] = 0, parent[0] = -2\nparent: [-2, 0, -1, -1, -1]\n集合: {0,1} {2} {3} {4}",
            state: { parent: [-2, 0, -1, -1, -1] },
          },
          {
            description: "Union(2, 3)：两个集合大小相同，把3挂到2下面",
            pseudocode: "parent[3] = 2, parent[2] = -2\nparent: [-2, 0, -2, 2, -1]\n集合: {0,1} {2,3} {4}",
            state: { parent: [-2, 0, -2, 2, -1] },
          },
          {
            description: "Union(0, 2)：两个集合大小都是2，把2的根挂到0的根下面",
            pseudocode: "parent[2] = 0, parent[0] = -4\nparent: [-4, 0, 0, 2, -1]\n集合: {0,1,2,3} {4}",
            state: { parent: [-4, 0, 0, 2, -1] },
          },
          {
            description: "Find(3)：3→2→0，找到根是0。路径压缩：把3直接连到0",
            pseudocode: "查找路径: 3 → 2 → 0(根)\n压缩后 parent[3] = 0\nparent: [-4, 0, 0, 0, -1]",
            state: { parent: [-4, 0, 0, 0, -1] },
          },
          {
            description: "Union(3, 4)：Find(3)=0, Find(4)=4。{0,1,2,3}更大，把4挂到0下面",
            pseudocode: "parent[4] = 0, parent[0] = -5\nparent: [-5, 0, 0, 0, 0]\n集合: {0,1,2,3,4}",
            state: { parent: [-5, 0, 0, 0, 0] },
          },
        ],
      },
    ],
    exercises: [],
  },
];
