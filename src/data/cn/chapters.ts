import { Chapter } from "@/types";
import { architectureLessons } from "./lessons/architecture";
import { physicalLessons } from "./lessons/physical";
import { datalinkLessons } from "./lessons/datalink";
import { datalinkExtraLessons } from "./lessons/datalink-extra";
import { networkLessons } from "./lessons/network-layer";
import { transportLessons } from "./lessons/transport";
import { applicationLessons } from "./lessons/application";

export const chapters: Chapter[] = [
  {
    id: "architecture",
    name: "计算机网络体系结构",
    description: "网络概述、OSI参考模型、TCP/IP体系结构、各层功能与协议数据单元",
    icon: "Network",
    lessons: architectureLessons,
  },
  {
    id: "physical",
    name: "物理层",
    description: "通信基础、信道容量、奈奎斯特定理、香农定理、编码与调制技术",
    icon: "Radio",
    lessons: physicalLessons,
  },
  {
    id: "datalink",
    name: "数据链路层",
    description: "成帧、差错控制、流量控制、可靠传输、介质访问控制",
    icon: "Link2",
    lessons: [...datalinkLessons, ...datalinkExtraLessons],
  },
  {
    id: "network",
    name: "网络层",
    description: "IP协议、子网划分、CIDR、路由算法(RIP/OSPF)",
    icon: "Globe",
    lessons: networkLessons,
  },
  {
    id: "transport",
    name: "传输层",
    description: "TCP与UDP、连接管理、流量控制、拥塞控制",
    icon: "ArrowLeftRight",
    lessons: transportLessons,
  },
  {
    id: "application",
    name: "应用层",
    description: "DNS、HTTP、电子邮件、FTP等应用层协议",
    icon: "AppWindow",
    lessons: applicationLessons,
  },
];
