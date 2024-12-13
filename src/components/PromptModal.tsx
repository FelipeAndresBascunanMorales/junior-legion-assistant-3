import { Sparkles } from "lucide-react";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { useEffect, useState } from "react";
import { TreeNode } from "../types/tree";
import { useTreeState } from "../hooks/useTreeState";

export function PromptModal( { setTree, tree }: { setTree: (tree: TreeNode) => void, tree: TreeNode }) {

  const { generateInitialTree, addAttributesToTree } = useAIAssistant();

  const { addChildrenWithAI } = useTreeState();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [fillingTree, setFillingTree] = useState(false);

  console.log("tree from modal: ", tree);

// here one inner tree will be getter from the ai assistant the first time, the next subtasks can be added manually with ot without the assistant's help
  useEffect(() => {
    if (fillingTree) {
      console.log("tree in useEffect fillingTree: ", tree);
      tree.children?.forEach((child) => {
        addChildrenWithAI(child.id);
      });

      setFillingTree(false);
    }
  }, [fillingTree]);

  
  useEffect(() => {
    if (fillingTree) {
      console.log("tree in useEffect fillingTree: ", tree);

      const timeout = setTimeout(() => {
        console.log("tree in timeout: ", tree);
      
      addAttributesToTree(tree).then(completedTree => {
        console.log("completedTree: ", completedTree);
        setTree(completedTree);

        setFillingTree(false);
      });
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [fillingTree]);



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {      
      const newTree = await generateInitialTree(prompt);
      setTree(
        newTree
      )
      console.log("tree from modal after setting: ", tree);
      setFillingTree(true);
      // setTree(prev => ({...prev, children: newTree.children}));

      // const newTreeWithAttributes = await addAttributesToTree(tree);
      // setTree(newTreeWithAttributes);
    } catch (error) {
      console.error('Error generating tree:', error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="flex flex-col gap-4 p-4 h-64">
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label htmlFor="prompt" className="text-lg font-bold">What do you want to develop?</label>
      <input type="text" id="prompt" className="p-2 border border-gray-300 rounded-md" onChange={(e) => setPrompt(e.target.value)} />
      <button 
        type="submit" 
        disabled={!prompt.trim() || isLoading}
        className="flex justify-center items-center text-center gap-2 bg-emerald-500 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" />
        <p>{isLoading ? 'Generating...' : 'Generate'}</p>
        <p>{fillingTree ? 'Filling tree...' : ''}</p>
      </button>
    </form>
  </div>;
}


