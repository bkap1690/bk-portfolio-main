import { useState } from "react";
import { ChevronDown, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import TabBar from "../components/TabBar";
import { resultsData } from "../data/resultsData";
import type { Result } from "../data/resultsData";

interface ResultsPageProps {
  onResultClick: (resultId: string) => void;
}

export default function ResultsPage({ onResultClick }: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statusColorClasses = {
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border",
    orange: "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border",
    purple: "bg-wasatch-status-purple-bg text-wasatch-status-purple border-wasatch-status-purple-border",
    green: "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border",
    red: "bg-wasatch-status-error-bg text-wasatch-status-error border-wasatch-status-error-border",
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border",
  };

  const filteredResults = resultsData.results.filter((result) => {
    const matchesSearch =
      result.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.protocolType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.assignedProjectManager.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && (result.status === "Pending" || result.status === "Processing");
    if (activeTab === "completed") return matchesSearch && result.status === "Completed";

    return matchesSearch;
  });

  return (
    <div className="px-wasatch-6 py-wasatch-6">
      <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-6">Results & Reporting</h1>

      {/* Tabs */}
      <TabBar
        className="mb-wasatch-6"
        tabs={[
          { id: "all", label: "All Tests" },
          { id: "pending", label: "Pending Tests" },
          { id: "completed", label: "Completed Tests" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Search and Filter */}
      <div className="mb-wasatch-6 flex items-center gap-wasatch-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
            size={18}
          />
          <input
            type="text"
            placeholder="Search for tests"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface py-wasatch-2 pl-wasatch-10 pr-wasatch-4 text-wasatch-sm focus:border-wasatch-accent focus:outline-none"
          />
        </div>
        <button className="rounded-wasatch-sm bg-wasatch-accent px-wasatch-6 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse hover:bg-wasatch-accent-hover">
          Search
        </button>
        <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
        <table className="w-full">
          <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
            <tr>
              <th className="px-wasatch-4 py-wasatch-3 text-left">
                <input
                  type="checkbox"
                  className="rounded-wasatch-sm border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent"
                />
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                <div className="flex items-center gap-wasatch-1">
                  ID
                  <ChevronDown size={14} />
                </div>
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                <div className="flex items-center gap-wasatch-1">
                  Protocol Type
                  <ChevronDown size={14} />
                </div>
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                <div className="flex items-center gap-wasatch-1">
                  Date Conducted
                  <ChevronDown size={14} />
                </div>
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                <div className="flex items-center gap-wasatch-1">
                  Status
                  <ChevronDown size={14} />
                </div>
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                <div className="flex items-center gap-wasatch-1">
                  Assigned Project Manager
                  <ChevronDown size={14} />
                </div>
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-wasatch-border"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {filteredResults.map((result) => (
              <ResultRow
                key={result.id}
                result={result}
                statusColorClasses={statusColorClasses}
                onResultClick={onResultClick}
              />
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}

function ResultRow({
  result,
  statusColorClasses,
  onResultClick,
}: {
  result: Result;
  statusColorClasses: Record<string, string>;
  onResultClick: (resultId: string) => void;
}) {
  return (
    <motion.tr
      variants={{
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
      }}
      className="hover:bg-wasatch-surface-subtle transition-colors cursor-pointer"
      onClick={() => onResultClick(result.id)}
    >
      <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="rounded-wasatch-sm border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent"
        />
      </td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{result.id}</td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{result.protocolType}</td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{result.dateConducted}</td>
      <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
        <span
          className={`inline-flex items-center rounded-wasatch-full border px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${
            statusColorClasses[result.statusColor]
          }`}
        >
          {result.status === "Completed" && (
            <span className="mr-1">✓</span>
          )}
          {result.status}
        </span>
      </td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{result.assignedProjectManager}</td>
      <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-wasatch-3">
          <button
            onClick={() => onResultClick(result.id)}
            className="text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover"
          >
            View
          </button>
          <button
            onClick={() => onResultClick(result.id)}
            className="text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover"
          >
            Report
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
