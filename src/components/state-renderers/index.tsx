"use client";

import { lazy, Suspense } from "react";

const AnimatedArrayView = lazy(() => import("./AnimatedArrayView").then(m => ({ default: m.AnimatedArrayView })));
const HeapTreeView = lazy(() => import("./HeapTreeView").then(m => ({ default: m.HeapTreeView })));
const GraphView = lazy(() => import("./GraphView").then(m => ({ default: m.GraphView })));
const PageReplacementView = lazy(() => import("./PageReplacementView").then(m => ({ default: m.PageReplacementView })));
const DijkstraView = lazy(() => import("./DijkstraView").then(m => ({ default: m.DijkstraView })));
const PrimKruskalView = lazy(() => import("./PrimKruskalView").then(m => ({ default: m.PrimKruskalView })));
const BankerView = lazy(() => import("./BankerView").then(m => ({ default: m.BankerView })));
const ProcessSyncView = lazy(() => import("./ProcessSyncView").then(m => ({ default: m.ProcessSyncView })));
const KMPView = lazy(() => import("./KMPView").then(m => ({ default: m.KMPView })));
const BSTView = lazy(() => import("./BSTView").then(m => ({ default: m.BSTView })));
const HuffmanView = lazy(() => import("./HuffmanView").then(m => ({ default: m.HuffmanView })));
const TableView = lazy(() => import("./TableView").then(m => ({ default: m.TableView })));
const NextArrayView = lazy(() => import("./NextArrayView").then(m => ({ default: m.NextArrayView })));
const GanttView = lazy(() => import("./GanttView").then(m => ({ default: m.GanttView })));
const BitFieldView = lazy(() => import("./BitFieldView").then(m => ({ default: m.BitFieldView })));
const WindowView = lazy(() => import("./WindowView").then(m => ({ default: m.WindowView })));
const DiskView = lazy(() => import("./DiskView").then(m => ({ default: m.DiskView })));
const CongestionView = lazy(() => import("./CongestionView").then(m => ({ default: m.CongestionView })));
const ConnectionView = lazy(() => import("./ConnectionView").then(m => ({ default: m.ConnectionView })));
const StateMachineView = lazy(() => import("./StateMachineView").then(m => ({ default: m.StateMachineView })));
const QueueView = lazy(() => import("./QueueView").then(m => ({ default: m.QueueView })));
const ProtocolView = lazy(() => import("./ProtocolView").then(m => ({ default: m.ProtocolView })));
const AddressView = lazy(() => import("./AddressView").then(m => ({ default: m.AddressView })));

interface StateRendererProps {
  state: Record<string, unknown>;
  prevState?: Record<string, unknown>;
}

function StateRendererInner({ state, prevState }: StateRendererProps) {
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

export function StateRenderer(props: StateRendererProps) {
  return (
    <Suspense fallback={<div className="h-20 flex items-center justify-center text-xs text-muted-foreground">加载中...</div>}>
      <StateRendererInner {...props} />
    </Suspense>
  );
}
