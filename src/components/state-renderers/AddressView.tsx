"use client";

interface AddressViewProps {
  state: Record<string, unknown>;
}

export function AddressView({ state }: AddressViewProps) {
  const logicalAddress = state.logicalAddress as number | undefined;
  const pageSize = state.pageSize as number | undefined;
  const pageNumber = state.pageNumber as number | undefined;
  const offset = state.offset as number | undefined;
  const frameNumber = state.frameNumber as number | undefined;
  const physicalAddress = state.physicalAddress as number | undefined;

  return (
    <div className="space-y-2">
      {/* Address breakdown */}
      {logicalAddress !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">逻辑地址:</span>
          <span className="font-mono font-medium text-primary">{logicalAddress}</span>
          {pageSize && (
            <span className="text-muted-foreground">(页面大小={pageSize})</span>
          )}
        </div>
      )}

      {/* Page number + offset */}
      {pageNumber !== undefined && (
        <div className="flex items-center gap-2">
          <div className="flex rounded overflow-hidden border text-xs font-mono">
            <div className="px-3 py-1.5 bg-blue-500/10 border-r border-blue-500/30 text-blue-400">
              页号: {pageNumber}
            </div>
            {offset !== undefined && (
              <div className="px-3 py-1.5 bg-orange-500/10 text-orange-400">
                偏移: {offset}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Frame mapping */}
      {frameNumber !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">页框号:</span>
          <span className="font-mono font-medium text-green-400">{frameNumber}</span>
        </div>
      )}

      {/* Physical address result */}
      {physicalAddress !== undefined && (
        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded bg-green-500/10 border border-green-500/20">
          <span className="text-green-400">物理地址:</span>
          <span className="font-mono font-bold text-green-300">{physicalAddress}</span>
        </div>
      )}
    </div>
  );
}
