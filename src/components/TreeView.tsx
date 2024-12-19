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
  onAddChildrenWithAI: (nodeId: string, prompt?: string) => void;
  onPrepare: (nodeId: string) => void;
  onSolveWithAI: (nodeId: string) => void;
}

export function TreeView({
  tree,
  onAddChild,
  onUpdateContent,
  onToggleLock,
  onDelete,
  onZoomIn,
  onAddChildrenWithAI,
  onPrepare,
  onSolveWithAI
}: TreeViewProps) {

  const [zoomedNodeId, setZoomedNodeId] = useState<string | null>(null);

  const handleZoomIn = (nodeId: string) => {
    setZoomedNodeId(zoomedNodeId === nodeId ? null : nodeId);
    onZoomIn(nodeId);
  };

  const renderNode = (node: TreeNodeType) => (
    <div key={node.id} className="flex flex-col items-center justify-center">
      <div className="relative ">
        <TreeNodeComponent
          node={node}
          onAddChild={onAddChild}
          onUpdateContent={onUpdateContent}
          onToggleLock={onToggleLock}
          onDelete={onDelete}
          onZoomIn={handleZoomIn}
          onAddChildrenWithAI={onAddChildrenWithAI}
          onPrepare={onPrepare}
          onSolveWithAI={onSolveWithAI}
          isZoomed={zoomedNodeId === node.id}
        />
        {node.children && node.children.length > 0 && (
          <div className="absolute w-px h-16 border-l-2 border-gray-200 left-1/2 top-full" />
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="flex gap-8 mt-16">
          <div className="flex gap-8 pt-16 border-2 px-2 pb-16 bg-emerald-400/80 rounded-lg">
            {node.children.map(childNode => renderNode(childNode))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-w-auto h-full inline-flex items-center p-8 overflow-x-auto">
      {renderNode(tree)}
    </div>
  );
}
