import { useState, useCallback } from "react";
import type { TreeNode } from "../types/tree";
import { fetchChildren, getNextLevel } from "../data/initialtree";

let nextId = 100;
const generateId = () => String(nextId++);

export const useTree = (initial: TreeNode[]) => {
  const [tree, setTree] = useState<TreeNode[]>(initial);

  const updateNode = useCallback(
    (nodes: TreeNode[], id: string, updater: (node: TreeNode) => TreeNode): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === id) return updater(node);
        if (node.children?.length) {
          return { ...node, children: updateNode(node.children, id, updater) };
        }
        return node;
      });
    },
    []
  );

  const toggleExpand = useCallback(
    async (id: string) => {
      const findNode = (nodes: TreeNode[]): TreeNode | undefined => {
        for (const n of nodes) {
          if (n.id === id) return n;
          if (n.children) {
            const found = findNode(n.children);
            if (found) return found;
          }
        }
      };

      const node = findNode(tree);
      if (!node) return;

      if (node.isExpanded) {
        setTree((prev) => updateNode(prev, id, (n) => ({ ...n, isExpanded: false })));
        return;
      }

      if (node.hasChildren && (!node.children || node.children.length === 0)) {
        setTree((prev) => updateNode(prev, id, (n) => ({ ...n, isLoading: true })));
        const children = await fetchChildren(id);
        setTree((prev) =>
          updateNode(prev, id, (n) => ({
            ...n,
            children,
            isExpanded: true,
            isLoading: false,
          }))
        );
      } else {
        setTree((prev) => updateNode(prev, id, (n) => ({ ...n, isExpanded: true })));
      }
    },
    [tree, updateNode]
  );

  const addNode = useCallback(
    (parentId: string, name: string) => {
      const findNode = (nodes: TreeNode[]): TreeNode | undefined => {
        for (const n of nodes) {
          if (n.id === parentId) return n;
          if (n.children) {
            const found = findNode(n.children);
            if (found) return found;
          }
        }
      };
      const parent = findNode(tree);
      const childLevel = parent ? getNextLevel(parent.level) : "A";
      const newNode: TreeNode = { id: generateId(), name, level: childLevel, hasChildren: false };
      setTree((prev) =>
        updateNode(prev, parentId, (n) => ({
          ...n,
          children: [...(n.children || []), newNode],
          hasChildren: true,
          isExpanded: true,
        }))
      );
    },
    [updateNode, tree]
  );

  const addRootNode = useCallback((name: string) => {
    const newNode: TreeNode = { id: generateId(), name, level: "A", hasChildren: false };
    setTree((prev) => [...prev, newNode]);
  }, []);

  const removeNode = useCallback((id: string) => {
    const remove = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .filter((n) => n.id !== id)
        .map((n) => ({
          ...n,
          children: n.children ? remove(n.children) : undefined,
        }));
    };
    setTree((prev) => remove(prev));
  }, []);

  const renameNode = useCallback(
    (id: string, newName: string) => {
      setTree((prev) => updateNode(prev, id, (n) => ({ ...n, name: newName })));
    },
    [updateNode]
  );

  const moveNode = useCallback(
    (dragId: string, targetId: string, position: "before" | "after" | "inside") => {
      let draggedNode: TreeNode | null = null;

      const extract = (nodes: TreeNode[]): TreeNode[] => {
        return nodes
          .filter((n) => {
            if (n.id === dragId) {
              draggedNode = n;
              return false;
            }
            return true;
          })
          .map((n) => ({
            ...n,
            children: n.children ? extract(n.children) : undefined,
          }));
      };

      const insert = (nodes: TreeNode[]): TreeNode[] => {
        const result: TreeNode[] = [];
        for (const n of nodes) {
          if (n.id === targetId) {
            if (position === "before") {
              result.push(draggedNode!);
              result.push(n);
            } else if (position === "after") {
              result.push(n);
              result.push(draggedNode!);
            } else {
              result.push({
                ...n,
                children: [...(n.children || []), draggedNode!],
                hasChildren: true,
                isExpanded: true,
              });
            }
          } else {
            result.push({
              ...n,
              children: n.children ? insert(n.children) : undefined,
            });
          }
        }
        return result;
      };

      setTree((prev) => {
        const extracted = extract(prev);
        if (!draggedNode) return prev;
        return insert(extracted);
      });
    },
    []
  );

  return { tree, toggleExpand, addNode, addRootNode, removeNode, renameNode, moveNode };
};
