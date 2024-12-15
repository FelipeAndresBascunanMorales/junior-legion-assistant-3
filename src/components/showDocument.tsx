"use client";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function ShowDocument({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const displayContent = typeof content === "object"
    ? JSON.stringify(content, null, 2)
    : content || "No content yet";

  return (
    <>
      {/* Collapsed view */}
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 p-4 rounded-md bg-yellow-200 border-b-2 border-l-2 border-red-500">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <span className="text-xs text-gray-500 truncate flex-1">
            {displayContent.slice(0, 50)}
            {displayContent.length > 50 ? "..." : ""}
          </span>
        </div>
      </div>
      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="mx-auto max-w-3xl w-full max-h-[80vh] bg-white rounded-lg shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex sticky top-0 bg-white py-4 justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md bg-yellow-200 border-b-2 border-l-2 border-red-500">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {displayContent}
                </pre>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
