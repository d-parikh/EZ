import { useState, useRef, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import type { TreeNode } from "../types/tree";

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  isLast: boolean;
  onToggle: (id: string) => void;
  onAdd: (parentId: string, name: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (
    dragId: string,
    targetId: string,
    position: "before" | "after" | "inside",
  ) => void;
}

const LEVEL_COLORS: Record<string, string> = {
  A: "#250773",
  OTHER: "#6f57ab",
};

const TreeNodeItem = ({
  node,
  depth,
  isLast,
  onToggle,
  onAdd,
  onRemove,
  onRename,
  onMove,
}: TreeNodeItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dragOver, setDragOver] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const hasKids =
    node.hasChildren || (node.children && node.children.length > 0);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(node.name);
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [node.name]);

  const handleRenameSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== node.name) {
      onRename(node.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleAddSubmit = () => {
    const trimmed = newNodeName.trim();
    if (trimmed) {
      onAdd(node.id, trimmed);
      setNewNodeName("");
    }
    setIsAdding(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.clientY - rect.top;
    const pct = y / rect.height;
    if (hasKids && pct > 0.25 && pct < 0.75) {
      setDragOver("inside");
    } else if (pct <= 0.25) {
      setDragOver("before");
    } else {
      setDragOver("after");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dragId = e.dataTransfer.getData("text/plain");
    if (dragId && dragId !== node.id && dragOver) {
      onMove(dragId, node.id, dragOver);
    }
    setDragOver(null);
  };

  const handleDragLeave = () => setDragOver(null);

//   const colorClass = LEVEL_COLORS[node.level];
  const colorClass = node.level === "A"
  ? LEVEL_COLORS.A
  : LEVEL_COLORS.OTHER;

  const indent = depth * 80;

  return (
    <div className="relative">
      {/* Vertical line from parent */}
      {depth > 0 && (
        <div
          className="absolute border-l-2 border-dashed border-[hsl(var(--tree-line))]"
          style={{
            left: `${indent - 40}px`,
            top: 0,
            height: isLast ? "28px" : "100%",
          }}
        />
      )}

      {/* Horizontal connector */}
      {depth > 0 && (
        <div
          className="absolute border-t-2 border-dashed border-[hsl(var(--tree-line))]"
          style={{
            left: `${indent - 40}px`,
            top: "28px",
            width: "40px",
          }}
        />
      )}

      {/* Node row */}
      <div
        ref={nodeRef}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDoubleClick={handleDoubleClick}
        className={`
          group relative flex items-center gap-3 py-2
          ${dragOver === "before" ? "border-t-2 border-gray-100" : ""}
          ${dragOver === "after" ? "border-b-2 border-gray-100" : ""}
          ${dragOver === "inside" ? "opacity-80" : ""}
        `}
        style={{ paddingLeft: `${indent}px` }}
      >
        {/* Circular badge */}
        <div
        style={{ backgroundColor: colorClass }}
          className={`
             text-white
            w-9 h-9 rounded-full flex items-center justify-center
            text-sm font-bold shadow-md shrink-0 cursor-pointer
            transition-transform hover:scale-110
          `}
          onClick={() => {
            if (hasKids || node.hasChildren) onToggle(node.id);
          }}
        >
          {node.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            node.level
          )}
        </div>

        {/* Name card */}
        <div className="flex items-center gap-2 bg-card border border-gray-100 rounded-lg px-4 py-1.5 shadow-sm min-w-[120px]">
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="bg-transparent border-gray-200 outline-none text-sm w-full"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm font-medium">
              {node.name}
            </span>
          )}
        </div>

        {/* Add child button */}

        {/* Hover actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(true);
              setTimeout(() => addInputRef.current?.focus(), 10);
            }}
            className="p-1 rounded hover:bg-secondary transition-colors"
            title="Add child"
          >
            <Plus className="h-3.5 w-3.5 " />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setEditValue(node.name);
              setTimeout(() => inputRef.current?.focus(), 10);
            }}
            className="p-1 rounded hover:bg-secondary transition-colors"
            title="Rename"
          >
            <Pencil className="h-3.5 w-3.5 " />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="p-1 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Add child input */}
      {isAdding && (
        <div
          className="flex items-center gap-3 py-2"
          style={{ paddingLeft: `${indent + 80}px` }}
        >
          <div className="w-9 h-9 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center  text-sm font-bold">
            ?
          </div>
          <input
            ref={addInputRef}
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            onBlur={handleAddSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubmit();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewNodeName("");
              }
            }}
            placeholder="Node name..."
            className="bg-card border border-border rounded-lg px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring shadow-sm"
          />
        </div>
      )}

      {/* Children */}
      {node.isExpanded && node.children && node.children.length > 0 && (
        <div className="relative">
          {node.children.map((child, idx) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={idx === node.children!.length - 1}
              onToggle={onToggle}
              onAdd={onAdd}
              onRemove={onRemove}
              onRename={onRename}
              onMove={onMove}
            />
          ))}
        </div>
      )}
      {showDeleteDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowDeleteDialog(false)}
    />

    {/* Dialog */}
    <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 animate-in fade-in zoom-in-95">
      
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900">
        Delete "{node.name}"?
      </h2>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-600">
        This will permanently remove this node
        This action cannot be undone.
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        
        <button
          onClick={() => setShowDeleteDialog(false)}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            onRemove(node.id);
            setShowDeleteDialog(false);
          }}
          className="px-4 py-2 text-sm text-white rounded-md !border-none !bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TreeNodeItem;
