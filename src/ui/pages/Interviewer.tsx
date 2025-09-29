import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";
import { useState } from "react";
import CandidateDetailModal from "../components/CandidateDetailModal";

export default function Interviewer() {
  const candidates = useSelector((s: RootState) => s.candidates.list);
  const [selected, setSelected] = useState<null | typeof candidates[0]>(null);

  const total = candidates.length;
  const completed = candidates.length;
  const inProgress = 0; 
  const avgScore =
    candidates.length > 0
      ? Math.round(
          candidates.reduce((sum, c) => sum + (c.finalScore ?? 0), 0) /
            candidates.length
        )
      : 0;

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Candidates" value={total} icon="👥" />
        <MetricCard title="Completed" value={completed} icon="✅" />
        <MetricCard title="In Progress" value={inProgress} icon="⏳" />
        <MetricCard
          title="Average Score"
          value={`${avgScore}`}
          sub="Out of 100"
          icon="📈"
        />
      </div>

      {/* AI Insights */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Overall Performance</p>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                {avgScore}/100
              </span>
              <p className="text-sm text-gray-600">
                Average candidate score is {avgScore}/100.
              </p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="h-2 bg-indigo-500 rounded-full"
                style={{ width: `${avgScore}%` }}
              />
            </div>
          </div>

          <div>
            <p className="font-medium">Hiring Recommendation</p>
            <p className="text-sm text-gray-600">
              {candidates.filter((c) => (c.finalScore ?? 0) >= 80).length === 0
                ? "0% of candidates scored 80+. Consider refining job requirements."
                : "Some candidates show strong performance (80+)."}
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Management */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Candidate Management</h2>
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500 border-b">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Summary</th>
              <th className="pb-2">Finished</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {candidates.map((c) => (
              <tr key={c.id} className="text-sm">
                <td className="py-2">{c.identity.name}</td>
                <td className="py-2">{c.finalScore ?? "-"}</td>
                <td className="py-2 text-gray-600 truncate max-w-xs">
                  {c.summary}
                </td>
                <td className="py-2 text-gray-500 text-xs">
                  {new Date(c.finishedAt).toLocaleString()}
                </td>
                <td className="py-2 text-right">
                  <button
                    className="px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-500"
                    onClick={() => setSelected(c)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <CandidateDetailModal
          candidate={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon?: string;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}
