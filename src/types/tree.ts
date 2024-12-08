export interface TreeNode {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
  children: TreeNode[] | null;
  parentId: string | null;
}

export interface Position {
  x: number;
  y: number;
}