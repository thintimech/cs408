import { Lesson } from "@/types";

export const graphLessons: Lesson[] = [
  // ============================================================
  // 1. 图的遍历（DFS + BFS）
  // ============================================================
  {
    id: "graph-traversal",
    title: "图的遍历：DFS与BFS",
    brief: "深度优先搜索和广度优先搜索——系统访问图中所有顶点的两种基本策略",
    keyTakeaways: [
      "DFS 类似树的前序遍历，用栈（递归调用栈或显式栈）实现",
      "BFS 类似树的层序遍历，用队列实现",
      "邻接矩阵存储时，遍历序列唯一；邻接表存储时，遍历序列取决于链表中邻接点的顺序",
      "DFS 时间复杂度：邻接矩阵 O(|V|²)，邻接表 O(|V|+|E|)",
      "BFS 时间复杂度：邻接矩阵 O(|V|²)，邻接表 O(|V|+|E|)",
      "对于非连通图，需要对每个连通分量分别调用遍历",
      "DFS 可用于判断连通性、寻找路径；BFS 可求无权图最短路径",
    ],
    relatedLessons: ["dijkstra", "topological-sort", "prim", "kruskal"],
    sections: [
      {
        id: "motivation",
        title: "为什么图的遍历比树复杂？",
        type: "motivation",
        content: `树的遍历很自然——从根出发，沿着边往下走就行，不会走回头路（因为树没有环）。

图不一样：
1. **有环**：可能走着走着又回到起点，陷入死循环
2. **无根**：没有天然的起点，任何顶点都可以作为起始点
3. **多路径**：从 A 到 B 可能有多条路径

所以图的遍历必须解决一个核心问题：**如何避免重复访问？**

答案是 visited[] 数组——访问过的顶点做标记，不再重复访问。这是 DFS 和 BFS 共同的基础。

**考研重点**：图的遍历序列不唯一，取决于：
- 起始顶点的选择
- 存储结构（邻接矩阵 vs 邻接表）
- 邻接表中邻接点的链接顺序`,
      },
      {
        id: "concept",
        title: "DFS与BFS的核心思想",
        type: "concept",
        content: `## 深度优先搜索（DFS）

**策略**：从起始顶点出发，沿着一条路尽可能深地走下去，走不通了再回退（回溯），换一条路继续。

类比：走迷宫时"一条路走到黑"的策略。

**实现机制**：递归（系统栈）或显式栈

## 广度优先搜索（BFS）

**策略**：从起始顶点出发，先访问所有距离为1的顶点，再访问距离为2的顶点……逐层向外扩展。

类比：往水中扔石子，波纹一圈一圈向外扩散。

**实现机制**：队列

## 关键区别

| 特征 | DFS | BFS |
|------|-----|-----|
| 数据结构 | 栈（递归） | 队列 |
| 空间复杂度 | O(|V|)（递归深度） | O(|V|)（队列长度） |
| 类似的树遍历 | 前序遍历 | 层序遍历 |
| 生成树特点 | 深而窄 | 浅而宽 |
| 求最短路径 | 不适合 | 适合（无权图） |`,
      },
      {
        id: "walkthrough",
        title: "遍历过程详解",
        type: "walkthrough",
        content: `以下图为例（无向图，5个顶点）：

\`\`\`
顶点：V0, V1, V2, V3, V4

边：(V0,V1), (V0,V2), (V0,V3), (V1,V2), (V2,V4)

邻接矩阵：
     V0  V1  V2  V3  V4
V0 [  0   1   1   1   0 ]
V1 [  1   0   1   0   0 ]
V2 [  1   1   0   0   1 ]
V3 [  1   0   0   0   0 ]
V4 [  0   0   1   0   0 ]

邻接表（按编号从小到大链接）：
V0 → V1 → V2 → V3
V1 → V0 → V2
V2 → V0 → V1 → V4
V3 → V0
V4 → V2
\`\`\`

**从 V0 出发进行 DFS（邻接矩阵）：**`,
        steps: [
          {
            description: "访问 V0，标记 visited[0]=true。扫描邻接矩阵第0行，找到第一个未访问的邻接点 V1",
            state: { visited: [true, false, false, false, false], stack: ["V0"], sequence: ["V0"], current: 0 },
          },
          {
            description: "访问 V1，标记 visited[1]=true。扫描第1行，V0已访问，找到未访问的 V2",
            state: { visited: [true, true, false, false, false], stack: ["V0", "V1"], sequence: ["V0", "V1"], current: 1 },
          },
          {
            description: "访问 V2，标记 visited[2]=true。扫描第2行，V0、V1已访问，找到未访问的 V4",
            state: { visited: [true, true, true, false, false], stack: ["V0", "V1", "V2"], sequence: ["V0", "V1", "V2"], current: 2 },
          },
          {
            description: "访问 V4，标记 visited[4]=true。扫描第4行，V2已访问，无未访问邻接点，回退",
            state: { visited: [true, true, true, false, true], stack: ["V0", "V1", "V2", "V4"], sequence: ["V0", "V1", "V2", "V4"], current: 4 },
          },
          {
            description: "回退到 V2（无更多未访问邻接点），回退到 V1（无更多），回退到 V0，找到未访问的 V3",
            state: { visited: [true, true, true, false, true], stack: ["V0"], sequence: ["V0", "V1", "V2", "V4"], current: 0 },
          },
          {
            description: "访问 V3，标记 visited[3]=true。V3的邻接点V0已访问，回退。所有顶点已访问，DFS结束",
            state: { visited: [true, true, true, true, true], stack: ["V0", "V3"], sequence: ["V0", "V1", "V2", "V4", "V3"], current: 3 },
          },
        ],
      },
      {
        id: "walkthrough-bfs",
        title: "BFS遍历过程",
        type: "walkthrough",
        content: `**从 V0 出发进行 BFS（邻接矩阵）：**

使用队列，先将起始顶点入队。每次出队一个顶点，将其所有未访问的邻接点入队。`,
        steps: [
          {
            description: "V0 入队并标记已访问",
            state: { visited: [true, false, false, false, false], queue: ["V0"], sequence: [], current: 0 },
          },
          {
            description: "V0 出队，访问 V0。扫描第0行，将未访问的邻接点 V1、V2、V3 依次入队并标记",
            state: { visited: [true, true, true, true, false], queue: ["V1", "V2", "V3"], sequence: ["V0"], current: 0 },
          },
          {
            description: "V1 出队，访问 V1。扫描第1行，V0、V2 均已访问，无新顶点入队",
            state: { visited: [true, true, true, true, false], queue: ["V2", "V3"], sequence: ["V0", "V1"], current: 1 },
          },
          {
            description: "V2 出队，访问 V2。扫描第2行，V0、V1已访问，V4未访问，V4入队并标记",
            state: { visited: [true, true, true, true, true], queue: ["V3", "V4"], sequence: ["V0", "V1", "V2"], current: 2 },
          },
          {
            description: "V3 出队，访问 V3。扫描第3行，V0已访问，无新顶点入队",
            state: { visited: [true, true, true, true, true], queue: ["V4"], sequence: ["V0", "V1", "V2", "V3"], current: 3 },
          },
          {
            description: "V4 出队，访问 V4。扫描第4行，V2已访问。队列为空，BFS结束",
            state: { visited: [true, true, true, true, true], queue: [], sequence: ["V0", "V1", "V2", "V3", "V4"], current: 4 },
          },
        ],
      },
      {
        id: "storage-impact",
        title: "存储结构对遍历序列的影响",
        type: "detail",
        content: `**核心结论：邻接矩阵的遍历序列唯一，邻接表的遍历序列不唯一。**

**原因分析：**

邻接矩阵中，扫描某顶点的邻接点时，总是按行从左到右（即按顶点编号从小到大）扫描，顺序固定。

邻接表中，邻接点的访问顺序取决于链表中结点的链接顺序，而同一个图可以有不同的邻接表表示。

**同一个图的不同遍历结果：**

以上面的图为例，从 V0 出发的 DFS：
- 邻接矩阵：V0 → V1 → V2 → V4 → V3（总是先找编号小的）
- 邻接表1（V0→V1→V2→V3）：V0 → V1 → V2 → V4 → V3
- 邻接表2（V0→V3→V2→V1）：V0 → V3 → V2 → V1 → V4

**考研常见陷阱**：题目说"给定图"让你写遍历序列，必须看清是邻接矩阵还是邻接表，如果是邻接表还要看链接顺序！`,
      },
      {
        id: "pseudocode",
        title: "DFS 代码逐行拆解",
        type: "detail",
        content: `先看最简单的版本，然后逐行解释**为什么要这么写**。

\`\`\`
bool visited[MAX_VERTEX_NUM];  // 全局数组，记录每个顶点是否已访问

void DFS(Graph G, int v) {
    visit(v);              // 第1步：处理当前顶点（比如打印）
    visited[v] = true;     // 第2步：标记，防止重复访问
    // 第3步：遍历 v 的所有邻接点
    for (w = FirstNeighbor(G, v); w >= 0; w = NextNeighbor(G, v, w)) {
        if (!visited[w])   // 只访问没去过的
            DFS(G, w);     // 递归深入
    }
}
\`\`\`

**逐行理解：**

**\`visited[v] = true\`** — 为什么需要这个？
图有环。如果不标记，A→B→C→A 会无限循环。标记后，回到 A 时发现已访问，就不会再进去。

**\`for (w = FirstNeighbor...)\`** — 这是在干什么？
遍历 v 的所有邻接点。这行代码的具体实现取决于存储结构：

- **邻接矩阵**：扫描 v 那一行，找值为1的列
- **邻接表**：沿着 v 的边链表逐个往下走

**\`if (!visited[w])\`** — 为什么要判断？
因为 w 可能已经被其他路径访问过了。图不像树，一个顶点可能有多个前驱。

**\`DFS(G, w)\`** — 递归调用
这就是"深度优先"的体现：发现一个没去过的邻接点，立刻深入进去，而不是先把所有邻接点看完。

---

## 邻接矩阵版本（展开 for 循环）

\`\`\`
void DFS_AM(MGraph G, int v) {
    visit(v);
    visited[v] = true;
    for (int w = 0; w < G.vexnum; w++) {    // 扫描第v行
        if (G.Edge[v][w] == 1 && !visited[w])  // 有边且未访问
            DFS_AM(G, w);
    }
}
\`\`\`

邻接矩阵中，找 v 的邻接点就是看第 v 行哪些位置是 1。所以要扫描整行（|V| 个元素），即使 v 只有 2 个邻接点也要看完整行。这就是为什么邻接矩阵的 DFS 是 O(|V|²)。

## 邻接表版本（展开 for 循环）

\`\`\`
void DFS_AL(ALGraph G, int v) {
    visit(v);
    visited[v] = true;
    ArcNode *p = G.vertices[v].first;  // 指向v的第一条边
    while (p != NULL) {
        int w = p->adjvex;              // 邻接点编号
        if (!visited[w])
            DFS_AL(G, w);
        p = p->next;                    // 下一条边
    }
}
\`\`\`

邻接表中，v 的邻接点都串在一条链表上，直接遍历链表即可。只看 v 实际有的边，不浪费时间。这就是为什么邻接表的 DFS 是 O(|V|+|E|)。`,
      },
      {
        id: "bfs-code",
        title: "BFS 代码逐行拆解",
        type: "detail",
        content: `\`\`\`
void BFS(Graph G, int v) {
    visit(v);              // 访问起点
    visited[v] = true;     // 标记起点
    EnQueue(Q, v);         // 起点入队

    while (!isEmpty(Q)) {       // 队列不空就继续
        DeQueue(Q, u);          // 取出队头顶点 u
        // 遍历 u 的所有邻接点
        for (w = FirstNeighbor(G, u); w >= 0; w = NextNeighbor(G, u, w)) {
            if (!visited[w]) {
                visit(w);
                visited[w] = true;
                EnQueue(Q, w);  // 新发现的顶点入队
            }
        }
    }
}
\`\`\`

**BFS 的核心逻辑：用队列控制访问顺序。**

把 BFS 想象成"水波扩散"：
1. 起点是投石入水的位置
2. 先处理距离为1的所有顶点（第一圈水波）
3. 再处理距离为2的所有顶点（第二圈水波）
4. 队列保证了这个"一层一层"的顺序

**为什么用队列而不是栈？**
队列是先进先出。先发现的顶点先处理，保证了"层次"顺序。如果换成栈（后进先出），就变成了 DFS。

**\`visited[w] = true\` 为什么在入队时标记，而不是出队时？**
如果出队时才标记，同一个顶点可能被多次入队。比如 A 和 B 都与 C 相邻，处理 A 时 C 入队，处理 B 时 C 又入队。浪费空间且可能导致重复访问。

入队时就标记 = "我已经知道你了，不需要再发现你"。

---

## 邻接矩阵版本

\`\`\`
void BFS_AM(MGraph G, int v) {
    visit(v);
    visited[v] = true;
    EnQueue(Q, v);
    while (!isEmpty(Q)) {
        DeQueue(Q, u);
        for (int w = 0; w < G.vexnum; w++) {
            if (G.Edge[u][w] == 1 && !visited[w]) {
                visit(w);
                visited[w] = true;
                EnQueue(Q, w);
            }
        }
    }
}
\`\`\`

## 邻接表版本

\`\`\`
void BFS_AL(ALGraph G, int v) {
    visit(v);
    visited[v] = true;
    EnQueue(Q, v);
    while (!isEmpty(Q)) {
        DeQueue(Q, u);
        ArcNode *p = G.vertices[u].first;
        while (p != NULL) {
            int w = p->adjvex;
            if (!visited[w]) {
                visit(w);
                visited[w] = true;
                EnQueue(Q, w);
            }
            p = p->next;
        }
    }
}
\`\`\`

---

## DFS vs BFS 代码结构对比

把两者放在一起看，区别只有一个地方：

| | DFS | BFS |
|--|-----|-----|
| 数据结构 | 栈（递归=隐式栈） | 队列 |
| 发现新顶点时 | 立刻深入（递归调用） | 放入队列等待 |
| 效果 | 一条路走到黑 | 一层一层扩展 |

**本质区别**：发现新顶点后是"立刻去"还是"排队等"。

## 非连通图的处理

\`\`\`
void BFSTraverse(Graph G) {
    for (v = 0; v < G.vexnum; v++)
        visited[v] = false;
    for (v = 0; v < G.vexnum; v++)
        if (!visited[v])
            BFS(G, v);  // 每个连通分量调用一次
}
\`\`\`

如果图不连通，一次 BFS/DFS 只能访问一个连通分量。所以外层循环检查所有顶点，对没访问过的再启动一次遍历。调用 BFS/DFS 的次数 = 连通分量的个数。`,
      },
      {
        id: "complexity",
        title: "复杂度分析",
        type: "detail",
        content: `## 时间复杂度

| 存储结构 | DFS | BFS |
|----------|-----|-----|
| 邻接矩阵 | O(|V|²) | O(|V|²) |
| 邻接表 | O(|V|+|E|) | O(|V|+|E|) |

**分析：**
- 邻接矩阵：对每个顶点，需要扫描整行（|V|个元素）来找邻接点，共|V|个顶点，所以 O(|V|²)
- 邻接表：对每个顶点，只需遍历其邻接链表。所有链表结点总数为 2|E|（无向图）或 |E|（有向图），加上访问|V|个顶点本身，所以 O(|V|+|E|)

## 空间复杂度

两者都需要 visited[] 数组 O(|V|)，加上：
- DFS：递归栈最深 O(|V|)
- BFS：队列最大 O(|V|)

所以空间复杂度都是 **O(|V|)**。

## 考研要点

稀疏图（|E| << |V|²）用邻接表存储更高效，遍历复杂度 O(|V|+|E|) 远小于 O(|V|²)。
稠密图（|E| 接近 |V|²）两种存储结构差别不大。`,
      },
      {
        id: "comparison",
        title: "DFS与BFS对比",
        type: "comparison",
        content: `| 对比维度 | DFS | BFS |
|----------|-----|-----|
| 思想 | 尽可能深入 | 逐层扩展 |
| 数据结构 | 栈（递归） | 队列 |
| 生成树 | 深度优先生成树（深而窄） | 广度优先生成树（浅而宽） |
| 最短路径 | 不能求最短路径 | 可求无权图最短路径 |
| 空间 | 最坏 O(|V|) | 最坏 O(|V|) |
| 适用场景 | 判断连通性、寻找路径、拓扑排序 | 最短路径、层次遍历 |

**DFS 的应用：**
- 判断图的连通性
- 求连通分量
- 拓扑排序（逆后序）
- 判断是否有环

**BFS 的应用：**
- 无权图的单源最短路径
- 求图的直径
- 社交网络中的"几度好友"

**考研常考**：BFS 求无权图最短路径的原理——BFS 按层扩展，第一次到达某顶点时经过的边数最少，即为最短路径。`,
      },
      {
        id: "pitfalls",
        title: "考研易错点",
        type: "detail",
        content: `1. **遍历序列不唯一**：同一个图，不同存储结构（或邻接表中不同链接顺序）会产生不同的遍历序列。做题时必须看清题目给的是什么存储结构。

2. **visited 标记时机**：
   - DFS：访问顶点时立即标记
   - BFS：**入队时**标记，不是出队时！如果出队时才标记，同一顶点可能被多次入队

3. **非连通图**：一次 DFS/BFS 只能遍历一个连通分量。对非连通图，需要循环检查是否有未访问的顶点。调用 DFS/BFS 的次数 = 连通分量数。

4. **有向图**：
   - 从某顶点出发的 DFS/BFS 不一定能访问所有顶点（即使图是强连通的也要看起点）
   - 对有向图，调用遍历的次数不等于强连通分量数

5. **DFS 与递归深度**：对于顶点数很多的图，递归 DFS 可能栈溢出。考研一般不考这个，但要知道可以用显式栈实现非递归 DFS。

6. **BFS 生成树的性质**：BFS 生成树中，从根到任意顶点的路径就是原图中的最短路径（按边数计）。DFS 生成树没有这个性质。`,
      },
    ],
    exercises: [
      {
        id: "gt-ex-01",
        title: "邻接表下的DFS序列",
        description: "给定邻接表（V0→V3→V2→V1, V1→V2→V0, V2→V4→V1→V0, V3→V0, V4→V2），从V0出发写出DFS序列。注意与邻接矩阵的区别。",
        difficulty: "easy",
        hints: [
          "邻接表中邻接点的顺序决定了访问顺序",
          "V0的邻接表是 V3→V2→V1，所以先访问V3",
          "从V3出发，V3的邻接点是V0（已访问），回退到V0，再访问V2",
        ],
        referenceSolution: "DFS序列：V0, V3, V2, V4, V1。因为V0的邻接表中V3排在最前面，所以先深入V3；V3只连V0（已访问），回退；再访问V2，V2连V4（未访问），深入V4；V4回退后访问V1。与邻接矩阵的DFS序列（V0,V1,V2,V4,V3）不同！",
      },
      {
        id: "gt-ex-02",
        title: "BFS生成树",
        description: "对上述图从V0出发进行BFS，画出BFS生成树，并说明BFS生成树的特点。",
        difficulty: "medium",
        hints: [
          "BFS生成树中，从根到任意顶点的路径就是最短路径",
          "同一层的顶点到根的距离相同",
          "树的形状取决于存储结构和邻接点顺序",
        ],
        referenceSolution: "BFS生成树（邻接矩阵）：V0为根，第一层V1、V2、V3，第二层V4（从V2扩展）。树边为(V0,V1),(V0,V2),(V0,V3),(V2,V4)。特点：BFS生成树中从根到任意顶点的路径长度等于该顶点到起点的最短路径长度（边数）。",
      },
      {
        id: "gt-ex-03",
        title: "判断连通性",
        description: "如何用一次DFS/BFS判断无向图是否连通？如果图有6个顶点，一次DFS从V0出发只访问了4个顶点，说明什么？",
        difficulty: "easy",
        hints: [
          "连通图：从任一顶点出发，一次遍历可以访问所有顶点",
          "如果一次遍历不能访问所有顶点，说明图不连通",
        ],
        referenceSolution: "对于无向图，从任一顶点出发进行一次DFS/BFS，如果visited[]中所有元素都为true，则图连通。如果6个顶点只访问了4个，说明图不连通，至少有2个连通分量。需要再从未访问的顶点出发继续遍历。调用DFS/BFS的次数等于连通分量的个数。",
      },
    ],
  },
  // ============================================================
  // 2. Prim算法（最小生成树）
  // ============================================================
  {
    id: "prim",
    title: "Prim算法",
    brief: "从顶点出发，每次选择连接已选顶点集合与未选顶点集合的最小权边，贪心构造最小生成树",
    keyTakeaways: [
      "Prim算法从顶点角度出发，每次将离已选集合最近的顶点加入",
      "时间复杂度 O(|V|²)，适合稠密图",
      "使用辅助数组 lowcost[] 和 closest[] 记录候选边信息",
      "与Kruskal的区别：Prim从顶点扩展，Kruskal从边选择",
      "最小生成树可能不唯一，但权值之和唯一",
      "最小生成树的边数 = |V| - 1",
    ],
    relatedLessons: ["kruskal", "dijkstra", "graph-traversal"],
    sections: [
      {
        id: "motivation",
        title: "为什么需要最小生成树？",
        type: "motivation",
        content: `**实际问题**：n 个城市之间要修公路，使得任意两个城市都能互相到达，且总修路费用最小。

这就是最小生成树问题：
- 图的顶点 = 城市
- 边的权值 = 修路费用
- 生成树 = 连通所有城市的方案（n-1条边，无环）
- 最小生成树 = 总费用最小的方案

**Prim 的贪心策略**：从一个城市开始，每次把"离已建公路网最近的城市"接入网络。

这个贪心策略为什么正确？因为如果不选当前最小的边，将来也不可能找到更好的替代方案（可以用反证法/切割定理证明）。`,
      },
      {
        id: "concept",
        title: "算法核心思想",
        type: "concept",
        content: `## Prim算法思想

将顶点分为两个集合：
- **U**：已加入生成树的顶点集合
- **V-U**：尚未加入的顶点集合

初始时 U = {任选一个起始顶点}，重复以下操作直到 U = V：

> 在所有连接 U 和 V-U 的边中，选择权值最小的边 (u, v)（u∈U, v∈V-U），将 v 加入 U。

## 辅助数据结构

- **lowcost[v]**：从 V-U 中的顶点 v 到 U 中所有顶点的边中，权值最小的那条边的权值
- **closest[v]**：那条最小权边在 U 中的端点

每次将新顶点 k 加入 U 后，需要更新 lowcost[]：对于 V-U 中的每个顶点 j，如果 edge(k,j) < lowcost[j]，则更新 lowcost[j] = edge(k,j)，closest[j] = k。`,
      },
      {
        id: "walkthrough",
        title: "手算过程详解",
        type: "walkthrough",
        content: `以下面的带权无向图为例（6个顶点 V0~V5）：

\`\`\`
边及权值：
(V0,V1)=6, (V0,V2)=1, (V0,V3)=5
(V1,V2)=5, (V1,V4)=3
(V2,V3)=5, (V2,V4)=6, (V2,V5)=4
(V3,V5)=2
(V4,V5)=6
\`\`\`

从 V0 出发执行 Prim 算法：`,
        steps: [
          {
            description: "初始化：U={V0}，设置 lowcost[] 为 V0 到各顶点的直接边权（无直接边则为∞）",
            state: {
              U: ["V0"],
              lowcost: { V1: 6, V2: 1, V3: 5, V4: "∞", V5: "∞" },
              closest: { V1: "V0", V2: "V0", V3: "V0", V4: "-", V5: "-" },
              selectedEdges: [],
              totalWeight: 0,
            },
          },
          {
            description: "选 lowcost 最小的顶点：V2（lowcost=1）。将 V2 加入 U，选边 (V0,V2) 权=1",
            state: {
              U: ["V0", "V2"],
              lowcost: { V1: 5, V3: 5, V4: 6, V5: 4 },
              closest: { V1: "V2", V3: "V2/V0", V4: "V2", V5: "V2" },
              selectedEdges: ["(V0,V2)=1"],
              totalWeight: 1,
              note: "更新：V1从6→5(经V2), V3保持5, V4从∞→6(经V2), V5从∞→4(经V2)",
            },
          },
          {
            description: "选 lowcost 最小的顶点：V5（lowcost=4）。将 V5 加入 U，选边 (V2,V5) 权=4",
            state: {
              U: ["V0", "V2", "V5"],
              lowcost: { V1: 5, V3: 2, V4: 6 },
              closest: { V1: "V2", V3: "V5", V4: "V2" },
              selectedEdges: ["(V0,V2)=1", "(V2,V5)=4"],
              totalWeight: 5,
              note: "更新：V3从5→2(经V5), V4的6≤V5到V4的6不变",
            },
          },
          {
            description: "选 lowcost 最小的顶点：V3（lowcost=2）。将 V3 加入 U，选边 (V5,V3) 权=2",
            state: {
              U: ["V0", "V2", "V5", "V3"],
              lowcost: { V1: 5, V4: 6 },
              closest: { V1: "V2", V4: "V2" },
              selectedEdges: ["(V0,V2)=1", "(V2,V5)=4", "(V5,V3)=2"],
              totalWeight: 7,
              note: "V3加入后，V3没有连接到V1或V4的更短边",
            },
          },
          {
            description: "选 lowcost 最小的顶点：V1（lowcost=5）。将 V1 加入 U，选边 (V2,V1) 权=5",
            state: {
              U: ["V0", "V2", "V5", "V3", "V1"],
              lowcost: { V4: 3 },
              closest: { V4: "V1" },
              selectedEdges: ["(V0,V2)=1", "(V2,V5)=4", "(V5,V3)=2", "(V2,V1)=5"],
              totalWeight: 12,
              note: "更新：V4从6→3(经V1，因为edge(V1,V4)=3<6)",
            },
          },
          {
            description: "选最后一个顶点 V4（lowcost=3）。将 V4 加入 U，选边 (V1,V4) 权=3。算法结束",
            state: {
              U: ["V0", "V2", "V5", "V3", "V1", "V4"],
              selectedEdges: ["(V0,V2)=1", "(V2,V5)=4", "(V5,V3)=2", "(V2,V1)=5", "(V1,V4)=3"],
              totalWeight: 15,
              note: "最小生成树总权值 = 1+4+2+5+3 = 15",
            },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "Prim算法伪代码",
        type: "detail",
        content: `\`\`\`
void Prim(MGraph G, int start) {
    // 初始化
    for (int i = 0; i < G.vexnum; i++) {
        lowcost[i] = G.Edge[start][i]; // start到各顶点的权
        closest[i] = start;
        inMST[i] = false;
    }
    inMST[start] = true;  // 起始顶点加入MST

    for (int i = 1; i < G.vexnum; i++) {  // 再选 n-1 个顶点
        // 1. 找 lowcost 最小的未加入顶点
        int min = INF, k = -1;
        for (int j = 0; j < G.vexnum; j++) {
            if (!inMST[j] && lowcost[j] < min) {
                min = lowcost[j];
                k = j;
            }
        }

        // 2. 将顶点 k 加入 MST
        inMST[k] = true;
        // 输出边: (closest[k], k) 权值 lowcost[k]

        // 3. 更新 lowcost[]
        for (int j = 0; j < G.vexnum; j++) {
            if (!inMST[j] && G.Edge[k][j] < lowcost[j]) {
                lowcost[j] = G.Edge[k][j];
                closest[j] = k;
            }
        }
    }
}
\`\`\`

**复杂度分析：**
- 外层循环 |V|-1 次，内层两个循环各 |V| 次
- 时间复杂度：**O(|V|²)**，与边数无关
- 空间复杂度：O(|V|)（辅助数组）

**适用场景**：稠密图（边多）。因为时间只与顶点数有关，边再多也不影响。`,
      },
      {
        id: "comparison",
        title: "Prim vs Kruskal",
        type: "comparison",
        content: `| 对比维度 | Prim | Kruskal |
|----------|------|---------|
| 策略 | 从顶点扩展（选最近的顶点） | 从边选择（选最短的边） |
| 时间复杂度 | O(|V|²) | O(|E|log|E|) |
| 适用图 | 稠密图 | 稀疏图 |
| 数据结构 | 邻接矩阵 + lowcost数组 | 边集数组 + 并查集 |
| 初始状态 | 从一个顶点开始扩展 | 所有顶点各自为一棵树 |
| 结果 | 一定连通（逐步扩展） | 需要判断是否形成环 |

**选择依据**：
- |E| 接近 |V|² → 稠密图 → Prim
- |E| 远小于 |V|² → 稀疏图 → Kruskal

**MST 的性质（考研常考）**：
1. 最小生成树不唯一，但权值之和唯一
2. 当图中各边权值互不相等时，MST 唯一
3. MST 的边数 = |V| - 1`,
      },
      {
        id: "pitfalls",
        title: "考研易错点",
        type: "detail",
        content: `1. **lowcost 的更新**：每加入一个新顶点 k，必须检查 k 到所有未加入顶点的边是否比当前 lowcost 更小。很多同学忘记更新。

2. **起始顶点的选择**：Prim 可以从任意顶点开始，最终得到的 MST 权值相同（但树的形状可能不同）。

3. **与 Dijkstra 的区别**：
   - Prim 的 lowcost[v] = v 到 U 中某顶点的最小边权
   - Dijkstra 的 dist[v] = 从源点到 v 的最短路径长度
   - 两者代码结构相似，但含义完全不同！

4. **权值相同时的选择**：如果多条边权值相同，选哪条都行，这就是 MST 不唯一的原因。考研选择题中如果问"下列哪个是最小生成树"，可能有多个正确答案。

5. **负权边**：Prim 算法可以处理负权边（与 Dijkstra 不同），因为它只比较边权大小，不涉及路径累加。`,
      },
    ],
    exercises: [
      {
        id: "prim-ex-01",
        title: "手算Prim过程",
        description: "对带权无向图（顶点A,B,C,D,E，边：AB=4,AC=2,BC=3,BD=5,CD=1,CE=6,DE=4），从A出发用Prim算法求最小生成树，写出每步选择的边。",
        difficulty: "medium",
        hints: [
          "初始 U={A}，lowcost: B=4, C=2, D=∞, E=∞",
          "第一步选C（最小=2），然后更新lowcost",
          "C加入后，B可经C到达(权3<4)，D可经C到达(权1)",
        ],
        referenceSolution: "步骤：①选C(AC=2) ②选D(CD=1) ③选B(BC=3) ④选E(DE=4)。MST边集={(A,C),(C,D),(B,C),(D,E)}，总权值=2+1+3+4=10。",
      },
      {
        id: "prim-ex-02",
        title: "Prim与Dijkstra的区别",
        description: "解释为什么Prim和Dijkstra的代码结构相似但解决的问题不同。给出一个例子说明两者选择的边可能不同。",
        difficulty: "hard",
        hints: [
          "Prim选的是到集合U的最小边权",
          "Dijkstra选的是从源点出发的最短路径",
          "考虑一个三角形图：A-B=1, B-C=1, A-C=3",
        ],
        referenceSolution: "Prim的lowcost[v]表示v到已选集合的最小边权（局部最优）；Dijkstra的dist[v]表示源点到v的最短路径长度（全局累积）。例如图A-B=1,B-C=1,A-C=3：Prim从A出发选AB=1,BC=1（总权2）；Dijkstra从A出发，dist[B]=1,dist[C]=min(3,1+1)=2，最短路径A→B→C长度2。此例结果恰好相同，但若改为A-B=5,B-C=1,A-C=3：Prim选AC=3,然后选BC=1（MST权4）；Dijkstra得dist[B]=5,dist[C]=3，不会选BC边。",
      },
    ],
  },
  // ============================================================
  // 3. Kruskal算法（最小生成树）
  // ============================================================
  {
    id: "kruskal",
    title: "Kruskal算法",
    brief: "从边的角度出发，每次选择权值最小且不构成环的边，贪心构造最小生成树",
    keyTakeaways: [
      "Kruskal从边的角度出发，按权值从小到大选边",
      "用并查集（Union-Find）判断是否构成环",
      "时间复杂度 O(|E|log|E|)，适合稀疏图",
      "需要先对所有边按权值排序",
      "选够 |V|-1 条边即可停止",
      "与Prim的区别：Kruskal关注全局最小边，Prim关注局部最近顶点",
    ],
    relatedLessons: ["prim", "graph-traversal"],
    sections: [
      {
        id: "motivation",
        title: "换一个角度看最小生成树",
        type: "motivation",
        content: `Prim 的思路是"从一个点开始，逐步扩展"。但还有另一种自然的贪心思路：

> 既然要总权值最小，那我直接从所有边中挑最短的不就行了？

这就是 Kruskal 的思想：把所有边排序，从最短的开始选，只要不形成环就加入生成树。

**为什么不能形成环？** 因为树的定义就是无环连通图。n 个顶点的树恰好有 n-1 条边，一旦出现环就不是树了。

**如何判断是否形成环？** 如果一条边的两个端点已经在同一个连通分量中（已经连通了），再加这条边就会形成环。这就需要一个高效的数据结构来维护连通分量——**并查集**。`,
      },
      {
        id: "concept",
        title: "算法核心思想与并查集",
        type: "concept",
        content: `## Kruskal算法步骤

1. 将图中所有边按权值从小到大排序
2. 初始时每个顶点各自为一个连通分量（森林）
3. 依次考察每条边 (u, v)：
   - 如果 u 和 v 在不同的连通分量中 → 选择这条边，合并两个分量
   - 如果 u 和 v 在同一个连通分量中 → 跳过（会形成环）
4. 直到选够 |V|-1 条边，算法结束

## 并查集（Union-Find）

并查集用于高效地判断两个元素是否属于同一集合，以及合并两个集合。

\`\`\`
int parent[MAX_V];  // parent[i] 表示 i 的父结点

// 初始化：每个顶点的父结点是自己
void Init(int n) {
    for (int i = 0; i < n; i++)
        parent[i] = i;
}

// 查找 x 所属集合的根（带路径压缩）
int Find(int x) {
    if (parent[x] != x)
        parent[x] = Find(parent[x]);  // 路径压缩
    return parent[x];
}

// 合并 x 和 y 所在的集合
void Union(int x, int y) {
    int rx = Find(x), ry = Find(y);
    if (rx != ry)
        parent[rx] = ry;  // 将一棵树挂到另一棵下面
}
\`\`\`

**判断是否形成环**：Find(u) == Find(v) 说明 u、v 已连通，加边会形成环。`,
      },
      {
        id: "walkthrough",
        title: "手算过程详解",
        type: "walkthrough",
        content: `使用与 Prim 相同的图（6个顶点 V0~V5）：

\`\`\`
所有边按权值排序：
(V0,V2)=1, (V3,V5)=2, (V1,V4)=3, (V2,V5)=4,
(V0,V3)=5, (V1,V2)=5, (V2,V3)=5, (V0,V1)=6,
(V2,V4)=6, (V4,V5)=6
\`\`\`

初始状态：6个顶点各自为一个连通分量 {V0},{V1},{V2},{V3},{V4},{V5}`,
        steps: [
          {
            description: "考察边 (V0,V2)=1：V0和V2在不同分量中，选择此边。合并{V0}和{V2}→{V0,V2}",
            state: {
              components: ["{V0,V2}", "{V1}", "{V3}", "{V4}", "{V5}"],
              selectedEdges: ["(V0,V2)=1"],
              edgeCount: 1,
              totalWeight: 1,
            },
          },
          {
            description: "考察边 (V3,V5)=2：V3和V5在不同分量中，选择此边。合并→{V3,V5}",
            state: {
              components: ["{V0,V2}", "{V1}", "{V3,V5}", "{V4}"],
              selectedEdges: ["(V0,V2)=1", "(V3,V5)=2"],
              edgeCount: 2,
              totalWeight: 3,
            },
          },
          {
            description: "考察边 (V1,V4)=3：V1和V4在不同分量中，选择此边。合并→{V1,V4}",
            state: {
              components: ["{V0,V2}", "{V1,V4}", "{V3,V5}"],
              selectedEdges: ["(V0,V2)=1", "(V3,V5)=2", "(V1,V4)=3"],
              edgeCount: 3,
              totalWeight: 6,
            },
          },
          {
            description: "考察边 (V2,V5)=4：V2在{V0,V2}，V5在{V3,V5}，不同分量，选择此边。合并→{V0,V2,V3,V5}",
            state: {
              components: ["{V0,V2,V3,V5}", "{V1,V4}"],
              selectedEdges: ["(V0,V2)=1", "(V3,V5)=2", "(V1,V4)=3", "(V2,V5)=4"],
              edgeCount: 4,
              totalWeight: 10,
            },
          },
          {
            description: "考察边 (V0,V3)=5：V0和V3都在{V0,V2,V3,V5}中，跳过（会形成环）",
            state: {
              components: ["{V0,V2,V3,V5}", "{V1,V4}"],
              selectedEdges: ["(V0,V2)=1", "(V3,V5)=2", "(V1,V4)=3", "(V2,V5)=4"],
              edgeCount: 4,
              totalWeight: 10,
              note: "Find(V0)==Find(V3)，跳过",
            },
          },
          {
            description: "考察边 (V1,V2)=5：V1在{V1,V4}，V2在{V0,V2,V3,V5}，不同分量，选择此边。合并为一个分量，共选5条边=|V|-1，算法结束",
            state: {
              components: ["{V0,V1,V2,V3,V4,V5}"],
              selectedEdges: ["(V0,V2)=1", "(V3,V5)=2", "(V1,V4)=3", "(V2,V5)=4", "(V1,V2)=5"],
              edgeCount: 5,
              totalWeight: 15,
              note: "5 = |V|-1 = 6-1，MST构造完成，总权值15",
            },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "Kruskal算法伪代码",
        type: "detail",
        content: `\`\`\`
typedef struct {
    int u, v;    // 边的两个端点
    int weight;  // 边的权值
} Edge;

void Kruskal(Edge edges[], int n, int e) {
    // n: 顶点数, e: 边数
    Sort(edges, e);  // 按权值从小到大排序
    Init(n);         // 初始化并查集

    int count = 0;   // 已选边数
    for (int i = 0; i < e && count < n - 1; i++) {
        int ru = Find(edges[i].u);
        int rv = Find(edges[i].v);
        if (ru != rv) {          // 不在同一分量
            Union(ru, rv);       // 合并
            // 输出边 edges[i]
            count++;
        }
        // 若 ru == rv，跳过此边（会形成环）
    }
}
\`\`\`

**复杂度分析：**
- 排序：O(|E|log|E|)
- 并查集操作：近似 O(|E|·α(|V|)) ≈ O(|E|)（α是反阿克曼函数，增长极慢）
- 总时间复杂度：**O(|E|log|E|)**，瓶颈在排序
- 空间复杂度：O(|V|)（并查集数组）

**适用场景**：稀疏图（边少）。因为时间主要取决于边数。`,
      },
      {
        id: "comparison",
        title: "Kruskal vs Prim 详细对比",
        type: "comparison",
        content: `| 对比维度 | Kruskal | Prim |
|----------|---------|------|
| 出发点 | 从边出发 | 从顶点出发 |
| 策略 | 全局选最小边 | 局部选最近顶点 |
| 判环 | 并查集 | 不需要（天然不会成环） |
| 排序 | 需要对边排序 | 不需要排序 |
| 时间复杂度 | O(\\|E\\|log\\|E\\|) | O(\\|V\\|²) |
| 适用图 | 稀疏图 | 稠密图 |
| 存储结构 | 边集数组 | 邻接矩阵 |

**如何选择？**
- 稀疏图（|E| << |V|²）：Kruskal 更快，O(|E|log|E|) < O(|V|²)
- 稠密图（|E| ≈ |V|²）：Prim 更快，O(|V|²) < O(|E|log|E|) = O(|V|²log|V|)

**考研选择题常见问法**：
- "对于有n个顶点e条边的图，当e远小于n²时，用___算法更高效" → Kruskal
- "对于稠密图求MST，应选用___" → Prim`,
      },
      {
        id: "pitfalls",
        title: "考研易错点",
        type: "detail",
        content: `1. **并查集的路径压缩**：考研中并查集一般只考基本的 Find 和 Union，但要理解路径压缩的作用（将查找复杂度从 O(n) 降到近似 O(1)）。

2. **权值相同的边**：如果有多条边权值相同，选择不同的边可能得到不同的 MST（但总权值相同）。做题时如果题目没有特别说明，按编号顺序选即可。

3. **算法终止条件**：选够 |V|-1 条边就停止。如果遍历完所有边还不够 |V|-1 条，说明图不连通，不存在生成树。

4. **Kruskal 不需要指定起始顶点**：与 Prim 不同，Kruskal 是全局选边，不依赖起始顶点。

5. **手算时的常见错误**：
   - 忘记检查是否形成环（两端点已在同一分量）
   - 排序时遗漏某条边
   - 权值相同的边排序不一致导致结果不同（这不是错误，MST本身可能不唯一）

6. **并查集的初始化**：每个顶点的 parent 初始为自己（或-1），表示各自独立。`,
      },
    ],
    exercises: [
      {
        id: "kruskal-ex-01",
        title: "手算Kruskal过程",
        description: "对带权无向图（顶点A,B,C,D,E，边：AB=4,AC=2,BC=3,BD=5,CD=1,CE=6,DE=4），用Kruskal算法求最小生成树。写出边的选择顺序。",
        difficulty: "medium",
        hints: [
          "先排序：CD=1, AC=2, BC=3, AB=4, DE=4, BD=5, CE=6",
          "依次选边，用并查集判断是否成环",
          "选够4条边（5个顶点-1）即停止",
        ],
        referenceSolution: "排序后依次考察：①CD=1，选（C,D不连通）②AC=2，选（A,C不连通）③BC=3，选（B与{A,C,D}不连通）④AB=4，跳过（A,B已在同一分量{A,B,C,D}中）⑤DE=4，选（E与{A,B,C,D}不连通）。MST={(C,D),(A,C),(B,C),(D,E)}，总权值=1+2+3+4=10。",
      },
      {
        id: "kruskal-ex-02",
        title: "并查集操作模拟",
        description: "初始5个元素{0,1,2,3,4}，依次执行 Union(0,1), Union(2,3), Union(1,3), Union(0,4)。画出每步后的并查集树，并回答 Find(4) 的结果。",
        difficulty: "easy",
        hints: [
          "初始每个元素的parent是自己",
          "Union(a,b)将Find(a)的根挂到Find(b)的根下",
          "Find操作沿parent向上找到根",
        ],
        referenceSolution: "初始：parent=[0,1,2,3,4]。Union(0,1)：parent[0]=1，即parent=[1,1,2,3,4]。Union(2,3)：parent[2]=3，parent=[1,1,3,3,4]。Union(1,3)：Find(1)=1,Find(3)=3，parent[1]=3，parent=[1,3,3,3,4]。Union(0,4)：Find(0)→Find(1)→Find(3)=3，Find(4)=4，parent[3]=4，parent=[1,3,3,4,4]。Find(4)=4。此时Find(0)=Find(1)=Find(2)=Find(3)=4。",
      },
    ],
  },
  // ============================================================
  // 4. Dijkstra算法（单源最短路径）
  // ============================================================
  {
    id: "dijkstra",
    title: "Dijkstra算法",
    brief: "从源点出发，按路径长度递增的顺序逐步确定到各顶点的最短路径，贪心策略",
    keyTakeaways: [
      "Dijkstra 是单源最短路径算法，求源点到所有其他顶点的最短路径",
      "贪心策略：每次从未确定的顶点中选 dist 最小的，确定其最短路径",
      "不能处理负权边（这是与Bellman-Ford的关键区别）",
      "时间复杂度 O(|V|²)，用优先队列可优化到 O((|V|+|E|)log|V|)",
      "dist[] 数组记录当前已知的最短路径长度，path[] 记录前驱",
      "手算时画 dist[] 更新表是考研必考题型",
    ],
    relatedLessons: ["floyd", "prim", "graph-traversal"],
    sections: [
      {
        id: "motivation",
        title: "最短路径问题",
        type: "motivation",
        content: `**问题**：从城市 A 出发，到其他各城市的最短路线分别是什么？

这就是**单源最短路径**问题：给定一个源点，求它到图中所有其他顶点的最短路径。

**为什么不能用 BFS？** BFS 只能求无权图（或等权图）的最短路径。当边有不同权值时，经过边数少的路径不一定是最短的。

**Dijkstra 的贪心思想**：
- 维护一个 dist[] 数组，dist[v] 表示"从源点到 v 的当前已知最短路径长度"
- 每次从未确定的顶点中，选 dist 值最小的顶点 u，确定 u 的最短路径
- 然后用 u 去"松弛"（更新）u 的所有邻接点的 dist 值

**为什么贪心正确？** 因为所有边权非负，当前 dist 最小的顶点不可能通过其他未确定顶点找到更短的路径（绕路只会更长）。`,
      },
      {
        id: "concept",
        title: "算法核心概念",
        type: "concept",
        content: `## 核心数据结构

- **dist[v]**：从源点 s 到顶点 v 的当前最短路径估计值
- **path[v]**：最短路径上 v 的前驱顶点（用于回溯路径）
- **final[v]**（或 visited[v]）：标记 v 的最短路径是否已确定

## 算法流程

1. **初始化**：dist[s]=0，dist[其他]=∞，final[所有]=false
2. **循环 |V|-1 次**：
   a. 从 final[]=false 的顶点中选 dist 最小的顶点 u
   b. 令 final[u]=true（u 的最短路径已确定）
   c. **松弛操作**：对 u 的每个邻接点 v，如果 dist[u]+w(u,v) < dist[v]，则更新 dist[v]=dist[u]+w(u,v)，path[v]=u

## 松弛（Relaxation）的含义

"松弛"是最短路径算法的核心操作：

> 如果经过 u 到达 v 比当前已知的路径更短，就更新 v 的最短路径估计。

\`\`\`
if (dist[u] + w(u,v) < dist[v]) {
    dist[v] = dist[u] + w(u,v);
    path[v] = u;
}
\`\`\``,
      },
      {
        id: "walkthrough",
        title: "手算过程详解（dist[]更新表）",
        type: "walkthrough",
        content: `以下面的有向带权图为例（5个顶点 V0~V4）：

\`\`\`
边及权值（有向）：
V0→V1=10, V0→V3=30, V0→V4=100
V1→V2=50
V2→V4=10
V3→V2=20, V3→V4=60
\`\`\`

源点为 V0，求 V0 到所有顶点的最短路径。

**dist[] 更新表（考研必考格式）：**

| 步骤 | 选中顶点 | dist[V0] | dist[V1] | dist[V2] | dist[V3] | dist[V4] |
|------|----------|----------|----------|----------|----------|----------|
| 初始 | - | 0✓ | 10 | ∞ | 30 | 100 |
| 1 | V1 | 0✓ | 10✓ | 60 | 30 | 100 |
| 2 | V3 | 0✓ | 10✓ | 50 | 30✓ | 90 |
| 3 | V2 | 0✓ | 10✓ | 50✓ | 30✓ | 60 |
| 4 | V4 | 0✓ | 10✓ | 50✓ | 30✓ | 60✓ |

（✓ 表示该顶点的最短路径已确定）`,
        steps: [
          {
            description: "初始化：dist[V0]=0(源点)，dist[V1]=10(直接边)，dist[V2]=∞(无直接边)，dist[V3]=30(直接边)，dist[V4]=100(直接边)。final[V0]=true",
            state: {
              dist: { V0: "0✓", V1: 10, V2: "∞", V3: 30, V4: 100 },
              path: { V1: "V0", V3: "V0", V4: "V0" },
              final: { V0: true, V1: false, V2: false, V3: false, V4: false },
            },
          },
          {
            description: "第1轮：未确定顶点中 dist 最小的是 V1(dist=10)。确定 V1，松弛 V1 的邻接点：V2: dist[V1]+50=60 < ∞，更新 dist[V2]=60",
            state: {
              dist: { V0: "0✓", V1: "10✓", V2: 60, V3: 30, V4: 100 },
              path: { V1: "V0", V2: "V1", V3: "V0", V4: "V0" },
              final: { V0: true, V1: true, V2: false, V3: false, V4: false },
              relaxation: "dist[V2]: ∞ → 60 (经V1)",
            },
          },
          {
            description: "第2轮：未确定顶点中 dist 最小的是 V3(dist=30)。确定 V3，松弛：V2: 30+20=50<60，更新；V4: 30+60=90<100，更新",
            state: {
              dist: { V0: "0✓", V1: "10✓", V2: 50, V3: "30✓", V4: 90 },
              path: { V1: "V0", V2: "V3", V3: "V0", V4: "V3" },
              final: { V0: true, V1: true, V2: false, V3: true, V4: false },
              relaxation: "dist[V2]: 60→50 (经V3), dist[V4]: 100→90 (经V3)",
            },
          },
          {
            description: "第3轮：未确定顶点中 dist 最小的是 V2(dist=50)。确定 V2，松弛：V4: 50+10=60<90，更新 dist[V4]=60",
            state: {
              dist: { V0: "0✓", V1: "10✓", V2: "50✓", V3: "30✓", V4: 60 },
              path: { V1: "V0", V2: "V3", V3: "V0", V4: "V2" },
              final: { V0: true, V1: true, V2: true, V3: true, V4: false },
              relaxation: "dist[V4]: 90→60 (经V2)",
            },
          },
          {
            description: "第4轮：只剩 V4(dist=60)。确定 V4。所有顶点已确定，算法结束",
            state: {
              dist: { V0: "0✓", V1: "10✓", V2: "50✓", V3: "30✓", V4: "60✓" },
              path: { V1: "V0", V2: "V3", V3: "V0", V4: "V2" },
              final: { V0: true, V1: true, V2: true, V3: true, V4: true },
              shortestPaths: {
                "V0→V1": "V0→V1, 长度10",
                "V0→V2": "V0→V3→V2, 长度50",
                "V0→V3": "V0→V3, 长度30",
                "V0→V4": "V0→V3→V2→V4, 长度60",
              },
            },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "Dijkstra算法伪代码",
        type: "detail",
        content: `\`\`\`
void Dijkstra(MGraph G, int s) {
    // 初始化
    for (int i = 0; i < G.vexnum; i++) {
        dist[i] = G.Edge[s][i];  // 源点到各顶点的直接距离
        final[i] = false;
        if (dist[i] < INF)
            path[i] = s;
        else
            path[i] = -1;
    }
    dist[s] = 0;
    final[s] = true;

    // 循环 n-1 次，每次确定一个顶点
    for (int i = 1; i < G.vexnum; i++) {
        // 1. 找 dist 最小的未确定顶点
        int min = INF, u = -1;
        for (int j = 0; j < G.vexnum; j++) {
            if (!final[j] && dist[j] < min) {
                min = dist[j];
                u = j;
            }
        }

        if (u == -1) break;  // 剩余顶点不可达
        final[u] = true;     // 2. 确定 u

        // 3. 用 u 松弛其邻接点
        for (int v = 0; v < G.vexnum; v++) {
            if (!final[v] && G.Edge[u][v] < INF) {
                if (dist[u] + G.Edge[u][v] < dist[v]) {
                    dist[v] = dist[u] + G.Edge[u][v];
                    path[v] = u;
                }
            }
        }
    }
}
\`\`\`

**复杂度分析：**
- 外层循环 |V|-1 次，内层两个循环各 |V| 次
- 时间复杂度：**O(|V|²)**
- 用最小堆优化：O((|V|+|E|)log|V|)，适合稀疏图
- 空间复杂度：O(|V|)

**路径回溯**：从终点 v 开始，沿 path[] 回溯到源点 s，即可得到最短路径。`,
      },
      {
        id: "comparison",
        title: "最短路径算法对比",
        type: "comparison",
        content: `| 对比维度 | Dijkstra | Floyd | Bellman-Ford |
|----------|----------|-------|--------------|
| 问题类型 | 单源最短路径 | 所有顶点对最短路径 | 单源最短路径 |
| 负权边 | ❌ 不能处理 | ✅ 能处理 | ✅ 能处理 |
| 负权环 | ❌ | 能检测 | 能检测 |
| 时间复杂度 | O(\\|V\\|²) | O(\\|V\\|³) | O(\\|V\\|·\\|E\\|) |
| 思想 | 贪心 | 动态规划 | 逐步松弛 |

**Dijkstra vs Prim（代码结构对比）：**

两者代码几乎一样，区别在于：
- Prim：选 lowcost[v] 最小的（v 到集合 U 的最小边权）
- Dijkstra：选 dist[v] 最小的（源点到 v 的最短路径长度）
- Prim 更新：lowcost[v] = min(lowcost[v], w(u,v))
- Dijkstra 更新：dist[v] = min(dist[v], dist[u] + w(u,v))

**关键区别**：Dijkstra 的 dist 是累积值（从源点开始累加），Prim 的 lowcost 是单条边的权值。`,
      },
      {
        id: "pitfalls",
        title: "考研易错点",
        type: "detail",
        content: `1. **负权边问题**：Dijkstra **不能**处理负权边！原因：贪心策略假设"当前 dist 最小的顶点不可能被更新"，但负权边可能使已确定的顶点被进一步缩短。

   反例：V0→V1=1, V0→V2=5, V2→V1=-10。Dijkstra 先确定 V1(dist=1)，但实际最短路径是 V0→V2→V1=-5。

2. **dist[] 表的填写**：考研大题常要求画出每一轮的 dist[] 表。注意：
   - 每轮只更新被选中顶点的邻接点
   - 已确定（final=true）的顶点不再更新
   - 标记哪个顶点被选中（打✓）

3. **路径回溯**：path[] 记录的是前驱，要从终点往回追溯。例如 path=[-, 0, 3, 0, 2]，求 V0→V4 的路径：V4←V2←V3←V0，即 V0→V3→V2→V4。

4. **有向图 vs 无向图**：Dijkstra 对有向图和无向图都适用。无向图的邻接矩阵是对称的，有向图不对称。

5. **不可达顶点**：如果某顶点从源点不可达，其 dist 值始终为 ∞。

6. **与BFS的关系**：当所有边权都为1时，Dijkstra 退化为 BFS。`,
      },
    ],
    exercises: [
      {
        id: "dijkstra-ex-01",
        title: "手算Dijkstra（画dist表）",
        description: "有向图：顶点A,B,C,D,E。边：A→B=2, A→C=5, B→C=2, B→D=6, C→D=1, C→E=8, D→E=3。以A为源点，用Dijkstra算法求最短路径，画出完整的dist[]更新表。",
        difficulty: "medium",
        hints: [
          "初始：dist[A]=0, dist[B]=2, dist[C]=5, dist[D]=∞, dist[E]=∞",
          "第1轮选B(dist=2)，松弛B的邻接点C和D",
          "经B到C: 2+2=4<5，更新dist[C]=4",
        ],
        referenceSolution: "dist表：初始[0✓,2,5,∞,∞] → 选B[0✓,2✓,4,8,∞] → 选C[0✓,2✓,4✓,5,12] → 选D[0✓,2✓,4✓,5✓,8] → 选E[0✓,2✓,4✓,5✓,8✓]。最短路径：A→B=2, A→C=A→B→C=4, A→D=A→B→C→D=5, A→E=A→B→C→D→E=8。",
      },
      {
        id: "dijkstra-ex-02",
        title: "Dijkstra失败的反例",
        description: "构造一个含负权边的有向图，说明Dijkstra算法得到错误结果。给出正确的最短路径。",
        difficulty: "hard",
        hints: [
          "需要一条负权边使得绕路比直达更短",
          "Dijkstra会先确定直达的顶点，但负权边可能提供更短的绕路",
          "三个顶点就够了",
        ],
        referenceSolution: "图：A→B=1, A→C=3, C→B=-5。Dijkstra从A出发：dist[B]=1,dist[C]=3，先确定B(dist=1)。但实际A→C→B=3+(-5)=-2<1。Dijkstra确定B后不会再更新B，得到错误结果dist[B]=1，正确答案应为-2。原因：贪心假设'dist最小的顶点已是最优'在负权边下不成立。",
      },
    ],
  },
  // ============================================================
  // 5. Floyd算法（所有顶点对最短路径）
  // ============================================================
  {
    id: "floyd",
    title: "Floyd算法",
    brief: "基于动态规划，逐步引入中间顶点来更新所有顶点对之间的最短路径",
    keyTakeaways: [
      "Floyd 求所有顶点对之间的最短路径，结果是一个距离矩阵",
      "核心思想：动态规划，逐步允许经过更多的中间顶点",
      "三重循环：外层枚举中间顶点 k，内层枚举起点 i 和终点 j",
      "时间复杂度 O(|V|³)，空间复杂度 O(|V|²)",
      "可以处理负权边，但不能处理负权环",
      "代码极其简洁（三重循环+一个判断），是考研代码题的常客",
    ],
    relatedLessons: ["dijkstra", "graph-traversal"],
    sections: [
      {
        id: "motivation",
        title: "为什么需要Floyd算法？",
        type: "motivation",
        content: `**问题**：求图中任意两个顶点之间的最短路径。

**方案1**：对每个顶点调用一次 Dijkstra → 时间 O(|V|³)，但不能处理负权边。

**方案2**：Floyd 算法 → 同样 O(|V|³)，但：
- 代码极其简洁（核心只有5行）
- 能处理负权边
- 直接得到所有顶点对的结果

**Floyd 的 DP 思想**：

定义 D^(k)[i][j] = 从 i 到 j，只允许经过顶点 {V0, V1, ..., Vk} 作为中间顶点的最短路径长度。

- D^(-1)[i][j] = 边 (i,j) 的权值（不经过任何中间顶点）
- D^(0)[i][j] = 允许经过 V0 的最短路径
- D^(1)[i][j] = 允许经过 V0, V1 的最短路径
- ...
- D^(n-1)[i][j] = 允许经过所有顶点的最短路径 = 最终答案

**状态转移**：
> D^(k)[i][j] = min(D^(k-1)[i][j], D^(k-1)[i][k] + D^(k-1)[k][j])

含义：从 i 到 j，要么不经过 Vk（保持原值），要么经过 Vk（i→k + k→j）。`,
      },
      {
        id: "concept",
        title: "算法核心",
        type: "concept",
        content: `## 核心代码（极其简洁）

\`\`\`
// 初始化 D[][] 为邻接矩阵
for (int k = 0; k < n; k++)          // 枚举中间顶点
    for (int i = 0; i < n; i++)      // 枚举起点
        for (int j = 0; j < n; j++)  // 枚举终点
            if (D[i][k] + D[k][j] < D[i][j])
                D[i][j] = D[i][k] + D[k][j];
\`\`\`

**循环顺序至关重要**：k 必须在最外层！

为什么？因为 D^(k) 依赖于 D^(k-1)，必须先完成所有 (i,j) 对在第 k-1 轮的计算，才能进行第 k 轮。

## 路径记录

用 path[i][j] 记录从 i 到 j 的最短路径上，j 的前驱顶点：

\`\`\`
// 初始化
path[i][j] = i;  // 如果有直接边
path[i][j] = -1; // 如果无直接边

// 更新时
if (D[i][k] + D[k][j] < D[i][j]) {
    D[i][j] = D[i][k] + D[k][j];
    path[i][j] = path[k][j];  // j的前驱改为k到j路径上的前驱
}
\`\`\``,
      },
      {
        id: "walkthrough",
        title: "手算过程：矩阵演化",
        type: "walkthrough",
        content: `以下面的有向带权图为例（4个顶点 V0~V3）：

\`\`\`
邻接矩阵（∞表示无直接边）：
     V0   V1   V2   V3
V0 [  0    5    ∞    7  ]
V1 [  ∞    0    4    2  ]
V2 [  3    3    0    2  ]
V3 [  ∞    ∞    1    0  ]
\`\`\`

逐步引入中间顶点，观察 D 矩阵的变化：`,
        steps: [
          {
            description: "D^(-1)：初始矩阵（不经过任何中间顶点），即邻接矩阵本身",
            pseudocode: "D[-1][i][j] = Edge[i][j]",
            state: {
              matrix: [
                [0, 5, "∞", 7],
                ["∞", 0, 4, 2],
                [3, 3, 0, 2],
                ["∞", "∞", 1, 0],
              ],
              labels: ["V0", "V1", "V2", "V3"],
              description: "初始距离矩阵",
            },
          },
          {
            description: "D^(0)：允许经过 V0 作为中间顶点。检查所有(i,j)对：D[i][0]+D[0][j] < D[i][j]？V2→V0→V1=3+5=8>3不更新；V2→V0→V3=3+7=10>2不更新。无更新",
            pseudocode: "k=0: 对所有i,j检查 D[i][0]+D[0][j] < D[i][j]",
            state: {
              matrix: [
                [0, 5, "∞", 7],
                ["∞", 0, 4, 2],
                [3, 3, 0, 2],
                ["∞", "∞", 1, 0],
              ],
              k: 0,
              changes: "无变化（经V0的路径都不比原来短）",
            },
          },
          {
            description: "D^(1)：允许经过 V0,V1。检查经V1的路径：V0→V1→V2=5+4=9<∞✓更新；V0→V1→V3=5+2=7=7不更新；V3→V1无边跳过",
            pseudocode: "k=1: D[0][2]=min(∞, D[0][1]+D[1][2])=min(∞,5+4)=9",
            state: {
              matrix: [
                [0, 5, 9, 7],
                ["∞", 0, 4, 2],
                [3, 3, 0, 2],
                ["∞", "∞", 1, 0],
              ],
              k: 1,
              changes: "D[0][2]: ∞→9（V0→V1→V2）",
            },
          },
          {
            description: "D^(2)：允许经过 V0,V1,V2。检查经V2的路径：V0→V2→V0=9+3=12>0不变；V0→V2→V1=9+3=12>5不变；V0→V2→V3=9+2=11>7不变；V1→V2→V0=4+3=7<∞✓；V1→V2→V3=4+2=6>2不变；V3→V2→V0=1+3=4<∞✓；V3→V2→V1=1+3=4<∞✓",
            pseudocode: "k=2: D[1][0]=7, D[3][0]=4, D[3][1]=4",
            state: {
              matrix: [
                [0, 5, 9, 7],
                [7, 0, 4, 2],
                [3, 3, 0, 2],
                [4, 4, 1, 0],
              ],
              k: 2,
              changes: "D[1][0]: ∞→7（V1→V2→V0）; D[3][0]: ∞→4（V3→V2→V0）; D[3][1]: ∞→4（V3→V2→V1）",
            },
          },
          {
            description: "D^(3)：允许经过所有顶点（V0,V1,V2,V3）。检查经V3的路径：V0→V3→V2=7+1=8<9✓；V1→V3→V2=2+1=3<4✓；V1→V3→V0: 需要D[3][0]=4，2+4=6<7✓；其他不变。这就是最终结果",
            pseudocode: "k=3: D[0][2]=8, D[1][2]=3, D[1][0]=6",
            state: {
              matrix: [
                [0, 5, 8, 7],
                [6, 0, 3, 2],
                [3, 3, 0, 2],
                [4, 4, 1, 0],
              ],
              k: 3,
              changes: "D[0][2]: 9→8（V0→V3→V2）; D[1][2]: 4→3（V1→V3→V2）; D[1][0]: 7→6（V1→V3→V2→V0）",
              note: "最终矩阵：D[i][j]即为Vi到Vj的最短路径长度",
            },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "完整伪代码",
        type: "detail",
        content: `\`\`\`
void Floyd(MGraph G) {
    int D[N][N], path[N][N];

    // 初始化
    for (int i = 0; i < G.vexnum; i++)
        for (int j = 0; j < G.vexnum; j++) {
            D[i][j] = G.Edge[i][j];
            if (i != j && G.Edge[i][j] < INF)
                path[i][j] = i;    // i到j有直接边，前驱为i
            else
                path[i][j] = -1;   // 无路径
        }

    // 核心：三重循环
    for (int k = 0; k < G.vexnum; k++)
        for (int i = 0; i < G.vexnum; i++)
            for (int j = 0; j < G.vexnum; j++)
                if (D[i][k] + D[k][j] < D[i][j]) {
                    D[i][j] = D[i][k] + D[k][j];
                    path[i][j] = path[k][j];
                }
}

// 输出从i到j的最短路径
void PrintPath(int path[][], int i, int j) {
    if (path[i][j] == -1) return;  // 无路径
    PrintPath(path, i, path[i][j]); // 递归打印前面的路径
    print(j);
}
\`\`\`

**复杂度：**
- 时间：**O(|V|³)**（三重循环）
- 空间：**O(|V|²)**（D矩阵和path矩阵）

**注意**：Floyd 可以在原矩阵上直接更新（不需要额外的 D^(k-1) 副本），因为 D[i][k] 和 D[k][j] 在第 k 轮不会被修改（D[k][k]=0，经过自己不会变短）。`,
      },
      {
        id: "comparison",
        title: "Floyd vs 多次Dijkstra",
        type: "comparison",
        content: `| 对比维度 | Floyd | 对每个顶点调用Dijkstra |
|----------|-------|------------------------|
| 时间复杂度 | O(\\|V\\|³) | O(\\|V\\|³)（朴素Dijkstra） |
| 负权边 | ✅ 能处理 | ❌ 不能处理 |
| 代码复杂度 | 极简（5行核心） | 较复杂 |
| 空间 | O(\\|V\\|²) | O(\\|V\\|) 每次 |
| 适用场景 | 稠密图、需要所有对 | 稀疏图、只需部分对 |

**Floyd 的优势**：
1. 代码极其简洁，不容易写错
2. 能处理负权边
3. 一次运行得到所有顶点对的结果

**Floyd 的劣势**：
1. 时间固定 O(|V|³)，不能利用稀疏性
2. 空间 O(|V|²)，顶点多时内存开销大

**考研选择**：
- 求所有顶点对最短路径 → Floyd
- 求单源最短路径（无负权边）→ Dijkstra
- 求单源最短路径（有负权边）→ Bellman-Ford`,
      },
      {
        id: "pitfalls",
        title: "考研易错点",
        type: "detail",
        content: `1. **循环顺序**：k 必须在最外层！如果把 k 放在内层，结果是错误的。这是最常见的代码错误。

   错误写法：for(i) for(j) for(k) — 这不是 Floyd！

2. **矩阵更新的理解**：D^(k) 可以在原矩阵上直接更新，不需要保存 D^(k-1) 的副本。原因：第 k 轮中 D[i][k] 和 D[k][j] 不会被修改（因为 D[k][k]=0，经过 k 到 k 再到 j 不会比直接 k 到 j 更短）。

3. **负权环检测**：如果 D[i][i] < 0，说明存在经过 i 的负权环。Floyd 不能正确处理含负权环的图。

4. **手算时的技巧**：
   - 每轮只需要检查第 k 行和第 k 列"交叉"出的位置
   - D[i][k] 和 D[k][j]（第 k 行和第 k 列）本轮不变
   - 对角线 D[i][i] 始终为 0（无负权环时）

5. **path 矩阵的含义**：path[i][j] 记录的是 i 到 j 最短路径上 j 的直接前驱，不是中间经过的某个顶点。回溯路径时需要递归使用 path。

6. **∞ 的处理**：编程时用一个大数表示 ∞，注意两个 ∞ 相加可能溢出。判断时应先检查 D[i][k] 和 D[k][j] 是否为 ∞。`,
      },
    ],
    exercises: [
      {
        id: "floyd-ex-01",
        title: "手算Floyd矩阵演化",
        description: "有向图3个顶点(A,B,C)，邻接矩阵：A→B=2, A→C=6, B→A=∞, B→C=3, C→A=7, C→B=∞。写出D^(0), D^(1), D^(2)矩阵。",
        difficulty: "medium",
        hints: [
          "D^(-1)就是邻接矩阵：[[0,2,6],[∞,0,3],[7,∞,0]]",
          "D^(0)：允许经过A，检查B→A→C和C→A→B",
          "注意B→A=∞，所以经A的路径对B出发的无效",
        ],
        referenceSolution: "D^(-1)=[[0,2,6],[∞,0,3],[7,∞,0]]。D^(0)(经A)：C→A→B=7+2=9<∞，更新D[2][1]=9。D^(0)=[[0,2,6],[∞,0,3],[7,9,0]]。D^(1)(经B)：A→B→C=2+3=5<6，更新D[0][2]=5；C→B→无新路径（B→A=∞）。D^(1)=[[0,2,5],[∞,0,3],[7,9,0]]。D^(2)(经C)：A→C→A=5+7=12>0不变；A→C→B=5+9=14>2不变（注意用当前D^(1)的值）；B→C→A=3+7=10<∞✓；B→C→B=3+9=12>0不变。D^(2)=[[0,2,5],[10,0,3],[7,9,0]]。",
      },
      {
        id: "floyd-ex-02",
        title: "Floyd路径回溯",
        description: "根据上题的最终D矩阵和path矩阵，写出B到A的最短路径及长度。",
        difficulty: "easy",
        hints: [
          "D[B][A]=10，说明B到A最短路径长度为10",
          "path[B][A]在D^(2)中被更新为C（因为B→C→A）",
          "再查path[B][C]=B（直接边），所以路径是B→C→A",
        ],
        referenceSolution: "B到A最短路径长度=10。回溯：path[B][A]=C（在k=2时更新），path[B][C]=B（直接边）。所以路径为 B→C→A，长度=3+7=10。",
      },
    ],
  },
  // ============================================================
  // 6. 拓扑排序
  // ============================================================
  {
    id: "topological-sort",
    title: "拓扑排序",
    brief: "对有向无环图（DAG）的顶点进行线性排序，使得对每条有向边(u,v)，u都排在v前面",
    keyTakeaways: [
      "拓扑排序只适用于有向无环图（DAG）",
      "如果图中有环，则不存在拓扑排序（可用此性质判断有向图是否有环）",
      "拓扑排序的结果不唯一",
      "入度法（Kahn算法）：每次选入度为0的顶点，用队列实现",
      "DFS法：对DFS的完成顺序取逆序即为拓扑序列",
      "时间复杂度 O(|V|+|E|)",
      "应用：任务调度、课程安排、编译依赖",
    ],
    relatedLessons: ["graph-traversal"],
    sections: [
      {
        id: "motivation",
        title: "为什么需要拓扑排序？",
        type: "motivation",
        content: `**问题**：大学选课有先修关系——学"数据结构"之前必须先学"C语言"，学"操作系统"之前必须先学"数据结构"和"计算机组成原理"。如何安排一个合理的学习顺序，使得每门课的先修课都排在它前面？

这就是拓扑排序问题：
- 顶点 = 课程
- 有向边 (u,v) = u 是 v 的先修课
- 拓扑排序 = 一个合法的学习顺序

**前提条件**：图必须是 DAG（有向无环图）。如果有环（A要求先学B，B要求先学A），则不存在合法顺序。

**拓扑排序的本质**：将偏序关系扩展为全序关系。`,
      },
      {
        id: "concept",
        title: "入度法（Kahn算法）",
        type: "concept",
        content: `## 核心思想

入度为 0 的顶点没有前驱约束，可以排在最前面。

**算法步骤**：
1. 计算所有顶点的入度
2. 将所有入度为 0 的顶点入队
3. 循环：
   a. 出队一个顶点 v，输出 v
   b. 将 v 的所有邻接点的入度减 1
   c. 如果某邻接点入度变为 0，将其入队
4. 如果输出的顶点数 < |V|，说明图中有环

## 为什么能检测环？

如果有环，环上的顶点入度永远不会变为 0（互相依赖），所以永远不会被输出。最终输出顶点数 < |V|。

## 拓扑排序不唯一

当同时有多个入度为 0 的顶点时，选哪个都行，不同选择导致不同的拓扑序列。

如果要求字典序最小的拓扑序列，用最小堆（优先队列）代替普通队列。`,
      },
      {
        id: "walkthrough",
        title: "手算过程详解",
        type: "walkthrough",
        content: `以下面的 DAG 为例（6个顶点 V0~V5）：

\`\`\`
有向边：
V0→V1, V0→V2, V0→V3
V1→V2, V1→V4
V2→V4, V2→V5
V3→V5

各顶点入度：
V0: 0, V1: 1, V2: 2, V3: 1, V4: 2, V5: 2
\`\`\`

用入度法进行拓扑排序：`,
        steps: [
          {
            description: "初始化：计算各顶点入度。入度为0的顶点：V0。将V0入队",
            state: {
              inDegree: { V0: 0, V1: 1, V2: 2, V3: 1, V4: 2, V5: 2 },
              queue: ["V0"],
              output: [],
              count: 0,
            },
          },
          {
            description: "V0出队，输出V0。V0的邻接点V1、V2、V3入度各减1。V1入度变为0，入队",
            state: {
              inDegree: { V0: "-", V1: 0, V2: 1, V3: 0, V4: 2, V5: 2 },
              queue: ["V1", "V3"],
              output: ["V0"],
              count: 1,
              note: "V1: 1→0(入队), V2: 2→1, V3: 1→0(入队)",
            },
          },
          {
            description: "V1出队，输出V1。V1的邻接点V2、V4入度各减1。V2入度变为0，入队",
            state: {
              inDegree: { V0: "-", V1: "-", V2: 0, V3: 0, V4: 1, V5: 2 },
              queue: ["V3", "V2"],
              output: ["V0", "V1"],
              count: 2,
              note: "V2: 1→0(入队), V4: 2→1",
            },
          },
          {
            description: "V3出队，输出V3。V3的邻接点V5入度减1",
            state: {
              inDegree: { V0: "-", V1: "-", V2: 0, V3: "-", V4: 1, V5: 1 },
              queue: ["V2"],
              output: ["V0", "V1", "V3"],
              count: 3,
              note: "V5: 2→1",
            },
          },
          {
            description: "V2出队，输出V2。V2的邻接点V4、V5入度各减1。V4入度变为0入队，V5入度变为0入队",
            state: {
              inDegree: { V0: "-", V1: "-", V2: "-", V3: "-", V4: 0, V5: 0 },
              queue: ["V4", "V5"],
              output: ["V0", "V1", "V3", "V2"],
              count: 4,
              note: "V4: 1→0(入队), V5: 1→0(入队)",
            },
          },
          {
            description: "V4出队，输出V4。V4无邻接点。然后V5出队，输出V5。队列为空，输出6个顶点=|V|，排序成功",
            state: {
              inDegree: { V0: "-", V1: "-", V2: "-", V3: "-", V4: "-", V5: "-" },
              queue: [],
              output: ["V0", "V1", "V3", "V2", "V4", "V5"],
              count: 6,
              note: "输出顶点数=6=|V|，无环，拓扑排序成功",
            },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "拓扑排序伪代码",
        type: "detail",
        content: `\`\`\`
bool TopologicalSort(Graph G, int topo[]) {
    // 1. 计算所有顶点的入度
    int inDegree[MAX_V] = {0};
    for (int i = 0; i < G.vexnum; i++)
        for (每个从i出发的边(i,j))
            inDegree[j]++;

    // 2. 将入度为0的顶点入队
    InitQueue(Q);
    for (int i = 0; i < G.vexnum; i++)
        if (inDegree[i] == 0)
            EnQueue(Q, i);

    // 3. BFS式处理
    int count = 0;  // 已输出顶点数
    while (!isEmpty(Q)) {
        DeQueue(Q, v);
        topo[count++] = v;  // 输出顶点v

        // v的所有邻接点入度减1
        for (w = FirstNeighbor(G, v); w >= 0; w = NextNeighbor(G, v, w)) {
            inDegree[w]--;
            if (inDegree[w] == 0)
                EnQueue(Q, w);
        }
    }

    // 4. 判断是否有环
    return (count == G.vexnum);  // true=无环，false=有环
}
\`\`\`

**复杂度分析：**
- 计算入度：O(|V|+|E|)（遍历所有边）
- 主循环：每个顶点入队出队一次 O(|V|)，每条边被检查一次 O(|E|)
- 总时间复杂度：**O(|V|+|E|)**
- 空间复杂度：O(|V|)（队列 + inDegree数组）`,
      },
      {
        id: "dfs-method",
        title: "DFS法拓扑排序",
        type: "detail",
        content: `## DFS 逆后序法

除了入度法，还可以用 DFS 实现拓扑排序：

**原理**：对 DAG 进行 DFS，顶点的完成时间（退出递归的时间）的逆序就是一个拓扑序列。

\`\`\`
void DFS_Topo(Graph G, int v, bool visited[], Stack &S) {
    visited[v] = true;
    for (w = FirstNeighbor(G, v); w >= 0; w = NextNeighbor(G, v, w))
        if (!visited[w])
            DFS_Topo(G, w, visited, S);
    Push(S, v);  // v的所有后继都已处理完，v入栈
}

void TopologicalSort_DFS(Graph G) {
    Stack S;
    bool visited[MAX_V] = {false};
    for (int i = 0; i < G.vexnum; i++)
        if (!visited[i])
            DFS_Topo(G, i, visited, S);
    // 栈中从顶到底就是拓扑序列
    while (!isEmpty(S))
        Pop(S, v); print(v);
}
\`\`\`

**为什么正确？** DFS 中，如果有边 u→v，那么 v 一定比 u 先完成（先退出递归）。所以逆序后 u 排在 v 前面，满足拓扑序的要求。

**考研中一般考入度法**，DFS法作为了解即可。`,
      },
      {
        id: "comparison",
        title: "两种拓扑排序方法对比",
        type: "comparison",
        content: `| 对比维度 | 入度法（Kahn） | DFS逆后序法 |
|----------|----------------|-------------|
| 数据结构 | 队列 + inDegree数组 | 递归栈 + visited数组 |
| 时间复杂度 | O(\\|V\\|+\\|E\\|) | O(\\|V\\|+\\|E\\|) |
| 检测环 | 输出顶点数 < \\|V\\| | 发现回边（back edge） |
| 直观性 | 更直观（逐步删除入度为0的点） | 较抽象 |
| 考研常考 | ✅ 主要考法 | 了解即可 |

**拓扑排序的应用：**
1. **判断有向图是否有环**：能完成拓扑排序 ↔ 无环
2. **任务调度**：确定任务执行顺序
3. **编译依赖**：确定源文件编译顺序
4. **关键路径**：AOE网中求关键路径的前提是拓扑排序

**与其他图算法的关系：**
- 拓扑排序是求关键路径（AOE网）的基础
- DFS 可以同时完成拓扑排序
- 拓扑排序可以用来优化某些 DP 问题（按拓扑序计算）`,
      },
      {
        id: "pitfalls",
        title: "考研易错点",
        type: "detail",
        content: `1. **前提条件**：拓扑排序只能用于 DAG（有向无环图）。无向图没有拓扑排序的概念。

2. **结果不唯一**：同一个 DAG 可能有多个合法的拓扑序列。考研选择题可能问"下列哪个是合法的拓扑序列"，需要逐一验证每条边的方向约束。

3. **验证拓扑序列的方法**：对于给定序列，检查图中每条边 (u,v)，u 是否都排在 v 前面。如果有任何一条边违反，则不是合法拓扑序列。

4. **入度法中队列的选择**：
   - 普通队列：得到某一个合法拓扑序列
   - 优先队列（最小堆）：得到字典序最小的拓扑序列
   - 栈：得到某一个合法拓扑序列（但不是字典序最小的）

5. **环的检测**：如果拓扑排序过程中，队列为空但还有顶点未输出（count < |V|），说明剩余顶点都在环上（入度永远不为0）。

6. **逆拓扑排序**：将所有边反向后做拓扑排序，或者用出度为0的顶点开始。考研偶尔会考。

7. **时间复杂度**：O(|V|+|E|)，不是 O(|V|²)。因为用邻接表存储，每条边只被访问一次。`,
      },
    ],
    exercises: [
      {
        id: "topo-ex-01",
        title: "手算拓扑排序",
        description: "有向图：顶点1~6，边：1→2, 1→3, 2→4, 3→4, 3→5, 4→6, 5→6。用入度法求一个拓扑序列，并说明是否还有其他合法序列。",
        difficulty: "easy",
        hints: [
          "先算入度：1的入度0，2的入度1，3的入度1，4的入度2，5的入度1，6的入度2",
          "初始只有顶点1入度为0",
          "1输出后，2和3入度变为0，可以选任一个先输出",
        ],
        referenceSolution: "入度：1→0, 2→1, 3→1, 4→2, 5→1, 6→2。过程：①输出1(入度0)，2和3入度减1变为0 ②输出2(选2先)，4入度减1变为1 ③输出3，4和5入度减1，4变为0，5变为0 ④输出4，6入度减1变为1 ⑤输出5，6入度减1变为0 ⑥输出6。序列：1,2,3,4,5,6。其他合法序列如：1,3,2,5,4,6 或 1,3,5,2,4,6 等（步骤②中选3先于2即可得到不同序列）。",
      },
      {
        id: "topo-ex-02",
        title: "判断拓扑序列合法性",
        description: "有向图：边A→B, A→C, B→D, C→D, C→E, D→E。判断以下哪些是合法的拓扑序列：(1)A,B,C,D,E (2)A,C,B,E,D (3)A,C,B,D,E",
        difficulty: "medium",
        hints: [
          "对每个序列，检查图中每条边(u,v)中u是否排在v前面",
          "序列(2)中E排在D前面，但有边D→E",
          "逐条边验证即可",
        ],
        referenceSolution: "(1)A,B,C,D,E：检查所有边——A→B✓, A→C✓, B→D✓, C→D✓, C→E✓, D→E✓。合法。(2)A,C,B,E,D：检查D→E，D排在E后面✗。不合法。(3)A,C,B,D,E：A→B✓, A→C✓, B→D✓, C→D✓, C→E✓, D→E✓。合法。答案：(1)和(3)合法，(2)不合法。",
      },
      {
        id: "topo-ex-03",
        title: "用拓扑排序判断有环",
        description: "有向图：顶点A,B,C,D，边：A→B, B→C, C→D, D→B。用入度法进行拓扑排序，说明为什么能检测出环。",
        difficulty: "easy",
        hints: [
          "计算入度：A=0, B=2, C=1, D=1",
          "只有A入度为0，输出A后B入度变为1",
          "此后没有入度为0的顶点了",
        ],
        referenceSolution: "入度：A=0, B=2(来自A和D), C=1(来自B), D=1(来自C)。过程：A入队出队，输出A，B入度减1变为1。此时队列为空，但只输出了1个顶点（<4=|V|）。B,C,D形成环(B→C→D→B)，它们的入度永远不会变为0。结论：输出顶点数1<4，图中存在环。环上的顶点互相依赖，入度无法降为0。",
      },
    ],
  },
];
