import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Settings,
  Home,
  FolderOpen,
  FileText,
  Microscope,
  Receipt,
  BarChart3,
  Users,
  ChevronRight,
} from "lucide-react";
import logo from './assets/WBL_Logo.svg';
import { dashboardData } from './data/dashboardData';
import { getIcon } from './utils/iconMapper';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';  

export default function WasatchDashboard() {
  // Load Roboto font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [expandedSidebar, setExpandedSidebar] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<Array<{ type: string; id?: string }>>([{ type: "home" }]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when navigation changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeItem, selectedProjectId]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (navigationHistory.length > 1) {
        const newHistory = [...navigationHistory];
        newHistory.pop();
        const previousState = newHistory[newHistory.length - 1];
        
        setNavigationHistory(newHistory);
        
        if (previousState.type === "project-detail") {
          setSelectedProjectId(previousState.id || null);
          setActiveItem("projects-all");
          setExpandedSidebar("projects");
        } else if (previousState.type === "projects") {
          setSelectedProjectId(null);
          setActiveItem("projects-all");
          setExpandedSidebar("projects");
        } else if (previousState.type === "home") {
          setSelectedProjectId(null);
          setActiveItem("home");
          setExpandedSidebar(null);
        } else {
          setSelectedProjectId(null);
          setActiveItem(previousState.type);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigationHistory]);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveItem("projects-all");
    setExpandedSidebar("projects");
    
    // Add to navigation history
    const newHistory = [...navigationHistory, { type: "project-detail", id: projectId }];
    setNavigationHistory(newHistory);
    window.history.pushState(null, "", "");
  };

  const handleBreadcrumbClick = (target: "home" | "projects" | "all-projects") => {
    if (target === "home") {
      setSelectedProjectId(null);
      setActiveItem("home");
      setExpandedSidebar(null);
      setNavigationHistory([{ type: "home" }]);
    } else if (target === "projects" || target === "all-projects") {
      setSelectedProjectId(null);
      setActiveItem("projects-all");
      setExpandedSidebar("projects");
      setNavigationHistory([{ type: "home" }, { type: "projects" }]);
    }
  };

  const handleNavClick = (
    item: string,
    hasSubmenu: boolean,
    firstSubItem?: string,
    isActive?: boolean,
  ) => {
    // Prevent clicking if item is already active
    if (isActive) {
      return;
    }

    // Clear selected project when navigating
    setSelectedProjectId(null);

    // Update navigation history
    setNavigationHistory([{ type: "home" }, { type: item }]);

    if (hasSubmenu && firstSubItem) {
      // When clicking a main nav with submenus, activate the first sub-item
      setActiveItem(firstSubItem);
      // Always set the expanded sidebar to this item (closes others)
      if (expandedSidebar !== item) {
        setExpandedSidebar(item);
      }
    } else if (hasSubmenu) {
      // Main nav item clicked (for items without firstSubItem parameter)
      setActiveItem(item);
      if (expandedSidebar !== item) {
        setExpandedSidebar(item);
      }
    } else {
      // Sub-item or regular nav item clicked
      setActiveItem(item);
      
      // Keep the parent menu expanded if the clicked item belongs to a menu group
      const parentMenu = item.includes('-') ? item.split('-')[0] : null;
      if (parentMenu && ['projects', 'orders', 'invoices', 'results', 'users'].includes(parentMenu)) {
        setExpandedSidebar(parentMenu);
      } else {
        // Close all expanded menus for items without submenus (like "home", "specimens")
        setExpandedSidebar(null);
      }
    }
  };

  return (
    <div className="flex h-screen bg-white" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-[250px] flex-shrink-0 border-r border-gray-200 bg-[#F9F9F6] flex flex-col h-screen">
        <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-[#F1F1EC] p-4 flex-shrink-0">
          <img src={logo} alt="WASATCH.BIOLABS" className="h-12" />
        </div>
        <nav className="p-3 overflow-y-auto flex-1">
          <SidebarItem
            icon={<Home size={18} />}
            label="Home"
            active={activeItem === "home"}
            onClick={() => handleNavClick("home", false, undefined, activeItem === "home")}
          />
          <SidebarItem
            icon={<FolderOpen size={18} />}
            label="Projects"
            active={activeItem.startsWith("projects")}
            hasSubmenu
            isExpanded={expandedSidebar === "projects"}
            onClick={() => handleNavClick("projects", true, "projects-all", activeItem.startsWith("projects"))}
          >
            <SubMenuItem
              label="All Projects"
              active={activeItem === "projects-all"}
              onClick={() => handleNavClick("projects-all", false, undefined, activeItem === "projects-all")}
            />
            <SubMenuItem
              label="Active Projects"
              active={activeItem === "projects-active"}
              onClick={() => handleNavClick("projects-active", false, undefined, activeItem === "projects-active")}
            />
            <SubMenuItem
              label="Archived Projects"
              active={activeItem === "projects-archived"}
              onClick={() => handleNavClick("projects-archived", false, undefined, activeItem === "projects-archived")}
            />
          </SidebarItem>
          <SidebarItem
            icon={<FileText size={18} />}
            label="Orders"
            active={activeItem.startsWith("orders")}
            hasSubmenu
            isExpanded={expandedSidebar === "orders"}
            onClick={() => handleNavClick("orders", true, "orders-all", activeItem.startsWith("orders"))}
          >
            <SubMenuItem
              label="All Orders"
              active={activeItem === "orders-all"}
              onClick={() => handleNavClick("orders-all", false, undefined, activeItem === "orders-all")}
            />
            <SubMenuItem
              label="Pending Orders"
              active={activeItem === "orders-pending"}
              onClick={() => handleNavClick("orders-pending", false, undefined, activeItem === "orders-pending")}
            />
            <SubMenuItem
              label="Completed Orders"
              active={activeItem === "orders-completed"}
              onClick={() => handleNavClick("orders-completed", false, undefined, activeItem === "orders-completed")}
            />
          </SidebarItem>
          <SidebarItem
            icon={<Microscope size={18} />}
            label="Specimens"
            active={activeItem === "specimens"}
            onClick={() => handleNavClick("specimens", false, undefined, activeItem === "specimens")}
          />
          <SidebarItem
            icon={<Receipt size={18} />}
            label="Invoices"
            active={activeItem.startsWith("invoices")}
            hasSubmenu
            isExpanded={expandedSidebar === "invoices"}
            onClick={() => handleNavClick("invoices", true, "invoices-all", activeItem.startsWith("invoices"))}
          >
            <SubMenuItem
              label="All Invoices"
              active={activeItem === "invoices-all"}
              onClick={() => handleNavClick("invoices-all", false, undefined, activeItem === "invoices-all")}
            />
            <SubMenuItem
              label="Paid"
              active={activeItem === "invoices-paid"}
              onClick={() => handleNavClick("invoices-paid", false, undefined, activeItem === "invoices-paid")}
            />
            <SubMenuItem
              label="Unpaid"
              active={activeItem === "invoices-unpaid"}
              onClick={() => handleNavClick("invoices-unpaid", false, undefined, activeItem === "invoices-unpaid")}
            />
          </SidebarItem>
          <SidebarItem
            icon={<BarChart3 size={18} />}
            label="Results & Reporting"
            active={activeItem.startsWith("results")}
            hasSubmenu
            isExpanded={expandedSidebar === "results"}
            onClick={() => handleNavClick("results", true, "results-view", activeItem.startsWith("results"))}
          >
            <SubMenuItem
              label="View Results"
              active={activeItem === "results-view"}
              onClick={() => handleNavClick("results-view", false, undefined, activeItem === "results-view")}
            />
            <SubMenuItem
              label="Generate Report"
              active={activeItem === "results-generate"}
              onClick={() => handleNavClick("results-generate", false, undefined, activeItem === "results-generate")}
            />
          </SidebarItem>
          <SidebarItem
            icon={<Users size={18} />}
            label="User Management"
            active={activeItem.startsWith("users")}
            hasSubmenu
            isExpanded={expandedSidebar === "users"}
            onClick={() => handleNavClick("users", true, "users-all", activeItem.startsWith("users"))}
          >
            <SubMenuItem
              label="All Users"
              active={activeItem === "users-all"}
              onClick={() => handleNavClick("users-all", false, undefined, activeItem === "users-all")}
            />
            <SubMenuItem
              label="Roles & Permissions"
              active={activeItem === "users-roles"}
              onClick={() => handleNavClick("users-roles", false, undefined, activeItem === "users-roles")}
            />
          </SidebarItem>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-[#F1F1EC] px-6 py-3 flex-shrink-0">
          <div className="max-w-full flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search for Projects, Specimens, Orders"
                className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center gap-3">
            <button className="rounded-md bg-teal-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 cursor-pointer">
              Order Now
            </button>
            <button className="rounded-md p-2 transition-colors hover:bg-[#E6E6E6] cursor-pointer">
              <Bell size={20} className="text-gray-600" />
            </button>
            <button className="rounded-md p-2 transition-colors hover:bg-[#E6E6E6] cursor-pointer">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6E6E6] transition-colors hover:bg-[#D9D9D9] cursor-pointer">
              <span className="text-sm font-medium text-gray-700">U</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          {/* Conditional Page Rendering */}
          {selectedProjectId ? (
            <ProjectDetailPage projectId={selectedProjectId} onBreadcrumbClick={handleBreadcrumbClick} />
          ) : activeItem.startsWith("projects") ? (
            <ProjectsPage onProjectClick={handleProjectClick} onBreadcrumbClick={handleBreadcrumbClick} />
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="bg-white px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <span 
                    onClick={() => handleBreadcrumbClick("home")}
                    className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
                  >
                    Home
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-800">Dashboard</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <main className="px-6 py-6">
          {/* Action Cards */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {dashboardData.actionCards.map((card) => (
              <ActionCard
                key={card.id}
                icon={getIcon(card.icon, 24)}
                title={card.title}
                description={card.description}
                color={card.color}
              />
            ))}
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {dashboardData.statsCards.map((stat) => (
              <StatsCard
                key={stat.id}
                icon={getIcon(stat.icon, 20)}
                value={stat.value}
                title={stat.title}
              />
            ))}
          </div>

          {/* Recent Activity */}
          <section className="mb-6">
              <h2 className="mb-4 font-normal text-xl text-gray-900">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  icon={getIcon(activity.icon, 20)}
                  title={activity.title}
                  description={activity.description}
                  badge={activity.badge}
                  badgeColor={activity.badgeColor}
                  progress={activity.progress}
                  showButton={activity.showButton}
                />
              ))}
            </div>
          </section>

          {/* Tables Row */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            {/* Active Projects */}
            <section>
              <h2 className="mb-4 font-normal text-2xl text-gray-900">
                Active Projects
              </h2>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Project Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Status ▼
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Orders
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboardData.activeProjects.map((project) => (
                      <ProjectRow
                        key={project.id}
                        name={project.name}
                        status={project.status}
                        statusColor={project.statusColor}
                        orderCount={project.orderCount}
                        onProjectClick={() => handleProjectClick(project.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Orders */}
            <section>
              <h2 className="mb-4 font-normal text-2xl text-gray-900">
                Recent Orders
              </h2>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Order Status ▼
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dashboardData.recentOrders.map((order) => (
                      <OrderRow
                        key={order.id}
                        orderId={order.orderId}
                        company={order.company}
                        status={order.status}
                        statusColor={order.statusColor}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Recent Activity Table */}
          {/* <section className="mb-6">
            <h2 className="mb-4 font-normal text-2xl text-gray-900">
              Recent Activity
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                      Project Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                      Status ▼
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                      Orders
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Project Name
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          ✓ Status
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Number of orders
                      </td>
                      <td className="px-4 py-3">
                        <button className="rounded-md border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section> */}

          {/* Resources */}
          {/* <section className="mb-6">
            <h2 className="mb-4 font-normal text-2xl text-gray-900">
              Resources
            </h2>
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
              <ResourceItem
                title="Contact Support"
                description="Submit a Support Ticket, Live Chat with Support, Email & Phone Support"
                isExpanded={expandedResources === "contact"}
                onToggle={() => toggleResource("contact")}
              />
              <ResourceItem
                title="Quick Links to Common Resources"
                description="User Guide & Tutorials, FAQs, Standard Operating Procedures, Compliance & Regulatory Info"
                isExpanded={expandedResources === "links"}
                onToggle={() => toggleResource("links")}
              />
              <ResourceItem
                title="Training & Onboarding Materials"
                description="New User Training Videos, Role-Based Quick Start Guides"
                isExpanded={expandedResources === "training"}
                onToggle={() => toggleResource("training")}
              />
              <ResourceItem
                title="System Status & Updates"
                description="System Status Page, Release Notes & Updates"
                isExpanded={expandedResources === "status"}
                onToggle={() => toggleResource("status")}
              />
            </div>
          </section> */}
              </main>

              {/* Footer */}
              <footer className="bg-gray-800 py-4 text-center text-sm text-white">
                © 2024 Wasatch BioLabs. All rights reserved
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({
  icon,
  label,
  active = false,
  hasSubmenu = false,
  isExpanded = false,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <button
        onClick={onClick}
        className={`group relative flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out ${
          active
            ? "cursor-default font-medium text-[#776FE5] before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:rounded-l-md before:bg-[#776FE5] before:transition-all before:duration-200 before:content-['']"
            : "cursor-pointer text-gray-700 hover:translate-x-0.5 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-2 transition-transform duration-200">
          <span
            className={`transition-transform duration-200 ${active ? "scale-110 text-[#776FE5]" : "group-hover:scale-105"}`}
          >
            {icon}
          </span>
          <span className="text-left text-sm">{label}</span>
        </div>
        {hasSubmenu && (
          <ChevronRight
            size={14}
            className={`transition-all duration-300 ease-in-out ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          hasSubmenu && isExpanded
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-4 mt-1 space-y-1 rounded-md bg-[#F1F1EC] p-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// SubMenu Item Component
function SubMenuItem({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`animate-in fade-in slide-in-from-left-2 group relative flex w-full items-center rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out ${
        active
          ? "cursor-default font-medium text-[#776FE5]"
          : "cursor-pointer text-gray-600 hover:translate-x-1 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span className="text-left text-sm transition-all duration-150">
        {label}
      </span>
    </button>
  );
}

// Action Card Component
function ActionCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <button className="group cursor-pointer rounded-lg border border-gray-300 bg-[#F9F9F6] hover:bg-[#F1F1EC] p-2 lg:p-4 text-left transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#776FE5]/15 hover:border-[#776FE5]/30">
      <div className="flex items-center justify-center lg:justify-start gap-4">
        <div
          className={`rounded-md lg:rounded-lg p-2 lg:p-3 ${
            color === "purple" ? "bg-[#776FE5]/10" : "bg-gray-100"
          }`}
        >
          <div
            className={color === "purple" ? "text-[#776FE5]" : "text-gray-600"}
          >
            {icon}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-md lg:font-normal lg:text-xl text-gray-900 transition-colors group-hover:text-[#776FE5]">
            {title}
          </h3>
          
          <p className="text-sm text-gray-500 hidden lg:block">{description}</p>
        </div>
      </div>
    </button>
  );
}

// Stats Card Component
function StatsCard({ icon, value, title }: { icon: React.ReactNode; value: string; title: string; }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-start gap-2">
        <div className="text-gray-600">{icon}</div>
        <div className="flex-1">{title}</div>

        <button className="text-sm font-medium text-[#776FE5] hover:text-[#776FE5]/80 cursor-pointer">
          View Details
        </button>
      </div>
      <div className="text-4xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  icon,
  title,
  description,
  badge,
  badgeColor = "green",
  progress,
  showButton = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  badgeColor?: "blue" | "gray" | "green";
  progress?: number;
  showButton?: boolean;
}) {
  const badgeStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-700 border-gray-300",
    green: "bg-green-50 text-green-700 border-green-200",
  };

  const progressRef = useRef<HTMLDivElement>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (progress === undefined || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Delay slightly for a better visual effect
            setTimeout(() => {
              setAnimatedProgress(progress);
            }, 100);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => {
      if (progressRef.current) {
        observer.unobserve(progressRef.current);
      }
    };
  }, [progress, hasAnimated]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
            <div className="text-blue-600">{icon}</div>
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <span
                className={`rounded-md border px-3 py-1 text-xs font-medium ${badgeStyles[badgeColor]}`}
              >
                {badge}
              </span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
            {progress !== undefined && (
              <div className="mt-6" ref={progressRef}>
                <div className="relative">
                  {/* Progress Steps Container */}
                  <div className="relative flex justify-between">
                    {/* Progress Line - positioned to align with dot centers */}
                    <div className="absolute inset-x-0 top-[6px] flex items-center">
                      <div className="h-0.5 w-full bg-gray-200 mx-[6px]">
                        <div
                          className="h-full bg-[#776FE5] transition-all duration-1000 ease-out"
                          style={{ 
                            width: animatedProgress >= 100 ? `calc(100% - 12.5%)` : 
                                   animatedProgress >= 75 ? `calc(75% - 12.5%)` :
                                   animatedProgress >= 50 ? `calc(50% - 12.5%)` :
                                   animatedProgress >= 25 ? `calc(0% - 12.5%)` : '0%'
                          }}
                        />
                      </div>
                    </div>
                    {/* Step 1 - Submitted */}
                    <div className="flex flex-col items-center w-1/4">
                      <div className="relative mb-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 25 && animatedProgress < 50 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-full bg-[#776FE5] opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-full transition-all duration-500 ${animatedProgress >= 25 ? 'bg-[#776FE5]' : 'bg-gray-200'}`}>
                          {animatedProgress >= 25 && animatedProgress < 50 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-full ring-2 ring-[#776FE5] ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`text-sm transition-all duration-500 ${animatedProgress >= 25 ? "font-medium text-[#776FE5]" : "text-gray-500"}`}>
                        Submitted
                      </span>
                    </div>

                    {/* Step 2 - Processing */}
                    <div className="flex flex-col items-center w-1/4">
                      <div className="relative mb-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 50 && animatedProgress < 75 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-full bg-[#776FE5] opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-full transition-all duration-500 ${animatedProgress >= 50 ? 'bg-[#776FE5]' : 'bg-gray-200'}`}>
                          {animatedProgress >= 50 && animatedProgress < 75 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-full ring-2 ring-[#776FE5] ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`text-sm transition-all duration-500 ${animatedProgress >= 50 ? "font-medium text-[#776FE5]" : "text-gray-500"}`}>
                        Processing
                      </span>
                    </div>

                    {/* Step 3 - Analyzing */}
                    <div className="flex flex-col items-center w-1/4">
                      <div className="relative mb-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 75 && animatedProgress < 100 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-full bg-[#776FE5] opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-full transition-all duration-500 ${animatedProgress >= 75 ? 'bg-[#776FE5]' : 'bg-gray-200'}`}>
                          {animatedProgress >= 75 && animatedProgress < 100 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-full ring-2 ring-[#776FE5] ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`text-sm transition-all duration-500 ${animatedProgress >= 75 ? "font-medium text-[#776FE5]" : "text-gray-500"}`}>
                        Analyzing
                      </span>
                    </div>

                    {/* Step 4 - Report Delivered */}
                    <div className="flex flex-col items-center w-1/4">
                      <div className="relative mb-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 100 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-full bg-[#776FE5] opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-full transition-all duration-500 ${animatedProgress >= 100 ? 'bg-[#776FE5]' : 'bg-gray-200'}`}>
                          {animatedProgress >= 100 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-full ring-2 ring-[#776FE5] ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`whitespace-nowrap text-sm transition-all duration-500 ${animatedProgress >= 100 ? "font-medium text-[#776FE5]" : "text-gray-500"}`}>
                        Report Delivered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {showButton && (
          <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer">
            View
          </button>
        )}
      </div>
    </div>
  );
}

// Project Row Component
function ProjectRow({
  name,
  status,
  statusColor,
  orderCount,
  onProjectClick,
}: {
  name: string;
  status: string;
  statusColor: string;
  orderCount: number;
  onProjectClick: () => void;
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors" onClick={onProjectClick}>
      <td className="px-4 py-3 text-sm text-gray-900 hover:text-[#776FE5]">{name}</td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
            colorClasses[statusColor as keyof typeof colorClasses]
          }`}
        >
          ✓ {status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {orderCount} {orderCount === 1 ? 'order' : 'orders'}
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onProjectClick}
          className="rounded-md border cursor-pointer border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50"
        >
          View Details
        </button>
      </td>
    </tr>
  );
}

// Order Row Component
function OrderRow({
  orderId,
  company,
  status,
  statusColor,
}: {
  orderId: string;
  company: string;
  status: string;
  statusColor: string;
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{orderId}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{company}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
            colorClasses[statusColor as keyof typeof colorClasses]
          }`}
        >
          ✓ {status}
        </span>
      </td>
      <td className="px-4 py-3">
        <button className="rounded-md border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50">
          View Details
        </button>
      </td>
    </tr>
  );
}

// Resource Item Component (currently unused - for future Resources section)
// function ResourceItem({
//   title,
//   description,
//   isExpanded,
//   onToggle,
// }: {
//   title: string;
//   description: string;
//   isExpanded: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <div className="">
//       <button
//         onClick={onToggle}
//         className="p-4 flex w-full items-start justify-between rounded-lg text-left transition-colors hover:bg-gray-50 cursor-pointer"
//       >
//         <div className="flex-1">
//           <h4 className="mb-1 font-medium text-gray-900">{title}</h4>
//           <p className="text-sm text-gray-600">{description}</p>
//         </div>
//           <ChevronRight size={20} className={`flex-shrink-0 text-gray-400 ${isExpanded ? "rotate-90" : ""} transition-all duration-300 ease-in-out`} />
//       </button>
//     </div>
//   );
// }
