import { TreeNode as TreeNodeComponent } from './TreeNode';
import { TreeNode as TreeNodeType } from '../types/tree';
import { useState } from 'react';

interface TreeViewProps {
  tree: TreeNodeType;
  onAddChild: (parentId: string) => void;
  onUpdateContent: (nodeId: string, title: string, description: string) => void;
  onToggleLock: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onZoomIn: (nodeId: string) => void;
}

export function TreeView({
  tree,
  onAddChild,
  onUpdateContent,
  onToggleLock,
  onDelete,
  onZoomIn
}: TreeViewProps) {
  const [zoomedNodeId, setZoomedNodeId] = useState<string | null>(null);

  const findNode = (node: TreeNodeType, id: string): TreeNodeType | null => {
    if (node.id === id) return node;
    
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    
    return null;
  };

  const currentTree = zoomedNodeId ? findNode(tree, zoomedNodeId) : tree;

  if (!currentTree) return null;

  const renderNode = (node: TreeNodeType) => (
    <div key={node.id} className="flex flex-col items-center">
      <div className="relative">
        <TreeNodeComponent
          node={node}
          onAddChild={onAddChild}
          onUpdateContent={onUpdateContent}
          onToggleLock={onToggleLock}
          onDelete={onDelete}
          onZoomIn={onZoomIn}
        />
        {node.children && node.children.length > 0 && (
          <div className="absolute w-px h-16 border-l-2 border-gray-200 left-1/2 top-full" />
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="flex gap-8 mt-16">
          {node.children.map(childNode => renderNode(childNode))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center p-8">
      {zoomedNodeId && (
        <button
          onClick={() => setZoomedNodeId(null)}
          className="mb-8 flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Back to Main Tree
        </button>
      )}
      {renderNode(currentTree)}
    </div>
  );
}