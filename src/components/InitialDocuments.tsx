import ShowDocument from "./showDocument";

export default function InitialDocuments({
  srsContent,
  wireframeContent,
  enhancedPrompt,
}: {
  srsContent: string;
  wireframeContent: string;
  enhancedPrompt: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 w-1/2">
      {/* Enhanced Prompt */}
      <ShowDocument title="Enhanced Prompt" content={enhancedPrompt} />
      {/* SRS Section */}
      <ShowDocument title="Software Requirements Specification" content={srsContent} />
      {/* Wireframe Section */}
      <ShowDocument title="Wireframe Design" content={wireframeContent} />
    </div>
  );
}
