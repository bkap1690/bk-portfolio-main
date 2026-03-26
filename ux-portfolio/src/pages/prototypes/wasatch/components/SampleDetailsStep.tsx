import { useState, useRef, useEffect } from "react";
import { Plus, Upload, Download, Trash2 } from "lucide-react";
import { orderTypes } from "../data/orderTypes";
import MapSpecimenFieldsModal from "./MapSpecimenFieldsModal";

export interface SampleRow {
  id: string;
  sampleId: string;
  sourceSpecies: string;
  specimenType: string;
  nucleicAcid: string;
  extractionKit: string;
  elutionMedium: string;
  concentration: string;
  volume: string;
  note: string;
}

export interface OrderSamples {
  [orderTypeId: string]: SampleRow[];
}

interface SampleDetailsStepProps {
  selectedOrderTypeIds: string[];
  orderSamples: OrderSamples;
  onOrderSamplesChange: (samples: OrderSamples) => void;
}

export default function SampleDetailsStep({
  selectedOrderTypeIds,
  orderSamples,
  onOrderSamplesChange,
}: SampleDetailsStepProps) {
  const [activeOrderTab, setActiveOrderTab] = useState(selectedOrderTypeIds[0] || "");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [uploadedData, setUploadedData] = useState<{ headers: string[]; rows: string[][] }>({
    headers: [],
    rows: [],
  });
  const [isDragging, setIsDragging] = useState(false);
  const [hasManualAddInitiated, setHasManualAddInitiated] = useState(false);
  const [isInlineRowActive, setIsInlineRowActive] = useState(false);
  const [inlineRowData, setInlineRowData] = useState<Partial<SampleRow>>({});
  const [isHoveringInlineRow, setIsHoveringInlineRow] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null); // Format: "sampleId-fieldName"
  const [hoveredField, setHoveredField] = useState<string | null>(null); // Format: "sampleId-fieldName"
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null); // Track which row is being hovered
  const [tableScrolled, setTableScrolled] = useState(false); // Track if table is scrolled
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [originalFieldValue, setOriginalFieldValue] = useState<string>(""); // Track original value when editing starts
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineRowRef = useRef<HTMLTableRowElement>(null);
  const tableScrollContainerRef = useRef<HTMLDivElement>(null);

  // Get order type name by id
  const getOrderTypeName = (id: string) => {
    const orderType = orderTypes.find((ot) => ot.id === id);
    return orderType?.name || id;
  };

  const currentSamples = orderSamples[activeOrderTab] || [];

  // Reset selected rows when switching tabs
  useEffect(() => {
    setSelectedRows(new Set());
    setHasManualAddInitiated((orderSamples[activeOrderTab] || []).length > 0);
    setIsInlineRowActive(false);
    setInlineRowData({});
    setEditingField(null);
    setHoveredField(null);
    setOriginalFieldValue("");
    setSaveStatus("idle");
  }, [activeOrderTab]);
  
  // Update hasManualAddInitiated when samples are added/removed (but don't reset editing state)
  useEffect(() => {
    setHasManualAddInitiated((orderSamples[activeOrderTab] || []).length > 0);
  }, [orderSamples, activeOrderTab]);

  // Track table scroll for header shadow
  useEffect(() => {
    const container = tableScrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setTableScrolled(container.scrollTop > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRowSelect = (sampleId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sampleId)) {
        newSet.delete(sampleId);
      } else {
        newSet.add(sampleId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentSamples.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentSamples.map((s) => s.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) return;
    
    // Clear editing field if deleted row was being edited
    const deletedIds = Array.from(selectedRows);
    if (editingField && deletedIds.some(id => editingField.startsWith(id))) {
      setEditingField(null);
    }
    
    onOrderSamplesChange({
      ...orderSamples,
      [activeOrderTab]: currentSamples.filter((sample) => !selectedRows.has(sample.id)),
    });
    setSelectedRows(new Set());
    setHoveredField(null);
  };

  const handleDeleteRow = (sampleId: string) => {
    // Clear editing field if deleted row was being edited
    if (editingField && editingField.startsWith(sampleId)) {
      setEditingField(null);
    }
    
    onOrderSamplesChange({
      ...orderSamples,
      [activeOrderTab]: currentSamples.filter((sample) => sample.id !== sampleId),
    });
    
    // Remove from selected rows if it was selected
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(sampleId);
      return newSet;
    });
    setHoveredField(null);
  };

  // Check if inline row is visible in table viewport
  const isInlineRowVisible = () => {
    if (!inlineRowRef.current || !tableScrollContainerRef.current) return false;
    
    const rowRect = inlineRowRef.current.getBoundingClientRect();
    const containerRect = tableScrollContainerRef.current.getBoundingClientRect();
    
    return (
      rowRect.top >= containerRect.top &&
      rowRect.bottom <= containerRect.bottom
    );
  };

  // Scroll table container to inline row
  const scrollToInlineRow = (focusInput = true) => {
    if (!inlineRowRef.current || !tableScrollContainerRef.current) return;
    
    const rowRect = inlineRowRef.current.getBoundingClientRect();
    const containerRect = tableScrollContainerRef.current.getBoundingClientRect();
    const containerScrollTop = tableScrollContainerRef.current.scrollTop;
    
    // Calculate relative position
    const rowTopRelativeToContainer = rowRect.top - containerRect.top + containerScrollTop;
    const rowBottomRelativeToContainer = rowRect.bottom - containerRect.top + containerScrollTop;
    const containerHeight = containerRect.height;
    
    // Check if row is already fully visible
    const isFullyVisible = 
      rowTopRelativeToContainer >= containerScrollTop &&
      rowBottomRelativeToContainer <= containerScrollTop + containerHeight;
    
    if (!isFullyVisible) {
      // Scroll to show the row at the bottom of the container
      const targetScroll = rowBottomRelativeToContainer - containerHeight + 20; // 20px padding
      tableScrollContainerRef.current.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
    
    if (focusInput) {
      setTimeout(() => {
        const firstInput = inlineRowRef.current?.querySelector('input[type="text"]') as HTMLInputElement;
        firstInput?.focus();
      }, 100);
    }
  };

  const handleAddSampleManually = () => {
    setHasManualAddInitiated(true);
    const wasAlreadyActive = isInlineRowActive;
    setIsInlineRowActive(true);
    setInlineRowData({});
    
    // Only scroll and focus if inline row wasn't already active or not visible
    setTimeout(() => {
      if (!wasAlreadyActive || !isInlineRowVisible()) {
        scrollToInlineRow(true);
      }
    }, 100);
  };

  const handleInlineRowClick = () => {
    if (!isInlineRowActive) {
      setIsInlineRowActive(true);
      setInlineRowData({});
      setTimeout(() => {
        // Only scroll if not already visible, otherwise just focus
        if (!isInlineRowVisible()) {
          scrollToInlineRow(true);
        } else {
          const firstInput = inlineRowRef.current?.querySelector('input[type="text"]') as HTMLInputElement;
          firstInput?.focus();
        }
      }, 0);
    }
  };

  const handleInlineRowFieldChange = (field: keyof Omit<SampleRow, "id">, value: string) => {
    setInlineRowData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveInlineRow = (keepActive = false) => {
    // Only save if at least sampleId is filled
    if (inlineRowData.sampleId?.trim()) {
      const newSample: SampleRow = {
        id: `sample-${Date.now()}`,
        sampleId: inlineRowData.sampleId || "",
        sourceSpecies: inlineRowData.sourceSpecies || "",
        specimenType: inlineRowData.specimenType || "",
        nucleicAcid: inlineRowData.nucleicAcid || "",
        extractionKit: inlineRowData.extractionKit || "",
        elutionMedium: inlineRowData.elutionMedium || "",
        concentration: inlineRowData.concentration || "",
        volume: inlineRowData.volume || "",
        note: inlineRowData.note || "",
      };
      onOrderSamplesChange({
        ...orderSamples,
        [activeOrderTab]: [...(orderSamples[activeOrderTab] || []), newSample],
      });
      setInlineRowData({});
      
      if (keepActive) {
        // Keep inline row active and scroll to it only if not already visible
        setTimeout(() => {
          if (!isInlineRowVisible()) {
            scrollToInlineRow(true);
          } else {
            // Just focus if already visible
            const firstInput = inlineRowRef.current?.querySelector('input[type="text"]') as HTMLInputElement;
            firstInput?.focus();
          }
        }, 100);
      } else {
        setIsInlineRowActive(false);
      }
    } else if (keepActive) {
      // If no data but keepActive is true, just activate the row
      setIsInlineRowActive(true);
      setTimeout(() => {
        if (!isInlineRowVisible()) {
          scrollToInlineRow(true);
        } else {
          const firstInput = inlineRowRef.current?.querySelector('input[type="text"]') as HTMLInputElement;
          firstInput?.focus();
        }
      }, 100);
    }
  };

  const handleInlineRowAddButtonClick = () => {
    // Save current row if it has data, then keep inline row active
    handleSaveInlineRow(true);
  };

  const handleInlineRowBlur = (e: React.FocusEvent) => {
    // Don't deactivate if focus is moving to another input in the same row or to the Add Specimen button
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && inlineRowRef.current?.contains(relatedTarget)) {
      return;
    }
    
    // Auto-save when user clicks away if data exists, but keep inline row active
    setTimeout(() => {
      if (inlineRowData.sampleId?.trim()) {
        handleSaveInlineRow(true);
      } else {
        // Only deactivate if no data and user clicked outside
        setIsInlineRowActive(false);
      }
    }, 200);
  };

  const getFieldKey = (sampleId: string, field: keyof Omit<SampleRow, "id">) => {
    return `${sampleId}-${field}`;
  };

  const isFieldEditable = (sampleId: string, field: keyof Omit<SampleRow, "id">) => {
    return editingField === getFieldKey(sampleId, field);
  };

  const isFieldHovered = (sampleId: string, field: keyof Omit<SampleRow, "id">) => {
    return hoveredField === getFieldKey(sampleId, field);
  };

  const handleFieldClick = (sampleId: string, field: keyof Omit<SampleRow, "id">, event?: React.MouseEvent<HTMLInputElement>) => {
    const fieldKey = getFieldKey(sampleId, field);
    setEditingField(fieldKey);
    // Store the original value when editing starts
    const sample = currentSamples.find((s) => s.id === sampleId);
    if (sample) {
      setOriginalFieldValue(sample[field] || "");
    }
    // Focus the input after a brief delay to ensure it's editable
    setTimeout(() => {
      if (event?.currentTarget) {
        event.currentTarget.focus();
        event.currentTarget.select();
      }
    }, 0);
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't blur if focus is moving to another input in the table
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.tagName === "INPUT" && tableScrollContainerRef.current?.contains(relatedTarget)) {
      // Focus is moving to another input, don't deactivate
      return;
    }
    
    // Check if the value actually changed before showing save status
    const currentValue = e.target.value;
    if (currentValue !== originalFieldValue) {
      // Value changed, show save status
      setSaveStatus("saving");
      setTimeout(() => {
        setSaveStatus("saved");
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      }, 300);
    }
    
    setEditingField(null);
    setHoveredField(null);
    setOriginalFieldValue("");
  };

  const handleFieldKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    sampleId: string,
    field: keyof Omit<SampleRow, "id">
  ) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      
      // Check if the value actually changed before showing save status
      const currentValue = e.currentTarget.value;
      if (currentValue !== originalFieldValue) {
        // Value changed, show save status
        setSaveStatus("saving");
        setTimeout(() => {
          setSaveStatus("saved");
          setTimeout(() => {
            setSaveStatus("idle");
          }, 2000);
        }, 300);
      }
      
      setEditingField(null);
      setHoveredField(null);
      setOriginalFieldValue("");
      
      // If Tab, move to next field
      if (e.key === "Tab" && !e.shiftKey) {
        const fields: (keyof Omit<SampleRow, "id">)[] = [
          "sampleId",
          "sourceSpecies",
          "specimenType",
          "nucleicAcid",
          "extractionKit",
          "elutionMedium",
          "concentration",
          "volume",
          "note",
        ];
        const currentIndex = fields.indexOf(field);
        if (currentIndex < fields.length - 1) {
          // Move to next field in same row
          setTimeout(() => {
            const nextFieldKey = getFieldKey(sampleId, fields[currentIndex + 1]);
            setEditingField(nextFieldKey);
            // Store original value for next field
            const sample = currentSamples.find((s) => s.id === sampleId);
            if (sample) {
              setOriginalFieldValue(sample[fields[currentIndex + 1]] || "");
            }
            const nextInput = document.querySelector(`input[data-field-key="${nextFieldKey}"]`) as HTMLInputElement;
            nextInput?.focus();
            nextInput?.select();
          }, 0);
        }
      }
    }
  };

  const handleSampleFieldChange = (
    sampleId: string,
    field: keyof Omit<SampleRow, "id">,
    value: string
  ) => {
    // Update the value without showing save status (that happens on blur)
    onOrderSamplesChange({
      ...orderSamples,
      [activeOrderTab]: (orderSamples[activeOrderTab] || []).map((sample) =>
        sample.id === sampleId ? { ...sample, [field]: value } : sample
      ),
    });
  };

  // Parse CSV file
  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    // Parse CSV line (handles quoted values)
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).map(parseLine);

    return { headers, rows };
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.headers.length > 0) {
        setUploadedData(parsed);
        setShowMappingModal(true);
      }
    };
    reader.readAsText(file);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      handleFileUpload(file);
    }
  };

  // Handle mapping confirmation
  const handleMappingConfirm = (mappedSamples: SampleRow[]) => {
    setHasManualAddInitiated(true);
    onOrderSamplesChange({
      ...orderSamples,
      [activeOrderTab]: [...(orderSamples[activeOrderTab] || []), ...mappedSamples],
    });
    setShowMappingModal(false);
    setUploadedData({ headers: [], rows: [] });
  };

  return (
    <div className="space-y-wasatch-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-2">
            Provide Specimen Details
          </h2>
          <p className="text-wasatch-sm text-wasatch-text-secondary">
            Enter information about your samples
          </p>
        </div>
      </div>

      {/* Order Tabs */}
      <div className="flex items-center gap-wasatch-6 border-b border-wasatch-border">
        {selectedOrderTypeIds.map((orderTypeId, index) => (
          <button
            key={orderTypeId}
            onClick={() => setActiveOrderTab(orderTypeId)}
            className={`pb-wasatch-3 text-wasatch-sm transition-colors ${
              activeOrderTab === orderTypeId
                ? "border-b-2 border-wasatch-text-heading font-wasatch-medium text-wasatch-text-heading"
                : "text-wasatch-text-muted hover:text-wasatch-text-secondary cursor-pointer"
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="text-wasatch-xs text-wasatch-text-placeholder mb-wasatch-1">Order {index + 1}</span>
              <span>{getOrderTypeName(orderTypeId)}</span>
            </div>
          </button>
        ))}
        <button className="flex items-center gap-wasatch-1 pb-wasatch-3 text-wasatch-sm text-wasatch-accent hover:text-wasatch-accent-hover cursor-pointer">
          <Plus size={16} />
          <span>Add order</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="border border-wasatch-border rounded-wasatch-md overflow-hidden">
        <div ref={tableScrollContainerRef} className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full min-w-[1000px]">
            {/* Table Header */}
            <thead
              className={`bg-wasatch-surface-subtle sticky top-0 z-10 transition-shadow ease-in-out duration-300 ${
                tableScrolled ? "shadow-md" : "border-b border-wasatch-border"
              }`}
            >
              <tr>
                <th className="px-2 py-3 text-center text-wasatch-xs font-medium text-wasatch-text-secondary w-[4%]">
                  <input
                    type="checkbox"
                    checked={currentSamples.length > 0 && selectedRows.size === currentSamples.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent cursor-pointer"
                  />
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[9%]">
                  Sample ID
                </th>
                <th className="px-4 py-3 text-left text-wasatch-xs font-medium text-wasatch-text-secondary w-[11%]">
                  Source Species
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[9%]">
                  Specimen Type
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[9%]">
                  Nucleic Acid
                </th>
                <th className="px-4 py-3 text-left text-wasatch-xs font-medium text-wasatch-text-secondary w-[9%]">
                  Extraction Kit
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[17%]">
                  Elution Medium (TE Buffer, or Water)
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[9%]">
                  Concentration (ng/μl)
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[7%]">
                  Volume (μl)
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary w-[11%]">
                  Note
                </th>
                <th className="px-2 py-3 text-center text-wasatch-xs font-medium text-wasatch-text-secondary w-[4%]">
                  {/* Actions column header - empty but maintains alignment */}
                </th>
              </tr>
              {/* Action Row - Sticky Header */}
              {hasManualAddInitiated && (
                <tr className="bg-wasatch-surface-subtle sticky top-[48px] z-10">
                  <td colSpan={11} className="px-wasatch-4 py-wasatch-2 bg-wasatch-surface-subtle">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-wasatch-4">
                        {saveStatus !== "idle" && (
                          <div className="flex items-center gap-wasatch-2 text-wasatch-sm">
                            {saveStatus === "saving" && (
                              <span className="text-wasatch-text-secondary">Saving...</span>
                            )}
                            {saveStatus === "saved" && (
                              <span className="text-wasatch-accent">Saved</span>
                            )}
                          </div>
                        )}
                        {selectedRows.size > 0 && (
                          <button
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-wasatch-2 px-wasatch-3 py-1.5 text-wasatch-sm font-wasatch-medium text-wasatch-status-error hover:bg-wasatch-status-error-bg rounded-wasatch-sm transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                            Delete Selected ({selectedRows.size})
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </thead>

            {/* Table Body / Empty State */}
            <tbody className="bg-wasatch-surface divide-y divide-wasatch-border">
              {currentSamples.length === 0 && !hasManualAddInitiated ? (
                /* Empty State Row */
                <tr>
                  <td colSpan={11} className="px-wasatch-6 py-wasatch-12">
                    <div className="flex items-center justify-center gap-wasatch-6">
                      {/* Add Manually Button */}
                      <button
                        onClick={handleAddSampleManually}
                        className="flex items-center gap-wasatch-2 px-wasatch-6 py-wasatch-3 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle transition-colors cursor-pointer"
                      >
                        <Plus size={18} />
                        Add Specimen Manually
                      </button>

                      {!hasManualAddInitiated && (
                        <>
                          <span className="text-wasatch-text-placeholder text-wasatch-sm">or</span>

                          {/* Upload Area */}
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-wasatch-md p-wasatch-6 text-center transition-colors cursor-pointer ${
                              isDragging
                                ? "border-wasatch-accent bg-wasatch-accent/10"
                                : "border-wasatch-border-strong hover:border-wasatch-neutral-400"
                            }`}
                          >
                            <div className="flex items-center gap-wasatch-2 text-wasatch-text-secondary mb-wasatch-2">
                              <Upload size={18} />
                              <span className="text-sm">Upload Specimen file</span>
                            </div>
                            <p className="text-wasatch-xs text-wasatch-text-placeholder">or drag to upload</p>
                          </div>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                /* Sample Rows */
                <>
                  {currentSamples.map((sample) => (
                    <tr 
                      key={sample.id} 
                      className="hover:bg-wasatch-surface-subtle"
                      onMouseEnter={() => setHoveredRowId(sample.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <td className="px-wasatch-2 py-wasatch-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(sample.id)}
                          onChange={() => handleRowSelect(sample.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded-wasatch-sm border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent cursor-pointer"
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.sampleId}
                          readOnly={!isFieldEditable(sample.id, "sampleId")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "sampleId", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "sampleId", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "sampleId")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "sampleId"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "sampleId")}
                          placeholder="Enter ID"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "sampleId")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "sampleId")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.sourceSpecies}
                          readOnly={!isFieldEditable(sample.id, "sourceSpecies")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "sourceSpecies", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "sourceSpecies", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "sourceSpecies")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "sourceSpecies"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "sourceSpecies")}
                          placeholder="Species"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "sourceSpecies")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "sourceSpecies")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.specimenType}
                          readOnly={!isFieldEditable(sample.id, "specimenType")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "specimenType", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "specimenType", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "specimenType")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "specimenType"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "specimenType")}
                          placeholder="Type"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "specimenType")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "specimenType")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.nucleicAcid}
                          readOnly={!isFieldEditable(sample.id, "nucleicAcid")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "nucleicAcid", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "nucleicAcid", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "nucleicAcid")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "nucleicAcid"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "nucleicAcid")}
                          placeholder="Nucleic Acid"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "nucleicAcid")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "nucleicAcid")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.extractionKit}
                          readOnly={!isFieldEditable(sample.id, "extractionKit")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "extractionKit", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "extractionKit", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "extractionKit")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "extractionKit"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "extractionKit")}
                          placeholder="Kit"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "extractionKit")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "extractionKit")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.elutionMedium}
                          readOnly={!isFieldEditable(sample.id, "elutionMedium")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "elutionMedium", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "elutionMedium", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "elutionMedium")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "elutionMedium"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "elutionMedium")}
                          placeholder="Medium"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "elutionMedium")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "elutionMedium")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.concentration}
                          readOnly={!isFieldEditable(sample.id, "concentration")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "concentration", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "concentration", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "concentration")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "concentration"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "concentration")}
                          placeholder="ng/μl"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "concentration")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "concentration")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.volume}
                          readOnly={!isFieldEditable(sample.id, "volume")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "volume", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "volume", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "volume")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "volume"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "volume")}
                          placeholder="μl"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "volume")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "volume")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-4 py-wasatch-3">
                        <input
                          type="text"
                          value={sample.note}
                          readOnly={!isFieldEditable(sample.id, "note")}
                          onChange={(e) =>
                            handleSampleFieldChange(sample.id, "note", e.target.value)
                          }
                          onClick={(e) => handleFieldClick(sample.id, "note", e)}
                          onKeyDown={(e) => handleFieldKeyDown(e, sample.id, "note")}
                          onMouseEnter={() => setHoveredField(getFieldKey(sample.id, "note"))}
                          onMouseLeave={() => setHoveredField(null)}
                          onBlur={handleFieldBlur}
                          data-field-key={getFieldKey(sample.id, "note")}
                          placeholder="Note"
                          className={`w-full text-sm border rounded pl-0.5 pr-0.5 py-1 transition-all ${
                            isFieldEditable(sample.id, "note")
                              ? "border-wasatch-accent bg-wasatch-surface focus:border-wasatch-accent focus:outline-none cursor-text"
                              : isFieldHovered(sample.id, "note")
                              ? "border-wasatch-border-strong bg-wasatch-surface-subtle cursor-pointer"
                              : "border-transparent bg-transparent cursor-default"
                          }`}
                        />
                      </td>
                      <td className="px-wasatch-2 py-wasatch-3 text-center w-[4%]">
                        {hoveredRowId === sample.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRow(sample.id);
                            }}
                            className="text-wasatch-status-error hover:text-wasatch-status-error transition-colors cursor-pointer"
                            title="Delete row"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Inline Add Row - Always visible when manual add is initiated */}
                  {hasManualAddInitiated && (
                    <tr
                      ref={inlineRowRef}
                      onClick={handleInlineRowClick}
                      onMouseEnter={() => setIsHoveringInlineRow(true)}
                      onMouseLeave={() => setIsHoveringInlineRow(false)}
                      className={`border-t-2 border-dashed border-wasatch-border-strong transition-colors ${
                        isInlineRowActive
                          ? "bg-wasatch-surface hover:bg-wasatch-surface"
                          : "bg-wasatch-surface-subtle hover:bg-wasatch-neutral-100 cursor-pointer"
                      }`}
                    >
                      <td className="px-wasatch-2 py-wasatch-3 text-center">
                        {isInlineRowActive ? (
                          <div className="w-4 h-4" />
                        ) : (
                          <div className="flex items-center justify-center">
                            {isHoveringInlineRow && (
                              <input
                                type="checkbox"
                                readOnly
                                checked={false}
                                className="h-4 w-4 rounded border-wasatch-border-strong text-wasatch-accent cursor-pointer"
                              />
                            )}
                          </div>
                        )}
                      </td>
                      {isInlineRowActive ? (
                        <>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.sampleId || ""}
                              onChange={(e) => handleInlineRowFieldChange("sampleId", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveInlineRow(true);
                                }
                              }}
                              placeholder="Enter ID"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                              autoFocus
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.sourceSpecies || ""}
                              onChange={(e) => handleInlineRowFieldChange("sourceSpecies", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="Species"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.specimenType || ""}
                              onChange={(e) => handleInlineRowFieldChange("specimenType", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="Type"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.nucleicAcid || ""}
                              onChange={(e) => handleInlineRowFieldChange("nucleicAcid", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="Nucleic Acid"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.extractionKit || ""}
                              onChange={(e) => handleInlineRowFieldChange("extractionKit", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="Kit"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.elutionMedium || ""}
                              onChange={(e) => handleInlineRowFieldChange("elutionMedium", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="Medium"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.concentration || ""}
                              onChange={(e) => handleInlineRowFieldChange("concentration", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="ng/μl"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.volume || ""}
                              onChange={(e) => handleInlineRowFieldChange("volume", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="μl"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-4 py-wasatch-3">
                            <input
                              type="text"
                              value={inlineRowData.note || ""}
                              onChange={(e) => handleInlineRowFieldChange("note", e.target.value)}
                              onBlur={handleInlineRowBlur}
                              placeholder="Note"
                              className="w-full text-wasatch-sm border border-wasatch-border rounded-wasatch-sm px-0 py-wasatch-1 focus:border-wasatch-accent focus:outline-none bg-wasatch-surface"
                            />
                          </td>
                          <td className="px-wasatch-2 py-wasatch-3 w-[4%]">
                            {/* Empty actions column for alignment */}
                          </td>
                        </>
                      ) : (
                        <td colSpan={11} className="px-wasatch-4 py-wasatch-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInlineRowAddButtonClick();
                            }}
                            className="flex items-center gap-wasatch-2 text-wasatch-text-muted hover:text-wasatch-text-secondary transition-colors"
                          >
                            <Plus size={16} />
                            <span className="text-wasatch-sm">Add Specimen</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Template Link */}
      <div>
        <a
          href="#"
          className="inline-flex items-center gap-wasatch-2 text-wasatch-sm text-wasatch-accent hover:text-wasatch-accent-hover"
        >
          <Download size={16} />
          Download Sample Submission Template (Excel)
        </a>
      </div>

      {/* Mapping Modal */}
      <MapSpecimenFieldsModal
        isOpen={showMappingModal}
        onClose={() => {
          setShowMappingModal(false);
          setUploadedData({ headers: [], rows: [] });
        }}
        onConfirm={handleMappingConfirm}
        uploadedData={uploadedData}
      />
    </div>
  );
}

