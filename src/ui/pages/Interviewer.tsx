import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";
import { useState } from "react";
import CandidateDetailModal from "../components/CandidateDetailModal";
import {
  Users,
  CheckCircle2,
  Timer,
  BarChart3,
  Eye,
  Search,
  ArrowUpDown,
} from "lucide-react";

export default function Interviewer() {
  const candidates = useSelector((s: RootState) => s.candidates.list);
  console.log("Candidates in state:", candidates);
  const [selected, setSelected] = useState<null | typeof candidates[0]>(null);

  // search + sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

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

  // filter + sort logic
  const filteredCandidates = candidates
    .filter(
      (c) =>
        c.identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.identity.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? (b.finalScore ?? 0) - (a.finalScore ?? 0)
        : (a.finalScore ?? 0) - (b.finalScore ?? 0)
    );

  return (
    <div className="p-8 space-y-10 max-w-6xl mx-auto">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Candidates"
          value={total}
          icon={<Users className="h-6 w-6 text-indigo-600" />}
        />
        <MetricCard
          title="Completed"
          value={completed}
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
        />
        <MetricCard
          title="In Progress"
          value={inProgress}
          icon={<Timer className="h-6 w-6 text-yellow-600" />}
        />
        <MetricCard
          title="Average Score"
          value={`${avgScore}`}
          sub="Out of 100"
          icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Candidate Management</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email"
                className="pl-8 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort */}
            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "desc" ? "High → Low" : "Low → High"}
            </button>
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <p className="text-gray-500 text-sm">No matching candidates.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-sm text-gray-500 border-b">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Score</th>
                <th className="pb-2">Summary</th>
                <th className="pb-2">Finished</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCandidates.map((c) => (
                <tr key={c.id} className="text-sm hover:bg-gray-50">
                  <td className="py-2 font-medium">{c.identity.name}</td>
                  <td className="py-2 text-gray-600">{c.identity.email}</td>
                  <td className="py-2 font-semibold text-indigo-600">
                    {c.finalScore ?? "-"}
                  </td>
                  <td className="py-2 text-gray-600 truncate max-w-xs">
                    {c.summary}
                  </td>
                  <td className="py-2 text-gray-500 text-xs">
                    {new Date(c.finishedAt).toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-500 transition"
                      onClick={() => setSelected(c)}
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}
