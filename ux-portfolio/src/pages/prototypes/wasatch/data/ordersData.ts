// Types for Orders Data
export interface Order {
  id: string;
  orderNumber: string;
  company: string;
  orderStatus: string;
  orderStatusColor: "blue" | "orange" | "purple" | "green" | "red" | "yellow";
  type: string;
  specimen: string;
  paymentStatus: string;
  dateCreated: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  orderStatus: string;
  orderDate: string;
  totalItems: number;
  accountInfo: {
    company: string;
    createdBy: string;
  };
  shipping: {
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    cityStateZip: string;
  };
  billing: {
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    cityStateZip: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    totalBatches: number;
    totalSamples: number;
    image: string;
  }>;
}

export interface OrdersPageData {
  orders: Order[];
}

// Orders Data - matching the specimens and order types
export const ordersData: OrdersPageData = {
  orders: [
    {
      id: "F678",
      orderNumber: "F678",
      company: "Company",
      orderStatus: "Received",
      orderStatusColor: "blue",
      type: "Gene Sequencing",
      specimen: "Blood",
      paymentStatus: "Paid",
      dateCreated: "12/15/2024"
    },
    {
      id: "E345",
      orderNumber: "E345",
      company: "Company",
      orderStatus: "Pending",
      orderStatusColor: "orange",
      type: "Tissue Analysis",
      specimen: "Tissue",
      paymentStatus: "Pending",
      dateCreated: "11/28/2024"
    },
    {
      id: "C789",
      orderNumber: "C789",
      company: "Company",
      orderStatus: "In Progress",
      orderStatusColor: "purple",
      type: "DNA Extraction",
      specimen: "Saliva",
      paymentStatus: "Partially Paid",
      dateCreated: "11/19/2024"
    },
    {
      id: "B456",
      orderNumber: "B456",
      company: "Company",
      orderStatus: "Completed",
      orderStatusColor: "green",
      type: "Protein Profiling",
      specimen: "Serum",
      paymentStatus: "Paid",
      dateCreated: "11/11/2024"
    },
    {
      id: "D012",
      orderNumber: "D012",
      company: "Company",
      orderStatus: "Scheduled",
      orderStatusColor: "blue",
      type: "Pathology Testing",
      specimen: "Biopsy",
      paymentStatus: "Pending",
      dateCreated: "11/09/2024"
    },
    {
      id: "A123",
      orderNumber: "A123",
      company: "Company",
      orderStatus: "Delayed",
      orderStatusColor: "red",
      type: "Gene Sequencing",
      specimen: "Blood",
      paymentStatus: "Overdue",
      dateCreated: "10/30/2024"
    },
    {
      id: "G901",
      orderNumber: "G901",
      company: "Company",
      orderStatus: "In Progress",
      orderStatusColor: "purple",
      type: "Metabolite Analysis",
      specimen: "Urine",
      paymentStatus: "Pending",
      dateCreated: "10/17/2024"
    }
  ]
};

// Get order detail by ID
export const getOrderDetail = (id: string): OrderDetail | undefined => {
  const orderDetailsMap: Record<string, OrderDetail> = {
    "F678": {
      id: "F678",
      orderNumber: "24-311-0001",
      orderStatus: "Received",
      orderDate: "12/15/2024",
      totalItems: 2,
      accountInfo: {
        company: "Account Name",
        createdBy: "Jane Smith"
      },
      shipping: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      billing: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      items: [
        {
          id: "item-1",
          name: "Direct RNA Sequencing",
          quantity: 1,
          totalBatches: 3,
          totalSamples: 100,
          image: "rna-sequencing"
        },
        {
          id: "item-2",
          name: "Direct RNA Sequencing",
          quantity: 1,
          totalBatches: 3,
          totalSamples: 100,
          image: "rna-sequencing"
        }
      ]
    },
    "E345": {
      id: "E345",
      orderNumber: "24-311-0002",
      orderStatus: "Pending",
      orderDate: "11/28/2024",
      totalItems: 1,
      accountInfo: {
        company: "Account Name",
        createdBy: "John Doe"
      },
      shipping: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      billing: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      items: [
        {
          id: "item-1",
          name: "Targeted DNA Methylation Sequencing",
          quantity: 1,
          totalBatches: 2,
          totalSamples: 50,
          image: "rna-sequencing"
        }
      ]
    },
    "C789": {
      id: "C789",
      orderNumber: "24-311-0003",
      orderStatus: "In Progress",
      orderDate: "11/19/2024",
      totalItems: 1,
      accountInfo: {
        company: "Account Name",
        createdBy: "Sarah Johnson"
      },
      shipping: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      billing: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      items: [
        {
          id: "item-1",
          name: "PCR Amplicon Sequencing",
          quantity: 1,
          totalBatches: 4,
          totalSamples: 75,
          image: "rna-sequencing"
        }
      ]
    },
    "B456": {
      id: "B456",
      orderNumber: "24-311-0004",
      orderStatus: "Completed",
      orderDate: "11/11/2024",
      totalItems: 2,
      accountInfo: {
        company: "Account Name",
        createdBy: "Michael Brown"
      },
      shipping: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      billing: {
        companyName: "Company Name",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        cityStateZip: "City, State Zip Code"
      },
      items: [
        {
          id: "item-1",
          name: "Whole Genome Sequencing",
          quantity: 1,
          totalBatches: 5,
          totalSamples: 120,
          image: "rna-sequencing"
        },
        {
          id: "item-2",
          name: "PCR cDNA Sequencing",
          quantity: 1,
          totalBatches: 3,
          totalSamples: 80,
          image: "rna-sequencing"
        }
      ]
    }
  };

  return orderDetailsMap[id];
};
