// Types for Results Data
export interface Result {
  id: string;
  protocolType: string;
  dateConducted: string;
  status: string;
  statusColor: "blue" | "orange" | "purple" | "green" | "red" | "yellow";
  assignedProjectManager: string;
  orderId: string;
  sampleId: string;
  projectId: string;
}

export interface ResultDetail {
  id: string;
  testType: string;
  sampleId: string; // Display ID
  specimenId: string; // For onSpecimenClick navigation
  associatedOrder: string;
  associatedOrderId: string; // For onOrderClick navigation
  projectManager: string;
  status: string;
  dateConducted: string;
}

export interface ResultsPageData {
  results: Result[];
}

// Results Data - tied to orders, specimens, projects
export const resultsData: ResultsPageData = {
  results: [
    {
      id: "F678",
      protocolType: "Immunohistochemistry",
      dateConducted: "20-02-2024",
      status: "Completed",
      statusColor: "green",
      assignedProjectManager: "J. Doe",
      orderId: "F678",
      sampleId: "F678",
      projectId: "proj-1"
    },
    {
      id: "H543",
      protocolType: "Flow Cytometry",
      dateConducted: "15-03-2024",
      status: "Completed",
      statusColor: "green",
      assignedProjectManager: "A. Smith",
      orderId: "E345",
      sampleId: "E345",
      projectId: "proj-2"
    },
    {
      id: "M901",
      protocolType: "Western Blot",
      dateConducted: "20-02-2024",
      status: "Completed",
      statusColor: "green",
      assignedProjectManager: "K. Brown",
      orderId: "C789",
      sampleId: "C789",
      projectId: "proj-1"
    },
    {
      id: "R234",
      protocolType: "ELISA",
      dateConducted: "18-02-2024",
      status: "Completed",
      statusColor: "green",
      assignedProjectManager: "J. Doe",
      orderId: "B456",
      sampleId: "B456",
      projectId: "proj-2"
    },
    {
      id: "D756",
      protocolType: "PCR",
      dateConducted: "22-02-2024",
      status: "Completed",
      statusColor: "green",
      assignedProjectManager: "A. Smith",
      orderId: "D012",
      sampleId: "D012",
      projectId: "proj-3"
    },
    {
      id: "K432",
      protocolType: "Mass Spectrometry",
      dateConducted: "19-02-2024",
      status: "Processing",
      statusColor: "blue",
      assignedProjectManager: "K. Brown",
      orderId: "A123",
      sampleId: "A123",
      projectId: "proj-1"
    },
    {
      id: "T890",
      protocolType: "Electrophoresis",
      dateConducted: "25-02-2024",
      status: "Pending",
      statusColor: "orange",
      assignedProjectManager: "M. Johnson",
      orderId: "G901",
      sampleId: "G901",
      projectId: "proj-3"
    }
  ]
};

// Get result detail by ID
export const getResultDetail = (id: string): ResultDetail | undefined => {
  const resultDetailsMap: Record<string, ResultDetail> = {
    F678: {
      id: "F678",
      testType: "Immunohistochemistry",
      sampleId: "EJwJKB",
      specimenId: "F678",
      associatedOrder: "ORD-2025-001",
      associatedOrderId: "F678",
      projectManager: "J. Doe",
      status: "Processing",
      dateConducted: "20-02-2024"
    },
    H543: {
      id: "H543",
      testType: "Flow Cytometry",
      sampleId: "FC-3247",
      specimenId: "E345",
      associatedOrder: "ORD-2025-002",
      associatedOrderId: "E345",
      projectManager: "A. Smith",
      status: "Completed",
      dateConducted: "15-03-2024"
    },
    M901: {
      id: "M901",
      testType: "Western Blot",
      sampleId: "WB-7891",
      specimenId: "C789",
      associatedOrder: "ORD-2025-003",
      associatedOrderId: "C789",
      projectManager: "K. Brown",
      status: "Completed",
      dateConducted: "20-02-2024"
    },
    R234: {
      id: "R234",
      testType: "ELISA",
      sampleId: "EL-4562",
      specimenId: "B456",
      associatedOrder: "ORD-2025-004",
      associatedOrderId: "B456",
      projectManager: "J. Doe",
      status: "Completed",
      dateConducted: "18-02-2024"
    },
    D756: {
      id: "D756",
      testType: "PCR",
      sampleId: "PCR-0123",
      specimenId: "D012",
      associatedOrder: "ORD-2025-005",
      associatedOrderId: "D012",
      projectManager: "A. Smith",
      status: "Completed",
      dateConducted: "22-02-2024"
    },
    K432: {
      id: "K432",
      testType: "Mass Spectrometry",
      sampleId: "MS-9987",
      specimenId: "A123",
      associatedOrder: "ORD-2025-006",
      associatedOrderId: "A123",
      projectManager: "K. Brown",
      status: "Processing",
      dateConducted: "19-02-2024"
    },
    T890: {
      id: "T890",
      testType: "Electrophoresis",
      sampleId: "EP-5544",
      specimenId: "G901",
      associatedOrder: "ORD-2025-007",
      associatedOrderId: "G901",
      projectManager: "M. Johnson",
      status: "Pending",
      dateConducted: "25-02-2024"
    }
  };

  return resultDetailsMap[id];
};

