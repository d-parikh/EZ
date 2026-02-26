import type { TreeNode } from "../types/tree";

export const initialTree: TreeNode[] = [
  {
    id: "1",
    name: "Level A",
    level: "A",
    hasChildren: true,
    isExpanded: false,
    children: [],
  },
];

const lazyChildren: Record<string, TreeNode[]> = {
  "1": [
    { id: "1-1", name: "Level A", level: "B", hasChildren: true, isExpanded: false, children: [] },
    { id: "1-2", name: "Level A", level: "B", hasChildren: false },
  ],
  "1-1": [
    { id: "1-1-1", name: "Level A", level: "C", hasChildren: true, isExpanded: false, children: [] },
    { id: "1-1-2", name: "Level A", level: "C", hasChildren: false },
    { id: "1-1-3", name: "Level A", level: "C", hasChildren: false },
  ],
  "1-1-1": [
    { id: "1-1-1-1", name: "Level A", level: "D", hasChildren: false },
  ],
};

export const fetchChildren = (nodeId: string): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(lazyChildren[nodeId] || []);
    }, 600 + Math.random() * 400);
  });
};

const levelChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const getNextLevel = (parentLevel: string): string => {
  const idx = levelChars.indexOf(parentLevel);
  if (idx >= 0 && idx < levelChars.length - 1) return levelChars[idx + 1];
  return parentLevel;
};
