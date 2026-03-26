import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MapSpecimenFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mappedSamples: any[]) => void;
  uploadedData: { headers: string[]; rows: string[][] };
}

const specimenFields = [
  { key: "sampleId", label: "Sample ID" },
  { key: "sourceSpecies", label: "Source Species" },
  { key: "specimenType", label: "Specimen Type" },
  { key: "nucleicAcid", label: "Nucleic Acid" },
  { key: "extractionKit", label: "Extraction Kit" },
  { key: "elutionMedium", label: "Elution Medium" },
  { key: "concentration", label: "Concentration" },
  { key: "volume", label: "Volume" },
  { key: "note", label: "Note" },
];

export default function MapSpecimenFieldsModal({
  isOpen,
  onClose,
  onConfirm,
  uploadedData,
}: MapSpecimenFieldsModalProps) {
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && uploadedData.headers.length > 0) {
      // Auto-map fields based on header name similarity
      const autoMappings: Record<string, string> = {};
      specimenFields.forEach((field) => {
        const matchingHeader = uploadedData.headers.find((header) => {
          const headerLower = header.toLowerCase();
          const fieldLower = field.label.toLowerCase();
          return (
            headerLower.includes(fieldLower) ||
            fieldLower.includes(headerLower) ||
            headerLower === field.key.toLowerCase()
          );
        });
        if (matchingHeader) {
          autoMappings[field.key] = matchingHeader;
        }
      });
      setFieldMappings(autoMappings);
    }
  }, [isOpen, uploadedData.headers]);

  const handleMappingChange = (fieldKey: string, headerValue: string) => {
    setFieldMappings((prev: Record<string, string>) => ({
      ...prev,
      [fieldKey]: headerValue === "" ? "" : headerValue,
    }));
  };

  const handleConfirm = () => {
    // Map the data based on field mappings
    const mappedSamples = uploadedData.rows.map((row, rowIndex) => {
      const sample: any = {
        id: `sample-${Date.now()}-${rowIndex}`,
      };

      specimenFields.forEach((field) => {
        const mappedHeader = fieldMappings[field.key];
        if (mappedHeader) {
          const headerIndex = uploadedData.headers.indexOf(mappedHeader);
          if (headerIndex >= 0 && row[headerIndex] !== undefined) {
            sample[field.key] = row[headerIndex] || "";
          } else {
            sample[field.key] = "";
          }
        } else {
          sample[field.key] = "";
        }
      });

      return sample;
    });

    onConfirm(mappedSamples);
    onClose();
  };

  // Get example data (first 2 rows)
  const exampleRows = uploadedData.rows.slice(0, 2);

  return (
    <AnimatePresence>
    {isOpen && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="wasatch-app font-wasatch-sans relative mx-4 my-8 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-wasatch-md bg-wasatch-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Modal Header */}
        <div className="border-b border-wasatch-border px-wasatch-6 py-wasatch-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-6 rounded-wasatch-sm p-wasatch-2 text-wasatch-text-placeholder transition-colors hover:bg-wasatch-neutral-100 hover:text-wasatch-text-secondary cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <h2 className="text-wasatch-2xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-1">
            Map Specimen Fields
          </h2>
          <p className="text-wasatch-sm text-wasatch-text-secondary">
            Add a specimen to the current order type
          </p>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto px-wasatch-6 py-wasatch-6 flex-1">
          <div className="border border-wasatch-border rounded-wasatch-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-wasatch-surface-subtle border-b border-wasatch-border">
                  <tr>
                    <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[25%]">
                      Fields
                    </th>
                    <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[35%]">
                      Example Data
                    </th>
                    <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[40%]">
                      Template Columns
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wasatch-border">
                  {specimenFields.map((field) => {
                    const mappedHeader = fieldMappings[field.key];
                    const exampleValues = exampleRows
                      .map((row) => {
                        if (mappedHeader) {
                          const headerIndex = uploadedData.headers.indexOf(mappedHeader);
                          return headerIndex >= 0 ? row[headerIndex] : "";
                        }
                        return "";
                      })
                      .filter((val) => val !== "");

                    return (
                      <tr key={field.key} className="hover:bg-wasatch-surface-subtle">
                        <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading">
                          {field.label}
                        </td>
                        <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                          {exampleValues.length > 0 ? (
                            <div className="space-y-wasatch-1">
                              {exampleValues.map((val, idx) => (
                                <div key={idx} className="text-xs">
                                  {val}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-wasatch-text-placeholder text-wasatch-xs">No data</span>
                          )}
                        </td>
                        <td className="px-wasatch-4 py-wasatch-3">
                          <select
                            value={mappedHeader || ""}
                            onChange={(e) =>
                              handleMappingChange(field.key, e.target.value)
                            }
                            className="w-full text-wasatch-sm border border-wasatch-border-strong rounded-wasatch-sm px-wasatch-3 py-wasatch-2 focus:border-wasatch-accent focus:outline-none focus:ring-1 focus:ring-wasatch-accent"
                          >
                            <option value="">Select field</option>
                            {uploadedData.headers.map((header) => (
                              <option key={header} value={header}>
                                {header}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-wasatch-border px-wasatch-6 py-wasatch-4">
          <button
            onClick={onClose}
            className="rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-wasatch-sm bg-wasatch-accent px-wasatch-6 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse transition-colors hover:bg-wasatch-accent-hover cursor-pointer"
          >
            Add Template Columns
          </button>
        </div>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}

