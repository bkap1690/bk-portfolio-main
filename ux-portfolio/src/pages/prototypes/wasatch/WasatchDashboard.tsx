import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import CreateOrderPage from './pages/CreateOrderPage';
import SpecimensPage from './pages/SpecimensPage';
import SpecimenDetailPage from './pages/SpecimenDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import UsersPage from './pages/UsersPage';
import ResultsPage from './pages/ResultsPage';
import ResultDetailPage from './pages/ResultDetailPage';

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
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<Array<{ type: string; id?: string }>>([{ type: "home" }]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when navigation changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeItem, selectedProjectId, selectedSpecimenId, selectedOrderNumber, selectedResultId]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (navigationHistory.length > 1) {
        const newHistory = [...navigationHistory];
        newHistory.pop();
        const previousState = newHistory[newHistory.length - 1];
        
        setNavigationHistory(newHistory);
        
        if (previousState.type === "order-detail") {
          setSelectedOrderNumber(previousState.id || null);
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedResultId(null);
          setActiveItem("orders-all");
          setExpandedSidebar("orders");
        } else if (previousState.type === "specimen-detail") {
          setSelectedSpecimenId(previousState.id || null);
          setSelectedProjectId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem("specimens");
          setExpandedSidebar(null);
        } else if (previousState.type === "specimens") {
          setSelectedSpecimenId(null);
          setSelectedProjectId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem("specimens");
          setExpandedSidebar(null);
        } else if (previousState.type === "project-detail") {
          setSelectedProjectId(previousState.id || null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem("projects-all");
          setExpandedSidebar("projects");
        } else if (previousState.type === "projects") {
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem("projects-all");
          setExpandedSidebar("projects");
        } else if (previousState.type === "orders-create") {
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem("orders-create");
          setExpandedSidebar("orders");
        } else if (previousState.type === "orders") {
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem("orders-all");
          setExpandedSidebar("orders");
        } else if (previousState.type === "home") {
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem("home");
          setExpandedSidebar(null);
        } else if (previousState.type === "result-detail") {
          setSelectedResultId(previousState.id || null);
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setActiveItem("results");
          setExpandedSidebar(null);
        } else if (previousState.type === "results") {
          setSelectedResultId(null);
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setActiveItem("results");
          setExpandedSidebar(null);
        } else {
          setSelectedProjectId(null);
          setSelectedSpecimenId(null);
          setSelectedOrderNumber(null);
          setSelectedResultId(null);
          setActiveItem(previousState.type);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigationHistory]);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedSpecimenId(null);
    setSelectedOrderNumber(null);
    setSelectedResultId(null);
    setActiveItem("projects-all");
    setExpandedSidebar("projects");
    
    // Add to navigation history
    const newHistory = [...navigationHistory, { type: "project-detail", id: projectId }];
    setNavigationHistory(newHistory);
    window.history.pushState(null, "", "");
  };


  const handleActionCardClick = (cardId: string) => {
    if (cardId === "create-order") {
      setSelectedProjectId(null);
      setActiveItem("orders-create");
      setExpandedSidebar("orders");
      setNavigationHistory([{ type: "home" }, { type: "orders-create" }]);
    }
    // Add handlers for other action cards as needed
  };

  const handleOrderCancel = () => {
    setSelectedProjectId(null);
    setSelectedSpecimenId(null);
    setSelectedOrderNumber(null);
    setSelectedResultId(null);
    setActiveItem("orders-all");
    setExpandedSidebar("orders");
    setNavigationHistory([{ type: "home" }, { type: "orders" }]);
  };

  const handleOrderClick = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
    setSelectedProjectId(null);
    setSelectedSpecimenId(null);
    setSelectedResultId(null);
    setActiveItem("orders-all");
    setExpandedSidebar("orders");
    
    // Add to navigation history
    const newHistory = [...navigationHistory, { type: "order-detail", id: orderNumber }];
    setNavigationHistory(newHistory);
    window.history.pushState(null, "", "");
  };

  const handleResultClick = (resultId: string) => {
    setSelectedResultId(resultId);
    setSelectedProjectId(null);
    setSelectedSpecimenId(null);
    setSelectedOrderNumber(null);
    setActiveItem("results");
    setExpandedSidebar(null);
    
    const newHistory = [...navigationHistory, { type: "result-detail", id: resultId }];
    setNavigationHistory(newHistory);
    window.history.pushState(null, "", "");
  };

  const handleResultsNavBack = () => {
    setSelectedResultId(null);
    setNavigationHistory((prev) => {
      const next = [...prev];
      if (next.length > 1 && next[next.length - 1].type === "result-detail") {
        next.pop();
      }
      return next;
    });
    window.history.pushState(null, "", "");
  };

  const handleSpecimenClick = (specimenId: string) => {
    setSelectedSpecimenId(specimenId);
    setSelectedProjectId(null);
    setSelectedOrderNumber(null);
    setSelectedResultId(null);
    setActiveItem("specimens");
    setExpandedSidebar(null);
    
    // Add to navigation history
    const newHistory = [...navigationHistory, { type: "specimen-detail", id: specimenId }];
    setNavigationHistory(newHistory);
    window.history.pushState(null, "", "");
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

    // Clear selected project, specimen, order, and result when navigating
    setSelectedProjectId(null);
    setSelectedSpecimenId(null);
    setSelectedOrderNumber(null);
    setSelectedResultId(null);

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
    <div className="wasatch-app flex h-screen bg-wasatch-surface font-wasatch-sans">
      {/* Sidebar */}
      <aside className="w-[250px] flex-shrink-0 border-r border-wasatch-border bg-wasatch-bg flex flex-col h-screen">
        <div className="flex h-16 items-center justify-center border-b border-wasatch-border bg-wasatch-bg-elevated p-wasatch-4 flex-shrink-0">
          <img src={logo} alt="WASATCH.BIOLABS" className="h-12" />
        </div>
        <nav className="p-wasatch-3 overflow-y-auto flex-1">
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
              label="Create Order"
              active={activeItem === "orders-create"}
              onClick={() => {
                setSelectedProjectId(null);
                setSelectedSpecimenId(null);
                setSelectedOrderNumber(null);
                setSelectedResultId(null);
                setActiveItem("orders-create");
                setExpandedSidebar("orders");
                setNavigationHistory([{ type: "home" }, { type: "orders-create" }]);
              }}
            />
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
            active={activeItem === "results"}
            onClick={() => handleNavClick("results", false, undefined, activeItem === "results")}
          />
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
        <header className="flex h-16 items-center justify-between border-b border-wasatch-border bg-wasatch-bg-elevated px-wasatch-6 py-wasatch-3 flex-shrink-0">
          <div className="max-w-full flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-wasatch-text-placeholder"
                size={18}
              />
              <input
                type="text"
                placeholder="Search for Projects, Specimens, Orders"
                className="w-full rounded-wasatch-sm border border-wasatch-border bg-wasatch-surface py-wasatch-2 pl-wasatch-10 pr-wasatch-4 text-wasatch-sm focus:border-wasatch-accent focus:outline-none"
              />
            </div>
          </div>
          <div className="ml-wasatch-4 flex items-center gap-wasatch-3">
            <button 
              onClick={() => {
                setSelectedProjectId(null);
                setSelectedSpecimenId(null);
                setSelectedOrderNumber(null);
                setSelectedResultId(null);
                setActiveItem("orders-create");
                setExpandedSidebar("orders");
                setNavigationHistory([{ type: "home" }, { type: "orders-create" }]);
              }}
              className="rounded-wasatch-sm bg-wasatch-accent px-wasatch-6 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse transition-colors hover:bg-wasatch-accent-hover cursor-pointer"
            >
              Order Now
            </button>
            <button className="rounded-wasatch-sm p-wasatch-2 transition-colors hover:bg-wasatch-neutral-200 cursor-pointer">
              <Bell size={20} className="text-wasatch-text-secondary" />
            </button>
            <button className="rounded-wasatch-sm p-wasatch-2 transition-colors hover:bg-wasatch-neutral-200 cursor-pointer">
              <Settings size={20} className="text-wasatch-text-secondary" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-wasatch-full bg-wasatch-neutral-200 transition-colors hover:bg-wasatch-neutral-300 cursor-pointer">
              <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">U</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          {/* Conditional Page Rendering */}
          <AnimatePresence mode="wait">
          {selectedResultId ? (
            <motion.div
              key={`result-${selectedResultId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <ResultDetailPage
              resultId={selectedResultId}
              onBack={handleResultsNavBack}
              onOrderClick={handleOrderClick}
              onSpecimenClick={handleSpecimenClick}
            />
            </motion.div>
          ) : selectedOrderNumber ? (
            <motion.div
              key={`order-${selectedOrderNumber}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <OrderDetailPage
              orderNumber={selectedOrderNumber}
              onResultClick={handleResultClick}
            />
            </motion.div>
          ) : selectedSpecimenId ? (
            <motion.div
              key={`specimen-${selectedSpecimenId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <SpecimenDetailPage
              specimenId={selectedSpecimenId}
              onResultClick={handleResultClick}
            />
            </motion.div>
          ) : selectedProjectId ? (
            <motion.div
              key={`project-${selectedProjectId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <ProjectDetailPage projectId={selectedProjectId} />
            </motion.div>
          ) : activeItem === "orders-create" ? (
            <motion.div
              key="orders-create"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <CreateOrderPage onCancel={handleOrderCancel} />
            </motion.div>
          ) : activeItem === "specimens" ? (
            <motion.div
              key="specimens"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <SpecimensPage onSpecimenClick={handleSpecimenClick} />
            </motion.div>
          ) : activeItem.startsWith("users") ? (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <UsersPage />
            </motion.div>
          ) : activeItem === "results" ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <ResultsPage
              onResultClick={handleResultClick}
            />
            </motion.div>
          ) : activeItem.startsWith("orders") ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <OrdersPage 
              onOrderClick={handleOrderClick}
              onCreateOrder={() => {
                setSelectedProjectId(null);
                setSelectedSpecimenId(null);
                setSelectedOrderNumber(null);
                setSelectedResultId(null);
                setActiveItem("orders-create");
                setExpandedSidebar("orders");
                setNavigationHistory([{ type: "home" }, { type: "orders-create" }]);
              }}
            />
            </motion.div>
          ) : activeItem.startsWith("projects") ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <ProjectsPage onProjectClick={handleProjectClick} />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Dashboard Content */}
              <main className="px-wasatch-6 py-wasatch-6">
          {/* Action Cards */}
          <div className="mb-wasatch-6 grid grid-cols-3 gap-wasatch-4">
            {dashboardData.actionCards.map((card) => (
              <ActionCard
                key={card.id}
                icon={getIcon(card.icon, 24)}
                title={card.title}
                description={card.description}
                color={card.color}
                onClick={() => handleActionCardClick(card.id)}
              />
            ))}
          </div>

          {/* Stats Cards */}
          <div className="mb-wasatch-6 grid grid-cols-3 gap-wasatch-4">
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
              <h2 className="mb-wasatch-4 font-wasatch-normal text-wasatch-xl text-wasatch-text-heading">
              Recent Activity
            </h2>
            <div className="space-y-wasatch-4">
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
          <div className="mb-wasatch-6 grid grid-cols-2 gap-wasatch-6">
            {/* Active Projects */}
            <section>
              <h2 className="mb-wasatch-4 font-wasatch-normal text-wasatch-2xl text-wasatch-text-heading">
                Active Projects
              </h2>
              <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
                <table className="w-full">
                  <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
                    <tr>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Project Name
                      </th>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Status ▼
                      </th>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Orders
                      </th>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wasatch-border">
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
              <h2 className="mb-wasatch-4 font-wasatch-normal text-wasatch-2xl text-wasatch-text-heading">
                Recent Orders
              </h2>
              <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
                <table className="w-full">
                  <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
                    <tr>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Order ID
                      </th>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Company
                      </th>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Order Status ▼
                      </th>
                      <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wasatch-border">
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
            <h2 className="mb-wasatch-4 font-wasatch-normal text-wasatch-2xl text-wasatch-text-heading">
              Recent Activity
            </h2>
            <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
              <table className="w-full">
                <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
                  <tr>
                    <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                      Project Name
                    </th>
                    <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                      Status ▼
                    </th>
                    <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                      Orders
                    </th>
                    <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wasatch-border">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-wasatch-surface-subtle">
                      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading">
                        Project Name
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <span className="inline-flex items-center rounded-wasatch-full border border-wasatch-status-success-border bg-wasatch-status-success-bg px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium text-wasatch-status-success">
                          ✓ Status
                        </span>
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                        Number of orders
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <button className="rounded-wasatch-sm border border-wasatch-border-strong px-wasatch-3 py-wasatch-1 text-wasatch-sm transition-colors hover:bg-wasatch-surface-subtle">
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
            <h2 className="mb-wasatch-4 font-wasatch-normal text-wasatch-2xl text-wasatch-text-heading">
              Resources
            </h2>
            <div className="divide-y divide-wasatch-border rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
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
              <footer className="bg-wasatch-neutral-800 py-wasatch-4 text-center text-wasatch-sm text-wasatch-text-inverse">
                © 2024 Wasatch BioLabs. All rights reserved
              </footer>
            </motion.div>
          )}
          </AnimatePresence>
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
        className={`group relative flex w-full items-center justify-between rounded-wasatch-sm px-wasatch-3 py-wasatch-2 text-wasatch-sm transition-all duration-200 ease-in-out ${
          active
            ? "cursor-default font-wasatch-medium text-wasatch-primary before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:rounded-l-wasatch-sm before:bg-wasatch-primary before:transition-all before:duration-200 before:content-['']"
            : "cursor-pointer text-wasatch-text-secondary hover:translate-x-0.5 hover:bg-wasatch-surface-subtle"
        }`}
      >
        <div className="flex items-center gap-wasatch-2 transition-transform duration-200">
          <span
            className={`transition-transform duration-200 ${active ? "scale-110 text-wasatch-primary" : "group-hover:scale-105"}`}
          >
            {icon}
          </span>
          <span className="text-left text-wasatch-sm">{label}</span>
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
        <div className="ml-wasatch-4 mt-wasatch-1 space-y-wasatch-1 rounded-wasatch-sm bg-wasatch-bg-elevated p-wasatch-1">
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
      className={`animate-in fade-in slide-in-from-left-2 group relative flex w-full items-center rounded-wasatch-sm px-wasatch-3 py-wasatch-2 text-wasatch-sm transition-all duration-200 ease-in-out ${
        active
          ? "cursor-default font-wasatch-medium text-wasatch-primary"
          : "cursor-pointer text-wasatch-text-secondary hover:translate-x-1 hover:bg-wasatch-surface-subtle hover:text-wasatch-text-heading"
      }`}
    >
      <span className="text-left text-wasatch-sm transition-all duration-150">
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
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="group cursor-pointer rounded-wasatch-md border border-wasatch-border-strong bg-wasatch-bg hover:bg-wasatch-bg-elevated p-wasatch-2 lg:p-4 text-left transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg hover:shadow-wasatch-card-hover hover:border-wasatch-primary/30"
    >
      <div className="flex items-center justify-center lg:justify-start gap-4">
        <div
          className={`rounded-wasatch-sm lg:rounded-wasatch-md p-wasatch-2 lg:p-3 ${
            color === "purple" ? "bg-wasatch-primary/10" : "bg-wasatch-neutral-100"
          }`}
        >
          <div
            className={color === "purple" ? "text-wasatch-primary" : "text-wasatch-text-secondary"}
          >
            {icon}
          </div>
        </div>
        <div>
          <h3 className="font-wasatch-medium text-wasatch-base lg:font-wasatch-normal lg:text-wasatch-xl text-wasatch-text-heading transition-colors group-hover:text-wasatch-primary">
            {title}
          </h3>
          
          <p className="text-wasatch-sm text-wasatch-text-muted hidden lg:block">{description}</p>
        </div>
      </div>
    </button>
  );
}

