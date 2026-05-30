"use client";

import { motion } from "framer-motion";

interface BSTViewProps {
  state: Record<string, unknown>;
}

interface TreeNode {
  val: number | string;
  left?: TreeNode | null;
  right?: TreeNode | null;
  bf?: number;
}

interface PositionedNode {
  val: number | string;
  x: number;
  y: number;
  bf?: number;
  highlight?: boolean;
  isNew?: boolean;
}

interface Edge {
  x1: number; y1: number; x2: number; y2: number;
}

function layoutTree(root: TreeNode | null, highlight?: number | string, newNode?: number | string): { nodes: PositionedNode[]; edges: Edge[]; width: number; height: number } {
  if (!root) return { nodes: [], edges: [], width: 0, height: 0 };

  const nodes: PositionedNode[] = [];
  const edges: Edge[] = [];

  function inorder(node: TreeNode | null, depth: number, x: { val: number }): void {
    if (!node) return;
    inorder(node.left ?? null, depth + 1, x);
    const posX = x.val;
    x.val += 50;
    nodes.push({
      val: node.val,
      x: posX,
      y: depth * 55 + 30,
      bf: node.bf,
      highlight: node.val === highlight,
      isNew: node.val === newNode,
    });
    inorder(node.right ?? null, depth + 1, x);
  }

  inorder(root, 0, { val: 25 });

  // Build edges by traversing again
  function buildEdges(node: TreeNode | null): void {
    if (!node) return;
    const parent = nodes.find((n) => n.val === node.val);
    if (!parent) return;
    if (node.left) {
      const child = nodes.find((n) => n.val === node.left!.val);
      if (child) edges.push({ x1: parent.x, y1: parent.y, x2: child.x, y2: child.y });
      buildEdges(node.left);
    }
    if (node.right) {
      const child = nodes.find((n) => n.val === node.right!.val);
      if (child) edges.push({ x1: parent.x, y1: parent.y, x2: child.x, y2: child.y });
      buildEdges(node.right);
    }
  }
  buildEdges(root);

  const maxX = Math.max(...nodes.map((n) => n.x)) + 25;
  const maxY = Math.max(...nodes.map((n) => n.y)) + 30;
  return { nodes, edges, width: maxX, height: maxY };
}

export function BSTView({ state }: BSTViewProps) {
  const tree = state.tree as TreeNode | null | undefined;
  const rotation = state.rotation as string | undefined;
  const balanceFactors = state.balanceFactors as string | undefined;
  const highlight = state.highlight as number | string | undefined;
  const newNode = state.newNode as number | string | undefined;

  if (!tree || typeof tree === "string") {
    // Fallback for ASCII art trees
    return (
      <div className="space-y-2">
        {typeof tree === "string" && (
          <pre className="text-xs font-mono bg-background p-3 rounded border border-border overflow-x-auto leading-5 text-green-300">
            {tree}
          </pre>
        )}
        {rotation && (
          <div className="text-xs px-2 py-1.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-300">
            {rotation}
          </div>
        )}
        {balanceFactors && (
          <div className="text-xs text-muted-foreground">{balanceFactors}</div>
        )}
      </div>
    );
  }

  const { nodes, edges, width, height } = layoutTree(tree, highlight, newNode);
  const nodeR = 16;

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md mx-auto" style={{ height: `${Math.min(height, 250)}px` }}>
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            className="stroke-border" strokeWidth={1.5}
          />
        ))}
        {nodes.map((node, i) => (
          <motion.g
            key={`${node.val}-${i}`}
            initial={{ scale: node.isNew ? 0 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <circle
              cx={node.x} cy={node.y} r={nodeR}
              className={
                node.isNew
                  ? "fill-yellow-500/20 stroke-yellow-500"
                  : node.highlight
                    ? "fill-orange-500/20 stroke-orange-500"
                    : "fill-background/50 stroke-border"
              }
              strokeWidth={2}
            />
            <text
              x={node.x} y={node.y + 1}
              textAnchor="middle" dominantBaseline="middle"
              className={`text-[11px] font-mono ${
                node.isNew ? "fill-yellow-300" : node.highlight ? "fill-orange-300" : "fill-current"
              }`}
            >
              {node.val}
            </text>
            {node.bf !== undefined && (
              <text
                x={node.x + nodeR + 3} y={node.y - 5}
                className="text-[9px] fill-muted-foreground"
              >
                {node.bf}
              </text>
            )}
          </motion.g>
        ))}
      </svg>

      {rotation && (
        <div className="text-xs px-2 py-1.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-300">
          {rotation}
        </div>
      )}
      {balanceFactors && (
        <div className="text-xs text-muted-foreground">{balanceFactors}</div>
      )}
    </div>
  );
}
