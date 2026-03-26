import { useState } from "react";
import { Search, Filter, Grid3x3, Table as TableIcon, Columns, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TabBar from "../components/TabBar";
import { projectsData } from "../data/projectsData";
import type { ProjectCard } from "../data/projectsData";
import { getProjectDetail } from "../data/projectDetailData";

type TabType = "all" | "active" | "completed" | "archived";
type ViewType = "grid" | "table" | "kanban";

interface ProjectsPageProps {
  onProjectClick?: (projectId: string) => void;
}

export default function ProjectsPage({ onProjectClick }: ProjectsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState(projectsData.projects);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [quickViewProjectId, setQuickViewProjectId] = useState<string | null>(null);

  // Filter projects based on active tab
  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true;
    return project.category === activeTab;
  });

  // Further filter by search query
  const displayedProjects = filteredProjects.filter((project) =>
    searchQuery === "" ||
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.projectManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  // Drag and drop handlers for kanban view
  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", projectId);
    setDraggedProjectId(projectId);
    
    // Set a custom drag image (optional, makes it look cleaner)
    if (e.currentTarget instanceof HTMLElement) {
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = "0.5";
      document.body.appendChild(dragImage);
      dragImage.style.position = "absolute";
      dragImage.style.top = "-1000px";
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = () => {
    setDraggedProjectId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnterColumn = (columnStatus: string) => {
    setDragOverColumn(columnStatus);
  };

  const handleDragLeaveColumn = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("text/html");
    
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, status: newStatus, statusColor: getStatusColor(newStatus) }
          : project
      )
    );
    
    setDraggedProjectId(null);
    setDragOverColumn(null);
  };

  const getStatusColor = (status: string): "green" | "blue" | "yellow" | "gray" => {
    switch (status) {
      case "Active": return "green";
      case "In Progress": return "blue";
      case "Pending": return "yellow";
      default: return "gray";
    }
  };

  return (
    <div className="wasatch-app min-h-screen bg-wasatch-surface font-wasatch-sans">
      {/* Main Content */}
      <div className="px-wasatch-6 py-wasatch-6">
        {/* Page Title */}
        <h1 className="mb-wasatch-6 text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading">Projects</h1>

        {/* Tabs */}
        <TabBar
          className="mb-wasatch-6"
          tabs={[
            { id: "all", label: "All Projects" },
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" },
            { id: "archived", label: "Archived" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Search Bar and View Toggle */}
        <div className="mb-wasatch-6 flex gap-wasatch-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
              size={18}
            />
            <input
              type="text"
              placeholder="Search for project name, ID, status, or associated representative"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface py-wasatch-2 pl-wasatch-10 pr-wasatch-4 text-wasatch-sm focus:border-wasatch-accent focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle">
            Search
          </button>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle">
            <Filter size={16} />
            Filter results
          </button>
          
          {/* View Toggle */}
          <div className="flex items-center gap-wasatch-1 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface p-wasatch-1">
            <button
              onClick={() => setViewType("grid")}
              className={`rounded-wasatch-sm p-wasatch-2 transition-colors ${
                viewType === "grid"
                  ? "bg-wasatch-neutral-100 text-wasatch-text-heading"
                  : "text-wasatch-text-secondary hover:bg-wasatch-surface-subtle"
              }`}
              title="Grid View"
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`rounded-wasatch-sm p-wasatch-2 transition-colors ${
                viewType === "table"
                  ? "bg-wasatch-neutral-100 text-wasatch-text-heading"
                  : "text-wasatch-text-secondary hover:bg-wasatch-surface-subtle"
              }`}
              title="Table View"
            >
              <TableIcon size={16} />
            </button>
            <button
              onClick={() => setViewType("kanban")}
              className={`rounded-wasatch-sm p-wasatch-2 transition-colors ${
                viewType === "kanban"
                  ? "bg-wasatch-neutral-100 text-wasatch-text-heading"
                  : "text-wasatch-text-secondary hover:bg-wasatch-surface-subtle"
              }`}
              title="Kanban View"
            >
              <Columns size={16} />
            </button>
          </div>
        </div>

        {/* Conditional View Rendering */}
        <AnimatePresence mode="wait">
          {viewType === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 gap-wasatch-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {displayedProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut", delay: i * 0.06 }}
                >
                  <ProjectCardComponent
                    project={project}
                    isSelected={selectedProjects.has(project.id)}
                    onCheckboxChange={handleCheckboxChange}
                    onProjectClick={onProjectClick}
                    onQuickView={(projectId) => setQuickViewProjectId(projectId)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewType === "table" && (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TableView
                projects={displayedProjects}
                selectedProjects={selectedProjects}
                onCheckboxChange={handleCheckboxChange}
                onProjectClick={onProjectClick}
                onQuickView={(projectId) => setQuickViewProjectId(projectId)}
              />
            </motion.div>
          )}

          {viewType === "kanban" && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <KanbanView
                projects={displayedProjects}
                onProjectClick={onProjectClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnterColumn={handleDragEnterColumn}
                onDragLeaveColumn={handleDragLeaveColumn}
                draggedProjectId={draggedProjectId}
                dragOverColumn={dragOverColumn}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {displayedProjects.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-wasatch-text-muted">No projects found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProjectId && (
        <QuickViewModal
          projectId={quickViewProjectId}
          onClose={() => setQuickViewProjectId(null)}
          onViewFullDetails={() => {
            setQuickViewProjectId(null);
            onProjectClick?.(quickViewProjectId);
          }}
        />
      )}
    </div>
  );
}

// Project Card Component
function ProjectCardComponent({
  project,
  isSelected,
  onCheckboxChange,
  onProjectClick,
  onQuickView,
}: {
  project: ProjectCard;
  isSelected: boolean;
  onCheckboxChange: (id: string) => void;
  onProjectClick?: (projectId: string) => void;
  onQuickView?: (projectId: string) => void;
}) {
  const statusColorClasses = {
    green: "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border",
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border",
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border",
    gray: "bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border",
  };

  return (
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-bg p-wasatch-6 transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg hover:shadow-wasatch-card-hover hover:border-wasatch-primary/30">
      {/* Header Row */}
      <div className="mb-wasatch-4 flex items-start justify-between">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckboxChange(project.id)}
                  className="h-4 w-4 rounded-wasatch-sm border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent cursor-pointer"
        />
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
            statusColorClasses[project.statusColor]
          }`}
        >
          <span className="text-xs">✓</span> {project.status}
        </span>
      </div>

      {/* Project Name and Date */}
      <div className="mb-wasatch-4">
        <h3 className="mb-wasatch-1 text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">{project.name}</h3>
        <p className="text-wasatch-sm text-wasatch-text-muted">Created {project.createdDate}</p>
      </div>

      {/* Project Details */}
      <div className="mb-wasatch-4 space-y-wasatch-2">
        <div className="flex justify-between text-wasatch-sm">
          <span className="text-wasatch-text-secondary">Project Manager</span>
          <span className="font-wasatch-medium text-wasatch-text-heading">{project.projectManager}</span>
        </div>
        <div className="flex justify-between text-wasatch-sm">
          <span className="text-wasatch-text-secondary">Orders</span>
          <span className="font-wasatch-medium text-wasatch-text-heading">{project.orders}</span>
        </div>
        <div className="flex justify-between text-wasatch-sm">
          <span className="text-wasatch-text-secondary">Batches</span>
          <span className="font-wasatch-medium text-wasatch-text-heading">{project.batches}</span>
        </div>
      </div>

      {/* View Details Button */}
      <div className="flex justify-between gap-wasatch-2">  
      <button 
        onClick={() => onProjectClick?.(project.id)}
        className="w-auto rounded-wasatch-sm bg-transparent border border-wasatch-primary px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-primary cursor-pointer transition-colors hover:bg-wasatch-primary hover:text-wasatch-text-inverse"
      >
        View Project
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onQuickView?.(project.id);
        }}
        className="w-auto rounded-wasatch-sm bg-transparent border border-wasatch-primary px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-primary cursor-pointer transition-colors hover:bg-wasatch-primary hover:text-wasatch-text-inverse"
      >
        Quick View
      </button>
    </div>
    </div>
  );
}

// Table View Component
function TableView({
  projects,
  selectedProjects,
  onCheckboxChange,
  onProjectClick,
  onQuickView,
}: {
  projects: ProjectCard[];
  selectedProjects: Set<string>;
  onCheckboxChange: (id: string) => void;
  onProjectClick?: (projectId: string) => void;
  onQuickView?: (projectId: string) => void;
}) {
  const statusColorClasses = {
    green: "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border",
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border",
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border",
    gray: "bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border",
  };

  return (
    <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
      <table className="w-full">
        <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
          <tr>
            <th className="px-wasatch-4 py-wasatch-3 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-wasatch-sm border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent cursor-pointer"
                onChange={() => {
                  /* Handle select all */
                }}
              />
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Project Name
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Status
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Project Manager
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Orders
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Batches
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Created
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-wasatch-border">
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-wasatch-surface-subtle cursor-pointer transition-colors"
              onClick={() => onProjectClick?.(project.id)}
            >
              <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedProjects.has(project.id)}
                  onChange={() => onCheckboxChange(project.id)}
                  className="h-4 w-4 rounded border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent cursor-pointer"
                />
              </td>
              <td className="px-wasatch-4 py-wasatch-3">
                <div className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading hover:text-wasatch-primary">
                  {project.name}
                </div>
              </td>
              <td className="px-wasatch-4 py-wasatch-3">
                <span
                  className={`inline-flex items-center gap-wasatch-1 rounded-wasatch-full border px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${
                    statusColorClasses[project.statusColor]
                  }`}
                >
                  <span className="text-wasatch-xs">✓</span> {project.status}
                </span>
              </td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                {project.projectManager}
              </td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{project.orders}</td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{project.batches}</td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-muted">{project.createdDate}</td>
              <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-wasatch-2">
                  <button
                    onClick={() => onQuickView?.(project.id)}
                    className="rounded-wasatch-sm border border-wasatch-primary px-wasatch-3 py-wasatch-1 text-wasatch-sm font-wasatch-medium text-wasatch-primary transition-colors hover:bg-wasatch-primary hover:text-wasatch-text-inverse"
                  >
                    Quick View
                  </button>
                  <button
                    onClick={() => onProjectClick?.(project.id)}
                    className="rounded-wasatch-sm border border-wasatch-border-strong px-wasatch-3 py-wasatch-1 text-wasatch-sm transition-colors hover:bg-wasatch-surface-subtle"
                  >
                    View Details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Kanban View Component
function KanbanView({
  projects,
  onProjectClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDragEnterColumn,
  onDragLeaveColumn,
  draggedProjectId,
  dragOverColumn,
}: {
  projects: ProjectCard[];
  onProjectClick?: (projectId: string) => void;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragEnterColumn: (status: string) => void;
  onDragLeaveColumn: () => void;
  draggedProjectId: string | null;
  dragOverColumn: string | null;
}) {
  const columns = [
    { title: "Pending", status: "Pending", color: "yellow" },
    { title: "In Progress", status: "In Progress", color: "blue" },
    { title: "Active", status: "Active", color: "green" },
    { title: "Completed", status: "Completed", color: "gray" },
  ];

  const getProjectsByStatus = (status: string) => {
    return projects.filter((project) => project.status === status);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          status={column.status}
          color={column.color}
          projects={getProjectsByStatus(column.status)}
          onProjectClick={onProjectClick}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnterColumn={onDragEnterColumn}
          onDragLeaveColumn={onDragLeaveColumn}
          draggedProjectId={draggedProjectId}
          isDragOver={dragOverColumn === column.status}
        />
      ))}
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({
  title,
  status,
  color,
  projects,
  onProjectClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDragEnterColumn,
  onDragLeaveColumn,
  draggedProjectId,
  isDragOver,
}: {
  title: string;
  status: string;
  color: string;
  projects: ProjectCard[];
  onProjectClick?: (projectId: string) => void;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragEnterColumn: (status: string) => void;
  onDragLeaveColumn: () => void;
  draggedProjectId: string | null;
  isDragOver: boolean;
}) {
  const colorClasses = {
    yellow: "bg-wasatch-status-warning-bg border-wasatch-status-warning-border",
    blue: "bg-wasatch-status-info-bg border-wasatch-status-info-border",
    green: "bg-wasatch-status-success-bg border-wasatch-status-success-border",
    gray: "bg-wasatch-surface-subtle border-wasatch-border",
  };

  const dragOverClasses = {
    yellow: "bg-wasatch-status-warning-bg border-wasatch-status-warning ring-2 ring-wasatch-status-warning",
    blue: "bg-wasatch-status-info-bg border-wasatch-status-info ring-2 ring-wasatch-status-info",
    green: "bg-wasatch-status-success-bg border-wasatch-status-success ring-2 ring-wasatch-status-success",
    gray: "bg-wasatch-neutral-100 border-wasatch-neutral-400 ring-2 ring-wasatch-neutral-300",
  };

  const headerColors = {
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning",
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info",
    green: "bg-wasatch-status-success-bg text-wasatch-status-success",
    gray: "bg-wasatch-neutral-100 text-wasatch-text-heading",
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnterColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only trigger if leaving the column container itself, not child elements
    if (e.currentTarget === e.target) {
      onDragLeaveColumn();
    }
  };

  return (
    <div className="flex-1 w-80">
      <div className={`rounded-wasatch-md border transition-all duration-200 ${
        isDragOver 
          ? 'border-wasatch-primary shadow-lg scale-[1.02]' 
          : 'border-wasatch-border'
      } bg-wasatch-surface`}>
        {/* Column Header */}
        <div
          className={`flex items-center justify-between rounded-t-wasatch-md px-wasatch-4 py-wasatch-3 transition-all duration-200 ${
            headerColors[color as keyof typeof headerColors]
          } ${isDragOver ? 'opacity-80' : ''}`}
        >
          <h3 className="font-wasatch-medium text-wasatch-sm">{title}</h3>
          <span className="text-wasatch-sm font-wasatch-medium">{projects.length}</span>
        </div>

        {/* Column Content */}
        <div
          className={`min-h-[500px] p-wasatch-3 space-y-wasatch-3 transition-all duration-200 ${
            isDragOver 
              ? dragOverClasses[color as keyof typeof dragOverClasses]
              : colorClasses[color as keyof typeof colorClasses]
          }`}
          onDragOver={onDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => onDrop(e, status)}
        >
          {projects.map((project) => (
            <KanbanCard
              key={project.id}
              project={project}
              onProjectClick={onProjectClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedProjectId === project.id}
            />
          ))}
          {projects.length === 0 && (
            <div className={`flex items-center justify-center h-32 text-wasatch-sm transition-all duration-200 ${
              isDragOver 
                ? 'text-wasatch-text-secondary font-wasatch-medium scale-105' 
                : 'text-wasatch-text-placeholder'
            }`}>
              {isDragOver ? '✨ Drop here' : 'Drop projects here'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Kanban Card Component
function KanbanCard({
  project,
  onProjectClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  project: ProjectCard;
  onProjectClick?: (projectId: string) => void;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      onDragEnd={onDragEnd}
      onClick={() => !isDragging && onProjectClick?.(project.id)}
      className={`cursor-move rounded-wasatch-md border p-wasatch-4 shadow-sm transition-all duration-200 ${
        isDragging
          ? 'opacity-40 scale-95 border-wasatch-primary bg-wasatch-surface-subtle rotate-2 shadow-xl'
          : 'border-wasatch-border bg-wasatch-surface hover:shadow-md hover:border-wasatch-primary hover:scale-[1.02] active:cursor-grabbing'
      }`}
      style={{
        transformOrigin: 'center',
      }}
    >
      {/* Drag Handle Indicator */}
      {!isDragging && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-0.5">
            <div className="h-0.5 w-4 bg-wasatch-neutral-400 rounded"></div>
            <div className="h-0.5 w-4 bg-wasatch-neutral-400 rounded"></div>
            <div className="h-0.5 w-4 bg-wasatch-neutral-400 rounded"></div>
          </div>
        </div>
      )}

      {/* Project Name */}
      <h4 className={`mb-wasatch-2 font-wasatch-medium text-wasatch-sm transition-colors ${
        isDragging ? 'text-wasatch-text-muted' : 'text-wasatch-text-heading'
      }`}>
        {project.name}
      </h4>

      {/* Project Details */}
      <div className="space-y-wasatch-2 text-wasatch-xs text-wasatch-text-secondary">
        <div className="flex justify-between">
          <span>Manager:</span>
          <span className={`font-wasatch-medium transition-colors ${
            isDragging ? 'text-wasatch-text-muted' : 'text-wasatch-text-heading'
          }`}>
            {project.projectManager}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Orders:</span>
          <span className={`font-wasatch-medium transition-colors ${
            isDragging ? 'text-wasatch-text-muted' : 'text-wasatch-text-heading'
          }`}>
            {project.orders}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Batches:</span>
          <span className={`font-wasatch-medium transition-colors ${
            isDragging ? 'text-wasatch-text-muted' : 'text-wasatch-text-heading'
          }`}>
            {project.batches}
          </span>
        </div>
      </div>

      {/* Created Date */}
      <div className={`mt-wasatch-3 pt-wasatch-3 border-t text-wasatch-xs transition-colors ${
        isDragging ? 'border-wasatch-border text-wasatch-text-placeholder' : 'border-wasatch-neutral-100 text-wasatch-text-muted'
      }`}>
        Created {project.createdDate}
      </div>
    </div>
  );
}

// Quick View Modal Component
function QuickViewModal({
  projectId,
  onClose,
  onViewFullDetails,
}: {
  projectId: string;
  onClose: () => void;
  onViewFullDetails: () => void;
}) {
  const project = getProjectDetail(projectId);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    // Trigger open animation after a tiny delay to ensure smooth transition
    requestAnimationFrame(() => {
      setIsOpen(true);
    });
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    // Close modal on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClosing(true);
        setIsOpen(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setIsOpen(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const handleViewFullDetails = () => {
    setIsClosing(true);
    setIsOpen(false);
    setTimeout(() => {
      onViewFullDetails();
    }, 300);
  };

  if (!project) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative mx-4 my-8 flex max-h-[90vh] w-full max-w-5xl flex-col rounded-wasatch-md bg-wasatch-surface shadow-2xl transition-all duration-300 ease-out ${
          isOpen && !isClosing
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-12'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        {/* Modal Header */}
        <div className="relative border-b border-wasatch-border px-wasatch-6 py-wasatch-4">
          {/* Close Button - Top Right */}
          <button
            onClick={handleClose}
            className="absolute top-wasatch-4 right-wasatch-6 rounded p-wasatch-2 text-wasatch-text-placeholder transition-colors hover:bg-wasatch-surface-subtle hover:text-wasatch-text-secondary"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-wasatch-3 pr-12">
            <h2 className="text-wasatch-2xl font-wasatch-normal text-wasatch-text-heading">{project.name}</h2>
            <span className="inline-flex items-center gap-wasatch-1 rounded-wasatch-full border border-wasatch-status-success-border bg-wasatch-status-success-bg px-wasatch-3 py-wasatch-1 text-wasatch-sm font-wasatch-medium text-wasatch-status-success">
              <span className="text-wasatch-xs">✓</span> {project.status}
            </span>
            <p className="text-wasatch-sm text-wasatch-text-muted">{project.projectId}</p>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto px-wasatch-6 py-wasatch-6">
          {/* Stats Cards */}
          <div className="mb-wasatch-6 grid grid-cols-2 gap-wasatch-4 md:grid-cols-4">
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

          {/* Details Section */}
          <div className="mb-wasatch-6 rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-6">
            <h3 className="mb-wasatch-4 text-wasatch-xl font-wasatch-medium text-wasatch-text-heading">Details</h3>
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
            <h3 className="mb-wasatch-6 text-wasatch-xl font-wasatch-medium text-wasatch-text-heading">Project Members</h3>
            <div className="space-y-wasatch-4">
              {project.members.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-wasatch-3 border-t border-wasatch-border px-wasatch-6 py-wasatch-4">
          <button
            onClick={handleClose}
            className="rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle"
          >
            Close
          </button>
          <button
            onClick={handleViewFullDetails}
            className="rounded-wasatch-sm bg-wasatch-primary px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse transition-colors hover:opacity-90"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component (reused from ProjectDetailPage)
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
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-4">
      <div className="mb-wasatch-3 flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-wasatch-xs font-wasatch-medium text-wasatch-text-heading">{title}</h4>
          <p className="text-wasatch-xs text-wasatch-text-muted">{secondaryHeader}</p>
        </div>
        <button className="text-wasatch-xs font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover">
          View All
        </button>
      </div>
      <p className="text-3xl font-bold text-wasatch-primary">{value}</p>
    </div>
  );
}

// Detail Row Component (reused from ProjectDetailPage)
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-wasatch-border py-wasatch-3">
      <span className="w-32 text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">{label}</span>
      <span className="flex-1 text-wasatch-sm text-wasatch-text-heading">{value}</span>
    </div>
  );
}

// Member Row Component (reused from ProjectDetailPage)
function MemberRow({
  member,
}: {
  member: {
    name: string;
    role: string;
    initials: string;
    avatarColor: string;
    avatar?: string;
  };
}) {
  return (
    <div className="flex items-center justify-between border-b border-wasatch-border py-wasatch-4 last:border-b-0">
      <div className="flex items-center gap-3">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-wasatch-full text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse"
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

