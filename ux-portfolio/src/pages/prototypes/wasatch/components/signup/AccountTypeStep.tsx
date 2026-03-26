import { useState } from 'react';
import { useSignup } from '../../contexts/SignupContext';
import type { AccountType } from '../../contexts/SignupContext';

export default function AccountTypeStep() {
  const { formData, updateFormData, nextStep } = useSignup();
  const [selectedType, setSelectedType] = useState<AccountType | null>(formData.accountType);

  const handleSelect = (type: AccountType) => {
    setSelectedType(type);
    updateFormData('accountType', type as any);
  };

  const handleContinue = () => {
    if (selectedType) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-wasatch-6 py-wasatch-8">
      <div className="text-center mb-wasatch-12">
        <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-3">
          Let's choose your account!
        </h1>
        <p className="text-wasatch-text-secondary">
          Select the type of account you would like to create. You can choose between an
          individual account or an institutional account which will require verification.
        </p>
      </div>

      <div className="space-y-wasatch-4 mb-wasatch-8">
        {/* Individual Account Card */}
        <button
          onClick={() => handleSelect('individual')}
          className={`w-full p-wasatch-6 rounded-wasatch-md border-2 text-left transition-all duration-200 ${
            selectedType === 'individual'
              ? 'border-wasatch-accent bg-wasatch-accent/5'
              : 'border-wasatch-border-strong bg-wasatch-surface hover:border-wasatch-neutral-400'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                selectedType === 'individual'
                  ? 'border-wasatch-accent bg-wasatch-accent'
                  : 'border-wasatch-border-strong bg-wasatch-surface'
              }`}
            >
              {selectedType === 'individual' && (
                <div className="w-3 h-3 rounded-wasatch-full bg-wasatch-surface" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-2">Individual</h3>
              <p className="text-wasatch-sm text-wasatch-text-secondary">
                Ideal for independent researchers and small-scale users who do not require
                institution-level verification
              </p>
            </div>
          </div>
        </button>

        {/* Institutional Account Card */}
        <button
          onClick={() => handleSelect('institutional')}
          className={`w-full p-wasatch-6 rounded-wasatch-md border-2 text-left transition-all duration-200 ${
            selectedType === 'institutional'
              ? 'border-wasatch-accent bg-wasatch-accent/5'
              : 'border-wasatch-border-strong bg-wasatch-surface hover:border-wasatch-neutral-400'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                selectedType === 'institutional'
                  ? 'border-wasatch-accent bg-wasatch-accent'
                  : 'border-wasatch-border-strong bg-wasatch-surface'
              }`}
            >
              {selectedType === 'institutional' && (
                <div className="w-3 h-3 rounded-wasatch-full bg-wasatch-surface" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-2">
                Institutional / University
              </h3>
              <p className="text-wasatch-sm text-wasatch-text-secondary">
                Recommended for users affiliated with recognized labs, universities, or research
                institutions. Verification required for access.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedType}
          className={`px-wasatch-8 py-wasatch-3 rounded-wasatch-sm text-wasatch-text-inverse font-wasatch-medium transition-all duration-200 ${
            selectedType
              ? 'bg-wasatch-accent hover:bg-wasatch-accent-hover cursor-pointer'
              : 'bg-wasatch-neutral-300 cursor-not-allowed opacity-50'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
