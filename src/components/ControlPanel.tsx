import { PromptModal } from "./PromptModal";
import InitialDocuments from "./InitialDocuments";
import { LashTheAI } from "./LashTheAI";
import { TreeNode } from "../types/tree";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { useState } from "react";

export default function ControlPanel({ tree, setTree }: { tree: TreeNode, setTree: (tree: TreeNode) => void }) {
  const {
    generateInitialTree,
    generateDocuments,
    generateSrs,
    generateWireframe,
  } = useAIAssistant();
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [srsContent, setSrsContent] = useState("");
  const [wireframeContent, setWireframeContent] = useState("");

  const handleGenerateInitialTree = async (prompt: string) => {
    try {
      const { enhancedPrompt: enhancedPrompt } = await generateDocuments(
        prompt
      );
      setEnhancedPrompt(enhancedPrompt);
      const newSrs = await generateSrs(enhancedPrompt);
      setSrsContent(newSrs);
      const newWireframe = await generateWireframe(enhancedPrompt);
      setWireframeContent(newWireframe);
      const newTree = await generateInitialTree(enhancedPrompt);
      setTree(newTree);
    } catch (error) {
      console.error("Error generating tree:", error);
    }
  };
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
      <PromptModal onGenerateInitialTree={handleGenerateInitialTree} />
      <div className="flex justify-around items-center gap-4">
        <InitialDocuments
          srsContent={srsContent}
          wireframeContent={wireframeContent}
        enhancedPrompt={enhancedPrompt}
      />
        <LashTheAI active={tree && tree.children && tree.children.length > 1 ? true : false}/>
      </div>
    </div>
  );
}