// Stats Card Component
function StatsCard({ icon, value, title }: { icon: React.ReactNode; value: string; title: string; }) {
  return (
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-6">
      <div className="mb-wasatch-4 flex items-center justify-start gap-wasatch-2">
        <div className="text-wasatch-text-secondary">{icon}</div>
        <div className="flex-1">{title}</div>

        <button className="text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover cursor-pointer">
          View Details
        </button>
      </div>
      <div className="text-wasatch-4xl font-wasatch-bold text-wasatch-text-heading">{value}</div>
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
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border",
    gray: "bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border-strong",
    green: "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border",
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
    <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-wasatch-md bg-wasatch-status-info-bg">
            <div className="text-wasatch-status-info">{icon}</div>
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-lg font-wasatch-medium text-wasatch-text-heading">{title}</h3>
              <span
                className={`rounded-wasatch-sm border px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${badgeStyles[badgeColor]}`}
              >
                {badge}
              </span>
            </div>
            <p className="text-wasatch-sm text-wasatch-text-secondary">{description}</p>
            {progress !== undefined && (
              <div className="mt-6" ref={progressRef}>
                <div className="relative">
                  {/* Progress Steps Container */}
                  <div className="relative flex justify-between">
                    {/* Progress Line - positioned to align with dot centers */}
                    <div className="absolute inset-x-0 top-[6px] flex items-center">
                      <div className="h-0.5 w-full bg-wasatch-neutral-200 mx-[6px]">
                        <div
                          className="h-full bg-wasatch-primary transition-all duration-1000 ease-out"
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
                      <div className="relative mb-wasatch-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 25 && animatedProgress < 50 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-wasatch-full bg-wasatch-primary opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-wasatch-full transition-all duration-500 ${animatedProgress >= 25 ? 'bg-wasatch-primary' : 'bg-wasatch-neutral-200'}`}>
                          {animatedProgress >= 25 && animatedProgress < 50 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-wasatch-full ring-2 ring-wasatch-primary ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`text-wasatch-sm transition-all duration-500 ${animatedProgress >= 25 ? "font-wasatch-medium text-wasatch-primary" : "text-wasatch-text-muted"}`}>
                        Submitted
                      </span>
                    </div>

                    {/* Step 2 - Processing */}
                    <div className="flex flex-col items-center w-1/4">
                      <div className="relative mb-wasatch-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 50 && animatedProgress < 75 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-wasatch-full bg-wasatch-primary opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-wasatch-full transition-all duration-500 ${animatedProgress >= 50 ? 'bg-wasatch-primary' : 'bg-wasatch-neutral-200'}`}>
                          {animatedProgress >= 50 && animatedProgress < 75 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-wasatch-full ring-2 ring-wasatch-primary ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`text-wasatch-sm transition-all duration-500 ${animatedProgress >= 50 ? "font-wasatch-medium text-wasatch-primary" : "text-wasatch-text-muted"}`}>
                        Processing
                      </span>
                    </div>

                    {/* Step 3 - Analyzing */}
                    <div className="flex flex-col items-center w-1/4">
                      <div className="relative mb-wasatch-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 75 && animatedProgress < 100 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-wasatch-full bg-wasatch-primary opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-wasatch-full transition-all duration-500 ${animatedProgress >= 75 ? 'bg-wasatch-primary' : 'bg-wasatch-neutral-200'}`}>
                          {animatedProgress >= 75 && animatedProgress < 100 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-wasatch-full ring-2 ring-wasatch-primary ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`text-wasatch-sm transition-all duration-500 ${animatedProgress >= 75 ? "font-wasatch-medium text-wasatch-primary" : "text-wasatch-text-muted"}`}>
                        Analyzing
                      </span>
                    </div>

                    {/* Step 4 - Report Delivered */}
                    <div className="flex flex-col items-center w-1/4">
                      <div className="relative mb-wasatch-2 flex h-3 w-3 items-center justify-center">
                        {animatedProgress >= 100 && (
                          <div className="absolute h-5 w-5 animate-pulse rounded-wasatch-full bg-wasatch-primary opacity-30" />
                        )}
                        <div className={`relative z-10 h-3 w-3 rounded-wasatch-full transition-all duration-500 ${animatedProgress >= 100 ? 'bg-wasatch-primary' : 'bg-wasatch-neutral-200'}`}>
                          {animatedProgress >= 100 && (
                            <div className="absolute inset-0 -m-1 animate-pulse rounded-wasatch-full ring-2 ring-wasatch-primary ring-opacity-40" />
                          )}
                        </div>
                      </div>
                      <span className={`whitespace-nowrap text-wasatch-sm transition-all duration-500 ${animatedProgress >= 100 ? "font-wasatch-medium text-wasatch-primary" : "text-wasatch-text-muted"}`}>
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
          <button className="rounded-wasatch-sm border border-wasatch-border-strong px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium transition-colors hover:bg-wasatch-surface-subtle cursor-pointer">
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
    green: "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border",
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border",
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border",
    gray: "bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border",
  };

  return (
    <tr className="hover:bg-wasatch-surface-subtle transition-colors" onClick={onProjectClick}>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading hover:text-wasatch-primary">{name}</td>
      <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
        <span
          className={`inline-flex items-center rounded-wasatch-full border px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${
            colorClasses[statusColor as keyof typeof colorClasses]
          }`}
        >
          ✓ {status}
        </span>
      </td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
        {orderCount} {orderCount === 1 ? 'order' : 'orders'}
      </td>
      <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onProjectClick}
          className="rounded-wasatch-sm border cursor-pointer border-wasatch-border-strong px-wasatch-3 py-wasatch-1 text-wasatch-sm transition-colors hover:bg-wasatch-surface-subtle"
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
    gray: "bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border",
  };

  return (
    <tr className="hover:bg-wasatch-surface-subtle">
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading">{orderId}</td>
      <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">{company}</td>
      <td className="px-wasatch-4 py-wasatch-3">
        <span
          className={`inline-flex items-center rounded-wasatch-full border px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${
            colorClasses[statusColor as keyof typeof colorClasses]
          }`}
        >
          ✓ {status}
        </span>
      </td>
      <td className="px-wasatch-4 py-wasatch-3">
        <button className="rounded-wasatch-sm border border-wasatch-border-strong px-wasatch-3 py-wasatch-1 text-wasatch-sm transition-colors hover:bg-wasatch-surface-subtle">
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
//         className="p-4 flex w-full items-start justify-between rounded-wasatch-md text-left transition-colors hover:bg-wasatch-surface-subtle cursor-pointer"
//       >
//         <div className="flex-1">
//           <h4 className="mb-1 font-wasatch-medium text-wasatch-text-heading">{title}</h4>
//           <p className="text-wasatch-sm text-wasatch-text-secondary">{description}</p>
//         </div>
//           <ChevronRight size={20} className={`flex-shrink-0 text-wasatch-text-placeholder ${isExpanded ? "rotate-90" : ""} transition-all duration-300 ease-in-out`} />
//       </button>
//     </div>
//   );
// }
