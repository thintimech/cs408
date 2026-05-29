import { BaseConverter } from "./BaseConverter";
import { SubnetCalculator } from "./SubnetCalculator";
import { CrcCalculator } from "./CrcCalculator";
import { PageReplacementSim } from "./PageReplacementSim";
import { SchedulingSim } from "./SchedulingSim";
import { PipelineBuilder } from "./PipelineBuilder";

export const widgetRegistry: Record<string, { component: React.ComponentType; name: string; description: string; subject: string }> = {
  "base-converter": { component: BaseConverter, name: "进制转换器", description: "实时进制转换 + 原码/反码/补码推导", subject: "co" },
  "subnet-calculator": { component: SubnetCalculator, name: "子网计算器", description: "IP 地址子网划分与地址分解", subject: "cn" },
  "crc-calculator": { component: CrcCalculator, name: "CRC 校验计算器", description: "逐步演示模 2 除法求 FCS", subject: "cn" },
  "page-replacement": { component: PageReplacementSim, name: "页面置换模拟器", description: "FIFO/LRU/OPT 算法逐步可视化", subject: "os" },
  "scheduling-sim": { component: SchedulingSim, name: "进程调度模拟器", description: "Gantt 图 + 调度指标实时计算", subject: "os" },
  "pipeline-builder": { component: PipelineBuilder, name: "流水线时空图", description: "指令流水线执行与数据冒险分析", subject: "co" },
};
