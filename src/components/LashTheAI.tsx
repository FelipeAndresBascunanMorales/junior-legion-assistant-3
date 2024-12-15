import { Sparkles, Hammer, HandMetal } from "lucide-react";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { useTreeState } from "../hooks/useTreeState";

export function LashTheAI({ active }: { active: boolean }) {
  const { solveATaskWithAIAutonomously } = useAIAssistant();
  const { tree } = useTreeState();

  return (
    <div className="items-center justify-center">
      <button
        className={`flex items-center justify-center gap-2 bg-emerald-700 text-white p-2 px-4 rounded-md border-b-4 border-l-4 border-red-500 hover:bg-emerald-600 transition-colors ${active ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}
        onClick={async () => {
          await solveATaskWithAIAutonomously(tree, null);
        }}
      >
        <span className="text-sm">Lash</span>
        <Sparkles className="w-4 h-4" />
        <span className="text-sm">the</span>
        <Hammer className="w-4 h-4" />
        <span className="text-sm">AI</span>
        <HandMetal className="w-4 h-4" />
      </button>
    </div>
  );
}
