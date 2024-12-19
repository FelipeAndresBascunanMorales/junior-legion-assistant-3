import { CheckCircle, Loader } from "lucide-react";
import ShowDocument from "./showDocument";

export default function InitialDocuments({
  srsContent,
  wireframeContent,
  enhancedPrompt,
  loadingStep,
}: {
  srsContent: string;
  wireframeContent: string;
  enhancedPrompt: string;
  loadingStep: boolean[];
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 w-full md:w-1/2">
      {/* Enhanced Prompt */}
      <div className="flex flex-row gap-2 relative">
        <ShowDocument title="Enhanced Prompt" content={enhancedPrompt} />{" "}
        {loadingStep[0] && (
          <Loader className="absolute right-2 top-2 w-4 h-4 animate-pulse text-emerald-700 transition-opacity duration-1000" />
        )}{" "}
        {enhancedPrompt && (
          <CheckCircle className="absolute right-2 top-2 w-4 h-4  text-emerald-700" />
        )}
      </div>
      {/* SRS Section */}
      <div className="flex flex-row gap-2 relative">
        <ShowDocument
          title="Software Requirements Specification"
          content={srsContent}
        />{" "}
        {loadingStep[1] && (
          <Loader className="absolute right-2 top-2 w-4 h-4 animate-pulse text-emerald-700 transition-opacity duration-1000" />
        )}{" "}
        {srsContent && (
          <CheckCircle className="absolute right-2 top-2 w-4 h-4  text-emerald-700" />
        )}
      </div>
      {/* Wireframe Section */}
      <div className="flex flex-row gap-2 relative">
        <ShowDocument title="Wireframe Design" content={wireframeContent} />{" "}
        {loadingStep[2] && (
          <Loader className="absolute right-2 top-2 w-4 h-4 animate-pulse text-emerald-700 transition-opacity duration-1000" />
        )}{" "}
        {wireframeContent && (
          <CheckCircle className="absolute right-2 top-2 w-4 h-4  text-emerald-700" />
        )}
      </div>
    </div>
  );
}
