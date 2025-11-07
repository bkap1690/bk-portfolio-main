// Types for Dashboard Data
export interface ActionCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface StatsCard {
  id: string;
  icon: string;
  value: string;
  title: string;
}

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: "blue" | "gray" | "green";
  progress?: number;
  showButton?: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  statusColor: "green" | "blue" | "yellow" | "gray";
  orderCount: number;
}

export interface Order {
  id: string;
  orderId: string;
  company: string;
  status: string;
  statusColor: "green" | "yellow" | "blue" | "gray";
}

export interface DashboardData {
  actionCards: ActionCard[];
  statsCards: StatsCard[];
  recentActivity: ActivityItem[];
  activeProjects: Project[];
  recentOrders: Order[];
}

// Dashboard Data
export const dashboardData: DashboardData = {
  actionCards: [
    {
      id: "create-order",
      icon: "FileText",
      title: "Create Order",
      description: "Start a new order for lab processing.",
      color: "purple"
    },
    {
      id: "add-sample",
      icon: "Microscope",
      title: "Add Sample",
      description: "Add or upload new specimens.",
      color: "purple"
    },
    {
      id: "generate-report",
      icon: "FileText",
      title: "Generate Report",
      description: "Compile test results and analytics.",
      color: "purple"
    }
  ],
  
  statsCards: [
    {
      id: "active-orders",
      icon: "FileText",
      value: "12",
      title: "Active Orders"
    },
    {
      id: "pending-tests",
      icon: "Microscope",
      value: "25",
      title: "Pending Tests"
    },
    {
      id: "due-soon",
      icon: "Clock",
      value: "4",
      title: "Due Soon"
    }
  ],
  
  recentActivity: [
    {
      id: "activity-1",
      icon: "FileText",
      title: "Project Updated",
      description: "New test results have been uploaded",
      badge: "Processing",
      badgeColor: "blue",
      showButton: true
    },
    {
      id: "activity-2",
      icon: "TrendingUp",
      title: "Results Updated",
      description: "QC check completed for 10 specimens",
      badge: "Analyzing",
      badgeColor: "gray",
      progress: 75,
      showButton: true
    },
    {
      id: "activity-3",
      icon: "FileText",
      title: "Specimen Batch Approved",
      description: "15 new samples cleared for testing",
      badge: "Completed",
      badgeColor: "green",
      showButton: true
    }
  ],
  
  activeProjects: [
    {
      id: "proj-1",
      name: "BioTech R&D Study",
      status: "Active",
      statusColor: "green",
      orderCount: 8
    },
    {
      id: "proj-2",
      name: "Pharma QC Validation",
      status: "In Progress",
      statusColor: "blue",
      orderCount: 12
    },
    {
      id: "proj-3",
      name: "Clinical Trial Phase II",
      status: "Active",
      statusColor: "green",
      orderCount: 15
    },
    {
      id: "proj-4",
      name: "Environmental Safety",
      status: "Pending",
      statusColor: "yellow",
      orderCount: 3
    }
  ],
  
  recentOrders: [
    {
      id: "order-1",
      orderId: "F678",
      company: "GeneTech Solutions",
      status: "Received",
      statusColor: "green"
    },
    {
      id: "order-2",
      orderId: "E345",
      company: "BioCore Pharmaceuticals",
      status: "Pending",
      statusColor: "yellow"
    },
    {
      id: "order-3",
      orderId: "C789",
      company: "MediLabs Research",
      status: "In Progress",
      statusColor: "blue"
    },
    {
      id: "order-4",
      orderId: "B456",
      company: "AdvanceBio Corp",
      status: "Completed",
      statusColor: "gray"
    }
  ]
};

