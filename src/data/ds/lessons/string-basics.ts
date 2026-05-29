import { Lesson } from "@/types";

export const stringBasicsLessons: Lesson[] = [
  {
    id: "string-basics",
    title: "串的基本概念与朴素匹配",
    brief: "串的定义、存储结构，以及暴力模式匹配算法BF，作为理解KMP的基础",
    keyTakeaways: [
      "串是字符序列，子串/前缀/后缀/真前缀是核心概念",
      "三种存储：定长顺序存储、堆分配存储、块链存储",
      "BF算法：主串指针回退，时间复杂度 O(mn)",
      "KMP改进点：主串指针不回退，利用已匹配信息跳过无效比较",
    ],
    relatedLessons: [],
    sections: [
      {
        id: "string-definition",
        title: "串的基本定义",
        type: "concept",
        content: `## 串（String）的定义

**串**是由零个或多个字符组成的有限序列，记作 S = "a1 a2 ... an"（n >= 0）。

- **串长**：串中字符的个数 n
- **空串**：长度为 0 的串，记作 ""（注意：空串不是空格串）

---

## 核心术语

| 术语 | 定义 | 示例（S = "abcabc"） |
|------|------|---------------------|
| **子串** | S 中任意连续字符组成的序列 | "abc", "bca", "a" |
| **前缀** | 从第一个字符开始的子串 | "a", "ab", "abc", "abca" |
| **真前缀** | 不等于串本身的前缀 | "a", "ab", "abc", "abca", "abcab" |
| **后缀** | 到最后一个字符结束的子串 | "c", "bc", "abc", "cabc" |
| **真后缀** | 不等于串本身的后缀 | "c", "bc", "abc", "cabc", "bcabc" |
| **模式匹配** | 在主串中查找模式串第一次出现的位置 | 在 S 中找 T = "cab" |

---

## 模式匹配的重要性

模式匹配是串操作中最核心的算法，广泛应用于：
- 文本编辑器的查找功能
- 搜索引擎的关键词匹配
- 生物信息学的基因序列比对
- 网络入侵检测的特征匹配`,
      },
      {
        id: "string-storage",
        title: "串的存储结构",
        type: "concept",
        content: `## 1. 定长顺序存储（静态数组）

用固定长度的字符数组存储串，下标 0 存放串长。

\`\`\`c
#define MAXLEN 255

typedef struct {
    char ch[MAXLEN + 1];  /* ch[0] 存串长，ch[1..n] 存字符 */
    int length;
} SString;
\`\`\`

**优点**：实现简单，随机访问 O(1)。

**缺点**：长度固定，超出 MAXLEN 的部分被截断。

---

## 2. 堆分配存储（动态数组）

在堆上动态分配内存，可存储任意长度的串。

\`\`\`c
typedef struct {
    char *ch;     /* 指向动态分配的字符数组 */
    int length;   /* 串的当前长度 */
} HString;

/* 初始化 */
void InitString(HString *S, const char *str) {
    S->length = strlen(str);
    S->ch = (char *)malloc((S->length + 1) * sizeof(char));
    strcpy(S->ch, str);
}
\`\`\`

**优点**：长度灵活，不浪费空间。

**缺点**：需要手动管理内存（malloc/free）。

---

## 3. 块链存储（了解即可）

将串分块存储在链表中，每个结点存储若干字符。

\`\`\`c
#define BLOCK_SIZE 4

typedef struct Block {
    char ch[BLOCK_SIZE];
    struct Block *next;
} Block, *BLString;
\`\`\`

**特点**：插入删除方便，但存储密度低（最后一个块可能有空位），随机访问慢。考研中了解概念即可，不要求实现。`,
      },
      {
        id: "string-bf",
        title: "【算法】BF算法（暴力匹配）",
        type: "detail",
        content: `## BF算法（Brute Force，暴力匹配）

**思路**：从主串 S 的第 1 个字符开始，逐一与模式串 T 比较；一旦失配，主串指针回退到本轮起点的下一位，模式串指针回到开头，重新开始。

---

## 完整代码

\`\`\`c
/* 返回模式串 T 在主串 S 中第一次出现的位置（从1开始），失败返回0 */
/* 使用定长顺序存储，S[0] 和 T[0] 存串长 */
int Index_BF(SString S, SString T) {
    int i = 1, j = 1;

    while (i <= S[0] && j <= T[0]) {
        if (S[i] == T[j]) {
            i++;    /* 继续比较后续字符 */
            j++;
        } else {
            i = i - j + 2;  /* 主串指针回退到本轮起点的下一位 */
            j = 1;          /* 模式串指针回到开头 */
        }
    }

    if (j > T[0])
        return i - T[0];    /* 匹配成功，返回起始位置 */
    else
        return 0;           /* 匹配失败 */
}
\`\`\`

---

## 逐行说明

**\`i = i - j + 2\` 的含义**：

本轮匹配从主串位置 \`i - j + 1\` 开始（因为已经匹配了 j-1 个字符，当前 i 指向第 j 个字符）。下一轮从 \`(i - j + 1) + 1 = i - j + 2\` 开始。

**示例**：i=5, j=3 时失配，说明本轮从 i-j+1=3 开始，下一轮从 i-j+2=4 开始，j 重置为 1。

---

## 时间复杂度

- **最好情况**：每轮第一个字符就失配，O(n+m)
- **最坏情况**：每轮匹配到最后一个字符才失配（如 S="aaaaab", T="aaab"），O(mn)
- **平均情况**：O(n+m)（实际文本中最好情况更常见）`,
      },
      {
        id: "string-bf-walkthrough",
        title: "BF匹配演示",
        type: "walkthrough",
        content: `主串 S = "ababcabcacbab"，模式串 T = "abcac"，演示 BF 算法的匹配过程。`,
        steps: [
          {
            description: "第1轮：从 S[1] 开始，S[1..2]='ab' 与 T[1..2]='ab' 匹配，S[3]='a' 与 T[3]='c' 失配",
            state: {
              S: "ababcabcacbab",
              T: "abcac",
              i: 3,
              j: 3,
              alignStart: 1,
              note: "i=3, j=3 失配，i 回退到 i-j+2 = 3-3+2 = 2，j=1",
            },
          },
          {
            description: "第2轮：从 S[2] 开始，S[2]='b' 与 T[1]='a' 立即失配",
            state: {
              S: "ababcabcacbab",
              T: "abcac",
              i: 2,
              j: 1,
              alignStart: 2,
              note: "i=2, j=1 失配，i 回退到 i-j+2 = 2-1+2 = 3，j=1",
            },
          },
          {
            description: "第3轮：从 S[3] 开始，S[3..6]='abca' 与 T[1..4]='abca' 匹配，S[7]='b' 与 T[5]='c' 失配",
            state: {
              S: "ababcabcacbab",
              T: "abcac",
              i: 7,
              j: 5,
              alignStart: 3,
              note: "i=7, j=5 失配，i 回退到 i-j+2 = 7-5+2 = 4，j=1",
            },
          },
          {
            description: "经过第4、5轮失配后，第6轮从 S[6] 开始，S[6..10]='abcac' 与 T[1..5]='abcac' 完全匹配！",
            state: {
              S: "ababcabcacbab",
              T: "abcac",
              i: 11,
              j: 6,
              alignStart: 6,
              note: "j > T[0]=5，匹配成功，返回 i-T[0] = 11-5 = 6",
            },
          },
        ],
      },
      {
        id: "string-bf-vs-kmp",
        title: "BF vs KMP",
        type: "comparison",
        content: `## BF算法的低效根源

BF 算法在失配时，**主串指针 i 要回退**，已经比较过的信息被完全丢弃，下一轮从头再来。

**示例**：S="aaaaab", T="aaab"

\`\`\`
第1轮：aaaa|b  vs  aaa|b  → 第4位失配，i回退到2
         ↑失配
第2轮：_aaa|ab vs  aaa|b  → 第4位失配，i回退到3
第3轮：__aaa|b vs  aaa|b  → 第4位失配，i回退到4
...
\`\`\`

每轮都要重新比较前3个字符，大量重复工作。

---

## BF vs KMP 对比

| 比较项 | BF算法 | KMP算法 |
|--------|--------|---------|
| 主串指针 i | **回退**（i = i-j+2） | **不回退**（i 只增不减） |
| 模式串指针 j | 回到 1 | 回到 next[j]（利用已匹配信息） |
| 时间复杂度 | O(mn) | O(m+n) |
| 实现难度 | 简单 | 较复杂（需预处理 next 数组） |
| 适用场景 | 短串、简单场景 | 长串、重复字符多的场景 |

---

## KMP的改进思路

失配时，已经匹配的 j-1 个字符是已知的。KMP 利用这些信息，通过预先计算的 **next 数组**，直接将模式串滑动到合适位置，避免主串指针回退。

**next[j]** 的含义：当 T[j] 失配时，模式串应该从 T[next[j]] 重新开始比较。`,
      },
    ],
    exercises: [
      {
        id: "string-ex1",
        title: "BF算法手工模拟",
        description: "用 BF 算法在主串 S = \"aababcabcdabcde\" 中查找模式串 T = \"abcd\"。请写出每一轮匹配的起始位置、匹配过程，以及最终返回值。统计总比较次数。",
        difficulty: "easy",
        hints: [
          "从 S[1] 开始，逐字符与 T[1] 比较",
          "失配时，i = i-j+2，j = 1，开始新一轮",
          "匹配成功条件：j > T[0]（j 超过模式串长度）",
          "返回值 = i - T[0]（匹配成功时的起始位置）",
        ],
        referenceSolution: `S = "aababcabcdabcde"（长度15），T = "abcd"（长度4）

第1轮（起点1）：S[1]='a'=T[1], S[2]='a'≠T[2]='b' → 失配，i=2,j=1
第2轮（起点2）：S[2]='a'=T[1], S[3]='b'=T[2], S[4]='a'≠T[3]='c' → 失配，i=3,j=1
第3轮（起点3）：S[3]='b'≠T[1]='a' → 失配，i=4,j=1
第4轮（起点4）：S[4]='a'=T[1], S[5]='b'=T[2], S[6]='c'=T[3], S[7]='a'≠T[4]='d' → 失配，i=5,j=1
第5轮（起点5）：S[5]='b'≠T[1]='a' → 失配，i=6,j=1
第6轮（起点6）：S[6]='c'≠T[1]='a' → 失配，i=7,j=1
第7轮（起点7）：S[7]='a'=T[1], S[8]='b'=T[2], S[9]='c'=T[3], S[10]='d'=T[4] → j=5>T[0]=4，匹配成功！

返回值 = i - T[0] = 11 - 4 = 7

总比较次数 = 2+3+1+4+1+1+4 = 16 次`,
      },
    ],
  },
];
