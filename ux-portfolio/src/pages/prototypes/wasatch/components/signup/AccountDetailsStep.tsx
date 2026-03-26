import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSignup } from '../../contexts/SignupContext';
import {
  validateUsername,
  validatePassword,
  validatePasswordMatch,
  getPasswordStrength,
} from '../../utils/validation';

export default function AccountDetailsStep() {
  const { formData, updateFormData, nextStep } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = (field: string, value: string) => {
    updateFormData('accountDetails', { [field]: value } as any);
    // Clear error for this field
    if (localErrors[field]) {
      setLocalErrors({ ...localErrors, [field]: '' });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...localErrors };

    if (field === 'username') {
      const validation = validateUsername(formData.accountDetails.username);
      if (!validation.isValid) {
        newErrors.username = validation.error!;
      } else {
        delete newErrors.username;
      }
    }

    if (field === 'password') {
      const validation = validatePassword(formData.accountDetails.password);
      if (!validation.isValid) {
        newErrors.password = validation.error!;
      } else {
        delete newErrors.password;
      }
    }

    if (field === 'confirmPassword') {
      const validation = validatePasswordMatch(
        formData.accountDetails.password,
        formData.accountDetails.confirmPassword
      );
      if (!validation.isValid) {
        newErrors.confirmPassword = validation.error!;
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setLocalErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const usernameValidation = validateUsername(formData.accountDetails.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error!;
    }

    const passwordValidation = validatePassword(formData.accountDetails.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error!;
    }

    const confirmPasswordValidation = validatePasswordMatch(
      formData.accountDetails.password,
      formData.accountDetails.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error!;
    }

    setLocalErrors(newErrors);
    setTouched({ username: true, password: true, confirmPassword: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const passwordStrength = formData.accountDetails.password
    ? getPasswordStrength(formData.accountDetails.password)
    : null;

  const getStrengthColor = () => {
    if (!passwordStrength) return 'bg-wasatch-neutral-200';
    switch (passwordStrength.strength) {
      case 'weak':
        return 'bg-wasatch-status-error';
      case 'medium':
        return 'bg-wasatch-status-warning';
      case 'strong':
        return 'bg-wasatch-status-info';
      case 'very-strong':
        return 'bg-wasatch-status-success';
      default:
        return 'bg-wasatch-neutral-200';
    }
  };

  const getStrengthWidth = () => {
    if (!passwordStrength) return '0%';
    return `${(passwordStrength.score / 6) * 100}%`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-wasatch-6 py-wasatch-8">
      <div className="text-center mb-wasatch-8">
        <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-3">
          Create your login credentials
        </h1>
        <p className="text-wasatch-text-secondary">Set up a username and password to secure your account</p>
      </div>

      <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6 mb-wasatch-6">
        <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-6">Please enter a username and password below.</p>

        <div className="space-y-wasatch-6">
          {/* Username */}
          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
              Username <span className="text-wasatch-status-error">*</span>
            </label>
            <input
              type="text"
              value={formData.accountDetails.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              placeholder="Choose a username"
              className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                touched.username && localErrors.username ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
              }`}
            />
            {touched.username && localErrors.username && (
              <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
              Password <span className="text-wasatch-status-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.accountDetails.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Create a password"
                className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent pr-10 ${
                  touched.password && localErrors.password ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder hover:text-wasatch-text-secondary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {touched.password && localErrors.password && (
              <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.password}</p>
            )}

            {/* Password Strength Indicator */}
            {formData.accountDetails.password && !localErrors.password && (
              <div className="mt-wasatch-2">
                <div className="flex items-center gap-wasatch-2 mb-wasatch-1">
                  <div className="flex-1 h-2 bg-wasatch-neutral-200 rounded-wasatch-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: getStrengthWidth() }}
                    />
                  </div>
                  <span className="text-wasatch-xs text-wasatch-text-secondary capitalize">
                    {passwordStrength?.strength.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-wasatch-xs text-wasatch-text-muted">
                  Use 8+ characters with uppercase, lowercase, numbers, and symbols
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
              Confirm password <span className="text-wasatch-status-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.accountDetails.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirm your password"
                className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent pr-10 ${
                  touched.confirmPassword && localErrors.confirmPassword
                    ? 'border-wasatch-status-error'
                    : 'border-wasatch-border-strong'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder hover:text-wasatch-text-secondary"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {touched.confirmPassword && localErrors.confirmPassword && (
              <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="px-wasatch-8 py-wasatch-3 rounded-wasatch-sm bg-wasatch-accent text-wasatch-text-inverse font-wasatch-medium hover:bg-wasatch-accent-hover transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
