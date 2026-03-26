import { wasatchTokens } from "../theme/tokens";

// Types for Project Detail Page Data
export interface ProjectDetailStats {
  totalOrders: number;
  totalBatches: number;
  totalSamples: number;
  projectCompletion: number;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string; // URL to avatar image
  initials: string;
  avatarColor: string; // For colored circle backgrounds
}

export interface ProjectDetail {
  id: string;
  projectId: string; // Display ID like "PJCT-2023-001"
  name: string;
  status: string;
  statusColor: "green" | "blue" | "yellow" | "gray";
  description: string;
  client: string;
  projectManager: string;
  startDate: string;
  endDate: string;
  orders: number;
  stats: ProjectDetailStats;
  members: ProjectMember[];
}

export interface ProjectDetailData {
  projects: Record<string, ProjectDetail>;
}

// Project Detail Data
export const projectDetailData: ProjectDetailData = {
  projects: {
    "proj-1": {
      id: "proj-1",
      projectId: "PJCT-2023-001",
      name: "BioTech R&D Study",
      status: "Draft",
      statusColor: "green",
      description: "Project PJCT aims to analyze the efficacy of the new compound XZ-91 in inhibiting cancer cell growth. This involves multi-phase testing across various specimen types collected from multiple sites",
      client: "Acme Pharmaceuticals",
      projectManager: "Jane Smith",
      startDate: "Nov 15, 2024",
      endDate: "Dec 31, 2025",
      orders: 10,
      stats: {
        totalOrders: 12,
        totalBatches: 35,
        totalSamples: 420,
        projectCompletion: 65
      },
      members: [
        {
          id: "member-1",
          name: "Dr. Emily Johnson",
          role: "Project Manager",
          initials: "EJ",
          avatarColor: wasatchTokens.primary
        },
        {
          id: "member-2",
          name: "Michael Lee",
          role: "Lead Analyst",
          initials: "ML",
          avatarColor: "#6B7280"
        },
        {
          id: "member-3",
          name: "Sarah Thompson",
          role: "Lab Technician",
          initials: "ST",
          avatarColor: "#D97706"
        }
      ]
    },
    "proj-2": {
      id: "proj-2",
      projectId: "PJCT-2023-002",
      name: "Pharma QC Validation",
      status: "In Progress",
      statusColor: "blue",
      description: "Comprehensive quality control validation study for pharmaceutical manufacturing processes. Includes validation of analytical methods, stability testing, and process optimization.",
      client: "BioCore Pharmaceuticals",
      projectManager: "J. Doe",
      startDate: "Oct 10, 2024",
      endDate: "Mar 31, 2025",
      orders: 12,
      stats: {
        totalOrders: 18,
        totalBatches: 42,
        totalSamples: 530,
        projectCompletion: 45
      },
      members: [
        {
          id: "member-4",
          name: "Dr. James Wilson",
          role: "Lead Scientist",
          initials: "JW",
          avatarColor: "#059669"
        },
        {
          id: "member-5",
          name: "Lisa Chen",
          role: "Quality Analyst",
          initials: "LC",
          avatarColor: "#DC2626"
        }
      ]
    },
    "proj-3": {
      id: "proj-3",
      projectId: "PJCT-2023-003",
      name: "Clinical Trial Phase II",
      status: "Active",
      statusColor: "green",
      description: "Phase II clinical trial for novel immunotherapy treatment. Monitoring patient responses, adverse events, and biomarker analysis across multiple clinical sites.",
      client: "MediLabs Research",
      projectManager: "A. Smith",
      startDate: "Sep 1, 2024",
      endDate: "Jun 30, 2025",
      orders: 15,
      stats: {
        totalOrders: 22,
        totalBatches: 68,
        totalSamples: 890,
        projectCompletion: 72
      },
      members: [
        {
          id: "member-6",
          name: "Dr. Amanda Smith",
          role: "Clinical Director",
          initials: "AS",
          avatarColor: "#2563EB"
        },
        {
          id: "member-7",
          name: "Robert Garcia",
          role: "Data Manager",
          initials: "RG",
          avatarColor: "#7C3AED"
        },
        {
          id: "member-8",
          name: "Nina Patel",
          role: "Lab Coordinator",
          initials: "NP",
          avatarColor: "#EC4899"
        }
      ]
    }
  }
};

// Helper function to get project detail by ID
export const getProjectDetail = (projectId: string): ProjectDetail | undefined => {
  return projectDetailData.projects[projectId];
};

