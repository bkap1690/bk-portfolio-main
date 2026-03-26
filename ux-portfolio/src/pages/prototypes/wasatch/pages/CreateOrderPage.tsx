import { useState, useEffect } from "react";
import OrderStepper from "../components/OrderStepper";
import type { Step } from "../components/OrderStepper";
import OrderTypeStep from "../components/OrderTypeStep";
import SampleDetailsStep, { type OrderSamples } from "../components/SampleDetailsStep";
import GenomicPositioningStep from "../components/GenomicPositioningStep";
import CheckoutStep from "../components/CheckoutStep";
import ReviewConfirmStep from "../components/ReviewConfirmStep";

interface CreateOrderPageProps {
  onCancel?: () => void;
}

const steps: Step[] = [
  { id: 1, label: "Order Type" },
  { id: 2, label: "Sample Details" },
  { id: 3, label: "Add Genomic Positions" },
  { id: 4, label: "Checkout" },
  { id: 5, label: "Review & Confirm" },
];

export default function CreateOrderPage({
  onCancel,
}: CreateOrderPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<Set<string>>(
    new Set()
  );
  const [orderSamples, setOrderSamples] = useState<OrderSamples>({});

  // Initialize orderSamples when selectedOrderTypes changes
  useEffect(() => {
    setOrderSamples((prev) => {
      const newOrderSamples: OrderSamples = { ...prev };
      let hasChanges = false;
      
      selectedOrderTypes.forEach((orderTypeId) => {
        if (!(orderTypeId in newOrderSamples)) {
          newOrderSamples[orderTypeId] = [];
          hasChanges = true;
        }
      });

      return hasChanges ? newOrderSamples : prev;
    });
  }, [selectedOrderTypes]);

  const handleOrderTypeToggle = (id: string) => {
    const newSelected = new Set(selectedOrderTypes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOrderTypes(newSelected);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleEditStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedOrderTypes.size > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-wasatch-surface pb-24" style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Main Content */}
      <div className="p-wasatch-12 w-full mx-auto">
        {/* Page Header */}
        <div className="mb-wasatch-8">
          <h1 className="text-wasatch-2xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-6">
            Create Order Request
          </h1>

          {/* Stepper */}
          <OrderStepper currentStep={currentStep} steps={steps} onStepClick={handleStepClick} />
        </div>

        {/* Page Content */}
        <div className="bg-wasatch-surface">
          {currentStep === 1 && (
            <OrderTypeStep
              selectedOrderTypes={selectedOrderTypes}
              onOrderTypeToggle={handleOrderTypeToggle}
            />
          )}

          {currentStep === 2 && (
            <SampleDetailsStep
              selectedOrderTypeIds={Array.from(selectedOrderTypes)}
              orderSamples={orderSamples}
              onOrderSamplesChange={setOrderSamples}
            />
          )}

          {currentStep === 3 && (
            <GenomicPositioningStep
              selectedOrderTypeIds={Array.from(selectedOrderTypes)}
              orderSamples={orderSamples}
            />
          )}

          {currentStep === 4 && (
            <CheckoutStep />
          )}

          {currentStep === 5 && (
            <ReviewConfirmStep
              selectedOrderTypeIds={Array.from(selectedOrderTypes)}
              orderSamples={orderSamples}
              onEditStep={handleEditStep}
            />
          )}
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-[250px] right-0 bg-wasatch-surface border-t border-wasatch-border px-wasatch-12 py-wasatch-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="rounded-wasatch-sm border border-wasatch-status-error-border bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-status-error transition-colors hover:bg-wasatch-status-error-bg cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex flex-col items-end gap-wasatch-2">
            {currentStep === 3 && (
              <p className="text-wasatch-xs text-wasatch-text-muted">
                This layout will be used for sample processing.
              </p>
            )}
            <div className="flex gap-wasatch-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`rounded-wasatch-sm px-wasatch-6 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse transition-colors ${
                  canProceed()
                    ? "bg-wasatch-accent hover:bg-wasatch-accent-hover cursor-pointer"
                    : "bg-wasatch-neutral-300 cursor-not-allowed"
                }`}
              >
                {currentStep === 1
                  ? "Add Samples"
                  : currentStep === 2
                  ? "Add samples"
                  : currentStep === 3
                  ? "Confirm Plate Layout"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

