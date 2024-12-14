import { Sparkles, Hammer, HandMetal } from "lucide-react";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { useTreeState } from "../hooks/useTreeState";

export function LashTheAI() {
  const { solveATaskWithAIAutonomously } = useAIAssistant();
  const { tree } = useTreeState();

  return <div className="flex flex-col gap-2 h-64 items-center justify-center">
    <button className="flex items-center justify-center gap-2 bg-emerald-500 text-white p-2 px-4 rounded-md hover:bg-emerald-600" onClick={async () => {
      await solveATaskWithAIAutonomously(tree, null);
    }}>
      <span className="text-sm">Lash</span>
      <Sparkles className="w-4 h-4" />
      <span className="text-sm">the</span>
      <Hammer className="w-4 h-4" />
      <span className="text-sm">AI</span>
      <HandMetal className="w-4 h-4" />
    </button>
  </div>
}