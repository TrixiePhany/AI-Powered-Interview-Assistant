import { useEffect } from "react";

type Props = {
  candidate: any; 
  onClose: () => void;
};

export default function CandidateDetailModal({ candidate, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[800px] max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Candidate Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Profile */}
          <div>
            <h3 className="text-xl font-bold">{candidate.identity.name}</h3>
            <p className="text-gray-400 text-sm">{candidate.identity.email}</p>
            <p className="text-gray-500 text-sm">{candidate.identity.phone}</p>
          </div>

          {/* Score + summary */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-2xl font-bold text-indigo-400">
              Score: {candidate.finalScore}
            </p>
            <p className="text-gray-300 mt-2">{candidate.summary}</p>
          </div>

          {/* Q&A Table */}
          <div>
            <h4 className="font-semibold mb-3">Interview Questions</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-gray-300">
                  <tr>
                    <th className="px-3 py-2 text-left">Question</th>
                    <th className="px-3 py-2 text-left">Answer</th>
                    <th className="px-3 py-2 text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {candidate.qas.map((qa: any) => (
                    <tr
                      key={qa.id}
                      className="border-t border-gray-700 hover:bg-gray-800/60"
                    >
                      <td className="px-3 py-2 align-top w-1/3">
                        <span className="font-medium">{qa.question}</span>
                        <span className="block text-xs text-gray-500">
                          ({qa.difficulty})
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top w-2/3 text-gray-200 whitespace-pre-line">
                        {qa.answer || (
                          <span className="text-gray-500 italic">No answer</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (qa.score ?? 0) >= 7
                              ? "bg-green-500/20 text-green-400"
                              : (qa.score ?? 0) >= 4
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {qa.score ?? "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
