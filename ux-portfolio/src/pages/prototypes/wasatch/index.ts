// Wasatch BioLabs LIMS Prototype Components
// This folder houses the main dashboard and all related components for the Wasatch prototype

export { default as WasatchDashboard } from './WasatchDashboard';

// Pages
export { default as ProjectsPage } from './pages/ProjectsPage';
export { default as ProjectDetailPage } from './pages/ProjectDetailPage';
export { default as CreateOrderPage } from './pages/CreateOrderPage';
export { default as SpecimensPage } from './pages/SpecimensPage';
export { default as SpecimenDetailPage } from './pages/SpecimenDetailPage';
export { default as OrdersPage } from './pages/OrdersPage';
export { default as OrderDetailPage } from './pages/OrderDetailPage';
export { default as ResultsPage } from './pages/ResultsPage';
export { default as ResultDetailPage } from './pages/ResultDetailPage';
export { default as UsersPage } from './pages/UsersPage';
export { default as AccountCreationFlow } from './pages/AccountCreationFlow';
export { default as AccountSuccessPage } from './pages/AccountSuccessPage';

// Components
export { default as CreateOrderModal } from './components/CreateOrderModal';
export { default as OrderStepper } from './components/OrderStepper';
export { default as OrderTypeCard } from './components/OrderTypeCard';
export { default as OrderTypeStep } from './components/OrderTypeStep';
export { default as SampleDetailsStep } from './components/SampleDetailsStep';
export { default as MapSpecimenFieldsModal } from './components/MapSpecimenFieldsModal';
export { default as SignupStepper } from './components/SignupStepper';
export type {
  SampleRow,
  OrderSamples
} from './components/SampleDetailsStep';

// Data and Types
export { dashboardData } from './data/dashboardData';
export { projectsData } from './data/projectsData';
export { projectDetailData, getProjectDetail } from './data/projectDetailData';
export { orderTypes } from './data/orderTypes';
export { specimensData, getSpecimenDetail } from './data/specimensData';
export { ordersData, getOrderDetail } from './data/ordersData';
export {
  resultsData,
  getResultDetail,
  getResultsBySampleId,
  getResultsByOrderId,
} from './data/resultsData';
export { 
  getAllUsers, 
  getUserById, 
  addUser, 
  updateUser, 
  updateLastLogin,
  deactivateUser,
  initializeUsersData,
  usersData 
} from './data/usersData';
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
export type {
  OrderType
} from './data/orderTypes';
export type {
  Specimen,
  SpecimenDetail,
  SpecimensPageData
} from './data/specimensData';
export type {
  Order as OrderData,
  OrderDetail,
  OrdersPageData
} from './data/ordersData';
export type {
  Result,
  ResultDetail,
  ResultsPageData,
  ResultDocument,
  ResultActivityItem,
} from './data/resultsData';
export type {
  User,
  UsersPageData
} from './data/usersData';

// Utilities
export { getIcon } from './utils/iconMapper';

// Contexts
export { SignupProvider, useSignup } from './contexts/SignupContext';
export type {
  AccountType,
  PersonalInfo,
  OrganizationInfo,
  AccountDetails,
  VerificationInfo,
  SignupFormData,
  ValidationErrors
} from './contexts/SignupContext';

// Future exports:
// export { default as InvoicesPage } from './pages/InvoicesPage';

