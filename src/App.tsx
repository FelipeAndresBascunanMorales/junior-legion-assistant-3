import { useTreeState } from './hooks/useTreeState';
import { TreeView } from './components/TreeView';
import ControlPanel from './components/controlPanel';


function App() {
  const { tree, addChild, updateNodeContent, toggleLock, deleteNode, zoomIn, addChildrenWithAI, prepare, solveWithAI, handleGenerateInitialTree } = useTreeState();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          <div className="flex flex-row justify-center items-center gap-2">
            <p className=" border-2 text-justify border-emerald-700 w-min p-2 text-2xl font-bold">DO NOT DEVELOP MY APP .</p>
          </div>
        </h1>
        <div className="bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
          <ControlPanel handleGenerateInitialTree={handleGenerateInitialTree} tree={tree}/>
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
