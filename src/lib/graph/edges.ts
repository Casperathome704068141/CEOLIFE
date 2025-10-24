import { Edge } from "./types";

let edges: Edge[] = [
  {
    id: "edge-bill-statement",
    fromId: "bill-electric",
    toId: "doc-electric-statement",
    role: "evidence",
    confidence: 0.9,
  },
  {
    id: "edge-goal-ledger",
    fromId: "goal-emergency",
    toId: "txn-savings-boost",
    role: "funded_by",
    confidence: 0.8,
  },
];

export function listEdges() {
  return edges;
}

export function linkEdge(newEdge: Edge) {
  const exists = edges.find(edge => edge.id === newEdge.id);
  if (exists) {
    edges = edges.map(edge => (edge.id === newEdge.id ? newEdge : edge));
  } else {
    edges = [...edges, newEdge];
  }
  return newEdge;
}

export function unlinkEdge(edgeId: string) {
  const before = edges.length;
  edges = edges.filter(edge => edge.id !== edgeId);
  return before !== edges.length;
}

export function edgesForEntity(entityId: string) {
  return edges.filter(edge => edge.fromId === entityId || edge.toId === entityId);
}

