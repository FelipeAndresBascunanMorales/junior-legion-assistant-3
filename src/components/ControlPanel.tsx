import { PromptModal } from "./PromptModal";
import InitialDocuments from "./InitialDocuments";
import { LashTheAI } from "./LashTheAI";
import { TreeNode } from "../types/tree";
import { useAIAssistant } from "../hooks/useAIAssistant";

export default function ControlPanel({ handleGenerateInitialTree, tree }: { handleGenerateInitialTree: (prompt: string) => void, tree: TreeNode }) {

  
  const { srsContent, wireframeContent } = useAIAssistant();

    return <div className="bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
        <PromptModal handleGenerateInitialTree={handleGenerateInitialTree}/>
        { tree && tree.children && tree.children.length > 1 && (<div className="flex flex-row justify-around gap-4">
          <InitialDocuments srsContent={srsContent} wireframeContent={wireframeContent} />
          <LashTheAI />
        </div>)}
      </div>;
}