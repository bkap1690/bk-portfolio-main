import { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Info,
  BarChart3,
  LayoutGrid,
  Paperclip,
  AtSign,
  Hash,
  Smile,
  FileText,
  Download,
  X,
  Clock,
  User,
} from "lucide-react";
import {
  getResultDetail,
  getResultDocuments,
  getResultActivityLog,
  type ResultDocument,
} from "../data/resultsData";
import TabBar from "../components/TabBar";

interface ResultDetailPageProps {
  resultId: string;
  onBack: () => void;
  onOrderClick: (orderId: string) => void;
  onSpecimenClick?: (specimenId: string) => void;
}

export default function ResultDetailPage({
  resultId,
  onBack,
  onOrderClick,
  onSpecimenClick,
}: ResultDetailPageProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "activity"
  >("overview");
  const [comment, setComment] = useState("");
  const [viewingDocument, setViewingDocument] = useState<ResultDocument | null>(null);

  const result = getResultDetail(resultId);

  if (!result) {
    return (
      <div className="px-wasatch-6 py-wasatch-6">
        <div className="text-center text-wasatch-text-muted">Result not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border";
      case "Processing":
        return "bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border";
      case "Pending":
        return "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border";
      default:
        return "bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border";
    }
  };

  const handleDownloadReport = () => {
    console.log("Download Report clicked for", resultId);
  };

  const handleDownloadRawData = () => {
    console.log("Download Raw Data clicked for", resultId);
  };

  return (
    <div className="px-wasatch-6 py-wasatch-6 max-w-[calc(100%-(254.55px+16px))]">
      {/* Back link and Header */}
      <div className="mb-wasatch-6 flex items-start justify-between">
        <div className="flex flex-col gap-wasatch-3">
          <button
            onClick={onBack}
            className="flex items-center gap-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover w-fit"
          >
            <ArrowLeft size={16} />
            Back to Results
          </button>
          <div className="flex items-center gap-wasatch-4">
            <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading">Result Details</h1>
            <span
              className={`inline-flex items-center gap-wasatch-2 rounded-wasatch-full border px-wasatch-3 py-wasatch-1 text-wasatch-sm font-wasatch-medium ${getStatusColor(
                result.status
              )}`}
            >
              <Info size={14} />
              {result.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-wasatch-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle"
          >
            <BarChart3 size={16} />
            Download Report
          </button>
          <button
            onClick={handleDownloadRawData}
            className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle"
          >
            <LayoutGrid size={16} />
            Download Raw Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <TabBar
        className="mb-wasatch-6"
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "documents", label: "Documents & Protocols" },
          { id: "activity", label: "Activity Log" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <>
          {/* Overview Card */}
          <section className="mb-wasatch-6 rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
            <div className="flex items-center justify-between border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
              <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">Overview</h2>
              <button className="flex items-center gap-wasatch-2 text-wasatch-sm text-wasatch-primary hover:text-wasatch-primary-hover">
                <Edit2 size={16} />
                Edit
              </button>
            </div>
            <div className="p-wasatch-6">
              <div className="grid grid-cols-1 gap-wasatch-4">
                <div className="flex justify-between border-b border-wasatch-neutral-100 pb-wasatch-3">
                  <span className="text-wasatch-sm text-wasatch-text-secondary">Test Type</span>
                  <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                    {result.testType}
                  </span>
                </div>
                <div className="flex justify-between border-b border-wasatch-neutral-100 pb-wasatch-3">
                  <span className="text-wasatch-sm text-wasatch-text-secondary">Sample ID</span>
                  {onSpecimenClick && result.specimenId ? (
                    <button
                      onClick={() => onSpecimenClick(result.specimenId)}
                      className="text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover"
                    >
                      {result.sampleId}
                    </button>
                  ) : (
                    <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                      {result.sampleId}
                    </span>
                  )}
                </div>
                <div className="flex justify-between border-b border-wasatch-neutral-100 pb-wasatch-3">
                  <span className="text-wasatch-sm text-wasatch-text-secondary">Associated Orders</span>
                  <button
                    onClick={() => onOrderClick(result.associatedOrderId)}
                    className="text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover"
                  >
                    {result.associatedOrder}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-wasatch-sm text-wasatch-text-secondary">Project Manager</span>
                  <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                    {result.projectManager}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Comments */}
          <section className="mb-wasatch-6 rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
            <div className="border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
              <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">Comments</h2>
            </div>
            <div className="p-wasatch-6">
              <div className="mb-wasatch-6 flex flex-col items-center justify-center py-wasatch-8">
                <div className="mb-wasatch-4 text-wasatch-text-placeholder">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 16C8 12.6863 10.6863 10 14 10H50C53.3137 10 56 12.6863 56 16V38C56 41.3137 53.3137 44 50 44H24L12 54V44H14C10.6863 44 8 41.3137 8 38V16Z"
                      fill="currentColor"
                      opacity="0.2"
                    />
                    <path
                      d="M20 24H44M20 32H36"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-wasatch-sm text-wasatch-text-muted">
                  No comments yet. Be the first one to leave a comment.
                </p>
              </div>

              <div className="mb-wasatch-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave a comment"
                  rows={4}
                  className="w-full rounded-wasatch-sm border border-wasatch-border-strong px-wasatch-3 py-wasatch-2 text-wasatch-sm focus:border-wasatch-accent focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-wasatch-2">
                  <button className="rounded p-wasatch-2 text-wasatch-text-muted hover:bg-wasatch-neutral-100">
                    <Smile size={18} />
                  </button>
                  <button className="rounded p-wasatch-2 text-wasatch-text-muted hover:bg-wasatch-neutral-100">
                    <AtSign size={18} />
                  </button>
                  <button className="rounded p-wasatch-2 text-wasatch-text-muted hover:bg-wasatch-neutral-100">
                    <Hash size={18} />
                  </button>
                  <button className="rounded p-wasatch-2 text-wasatch-text-muted hover:bg-wasatch-neutral-100">
                    <Paperclip size={18} />
                  </button>
                </div>
                <button className="rounded-wasatch-sm bg-wasatch-neutral-700 px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse hover:bg-wasatch-neutral-800">
                  Submit
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "documents" && (
        <DocumentsProtocolsTab
          resultId={resultId}
          onViewDocument={setViewingDocument}
        />
      )}

      {activeTab === "activity" && (
        <ActivityLogTab resultId={resultId} />
      )}

      {viewingDocument && (
        <DocumentViewerModal
          document={viewingDocument}
          result={result}
          onClose={() => setViewingDocument(null)}
        />
      )}
    </div>
  );
}

