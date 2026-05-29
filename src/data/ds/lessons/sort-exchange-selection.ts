import { Lesson } from "@/types";

export const sortExchangeLessons: Lesson[] = [
  {
    id: "bubble-sort",
    title: "冒泡排序",
    brief: "通过相邻元素两两比较交换，每趟将最大元素冒泡到末尾",
    keyTakeaways: [
      "每趟确定一个元素的最终位置（最大的沉底）",
      "最好 O(n)（已有序+设置标志位），最坏/平均 O(n²)",
      "稳定排序",
      "可以提前终止：某趟没有交换说明已有序",
    ],
    relatedLessons: ["quick-sort"],
    sections: [
      {
        id: "motivation",
        title: "最朴素的排序思想",
        type: "motivation",
        content: `冒泡排序的思想极其简单：反复扫描序列，每次比较相邻两个元素，如果逆序就交换。

一趟扫描下来，最大的元素一定会被交换到最后一个位置（像气泡一样"浮"到顶端）。

然后对前 n-1 个元素重复这个过程。

虽然效率不高，但它是理解交换类排序的基础，也是快速排序的前身。`,
      },
      {
        id: "walkthrough",
        title: "执行过程",
        type: "walkthrough",
        content: `以序列 \`[5, 3, 4, 2, 1]\` 为例，逐步展示冒泡过程：`,
        steps: [
          {
            description: "初始数组，开始第1趟冒泡",
            state: { array: [5, 3, 4, 2, 1], sorted: [] },
          },
          {
            description: "比较 A[0]=5 和 A[1]=3，5>3，交换",
            state: { array: [5, 3, 4, 2, 1], comparing: [0, 1], swapping: [0, 1], sorted: [] },
          },
          {
            description: "交换后继续，比较 A[1]=5 和 A[2]=4，5>4，交换",
            state: { array: [3, 5, 4, 2, 1], comparing: [1, 2], swapping: [1, 2], sorted: [] },
          },
          {
            description: "交换后继续，比较 A[2]=5 和 A[3]=2，5>2，交换",
            state: { array: [3, 4, 5, 2, 1], comparing: [2, 3], swapping: [2, 3], sorted: [] },
          },
          {
            description: "交换后继续，比较 A[3]=5 和 A[4]=1，5>1，交换",
            state: { array: [3, 4, 2, 5, 1], comparing: [3, 4], swapping: [3, 4], sorted: [] },
          },
          {
            description: "第1趟结束，最大值5已到末尾（确定最终位置）",
            state: { array: [3, 4, 2, 1, 5], sorted: [4] },
          },
          {
            description: "第2趟：比较 A[0]=3 和 A[1]=4，3<4，不交换",
            state: { array: [3, 4, 2, 1, 5], comparing: [0, 1], sorted: [4] },
          },
          {
            description: "比较 A[1]=4 和 A[2]=2，4>2，交换",
            state: { array: [3, 4, 2, 1, 5], comparing: [1, 2], swapping: [1, 2], sorted: [4] },
          },
          {
            description: "比较 A[2]=4 和 A[3]=1，4>1，交换",
            state: { array: [3, 2, 4, 1, 5], comparing: [2, 3], swapping: [2, 3], sorted: [4] },
          },
          {
            description: "第2趟结束，4到达最终位置",
            state: { array: [3, 2, 1, 4, 5], sorted: [3, 4] },
          },
          {
            description: "第3趟：比较 A[0]=3 和 A[1]=2，3>2，交换",
            state: { array: [3, 2, 1, 4, 5], comparing: [0, 1], swapping: [0, 1], sorted: [3, 4] },
          },
          {
            description: "比较 A[1]=3 和 A[2]=1，3>1，交换",
            state: { array: [2, 3, 1, 4, 5], comparing: [1, 2], swapping: [1, 2], sorted: [3, 4] },
          },
          {
            description: "第3趟结束，3到达最终位置",
            state: { array: [2, 1, 3, 4, 5], sorted: [2, 3, 4] },
          },
          {
            description: "第4趟：比较 A[0]=2 和 A[1]=1，2>1，交换",
            state: { array: [2, 1, 3, 4, 5], comparing: [0, 1], swapping: [0, 1], sorted: [2, 3, 4] },
          },
          {
            description: "排序完成！所有元素已有序",
            state: { array: [1, 2, 3, 4, 5], sorted: [0, 1, 2, 3, 4] },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "伪代码",
        type: "detail",
        content: `\`\`\`
void BubbleSort(int A[], int n) {
    bool flag;
    for (int i = 0; i < n-1; i++) {
        flag = false;
        for (int j = 0; j < n-1-i; j++) {
            if (A[j] > A[j+1]) {
                swap(A[j], A[j+1]);
                flag = true;
            }
        }
        if (!flag) break;  // 本趟没有交换，已有序
    }
}
\`\`\`

**flag 优化**：如果某趟没有发生任何交换，说明序列已经有序，可以提前结束。这使得最好情况（已有序）只需一趟扫描，O(n)。`,
      },
      {
        id: "complexity",
        title: "复杂度",
        type: "detail",
        content: `| 情况 | 比较次数 | 交换次数 | 时间复杂度 |
|------|----------|----------|-----------|
| 最好（已有序） | n-1 | 0 | O(n) |
| 最坏（逆序） | n(n-1)/2 | n(n-1)/2 | O(n²) |
| 平均 | n(n-1)/4 | n(n-1)/4 | O(n²) |

空间 O(1)，稳定（相等不交换）。

**考研注意**：冒泡排序每趟结束后，最后的元素一定在最终位置。所以"经过k趟冒泡后，后k个元素已经有序且在最终位置"。`,
      },
    ],
    exercises: [],
  },
  {
    id: "simple-selection-sort",
    title: "简单选择排序",
    brief: "每趟从未排序部分选出最小元素，放到已排序部分的末尾",
    keyTakeaways: [
      "每趟通过比较选出最小值，只做一次交换",
      "比较次数固定为 n(n-1)/2，与初始序列无关",
      "交换次数最多 n-1 次",
      "不稳定排序",
      "移动次数少，适合记录较大、关键字较小的场景",
    ],
    relatedLessons: ["heap-sort"],
    sections: [
      {
        id: "motivation",
        title: "思路",
        type: "motivation",
        content: `选择排序的思想也很直观：每次从剩余元素中**选出最小的**，放到前面。

和冒泡的区别：冒泡是通过相邻交换把最大值"推"到末尾（交换很多次）；选择排序是先"看"完所有元素找到最小值，然后只做一次交换。

所以选择排序的**交换次数**很少（最多 n-1 次），但**比较次数**固定（不管序列是否有序，都要比较 n(n-1)/2 次）。`,
      },
      {
        id: "pseudocode",
        title: "伪代码",
        type: "detail",
        content: `\`\`\`
void SelectSort(int A[], int n) {
    int i, j, min;
    for (i = 0; i < n-1; i++) {
        min = i;
        for (j = i+1; j < n; j++)
            if (A[j] < A[min])
                min = j;
        if (min != i)
            swap(A[i], A[min]);
    }
}
\`\`\`

**为什么不稳定？**
例如 [3, 3', 2]，第一趟选出最小值2，与第一个3交换，得到 [2, 3', 3]。原来3在3'前面，现在3在3'后面了。`,
      },
      {
        id: "complexity",
        title: "复杂度",
        type: "detail",
        content: `| 指标 | 值 |
|------|-----|
| 比较次数 | n(n-1)/2（固定，与序列无关） |
| 交换次数 | 最好0次，最坏n-1次 |
| 时间复杂度 | O(n²)（始终） |
| 空间复杂度 | O(1) |
| 稳定性 | 不稳定 |`,
      },
    ],
    exercises: [],
  },
  {
    id: "heap-sort",
    title: "堆排序",
    brief: "利用堆这种数据结构，每次取出堆顶（最大/最小值），实现选择排序的优化",
    keyTakeaways: [
      "堆是完全二叉树，大根堆：每个结点 >= 其子结点",
      "建堆：从最后一个非叶结点开始，自底向上调整",
      "排序：取堆顶与末尾交换，然后对堆顶做向下调整",
      "时间复杂度始终 O(nlogn)，空间 O(1)",
      "不稳定排序",
    ],
    relatedLessons: ["simple-selection-sort"],
    sections: [
      {
        id: "motivation",
        title: "为什么需要堆排序？",
        type: "motivation",
        content: `简单选择排序每趟要扫描所有未排序元素来找最小值，做了很多"无用功"——上一趟的比较信息完全没有利用。

堆排序的改进思路：用**堆**这种数据结构来维护未排序元素。堆的特性是堆顶一定是最大（或最小）值，取出堆顶后只需 O(logn) 的调整就能恢复堆的性质。

这样每次"选择最大值"的代价从 O(n) 降到了 O(logn)，总体从 O(n²) 降到 O(nlogn)。`,
      },
      {
        id: "concept",
        title: "堆的基本概念",
        type: "concept",
        content: `**堆**是一棵完全二叉树，满足：
- **大根堆**：每个结点的值 >= 其左右子结点的值（堆顶最大）
- **小根堆**：每个结点的值 <= 其左右子结点的值（堆顶最小）

**用数组存储**（下标从1开始）：
- 结点 i 的左孩子：2i
- 结点 i 的右孩子：2i + 1
- 结点 i 的父结点：⌊i/2⌋
- 最后一个非叶结点：⌊n/2⌋

堆排序用**大根堆**：每次取出最大值放到末尾，得到升序序列。`,
      },
      {
        id: "walkthrough",
        title: "建堆过程",
        type: "walkthrough",
        content: `以序列 \`[53, 17, 78, 09, 45, 65, 87, 32]\`（8个元素）为例，建大根堆。

从最后一个非叶结点 ⌊8/2⌋=4 开始，自底向上调整。`,
        steps: [
          {
            description: "初始序列对应的完全二叉树（未调整），从最后一个非叶结点⌊8/2⌋=4开始",
            state: { type: "heap", array: [53, 17, 78, 9, 45, 65, 87, 32], adjusting: -1 },
          },
          {
            description: "调整结点4（值09）：左孩子32>09，交换09和32",
            state: { type: "heap", array: [53, 17, 78, 9, 45, 65, 87, 32], adjusting: 3, swapping: [3, 7] },
          },
          {
            description: "结点4调整完毕，09下沉到叶子",
            state: { type: "heap", array: [53, 17, 78, 32, 45, 65, 87, 9], adjusting: -1 },
          },
          {
            description: "调整结点3（值78）：右孩子87>78>左孩子65，与87交换",
            state: { type: "heap", array: [53, 17, 78, 32, 45, 65, 87, 9], adjusting: 2, swapping: [2, 6] },
          },
          {
            description: "结点3调整完毕",
            state: { type: "heap", array: [53, 17, 87, 32, 45, 65, 78, 9], adjusting: -1 },
          },
          {
            description: "调整结点2（值17）：右孩子45>17>左孩子32，与45交换",
            state: { type: "heap", array: [53, 17, 87, 32, 45, 65, 78, 9], adjusting: 1, swapping: [1, 4] },
          },
          {
            description: "17下沉后无孩子大于它，结点2调整完毕",
            state: { type: "heap", array: [53, 45, 87, 32, 17, 65, 78, 9], adjusting: -1 },
          },
          {
            description: "调整结点1（值53）：右孩子87>53>左孩子45，与87交换",
            state: { type: "heap", array: [53, 45, 87, 32, 17, 65, 78, 9], adjusting: 0, swapping: [0, 2] },
          },
          {
            description: "53继续下沉：右孩子78>53>左孩子65，与78交换",
            state: { type: "heap", array: [87, 45, 53, 32, 17, 65, 78, 9], adjusting: 2, swapping: [2, 6] },
          },
          {
            description: "建堆完成！大根堆：堆顶87是最大值",
            state: { type: "heap", array: [87, 45, 78, 32, 17, 65, 53, 9], adjusting: -1 },
          },
        ],
      },
      {
        id: "sort-process",
        title: "排序过程",
        type: "detail",
        content: `建好大根堆后，排序过程：

1. 取堆顶（最大值）与末尾元素交换
2. 堆的有效长度减1（末尾元素已归位）
3. 对新的堆顶做向下调整（HeapAdjust）
4. 重复直到堆只剩一个元素

\`\`\`
// 向下调整（大根堆）
void HeapAdjust(int A[], int k, int len) {
    A[0] = A[k];              // 暂存
    for (int i = 2*k; i <= len; i *= 2) {
        if (i < len && A[i] < A[i+1])
            i++;               // 取较大的孩子
        if (A[0] >= A[i]) break;
        A[k] = A[i];
        k = i;
    }
    A[k] = A[0];
}

// 建堆
void BuildMaxHeap(int A[], int n) {
    for (int i = n/2; i >= 1; i--)
        HeapAdjust(A, i, n);
}

// 堆排序
void HeapSort(int A[], int n) {
    BuildMaxHeap(A, n);
    for (int i = n; i > 1; i--) {
        swap(A[1], A[i]);      // 堆顶与末尾交换
        HeapAdjust(A, 1, i-1); // 调整剩余部分
    }
}
\`\`\``,
      },
      {
        id: "complexity",
        title: "复杂度分析",
        type: "detail",
        content: `| 指标 | 值 |
|------|-----|
| 建堆时间 | O(n) |
| 排序时间 | O(nlogn)（n-1次调整，每次O(logn)） |
| 总时间 | O(nlogn)（最好=最坏=平均） |
| 空间 | O(1) |
| 稳定性 | 不稳定 |

**为什么建堆是 O(n) 而不是 O(nlogn)？**
虽然有 n/2 个结点需要调整，但大部分结点在底层，调整路径短。精确计算：总调整次数 ≤ 2n，所以是 O(n)。

**为什么不稳定？**
堆顶与末尾交换时，可能把相同值的元素顺序打乱。

**考研重点**：
- 建堆过程的手算（从最后一个非叶结点开始）
- 每次取堆顶后的调整过程
- 在已有堆中插入/删除元素的调整`,
      },
    ],
    exercises: [
      {
        id: "heap-ex-01",
        title: "建堆手算",
        description: "对序列 [4, 6, 8, 5, 9, 1, 3, 7]，建立大根堆，写出建堆后的序列。",
        difficulty: "medium",
        hints: ["最后一个非叶结点是 ⌊8/2⌋=4，即元素5", "从结点4开始向前逐个调整"],
        referenceSolution: "建堆后：[9, 7, 8, 6, 4, 1, 3, 5]（从结点4→3→2→1依次调整）",
      },
    ],
  },
];
