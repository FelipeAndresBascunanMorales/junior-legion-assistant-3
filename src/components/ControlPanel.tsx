import { PromptModal } from "./PromptModal";
import InitialDocuments from "./InitialDocuments";
import { LashTheAI } from "./LashTheAI";
import { TreeNode } from "../types/tree";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { useState } from "react";

export default function ControlPanel({ tree, setTree }: { tree: TreeNode, setTree: (tree: TreeNode) => void }) {
  const {
    generateInitialTree,
    generateSrs,
    generateWireframe,
    enhancePrompt,
  } = useAIAssistant();
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [srsContent, setSrsContent] = useState("");
  const [wireframeContent, setWireframeContent] = useState("");
  const [loadingStep, setLoadingStep] = useState([false, false, false]);

  const handleGenerateInitialTree = async (prompt: string) => {
    try {
      setLoadingStep([true, true, true]);
      const enhancedPrompt = await enhancePrompt(prompt);
      setEnhancedPrompt(enhancedPrompt);      
      setLoadingStep([false, true, true]);
      
      const srs = await generateSrs(enhancedPrompt);
      setSrsContent(srs);
      setLoadingStep([false, false, true]);
      
      const wireframe = await generateWireframe(enhancedPrompt);
      setWireframeContent(wireframe);
      setLoadingStep([false, false, false]);
      
      const newTree = await generateInitialTree();
      setTree(newTree);
    } catch (error) {
      console.error("Error generating tree:", error);
    }
  };
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
      <PromptModal onGenerateInitialTree={handleGenerateInitialTree} />
      <div className="flex flex-col md:flex-row justify-around items-center gap-4">
        <InitialDocuments
          srsContent={srsContent}
          wireframeContent={wireframeContent}
          enhancedPrompt={enhancedPrompt}
          loadingStep={loadingStep}
        />
        <LashTheAI active={tree && tree.children && tree.children.length > 1 ? true : false}/>
      </div>
    </div>
  );
}