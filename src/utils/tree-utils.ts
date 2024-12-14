import { TreeNode } from '../types/tree';

export function findNode(tree: TreeNode, id: string): TreeNode | null {
  if (tree.id === id) return tree;
  
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
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