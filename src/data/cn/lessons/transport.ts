import { Lesson } from "@/types";

export const transportLessons: Lesson[] = [
  {
    id: "tcp-udp",
    title: "TCP与UDP",
    brief: "面向连接与无连接传输协议的对比",
    analogy: "TCP 像打电话——先拨号建立连接，确认对方在听，说完再挂断；UDP 像寄明信片——写好就扔进邮筒，不管对方收没收到。",
    commonMistakes: [
      "TCP 的可靠不是指不丢包——是指丢了会重传，最终保证数据完整有序到达",
      "UDP 不是不好——实时视频、DNS 查询用 UDP 更合适（低延迟比可靠更重要）",
      "TCP 是全双工的——建立连接后双方可以同时发送数据",
    ],
    memoryAids: [
      "TCP 三次握手：SYN → SYN+ACK → ACK（你好→你好我收到了→好的开始吧）",
      "TCP 四次挥手：FIN → ACK → FIN → ACK（我说完了→知道了→我也说完了→好的再见）",
      "为什么不能两次握手？防止已失效的连接请求突然到达服务器",
    ],
    sections: [
      {
        id: "comparison",
        title: "TCP与UDP对比",
        type: "comparison",
        content: `## TCP vs UDP

| 特性 | TCP | UDP |
|------|-----|-----|
| 连接 | 面向连接 | 无连接 |
| 可靠性 | 可靠传输 | 尽最大努力交付 |
| 有序性 | 保证有序 | 不保证有序 |
| 传输方式 | 字节流 | 报文(数据报) |
| 通信模式 | 点对点 | 支持一对多、多对多 |
| 首部开销 | 20字节(最小) | 8字节(固定) |
| 流量控制 | 有(滑动窗口) | 无 |
| 拥塞控制 | 有 | 无 |

### TCP适用场景

- 文件传输(FTP)
- 网页浏览(HTTP)
- 电子邮件(SMTP)
- 远程登录(Telnet/SSH)

### UDP适用场景

- DNS查询
- 实时音视频(RTP)
- 网络管理(SNMP)
- 直播/游戏`,
      },
      {
        id: "tcp-header",
        title: "TCP报文段格式",
        type: "detail",
        content: `## TCP首部格式（最小20字节）

| 字段 | 位数 | 说明 |
|------|------|------|
| 源端口 | 16 | 发送方端口号 |
| 目的端口 | 16 | 接收方端口号 |
| 序号(seq) | 32 | 本报文段数据第一个字节的编号 |
| 确认号(ack) | 32 | 期望收到的下一个字节编号 |
| 数据偏移 | 4 | 首部长度，单位4字节 |
| 保留 | 6 | 保留未用 |
| URG | 1 | 紧急指针有效 |
| ACK | 1 | 确认号有效 |
| PSH | 1 | 尽快交付应用层 |
| RST | 1 | 重置连接 |
| SYN | 1 | 同步序号（建立连接） |
| FIN | 1 | 释放连接 |
| 窗口 | 16 | 接收窗口大小(rwnd) |
| 校验和 | 16 | 首部+数据+伪首部 |
| 紧急指针 | 16 | 紧急数据的末尾位置 |

### UDP首部格式（固定8字节）

| 字段 | 位数 | 说明 |
|------|------|------|
| 源端口 | 16 | 发送方端口号 |
| 目的端口 | 16 | 接收方端口号 |
| 长度 | 16 | UDP数据报总长度 |
| 校验和 | 16 | 可选（IPv4）/必须（IPv6） |`,
      },
    ],
    exercises: [
      {
        id: "ex-tcp-udp",
        title: "协议选择",
        description: "判断以下应用应该使用TCP还是UDP，并说明原因：(1) 在线视频会议 (2) 网上银行转账 (3) DNS域名查询 (4) 大文件下载",
        difficulty: "easy",
        hints: [
          "考虑实时性要求和可靠性要求的权衡",
          "DNS查询通常是短报文",
          "银行转账对数据完整性要求极高",
        ],
        referenceSolution: "(1) 视频会议 - UDP：实时性要求高，允许少量丢包，重传反而会增加延迟\n(2) 网上银行 - TCP：数据完整性和可靠性要求极高，不允许任何数据丢失\n(3) DNS查询 - UDP：请求和响应都很短，一个UDP报文即可完成，无需建立连接的开销\n(4) 大文件下载 - TCP：需要可靠传输保证文件完整性，需要流量控制和拥塞控制",
      },
    ],
    keyTakeaways: [
      "TCP面向连接、可靠、字节流；UDP无连接、不可靠、数据报",
      "TCP首部最小20字节，UDP首部固定8字节",
      "TCP的序号和确认号以字节为单位",
      "选择TCP还是UDP取决于应用对可靠性和实时性的需求",
    ],
  },
  {
    id: "tcp-connection",
    title: "TCP连接管理",
    brief: "三次握手建立连接与四次挥手释放连接",
    sections: [
      {
        id: "three-way",
        title: "三次握手",
        type: "walkthrough",
        content: `## TCP三次握手 (Three-Way Handshake)

建立TCP连接需要三次报文交换，确保双方都能确认对方的发送和接收能力。`,
        steps: [
          {
            description: "初始状态：客户端CLOSED，服务器LISTEN",
            state: { client: "CLOSED", server: "LISTEN" },
          },
          {
            description: "第一次握手：客户端发送 SYN=1, seq=x。客户端进入 SYN-SENT 状态。\n含义：客户端请求建立连接，告知初始序号x。",
            state: { client: "SYN-SENT", server: "LISTEN", message: "SYN=1, seq=x" },
          },
          {
            description: "第二次握手：服务器发送 SYN=1, ACK=1, seq=y, ack=x+1。服务器进入 SYN-RCVD 状态。\n含义：服务器同意连接，告知自己的初始序号y，确认收到客户端的SYN。",
            state: { client: "SYN-SENT", server: "SYN-RCVD", message: "SYN=1, ACK=1, seq=y, ack=x+1" },
          },
          {
            description: "第三次握手：客户端发送 ACK=1, seq=x+1, ack=y+1。双方进入 ESTABLISHED 状态。\n含义：客户端确认收到服务器的SYN，连接建立完成。",
            state: { client: "ESTABLISHED", server: "ESTABLISHED", message: "ACK=1, seq=x+1, ack=y+1" },
          },
        ],
      },
      {
        id: "why-three",
        title: "为什么是三次握手",
        type: "concept",
        content: `## 为什么不能是两次握手？

### 核心原因：防止已失效的连接请求到达服务器

场景：
1. 客户端发送第一个SYN（seq=x），因网络延迟滞留
2. 客户端超时重发第二个SYN（seq=x'），成功建立连接并完成通信
3. 之后第一个SYN到达服务器

如果是两次握手：
- 服务器收到旧SYN后直接进入ESTABLISHED，分配资源
- 但客户端不会响应（它没有发起这个连接）
- 服务器资源被浪费

如果是三次握手：
- 服务器收到旧SYN后发送SYN+ACK
- 客户端收到后发现不是自己发起的连接，发送RST拒绝
- 服务器释放资源，不会浪费

### 三次握手的本质

确保双方都能确认：
- 第一次：服务器确认"客户端能发"
- 第二次：客户端确认"服务器能收能发"
- 第三次：服务器确认"客户端能收"`,
      },
      {
        id: "four-way",
        title: "四次挥手与TIME_WAIT",
        type: "detail",
        content: `## TCP四次挥手 (Four-Way Handshake)

### 过程

1. **第一次挥手**：客户端发送 FIN=1, seq=u -> FIN-WAIT-1
2. **第二次挥手**：服务器发送 ACK=1, ack=u+1 -> CLOSE-WAIT（客户端 -> FIN-WAIT-2）
3. **第三次挥手**：服务器发送 FIN=1, seq=w -> LAST-ACK
4. **第四次挥手**：客户端发送 ACK=1, ack=w+1 -> TIME-WAIT（等待2MSL后CLOSED）

### 为什么需要四次？

TCP是全双工的，每个方向的连接需要单独关闭：
- 前两次关闭客户端->服务器方向
- 后两次关闭服务器->客户端方向
- 服务器收到FIN后可能还有数据要发送，所以ACK和FIN分开发送

### TIME-WAIT 状态（等待2MSL）

MSL (Maximum Segment Lifetime)：报文段最大生存时间。

**为什么需要TIME-WAIT？**

1. **确保最后一个ACK到达**：如果最后的ACK丢失，服务器会重发FIN，客户端需要能够重发ACK
2. **让旧连接的报文段消失**：等待2MSL确保本连接的所有报文段都从网络中消失，不会影响新连接

### 状态转换关键

- CLOSE-WAIT：被动关闭方收到FIN后的状态（半关闭）
- TIME-WAIT：主动关闭方发送最后ACK后的状态
- 2MSL通常为2分钟（RFC建议MSL=2分钟）`,
      },
    ],
    exercises: [
      {
        id: "ex-handshake",
        title: "连接管理分析",
        description: "在TCP三次握手过程中，如果第三次握手的ACK丢失了，会发生什么？客户端和服务器分别处于什么状态？",
        difficulty: "medium",
        hints: [
          "客户端发送ACK后认为连接已建立",
          "服务器没收到ACK，仍在SYN-RCVD状态",
          "考虑超时重传机制",
        ],
        referenceSolution: "第三次握手ACK丢失后：\n- 客户端：已进入ESTABLISHED状态，认为连接建立成功\n- 服务器：仍在SYN-RCVD状态，等待ACK\n\n后续处理：\n1. 服务器超时后重传SYN+ACK\n2. 客户端收到重传的SYN+ACK后，重新发送ACK\n3. 如果客户端先发送数据，数据报文中ACK=1，服务器收到后也会进入ESTABLISHED\n4. 如果服务器多次重传仍未收到ACK，最终会关闭连接",
      },
    ],
    keyTakeaways: [
      "三次握手防止已失效的连接请求建立错误连接",
      "四次挥手因为TCP全双工，每个方向单独关闭",
      "TIME-WAIT等待2MSL确保ACK到达和旧报文消失",
      "SYN和FIN都要消耗一个序号",
    ],
    relatedLessons: ["tcp-udp"],
  },
  {
    id: "tcp-congestion",
    title: "TCP拥塞控制",
    brief: "慢开始、拥塞避免、快重传与快恢复",
    sections: [
      {
        id: "congestion-overview",
        title: "拥塞控制概述",
        type: "concept",
        content: `## 拥塞控制 vs 流量控制

| | 拥塞控制 | 流量控制 |
|--|---------|---------|
| 目的 | 防止网络过载 | 防止接收方过载 |
| 范围 | 全局性（整个网络） | 点对点（发送方与接收方） |
| 窗口 | 拥塞窗口 cwnd | 接收窗口 rwnd |

**发送窗口 = min(cwnd, rwnd)**

### 拥塞控制的四个阶段

1. **慢开始** (Slow Start)
2. **拥塞避免** (Congestion Avoidance)
3. **快重传** (Fast Retransmit)
4. **快恢复** (Fast Recovery)

### 关键变量

- **cwnd**：拥塞窗口，发送方维护
- **ssthresh**：慢开始门限值
- **MSS**：最大报文段长度`,
      },
      {
        id: "cwnd-walkthrough",
        title: "cwnd变化过程",
        type: "walkthrough",
        content: `## 拥塞窗口变化过程演示

假设初始 ssthresh = 16 MSS`,
        steps: [
          {
            description: "慢开始阶段：cwnd从1开始，每收到一个ACK，cwnd加1。每个RTT后cwnd翻倍。\ncwnd: 1 -> 2 -> 4 -> 8 -> 16",
            state: { cwnd: 1, phase: "slow-start", ssthresh: 16 },
          },
          {
            description: "cwnd = 16 = ssthresh，进入拥塞避免阶段。每个RTT后cwnd加1。\ncwnd: 16 -> 17 -> 18 -> 19 -> 20 -> ...",
            state: { cwnd: 16, phase: "congestion-avoidance", ssthresh: 16 },
          },
          {
            description: "假设cwnd=24时发生超时（网络拥塞）。\n处理：ssthresh = cwnd/2 = 12，cwnd重置为1，重新慢开始。",
            state: { cwnd: 1, phase: "slow-start", ssthresh: 12, event: "timeout" },
          },
          {
            description: "慢开始：cwnd: 1 -> 2 -> 4 -> 8 -> 12（达到新ssthresh）\n进入拥塞避免：cwnd: 12 -> 13 -> 14 -> ...",
            state: { cwnd: 12, phase: "congestion-avoidance", ssthresh: 12 },
          },
          {
            description: "假设cwnd=16时收到3个重复ACK（快重传触发）。\n快重传：立即重传丢失的报文段（不等超时）。\n快恢复：ssthresh = cwnd/2 = 8，cwnd = ssthresh = 8（不是重置为1！），直接进入拥塞避免。",
            state: { cwnd: 8, phase: "congestion-avoidance", ssthresh: 8, event: "3-dup-ack" },
          },
          {
            description: "继续拥塞避免：cwnd: 8 -> 9 -> 10 -> ...\n\n总结：超时 -> cwnd=1（慢开始）；3个重复ACK -> cwnd=ssthresh（快恢复，直接拥塞避免）",
            state: { cwnd: 8, phase: "congestion-avoidance", ssthresh: 8 },
          },
        ],
      },
      {
        id: "algorithms-detail",
        title: "四种算法详解",
        type: "detail",
        content: `## 慢开始 (Slow Start)

- 初始 cwnd = 1 MSS
- 每收到一个ACK，cwnd += 1 MSS
- 效果：每个RTT后 cwnd 翻倍（指数增长）
- 直到 cwnd >= ssthresh 时转入拥塞避免

## 拥塞避免 (Congestion Avoidance)

- 每个RTT后 cwnd += 1 MSS（线性增长）
- 也称为"加法增大"(Additive Increase)

## 快重传 (Fast Retransmit)

- 接收方收到失序报文段时立即发送重复ACK
- 发送方收到**3个重复ACK**后立即重传（不等超时）
- 目的：更快地检测丢包

## 快恢复 (Fast Recovery)

- 收到3个重复ACK时：
  - ssthresh = cwnd / 2
  - cwnd = ssthresh（而非1）
  - 直接进入拥塞避免
- 与超时的区别：超时说明网络严重拥塞（cwnd=1），3个重复ACK说明网络还能传输一些报文段

## 总结对比

| 事件 | ssthresh | cwnd | 进入阶段 |
|------|----------|------|----------|
| 超时 | cwnd/2 | 1 | 慢开始 |
| 3个重复ACK | cwnd/2 | ssthresh | 拥塞避免 |`,
      },
    ],
    exercises: [
      {
        id: "ex-congestion",
        title: "拥塞窗口变化",
        description: "TCP连接初始ssthresh=8。请写出以下过程中cwnd的变化：从cwnd=1开始传输，在cwnd=12时发生超时，之后在cwnd=6时收到3个重复ACK。",
        difficulty: "hard",
        hints: [
          "慢开始阶段cwnd每RTT翻倍",
          "超时后ssthresh=cwnd/2, cwnd=1",
          "3个重复ACK后ssthresh=cwnd/2, cwnd=ssthresh",
        ],
        referenceSolution: "阶段1 - 慢开始(ssthresh=8):\ncwnd: 1->2->4->8(达到ssthresh)\n\n阶段2 - 拥塞避免:\ncwnd: 8->9->10->11->12(超时!)\n\n超时处理: ssthresh=12/2=6, cwnd=1\n\n阶段3 - 慢开始(ssthresh=6):\ncwnd: 1->2->4->6(达到ssthresh)\n\n阶段4 - 拥塞避免:\ncwnd=6时收到3个重复ACK\n\n快恢复: ssthresh=6/2=3, cwnd=3\n\n阶段5 - 拥塞避免(ssthresh=3):\ncwnd: 3->4->5->...",
      },
    ],
    keyTakeaways: [
      "慢开始指数增长，拥塞避免线性增长",
      "超时：cwnd=1，重新慢开始（网络严重拥塞）",
      "3个重复ACK：cwnd=ssthresh，快恢复进入拥塞避免",
      "发送窗口 = min(cwnd, rwnd)",
    ],
    relatedLessons: ["tcp-connection", "tcp-udp"],
  },
  {
    id: "tcp-flow-control",
    title: "TCP流量控制",
    brief: "滑动窗口机制实现端到端流量控制，防止发送方淹没接收方",
    analogy: "TCP流量控制像水龙头和水桶——接收方的水桶（缓冲区）快满了就喊「关小点」（减小rwnd），水桶空了就喊「开大点」（增大rwnd）。如果水桶满了就喊「关掉」（rwnd=0），等有空间了再通知「可以开了」（发送非零窗口通知）。",
    prerequisites: ["TCP与UDP", "TCP连接管理"],
    commonMistakes: [
      "流量控制和拥塞控制不同——流量控制是端到端（怕接收方来不及），拥塞控制是全局的（怕网络来不及）",
      "rwnd=0时发送方不是完全停止——还会定期发送零窗口探测报文",
      "滑动窗口的大小是动态变化的——接收方通过ACK中的窗口字段通告",
      "确认号表示的是「期望收到的下一个字节」——不是「已收到的最后一个字节」",
      "发送窗口不一定等于接收窗口——发送窗口 = min(cwnd, rwnd)",
    ],
    memoryAids: [
      "发送窗口 = min(拥塞窗口cwnd, 接收窗口rwnd)",
      "rwnd由接收方在ACK中通告，cwnd由发送方根据网络状况调整",
      "零窗口→死锁风险→解决：持续计时器 + 零窗口探测报文",
      "Nagle算法：小数据攒一攒再发（减少小包），糊涂窗口综合征：别通告太小的窗口",
    ],
    keyTakeaways: [
      "TCP用滑动窗口实现流量控制，接收方通过rwnd控制发送速率",
      "发送窗口内的数据可以连续发送，不必逐个等待确认",
      "接收方缓冲区剩余空间 = rwnd，通过ACK报文通告给发送方",
      "rwnd=0时启动持续计时器，定期发送探测报文防止死锁",
      "实际发送窗口 = min(cwnd, rwnd)，同时受流量控制和拥塞控制约束",
    ],
    relatedLessons: ["tcp-congestion", "tcp-udp"],
    sections: [
      {
        id: "sliding-window",
        title: "滑动窗口机制",
        type: "concept",
        content: `## 滑动窗口的基本原理

TCP的滑动窗口以**字节**为单位。

### 发送方维护的窗口

\`\`\`
已确认 | 已发送未确认 | 可以发送 | 不能发送
       |<--- 发送窗口 --->|
\`\`\`

- 发送窗口左边界：最早的未确认字节
- 发送窗口大小：由接收方通告的rwnd和拥塞窗口cwnd共同决定
- 收到ACK后窗口右移（"滑动"）

### 接收方维护的窗口

\`\`\`
已交付应用层 | 已接收未交付 | 可接收 | 不可接收
             |<-- 接收窗口(rwnd) -->|
\`\`\`

- 接收窗口 = 接收缓冲区剩余空间
- 每次发送ACK时，在窗口字段中通告当前rwnd值

## 窗口与确认的关系

- TCP使用**累积确认**：ACK确认号表示"该序号之前的所有字节都已收到"
- 收到ACK后，发送窗口左边界移动到确认号位置
- 接收方可以延迟确认（攒几个一起确认），但不超过500ms`,
      },
      {
        id: "flow-control-process",
        title: "流量控制过程",
        type: "walkthrough",
        content: `A向B发送数据，B的接收缓冲区为400字节`,
        steps: [
          {
            description: "初始：B通告rwnd=400，A的发送窗口=400",
            state: { rwnd: 400, sent: 0, acked: 0, phase: "init" },
          },
          {
            description: "A发送200字节(seq=1~200)，发送窗口剩余200字节可发",
            state: { rwnd: 400, sent: 200, acked: 0, phase: "send-1" },
          },
          {
            description: "B收到200字节，应用层取走100字节。B回复ACK=201, rwnd=300（缓冲区剩300）",
            state: { rwnd: 300, sent: 200, acked: 200, phase: "ack-1" },
          },
          {
            description: "A发送300字节(seq=201~500)，发送窗口用完",
            state: { rwnd: 300, sent: 500, acked: 200, phase: "send-2" },
          },
          {
            description: "B收到300字节，应用层未取走。缓冲区满！B回复ACK=501, rwnd=0",
            state: { rwnd: 0, sent: 500, acked: 500, phase: "zero-window" },
          },
          {
            description: "A收到rwnd=0，停止发送，启动持续计时器。定期发送1字节的零窗口探测报文",
            state: { rwnd: 0, phase: "persist-timer", note: "防止死锁" },
          },
          {
            description: "B应用层取走数据后，回复rwnd=200。A恢复发送",
            state: { rwnd: 200, phase: "resume" },
          },
        ],
      },
      {
        id: "special-issues",
        title: "流量控制的特殊问题",
        type: "detail",
        content: `## 零窗口与死锁

**问题**：B发送rwnd=0后，A停止发送。之后B有空间了发送rwnd≠0的通知，但该通知丢失了→A一直等B的通知，B一直等A的数据→死锁。

**解决**：A收到rwnd=0后启动**持续计时器**(Persistence Timer)，超时后发送**零窗口探测报文**(1字节)。B收到后回复当前rwnd值。

## 糊涂窗口综合征 (Silly Window Syndrome)

**问题**：接收方每次只腾出很小的空间就通告，发送方发很小的报文段→大量小包，效率极低（TCP头部20字节，数据可能只有几字节）。

**解决**：
- **接收方**：等到缓冲区有足够空间（≥MSS 或 ≥缓冲区一半）才通告非零窗口
- **发送方(Nagle算法)**：攒够一个MSS或收到前一个ACK后才发送

## Nagle算法

- 第一个小包立即发送
- 之后的小数据先缓存，等到：(1)攒够MSS，或(2)收到前一个数据的ACK
- 适合交互式应用（如SSH），但对实时性要求高的场景可能需要关闭(TCP_NODELAY)`,
      },
    ],
    exercises: [
      {
        id: "flow-ex1",
        title: "滑动窗口计算",
        description: "TCP连接中，发送方收到ACK确认号为501，接收窗口rwnd=300。当前拥塞窗口cwnd=500。求：(1) 发送窗口大小 (2) 发送方可以发送的字节范围 (3) 如果已经发送了seq=501~700的数据但未确认，还能发送多少字节？",
        difficulty: "medium" as const,
        hints: ["发送窗口 = min(cwnd, rwnd)", "可发送范围从确认号开始", "已发送未确认的占用窗口空间"],
        referenceSolution: "(1) 发送窗口 = min(cwnd, rwnd) = min(500, 300) = 300字节\n(2) 可发送字节范围：501~800（从确认号501开始，窗口大小300）\n(3) 已发送501~700共200字节占用窗口，剩余可发送 = 300-200 = 100字节（即701~800）",
      },
    ],
  },
  {
    id: "udp-checksum",
    title: "UDP校验和计算",
    brief: "UDP校验和的计算方法，伪首部的作用，与TCP校验和的对比",
    keyTakeaways: [
      "UDP校验和覆盖伪首部+UDP首部+数据，检测传输错误",
      "伪首部包含源IP、目的IP、协议号、UDP长度，用于验证数据报未被错误交付",
      "计算方法：将数据按16位分组，反码求和，结果取反",
      "UDP校验和是可选的（IPv4中），IPv6中强制使用",
      "校验和只能检错不能纠错，发现错误则丢弃",
    ],
    commonMistakes: [
      "忘记伪首部参与校验和计算（伪首部不实际传输）",
      "混淆UDP校验和的可选性：IPv4可选，IPv6强制",
      "认为校验和能纠正错误（只能检测）",
    ],
    sections: [
      {
        id: "udp-checksum-concept",
        title: "UDP校验和原理",
        type: "concept",
        content: `## 为什么需要校验和

数据在传输过程中可能因噪声、干扰等原因出现比特翻转。校验和是一种轻量级的错误检测机制——发送方算一个"指纹"附在数据后面，接收方重新算一遍，对不上就说明数据被篡改了。

## 伪首部（Pseudo Header）

UDP校验和计算时需要加上一个**伪首部**，它不实际传输，仅用于计算。

\`\`\`
伪首部（12字节）：
┌──────────────────────────────┐
│      源 IP 地址 (32位)        │
├──────────────────────────────┤
│      目的 IP 地址 (32位)      │
├──────┬───────┬───────────────┤
│ 0x00 │ 0x11  │  UDP长度       │
│(8位) │(协议) │  (16位)        │
└──────┴───────┴───────────────┘
\`\`\`

为什么要加伪首部？想象一封信被邮局送错了地址——信的内容没有损坏，但收件人不对。伪首部把源IP和目的IP也纳入校验，确保数据报不仅内容完整，而且确实是发给"我"的。

## 校验和计算步骤

1. 构造伪首部
2. 将校验和字段置0
3. 将 伪首部 + UDP首部 + 数据 按**16位**为单位分组
4. 如果数据长度为奇数字节，末尾补0凑偶数
5. 所有16位字进行**反码求和**（进位回卷）
6. 结果取**反码**，填入校验和字段

### 什么是"反码求和，进位回卷"？

普通加法：0xFFFF + 0x0001 = 0x10000（17位，溢出了）

反码求和的规则：**如果加法产生了进位（第17位），把进位加回到低16位**。

\`\`\`
  0xFFFF + 0x0001 = 0x10000
  进位回卷：0x0000 + 0x0001 = 0x0001
\`\`\`

再举一个例子：
\`\`\`
  0xF123 + 0x4000 = 0x13123  （无进位，不需要回卷）
  等等，0xF123 + 0x4000 = 0x13123？不对。
  0xF123 + 0x4000 = 0x13123 → 有进位1
  回卷：0x3123 + 0x0001 = 0x3124
\`\`\`

本质上，反码求和等价于把所有数据看作一个大整数，对 0xFFFF 取模再加上商。这样设计的好处是：**与字节序无关**，且计算简单（硬件友好）。

## 接收方验证

接收方对 伪首部+UDP首部+数据 的所有16位字（包括校验和字段）进行反码求和：
- 结果为 0xFFFF（全1）→ 无错误
- 结果非全1 → 有错误，丢弃

为什么全1就对？因为发送方存入的校验和是求和结果的反码，加上原来的和恰好得到全1。

## UDP vs TCP 校验和

| 特性 | UDP | TCP |
|------|-----|-----|
| 是否必须 | IPv4可选，IPv6强制 | 强制 |
| 覆盖范围 | 伪首部+首部+数据 | 伪首部+首部+数据 |
| 计算方法 | 相同（反码求和） | 相同 |
| 错误处理 | 丢弃（或交付并标记） | 丢弃并重传 |

IPv6为什么强制UDP校验和？因为IPv6取消了IP首部校验和（为了加速路由器转发），端到端的完整性检测只能靠传输层自己保证。`,
      },
      {
        id: "udp-checksum-example",
        title: "校验和计算示例",
        type: "walkthrough",
        content: "计算一个简单UDP数据报的校验和",
        steps: [
          {
            description: "假设要发送的UDP数据为 0x4500 0x003C（简化示例，实际包含伪首部）",
            state: { data: ["0x4500", "0x003C"], step: "准备数据" },
          },
          {
            description: "将两个16位字相加：0x4500 + 0x003C = 0x453C",
            state: { sum: "0x453C", carry: "无进位" },
          },
          {
            description: "如果有进位（超过16位），将进位加回低16位。本例无进位。",
            state: { sum: "0x453C", note: "进位回卷：高16位加到低16位" },
          },
          {
            description: "对结果取反码：~0x453C = 0xBAC3，这就是校验和",
            state: { checksum: "0xBAC3", verify: "接收方求和应得0xFFFF" },
          },
        ],
      },
    ],
    exercises: [
      {
        id: "udp-cksum-ex1",
        title: "UDP校验和",
        description: "回答以下问题：\n(1) UDP校验和计算为什么要包含伪首部？伪首部包含哪些字段？\n(2) 如果接收方计算校验和的结果不是全1，说明什么？应如何处理？\n(3) UDP校验和在IPv4和IPv6中的使用有什么区别？",
        difficulty: "easy" as const,
        hints: [
          "伪首部包含IP层信息",
          "校验和只能检错",
          "IPv6去掉了IP首部校验和",
        ],
        referenceSolution: `(1) 包含伪首部是为了验证数据报被正确交付——确认源IP、目的IP和协议号正确，防止IP层路由错误导致数据被错误交付。伪首部包含：源IP地址(32位)、目的IP地址(32位)、全零(8位)、协议号(8位，UDP=17)、UDP长度(16位)，共12字节。

(2) 结果不是全1说明数据在传输过程中发生了比特错误。UDP的处理方式是直接丢弃该数据报（或者交付给上层并标记为有错误）。UDP不提供重传机制，可靠性由应用层保证。

(3) 在IPv4中，UDP校验和是可选的（校验和字段为0表示未计算）。在IPv6中，UDP校验和是强制的，因为IPv6取消了IP首部校验和，需要UDP自己保证端到端的完整性检测。`,
      },
    ],
    relatedLessons: ["tcp-flow-congestion"],
  },
];
