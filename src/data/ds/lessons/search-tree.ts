import { Lesson } from "@/types";

export const searchTreeLessons: Lesson[] = [
  {
    id: "bst-search",
    title: "二叉排序树（BST）",
    brief: "利用二叉树结构实现动态查找，平均查找效率 O(logn)，支持高效插入和删除",
    keyTakeaways: [
      "BST性质：左子树所有结点 < 根 < 右子树所有结点",
      "中序遍历得到递增有序序列",
      "查找/插入/删除平均 O(logn)，最坏 O(n)",
      "ASL 与树的形态密切相关",
    ],
    relatedLessons: ["avl-tree"],
    sections: [
      {
        id: "bst-motivation",
        title: "为什么需要BST",
        type: "motivation",
        content: `## 静态查找 vs 动态查找

**顺序查找**：O(n)，无需有序，支持插入删除，但太慢。

**折半查找**：O(logn)，快，但要求顺序存储且有序——插入/删除需要移动大量元素，维护成本高。

| 方法 | 查找 | 插入/删除 | 存储要求 |
|------|------|-----------|----------|
| 顺序查找 | O(n) | O(1) | 无 |
| 折半查找 | O(logn) | O(n) | 顺序+有序 |
| **BST** | **O(logn)** | **O(logn)** | **链式** |

**核心思想**：把"有序"编码进树的结构，而不是靠物理位置。每次比较都能排除一半的候选，同时链式存储让插入删除无需移动元素。`,
      },
      {
        id: "bst-concept",
        title: "BST的定义与性质",
        type: "concept",
        content: `## 二叉排序树的定义

二叉排序树（Binary Search Tree）或者是空树，或者满足以下性质：

1. 若左子树非空，则左子树上所有结点的关键字 **< 根结点**的关键字
2. 若右子树非空，则右子树上所有结点的关键字 **> 根结点**的关键字
3. 左、右子树本身也是二叉排序树

---

## 核心性质：中序遍历得有序序列

对 BST 进行**中序遍历**（左-根-右），得到的序列是**递增有序**的。

示例：插入序列 [5, 3, 7, 2, 4, 6, 8] 构造的 BST：

\`\`\`
        5
       / \\
      3   7
     / \\ / \\
    2  4 6  8
\`\`\`

中序遍历：2, 3, 4, 5, 6, 7, 8（递增）

---

## 结构体定义

\`\`\`c
typedef struct BSTNode {
    int key;
    struct BSTNode *lchild, *rchild;
} BSTNode, *BSTree;
\`\`\``,
      },
      {
        id: "bst-search-insert",
        title: "【算法】查找与插入",
        type: "detail",
        content: `## 查找算法

\`\`\`c
/* 在以 T 为根的 BST 中查找关键字 key */
BSTree SearchBST(BSTree T, int key) {
    if (!T || key == T->key)
        return T;           /* 空树或找到，返回结点指针 */
    if (key < T->key)
        return SearchBST(T->lchild, key);  /* 小于根，去左子树 */
    else
        return SearchBST(T->rchild, key);  /* 大于根，去右子树 */
}
\`\`\`

**逐行说明：**
- \`!T\`：树为空，查找失败，返回 NULL
- \`key == T->key\`：找到目标，返回该结点
- 每次比较排除一棵子树，递归深入

---

## 插入算法

**关键结论**：新结点**一定插在叶子位置**，不改变已有结点的相对位置。

\`\`\`c
/* 向 BST 中插入关键字 key，*T 为二级指针 */
bool InsertBST(BSTree *T, int key) {
    if (!*T) {
        /* 找到插入位置（空指针处），创建新结点 */
        BSTree s = (BSTree)malloc(sizeof(BSTNode));
        s->key = key;
        s->lchild = s->rchild = NULL;
        *T = s;             /* 修改父结点的指针域 */
        return true;
    }
    if (key == (*T)->key) return false;   /* 已存在，不插入 */
    if (key < (*T)->key)
        return InsertBST(&(*T)->lchild, key);
    else
        return InsertBST(&(*T)->rchild, key);
}
\`\`\`

**为什么用二级指针 \`BSTree *T\`？**
因为需要修改父结点的 \`lchild\` 或 \`rchild\` 指针本身（让它指向新结点），而不只是读取它的值。`,
      },
      {
        id: "bst-delete",
        title: "【算法】删除",
        type: "detail",
        content: `## 删除的三种情况

删除结点 p 时，分三种情况讨论：

| 情况 | 条件 | 处理方法 |
|------|------|----------|
| 情况1 | p 是叶子结点 | 直接删除，父结点对应指针置 NULL |
| 情况2 | p 只有左子树或只有右子树 | 用该子树替代 p 的位置 |
| 情况3 | p 有左右两棵子树 | 用 p 的**中序后继**（右子树最左结点）替代 p，再删除该后继 |

---

## 完整删除代码

\`\`\`c
bool DeleteBST(BSTree *T, int key) {
    if (!*T) return false;          /* 未找到 */

    if (key < (*T)->key)
        return DeleteBST(&(*T)->lchild, key);
    else if (key > (*T)->key)
        return DeleteBST(&(*T)->rchild, key);
    else {
        /* 找到目标结点 *T */
        BSTree q = *T;

        if (!(*T)->lchild) {        /* 情况1/2：无左子树 */
            *T = (*T)->rchild;
            free(q);
        } else if (!(*T)->rchild) { /* 情况1/2：无右子树 */
            *T = (*T)->lchild;
            free(q);
        } else {                    /* 情况3：有两棵子树 */
            /* 找中序后继：右子树中最左的结点 */
            BSTree s = (*T)->rchild;
            while (s->lchild) s = s->lchild;
            (*T)->key = s->key;     /* 用后继值覆盖当前结点 */
            /* 在右子树中删除该后继结点 */
            DeleteBST(&(*T)->rchild, s->key);
        }
        return true;
    }
}
\`\`\`

**情况3的本质**：不真正删除 p，而是把 p 的值替换为中序后继的值，再去删除那个后继（后继最多只有右子树，退化为情况1/2）。`,
      },
      {
        id: "bst-asl",
        title: "ASL分析",
        type: "detail",
        content: `## 平均查找长度（ASL）

BST 的查找效率取决于**树的形态**，而形态由插入顺序决定。

---

## 最优形态：平衡二叉树

插入序列 [4, 2, 6, 1, 3, 5, 7]，构造出完全平衡的 BST：

\`\`\`
        4
       / \\
      2   6
     / \\ / \\
    1  3 5  7
\`\`\`

- 高度 h = O(logn)
- ASL = O(logn)

---

## 最坏形态：退化为链表

插入**有序序列** [1, 2, 3, 4, 5]，BST 退化为单链表：

\`\`\`
1
 \\
  2
   \\
    3
     \\
      4
       \\
        5
\`\`\`

- 高度 h = n
- ASL = (1+2+3+4+5)/5 = 3 = O(n)
- 与顺序查找无异，完全失去 BST 的优势

---

## 结论

| 形态 | 高度 | ASL |
|------|------|-----|
| 最优（平衡） | O(logn) | O(logn) |
| 平均 | O(logn) | O(logn) |
| 最坏（有序插入） | O(n) | O(n) |

**这就是为什么需要平衡二叉树（AVL树）**：通过旋转操作，强制保证树的高度始终为 O(logn)。`,
      },
    ],
  },
  {
    id: "avl-tree",
    title: "平衡二叉树（AVL树）",
    brief: "在BST基础上通过旋转维持平衡，保证查找/插入/删除始终O(logn)",
    keyTakeaways: [
      "平衡因子 = 左子树高度 - 右子树高度，取值只能是 -1、0、1",
      "四种失衡类型：LL、RR、LR、RL",
      "插入后从插入点向上找第一个失衡结点，执行对应旋转",
      "高度为 h 的 AVL 树最少结点数：N(h) = N(h-1) + N(h-2) + 1",
    ],
    relatedLessons: ["bst-search"],
    sections: [
      {
        id: "avl-motivation",
        title: "为什么需要AVL树",
        type: "motivation",
        content: `## BST的致命缺陷

BST 的查找效率依赖树的高度，而高度由插入顺序决定。

**极端情况**：按有序序列插入，BST 退化为链表，高度 O(n)，查找退化为 O(n)。

**AVL树的解决方案**：每次插入/删除后，通过**旋转**操作恢复平衡，强制保证任意结点的左右子树高度差不超过 1。

| 特性 | BST | AVL树 |
|------|-----|-------|
| 最坏查找 | O(n) | O(logn) |
| 最坏插入 | O(n) | O(logn) |
| 实现复杂度 | 简单 | 较复杂（需旋转） |
| 适用场景 | 随机数据 | 需要稳定性能 |`,
      },
      {
        id: "avl-concept",
        title: "平衡因子与失衡类型",
        type: "concept",
        content: `## 平衡因子（Balance Factor）

**定义**：结点的平衡因子 = 左子树高度 - 右子树高度

AVL树要求每个结点的平衡因子 **∈ {-1, 0, 1}**。

- BF = 1：左子树比右子树高1层
- BF = 0：左右子树等高
- BF = -1：右子树比左子树高1层

---

## 四种失衡类型

| 类型 | 含义 | 修复方法 |
|------|------|----------|
| **LL** | 在失衡结点的**左孩子的左子树**插入 | 对失衡结点做一次**右旋** |
| **RR** | 在失衡结点的**右孩子的右子树**插入 | 对失衡结点做一次**左旋** |
| **LR** | 在失衡结点的**左孩子的右子树**插入 | 先对左孩子**左旋**，再对失衡结点**右旋** |
| **RL** | 在失衡结点的**右孩子的左子树**插入 | 先对右孩子**右旋**，再对失衡结点**左旋** |

**记忆口诀**：LL/RR 单旋，LR/RL 双旋；旋转方向与失衡方向相反。`,
      },
      {
        id: "avl-rotations",
        title: "【算法】四种旋转详解",
        type: "detail",
        content: `## LL旋转（右旋）

失衡结点 A 的左孩子 B 的左子树过高（BF(A) = 2）。

\`\`\`
    A (BF=2)          B (BF=0)
   / \\               / \\
  B   C    =>       D   A (BF=0)
 / \\                   / \\
D   E                 E   C
\`\`\`

**操作**：B 成为新根；A 成为 B 的右孩子；B 原右子树 E 成为 A 的左子树。

---

## RR旋转（左旋）

LL 的镜像。失衡结点 A 的右孩子 C 的右子树过高（BF(A) = -2）。

\`\`\`
  A (BF=-2)             C (BF=0)
 / \\                   / \\
B   C         =>    A (BF=0)  F
   / \\              / \\
  E   F            B   E
\`\`\`

**操作**：C 成为新根；A 成为 C 的左孩子；C 原左子树 E 成为 A 的右子树。

---

## LR旋转（先左旋后右旋）

失衡结点 A 的左孩子 B 的右子树过高（BF(A) = 2）。

\`\`\`
    A (BF=2)        A (BF=2)        E
   / \\             / \\            / \\
  B   C  左旋B    E   C  右旋A   B   A
 / \\      =>    / \\      =>    / \\ / \\
D   E           B   G          D  F G  C
   / \\         / \\
  F   G        D   F
\`\`\`

**操作**：先对 B 做左旋（RR旋转），再对 A 做右旋（LL旋转）。

---

## RL旋转（先右旋后左旋）

LR 的镜像。失衡结点 A 的右孩子 C 的左子树过高（BF(A) = -2）。

**操作**：先对 C 做右旋（LL旋转），再对 A 做左旋（RR旋转）。`,
      },
      {
        id: "avl-walkthrough",
        title: "插入序列演示",
        type: "walkthrough",
        content: `依次插入 [5, 3, 7, 2, 4, 6, 8, 1]，观察插入 1 时触发的 LL 旋转。`,
        steps: [
          {
            description: "插入 5, 3, 7, 2, 4, 6, 8 — 树保持平衡，无需旋转",
            state: {
              tree: {
                val: 5, bf: 0,
                left: { val: 3, bf: 0, left: { val: 2, bf: 0 }, right: { val: 4, bf: 0 } },
                right: { val: 7, bf: 0, left: { val: 6, bf: 0 }, right: { val: 8, bf: 0 } },
              },
              rotation: "无",
              balanceFactors: "所有结点 BF 属于 {-1, 0, 1}",
            },
          },
          {
            description: "插入 1：1 < 2，成为结点 2 的左孩子。向上检查平衡因子",
            state: {
              tree: {
                val: 5, bf: 1,
                left: {
                  val: 3, bf: 2,
                  left: { val: 2, bf: 1, left: { val: 1, bf: 0 } },
                  right: { val: 4, bf: 0 },
                },
                right: { val: 7, bf: 0, left: { val: 6, bf: 0 }, right: { val: 8, bf: 0 } },
              },
              rotation: "无（刚插入，向上检查平衡）",
              balanceFactors: "BF(2)=1, BF(3)=2 ← 失衡！",
              newNode: 1,
              highlight: 3,
            },
          },
          {
            description: "结点 3 的 BF=2，插入在左孩子(2)的左子树 — LL失衡，对结点 3 执行右旋",
            state: {
              tree: {
                val: 5, bf: 0,
                left: {
                  val: 2, bf: -1,
                  left: { val: 1, bf: 0 },
                  right: { val: 3, bf: -1, right: { val: 4, bf: 0 } },
                },
                right: { val: 7, bf: 0, left: { val: 6, bf: 0 }, right: { val: 8, bf: 0 } },
              },
              rotation: "LL旋转（右旋结点3）：2成为新子树根，3成为2的右孩子",
              balanceFactors: "旋转后所有结点 BF 属于 {-1, 0, 1}，树恢复平衡",
              highlight: 2,
            },
          },
          {
            description: "旋转完成，继续向上检查结点 5：BF(5)=1，仍然平衡，插入结束",
            state: {
              tree: {
                val: 5, bf: 1,
                left: {
                  val: 2, bf: -1,
                  left: { val: 1, bf: 0 },
                  right: { val: 3, bf: -1, right: { val: 4, bf: 0 } },
                },
                right: { val: 7, bf: 0, left: { val: 6, bf: 0 }, right: { val: 8, bf: 0 } },
              },
              rotation: "无需进一步旋转",
              balanceFactors: "BF(5)=1, BF(2)=-1, BF(7)=0 — 全部平衡",
            },
          },
        ],
      },
      {
        id: "avl-height",
        title: "高度与结点数关系",
        type: "detail",
        content: `## N(h)：高度为 h 的 AVL 树最少结点数

**递推公式**：

\`\`\`
N(0) = 0  （空树）
N(1) = 1  （只有根结点）
N(h) = N(h-1) + N(h-2) + 1  （h >= 2）
\`\`\`

**理解**：高度为 h 的 AVL 树，为了结点数最少，根的两棵子树高度差恰好为 1，分别是高度 h-1 和 h-2 的最少结点 AVL 树，再加上根结点本身。

---

## 前几项值

| h | N(h) |
|---|------|
| 0 | 0 |
| 1 | 1 |
| 2 | 2 |
| 3 | 4 |
| 4 | 7 |
| 5 | 12 |

---

## 考研常考：反推高度

含 n 个结点的 AVL 树，高度 h = O(logn)。

**考试技巧**：若题目给出结点数 n，要求最大高度，则从 N(h) 表格反查：找最大的 h 使得 N(h) <= n。`,
      },
    ],
    exercises: [
      {
        id: "avl-ex1",
        title: "判断AVL树并计算平衡因子",
        description: "给定关键字序列 [10, 5, 15, 3, 7, 12, 20, 1]（按层次顺序构造二叉树）。请画出该树，计算每个结点的平衡因子，并判断它是否是 AVL 树。若不是，指出第一个失衡结点。",
        difficulty: "medium",
        hints: [
          "平衡因子 = 左子树高度 - 右子树高度，叶子结点的平衡因子为 0",
          "从叶子结点开始向上计算高度，再求平衡因子",
          "只要有一个结点的平衡因子不在 {-1, 0, 1} 中，就不是 AVL 树",
        ],
        referenceSolution: `按层次构造树：
        10
       /  \\
      5    15
     / \\  /  \\
    3   7 12  20
   /
  1

各结点平衡因子：
- 1: BF=0（叶子）
- 3: BF=1（左高1，右高0）
- 7: BF=0（叶子）
- 5: BF=1（左高2，右高1）
- 12: BF=0（叶子）
- 20: BF=0（叶子）
- 15: BF=0（左高1，右高1）
- 10: BF=1（左高3，右高2）

所有结点 BF 属于 {-1, 0, 1}，该树是 AVL 树。`,
      },
      {
        id: "avl-ex2",
        title: "AVL树插入与旋转",
        description: "依次向空 AVL 树中插入关键字序列 [3, 2, 1, 4, 5, 6, 7]。请画出每次插入后的树形态，标注每次旋转的类型（LL/RR/LR/RL）和旋转结点。",
        difficulty: "hard",
        hints: [
          "每次插入后，从插入点向上回溯，找第一个 BF 绝对值 > 1 的结点",
          "插入 1 时：结点 3 的 BF = 2，插入在左孩子的左子树，LL旋转（右旋）",
          "插入 5 时：结点 3 的 BF = -2，插入在右孩子的右子树，RR旋转（左旋）",
          "插入 7 时：结点 5 的 BF = -2，RR旋转",
        ],
        referenceSolution: `插入3: 根=3
插入2: 3的左孩子=2，BF(3)=1，平衡
插入1: BF(3)=2，LL旋转 => 根=2，左=1，右=3
插入4: 3的右孩子=4，BF(3)=-1，平衡
插入5: BF(3)=-2，RR旋转 => 根=2，左=1，右=4(左=3,右=5)
插入6: BF(2)=-2，RR旋转(左旋结点2) => 根=4，左=2(左=1,右=3)，右=5(右=6)
插入7: BF(5)=-2，RR旋转 => 根=4，左=2(左=1,右=3)，右=6(左=5,右=7)

最终树：
        4
       / \\
      2   6
     / \\ / \\
    1  3 5  7`,
      },
    ],
  },
];
