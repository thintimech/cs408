import { Lesson } from "@/types";

export const stringLessons: Lesson[] = [
  // ============================================================
  // KMP 模式匹配算法
  // ============================================================
  {
    id: "kmp-algorithm",
    title: "KMP 模式匹配算法",
    brief: "利用已匹配信息避免主串指针回溯，将字符串匹配从 O(nm) 优化到 O(n+m)",
    keyTakeaways: [
      "KMP 的核心思想：利用已经匹配的部分信息，避免主串指针回溯",
      "next[j] 的含义：模式串中前 j-1 个字符组成的子串的最长相等前后缀长度加 1",
      "next 数组只与模式串有关，与主串无关",
      "手算 next 数组是考研必考题型，务必熟练掌握",
      "nextval 是对 next 的优化，当 P[j]==P[next[j]] 时继续回退",
      "KMP 时间复杂度 O(n+m)，其中 n 为主串长度，m 为模式串长度",
      "严蔚敏教材约定：串的下标从 1 开始，next[1]=0，next[2]=1",
    ],
    relatedLessons: ["string-basics"],
    sections: [
      {
        id: "motivation",
        title: "为什么需要 KMP？",
        type: "motivation",
        content: `**朴素模式匹配（暴力匹配）的问题：**

给定主串 S 和模式串 P，要在 S 中找到 P 第一次出现的位置。

朴素算法的做法：从主串的每个位置开始，逐个字符与模式串比较。一旦失配，主串回退到起始位置的下一个字符，模式串回退到第一个字符，重新开始比较。

\`\`\`
// 朴素匹配
int BruteForce(String S, String P) {
    int i = 1, j = 1;
    while (i <= S.length && j <= P.length) {
        if (S[i] == P[j]) {
            i++; j++;
        } else {
            i = i - j + 2;  // 主串回退！
            j = 1;           // 模式串回到开头
        }
    }
    if (j > P.length) return i - P.length;
    return 0;
}
\`\`\`

**问题在哪？**

主串指针 i 的回退是不必要的。举例：

- 主串 S = "aaaaab"
- 模式串 P = "aaab"

第一次比较到 S[4]='a' 与 P[4]='b' 失配时，朴素算法让 i 回退到 2，j 回退到 1。但我们已经知道 S[2]、S[3]、S[4] 都是 'a'（因为它们刚才和 P[1]、P[2]、P[3] 匹配成功了），这些信息被白白浪费了。

**最坏时间复杂度：O(nm)**

当主串是 "aaa...ab"，模式串是 "aa...ab" 时，几乎每个位置都要比较 m 次才失配，总比较次数接近 n×m。

**KMP 的出发点：** 能不能在失配时，不回退主串指针 i，而是利用已经匹配的信息，直接把模式串滑动到一个合适的位置继续比较？`,
      },
      {
        id: "concept",
        title: "KMP 的核心思想",
        type: "concept",
        content: `**关键洞察：**

当 S[i] 与 P[j] 失配时，说明 S[i-j+1 .. i-1] 已经与 P[1 .. j-1] 匹配成功了。

这意味着我们已经"看过"了主串中这一段的内容——它就是 P[1..j-1]。

如果 P[1..j-1] 这个子串中，存在一个**既是前缀又是后缀**的真子串（长度为 k-1），那么：
- P 的前 k-1 个字符 = P[1..j-1] 的后 k-1 个字符 = S[i-k+1..i-1]

所以我们可以直接让 j 跳到位置 k，继续用 P[k] 与 S[i] 比较，而 i 不需要回退！

**形式化定义：**

$$next[j] = \\begin{cases} 0 & j = 1 \\\\ \\max\\{k \\mid 1 < k < j \\text{ 且 } P[1..k-1] = P[j-k+1..j-1]\\} & \\text{此集合非空} \\\\ 1 & \\text{其他情况} \\end{cases}$$

通俗地说：
- **next[1] = 0**：第一个字符就失配，说明主串当前字符与模式串第一个字符都不匹配，需要 i 后移，j 仍为 1
- **next[j] = k**：表示 P[1..j-1] 中最长相等前后缀的长度为 k-1，失配时 j 跳到 k
- **next[j] = 1**：P[1..j-1] 中不存在相等的前后缀，失配时从模式串头部重新开始

**一句话总结：** next[j] 告诉我们"当第 j 个字符失配时，模式串应该滑动到哪个位置继续比较"。`,
      },
      {
        id: "next-array",
        title: "next 数组的手算方法",
        type: "walkthrough",
        content: `**以模式串 P = "abaabcac" 为例，逐步求 next 数组。**

串的下标从 1 开始。next[j] 的含义：P[1..j-1] 中最长相等真前缀和真后缀的长度 + 1。

**固定规则：**
- next[1] = 0（特殊标记，表示需要 i 后移）
- next[2] = 1（只有一个字符，无真前后缀）

**从 j=3 开始逐个计算：**

| j | 子串 P[1..j-1] | 所有真前缀 | 所有真后缀 | 最长相等前后缀 | next[j] |
|---|----------------|-----------|-----------|--------------|---------|
| 1 | — | — | — | — | 0 |
| 2 | "a" | 无 | 无 | 无（长度0） | 1 |
| 3 | "ab" | "a" | "b" | 无（长度0） | 1 |
| 4 | "aba" | "a","ab" | "a","ba" | "a"（长度1） | 2 |
| 5 | "abaa" | "a","ab","aba" | "a","aa","baa" | "a"（长度1） | 2 |
| 6 | "abaab" | "a","ab","aba","abaa" | "b","ab","aab","baab" | "ab"（长度2） | 3 |
| 7 | "abaabC" | "a","ab",..."abaab" | "c","bc",..."baabC" | 无（长度0） | 1 |
| 8 | "abaabca" | "a","ab",..."abaabC" | "a","ca",..."baabca" | "a"（长度1） | 2 |

**最终结果：**

\`\`\`
位置 j:  1  2  3  4  5  6  7  8
模式串:  a  b  a  a  b  c  a  c
next[j]: 0  1  1  2  2  3  1  2
\`\`\`

**手算口诀：**
1. 写出 next[1]=0, next[2]=1
2. 对于 j≥3，取 P[1..j-1]，找其中最长的"既是前缀又是后缀"的真子串
3. 该子串长度 + 1 就是 next[j]
4. 找不到则 next[j] = 1`,
        steps: [
          {
            description: "初始化：next[1]=0, next[2]=1（这两个是固定值，直接写）",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0, 1, -1, -1, -1, -1, -1, -1], highlight: 1 },
          },
          {
            description: "j=3：看子串 P[1..2]=\"ab\"。真前缀{\"a\"}，真后缀{\"b\"}，无交集，最长相等长度=0 → next[3] = 0+1 = 1",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0, 1, 1, -1, -1, -1, -1, -1], highlight: 2 },
          },
          {
            description: "j=4：看子串 P[1..3]=\"aba\"。真前缀{\"a\",\"ab\"}，真后缀{\"a\",\"ba\"}，交集{\"a\"}，最长长度=1 → next[4] = 1+1 = 2",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0, 1, 1, 2, -1, -1, -1, -1], highlight: 3 },
          },
          {
            description: "j=5：看子串 P[1..4]=\"abaa\"。真前缀{\"a\",\"ab\",\"aba\"}，真后缀{\"a\",\"aa\",\"baa\"}，交集{\"a\"}，最长长度=1 → next[5] = 1+1 = 2",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0, 1, 1, 2, 2, -1, -1, -1], highlight: 4 },
          },
          {
            description: "j=6：看子串 P[1..5]=\"abaab\"。真前缀含\"ab\"，真后缀含\"ab\"，最长相等=\"ab\"，长度=2 → next[6] = 2+1 = 3",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0, 1, 1, 2, 2, 3, -1, -1], highlight: 5 },
          },
          {
            description: "j=7：看子串 P[1..6]=\"abaabC\"。c 与前面字符都不匹配，无相等前后缀，长度=0 → next[7] = 0+1 = 1",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0, 1, 1, 2, 2, 3, 1, -1], highlight: 6 },
          },
          {
            description: "j=8：看子串 P[1..7]=\"abaabca\"。真前缀含\"a\"，真后缀含\"a\"，最长相等=\"a\"，长度=1 → next[8] = 1+1 = 2",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0, 1, 1, 2, 2, 3, 1, 2], highlight: 7 },
          },
        ],
      },
      {
        id: "kmp-matching",
        title: "KMP 匹配算法",
        type: "detail",
        content: `**KMP 算法伪代码：**

\`\`\`
int KMP(String S, String P, int next[]) {
    int i = 1, j = 1;
    while (i <= S.length && j <= P.length) {
        if (j == 0 || S[i] == P[j]) {
            i++;  // 主串指针后移
            j++;  // 模式串指针后移
        } else {
            j = next[j];  // 模式串滑动，i 不回退！
        }
    }
    if (j > P.length)
        return i - P.length;  // 匹配成功，返回起始位置
    else
        return 0;  // 匹配失败
}
\`\`\`

**算法要点：**

1. **i 永远不回退**：这是 KMP 与朴素算法的本质区别
2. **j == 0 的处理**：当 next[j]=0 时（即 j 已经退到 0），说明模式串第一个字符就与 S[i] 不匹配，此时 i 和 j 都加 1（相当于 i 后移，j 回到 1）
3. **j = next[j]**：失配时模式串向右滑动，等价于让 j 跳到 next[j] 的位置

**匹配过程示例：**

主串 S = "acabaabaabcacaabc"，模式串 P = "abaabcac"

next = [0, 1, 1, 2, 2, 3, 1, 2]

\`\`\`
第1次比较：i=1,j=1  S[1]='a'=P[1]='a' ✓
第2次比较：i=2,j=2  S[2]='c'≠P[2]='b' ✗  j=next[2]=1
第3次比较：i=2,j=1  S[2]='c'≠P[1]='a' ✗  j=next[1]=0
第4次比较：j=0      i=3,j=1
第5次比较：i=3,j=1  S[3]='a'=P[1]='a' ✓
...（继续匹配）
\`\`\`

注意：当 j=0 时执行 i++, j++，这使得 i 前进到下一个字符，j 变为 1。`,
      },
      {
        id: "kmp-walkthrough",
        title: "KMP 完整匹配过程演示",
        type: "walkthrough",
        content: `以主串 S = "abaabcacabaabcac"，模式串 P = "abaabcac" 为例。

next = [0, 1, 1, 2, 2, 3, 1, 2]

演示 KMP 如何在不回退 i 的情况下完成匹配。`,
        steps: [
          {
            description: "开始匹配：i=1, j=1。逐个比较 S[i] 与 P[j]",
            state: { S: "abaabcacabaabcac", P: "abaabcac", i: 1, j: 1, status: "开始" },
          },
          {
            description: "i=1~5, j=1~5 连续匹配成功：S[1..5]=\"abaab\" = P[1..5]=\"abaab\"",
            state: { S: "abaabcacabaabcac", P: "abaabcac", i: 5, j: 5, matched: "abaab", status: "连续匹配" },
          },
          {
            description: "i=6, j=6：S[6]='c' = P[6]='c' ✓；i=7, j=7：S[7]='a' = P[7]='a' ✓；i=8, j=8：S[8]='c' = P[8]='c' ✓",
            state: { S: "abaabcacabaabcac", P: "abaabcac", i: 8, j: 8, matched: "abaabcac", status: "全部匹配成功" },
          },
          {
            description: "j=9 > P.length=8，匹配成功！返回位置 i - P.length = 9 - 8 = 1",
            state: { S: "abaabcacabaabcac", P: "abaabcac", result: "匹配成功，位置=1", status: "完成" },
          },
        ],
      },
      {
        id: "nextval-optimization",
        title: "nextval 数组优化",
        type: "walkthrough",
        content: `**为什么 next 数组还不够好？**

考虑模式串 P = "aaaab"，next = [0, 1, 2, 3, 4]。

当 S[i] ≠ P[4]='a' 时，按 next 数组 j 跳到 3，但 P[3]='a'，与 P[4] 相同，必然还是失配。继续跳到 2，P[2]='a'，还是失配。再跳到 1，P[1]='a'，还是失配。

**问题本质：** 当 P[j] == P[next[j]] 时，跳转后的比较一定失败。

**nextval 的计算规则：**
- 若 P[j] == P[next[j]]：nextval[j] = nextval[next[j]]（继续回退）
- 若 P[j] ≠ P[next[j]]：nextval[j] = next[j]（保持不变）
- nextval[1] = 0（固定）

以 P = "abaabcac" 为例，逐步计算 nextval：`,
        steps: [
          {
            description: "已知 next 数组，开始计算 nextval。nextval[1]=0（固定值）",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,-1,-1,-1,-1,-1,-1,-1], highlight: 0 },
          },
          {
            description: "j=2: P[2]='b', P[next[2]]=P[1]='a'。b≠a → nextval[2] = next[2] = 1",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,1,-1,-1,-1,-1,-1,-1], highlight: 1 },
          },
          {
            description: "j=3: P[3]='a', P[next[3]]=P[1]='a'。a==a → nextval[3] = nextval[1] = 0",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,1,0,-1,-1,-1,-1,-1], highlight: 2 },
          },
          {
            description: "j=4: P[4]='a', P[next[4]]=P[2]='b'。a≠b → nextval[4] = next[4] = 2",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,1,0,2,-1,-1,-1,-1], highlight: 3 },
          },
          {
            description: "j=5: P[5]='b', P[next[5]]=P[2]='b'。b==b → nextval[5] = nextval[2] = 1",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,1,0,2,1,-1,-1,-1], highlight: 4 },
          },
          {
            description: "j=6: P[6]='c', P[next[6]]=P[3]='a'。c≠a → nextval[6] = next[6] = 3",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,1,0,2,1,3,-1,-1], highlight: 5 },
          },
          {
            description: "j=7: P[7]='a', P[next[7]]=P[1]='a'。a==a → nextval[7] = nextval[1] = 0",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,1,0,2,1,3,0,-1], highlight: 6 },
          },
          {
            description: "j=8: P[8]='c', P[next[8]]=P[2]='b'。c≠b → nextval[8] = next[8] = 2。完成！",
            state: { pattern: ["a","b","a","a","b","c","a","c"], next: [0,1,1,2,2,3,1,2], nextval: [0,1,0,2,1,3,0,2], highlight: 7 },
          },
        ],
      },
      {
        id: "next-compute-code",
        title: "求 next 数组的算法",
        type: "detail",
        content: `**next 数组的程序化求法：**

手算适合考试做题，但理解程序化求法有助于深入理解 KMP 的递推思想。

\`\`\`
void GetNext(String P, int next[]) {
    int j = 1, k = 0;
    next[1] = 0;
    while (j < P.length) {
        if (k == 0 || P[j] == P[k]) {
            j++;
            k++;
            next[j] = k;
        } else {
            k = next[k];  // k 回退
        }
    }
}
\`\`\`

**算法思想：**

这其实是模式串对自身的一次 KMP 匹配！

- j 指向后缀的末尾位置
- k 指向前缀的末尾位置（也是当前已匹配的前缀长度）
- 当 P[j]==P[k] 时，说明前后缀可以延长，next[j+1] = k+1
- 当 P[j]≠P[k] 时，k 回退到 next[k]，尝试更短的前缀

**为什么 k = next[k]？**

这和 KMP 匹配时 j = next[j] 的道理完全一样：当前缀和后缀在位置 k 处失配时，我们已经知道前缀的前 k-1 个字符与后缀的对应部分匹配，所以可以利用 next[k] 跳到一个更短的前缀继续尝试。`,
      },
      {
        id: "complexity",
        title: "复杂度分析",
        type: "detail",
        content: `**时间复杂度：**

| 阶段 | 复杂度 | 说明 |
|------|--------|------|
| 求 next 数组 | O(m) | m 为模式串长度 |
| KMP 匹配 | O(n) | n 为主串长度 |
| **总计** | **O(n+m)** | |

**为什么求 next 是 O(m)？**

虽然有 while 循环和 k 的回退，但可以用摊还分析证明：
- j 从 1 增长到 m，共增加 m-1 次
- k 每次 j++ 时最多增加 1，所以 k 最多增加 m-1 次
- k = next[k] 每次至少让 k 减少 1，而 k 不会小于 0
- 所以 k 的回退总次数不超过 m-1 次

总操作次数 ≤ 2(m-1) = O(m)。

**为什么 KMP 匹配是 O(n)？**

同理：
- i 从 1 增长到 n，共增加 n 次
- j 的回退总次数不超过 n 次（每次 i++ 时 j 最多加 1，j 的回退不会让 j 小于 0）

总操作次数 ≤ 2n = O(n)。

**空间复杂度：** O(m)，用于存储 next 数组。

**与朴素算法的对比：**

| | 朴素匹配 | KMP |
|--|----------|-----|
| 最坏时间 | O(nm) | O(n+m) |
| 主串指针 | 会回退 | 不回退 |
| 预处理 | 无 | O(m) 求 next |
| 额外空间 | O(1) | O(m) |
| 适用场景 | 短串/随机串 | 长串/重复模式多 |

**注意：** 在实际应用中，如果主串和模式串都是随机字符串（字符集较大），朴素算法的平均复杂度接近 O(n+m)，KMP 的优势主要体现在最坏情况和字符集较小（如二进制串）的场景。`,
      },
      {
        id: "exam-points",
        title: "考研重点与易错点",
        type: "practice",
        content: `**一、高频考点：**

1. **手算 next 数组**（几乎每年必考）
   - 牢记：next[1]=0, next[2]=1
   - 对 j≥3，找 P[1..j-1] 的最长相等真前后缀长度，加 1
   - 注意是"真"前后缀（不能等于整个串本身）

2. **手算 nextval 数组**
   - 先求 next，再逐个判断 P[j] 是否等于 P[next[j]]
   - 相等则取 nextval[next[j]]，不等则保持 next[j]

3. **KMP 匹配过程模拟**
   - 给定主串和模式串，写出匹配过程中 i、j 的变化
   - 关键：i 不回退，失配时 j = next[j]

**二、常见陷阱：**

1. **下标起点问题**
   - 严蔚敏教材：下标从 1 开始，next[1]=0, next[2]=1
   - 部分教材/代码：下标从 0 开始，next[0]=-1, next[1]=0
   - 考试时务必看清题目约定！两种体系的 next 值差 1

2. **"前后缀"必须是"真"子串**
   - "abab" 的最长相等前后缀是 "ab"（长度2），不是 "abab"（那是自身，不算）
   - 空串也算前后缀（长度0），对应 next[j]=1

3. **next[j] 的含义混淆**
   - next[j] 不是"第 j 个字符的最长前后缀"
   - 而是"前 j-1 个字符组成的子串"的最长相等前后缀长度 + 1
   - 即 next[j] 描述的是 P[1..j-1]，不是 P[1..j]

4. **nextval 不是独立计算的**
   - nextval 必须先有 next 才能求
   - nextval[j] 的递归回退用的是 nextval（不是 next）

5. **KMP 不一定比朴素快**
   - 对于字符集大、模式串短的情况，朴素算法平均性能也很好
   - KMP 的优势在最坏情况保证和流式处理（主串不回退）

**三、选择题常考结论：**

- KMP 算法的时间复杂度为 O(n+m)
- next 数组仅与模式串有关，与主串无关
- KMP 算法中主串指针不回退
- 求 next 数组的过程本质上是模式串与自身的匹配
- next[1]=0 表示模式串需要右移一位（i++, j 回到 1）`,
      },
      {
        id: "comparison",
        title: "串匹配算法对比",
        type: "comparison",
        content: `| 对比维度 | 朴素匹配（BF） | KMP 算法 |
|----------|---------------|----------|
| 时间复杂度（最坏） | O(nm) | O(n+m) |
| 时间复杂度（平均） | 接近 O(n+m) | O(n+m) |
| 空间复杂度 | O(1) | O(m) |
| 主串指针是否回退 | 是 | 否 |
| 预处理 | 无 | 求 next 数组 O(m) |
| 实现难度 | 简单 | 较复杂 |
| 适用场景 | 短模式串、随机文本 | 长模式串、重复模式多 |

**KMP 的实际应用场景：**
- 文本编辑器的查找功能
- 网络入侵检测（在数据流中匹配特征串）
- DNA 序列匹配
- 编译器中的词法分析

**为什么考研重点考 KMP？**
- 它体现了"利用已有信息避免重复计算"的算法设计思想
- next 数组的求解过程体现了递推/动态规划的思想
- 手算 next 数组能考察对算法本质的理解
- 复杂度分析中的摊还分析是重要的分析技巧`,
      },
    ],
    exercises: [
      {
        id: "kmp-ex-01",
        title: "手算 next 数组",
        description: "求模式串 P = \"abcabd\" 的 next 数组（下标从 1 开始）。",
        difficulty: "easy",
        hints: [
          "next[1]=0, next[2]=1 是固定的",
          "对每个位置 j，看 P[1..j-1] 的最长相等前后缀",
          "\"abcab\" 的最长相等前后缀是 \"ab\"，长度为 2",
        ],
        referenceSolution: `模式串：a b c a b d
位置：    1 2 3 4 5 6

next[1] = 0（固定）
next[2] = 1（固定）
next[3]：看 "ab"，无相等前后缀 → next[3] = 1
next[4]：看 "abc"，无相等前后缀 → next[4] = 1
next[5]：看 "abca"，前缀"a" = 后缀"a"，长度1 → next[5] = 2
next[6]：看 "abcab"，前缀"ab" = 后缀"ab"，长度2 → next[6] = 3

答案：next = [0, 1, 1, 1, 2, 3]`,
      },
      {
        id: "kmp-ex-02",
        title: "手算 next 数组（进阶）",
        description: "求模式串 P = \"abaabcac\" 的 next 数组和 nextval 数组。",
        difficulty: "medium",
        hints: [
          "先逐个位置求 next",
          "\"abaa\" 的最长相等前后缀是 \"a\"（长度1），不是 \"ab\"",
          "求 nextval 时，若 P[j]==P[next[j]]，则 nextval[j]=nextval[next[j]]",
        ],
        referenceSolution: `模式串：a b a a b c a c
位置：    1 2 3 4 5 6 7 8

next 数组：
next[1]=0, next[2]=1, next[3]=1, next[4]=2, next[5]=2, next[6]=3, next[7]=1, next[8]=2

nextval 数组：
nextval[1]=0
nextval[2]=1（P[2]='b' ≠ P[1]='a'）
nextval[3]=0（P[3]='a' = P[1]='a'，取 nextval[1]=0）
nextval[4]=2（P[4]='a' ≠ P[2]='b'）
nextval[5]=1（P[5]='b' = P[2]='b'，取 nextval[2]=1）
nextval[6]=3（P[6]='c' ≠ P[3]='a'）
nextval[7]=0（P[7]='a' = P[1]='a'，取 nextval[1]=0）
nextval[8]=2（P[8]='c' ≠ P[2]='b'）

答案：
next    = [0, 1, 1, 2, 2, 3, 1, 2]
nextval = [0, 1, 0, 2, 1, 3, 0, 2]`,
      },
      {
        id: "kmp-ex-03",
        title: "KMP 匹配过程模拟",
        description: "主串 S = \"abcabcabdabba\"，模式串 P = \"abcabd\"，用 KMP 算法（使用 next 数组）模拟匹配过程，写出每次失配时 i 和 j 的值以及 j 的跳转。",
        difficulty: "medium",
        hints: [
          "先求出 P 的 next 数组：[0, 1, 1, 1, 2, 3]",
          "匹配过程中 i 永远不回退",
          "失配时 j = next[j]，若 j=0 则 i++, j=1",
        ],
        referenceSolution: `P 的 next = [0, 1, 1, 1, 2, 3]

第一轮匹配：
i=1~5 与 j=1~5 匹配成功（"abcab" 相同）
i=6, j=6: S[6]='c' ≠ P[6]='d'，失配
j = next[6] = 3

第二轮匹配：
i=6, j=3: S[6]='c' = P[3]='c'，匹配
i=7, j=4: S[7]='a' = P[4]='a'，匹配
i=8, j=5: S[8]='b' = P[5]='b'，匹配
i=9, j=6: S[9]='d' = P[6]='d'，匹配
j > P.length，匹配成功！

匹配位置 = i - P.length = 9 - 6 + 1 = 4（从第4个字符开始）`,
      },
      {
        id: "kmp-ex-04",
        title: "next 与 nextval 对比",
        description: "模式串 P = \"aaaab\"，分别求 next 数组和 nextval 数组，并说明 nextval 在什么情况下能减少比较次数。",
        difficulty: "hard",
        hints: [
          "连续相同字符的 next 值呈递增序列",
          "当 P[j]=P[next[j]] 时，用 next 会导致必然失败的比较",
          "nextval 通过递归回退避免了这些无效比较",
        ],
        referenceSolution: `模式串：a a a a b
位置：    1 2 3 4 5

next 数组：[0, 1, 2, 3, 4]
nextval 数组：[0, 0, 0, 0, 4]

分析：
当 S[i] ≠ P[4]='a' 时，用 next 数组：j 跳到 3，但 P[3]='a'，必然还是失配；
再跳到 2，P[2]='a'，还是失配；再跳到 1，P[1]='a'，还是失配；最后 j=0，i++。
做了 3 次无意义的比较！

用 nextval 数组：j 直接跳到 0（因为 P[4]=P[3]=P[2]=P[1]='a'，递归回退到 nextval[1]=0），
一步到位，i 直接后移。

结论：当模式串中有连续相同字符时，nextval 的优化效果最明显。`,
      },
    ],
  },
];
