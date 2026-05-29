import { Lesson } from "@/types";

export const sortQuickLessons: Lesson[] = [
  {
    id: "quick-sort",
    title: "快速排序",
    brief: "通过划分将序列分成两部分递归排序，平均 O(nlogn)，实践中最快的内部排序",
    analogy: "快排像整理书架——先随便拿一本书当标准（枢轴），比它矮的放左边，比它高的放右边，然后左右两堆各自再这样整理。",
    prerequisites: ["递归的基本概念", "时间复杂度分析"],
    commonMistakes: [
      "快排最坏情况是序列已有序（每次枢轴都是最大/最小值），退化为 O(n²)",
      "快排是不稳定排序——相同元素的相对顺序可能改变",
      "空间复杂度不是 O(1)——递归栈需要 O(logn)~O(n) 空间",
      "「快排是最快的排序」不准确——是平均情况下比较次数最少的基于比较的排序",
    ],
    memoryAids: [
      "快排三要素：选枢轴、划分、递归",
      "最坏变最好：随机选枢轴或三数取中",
      "考研常考：写出一趟划分后的序列（不是最终结果）",
    ],
    keyTakeaways: [
      "核心是划分（partition）：选枢轴，左边都 ≤ 枢轴，右边都 ≥ 枢轴",
      "平均 O(nlogn)，最坏 O(n²)——已有序序列是最坏情况",
      "不稳定排序",
      "平均空间 O(logn)（递归栈），最坏 O(n)",
      "实践中最快：常数因子小，缓存友好",
      "改进：随机化枢轴或三数取中，避免最坏情况",
    ],
    relatedLessons: ["bubble-sort", "merge-sort", "heap-sort"],
    sections: [
      {
        id: "motivation",
        title: "为什么快速排序快",
        type: "motivation",
        content: `冒泡排序每次只确定一个元素的最终位置，效率低。能不能一次操作让更多元素"各就各位"？

快速排序的思路：选一个**枢轴**（pivot），把序列重排成"左边都 ≤ 枢轴，右边都 ≥ 枢轴"。这一步叫**划分**（partition）。

划分完成后，枢轴就在它最终应该在的位置上了。然后对左右两部分递归做同样的事。

每次划分至少确定一个元素的最终位置，而且划分操作是 O(n) 的。这就是它快的原因。`,
      },
      {
        id: "algorithm",
        title: "【算法】划分与递归",
        type: "detail",
        content: `选 \`A[low]\` 为枢轴，用两个指针从两端向中间扫描：

\`\`\`c
int Partition(int A[], int low, int high) {
    int pivot = A[low];       // 保存枢轴值，low 位置成为"空位"
    while (low < high) {
        while (low < high && A[high] >= pivot) high--;
        A[low] = A[high];     // 右边小的填到左边空位
        while (low < high && A[low] <= pivot) low++;
        A[high] = A[low];     // 左边大的填到右边空位
    }
    A[low] = pivot;           // 枢轴归位
    return low;               // 返回枢轴最终下标
}

void QuickSort(int A[], int low, int high) {
    if (low < high) {
        int pivotPos = Partition(A, low, high);
        QuickSort(A, low, pivotPos - 1);   // 递归排左半部分
        QuickSort(A, pivotPos + 1, high);  // 递归排右半部分
    }
}
\`\`\`

**关键理解**：
- \`A[low] = A[high]\` 不是真正的"交换"，而是把 high 处的值填到 low 处的"空位"，low 处原来的值已经保存在 pivot 里
- 最后 \`A[low] = pivot\`：把枢轴填入最终空位
- 这种写法比真正的 swap 少一半赋值操作`,
      },
      {
        id: "walkthrough",
        title: "一趟划分演示",
        type: "walkthrough",
        content: `序列 \`[49, 38, 65, 97, 76, 13, 27, 49]\`，选 \`pivot = 49\`（A[0]）`,
        steps: [
          {
            description: "初始状态：pivot=49，low=0，high=7",
            state: { array: [49, 38, 65, 97, 76, 13, 27, 49], low: 0, high: 7, pivot: 49, phase: "init" },
          },
          {
            description: "high左移：A[7]=49≥49，A[6]=27<49，停。A[low]=A[high]，27填入位置0",
            state: { array: [27, 38, 65, 97, 76, 13, "_", 49], low: 0, high: 6, pivot: 49, phase: "fill-left" },
          },
          {
            description: "low右移：A[0]=27≤49，A[1]=38≤49，A[2]=65>49，停。A[high]=A[low]，65填入位置6",
            state: { array: [27, 38, "_", 97, 76, 13, 65, 49], low: 2, high: 6, pivot: 49, phase: "fill-right" },
          },
          {
            description: "high左移：A[5]=13<49，停。A[low]=A[high]，13填入位置2",
            state: { array: [27, 38, 13, 97, 76, "_", 65, 49], low: 2, high: 5, pivot: 49, phase: "fill-left" },
          },
          {
            description: "low右移：A[3]=97>49，停。A[high]=A[low]，97填入位置5",
            state: { array: [27, 38, 13, "_", 76, 97, 65, 49], low: 3, high: 5, pivot: 49, phase: "fill-right" },
          },
          {
            description: "high左移：A[4]=76≥49，low=high=3，循环结束。A[low]=pivot=49，枢轴归位",
            state: { array: [27, 38, 13, 49, 76, 97, 65, 49], low: 3, high: 3, pivot: 49, phase: "done" },
          },
        ],
      },
      {
        id: "complexity",
        title: "复杂度分析",
        type: "detail",
        content: `**最好情况**：每次划分都把序列分成等长两半，递归深度 O(logn)，每层总工作量 O(n)，总计 **O(nlogn)**。

**最坏情况**：每次选到最小或最大元素作为枢轴（序列已有序时），划分极度不均，退化成 n 层递归，总计 **O(n²)**。

**平均情况**：数学期望是 **O(nlogn)**，且常数因子比归并排序小（原地操作，缓存友好）。

**空间复杂度**：递归栈深度 = 划分层数。平均 O(logn)，最坏 O(n)。

**改进枢轴选择**：
- **随机化**：随机选枢轴，避免有序输入退化
- **三数取中**：取 A[low]、A[mid]、A[high] 的中位数作为枢轴，实践中效果好

| 情况 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 最好 | O(nlogn) | O(logn) |
| 平均 | O(nlogn) | O(logn) |
| 最坏（已有序） | O(n²) | O(n) |`,
      },
      {
        id: "comparison",
        title: "与其他排序的对比",
        type: "comparison",
        content: `| | 快速排序 | 归并排序 | 堆排序 |
|--|---------|---------|-------|
| 平均 | O(nlogn) | O(nlogn) | O(nlogn) |
| 最坏 | O(n²) | O(nlogn) | O(nlogn) |
| 空间 | O(logn) | O(n) | O(1) |
| 稳定性 | 不稳定 | 稳定 | 不稳定 |
| 实践速度 | 最快 | 中 | 慢（常数大） |

**考研常考点**：
- 已有序序列是快速排序的**最坏情况**，时间退化为 O(n²)
- 快速排序是**不稳定**排序（划分时跨越交换）
- 快速排序的**平均性能最好**，但不能保证最坏情况`,
      },
    ],
    exercises: [
      {
        id: "q1",
        title: "一趟划分结果",
        description: "对序列 [3,1,4,1,5,9,2,6] 用快速排序，以第一个元素为枢轴，第一趟划分后枢轴的位置是？",
        difficulty: "medium",
        hints: ["pivot=3，从右找小于3的，从左找大于3的"],
        referenceSolution: "pivot=3，划分后：[2,1,1,3,5,9,4,6]，枢轴在下标3（第4个位置）",
      },
      {
        id: "q2",
        title: "最坏情况分析",
        description: "快速排序在什么情况下时间复杂度最坏？如何避免？",
        difficulty: "medium",
        hints: ["考虑每次划分后两部分的大小"],
        referenceSolution: "序列已有序（正序或逆序）时最坏，每次划分只减少一个元素。避免方法：随机选枢轴或三数取中法",
      },
    ],
  },
];
