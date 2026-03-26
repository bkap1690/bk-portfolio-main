import { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignupProvider, useSignup } from '../contexts/SignupContext';
import SignupStepper from '../components/SignupStepper';
import AccountTypeStep from '../components/signup/AccountTypeStep';
import PersonalInfoStep from '../components/signup/PersonalInfoStep';
import AccountDetailsStep from '../components/signup/AccountDetailsStep';
import VerificationStep from '../components/signup/VerificationStep';
import ReviewConfirmStep from '../components/signup/ReviewConfirmStep';
import logo from '../assets/WBL_Logo.svg';

function AccountCreationFlowContent() {
  const { currentStep, prevStep, resetForm } = useSignup();
  const navigate = useNavigate();

  // Load Roboto font
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleBack = () => {
    if (currentStep === 1) {
      // Exit the signup flow
      navigate('/prototypes');
    } else {
      prevStep();
    }
  };

  const handleClose = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
      navigate('/prototypes');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountTypeStep />;
      case 2:
        return <PersonalInfoStep />;
      case 3:
        return <AccountDetailsStep />;
      case 4:
        return <VerificationStep />;
      case 5:
        return <ReviewConfirmStep />;
      default:
        return <AccountTypeStep />;
    }
  };

  return (
    <div className="wasatch-app font-wasatch-sans min-h-screen bg-wasatch-bg flex flex-col">
      {/* Header */}
      <header className="bg-wasatch-bg-elevated border-b border-wasatch-border">
        <div className="max-w-7xl mx-auto px-wasatch-6 py-wasatch-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-wasatch-2 text-wasatch-text-secondary hover:text-wasatch-text-heading transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-wasatch-sm font-wasatch-medium">Back</span>
          </button>

          <img src={logo} alt="WASATCH.BIOLABS" className="h-10" />

          <button
            onClick={handleClose}
            className="flex items-center gap-wasatch-2 text-wasatch-text-secondary hover:text-wasatch-text-heading transition-colors"
          >
            <span className="text-wasatch-sm font-wasatch-medium">MENU</span>
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Progress Stepper */}
      <SignupStepper currentStep={currentStep} />

      {/* Main Content */}
      <main className="flex-1 pb-wasatch-12">{renderStep()}</main>

      {/* Footer */}
      <footer className="bg-wasatch-neutral-800 py-wasatch-4 text-center text-wasatch-sm text-wasatch-text-inverse">
        © 2024 Wasatch BioLabs. All rights reserved
      </footer>
    </div>
  );
}

export default function AccountCreationFlow() {
  return (
    <SignupProvider>
      <AccountCreationFlowContent />
    </SignupProvider>
  );
}
