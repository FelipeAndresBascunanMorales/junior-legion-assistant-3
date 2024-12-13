import { TreeNode } from '../types/tree';

export function findNode(tree: TreeNode, id: string): TreeNode | null {
  console.log("findNode tree:", tree);
  console.log("findNode id:", id, "findNode tree.id:", tree.id);
  console.log("findNode tree.children:", tree.children);
  if (tree.id === id) return tree;
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  console.log("node not found!");
  return null;
}

export function lockParentNodes(tree: TreeNode, nodeId: string): TreeNode {
  function updateNodes(node: TreeNode): TreeNode {
    if (node.children) {
      const updatedChildren = node.children.map(child => {
        const updatedChild = updateNodes(child);
        if (updatedChild.isLocked && node.id !== nodeId) {
          return { ...node, isLocked: true };
        }
        return updatedChild;
      });
      return { ...node, children: updatedChildren };
    }
    return node;
  }
  
  return updateNodes(tree);
}