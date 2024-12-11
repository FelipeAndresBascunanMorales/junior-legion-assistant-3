
import { useEffect } from 'react';
import { LashTheAI } from './components/LashTheAI';
import { PromptModal } from './components/PromptModal';
import { TreeView } from './components/TreeView';
import { useTreeState } from './hooks/useTreeState';
import { TreeNode } from './types/tree';

function App() {
  const { tree, setTree, addChild, updateNodeContent, toggleLock, deleteNode, zoomIn } = useTreeState();

  useEffect(() => {
    console.log("Tree state in app:", tree);
  }, [tree]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tree Builder</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
          <PromptModal setTree={setTree} tree={tree} />
          { tree && tree.children && tree.children.length > 1 && <LashTheAI />}
          <TreeView
            key={tree.id}
            tree={tree}
            onAddChild={addChild}
            onUpdateContent={updateNodeContent}
            onToggleLock={toggleLock}
            onDelete={deleteNode}
            onZoomIn={zoomIn}
          />
        </div>
      </div>
    </div>
  )
}

export default App
