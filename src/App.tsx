
import './App.css'
import { TreeView } from './components/TreeView';
import { useTreeState } from './hooks/useTreeState';

function App() {
  const { tree, addChild, updateNodeContent, toggleLock, deleteNode, zoomIn } = useTreeState();


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tree Builder</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
          <TreeView
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
