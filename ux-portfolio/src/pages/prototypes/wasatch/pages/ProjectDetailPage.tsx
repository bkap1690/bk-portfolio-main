import { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { getProjectDetail } from "../data/projectDetailData";
import TabBar from "../components/TabBar";

type TabType = "overview" | "orders" | "batches" | "samples" | "documents" | "activity";

interface ProjectDetailPageProps {
  projectId?: string;
}

function ProjectDetailPage({ projectId = "proj-1" }: ProjectDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const project = getProjectDetail(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-wasatch-surface p-wasatch-6" style={{ fontFamily: "'Roboto', sans-serif" }}>
        <p className="text-wasatch-text-muted">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wasatch-surface" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Main Content */}
      <div className={`px-wasatch-6 py-wasatch-6 max-w-[calc(100%-(254.55px+16px))]`}>
        {/* Header */}
        <div className="mb-wasatch-6 flex items-start justify-between">
          <div>
            <div className="mb-wasatch-1 flex items-center gap-wasatch-3">
              <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading">{project.name}</h1>
              <span className="inline-flex items-center gap-wasatch-1 rounded-wasatch-full border border-wasatch-status-success-border bg-wasatch-status-success-bg px-wasatch-3 py-wasatch-1 text-wasatch-sm font-wasatch-medium text-wasatch-status-success">
                <span className="text-wasatch-xs">✓</span> {project.status}
              </span>
              <button className="rounded-wasatch-sm p-wasatch-1 hover:bg-wasatch-neutral-100 transition-colors">
                <MoreVertical size={20} className="text-wasatch-text-secondary" />
              </button>
            </div>
            <p className="text-wasatch-sm text-wasatch-text-muted">{project.projectId}</p>
          </div>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm bg-wasatch-neutral-800 px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse transition-colors hover:bg-wasatch-neutral-900">
            Add
            <Plus size={16} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-wasatch-6 grid grid-cols-4 gap-wasatch-4">
          <StatsCard
            title="Total Orders"
            value={project.stats.totalOrders.toString()}
            secondaryHeader="Secondary Header"
          />
          <StatsCard
            title="Total Batches"
            value={project.stats.totalBatches.toString()}
            secondaryHeader="Secondary Header"
          />
          <StatsCard
            title="Total Samples"
            value={project.stats.totalSamples.toString()}
            secondaryHeader="Secondary Header"
          />
          <StatsCard
            title="Project Completion"
            value={`${project.stats.projectCompletion}%`}
            secondaryHeader="Secondary Header"
          />
        </div>

        {/* Tabs */}
        <TabBar
          className="mb-wasatch-6"
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "orders", label: "Orders" },
            { id: "batches", label: "Batches" },
            { id: "samples", label: "Samples" },
            { id: "documents", label: "Documents" },
            { id: "activity", label: "Activity Log" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Content Area */}
        {activeTab === "overview" && (
          <div className="space-y-wasatch-6">
            {/* Details Section */}
            <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-6">
              <h2 className="mb-wasatch-4 text-wasatch-xl font-wasatch-medium text-wasatch-text-heading">Details</h2>
              <p className="mb-wasatch-6 text-wasatch-sm leading-relaxed text-wasatch-text-secondary">
                {project.description}
              </p>

              <div className="space-y-wasatch-4">
                <DetailRow label="Client" value={project.client} />
                <DetailRow label="Project Manager" value={project.projectManager} />
                <DetailRow label="Start Date" value={project.startDate} />
                <DetailRow label="End Date" value={project.endDate} />
                <DetailRow label="Orders" value={project.orders.toString()} />
              </div>
            </div>

            {/* Project Members Section */}
            <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-6">
              <h2 className="mb-wasatch-6 text-wasatch-xl font-wasatch-medium text-wasatch-text-heading">Project Members</h2>
              <div className="space-y-wasatch-4">
                {project.members.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "overview" && (
          <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-12 text-center">
            <p className="text-wasatch-text-muted">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content will be displayed here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  secondaryHeader,
}: {
  title: string;
  value: string;
  secondaryHeader: string;
}) {
  return (
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-6">
      <div className="mb-wasatch-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{title}</h3>
          <p className="text-wasatch-xs text-wasatch-text-muted">{secondaryHeader}</p>
        </div>
        <button className="text-sm font-medium text-wasatch-primary hover:text-wasatch-primary-hover">
          View All
        </button>
      </div>
      <p className="text-wasatch-4xl font-wasatch-bold text-wasatch-primary">{value}</p>
    </div>
  );
}

// Detail Row Component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-wasatch-border py-wasatch-3">
      <span className="w-48 text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{label}</span>
      <span className="flex-1 text-wasatch-sm text-wasatch-text-heading">{value}</span>
    </div>
  );
}

// Member Row Component
function MemberRow({ member }: { member: { name: string; role: string; initials: string; avatarColor: string; avatar?: string } }) {
  return (
    <div className="flex items-center justify-between border-b border-wasatch-border py-wasatch-4 last:border-b-0">
      <div className="flex items-center gap-wasatch-3">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.initials}
          </div>
        )}
        <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{member.name}</span>
      </div>
      <span className="text-wasatch-sm text-wasatch-text-secondary">{member.role}</span>
    </div>
  );
}

export default ProjectDetailPage;