// Get results by sample/specimen ID (for SpecimenDetailPage)
export const getResultsBySampleId = (sampleId: string): Result[] =>
  resultsData.results.filter((r) => r.sampleId === sampleId);

// Get results by order ID (for OrderDetailPage)
export const getResultsByOrderId = (orderId: string): Result[] =>
  resultsData.results.filter((r) => r.orderId === orderId);

// Documents & Protocols for results
export interface ResultDocument {
  id: string;
  name: string;
  category: "Protocol" | "SOP" | "Certificate" | "Report" | "Other";
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  version?: string;
}

export interface ResultActivityItem {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

export const getResultDocuments = (resultId: string): ResultDocument[] => {
  const documentsByResult: Record<string, ResultDocument[]> = {
    F678: [
      {
        id: "doc-1",
        name: "IHC-Staining-Protocol-v2.1.pdf",
        category: "Protocol",
        uploadedAt: "2024-02-18 09:15",
        uploadedBy: "J. Doe",
        size: "2.4 MB",
        version: "2.1"
      },
      {
        id: "doc-2",
        name: "Certificate_of_Analysis_EJwJKB.pdf",
        category: "Certificate",
        uploadedAt: "2024-02-20 14:32",
        uploadedBy: "Lab System",
        size: "156 KB",
        version: "1.0"
      },
      {
        id: "doc-3",
        name: "SOP-QC-Validation.pdf",
        category: "SOP",
        uploadedAt: "2024-02-19 11:00",
        uploadedBy: "K. Brown",
        size: "890 KB",
        version: "3.0"
      }
    ],
    H543: [
      {
        id: "doc-4",
        name: "Flow-Cytometry-Protocol.pdf",
        category: "Protocol",
        uploadedAt: "2024-03-14 10:00",
        uploadedBy: "A. Smith",
        size: "1.8 MB",
        version: "1.2"
      },
      {
        id: "doc-5",
        name: "CoA_FC-3247.pdf",
        category: "Certificate",
        uploadedAt: "2024-03-15 16:45",
        uploadedBy: "Lab System",
        size: "142 KB"
      }
    ],
    M901: [
      {
        id: "doc-6",
        name: "Western-Blot-SOP.pdf",
        category: "SOP",
        uploadedAt: "2024-02-18 08:30",
        uploadedBy: "K. Brown",
        size: "2.1 MB",
        version: "4.2"
      },
      {
        id: "doc-7",
        name: "CoA_WB-7891.pdf",
        category: "Certificate",
        uploadedAt: "2024-02-20 15:00",
        uploadedBy: "Lab System",
        size: "138 KB"
      }
    ],
    R234: [
      {
        id: "doc-8",
        name: "ELISA-Protocol.pdf",
        category: "Protocol",
        uploadedAt: "2024-02-17 09:00",
        uploadedBy: "J. Doe",
        size: "1.5 MB",
        version: "1.0"
      },
      {
        id: "doc-9",
        name: "Certificate_of_Analysis_EL-4562.pdf",
        category: "Certificate",
        uploadedAt: "2024-02-18 16:00",
        uploadedBy: "Lab System",
        size: "145 KB"
      }
    ],
    D756: [
      {
        id: "doc-10",
        name: "PCR-Amplification-Protocol.pdf",
        category: "Protocol",
        uploadedAt: "2024-02-21 08:00",
        uploadedBy: "A. Smith",
        size: "2.0 MB",
        version: "2.3"
      }
    ],
    K432: [
      {
        id: "doc-11",
        name: "Mass-Spec-SOP.pdf",
        category: "SOP",
        uploadedAt: "2024-02-18 14:00",
        uploadedBy: "K. Brown",
        size: "3.2 MB",
        version: "5.1"
      }
    ],
    T890: [
      {
        id: "doc-12",
        name: "Electrophoresis-Protocol.pdf",
        category: "Protocol",
        uploadedAt: "2024-02-24 10:00",
        uploadedBy: "M. Johnson",
        size: "1.1 MB",
        version: "1.1"
      }
    ]
  };
  return documentsByResult[resultId] ?? [
    {
      id: "doc-default",
      name: "Certificate_of_Analysis.pdf",
      category: "Certificate",
      uploadedAt: "2024-01-15 12:00",
      uploadedBy: "Lab System",
      size: "120 KB",
      version: "1.0"
    }
  ];
};

export const getResultActivityLog = (resultId: string): ResultActivityItem[] => {
  const activityByResult: Record<string, ResultActivityItem[]> = {
    F678: [
      { id: "act-1", timestamp: "2024-02-20 14:45", action: "Report generated", user: "Lab System", details: "Certificate of Analysis created" },
      { id: "act-2", timestamp: "2024-02-20 14:30", action: "Quality check passed", user: "J. Doe", details: "QC validation completed" },
      { id: "act-3", timestamp: "2024-02-20 09:15", action: "Test completed", user: "Lab System", details: "Immunohistochemistry staining finalized" },
      { id: "act-4", timestamp: "2024-02-19 14:00", action: "Test initiated", user: "K. Brown", details: "Sample processing started" },
      { id: "act-5", timestamp: "2024-02-18 11:30", action: "Sample received", user: "Lab System", details: "Sample EJwJKB logged into LIMS" },
      { id: "act-6", timestamp: "2024-02-18 09:00", action: "Order confirmed", user: "J. Doe", details: "ORD-2025-001 received" }
    ],
    H543: [
      { id: "act-7", timestamp: "2024-03-15 16:50", action: "Report generated", user: "Lab System" },
      { id: "act-8", timestamp: "2024-03-15 14:00", action: "Test completed", user: "A. Smith" },
      { id: "act-9", timestamp: "2024-03-14 10:15", action: "Sample received", user: "Lab System" }
    ],
    M901: [
      { id: "act-10", timestamp: "2024-02-20 15:00", action: "Report generated", user: "Lab System" },
      { id: "act-11", timestamp: "2024-02-20 11:00", action: "Test completed", user: "K. Brown" },
      { id: "act-12", timestamp: "2024-02-19 08:00", action: "Sample received", user: "Lab System" }
    ],
    R234: [
      { id: "act-13", timestamp: "2024-02-18 16:05", action: "Report generated", user: "Lab System" },
      { id: "act-14", timestamp: "2024-02-18 14:00", action: "Quality check passed", user: "J. Doe" },
      { id: "act-15", timestamp: "2024-02-18 09:00", action: "Test completed", user: "Lab System" },
      { id: "act-16", timestamp: "2024-02-17 14:30", action: "Sample received", user: "Lab System" }
    ],
    D756: [
      { id: "act-17", timestamp: "2024-02-22 15:30", action: "Report generated", user: "Lab System" },
      { id: "act-18", timestamp: "2024-02-22 12:00", action: "Test completed", user: "A. Smith" },
      { id: "act-19", timestamp: "2024-02-21 09:00", action: "Sample received", user: "Lab System" }
    ],
    K432: [
      { id: "act-20", timestamp: "2024-02-19 16:00", action: "Test in progress", user: "K. Brown", details: "Analysis running" },
      { id: "act-21", timestamp: "2024-02-19 10:00", action: "Sample received", user: "Lab System" }
    ],
    T890: [
      { id: "act-22", timestamp: "2024-02-25 09:00", action: "Order queued", user: "Lab System", details: "Awaiting sample" }
    ]
  };
  return activityByResult[resultId] ?? [
    { id: "act-default-1", timestamp: "2024-01-15 12:00", action: "Result created", user: "Lab System" },
    { id: "act-default-2", timestamp: "2024-01-15 11:55", action: "Sample received", user: "Lab System" }
  ];
};
