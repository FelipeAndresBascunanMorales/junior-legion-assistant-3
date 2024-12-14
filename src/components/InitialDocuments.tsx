import { useEffect } from 'react';
import { useAIAssistant } from '../hooks/useAIAssistant';

export default function InitialDocuments() {
  const { srsContent, wireframeContent } = useAIAssistant();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* SRS Section */}
      {srsContent && (
        <div className="srs-section">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">
            Software Requirements Specification
          </h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-gray-700">
              {typeof srsContent === 'string' ? srsContent : JSON.stringify(srsContent, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Wireframe Section */}
      {wireframeContent && (
        <div className="wireframe-section">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">
            Wireframe Design
          </h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-gray-700">
              {typeof wireframeContent === 'string' ? wireframeContent : JSON.stringify(wireframeContent, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {!srsContent && !wireframeContent && (
        <div className="text-gray-500 text-center py-4">
          No SRS or wireframe content available
        </div>
      )}
    </div>
  );
}
