import { useState } from "react";
import Interviewee from "./ui/pages/Interviewee";
import Interviewer from "./ui/pages/Interviewer";

export default function App() {
  const [activeTab, setActiveTab] = useState<"candidate" | "interviewer">("candidate");

  return (
    <div className="min-h-screen p-70 bg-gray-50">
      {/* Tab header */}
      <div className="flex border-b bg-white shadow-sm">
        <button
          onClick={() => setActiveTab("candidate")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "candidate"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Candidate Interview
        </button>
        <button
          onClick={() => setActiveTab("interviewer")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "interviewer"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Interviewer Dashboard
        </button>
      </div>

      {/* Tab body */}
      <div className="p-6">
        {activeTab === "candidate" && <Interviewee />}
        {activeTab === "interviewer" && <Interviewer />}
      </div>
    </div>
  );
}
