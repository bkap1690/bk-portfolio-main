import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type definitions
export type AccountType = 'individual' | 'institutional';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrganizationInfo {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  role: string;
  phone: string;
}

export interface AccountDetails {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface VerificationInfo {
  emailCode: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'authenticator' | null;
  smsVerified: boolean;
}

export interface SignupFormData {
  accountType: AccountType | null;
  personalInfo: PersonalInfo;
  organizationInfo: OrganizationInfo;
  accountDetails: AccountDetails;
  verificationInfo: VerificationInfo;
  termsAccepted: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

interface SignupContextType {
  currentStep: number;
  formData: SignupFormData;
  errors: ValidationErrors;
  updateFormData: (section: keyof SignupFormData, data: Partial<SignupFormData[keyof SignupFormData]>) => void;
  setErrors: (errors: ValidationErrors) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

const STORAGE_KEY = 'wasatch_signup_data';

const initialFormData: SignupFormData = {
  accountType: null,
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  organizationInfo: {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    role: '',
    phone: '',
  },
  accountDetails: {
    username: '',
    password: '',
    confirmPassword: '',
  },
  verificationInfo: {
    emailCode: '',
    emailVerified: false,
    twoFactorEnabled: false,
    twoFactorMethod: null,
    smsVerified: false,
  },
  termsAccepted: false,
};

export function SignupProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || initialFormData);
        setCurrentStep(parsed.currentStep || 1);
      } catch (error) {
        console.error('Failed to parse saved signup data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        formData,
        currentStep,
      })
    );
  }, [formData, currentStep]);

  const updateFormData = (
    section: keyof SignupFormData,
    data: Partial<SignupFormData[keyof SignupFormData]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: SignupContextType = {
    currentStep,
    formData,
    errors,
    updateFormData,
    setErrors,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
  };

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
}
