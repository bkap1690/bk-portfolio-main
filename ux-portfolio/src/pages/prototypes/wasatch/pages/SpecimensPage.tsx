import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import TabBar from "../components/TabBar";
import { specimensData } from "../data/specimensData";
import type { Specimen } from "../data/specimensData";

interface SpecimensPageProps {
  onSpecimenClick?: (specimenId: string) => void;
}

export default function SpecimensPage({ onSpecimenClick }: SpecimensPageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpecimens = specimensData.specimens.filter((specimen) => {
    const matchesSearch = 
      specimen.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.protocolType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && specimen.processingStatus === "Pending";
    if (activeTab === "completed") return matchesSearch && specimen.processingStatus === "Completed";
    if (activeTab === "archived") return false; // No archived specimens in sample data
    
    return matchesSearch;
  });

  return (
    <div className="px-wasatch-6 py-wasatch-6">

      {/* Page Title */}
      <div className="mb-wasatch-6">
        <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading">Samples</h1>
      </div>

      {/* Tabs */}
      <TabBar
        className="mb-wasatch-6"
        tabs={[
          { id: "all", label: "All Samples" },
          { id: "pending", label: "Pending" },
          { id: "completed", label: "Completed" },
          { id: "archived", label: "Archived" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Filters and Actions */}
      <div className="mb-wasatch-6 flex items-center gap-wasatch-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
            size={18}
          />
          <input
            type="text"
            placeholder="Placeholder text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface py-wasatch-2 pl-wasatch-10 pr-wasatch-4 text-wasatch-sm focus:border-wasatch-accent focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm hover:bg-wasatch-surface-subtle">
          <span>Dates</span>
          <ChevronDown size={16} className="text-wasatch-text-muted" />
        </button>

        <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm hover:bg-wasatch-surface-subtle">
          <span>Protocol</span>
          <ChevronDown size={16} className="text-wasatch-text-muted" />
        </button>

        <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm hover:bg-wasatch-surface-subtle">
          <span>Status</span>
          <ChevronDown size={16} className="text-wasatch-text-muted" />
        </button>

        <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm hover:bg-wasatch-surface-subtle">
          <span>Payment</span>
          <ChevronDown size={16} className="text-wasatch-text-muted" />
        </button>

        {/* Add Sample Button */}
        <button className="ml-auto flex items-center gap-wasatch-2 rounded-wasatch-sm bg-wasatch-accent px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse hover:bg-wasatch-accent-hover">
          <span className="text-lg leading-none">+</span>
          <span>Add sample(s)</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
        <table className="w-full">
          <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
            <tr>
              <th className="px-wasatch-4 py-wasatch-3 text-left">
                <input type="checkbox" className="rounded-wasatch-sm border-wasatch-border-strong" />
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                ID
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Requisition number
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Protocol Type
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Turnaround
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Processing Status
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Date Completed
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Payment Status
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Report
              </th>
              <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                Raw Data
              </th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-wasatch-border"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {filteredSpecimens.map((specimen) => (
              <SpecimenRow
                key={specimen.id}
                specimen={specimen}
                onSpecimenClick={onSpecimenClick}
              />
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}

function SpecimenRow({ 
  specimen, 
  onSpecimenClick 
}: { 
  specimen: Specimen;
  onSpecimenClick?: (specimenId: string) => void;
}) {
  const statusColorClasses = {
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info",
    orange: "bg-wasatch-status-warning-bg text-wasatch-status-warning",
    purple: "bg-wasatch-status-purple-bg text-wasatch-status-purple",
    green: "bg-wasatch-status-success-bg text-wasatch-status-success",
    red: "bg-wasatch-status-error-bg text-wasatch-status-error",
  };

  return (
    <motion.tr
      variants={{
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
      }}
      className="hover:bg-wasatch-surface-subtle cursor-pointer"
      onClick={() => onSpecimenClick?.(specimen.id)}
    >
      <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" className="rounded-wasatch-sm border-wasatch-border-strong" />
      </td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading">{specimen.id}</td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading">{specimen.requisitionNumber}</td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading">{specimen.protocolType}</td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{specimen.turnaround}</td>
      <td className="px-wasatch-4 py-wasatch-3">
        <span
          className={`inline-flex items-center rounded-wasatch-full px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${
            statusColorClasses[specimen.processingStatusColor]
          }`}
        >
          {specimen.processingStatus}
        </span>
      </td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{specimen.dateCompleted}</td>
      <td className="px-wasatch-4 py-wasatch-3">
        <span className="inline-flex items-center text-wasatch-sm text-wasatch-primary">
          {specimen.paymentStatus}
        </span>
      </td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{specimen.report}</td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{specimen.rawData}</td>
    </motion.tr>
  );
}
