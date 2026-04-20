import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import { DIAGRAM_NODE_SIZE } from "@/lib/constants";

type LayoutOptions = {
  rankdir?: "LR" | "TB";
  nodesep?: number;
  ranksep?: number;
  nodeWidth?: number;
  nodeHeight?: number;
};

function connectedComponents(
  nodeIds: string[],
  edges: Array<{ source: string; target: string }>,
): string[][] {
  const adj = new Map<string, Set<string>>();
  for (const id of nodeIds) adj.set(id, new Set());
  for (const { source, target } of edges) {
    adj.get(source)?.add(target);
    adj.get(target)?.add(source);
  }
  const visited = new Set<string>();
  const groups: string[][] = [];
  for (const id of nodeIds) {
    if (visited.has(id)) continue;
    const group: string[] = [];
    const stack = [id];
    while (stack.length) {
      const n = stack.pop()!;
      if (visited.has(n)) continue;
      visited.add(n);
      group.push(n);
      for (const nb of adj.get(n) ?? []) if (!visited.has(nb)) stack.push(nb);
    }
    groups.push(group);
  }
  return groups;
}

export function applyDagreLayout<N extends Node, E extends Edge>(
  nodes: N[],
  edges: E[],
  options: LayoutOptions = {},
): N[] {
  const {
    rankdir = "TB",
    nodesep = 60,
    ranksep = 100,
    nodeWidth = DIAGRAM_NODE_SIZE.entityWidth,
    nodeHeight = DIAGRAM_NODE_SIZE.entityHeight,
  } = options;

  if (!nodes.length) return nodes;

  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  // Run dagre independently per connected component then stack them
  // horizontally. Dagre places every disconnected subgraph at origin (0,0),
  // so running them separately and offsetting avoids overlap.
  const groups = connectedComponents(nodes.map((n) => n.id), edges);
  groups.sort((a, b) => b.length - a.length); // largest first

  const result = new Map<string, { x: number; y: number }>();
  let xOffset = 0; // stack components left-to-right

  for (const group of groups) {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir, nodesep, ranksep });

    const groupSet = new Set(group);
    for (const id of group) {
      const node = nodeById.get(id)!;
      g.setNode(id, {
        width: node.measured?.width ?? node.width ?? nodeWidth,
        height: node.measured?.height ?? node.height ?? nodeHeight,
      });
    }
    for (const edge of edges) {
      if (groupSet.has(edge.source) && groupSet.has(edge.target)) {
        g.setEdge(edge.source, edge.target);
      }
    }

    dagre.layout(g);

    let minX = Infinity, maxX = -Infinity;
    for (const id of group) {
      const pos = g.node(id);
      const node = nodeById.get(id)!;
      const w = node.measured?.width ?? node.width ?? nodeWidth;
      minX = Math.min(minX, pos.x - w / 2);
      maxX = Math.max(maxX, pos.x + w / 2);
    }

    const dx = xOffset - minX;
    for (const id of group) {
      const pos = g.node(id);
      const node = nodeById.get(id)!;
      const w = node.measured?.width ?? node.width ?? nodeWidth;
      const h = node.measured?.height ?? node.height ?? nodeHeight;
      result.set(id, { x: pos.x - w / 2 + dx, y: pos.y - h / 2 });
    }

    xOffset += maxX - minX + nodesep * 3;
  }

  return nodes.map((node) => ({
    ...node,
    position: result.get(node.id) ?? { x: 0, y: 0 },
  }));
}
