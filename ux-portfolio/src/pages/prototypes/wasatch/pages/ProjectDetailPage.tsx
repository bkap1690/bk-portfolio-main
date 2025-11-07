import { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { getProjectDetail } from "../data/projectDetailData";
import type { ProjectDetail } from "../data/projectDetailData";

type TabType = "overview" | "orders" | "batches" | "samples" | "documents" | "activity";

interface ProjectDetailPageProps {
  projectId?: string;
  onBreadcrumbClick?: (target: "home" | "projects" | "all-projects") => void;
}

function ProjectDetailPage({ projectId = "proj-1", onBreadcrumbClick }: ProjectDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const project = getProjectDetail(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-white p-6" style={{ fontFamily: "'Roboto', sans-serif" }}>
        <p className="text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2 text-sm">
          <span 
            onClick={() => onBreadcrumbClick?.("home")}
            className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
          >
            Home
          </span>
          <span className="text-gray-400">›</span>
          <span 
            onClick={() => onBreadcrumbClick?.("all-projects")}
            className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
          >
            Projects
          </span>
          <span className="text-gray-400">›</span>
          <span 
            onClick={() => onBreadcrumbClick?.("all-projects")}
            className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
          >
            All Projects
          </span>
          <span className="text-gray-400">›</span>
          <span className="font-medium text-gray-800">Project Details</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="text-3xl font-normal text-gray-900">{project.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                <span className="text-xs">✓</span> {project.status}
              </span>
              <button className="rounded p-1 hover:bg-gray-100 transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-500">{project.projectId}</p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900">
            Add
            <Plus size={16} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-4 gap-4">
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
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <TabButton
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <TabButton
              label="Orders"
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <TabButton
              label="Batches"
              active={activeTab === "batches"}
              onClick={() => setActiveTab("batches")}
            />
            <TabButton
              label="Samples"
              active={activeTab === "samples"}
              onClick={() => setActiveTab("samples")}
            />
            <TabButton
              label="Documents"
              active={activeTab === "documents"}
              onClick={() => setActiveTab("documents")}
            />
            <TabButton
              label="Activity Log"
              active={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
            />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Details Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-medium text-gray-900">Details</h2>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                {project.description}
              </p>

              <div className="space-y-4">
                <DetailRow label="Client" value={project.client} />
                <DetailRow label="Project Manager" value={project.projectManager} />
                <DetailRow label="Start Date" value={project.startDate} />
                <DetailRow label="End Date" value={project.endDate} />
                <DetailRow label="Orders" value={project.orders.toString()} />
              </div>
            </div>

            {/* Project Members Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-xl font-medium text-gray-900">Project Members</h2>
              <div className="space-y-4">
                {project.members.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "overview" && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">
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
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{secondaryHeader}</p>
        </div>
        <button className="text-sm font-medium text-[#776FE5] hover:text-[#776FE5]/80">
          View All
        </button>
      </div>
      <p className="text-4xl font-bold text-[#776FE5]">{value}</p>
    </div>
  );
}

// Tab Button Component
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-medium transition-colors ${
        active
          ? "border-b-2 border-gray-900 text-gray-900"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}

// Detail Row Component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-gray-200 py-3">
      <span className="w-48 text-sm font-medium text-gray-900">{label}</span>
      <span className="flex-1 text-sm text-gray-900">{value}</span>
    </div>
  );
}

// Member Row Component
function MemberRow({ member }: { member: { name: string; role: string; initials: string; avatarColor: string; avatar?: string } }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
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
        <span className="text-sm font-medium text-gray-900">{member.name}</span>
      </div>
      <span className="text-sm text-gray-600">{member.role}</span>
    </div>
  );
}

export default ProjectDetailPage;

