// Types for Projects Page Data
export interface ProjectCard {
  id: string;
  name: string;
  status: string;
  statusColor: "green" | "blue" | "yellow" | "gray";
  createdDate: string;
  projectManager: string;
  orders: number;
  batches: number;
  category: "active" | "completed" | "archived";
}

export interface ProjectsPageData {
  projects: ProjectCard[];
}

// Projects Page Data
const projectsPageData: ProjectsPageData = {
  projects: [
    {
      id: "proj-1",
      name: "BioTech R&D Study",
      status: "Active",
      statusColor: "green",
      createdDate: "11/20/2024",
      projectManager: "J. Doe",
      orders: 8,
      batches: 5,
      category: "active"
    },
    {
      id: "proj-2",
      name: "Pharma QC Validation",
      status: "In Progress",
      statusColor: "blue",
      createdDate: "11/18/2024",
      projectManager: "J. Doe",
      orders: 12,
      batches: 8,
      category: "active"
    },
    {
      id: "proj-3",
      name: "Clinical Trial Phase II",
      status: "Active",
      statusColor: "green",
      createdDate: "11/15/2024",
      projectManager: "A. Smith",
      orders: 15,
      batches: 10,
      category: "active"
    },
    {
      id: "proj-4",
      name: "Environmental Safety",
      status: "Pending",
      statusColor: "yellow",
      createdDate: "11/12/2024",
      projectManager: "M. Johnson",
      orders: 3,
      batches: 2,
      category: "active"
    },
    {
      id: "proj-5",
      name: "Vaccine Development",
      status: "Active",
      statusColor: "green",
      createdDate: "11/10/2024",
      projectManager: "S. Williams",
      orders: 20,
      batches: 15,
      category: "active"
    },
    {
      id: "proj-6",
      name: "Drug Efficacy Testing",
      status: "In Progress",
      statusColor: "blue",
      createdDate: "11/08/2024",
      projectManager: "R. Brown",
      orders: 10,
      batches: 7,
      category: "active"
    },
    {
      id: "proj-7",
      name: "Genetic Screening Study",
      status: "Completed",
      statusColor: "gray",
      createdDate: "10/25/2024",
      projectManager: "J. Doe",
      orders: 25,
      batches: 18,
      category: "completed"
    },
    {
      id: "proj-8",
      name: "Pathogen Analysis",
      status: "Archived",
      statusColor: "gray",
      createdDate: "09/15/2024",
      projectManager: "T. Davis",
      orders: 30,
      batches: 20,
      category: "archived"
    },
    {
      id: "proj-9",
      name: "Protein Structure Analysis",
      status: "Active",
      statusColor: "green",
      createdDate: "11/05/2024",
      projectManager: "L. Martinez",
      orders: 6,
      batches: 4,
      category: "active"
    }
  ]
};

export const projectsData = projectsPageData;

