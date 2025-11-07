// Wasatch BioLabs LIMS Prototype Components
// This folder houses the main dashboard and all related components for the Wasatch prototype

export { default as WasatchDashboard } from './WasatchDashboard';

// Pages
export { default as ProjectsPage } from './pages/ProjectsPage';
export { default as ProjectDetailPage } from './pages/ProjectDetailPage';

// Data and Types
export { dashboardData } from './data/dashboardData';
export { projectsData } from './data/projectsData';
export { projectDetailData, getProjectDetail } from './data/projectDetailData';
export type {
  ActionCard,
  StatsCard,
  ActivityItem,
  Project,
  Order,
  DashboardData
} from './data/dashboardData';
export type {
  ProjectCard,
  ProjectsPageData
} from './data/projectsData';
export type {
  ProjectDetail,
  ProjectDetailStats,
  ProjectMember,
  ProjectDetailData
} from './data/projectDetailData';

// Utilities
export { getIcon } from './utils/iconMapper';

// Future exports:
// export { default as OrdersPage } from './pages/OrdersPage';
// export { default as SpecimensPage } from './pages/SpecimensPage';
// export { default as InvoicesPage } from './pages/InvoicesPage';

