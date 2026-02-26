import { useState, useRef } from "react";
import TreeNodeItem from "./TreeNodeItem";
import { Plus } from "lucide-react";
import { initialTree } from "../data/initialtree";
import { useTree } from "../hooks/UseTree";

const TreeView = () => {
  const { tree, toggleExpand, addNode, addRootNode, removeNode, renameNode, moveNode } =
    useTree(initialTree);
  const [isAddingRoot, setIsAddingRoot] = useState(false);
  const [rootName, setRootName] = useState("");
  const rootInputRef = useRef<HTMLInputElement>(null);

  const handleAddRoot = () => {
    const trimmed = rootName.trim();
    if (trimmed) {
      addRootNode(trimmed);
      setRootName("");
    }
    setIsAddingRoot(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card/50 rounded-2xl border p-8 shadow-sm min-h-[400px]">
        {/* Tree nodes */}
        <div className="relative">
          {tree.map((node, idx) => (
            <TreeNodeItem
              key={node.id}
              node={node}
              depth={0}
              isLast={idx === tree.length - 1}
              onToggle={toggleExpand}
              onAdd={addNode}
              onRemove={removeNode}
              onRename={renameNode}
              onMove={moveNode}
            />
          ))}
        </div>

        {/* Add root */}
        {isAddingRoot ? (
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center  text-sm font-bold">
              ?
            </div>
            <input
              ref={rootInputRef}
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              onBlur={handleAddRoot}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddRoot();
                if (e.key === "Escape") {
                  setIsAddingRoot(false);
                  setRootName("");
                }
              }}
              placeholder="Node name..."
              className="bg-card border rounded-lg px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
          </div>
        ) : (
          <button
            onClick={() => {
              setIsAddingRoot(true);
              setTimeout(() => rootInputRef.current?.focus(), 10);
            }}
            className="mt-6 flex items-center gap-2 text-sm hover:text-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4 text-black" />
            Add root node
          </button>
        )}

        {tree.length === 0 && !isAddingRoot && (
          <div className="flex flex-col items-center justify-center py-16 ">
            <p className="text-sm">No nodes yet. Click below to add one.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default TreeView;
