import { Lesson } from "@/types";

export const applicationLessons: Lesson[] = [
  {
    id: "dns-http",
    title: "DNS与HTTP",
    brief: "域名系统的查询机制与HTTP协议工作原理",
    analogy: "DNS像电话簿——你记得名字（域名），电话簿帮你查号码（IP地址）。而且这个电话簿是分级的：先问本地114，不知道就问省级，再问全国总台。HTTP像点菜——客户端发请求（菜单上指一道菜），服务器返回响应（把菜端上来），吃完这一口连接就可以断了（无状态）。",
    prerequisites: ["TCP/IP体系结构", "传输层基本概念"],
    commonMistakes: [
      "DNS用的是UDP不是TCP（大多数情况）——只有区域传送等大数据量时才用TCP",
      "递归查询和迭代查询别搞混——主机向本地DNS是递归，本地DNS向外查是迭代",
      "HTTP/1.1默认持久连接——不是每次请求都要三次握手（HTTP/1.0才是非持久的）",
      "Cookie不是HTTP协议的一部分——是通过HTTP头部字段实现的状态管理机制",
    ],
    memoryAids: [
      "DNS查询：主机→本地DNS（递归）→根→顶级→权威（迭代）",
      "HTTP方法：GET取、POST交、PUT改、DELETE删",
      "HTTP状态码：2xx成功、3xx重定向、4xx客户端错、5xx服务器错",
      "DNS端口53，HTTP端口80，HTTPS端口443",
    ],
    sections: [
      {
        id: "dns",
        title: "DNS域名系统",
        type: "concept",
        content: `## DNS (Domain Name System)

### 功能

将域名解析为IP地址（正向解析），或将IP地址解析为域名（反向解析）。

### 域名层次结构

根域 -> 顶级域(TLD) -> 二级域 -> 三级域 -> ...

例如：www.example.com.
- 根域：. (通常省略)
- 顶级域：com
- 二级域：example
- 三级域：www

### DNS查询方式

#### 递归查询

- 客户端向本地DNS服务器发起递归查询
- 本地DNS服务器负责完成全部解析过程
- 客户端只需等待最终结果

#### 迭代查询

- 本地DNS服务器向根/TLD/权威服务器发起迭代查询
- 每个服务器返回"下一步该问谁"
- 本地DNS服务器逐步追踪

### 典型解析过程

1. 客户端 -> 本地DNS服务器（递归）
2. 本地DNS -> 根DNS服务器（迭代）-> 返回TLD服务器地址
3. 本地DNS -> TLD服务器（迭代）-> 返回权威服务器地址
4. 本地DNS -> 权威DNS服务器（迭代）-> 返回最终IP
5. 本地DNS -> 客户端（返回结果并缓存）

### DNS缓存

- 每条记录都有TTL（生存时间）
- 本地DNS服务器和客户端都会缓存
- 缓存减少了查询延迟和根服务器负载`,
      },
      {
        id: "http",
        title: "HTTP协议",
        type: "detail",
        content: `## HTTP (HyperText Transfer Protocol)

### 基本特点

- 基于TCP（默认端口80，HTTPS为443）
- 无状态协议（每次请求独立）
- 请求-响应模式

### HTTP请求报文格式

\`\`\`
请求行：方法 URL HTTP版本
首部行：字段名: 值
         ...
空行
请求体(可选)
\`\`\`

常用方法：GET、POST、PUT、DELETE、HEAD

### HTTP响应报文格式

\`\`\`
状态行：HTTP版本 状态码 短语
首部行：字段名: 值
         ...
空行
响应体
\`\`\`

### 常见状态码

| 状态码 | 含义 |
|--------|------|
| 200 | OK，请求成功 |
| 301 | 永久重定向 |
| 302 | 临时重定向 |
| 304 | 未修改（使用缓存） |
| 404 | 未找到 |
| 500 | 服务器内部错误 |

### 持久连接 vs 非持久连接

**非持久连接 (HTTP/1.0)**：
- 每个请求/响应后关闭TCP连接
- 每个对象需要2个RTT（建立连接1个 + 请求响应1个）

**持久连接 (HTTP/1.1)**：
- 多个请求/响应复用同一TCP连接
- 流水线方式：不必等待上一个响应就发送下一个请求
- 显著减少延迟

### Cookie与Session

- Cookie：服务器发给客户端的小数据，客户端后续请求携带
- Session：服务器端保存的会话状态
- 用于解决HTTP无状态的问题`,
      },
    ],
    exercises: [
      {
        id: "ex-dns-http",
        title: "DNS与HTTP综合",
        description: "用户在浏览器输入 www.example.com 并按回车，请描述从DNS解析到收到网页内容的完整过程（假设使用HTTP/1.1持久连接，本地无缓存）。",
        difficulty: "medium",
        hints: [
          "先进行DNS解析获取IP地址",
          "然后建立TCP连接（三次握手）",
          "最后发送HTTP请求并接收响应",
        ],
        referenceSolution: "1. DNS解析：\n   - 浏览器检查本地缓存（无）\n   - 向本地DNS服务器发起递归查询\n   - 本地DNS通过迭代查询（根->TLD->权威）获得IP\n   - 返回IP地址给浏览器\n\n2. 建立TCP连接：\n   - 浏览器与服务器进行三次握手\n   - 耗时1个RTT\n\n3. HTTP请求/响应：\n   - 浏览器发送GET / HTTP/1.1请求\n   - 服务器返回HTML页面（200 OK）\n   - 浏览器解析HTML，发现需要加载CSS/JS/图片\n   - 通过同一TCP连接（持久连接）继续请求这些资源\n\n4. 渲染页面：\n   - 浏览器根据HTML/CSS渲染页面\n   - 执行JavaScript",
      },
    ],
    keyTakeaways: [
      "DNS使用递归+迭代查询，本地DNS服务器是关键",
      "HTTP是无状态的请求-响应协议",
      "HTTP/1.1默认持久连接，减少TCP建立开销",
      "Cookie/Session解决HTTP无状态问题",
    ],
  },
  {
    id: "email-ftp",
    title: "电子邮件与FTP",
    brief: "SMTP/POP3/IMAP邮件协议与FTP文件传输",
    analogy: "电子邮件像传统邮政系统——SMTP是邮递员（负责发送和中转），POP3是你去邮局取信（取完邮局不留副本），IMAP是你在邮局看信（信还留在邮局，多个设备都能看）。FTP像搬家公司——专门负责搬运大件文件，还分了两辆车：一辆指挥车（控制连接）常驻，一辆货车（数据连接）搬完就走。",
    prerequisites: ["DNS与HTTP", "TCP连接的建立"],
    commonMistakes: [
      "SMTP只负责发送和中转——不负责接收（接收用POP3或IMAP）",
      "FTP用两个TCP连接——控制连接(21端口)始终保持，数据连接(20端口)传完就断",
      "POP3下载后默认删除服务器上的邮件——IMAP则保留，这是两者核心区别",
      "SMTP是推(push)协议——POP3/IMAP是拉(pull)协议",
    ],
    memoryAids: [
      "邮件发送链路：发件人→(SMTP)→发送方邮件服务器→(SMTP)→接收方邮件服务器→(POP3/IMAP)→收件人",
      "FTP端口：21控制，20数据（主动模式）",
      "SMTP端口25，POP3端口110，IMAP端口143",
    ],
    sections: [
      {
        id: "email",
        title: "电子邮件系统",
        type: "concept",
        content: `## 电子邮件系统组成

### 三个主要组件

1. **用户代理(UA)**：邮件客户端（如Outlook、Foxmail）
2. **邮件服务器**：存储和转发邮件
3. **邮件协议**：SMTP、POP3、IMAP

### 邮件发送与接收过程

发送方UA -> (SMTP) -> 发送方邮件服务器 -> (SMTP) -> 接收方邮件服务器 -> (POP3/IMAP) -> 接收方UA

### SMTP协议

- 用于**发送**邮件（UA->服务器，服务器->服务器）
- 基于TCP，端口25
- 推(Push)协议
- 只能传输7位ASCII文本（需要MIME扩展传输附件）
- 命令：HELO, MAIL FROM, RCPT TO, DATA, QUIT

### POP3协议 (Post Office Protocol v3)

- 用于**接收**邮件（服务器->UA）
- 基于TCP，端口110
- 拉(Pull)协议
- 下载并删除 / 下载并保留
- 简单，但不支持在服务器上管理邮件

### IMAP协议 (Internet Message Access Protocol)

- 用于**接收**邮件（服务器->UA）
- 基于TCP，端口143
- 支持在服务器上管理邮件（创建文件夹、标记已读等）
- 支持部分下载（只看标题）
- 比POP3功能更强大

### SMTP vs POP3/IMAP

| 协议 | 方向 | 类型 | 端口 |
|------|------|------|------|
| SMTP | 发送 | Push | 25 |
| POP3 | 接收 | Pull | 110 |
| IMAP | 接收 | Pull | 143 |`,
      },
      {
        id: "ftp",
        title: "FTP文件传输协议",
        type: "detail",
        content: `## FTP (File Transfer Protocol)

### 基本特点

- 基于TCP
- 使用**两个并行的TCP连接**：
  - 控制连接（端口21）：传输命令和响应，持久连接
  - 数据连接（端口20或随机）：传输文件数据，非持久连接

### 主动模式 (PORT)

1. 客户端打开随机端口P，通过控制连接告知服务器
2. 服务器从端口20主动连接客户端的端口P
3. 通过该连接传输数据

特点：服务器主动连接客户端
问题：客户端有防火墙时可能被阻止

### 被动模式 (PASV)

1. 客户端通过控制连接发送PASV命令
2. 服务器打开随机端口Q，告知客户端
3. 客户端主动连接服务器的端口Q
4. 通过该连接传输数据

特点：客户端主动连接服务器
优点：对客户端防火墙友好

### 主动 vs 被动模式对比

| 特性 | 主动模式(PORT) | 被动模式(PASV) |
|------|---------------|----------------|
| 数据连接发起方 | 服务器 | 客户端 |
| 服务器数据端口 | 20 | 随机 |
| 防火墙友好 | 对客户端不友好 | 对客户端友好 |
| 使用场景 | 无防火墙环境 | 有防火墙环境 |

### FTP vs HTTP

| 特性 | FTP | HTTP |
|------|-----|------|
| 连接数 | 2个(控制+数据) | 1个 |
| 状态 | 有状态(记住当前目录) | 无状态 |
| 传输模式 | 文本/二进制 | 文本(MIME) |
| 端口 | 21(控制)+20(数据) | 80 |`,
      },
    ],
    exercises: [
      {
        id: "ex-email",
        title: "邮件协议分析",
        description: "用户A (a@163.com) 给用户B (b@qq.com) 发送一封带附件的邮件。请说明：(1) 整个过程涉及哪些协议？(2) 附件如何处理？(3) 如果B使用网页版QQ邮箱查看邮件，接收阶段使用什么协议？",
        difficulty: "medium",
        hints: [
          "发送阶段用SMTP，接收阶段用POP3或IMAP",
          "SMTP只能传输ASCII文本",
          "网页版邮箱通过HTTP访问",
        ],
        referenceSolution: "(1) 涉及的协议：\n- A的邮件客户端 -> 163邮件服务器：SMTP\n- 163邮件服务器 -> QQ邮件服务器：SMTP\n- QQ邮件服务器 -> B的客户端：POP3或IMAP\n- DNS：解析邮件服务器域名\n\n(2) 附件处理：\n- SMTP只能传输7位ASCII文本\n- 使用MIME (Multipurpose Internet Mail Extensions) 扩展\n- 附件通过Base64编码转换为ASCII文本\n- 接收方解码还原附件\n\n(3) 网页版邮箱：\n- B通过浏览器访问QQ邮箱网页\n- 使用HTTP/HTTPS协议\n- QQ邮箱服务器内部从邮件存储中读取邮件",
      },
    ],
    keyTakeaways: [
      "SMTP用于发送邮件(Push)，POP3/IMAP用于接收邮件(Pull)",
      "FTP使用两个TCP连接：控制连接(21)和数据连接",
      "FTP被动模式对客户端防火墙更友好",
      "SMTP需要MIME扩展来传输非ASCII内容",
    ],
    relatedLessons: ["dns-http"],
  },
  {
    id: "dhcp",
    title: "DHCP协议",
    brief: "动态主机配置协议的工作过程与报文交互",
    analogy: "DHCP像酒店前台分配房间——你（新主机）到了酒店大喊「有空房吗」（Discover广播），前台（DHCP服务器）回复「有，给你307号房」（Offer），你说「好，我要307」（Request），前台确认「307归你了，住3天」（ACK，带租期）。退房时要通知前台（Release）。",
    prerequisites: ["IP协议", "UDP基本概念"],
    commonMistakes: [
      "DHCP使用UDP不是TCP——因为客户端还没有IP地址，无法建立TCP连接",
      "DHCP Discover是广播——因为客户端不知道DHCP服务器在哪",
      "DHCP分配的IP有租期——不是永久的，到期需要续租或释放",
      "DHCP中继代理用于跨网段——不是每个子网都需要一个DHCP服务器",
    ],
    memoryAids: [
      "DHCP四步：Discover(广播找服务器)→Offer(服务器提供IP)→Request(客户端选择)→ACK(确认)",
      "DHCP端口：服务器67，客户端68（都用UDP）",
      "DHCP提供：IP地址 + 子网掩码 + 默认网关 + DNS服务器 + 租期",
      "续租：50%租期时单播续租，87.5%时广播续租",
    ],
    keyTakeaways: [
      "DHCP自动为主机分配IP地址和网络配置参数",
      "使用UDP协议，服务器端口67，客户端端口68",
      "工作过程：Discover→Offer→Request→ACK（DORA）",
      "IP地址有租期，客户端需要在租期到期前续租",
      "DHCP中继代理允许跨子网使用DHCP服务器",
    ],
    relatedLessons: ["dns-http", "ip-protocol"],
    sections: [
      {
        id: "dhcp-process",
        title: "DHCP工作过程",
        type: "walkthrough",
        content: `DHCP客户端获取IP地址的完整过程（DORA）`,
        steps: [
          {
            description: "Discover：客户端广播DHCP发现报文（源IP=0.0.0.0，目的IP=255.255.255.255），寻找DHCP服务器",
            state: { phase: "discover", src: "0.0.0.0", dst: "255.255.255.255", type: "broadcast" },
          },
          {
            description: "Offer：DHCP服务器收到后，从地址池中选一个可用IP，广播DHCP提供报文（包含IP、掩码、网关、DNS、租期）",
            state: { phase: "offer", offeredIP: "192.168.1.100", lease: "86400s" },
          },
          {
            description: "Request：客户端选择一个Offer（可能有多个服务器响应），广播DHCP请求报文，告知所有服务器自己的选择",
            state: { phase: "request", selectedIP: "192.168.1.100", note: "广播是为了让未被选中的服务器回收Offer" },
          },
          {
            description: "ACK：被选中的服务器发送DHCP确认报文，客户端正式获得IP地址，开始使用",
            state: { phase: "ack", assignedIP: "192.168.1.100", lease: "86400s" },
          },
        ],
      },
      {
        id: "dhcp-details",
        title: "DHCP租期与续租",
        type: "detail",
        content: `## 租期机制

DHCP分配的IP地址有**租期(Lease Time)**，到期后地址被回收。

### 续租过程

- **T1 = 50%租期**：客户端向原DHCP服务器**单播**续租请求
  - 成功：重置租期
  - 失败：等到T2再试
- **T2 = 87.5%租期**：客户端**广播**续租请求（原服务器可能故障）
  - 成功：重置租期
  - 失败：租期到期后释放IP，重新执行DORA

### 释放地址

客户端主动离开网络时，发送DHCP Release报文通知服务器回收IP。

## DHCP中继代理

问题：DHCP Discover是广播，不能跨越路由器。

解决：在每个子网配置DHCP中继代理(Relay Agent)，将广播的DHCP报文转换为单播转发给远程DHCP服务器。

## DHCP提供的信息

- IP地址
- 子网掩码
- 默认网关地址
- DNS服务器地址
- 租期
- 其他选项（域名、NTP服务器等）`,
      },
    ],
    exercises: [
      {
        id: "dhcp-ex1",
        title: "DHCP过程分析",
        description: "某主机刚接入网络，其DHCP获取IP地址的过程中：\n(1) 为什么Discover报文的源IP是0.0.0.0？\n(2) 为什么Request报文要广播而不是单播给选中的服务器？\n(3) 如果网络中有两个DHCP服务器都发送了Offer，客户端如何处理？",
        difficulty: "medium" as const,
        hints: ["客户端此时还没有IP地址", "网络中可能有多个DHCP服务器", "Request广播的目的不只是告诉选中的服务器"],
        referenceSolution: "(1) 因为客户端此时还没有IP地址，不能使用任何IP作为源地址，所以用0.0.0.0表示「我还没有地址」。\n\n(2) Request广播有两个目的：①告诉被选中的服务器「我接受你的Offer」；②告诉未被选中的服务器「我没选你，请回收你预留的IP地址」。如果单播，未被选中的服务器不知道自己的Offer被拒绝，会一直保留那个IP。\n\n(3) 客户端通常选择最先到达的Offer（即第一个响应的服务器）。在Request报文中通过Server Identifier选项指明选择了哪个服务器。",
      },
    ],
  },
];
