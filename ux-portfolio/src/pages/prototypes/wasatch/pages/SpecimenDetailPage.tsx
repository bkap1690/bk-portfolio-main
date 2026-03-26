import { useState } from "react";
import { Edit2, Paperclip, MoreHorizontal, Download, Microscope } from "lucide-react";
import { getSpecimenDetail } from "../data/specimensData";
import { getResultsBySampleId } from "../data/resultsData";
import TabBar from "../components/TabBar";

interface SpecimenDetailPageProps {
  specimenId: string;
  onResultClick?: (resultId: string) => void;
}

export default function SpecimenDetailPage({ specimenId, onResultClick }: SpecimenDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"details" | "tests" | "results" | "reporting" | "history" | "documents">("details");
  const [comment, setComment] = useState("");
  
  const specimen = getSpecimenDetail(specimenId);

  if (!specimen) {
    return (
      <div className="px-6 py-6">
        <div className="text-center text-wasatch-text-muted">Specimen not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border";
      default:
        return "bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border";
    }
  };

  return (
    <div className={`px-6 py-6 max-w-[calc(100%-(254.55px+16px))]`}>
      {/* Page Header */}
      <div className="mb-wasatch-6 flex items-start justify-between">
        <div className="flex items-center gap-wasatch-4">
          <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading">Specimen Details</h1>
          <span
            className={`inline-flex items-center rounded-wasatch-full border px-wasatch-3 py-wasatch-1 text-wasatch-sm font-wasatch-medium ${getStatusColor(specimen.status)}`}
          >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
            {specimen.status}
          </span>
          <button className="p-wasatch-1 hover:bg-wasatch-surface-subtle rounded">
            <MoreHorizontal size={20} className="text-wasatch-text-secondary" />
          </button>
        </div>

        <div className="flex items-center gap-wasatch-3">
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle">
            <Download size={16} />
            Download Report
          </button>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm bg-wasatch-neutral-700 px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse hover:bg-wasatch-neutral-800">
            <Microscope size={16} />
            Request Analysis
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mb-wasatch-6 grid grid-cols-4 gap-wasatch-4">
        <InfoCard
          label="Specimen ID"
          value={specimen.specimenId}
        />
        <InfoCard
          label="Associated Order"
          value={specimen.associatedOrder}
        />
        <InfoCard
          label="Requisition number"
          value={specimen.requisitionNumber}
        />
        <InfoCard
          label="Specimen Type"
          value={specimen.specimenType}
        />
      </div>

      {/* Tabs */}
      <TabBar
        className="mb-wasatch-6"
        tabs={[
          { id: "details", label: "Details" },
          { id: "tests", label: "Tests" },
          { id: "results", label: "Results" },
          { id: "reporting", label: "Reporting" },
          { id: "history", label: "History Log" },
          { id: "documents", label: "Documents" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === "details" && (
        <>
          {/* Specimen Information */}
          <section className="mb-wasatch-6 rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
            <div className="flex items-center justify-between border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
              <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">Specimen information</h2>
              <button className="flex items-center gap-2 text-sm text-wasatch-primary hover:text-wasatch-primary-hover">
                <Edit2 size={16} />
                Edit
              </button>
            </div>
            <div className="p-wasatch-6">
              <div className="grid grid-cols-1 gap-x-wasatch-8 gap-y-wasatch-6">
                <DetailRow label="Collection Date & Time" value={specimen.collectionDate} />
                <DetailRow label="Collected By" value={specimen.collectedBy} />
                <DetailRow label="Priority Level" value={specimen.priorityLevel} />
                <DetailRow label="Location" value={specimen.location} />
                <DetailRow label="Volume" value={specimen.volume} />
                <DetailRow label="Concentration" value={specimen.concentration} />
              </div>
            </div>
          </section>

          {/* Attachments */}
          <section className="mb-wasatch-6 rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
            <div className="flex items-center justify-between border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
              <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">Attachments</h2>
              <button className="flex items-center gap-2 text-sm text-wasatch-primary hover:text-wasatch-primary-hover">
                <Edit2 size={16} />
                Edit
              </button>
            </div>
            <div className="p-wasatch-6">
              {specimen.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between rounded-wasatch-md bg-wasatch-surface-subtle p-wasatch-4"
                >
                  <div className="flex items-center gap-wasatch-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-wasatch-md bg-wasatch-surface">
                      <Paperclip size={20} className="text-wasatch-text-secondary" />
                    </div>
                    <div>
                      <div className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                        {attachment.category}
                      </div>
                      <div className="text-wasatch-sm text-wasatch-text-secondary">
                        {attachment.name} · {attachment.size}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-wasatch-2">
                    <button className="rounded-wasatch-sm bg-wasatch-neutral-700 px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse hover:bg-wasatch-neutral-800">
                      View
                    </button>
                    <button className="p-wasatch-2 hover:bg-wasatch-border rounded">
                      <MoreHorizontal size={20} className="text-wasatch-text-secondary" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="mt-wasatch-4 flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle">
                <span className="text-lg leading-none">+</span>
                Add
              </button>
            </div>
          </section>

          {/* Comments */}
          <section className="mb-wasatch-6 rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
            <div className="border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
              <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">Comments</h2>
            </div>
            <div className="p-wasatch-6">
              {/* Empty state illustration */}
              <div className="mb-wasatch-6 flex flex-col items-center justify-center py-wasatch-8">
                <div className="mb-wasatch-4 text-wasatch-neutral-300">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16C8 12.6863 10.6863 10 14 10H50C53.3137 10 56 12.6863 56 16V38C56 41.3137 53.3137 44 50 44H24L12 54V44H14C10.6863 44 8 41.3137 8 38V16Z" fill="currentColor" opacity="0.2"/>
                    <path d="M20 24H44M20 32H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-wasatch-sm text-wasatch-text-muted">No comments yet</p>
              </div>

              <div className="mb-wasatch-4">
                <label className="mb-wasatch-2 block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave a comment"
                  rows={4}
                  className="w-full rounded-wasatch-sm border border-wasatch-border-strong px-wasatch-3 py-wasatch-2 text-wasatch-sm focus:border-wasatch-accent focus:outline-none"
                />
              </div>
              <button className="rounded-wasatch-sm bg-wasatch-neutral-700 px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse hover:bg-wasatch-neutral-800">
                Submit Comment
              </button>
            </div>
          </section>
        </>
      )}

      {activeTab === "tests" && (
        <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 text-center text-wasatch-text-muted">
          Tests information will be displayed here
        </div>
      )}

      {activeTab === "results" && (
        <SpecimenResultsTab
          specimenId={specimenId}
          onResultClick={onResultClick}
        />
      )}

      {activeTab === "reporting" && (
        <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 text-center text-wasatch-text-muted">
          Reporting information will be displayed here
        </div>
      )}

      {activeTab === "history" && (
        <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 text-center text-wasatch-text-muted">
          History log will be displayed here
        </div>
      )}

      {activeTab === "documents" && (
        <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 text-center text-wasatch-text-muted">
          Documents will be displayed here
        </div>
      )}
    </div>
  );
}

function InfoCard({
  label,
  secondaryLabel,
  value,
}: {
  label: string;
  secondaryLabel?: string;
  value: string;
}) {
  return (
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-4">
      <div className="mb-wasatch-1 flex items-center justify-between">
        <span className="text-wasatch-xs font-wasatch-medium text-wasatch-text-heading">{label}</span>
        <button className="text-xs text-wasatch-primary hover:text-wasatch-primary-hover">
          View All
        </button>
      </div>
      {secondaryLabel && (
        <div className="mb-wasatch-2 text-wasatch-xs text-wasatch-text-muted">{secondaryLabel}</div>
      )}
      <div className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-start border-b border-wasatch-neutral-100 pb-wasatch-4">
      <span className="flex-1 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">{label}</span>
      <span className="flex-1 text-wasatch-sm text-wasatch-text-heading">{value}</span>
    </div>
  );
}

function SpecimenResultsTab({
  specimenId,
  onResultClick,
}: {
  specimenId: string;
  onResultClick?: (resultId: string) => void;
}) {
  const results = getResultsBySampleId(specimenId);

  if (results.length === 0) {
    return (
      <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 text-center text-wasatch-text-muted">
        No results for this specimen yet.
      </div>
    );
  }

  const statusColorClasses: Record<string, string> = {
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info",
    orange: "bg-wasatch-status-warning-bg text-wasatch-status-warning",
    purple: "bg-wasatch-status-purple-bg text-wasatch-status-purple",
    green: "bg-wasatch-status-success-bg text-wasatch-status-success",
    red: "bg-wasatch-status-error-bg text-wasatch-status-error",
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning",
  };

  return (
    <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
      <table className="w-full">
        <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
          <tr>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Result ID
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Protocol Type
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Date Conducted
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Status
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-wasatch-border">
          {results.map((result) => (
            <tr key={result.id} className="hover:bg-wasatch-surface-subtle">
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                {result.id}
              </td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                {result.protocolType}
              </td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                {result.dateConducted}
              </td>
              <td className="px-wasatch-4 py-wasatch-3">
                <span
                  className={`inline-flex items-center rounded-wasatch-full px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${statusColorClasses[result.statusColor]}`}
                >
                  {result.status}
                </span>
              </td>
              <td className="px-wasatch-4 py-wasatch-3">
                {onResultClick ? (
                  <button
                    onClick={() => onResultClick(result.id)}
                    className="text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover"
                  >
                    View Result
                  </button>
                ) : (
                  <span className="text-wasatch-sm text-wasatch-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
