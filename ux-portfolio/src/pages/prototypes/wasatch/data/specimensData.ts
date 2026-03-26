// Types for Specimens Data
export interface Specimen {
  id: string;
  requisitionNumber: string;
  protocolType: string;
  turnaround: string;
  processingStatus: string;
  processingStatusColor: "blue" | "orange" | "purple" | "green" | "red";
  dateCompleted: string;
  paymentStatus: string;
  report: string;
  rawData: string;
}

export interface SpecimenDetail {
  id: string;
  specimenId: string;
  associatedOrder: string;
  requisitionNumber: string;
  specimenType: string;
  status: "Draft" | "Submitted" | "Processing" | "Completed";
  collectionDate: string;
  collectedBy: string;
  priorityLevel: string;
  location: string;
  volume: string;
  concentration: string;
  attachments: Array<{
    id: string;
    name: string;
    category: string;
    size: string;
  }>;
}

export interface SpecimensPageData {
  specimens: Specimen[];
}

// Specimens Data
export const specimensData: SpecimensPageData = {
  specimens: [
    {
      id: "F678",
      requisitionNumber: "3247601",
      protocolType: "Immunohistochemistry",
      turnaround: "72 hours",
      processingStatus: "Received",
      processingStatusColor: "blue",
      dateCompleted: "20-02-2024",
      paymentStatus: "Processing",
      report: "--",
      rawData: "--"
    },
    {
      id: "E345",
      requisitionNumber: "3247603",
      protocolType: "Flow Cytometry",
      turnaround: "24 hours",
      processingStatus: "Pending",
      processingStatusColor: "orange",
      dateCompleted: "25-02-2024",
      paymentStatus: "Processing",
      report: "--",
      rawData: "--"
    },
    {
      id: "C789",
      requisitionNumber: "3247604",
      protocolType: "Western Blot",
      turnaround: "48 hours",
      processingStatus: "In Progress",
      processingStatusColor: "purple",
      dateCompleted: "26-02-2024",
      paymentStatus: "Processing",
      report: "--",
      rawData: "--"
    },
    {
      id: "B456",
      requisitionNumber: "3247602",
      protocolType: "PCR Analysis",
      turnaround: "36 hours",
      processingStatus: "Completed",
      processingStatusColor: "green",
      dateCompleted: "21-02-2024",
      paymentStatus: "Processing",
      report: "--",
      rawData: "--"
    },
    {
      id: "D012",
      requisitionNumber: "3247605",
      protocolType: "ELISA Assay",
      turnaround: "60 hours",
      processingStatus: "Scheduled",
      processingStatusColor: "blue",
      dateCompleted: "27-02-2024",
      paymentStatus: "Processing",
      report: "--",
      rawData: "--"
    },
    {
      id: "A123",
      requisitionNumber: "3247606",
      protocolType: "Mass Spectrometry",
      turnaround: "12 hours",
      processingStatus: "Delayed",
      processingStatusColor: "red",
      dateCompleted: "28-02-2024",
      paymentStatus: "Processing",
      report: "--",
      rawData: "--"
    },
    {
      id: "G901",
      requisitionNumber: "3247607",
      protocolType: "Microarray Analysis",
      turnaround: "72 hours",
      processingStatus: "Processing",
      processingStatusColor: "purple",
      dateCompleted: "01-03-2024",
      paymentStatus: "Processing",
      report: "--",
      rawData: "--"
    }
  ]
};

// Get specimen detail by ID
export const getSpecimenDetail = (id: string): SpecimenDetail | undefined => {
  const specimenDetailsMap: Record<string, SpecimenDetail> = {
    "F678": {
      id: "F678",
      specimenId: "24-311-0001",
      associatedOrder: "ORD-2025-001",
      requisitionNumber: "EJw.JKB",
      specimenType: "Direct RNA Sequencing",
      status: "Draft",
      collectionDate: "2025-03-15 09:30 AM",
      collectedBy: "Dr. Jane Smith",
      priorityLevel: "High",
      location: "Lab A, Shelf 3",
      volume: "5 mL",
      concentration: "1.2 mg/mL",
      attachments: [
        {
          id: "att-1",
          name: "Sample001_DNA_Sequence.ab1",
          category: "DNA Sequencing",
          size: "500 KB"
        }
      ]
    }
  };

  return specimenDetailsMap[id];
};
