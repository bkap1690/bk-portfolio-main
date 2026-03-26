import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { orderTypes } from "../data/orderTypes";
import type { OrderSamples, SampleRow } from "./SampleDetailsStep";

interface PlateWell {
  row: string; // A-H
  col: number; // 1-12
  position: string; // A1, A2, etc.
  sample: SampleRow | null;
  isAutoPlaced: boolean;
  isEdited: boolean;
  sourceRowIndex: number | null; // Index in the source samples array
}

interface GenomicPositioningStepProps {
  selectedOrderTypeIds: string[];
  orderSamples: OrderSamples;
  onPlateLayoutChange?: (layout: PlateLayout) => void;
}

export interface PlateLayout {
  [orderTypeId: string]: {
    wells: { [position: string]: PlateWell };
    validationStatus: "success" | "warning" | "error";
    validationMessage: string;
  };
}

export default function GenomicPositioningStep({
  selectedOrderTypeIds,
  orderSamples,
  onPlateLayoutChange,
}: GenomicPositioningStepProps) {
  const [activeOrderTab, setActiveOrderTab] = useState(selectedOrderTypeIds[0] || "");
  const [showSourceDrawer, setShowSourceDrawer] = useState(false);
  const [selectedWell, setSelectedWell] = useState<string | null>(null);
  const [selectedSourceRow, setSelectedSourceRow] = useState<number | null>(null);
  const [hoveredWell, setHoveredWell] = useState<string | null>(null);
  const [plateLayouts, setPlateLayouts] = useState<PlateLayout>({});
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const sourcePanelRef = useRef<HTMLDivElement>(null);
  const plateContainerRef = useRef<HTMLDivElement>(null);

  const currentSamples = orderSamples[activeOrderTab] || [];

  // Get order type name by id
  const getOrderTypeName = (id: string) => {
    const orderType = orderTypes.find((ot) => ot.id === id);
    return orderType?.name || id;
  };

  // Generate plate rows (A-H) and columns (1-12)
  const plateRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const plateCols = Array.from({ length: 12 }, (_, i) => i + 1);

  // Auto-place samples when orderSamples change
  useEffect(() => {
    const newLayouts: PlateLayout = {};
    
    selectedOrderTypeIds.forEach((orderTypeId) => {
      const samples = orderSamples[orderTypeId] || [];
      const wells: { [position: string]: PlateWell } = {};
      
      // Initialize all wells as empty
      plateRows.forEach((row) => {
        plateCols.forEach((col) => {
          const position = `${row}${col}`;
          wells[position] = {
            row,
            col,
            position,
            sample: null,
            isAutoPlaced: false,
            isEdited: false,
            sourceRowIndex: null,
          };
        });
      });

      // Auto-place samples sequentially (row by row, left to right)
      samples.forEach((sample, index) => {
        const rowIndex = Math.floor(index / 12);
        const colIndex = index % 12;
        
        if (rowIndex < plateRows.length && colIndex < plateCols.length) {
          const row = plateRows[rowIndex];
          const col = plateCols[colIndex];
          const position = `${row}${col}`;
          
          wells[position] = {
            row,
            col,
            position,
            sample,
            isAutoPlaced: true,
            isEdited: false,
            sourceRowIndex: index,
          };
        }
      });

      // Determine validation status
      const placedCount = samples.filter((_, idx) => {
        const rowIndex = Math.floor(idx / 12);
        return rowIndex < plateRows.length;
      }).length;
      
      const totalSamples = samples.length;
      let validationStatus: "success" | "warning" | "error" = "success";
      let validationMessage = "";

      if (totalSamples === 0) {
        validationStatus = "warning";
        validationMessage = "No samples to place";
      } else if (placedCount < totalSamples) {
        validationStatus = "error";
        validationMessage = `${totalSamples - placedCount} samples could not be placed (plate full)`;
      } else {
        validationStatus = "success";
        validationMessage = `All ${totalSamples} samples placed successfully`;
      }

      newLayouts[orderTypeId] = {
        wells,
        validationStatus,
        validationMessage,
      };
    });

    setPlateLayouts(newLayouts);
    onPlateLayoutChange?.(newLayouts);
  }, [orderSamples, selectedOrderTypeIds]);

  // Handle well click
  const handleWellClick = (position: string) => {
    const layout = plateLayouts[activeOrderTab];
    if (!layout) return;

    const well = layout.wells[position];
    if (well?.sample) {
      // Toggle selection if clicking the same well
      if (selectedWell === position) {
        setSelectedWell(null);
        setSelectedSourceRow(null);
      } else {
        setSelectedWell(position);
        
        if (well.sourceRowIndex !== null) {
          setSelectedSourceRow(well.sourceRowIndex);
          // Scroll to row in source drawer if open
          if (showSourceDrawer) {
            setTimeout(() => {
              const rowElement = sourcePanelRef.current?.querySelector(
                `[data-row-index="${well.sourceRowIndex}"]`
              );
              rowElement?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
          }
        }
      }
    } else {
      setSelectedWell(null);
      setSelectedSourceRow(null);
    }
  };

  // Handle source row click
  const handleSourceRowClick = (rowIndex: number) => {
    setSelectedSourceRow(rowIndex);
    const layout = plateLayouts[activeOrderTab];
    if (!layout) return;

    // Find well containing this sample
    const well = Object.values(layout.wells).find(
      (w) => w.sourceRowIndex === rowIndex
    );
    if (well) {
      setSelectedWell(well.position);
    }
  };

  const currentLayout = plateLayouts[activeOrderTab];
  const totalSamples = currentSamples.length;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-2">
          Plate Preview
        </h2>
        <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-4">
          When prepping samples for shipment, please ensure samples are loaded to match the following plate layout. Plate positions can also be found on your order page.
        </p>

        {/* Helper text with source data link */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-wasatch-sm text-wasatch-text-secondary">
            {totalSamples} {totalSamples === 1 ? "sample" : "samples"} loaded from Sample Details
          </span>
          <button
            onClick={() => setShowSourceDrawer(!showSourceDrawer)}
            className="text-sm text-wasatch-accent hover:text-wasatch-accent-hover underline cursor-pointer"
          >
            View source data
          </button>
        </div>

        {/* Validation Message */}
        {currentLayout && (
          <div
            className={`flex items-center gap-2 mb-6 px-4 py-3 rounded-wasatch-sm ${
              currentLayout.validationStatus === "success"
                ? "bg-wasatch-accent/10 border border-wasatch-accent/30"
                : currentLayout.validationStatus === "warning"
                ? "bg-wasatch-status-warning-bg border border-wasatch-status-warning-border"
                : "bg-wasatch-status-error-bg border border-wasatch-status-error-border"
            }`}
          >
            {currentLayout.validationStatus === "success" ? (
              <CheckCircle2 size={20} className="text-wasatch-accent" />
            ) : (
              <AlertCircle size={20} className={currentLayout.validationStatus === "error" ? "text-wasatch-status-error" : "text-wasatch-status-warning"} />
            )}
            <span
              className={`text-sm font-medium ${
                currentLayout.validationStatus === "success"
                  ? "text-wasatch-accent-hover"
                  : currentLayout.validationStatus === "error"
                  ? "text-wasatch-status-error"
                  : "text-wasatch-status-warning"
              }`}
            >
              {currentLayout.validationMessage}
            </span>
          </div>
        )}
      </div>

      {/* Order Tabs */}
      <div className="flex items-center gap-wasatch-6 border-b border-wasatch-border">
        {selectedOrderTypeIds.map((orderTypeId, index) => (
          <button
            key={orderTypeId}
            onClick={() => {
              setActiveOrderTab(orderTypeId);
              setSelectedWell(null);
              setSelectedSourceRow(null);
            }}
            className={`pb-3 text-sm transition-colors ${
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
      </div>

      {/* Main Content Area - Plate Layout and Source Data */}
      <div className="flex gap-6 w-full min-h-[600px] relative overflow-hidden">
        {/* Plate Layout Container */}
        <motion.div
          className="relative min-w-0"
          ref={plateContainerRef}
          initial={{ width: "100%" }}
          animate={{
            width: showSourceDrawer
              ? "calc(100% - 24rem - 1.5rem)"
              : "100%",
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ flexShrink: 0 }}
        >
          {currentLayout && (
            <div 
              className="bg-wasatch-surface border border-wasatch-border rounded-wasatch-md p-wasatch-8 h-full min-h-[600px] w-full"
              onMouseLeave={() => {
                setHoveredWell(null);
                setTooltipPosition(null);
              }}
            >
            <div className="w-full h-full flex flex-col">
              {/* Column Headers */}
              <div className="flex mb-3">
                <div className="w-16 flex-shrink-0"></div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {plateCols.map((col) => (
                    <div
                      key={col}
                      className="text-center text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary"
                    >
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* Plate Wells */}
              <div className="flex flex-col gap-1">
                {plateRows.map((row) => (
                  <div key={row} className="flex items-center h-fit gap-4">
                    {/* Row Label */}
                    <div className="w-16 flex-shrink-0 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary text-center">
                      {row}
                    </div>

                    {/* Wells */}
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      {plateCols.map((col) => {
                        const position = `${row}${col}`;
                        const well = currentLayout.wells[position];
                        const hasSample = well?.sample !== null;
                        const isSelected = selectedWell === position;
                        const isHovered = hoveredWell === position;

                        return (
                          <div
                            key={position}
                            onClick={() => handleWellClick(position)}
                            onMouseEnter={(e) => {
                              if (hasSample) {
                                setHoveredWell(position);
                                const rect = e.currentTarget.getBoundingClientRect();
                                const containerRect = plateContainerRef.current?.getBoundingClientRect();
                                if (containerRect) {
                                  setTooltipPosition({
                                    x: rect.right - containerRect.left + 10,
                                    y: rect.top - containerRect.top,
                                  });
                                }
                              }
                            }}
                            className={`aspect-square border-2 rounded transition-all cursor-pointer flex flex-col items-center justify-center p-1 ${
                              hasSample
                                ? isSelected
                                  ? "border-wasatch-accent-hover bg-wasatch-accent/10 shadow-md"
                                  : isHovered
                                  ? "border-wasatch-accent bg-wasatch-accent/10"
                                  : well?.isEdited
                                  ? "border-wasatch-status-warning bg-wasatch-status-warning-bg"
                                  : "border-wasatch-accent/50 bg-wasatch-accent/10"
                                : "border-wasatch-border bg-wasatch-surface-subtle opacity-40"
                            }`}
                          >
                            {hasSample ? (
                              <>
                                <div className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading truncate w-full text-center leading-tight">
                                  {well.sample?.sampleId || "—"}
                                </div>
                                <div className="text-[10px] text-wasatch-text-muted mt-0.5">
                                  {position}
                                </div>
                                {well.isEdited && (
                                  <div className="text-[9px] text-wasatch-status-warning font-wasatch-medium mt-0.5">
                                    Edited
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-[10px] text-wasatch-text-placeholder">
                                {position}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tooltip (shown on hover only) */}
        {hoveredWell && currentLayout && tooltipPosition && (
          <div
            className="absolute z-50 bg-wasatch-surface border border-wasatch-border rounded-wasatch-md shadow-lg p-4 min-w-[280px] pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            {(() => {
              const well = currentLayout.wells[hoveredWell];
              if (!well?.sample) return null;

              return (
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-wasatch-text-heading">
                        {well.sample.sampleId || "—"}
                      </div>
                      <div className="text-wasatch-xs text-wasatch-text-muted mt-0.5">
                        Well {hoveredWell}
                      </div>
                    </div>
                    {well.isEdited && (
                      <span className="text-wasatch-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                        Edited
                      </span>
                    )}
                  </div>
                  <div className="border-t border-wasatch-border pt-2 space-y-1.5">
                    <div className="flex justify-between text-wasatch-xs">
                      <span className="text-wasatch-text-muted">Species:</span>
                      <span className="text-wasatch-text-heading">{well.sample.sourceSpecies || "—"}</span>
                    </div>
                    <div className="flex justify-between text-wasatch-xs">
                      <span className="text-wasatch-text-muted">Specimen Type:</span>
                      <span className="text-wasatch-text-heading">{well.sample.specimenType || "—"}</span>
                    </div>
                    <div className="flex justify-between text-wasatch-xs">
                      <span className="text-wasatch-text-muted">Nucleic Acid:</span>
                      <span className="text-wasatch-text-heading">{well.sample.nucleicAcid || "—"}</span>
                    </div>
                    <div className="flex justify-between text-wasatch-xs">
                      <span className="text-wasatch-text-muted">Concentration:</span>
                      <span className="text-wasatch-text-heading">
                        {well.sample.concentration || "—"} {well.sample.concentration && "ng/μl"}
                      </span>
                    </div>
                    <div className="flex justify-between text-wasatch-xs">
                      <span className="text-wasatch-text-muted">Volume:</span>
                      <span className="text-wasatch-text-heading">
                        {well.sample.volume || "—"} {well.sample.volume && "μl"}
                      </span>
                    </div>
                    <div className="flex justify-between text-wasatch-xs pt-1 border-t border-wasatch-neutral-100">
                      <span className="text-wasatch-text-muted">Source:</span>
                      <span className="text-wasatch-text-secondary">
                        From Sample Details, row {well.sourceRowIndex !== null ? well.sourceRowIndex + 1 : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        </motion.div>

        {/* Source Data Panel - Slides in from right */}
        <AnimatePresence>
          {showSourceDrawer && (
            <motion.div 
              className="flex-shrink-0 w-96 overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
          <div className="bg-wasatch-surface border border-wasatch-border rounded-wasatch-md shadow-lg h-full min-h-[600px] flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-wasatch-6 border-b border-wasatch-border">
              <h3 className="text-lg font-medium text-wasatch-text-heading">Source Data</h3>
              <button
                onClick={() => setShowSourceDrawer(false)}
                className="text-wasatch-text-placeholder hover:text-wasatch-text-secondary cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel Content */}
            <div
              ref={sourcePanelRef}
              className="flex-1 overflow-y-auto"
            >
              {currentSamples.length === 0 ? (
                <div className="p-8 text-center text-sm text-wasatch-text-muted">
                  No samples available
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-wasatch-surface-subtle sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-wasatch-xs font-medium text-wasatch-text-secondary">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-wasatch-xs font-medium text-wasatch-text-secondary">
                        Sample ID
                      </th>
                      <th className="px-4 py-3 text-left text-wasatch-xs font-medium text-wasatch-text-secondary">
                        Species
                      </th>
                      <th className="px-4 py-3 text-left text-wasatch-xs font-medium text-wasatch-text-secondary">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentSamples.map((sample, index) => {
                      const isSelected = selectedSourceRow === index;

                      return (
                        <tr
                          key={sample.id}
                          data-row-index={index}
                          onClick={() => handleSourceRowClick(index)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-wasatch-accent/10 border-l-4 border-wasatch-accent"
                              : "hover:bg-wasatch-surface-subtle"
                          }`}
                        >
                          <td className="px-4 py-3 text-wasatch-text-secondary">{index + 1}</td>
                          <td className="px-4 py-3 font-medium text-wasatch-text-heading">
                            {sample.sampleId || "—"}
                          </td>
                          <td className="px-4 py-3 text-wasatch-text-secondary">
                            {sample.sourceSpecies || "—"}
                          </td>
                          <td className="px-4 py-3 text-wasatch-text-secondary">
                            {sample.specimenType || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
