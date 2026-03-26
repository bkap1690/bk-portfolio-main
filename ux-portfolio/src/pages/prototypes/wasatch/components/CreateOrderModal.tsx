import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import OrderStepper from "./OrderStepper";
import type { Step } from "./OrderStepper";
import OrderTypeStep from "./OrderTypeStep";
import SampleDetailsStep, { type OrderSamples } from "./SampleDetailsStep";
import ReviewConfirmStep from "./ReviewConfirmStep";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps: Step[] = [
  { id: 1, label: "Order Type" },
  { id: 2, label: "Sample Details" },
  { id: 3, label: "Add Genomic Positions" },
  { id: 4, label: "Checkout" },
  { id: 5, label: "Review & Confirm" },
];

export default function CreateOrderModal({
  isOpen,
  onClose,
}: CreateOrderModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<Set<string>>(
    new Set()
  );
  const [orderSamples, setOrderSamples] = useState<OrderSamples>({});
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const stepDirection = useRef<1 | -1>(1);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Trigger open animation
      requestAnimationFrame(() => {
        setIsAnimatingIn(true);
      });
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

      // Remove order types that are no longer selected (optional - you may want to keep the data)
      // Object.keys(newOrderSamples).forEach((orderTypeId) => {
      //   if (!selectedOrderTypes.has(orderTypeId)) {
      //     delete newOrderSamples[orderTypeId];
      //     hasChanges = true;
      //   }
      // });

      return hasChanges ? newOrderSamples : prev;
    });
  }, [selectedOrderTypes]);

  useEffect(() => {
    // Close modal on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setIsAnimatingIn(false);
    setTimeout(() => {
      setIsClosing(false);
      setCurrentStep(1);
      setSelectedOrderTypes(new Set());
      setOrderSamples({});
      onClose();
    }, 300);
  };

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
      stepDirection.current = 1;
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      stepDirection.current = -1;
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      stepDirection.current = -1;
      setCurrentStep(stepId);
    }
  };

  const handleEditStep = (stepId: number) => {
    stepDirection.current = stepId < currentStep ? -1 : 1;
    setCurrentStep(stepId);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedOrderTypes.size > 0;
    }
    return true;
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        isAnimatingIn && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`wasatch-app font-wasatch-sans relative mx-4 my-8 flex h-[85vh] w-full max-w-6xl flex-col rounded-wasatch-md bg-wasatch-surface shadow-2xl transition-all duration-300 ease-out ${
          isAnimatingIn && !isClosing
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-wasatch-border px-wasatch-6 py-wasatch-4 relative">
          {/* Close Button - Top Right */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-6 rounded-wasatch-sm p-wasatch-2 text-wasatch-text-placeholder transition-colors hover:bg-wasatch-neutral-100 hover:text-wasatch-text-secondary cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading">
              Create Order Request
            </h1>
          </div>

          {/* Stepper */}
          <OrderStepper currentStep={currentStep} steps={steps} onStepClick={handleStepClick} />
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto px-wasatch-6 py-wasatch-8 flex-1 relative">
          <AnimatePresence mode="wait" custom={stepDirection.current}>
            <motion.div
              key={currentStep}
              custom={stepDirection.current}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
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
                <div className="py-12 text-center">
                  <h2 className="text-wasatch-2xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-4">
                    Add Genomic Positions
                  </h2>
                  <p className="text-wasatch-text-secondary">Coming soon...</p>
                </div>
              )}

              {currentStep === 4 && (
                <div className="py-12 text-center">
                  <h2 className="text-wasatch-2xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-4">
                    Checkout
                  </h2>
                  <p className="text-wasatch-text-secondary">Coming soon...</p>
                </div>
              )}

              {currentStep === 5 && (
                <ReviewConfirmStep
                  selectedOrderTypeIds={Array.from(selectedOrderTypes)}
                  orderSamples={orderSamples}
                  onEditStep={handleEditStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-wasatch-border px-wasatch-6 py-wasatch-4 shadow-wasatch-modal-top">
          <button
            onClick={handleClose}
            className="rounded-wasatch-sm border border-wasatch-status-error-border bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-status-error transition-colors hover:bg-wasatch-status-error-bg"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle"
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
              {currentStep === 1 ? "Add Samples" : currentStep === 2 ? "Add samples" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