function DocumentsProtocolsTab({
  resultId,
  onViewDocument,
}: {
  resultId: string;
  onViewDocument: (doc: ResultDocument) => void;
}) {
  const documents = getResultDocuments(resultId);
  const categoryColors: Record<string, string> = {
    Protocol: "bg-wasatch-status-info-bg text-wasatch-status-info",
    SOP: "bg-wasatch-status-purple-bg text-wasatch-status-purple",
    Certificate: "bg-wasatch-status-success-bg text-wasatch-status-success",
    Report: "bg-wasatch-accent/10 text-wasatch-accent-hover",
    Other: "bg-wasatch-neutral-100 text-wasatch-text-secondary",
  };

  return (
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
      <div className="border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
        <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">Documents & Protocols</h2>
        <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-text-muted">
          Protocols, certificates, and documentation associated with this result.
        </p>
      </div>
      <div className="divide-y divide-wasatch-border">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between px-wasatch-6 py-wasatch-4 hover:bg-wasatch-surface-subtle"
          >
            <div className="flex items-center gap-wasatch-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-wasatch-md bg-wasatch-neutral-100">
                <FileText size={20} className="text-wasatch-text-secondary" />
              </div>
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{doc.name}</p>
                <div className="mt-wasatch-1 flex items-center gap-wasatch-3 text-wasatch-xs text-wasatch-text-muted">
                  <span
                    className={`rounded-wasatch-sm px-wasatch-2 py-wasatch-1 font-wasatch-medium ${categoryColors[doc.category] ?? categoryColors.Other}`}
                  >
                    {doc.category}
                  </span>
                  <span>{doc.size}</span>
                  <span>Uploaded {doc.uploadedAt} by {doc.uploadedBy}</span>
                  {doc.version && <span>v{doc.version}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-wasatch-2">
              <button
                onClick={() => onViewDocument(doc)}
                className="rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle"
              >
                View
              </button>
              <button className="rounded-wasatch-sm p-wasatch-2 text-wasatch-text-muted hover:bg-wasatch-neutral-100">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityLogTab({ resultId }: { resultId: string }) {
  const activityItems = getResultActivityLog(resultId);

  return (
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
      <div className="border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
        <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">Activity Log</h2>
        <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-text-muted">
          Chronological history of events for this result.
        </p>
      </div>
      <div className="p-wasatch-6">
        <div className="relative">
          <div className="absolute left-wasatch-4 top-0 bottom-0 w-px bg-wasatch-border" />
          <div className="space-y-wasatch-6">
            {activityItems.map((item) => (
              <div key={item.id} className="relative flex gap-wasatch-4 pl-wasatch-10">
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-wasatch-full bg-wasatch-neutral-100">
                  <Clock size={14} className="text-wasatch-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{item.action}</p>
                  {item.details && (
                    <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-text-muted">{item.details}</p>
                  )}
                  <div className="mt-wasatch-1 flex items-center gap-wasatch-2 text-wasatch-xs text-wasatch-text-placeholder">
                    <User size={12} />
                    <span>{item.user}</span>
                    <span>·</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentViewerModal({
  document: doc,
  result,
  onClose,
}: {
  document: ResultDocument;
  result: { sampleId: string; testType: string };
  onClose: () => void;
}) {
  const isCertificate = doc.category === "Certificate";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-wasatch-4">
      <div className="flex h-[90vh] max-h-[800px] w-full max-w-4xl flex-col rounded-wasatch-md bg-wasatch-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
          <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">{doc.name}</h3>
          <div className="flex items-center gap-wasatch-2">
            <button
              onClick={() => console.log("Download", doc.id)}
              className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={onClose}
              className="rounded-wasatch-sm p-wasatch-2 text-wasatch-text-muted hover:bg-wasatch-neutral-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-wasatch-6">
          <div className="mx-auto max-w-3xl rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 shadow-sm">
            {/* Placeholder LIMS document - Certificate of Analysis style */}
            <div className="space-y-wasatch-6 font-serif">
              <div className="border-b-2 border-wasatch-text-heading pb-wasatch-4 text-center">
                <h1 className="text-wasatch-2xl font-wasatch-bold text-wasatch-text-heading">
                  Wasatch BioLabs
                </h1>
                <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-text-secondary">
                  Laboratory Information Management System
                </p>
                <h2 className="mt-wasatch-4 text-wasatch-xl font-wasatch-semibold text-wasatch-text-heading">
                  {isCertificate ? "Certificate of Analysis" : doc.name.replace(".pdf", "")}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-wasatch-4 text-wasatch-sm">
                <div>
                  <p className="font-wasatch-medium text-wasatch-text-muted">Sample ID</p>
                  <p className="font-wasatch-medium text-wasatch-text-heading">{result.sampleId}</p>
                </div>
                <div>
                  <p className="font-wasatch-medium text-wasatch-text-muted">Test Type</p>
                  <p className="font-wasatch-medium text-wasatch-text-heading">{result.testType}</p>
                </div>
                <div>
                  <p className="font-wasatch-medium text-wasatch-text-muted">Document Version</p>
                  <p className="font-wasatch-medium text-wasatch-text-heading">{doc.version ?? "1.0"}</p>
                </div>
                <div>
                  <p className="font-wasatch-medium text-wasatch-text-muted">Issue Date</p>
                  <p className="font-wasatch-medium text-wasatch-text-heading">{doc.uploadedAt}</p>
                </div>
              </div>

              {isCertificate && (
                <>
                  <div className="border-t border-wasatch-border pt-wasatch-4">
                    <h3 className="mb-wasatch-3 font-wasatch-semibold text-wasatch-text-heading">Test Results</h3>
                    <table className="w-full text-wasatch-sm">
                      <thead>
                        <tr className="border-b border-wasatch-border">
                          <th className="pb-wasatch-2 text-left font-wasatch-medium text-wasatch-text-secondary">Parameter</th>
                          <th className="pb-wasatch-2 text-left font-wasatch-medium text-wasatch-text-secondary">Result</th>
                          <th className="pb-wasatch-2 text-left font-wasatch-medium text-wasatch-text-secondary">Unit</th>
                          <th className="pb-wasatch-2 text-left font-wasatch-medium text-wasatch-text-secondary">Specification</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-wasatch-neutral-100">
                          <td className="py-wasatch-2">Purity</td>
                          <td className="py-wasatch-2 font-wasatch-medium">98.2%</td>
                          <td className="py-wasatch-2">%</td>
                          <td className="py-wasatch-2 text-wasatch-text-muted">≥ 95%</td>
                        </tr>
                        <tr className="border-b border-wasatch-neutral-100">
                          <td className="py-wasatch-2">Concentration</td>
                          <td className="py-wasatch-2 font-wasatch-medium">1.24</td>
                          <td className="py-wasatch-2">mg/mL</td>
                          <td className="py-wasatch-2 text-wasatch-text-muted">0.8 - 2.0</td>
                        </tr>
                        <tr className="border-b border-wasatch-neutral-100">
                          <td className="py-wasatch-2">pH</td>
                          <td className="py-wasatch-2 font-wasatch-medium">7.2</td>
                          <td className="py-wasatch-2">—</td>
                          <td className="py-wasatch-2 text-wasatch-text-muted">7.0 - 7.5</td>
                        </tr>
                        <tr>
                          <td className="py-wasatch-2">Appearance</td>
                          <td className="py-wasatch-2 font-wasatch-medium">Clear, colorless</td>
                          <td className="py-wasatch-2">—</td>
                          <td className="py-wasatch-2 text-wasatch-text-muted">Clear solution</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-wasatch-xs text-wasatch-text-muted">
                    This certificate has been generated electronically and is valid without signature.
                    Results are within specified limits unless otherwise noted.
                  </p>
                </>
              )}

              {!isCertificate && doc.category === "Protocol" && (
                <div className="space-y-wasatch-3 text-wasatch-sm">
                  <h3 className="font-wasatch-semibold text-wasatch-text-heading">Procedure Overview</h3>
                  <ol className="list-decimal space-y-wasatch-2 pl-wasatch-5 text-wasatch-text-secondary">
                    <li>Sample preparation and fixation</li>
                    <li>Antigen retrieval</li>
                    <li>Blocking and primary antibody incubation</li>
                    <li>Secondary antibody and detection</li>
                    <li>Counterstaining and mounting</li>
                    <li>Microscopy and analysis</li>
                  </ol>
                </div>
              )}

              {!isCertificate && doc.category === "SOP" && (
                <div className="space-y-wasatch-3 text-wasatch-sm">
                  <h3 className="font-wasatch-semibold text-wasatch-text-heading">Quality Control Guidelines</h3>
                  <ul className="list-disc space-y-wasatch-1 pl-wasatch-5 text-wasatch-text-secondary">
                    <li>All reagents must be within expiry</li>
                    <li>Positive and negative controls required</li>
                    <li>Document any deviations in batch record</li>
                    <li>Review by qualified personnel before release</li>
                  </ul>
                </div>
              )}

              <div className="border-t border-wasatch-border pt-wasatch-4 text-right text-wasatch-xs text-wasatch-text-muted">
                Generated by LIMS · {doc.uploadedBy} · {doc.uploadedAt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
