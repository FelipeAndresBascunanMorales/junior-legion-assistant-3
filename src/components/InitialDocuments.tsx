
export default function InitialDocuments({ srsContent, wireframeContent }: { srsContent: string, wireframeContent: string }) {

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 w-1/2">
      {/* SRS Section */}
      <div className="srs-section">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Software Requirements Specification
        </h2>
        <div className={`bg-gray-50 p-4 rounded-md bg-yellow-200 border-b-2 border-l-2 border-red-500`}>
          <pre className="whitespace-pre-wrap text-gray-700">
            {srsContent || "No SRS content available"}
          </pre>
        </div>
      </div>

      {/* Wireframe Section */}
      <div className="wireframe-section">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Wireframe Design
        </h2>
        <div className={`bg-gray-50 p-4 rounded-md bg-yellow-200 border-b-2 border-l-2 border-red-500`}>
          <pre className="whitespace-pre-wrap text-gray-700">
            {wireframeContent || "No wireframe content available"}
          </pre>
        </div>
      </div>
    </div>
  );
}
