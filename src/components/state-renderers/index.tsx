"use client";

import { AnimatedArrayView } from "./AnimatedArrayView";
import { HeapTreeView } from "./HeapTreeView";
import { GraphView } from "./GraphView";
import { PageReplacementView } from "./PageReplacementView";
import { DijkstraView } from "./DijkstraView";
import { PrimKruskalView } from "./PrimKruskalView";
import { BankerView } from "./BankerView";
import { ProcessSyncView } from "./ProcessSyncView";
import { KMPView } from "./KMPView";
import { BSTView } from "./BSTView";
import { HuffmanView } from "./HuffmanView";
import { TableView } from "./TableView";
import { NextArrayView } from "./NextArrayView";
import { GanttView } from "./GanttView";
import { BitFieldView } from "./BitFieldView";
import { WindowView } from "./WindowView";
import { DiskView } from "./DiskView";
import { CongestionView } from "./CongestionView";
import { ConnectionView } from "./ConnectionView";
import { StateMachineView } from "./StateMachineView";
import { QueueView } from "./QueueView";
import { ProtocolView } from "./ProtocolView";
import { AddressView } from "./AddressView";

interface StateRendererProps {
  state: Record<string, unknown>;
  prevState?: Record<string, unknown>;
}

export function StateRenderer({ state, prevState }: StateRendererProps) {
  const type = state.type as string | undefined;

  if (type === "gantt") return <GanttView state={state} />;
  if (type === "bits") return <BitFieldView state={state} />;
  if (type === "window") return <WindowView state={state} />;
  if (type === "disk") return <DiskView state={state} />;
  if (type === "table") return <TableView state={state} />;
  if (type === "heap") return <HeapTreeView state={state} />;

  if ("dist" in state && "final" in state) return <DijkstraView state={state} />;
  if ("U" in state || "lowcost" in state || "sortedEdges" in state)
    return <PrimKruskalView state={state} />;
  if ("Work" in state || "Finish" in state || "safeSequence" in state)
    return <BankerView state={state} />;
  if ("flag" in state || "mutex" in state || "P0" in state || "P1" in state)
    return <ProcessSyncView state={state} />;
  if ("pattern" in state || ("S" in state && ("P" in state || "T" in state)))
    return <KMPView state={state} />;
  if ("client" in state && "server" in state) return <ConnectionView state={state} />;
  if ("currentState" in state) return <StateMachineView state={state} />;
  if ("queue" in state) return <QueueView state={state} />;
  if ("phase" in state && !("cwnd" in state)) return <ProtocolView state={state} />;
  if ("logicalAddress" in state || "physicalAddress" in state || ("pageNumber" in state && "frameNumber" in state))
    return <AddressView state={state} />;
  if ("tree" in state && ("rotation" in state || "balanceFactors" in state))
    return <BSTView state={state} />;
  if ("forest" in state || "wpl" in state)
    return <HuffmanView state={state} />;
  if ("memory" in state || "referenceString" in state || "totalFaults" in state)
    return <PageReplacementView state={state} />;
  if ("cwnd" in state && "ssthresh" in state) return <CongestionView state={state} />;
  if ("visited" in state) return <GraphView state={state} />;
  if ("next" in state) return <NextArrayView state={state} />;
  if ("array" in state) return <AnimatedArrayView state={state} prevState={prevState} />;

  return null;
}
