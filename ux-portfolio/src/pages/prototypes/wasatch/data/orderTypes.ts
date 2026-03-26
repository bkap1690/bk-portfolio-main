// Order Type Data Structure

export interface OrderType {
  id: string;
  name: string;
  description: string[];
}

export const orderTypes: OrderType[] = [
  {
    id: "direct-rna-sequencing",
    name: "Direct RNA Sequencing",
    description: [
      "Analyzes RNA molecules directly without cDNA synthesis or amplification.",
      "Provides insights into RNA modifications, structure, and abundance.",
      "Ideal for small-scale studies or independent researchers."
    ]
  },
  {
    id: "targeted-dna-methylation",
    name: "Targeted DNA Methylation Sequencing",
    description: [
      "Focuses on specific DNA regions to study methylation patterns.",
      "Useful for understanding epigenetic regulation and gene expression.",
      "Requires institutional or research affiliation for access."
    ]
  },
  {
    id: "pcr-amplicon-sequencing",
    name: "PCR Amplicon Sequencing",
    description: [
      "Amplifies specific DNA regions using PCR for sequencing.",
      "Detects genetic variations, mutations, or biodiversity.",
      "Recommended for institutional or academic users."
    ]
  },
  {
    id: "whole-genome-sequencing",
    name: "Whole Genome Sequencing",
    description: [
      "Provides a complete analysis of an organism's DNA sequence.",
      "Useful for studying genetic variations and evolutionary traits.",
      "Reserved for verified institutional or research users."
    ]
  },
  {
    id: "pcr-cdna-sequencing",
    name: "PCR cDNA Sequencing",
    description: [
      "Analyzes cDNA generated from RNA transcripts.",
      "Offers insights into gene expression and transcriptional activity.",
      "Best suited for institutional researchers or labs."
    ]
  }
];

