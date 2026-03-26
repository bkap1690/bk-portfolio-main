import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignupStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Account type' },
  { number: 2, label: 'Personal information' },
  { number: 3, label: 'Account details' },
  { number: 4, label: '2-step verification' },
  { number: 5, label: 'Review & confirm' },
];

export default function SignupStepper({ currentStep }: SignupStepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-wasatch-6 py-wasatch-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step.number < currentStep
                    ? 'bg-wasatch-accent border-wasatch-accent'
                    : step.number === currentStep
                    ? 'bg-wasatch-accent border-wasatch-accent'
                    : 'bg-wasatch-surface border-wasatch-border-strong'
                }`}
              >
                <AnimatePresence mode="wait">
                  {step.number < currentStep ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check size={20} className="text-wasatch-text-inverse" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`num-${step.number}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`text-wasatch-sm font-wasatch-medium ${
                        step.number === currentStep ? 'text-wasatch-text-inverse' : 'text-wasatch-text-placeholder'
                      }`}
                    >
                      {step.number}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`mt-wasatch-2 text-wasatch-xs text-center whitespace-nowrap transition-colors duration-300 ${
                  step.number <= currentStep ? 'text-wasatch-text-secondary font-wasatch-medium' : 'text-wasatch-text-placeholder'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-wasatch-2 mb-wasatch-6 bg-wasatch-neutral-300 overflow-hidden">
                <motion.div
                  className="h-full bg-wasatch-accent"
                  initial={false}
                  animate={{ scaleX: step.number < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
