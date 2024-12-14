import { useTreeState } from './hooks/useTreeState';
import { PromptModal } from './components/PromptModal';
import { TreeView } from './components/TreeView';
import { LashTheAI } from './components/LashTheAI';
import InitialDocuments from './components/InitialDocuments';

function App() {
  const { tree, setTree, addChild, updateNodeContent, toggleLock, deleteNode, zoomIn, addChildrenWithAI, prepare, solveWithAI } = useTreeState();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tree Builder</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
          <PromptModal setTree={setTree} tree={tree} />
          { tree && tree.children && tree.children.length > 1 && (<div className="flex flex-row justify-around gap-4">
            <InitialDocuments />
            <LashTheAI />
          </div>)}
          <TreeView
            key={tree.id}
            tree={tree}
            onAddChild={addChild}
            onUpdateContent={updateNodeContent}
            onToggleLock={toggleLock}
            onDelete={deleteNode}
            onZoomIn={zoomIn}
            onAddChildrenWithAI={addChildrenWithAI}
            onPrepare={prepare}
            onSolveWithAI={solveWithAI}
          />
        </div>
      </div>
    </div>
  )
}

export default App
