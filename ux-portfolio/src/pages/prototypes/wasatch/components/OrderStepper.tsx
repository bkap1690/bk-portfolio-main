import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Step {
  id: number;
  label: string;
}

interface OrderStepperProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (stepId: number) => void;
}

export default function OrderStepper({ currentStep, steps, onStepClick }: OrderStepperProps) {
  return (
    <div className="flex items-start w-full">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = index === steps.length - 1;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step.id} className="flex items-start flex-1 last:flex-none">
            {/* Step Circle and Label */}
            <div 
              className={`flex flex-col items-center w-auto ${isClickable ? 'cursor-pointer group' : ''}`}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-wasatch-accent border-wasatch-accent text-white"
                    : isActive
                    ? "bg-wasatch-surface border-wasatch-accent text-wasatch-accent"
                    : "bg-wasatch-surface border-wasatch-border-strong text-wasatch-text-placeholder"
                } ${isClickable ? 'group-hover:bg-wasatch-accent-hover group-hover:border-wasatch-accent-hover' : ''}`}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check size={20} strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`num-${step.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium"
                    >
                      {step.id}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center whitespace-nowrap transition-colors duration-300 ${
                  isActive ? "text-wasatch-text-heading" : "text-wasatch-text-muted"
                } ${isClickable ? 'group-hover:text-wasatch-accent-hover' : ''}`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mt-5 mx-2 bg-wasatch-neutral-300 overflow-hidden">
                <motion.div
                  className="h-full bg-wasatch-accent origin-left"
                  initial={false}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
