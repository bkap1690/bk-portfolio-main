import { useState, useRef, useEffect } from "react";
import { Search, Filter, Grid3x3, Table as TableIcon, Columns } from "lucide-react";
import { projectsData } from "../data/projectsData";
import type { ProjectCard } from "../data/projectsData";

type TabType = "all" | "active" | "completed" | "archived";
type ViewType = "grid" | "table" | "kanban";

interface ProjectsPageProps {
  onProjectClick?: (projectId: string) => void;
  onBreadcrumbClick?: (target: "home" | "projects") => void;
}

export default function ProjectsPage({ onProjectClick, onBreadcrumbClick }: ProjectsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState(projectsData.projects);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  // Refs for tab buttons to calculate underline position
  const tabRefs = {
    all: useRef<HTMLButtonElement>(null),
    active: useRef<HTMLButtonElement>(null),
    completed: useRef<HTMLButtonElement>(null),
    archived: useRef<HTMLButtonElement>(null),
  };
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  
  // Update underline position when activeTab changes
  useEffect(() => {
    const updateUnderline = () => {
      const activeTabRef = tabRefs[activeTab].current;
      if (activeTabRef) {
        const tabContainer = activeTabRef.parentElement;
        if (tabContainer) {
          const containerLeft = tabContainer.getBoundingClientRect().left;
          const tabLeft = activeTabRef.getBoundingClientRect().left;
          const tabWidth = activeTabRef.offsetWidth;
          
          setUnderlineStyle({
            left: tabLeft - containerLeft,
            width: tabWidth,
          });
        }
      }
    };
    
    // Initial position
    updateUnderline();
    
    // Update on window resize
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeTab]);

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
          <span className="font-medium text-gray-800">Projects</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Page Title */}
        <h1 className="mb-6 text-3xl font-normal text-gray-900">Projects</h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="relative flex gap-8">
            <button
              ref={tabRefs.all}
              onClick={() => setActiveTab("all")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900 cursor-pointer"
              }`}
            >
              All Projects
            </button>
            <button
              ref={tabRefs.active}
              onClick={() => setActiveTab("active")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900 cursor-pointer"
              }`}
            >
              Active
            </button>
            <button
              ref={tabRefs.completed}
              onClick={() => setActiveTab("completed")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "completed"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900 cursor-pointer"
              }`}
            >
              Completed
            </button>
            <button
              ref={tabRefs.archived}
              onClick={() => setActiveTab("archived")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "archived"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900 cursor-pointer"
              }`}
            >
              Archived
            </button>
            {/* Animated underline */}
            <div
              className="absolute bottom-0 h-[2px] bg-gray-900 transition-all duration-300 ease-in-out"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
              }}
            />
          </div>
        </div>

        {/* Search Bar and View Toggle */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search for project name, ID, status, or associated representative"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            Search
          </button>
          <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Filter size={16} />
            Filter results
          </button>
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewType("grid")}
              className={`rounded p-2 transition-colors ${
                viewType === "grid"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              title="Grid View"
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`rounded p-2 transition-colors ${
                viewType === "table"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              title="Table View"
            >
              <TableIcon size={16} />
            </button>
            <button
              onClick={() => setViewType("kanban")}
              className={`rounded p-2 transition-colors ${
                viewType === "kanban"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              title="Kanban View"
            >
              <Columns size={16} />
            </button>
          </div>
        </div>

        {/* Conditional View Rendering */}
        {viewType === "grid" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayedProjects.map((project) => (
              <ProjectCardComponent
                key={project.id}
                project={project}
                isSelected={selectedProjects.has(project.id)}
                onCheckboxChange={handleCheckboxChange}
                onProjectClick={onProjectClick}
              />
            ))}
          </div>
        )}

        {viewType === "table" && (
          <TableView
            projects={displayedProjects}
            selectedProjects={selectedProjects}
            onCheckboxChange={handleCheckboxChange}
            onProjectClick={onProjectClick}
          />
        )}

        {viewType === "kanban" && (
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
        )}

        {/* No Results */}
        {displayedProjects.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCardComponent({
  project,
  isSelected,
  onCheckboxChange,
  onProjectClick,
}: {
  project: ProjectCard;
  isSelected: boolean;
  onCheckboxChange: (id: string) => void;
  onProjectClick?: (projectId: string) => void;
}) {
  const statusColorClasses = {
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-[#F9F9F6] p-6 transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#776FE5]/15 hover:border-[#776FE5]/30">
      {/* Header Row */}
      <div className="mb-4 flex items-start justify-between">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckboxChange(project.id)}
          className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer"
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
      <div className="mb-4">
        <h3 className="mb-1 text-lg font-medium text-gray-900">{project.name}</h3>
        <p className="text-sm text-gray-500">Created {project.createdDate}</p>
      </div>

      {/* Project Details */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Project Manager</span>
          <span className="font-medium text-gray-900">{project.projectManager}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Orders</span>
          <span className="font-medium text-gray-900">{project.orders}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Batches</span>
          <span className="font-medium text-gray-900">{project.batches}</span>
        </div>
      </div>

      {/* View Details Button */}
      <button 
        onClick={() => onProjectClick?.(project.id)}
        className="w-full rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
      >
        View Details
      </button>
    </div>
  );
}

// Table View Component
function TableView({
  projects,
  selectedProjects,
  onCheckboxChange,
  onProjectClick,
}: {
  projects: ProjectCard[];
  selectedProjects: Set<string>;
  onCheckboxChange: (id: string) => void;
  onProjectClick?: (projectId: string) => void;
}) {
  const statusColorClasses = {
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer"
                onChange={() => {
                  /* Handle select all */
                }}
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
              Project Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
              Project Manager
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
              Orders
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
              Batches
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onProjectClick?.(project.id)}
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedProjects.has(project.id)}
                  onChange={() => onCheckboxChange(project.id)}
                  className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer"
                />
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900 hover:text-[#776FE5]">
                  {project.name}
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                    statusColorClasses[project.statusColor]
                  }`}
                >
                  <span className="text-xs">✓</span> {project.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {project.projectManager}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{project.orders}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{project.batches}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{project.createdDate}</td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onProjectClick?.(project.id)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50"
                >
                  View Details
                </button>
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
    yellow: "bg-yellow-50 border-yellow-200",
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    gray: "bg-gray-50 border-gray-200",
  };

  const dragOverClasses = {
    yellow: "bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300",
    blue: "bg-blue-100 border-blue-400 ring-2 ring-blue-300",
    green: "bg-green-100 border-green-400 ring-2 ring-green-300",
    gray: "bg-gray-100 border-gray-400 ring-2 ring-gray-300",
  };

  const headerColors = {
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-800",
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
      <div className={`rounded-lg border transition-all duration-200 ${
        isDragOver 
          ? 'border-[#776FE5] shadow-lg scale-[1.02]' 
          : 'border-gray-200'
      } bg-white`}>
        {/* Column Header */}
        <div
          className={`flex items-center justify-between rounded-t-lg px-4 py-3 transition-all duration-200 ${
            headerColors[color as keyof typeof headerColors]
          } ${isDragOver ? 'opacity-80' : ''}`}
        >
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-sm font-medium">{projects.length}</span>
        </div>

        {/* Column Content */}
        <div
          className={`min-h-[500px] p-3 space-y-3 transition-all duration-200 ${
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
            <div className={`flex items-center justify-center h-32 text-sm transition-all duration-200 ${
              isDragOver 
                ? 'text-gray-600 font-medium scale-105' 
                : 'text-gray-400'
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
      className={`cursor-move rounded-lg border p-4 shadow-sm transition-all duration-200 ${
        isDragging
          ? 'opacity-40 scale-95 border-[#776FE5] bg-gray-50 rotate-2 shadow-xl'
          : 'border-gray-200 bg-white hover:shadow-md hover:border-[#776FE5] hover:scale-[1.02] active:cursor-grabbing'
      }`}
      style={{
        transformOrigin: 'center',
      }}
    >
      {/* Drag Handle Indicator */}
      {!isDragging && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-0.5">
            <div className="h-0.5 w-4 bg-gray-400 rounded"></div>
            <div className="h-0.5 w-4 bg-gray-400 rounded"></div>
            <div className="h-0.5 w-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      )}

      {/* Project Name */}
      <h4 className={`mb-2 font-medium text-sm transition-colors ${
        isDragging ? 'text-gray-500' : 'text-gray-900'
      }`}>
        {project.name}
      </h4>

      {/* Project Details */}
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Manager:</span>
          <span className={`font-medium transition-colors ${
            isDragging ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {project.projectManager}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Orders:</span>
          <span className={`font-medium transition-colors ${
            isDragging ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {project.orders}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Batches:</span>
          <span className={`font-medium transition-colors ${
            isDragging ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {project.batches}
          </span>
        </div>
      </div>

      {/* Created Date */}
      <div className={`mt-3 pt-3 border-t text-xs transition-colors ${
        isDragging ? 'border-gray-200 text-gray-400' : 'border-gray-100 text-gray-500'
      }`}>
        Created {project.createdDate}
      </div>
    </div>
  );
}

