import React, { useState } from 'react';
import { Lock, Unlock, Plus, X, Search, Layers, Hammer, RefreshCcw, Check, WandSparkles } from 'lucide-react';
import { TreeNode as TreeNodeType } from '../types/tree';
import clsx from 'clsx';

interface TreeNodeProps {
  node: TreeNodeType;
  onAddChild: (parentId: string) => void;
  onUpdateContent: (nodeId: string, title: string, description: string) => void;
  onToggleLock: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onZoomIn: (nodeId: string) => void;
  onAddChildrenWithAI: (nodeId: string, prompt?: string) => void;
  onPrepare: (nodeId: string) => void;
}

export function TreeNode({
  node,
  onAddChild,
  onUpdateContent,
  onToggleLock,
  onDelete,
  onZoomIn,
  onAddChildrenWithAI,
  onPrepare
}: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(node.title);
  const [editedDescription, setEditedDescription] = useState(node.description);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [prompt, setPrompt] = useState('');

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

  const handleToggleSolved = () => {
    node.solved = !node.solved;
  };

  return (
    <div className="relative group">
      <div
        className={clsx(
          "p-4 bg-white border rounded-lg shadow-sm w-[250px]",
          node.isLocked
            ? "border-gray-400"
            : "border-green-200 hover:border-green-300",
          node.solved && "bg-teal-100",
          "transition-colors"
        )}
      >
        <div onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <div className="space-y-2 bg-">
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
              {node?.readyForDevelopment && (
                <div className="text-sm text-gray-600">
                  {node.indicationsForDevelopment?.instructions}
                </div>
              )}
            </div>
          ) : (
            <div className="min-h-[80px] py-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {node.title}
              </h3>
              <p className="text-sm text-gray-600">{node.description}</p>
              <div className="flex gap-2">
                {/* the prepare button */}
                <div
                  className="absolute bottom-0 left-0 m-1 group-hover:inline-block hidden"
                  hidden={node.readyForDevelopment}
                  onClick={() => onPrepare(node.id)}
                >
                  <button className="px-1 bg-white border rounded hover:bg-gray-50 hover:text-blue-500">
                    prepare
                  </button>
                </div>
                {/* the solve button */}
                <div
                  className="absolute bottom-0 right-0 m-1 group-hover:inline-block hidden"
                  hidden={node.solved}
                  onClick={() => handleToggleSolved()}
                >
                  <button
                    className="px-1 bg-white border rounded hover:bg-gray-50 hover:text-green-500"
                    onClick={() => handleToggleSolved()}
                  >
                    solved
                  </button>
                </div>
              </div>
              {node?.readyForDevelopment && (
                <div className="text-sm text-gray-600">
                  {node.indicationsForDevelopment?.instructions}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute top-2 left-2 flex gap-1">
          <div
            className={clsx(
              "w-2 h-2 rounded-full",
              node.solved ? "bg-green-500" : "bg-gray-500"
            )}
          ></div>
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          {!node.isLocked && (
            <>
              <button
                onClick={() => solveWithAI(node.id)}
                className="p-1 text-gray-500 hover:text-green-500 rounded"
                title="WandSparkles"
                hidden={!node.readyForDevelopment}
              >
                <WandSparkles size={16} />
              </button>
              <button
                onClick={() => onZoomIn(node.id)}
                className="p-1 text-gray-500 hover:text-green-500 rounded"
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
            className={clsx(
              "p-1 text-gray-500 hover:text-green-500 rounded",
              node.isLocked ? "text-gray-600" : "text-gray-500"
            )}
            title={node.isLocked ? "Unlock" : "Lock"}
          >
            {node.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>

        {/* the order indicator */}
        <div className="absolute -bottom-2 -left-2 flex gap-1">
          <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
            {node.order}
          </div>
        </div>

        {node.isReachableByEntryLevelDevelopers &&
          node.levelOfGranularity &&
          node.levelOfGranularity > 6 && (
            <div className="absolute -top-2 left-6 flex gap-1">
              <Hammer className="text-emerald-600" size={24} strokeWidth={2} />
            </div>
          )}

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 p-4">
          <button
            onClick={() => onAddChild(node.id)}
            // onClick={() => onAddChildrenWithAI(node.id)}
            className="p-1 bg-white border rounded-full shadow-sm hover:bg-gray-50"
            title="Add child"
          >
            <Plus size={16} />
          </button>

          {/* button to regenerate: */}
          <button
            onClick={() => setIsAddingPrompt(true)}
            className="absolute p-1 bg-white border rounded-full shadow-sm hover:bg-gray-50 ml-2 group-hover:inline-block hidden transition-all"
            title="Regenerate"
          >
            <RefreshCcw size={16} />
          </button>
          {/* input prompt */}
        </div>
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full z-10"
          hidden={!isAddingPrompt}
        >
          <input
            type="text"
            placeholder="Input prompt"
            className="w-full p-1 border rounded text-sm shadow-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={() => (
              onAddChildrenWithAI(node.id, prompt), setIsAddingPrompt(false)
            )}
            className="p-1 bg-white border rounded-full shadow-sm hover:bg-gray-50"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}