import { useState } from "react";
import Interviewee from "./ui/pages/Interviewee";
import Interviewer from "./ui/pages/Interviewer";

export default function App() {
  const [activeTab, setActiveTab] = useState<"candidate" | "interviewer">("candidate");

  return (
    <div className="min-h-screen bg-zinc-200 flex flex-col">
      {/* App header */}
      <header className="bg-white shadow-xl border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            AI Interview Assistant
          </h1>

          {/* Tabs */}
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab("candidate")}
              className={`relative pb-2 text-sm font-bold transition-colors ${
                activeTab === "candidate"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Candidate Interview
              {activeTab === "candidate" && (
                <span className="absolute left-0 bottom-0 h-0.5 w-full bg-indigo-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("interviewer")}
              className={`relative pb-2 text-sm font-bold transition-colors ${
                activeTab === "interviewer"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Interviewer Dashboard
              {activeTab === "interviewer" && (
                <span className="absolute left-0 bottom-0 h-0.5 w-full bg-indigo-600 rounded-full" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Tab body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {activeTab === "candidate" && <Interviewee />}
        {activeTab === "interviewer" && <Interviewer />}
      </main>
    </div>
  );
}
