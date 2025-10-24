export type UndoEntry = {
  commandType: string;
  entityId: string;
  inversePatch: Record<string, unknown>;
  createdAt: string;
};

const undoLog = new Map<string, UndoEntry>();

export function recordUndo(id: string, entry: UndoEntry) {
  undoLog.set(id, entry);
}

export function getUndo(id: string) {
  return undoLog.get(id);
}

export function clearUndo(id: string) {
  undoLog.delete(id);
}

export function listUndo() {
  return Array.from(undoLog.values());
}

