import { Lesson } from "@/types";

export const sortOtherLessons: Lesson[] = [
  {
    id: "merge-sort",
    title: "归并排序",
    brief: "将序列递归地分成两半，分别排序后合并，利用分治思想实现 O(nlogn) 的稳定排序",
    keyTakeaways: [
      "分治思想：分→治→合",
      "时间复杂度始终 O(nlogn)（最好=最坏=平均）",
      "需要 O(n) 辅助空间",
      "稳定排序",
      "是唯一一个既稳定又保证 O(nlogn) 的排序算法",
    ],
    relatedLessons: ["quick-sort"],
    sections: [
      {
        id: "motivation",
        title: "归并的思想",
        type: "motivation",
        content: `如果有两个**已经排好序**的序列，把它们合并成一个有序序列非常简单——双指针从头比较，小的先放，O(n) 就能完成。

归并排序利用这个特性：
1. 把序列从中间分成两半
2. 递归地对两半分别排序
3. 把两个有序的半序列合并

递归的终点：只有一个元素时，天然有序。

这就是分治法：大问题拆成小问题，解决小问题后合并结果。`,
      },
      {
        id: "walkthrough",
        title: "执行过程",
        type: "walkthrough",
        content: `以序列 \`[49, 38, 65, 97, 76, 13, 27]\` 为例，展示自底向上的二路归并过程。每趟将相邻的有序子序列两两合并。`,
        steps: [
          {
            description: "初始：每个元素自成一个有序子序列（长度为1）",
            state: { array: [49, 38, 65, 97, 76, 13, 27], highlight: [0, 1, 2, 3, 4, 5, 6] },
          },
          {
            description: "第1趟：合并[49]和[38] → 38<49，得[38,49]",
            state: { array: [49, 38, 65, 97, 76, 13, 27], comparing: [0, 1], swapping: [0, 1] },
          },
          {
            description: "第1趟：合并[65]和[97] → 65<97，已有序",
            state: { array: [38, 49, 65, 97, 76, 13, 27], comparing: [2, 3] },
          },
          {
            description: "第1趟：合并[76]和[13] → 13<76，得[13,76]",
            state: { array: [38, 49, 65, 97, 76, 13, 27], comparing: [4, 5], swapping: [4, 5] },
          },
          {
            description: "第1趟结束：[38,49] [65,97] [13,76] [27]，每组长度2",
            state: { array: [38, 49, 65, 97, 13, 76, 27], sorted: [0, 1, 2, 3, 4, 5] },
          },
          {
            description: "第2趟：合并[38,49]和[65,97]，双指针比较 → [38,49,65,97]",
            state: { array: [38, 49, 65, 97, 13, 76, 27], highlight: [0, 1, 2, 3] },
          },
          {
            description: "第2趟：合并[13,76]和[27]，双指针比较 → [13,27,76]",
            state: { array: [38, 49, 65, 97, 13, 76, 27], highlight: [4, 5, 6] },
          },
          {
            description: "第2趟结束：[38,49,65,97] [13,27,76]",
            state: { array: [38, 49, 65, 97, 13, 27, 76], sorted: [0, 1, 2, 3, 4, 5, 6] },
          },
          {
            description: "第3趟：合并两个有序子序列，双指针逐一比较",
            state: { array: [38, 49, 65, 97, 13, 27, 76], low: 0, high: 6 },
          },
          {
            description: "排序完成！最终有序序列",
            state: { array: [13, 27, 38, 49, 65, 76, 97], sorted: [0, 1, 2, 3, 4, 5, 6] },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "伪代码",
        type: "detail",
        content: `\`\`\`
// 合并两个有序子序列 A[low..mid] 和 A[mid+1..high]
void Merge(int A[], int low, int mid, int high) {
    int B[high-low+1];  // 辅助数组
    int i = low, j = mid+1, k = 0;
    while (i <= mid && j <= high) {
        if (A[i] <= A[j])
            B[k++] = A[i++];
        else
            B[k++] = A[j++];
    }
    while (i <= mid) B[k++] = A[i++];
    while (j <= high) B[k++] = A[j++];
    // 复制回原数组
    for (k = 0, i = low; i <= high; i++, k++)
        A[i] = B[k];
}

// 归并排序
void MergeSort(int A[], int low, int high) {
    if (low < high) {
        int mid = (low + high) / 2;
        MergeSort(A, low, mid);       // 左半部分
        MergeSort(A, mid+1, high);    // 右半部分
        Merge(A, low, mid, high);     // 合并
    }
}
\`\`\`

**Merge 中 \`<=\` 保证稳定性**：左边的相等元素先放入，保持原有顺序。`,
      },
      {
        id: "complexity",
        title: "复杂度",
        type: "detail",
        content: `| 指标 | 值 |
|------|-----|
| 时间复杂度 | O(nlogn)（始终，不受输入影响） |
| 空间复杂度 | O(n)（辅助数组） |
| 稳定性 | 稳定 |
| 归并趟数 | ⌈log₂n⌉ |

**为什么是 O(nlogn)？**
- 递归深度 logn 层
- 每层的合并操作总共处理 n 个元素
- 总计 O(nlogn)

**与快速排序的对比**：
- 归并：先递归后合并（自底向上处理）
- 快排：先划分后递归（自顶向下处理）
- 归并保证 O(nlogn)，快排最坏 O(n²)
- 归并需要 O(n) 额外空间，快排只需 O(logn)
- 归并稳定，快排不稳定`,
      },
    ],
    exercises: [
      {
        id: "merge-ex-01",
        title: "归并排序趟数",
        description: "对10个元素进行二路归并排序，需要几趟归并？每趟后有多少个有序子序列？",
        difficulty: "easy",
        hints: ["⌈log₂10⌉ = 4趟", "每趟子序列数量减半"],
        referenceSolution: "4趟。第1趟后5个有序子序列，第2趟后3个，第3趟后2个，第4趟后1个（排序完成）",
      },
    ],
  },
  {
    id: "radix-sort",
    title: "基数排序",
    brief: "不基于比较，按关键字的各位分别排序，从最低位到最高位依次进行",
    keyTakeaways: [
      "不基于比较的排序，利用分配和收集操作",
      "LSD（最低位优先）：从个位开始，逐位排序",
      "每趟排序必须是稳定的（否则低位排序结果会被破坏）",
      "时间 O(d(n+r))，d是位数，r是基数",
      "适合关键字位数少、取值范围小的场景",
    ],
    relatedLessons: ["counting-sort"],
    sections: [
      {
        id: "motivation",
        title: "不比较也能排序？",
        type: "motivation",
        content: `前面所有排序算法都基于"比较"——通过比较两个元素的大小来确定顺序。基于比较的排序有一个理论下界：O(nlogn)。

有没有不比较的排序方法？

基数排序的思想来自日常生活：整理扑克牌时，可以先按花色分堆，再在每堆内按点数排。

对于整数排序：先按个位分成10堆（0~9），收集起来；再按十位分堆，收集；再按百位……最终有序。

关键：每次按某一位分堆时，必须保持之前低位排序的结果（即必须稳定）。`,
      },
      {
        id: "walkthrough",
        title: "执行过程",
        type: "walkthrough",
        content: `对序列 \`[329, 457, 657, 839, 436, 720, 355]\` 进行基数排序（LSD）：`,
        steps: [
          {
            description: "按个位分配：0→[720] 5→[355] 6→[436] 7→[457,657] 9→[329,839]。收集",
            state: { array: [720, 355, 436, 457, 657, 329, 839], digit: "个位" },
          },
          {
            description: "按十位分配：2→[720,329] 3→[436,839] 5→[355,457,657]。收集",
            state: { array: [720, 329, 436, 839, 355, 457, 657], digit: "十位" },
          },
          {
            description: "按百位分配：3→[329,355] 4→[436,457] 6→[657] 7→[720] 8→[839]。收集",
            state: { array: [329, 355, 436, 457, 657, 720, 839], digit: "百位" },
          },
        ],
      },
      {
        id: "pseudocode",
        title: "算法描述",
        type: "detail",
        content: `\`\`\`
// 基数排序（LSD，最低位优先）
void RadixSort(int A[], int n) {
    int max = getMax(A, n);  // 找最大值确定位数
    // 从个位到最高位
    for (int exp = 1; max/exp > 0; exp *= 10) {
        // 按当前位进行稳定的计数排序
        CountingSortByDigit(A, n, exp);
    }
}
\`\`\`

实际实现中，每趟用**队列**（桶）来分配和收集：
- 分配：扫描序列，按当前位的值放入对应队列（0~9号）
- 收集：依次从0~9号队列中取出，形成新序列

每趟分配+收集的时间：O(n+r)，其中 r 是基数（十进制为10）。`,
      },
      {
        id: "complexity",
        title: "复杂度",
        type: "detail",
        content: `| 指标 | 值 |
|------|-----|
| 时间复杂度 | O(d(n+r))，d=位数，r=基数 |
| 空间复杂度 | O(r+n)（r个队列 + 队列中的元素） |
| 稳定性 | 稳定（必须稳定，否则算法不正确） |

**适用场景**：
- 关键字可以分解为若干位
- 位数 d 较小
- 每位的取值范围 r 不大

**不适用**：浮点数、关键字取值范围很大的情况。`,
      },
    ],
    exercises: [],
  },
  {
    id: "counting-sort",
    title: "计数排序",
    brief: "统计每个值出现的次数，直接计算每个元素的最终位置",
    keyTakeaways: [
      "不基于比较，利用计数确定位置",
      "时间 O(n+k)，k是值域范围",
      "需要 O(k) 额外空间",
      "稳定排序",
      "适合值域范围不大的整数排序",
    ],
    relatedLessons: ["radix-sort"],
    sections: [
      {
        id: "motivation",
        title: "思路",
        type: "motivation",
        content: `如果我们知道一个元素前面有多少个比它小的元素，就能直接确定它的位置。

计数排序的做法：
1. 统计每个值出现了多少次
2. 累加得到"小于等于该值的元素个数"
3. 这个累加值就是该元素在排序结果中的位置

前提：元素的值域范围不能太大（否则计数数组太大）。`,
      },
      {
        id: "pseudocode",
        title: "伪代码",
        type: "detail",
        content: `\`\`\`
void CountingSort(int A[], int B[], int n, int k) {
    // k 是值域上界，A[i] ∈ [0, k]
    int C[k+1] = {0};

    // 1. 统计每个值的出现次数
    for (int i = 0; i < n; i++)
        C[A[i]]++;

    // 2. 累加：C[i] 表示 <= i 的元素个数
    for (int i = 1; i <= k; i++)
        C[i] += C[i-1];

    // 3. 从后往前放置（保证稳定性）
    for (int i = n-1; i >= 0; i--) {
        B[C[A[i]] - 1] = A[i];
        C[A[i]]--;
    }
}
\`\`\`

**为什么从后往前遍历？** 保证稳定性。相同值的元素，后出现的放在后面的位置。`,
      },
      {
        id: "complexity",
        title: "复杂度",
        type: "detail",
        content: `| 指标 | 值 |
|------|-----|
| 时间 | O(n+k)，k为值域范围 |
| 空间 | O(n+k) |
| 稳定性 | 稳定 |

**局限性**：
- 只适用于整数（或可映射为整数的数据）
- 值域 k 很大时空间浪费严重
- 不适合浮点数或字符串

**与基数排序的关系**：基数排序的每一趟可以用计数排序来实现。`,
      },
    ],
    exercises: [],
  },
  {
    id: "sort-comparison",
    title: "排序算法综合对比",
    brief: "所有排序算法的性能、特性、适用场景一览",
    keyTakeaways: [
      "基于比较的排序下界是 O(nlogn)",
      "没有一种排序在所有情况下都最优",
      "稳定且 O(nlogn) 的只有归并排序",
      "原地且 O(nlogn) 的只有堆排序和快速排序（平均）",
      "数据基本有序时，插入排序和冒泡排序最快",
    ],
    sections: [
      {
        id: "table",
        title: "综合对比表",
        type: "comparison",
        content: `| 算法 | 最好 | 平均 | 最坏 | 空间 | 稳定 |
|------|------|------|------|------|------|
| 直接插入 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |
| 折半插入 | O(nlogn) | O(n²) | O(n²) | O(1) | 稳定 |
| 希尔排序 | — | O(n^1.3) | — | O(1) | 不稳定 |
| 冒泡排序 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |
| 快速排序 | O(nlogn) | O(nlogn) | O(n²) | O(logn) | 不稳定 |
| 简单选择 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |
| 堆排序 | O(nlogn) | O(nlogn) | O(nlogn) | O(1) | 不稳定 |
| 归并排序 | O(nlogn) | O(nlogn) | O(nlogn) | O(n) | 稳定 |
| 基数排序 | O(d(n+r)) | O(d(n+r)) | O(d(n+r)) | O(r+n) | 稳定 |
| 计数排序 | O(n+k) | O(n+k) | O(n+k) | O(n+k) | 稳定 |`,
      },
      {
        id: "how-to-choose",
        title: "如何选择排序算法",
        type: "detail",
        content: `**按场景选择：**

- **数据量小（n<50）**：直接插入排序（简单，常数因子小）
- **数据基本有序**：直接插入排序或冒泡排序（接近 O(n)）
- **数据量大，要求平均性能好**：快速排序
- **数据量大，要求最坏也是 O(nlogn)**：堆排序或归并排序
- **要求稳定**：归并排序
- **内存受限（不能用额外空间）**：堆排序
- **关键字范围小的整数**：计数排序或基数排序

**考研常考的判断题：**
1. "快速排序是最快的排序" → 错，最坏 O(n²)
2. "堆排序不需要额外空间" → 对，O(1)
3. "归并排序的比较次数与初始序列无关" → 错，最好情况比较次数少于最坏
4. "基于比较的排序最快是 O(nlogn)" → 对，这是理论下界
5. "所有 O(nlogn) 的排序都不稳定" → 错，归并排序稳定`,
      },
      {
        id: "stability-explain",
        title: "稳定性详解",
        type: "detail",
        content: `**稳定**：相等的元素排序后保持原来的相对顺序。

**记忆口诀**：不稳定的有"快些选堆"（快速、希尔、选择、堆）

**为什么关心稳定性？**
多关键字排序时需要。比如先按成绩排，再按姓名排。如果第二次排序不稳定，可能破坏第一次排序的结果。

**各算法不稳定的原因**：
- 快速排序：划分时跨越交换
- 希尔排序：不同组中相同元素可能交换顺序
- 简单选择：选最小值与前面交换时跨越
- 堆排序：堆顶与末尾交换时跨越`,
      },
    ],
    exercises: [
      {
        id: "comp-ex-01",
        title: "排序算法选择",
        description: "以下场景分别应该选择什么排序算法？(1)100万个随机整数 (2)1000个基本有序的记录 (3)要求稳定且最坏O(nlogn) (4)内存只有O(1)额外空间",
        difficulty: "medium",
        hints: ["考虑各算法的优势场景"],
        referenceSolution: "(1)快速排序（平均最快）(2)直接插入排序（基本有序时O(n)）(3)归并排序（唯一满足的）(4)堆排序（O(1)空间+O(nlogn)时间）",
      },
    ],
  },
];
