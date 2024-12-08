import { TreeNode as TreeNodeComponent } from './TreeNode';
import { TreeNode as TreeNodeType } from '../types/tree';

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
          <div className="flex gap-8 pt-16 border px-2 pb-16">
            {node.children.map(childNode => renderNode(childNode))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center p-8">
      {renderNode(tree)}
    </div>
  );
}