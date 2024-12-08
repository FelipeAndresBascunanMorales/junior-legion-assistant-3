import React, { useState } from 'react';
import { Lock, Unlock, Plus, X, Search, Layers } from 'lucide-react';
import { TreeNode as TreeNodeType } from '../types/tree';

interface TreeNodeProps {
  node: TreeNodeType;
  onAddChild: (parentId: string) => void;
  onUpdateContent: (nodeId: string, title: string, description: string) => void;
  onToggleLock: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onZoomIn: (nodeId: string) => void;
}

export function TreeNode({
  node,
  onAddChild,
  onUpdateContent,
  onToggleLock,
  onDelete,
  onZoomIn
}: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(node.title);
  const [editedDescription, setEditedDescription] = useState(node.description);

  const handleDoubleClick = () => {
    if (!node.isLocked) {
      setIsEditing(true);
      setEditedTitle(node.title);
      setEditedDescription(node.description);
    }
  };

  const handleContentSubmit = () => {
    onUpdateContent(node.id, editedTitle, editedDescription);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleContentSubmit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(node.title);
      setEditedDescription(node.description);
    }
  };

  return (
    <div className="relative group">
      <div className={`
        p-4 bg-white border rounded-lg shadow-sm w-[250px]
        ${node.isLocked ? 'border-gray-300' : 'border-blue-200 hover:border-blue-300'}
        transition-colors
      `}>
        <div onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 border rounded text-sm"
                autoFocus
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 border rounded text-sm resize-none"
                rows={2}
              />
            </div>
          ) : (
            <div className="min-h-[80px]">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {node.title}
              </h3>
              <p className="text-sm text-gray-600">{node.description}</p>
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          {!node.isLocked && (
            <>
              <button
                onClick={() => onZoomIn(node.id)}
                className="p-1 text-gray-500 hover:text-blue-500 rounded"
                title="View details"
              >
                <Search size={16} />
              </button>
              <button
                onClick={() => onDelete(node.id)}
                className="p-1 text-gray-500 hover:text-red-500 rounded"
                title="Delete node"
              >
                <X size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => onToggleLock(node.id)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded"
            title={node.isLocked ? "Unlock" : "Lock"}
          >
            {node.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => onAddChild(node.id)}
            className="p-1 bg-white border rounded-full shadow-sm hover:bg-gray-50"
            title="Add child"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}