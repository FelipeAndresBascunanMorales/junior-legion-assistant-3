import { Sparkles } from "lucide-react";
import { TreeNode } from "../types/tree";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { useState } from "react";

export function PromptModal({ setTree }: { setTree: (tree: TreeNode) => void }) {
  const { generateTree } = useAIAssistant();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newTree = await generateTree(prompt);
      setTree(newTree);
    } catch (error) {
      console.error('Error generating tree:', error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="flex flex-col gap-4 p-4">
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label htmlFor="prompt" className="text-lg font-bold">What do you want to develop?</label>
      <input type="text" id="prompt" className="p-2 border border-gray-300 rounded-md" onChange={(e) => setPrompt(e.target.value)} />
      <button 
        type="submit" 
        disabled={!prompt.trim() || isLoading}
        className="flex justify-center items-center text-center gap-2 bg-fuchsia-500 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" />
        <p>{isLoading ? 'Generating...' : 'Generate'}</p>
      </button>
    </form>
  </div>;
}
