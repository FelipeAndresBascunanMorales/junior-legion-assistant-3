import { Sparkles } from "lucide-react";
import { useState } from "react";

export function PromptModal({ handleGenerateInitialTree }: { handleGenerateInitialTree: (prompt: string) => void }) {

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      handleGenerateInitialTree(prompt);
    } catch (error) {
      console.error('Error generating tree:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="flex flex-col gap-4 p-4 h-64">
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label htmlFor="prompt" className="text-lg font-bold">Do you want to develop an app?</label>
      <input type="text" id="prompt" className="p-2 border border-gray-300 rounded-md" onChange={(e) => setPrompt(e.target.value)} />
      <button 
        type="submit" 
        disabled={!prompt.trim() || isLoading}
        className="flex justify-center items-center text-center gap-2 bg-emerald-700 text-white p-2 rounded-md disabled:opacity-80 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" />
        <p>{isLoading ? <span className="animate-pulse">Generating...</span> : 'Generate'}</p>
      </button>
    </form>
  </div>;
}


