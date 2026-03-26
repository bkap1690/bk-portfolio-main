import { useState } from 'react';
import { useSignup } from '../../contexts/SignupContext';
import { validateVerificationCode } from '../../utils/validation';

export default function VerificationStep() {
  const { formData, updateFormData, nextStep } = useSignup();
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsCode, setSmsCode] = useState('');

  const handleCodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    updateFormData('verificationInfo', { emailCode: digitsOnly } as any);
    if (localErrors.emailCode) {
      setLocalErrors({ ...localErrors, emailCode: '' });
    }
  };

  const handleVerifyEmail = () => {
    const validation = validateVerificationCode(formData.verificationInfo.emailCode);
    if (!validation.isValid) {
      setLocalErrors({ ...localErrors, emailCode: validation.error! });
      return;
    }

    // Simulate email verification (in real app, this would call an API)
    updateFormData('verificationInfo', { emailVerified: true } as any);
    setLocalErrors({ ...localErrors, emailCode: '' });
  };

  const handleResendCode = () => {
    // Simulate resending code (in real app, this would call an API)
    alert('Verification code resent to your email');
  };

  const handle2FAToggle = (enabled: boolean) => {
    updateFormData('verificationInfo', {
      twoFactorEnabled: enabled,
      twoFactorMethod: enabled ? formData.verificationInfo.twoFactorMethod || 'sms' : null,
    } as any);
  };

  const handle2FAMethodChange = (method: 'sms' | 'authenticator') => {
    updateFormData('verificationInfo', { twoFactorMethod: method } as any);
  };

  const handleSetupSms = () => {
    setShowSmsModal(true);
  };

  const handleSmsVerify = () => {
    if (smsCode.length === 6) {
      updateFormData('verificationInfo', { smsVerified: true } as any);
      setShowSmsModal(false);
      setSmsCode('');
    }
  };

  const handleContinue = () => {
    if (!formData.verificationInfo.emailVerified) {
      setLocalErrors({ ...localErrors, emailCode: 'Please verify your email before continuing' });
      return;
    }
    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-wasatch-6 py-wasatch-8">
      <div className="text-center mb-wasatch-8">
        <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-3">Verify your identity</h1>
        <p className="text-wasatch-text-secondary">Set up security measures and confirm your account</p>
      </div>

      <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6 mb-wasatch-6">
        {/* Email Verification */}
        <div className="mb-wasatch-8">
          <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-4">
            We've sent a 6-digit verification code to your email [{formData.personalInfo.email}].
            Please enter it below to verify your email address.
          </p>

          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
              Enter verification code <span className="text-wasatch-status-error">*</span>
            </label>
            <div className="flex gap-wasatch-2 items-start">
              <input
                type="text"
                value={formData.verificationInfo.emailCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Enter code"
                maxLength={6}
                disabled={formData.verificationInfo.emailVerified}
                className={`flex-1 px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                  formData.verificationInfo.emailVerified
                    ? 'bg-wasatch-neutral-100 cursor-not-allowed'
                    : localErrors.emailCode
                    ? 'border-wasatch-status-error'
                    : 'border-wasatch-border-strong'
                }`}
              />
              {!formData.verificationInfo.emailVerified && (
                <button
                  onClick={handleVerifyEmail}
                  className="px-wasatch-4 py-wasatch-2 bg-wasatch-accent text-wasatch-text-inverse rounded-wasatch-sm hover:bg-wasatch-accent-hover transition-colors"
                >
                  Verify
                </button>
              )}
              {formData.verificationInfo.emailVerified && (
                <div className="px-wasatch-4 py-wasatch-2 bg-wasatch-status-success-bg text-wasatch-status-success rounded-wasatch-sm font-wasatch-medium">
                  ✓ Verified
                </div>
              )}
            </div>
            {localErrors.emailCode && (
              <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.emailCode}</p>
            )}
          </div>

          {!formData.verificationInfo.emailVerified && (
            <button
              onClick={handleResendCode}
              className="mt-wasatch-2 text-wasatch-sm text-wasatch-primary hover:underline"
            >
              Resend code
            </button>
          )}
        </div>

        {/* 2FA Setup */}
        <div className="border-t border-wasatch-border pt-wasatch-6">
          <div className="flex items-center justify-between mb-wasatch-4">
            <label className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Enable or disable 2FA</label>
            <button
              onClick={() => handle2FAToggle(!formData.verificationInfo.twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-wasatch-full transition-colors ${
                formData.verificationInfo.twoFactorEnabled ? 'bg-wasatch-accent' : 'bg-wasatch-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-wasatch-full bg-wasatch-surface transition-transform ${
                  formData.verificationInfo.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {formData.verificationInfo.twoFactorEnabled && (
            <div className="space-y-wasatch-4">
              <p className="text-wasatch-sm text-wasatch-text-secondary">
                Select which method you would like to verify your account with:
              </p>

              {/* SMS Verification Option */}
              <label className="flex items-start gap-wasatch-3 cursor-pointer">
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-wasatch-full border-2 flex items-center justify-center ${
                      formData.verificationInfo.twoFactorMethod === 'sms'
                        ? 'border-wasatch-accent bg-wasatch-accent'
                        : 'border-wasatch-border-strong'
                    }`}
                  >
                    {formData.verificationInfo.twoFactorMethod === 'sms' && (
                      <div className="w-2.5 h-2.5 rounded-wasatch-full bg-wasatch-surface" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="radio"
                    name="2fa-method"
                    value="sms"
                    checked={formData.verificationInfo.twoFactorMethod === 'sms'}
                    onChange={() => handle2FAMethodChange('sms')}
                    className="sr-only"
                  />
                  <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">SMS Verification</span>
                </div>
              </label>

              {/* Authenticator App Option */}
              <label className="flex items-start gap-wasatch-3 cursor-pointer">
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-wasatch-full border-2 flex items-center justify-center ${
                      formData.verificationInfo.twoFactorMethod === 'authenticator'
                        ? 'border-wasatch-accent bg-wasatch-accent'
                        : 'border-wasatch-border-strong'
                    }`}
                  >
                    {formData.verificationInfo.twoFactorMethod === 'authenticator' && (
                      <div className="w-2.5 h-2.5 rounded-wasatch-full bg-wasatch-surface" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="radio"
                    name="2fa-method"
                    value="authenticator"
                    checked={formData.verificationInfo.twoFactorMethod === 'authenticator'}
                    onChange={() => handle2FAMethodChange('authenticator')}
                    className="sr-only"
                  />
                  <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">Authenticator app</span>
                </div>
              </label>

              {/* Setup Button for SMS */}
              {formData.verificationInfo.twoFactorMethod === 'sms' && (
                <button
                  onClick={handleSetupSms}
                  className="px-wasatch-4 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary hover:bg-wasatch-surface-subtle transition-colors"
                >
                  Set up verification
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!formData.verificationInfo.emailVerified}
          className={`px-wasatch-8 py-wasatch-3 rounded-wasatch-sm text-wasatch-text-inverse font-wasatch-medium transition-colors ${
            formData.verificationInfo.emailVerified
              ? 'bg-wasatch-accent hover:bg-wasatch-accent-hover cursor-pointer'
              : 'bg-wasatch-neutral-300 cursor-not-allowed opacity-50'
          }`}
        >
          Continue
        </button>
      </div>

      {/* SMS Verification Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-wasatch-surface rounded-wasatch-md p-wasatch-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-wasatch-4">
              <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">SMS Verification</h3>
              <button
                onClick={() => setShowSmsModal(false)}
                className="text-wasatch-text-placeholder hover:text-wasatch-text-secondary"
              >
                ✕
              </button>
            </div>

            <div className="mb-wasatch-4">
              <label className="flex items-center gap-wasatch-2 mb-wasatch-2">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="w-4 h-4 text-wasatch-accent border-wasatch-border-strong rounded"
                />
                <span className="text-wasatch-sm text-wasatch-text-secondary">Use account phone number</span>
              </label>

              <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-4">
                We've sent a verification code to your provided phone number. Please enter it below
                to enable 2-factor verification.
              </p>

              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Enter code <span className="text-wasatch-status-error">*</span>
                </label>
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter code"
                  maxLength={6}
                  className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent"
                />
              </div>

              <button className="mt-wasatch-2 text-wasatch-sm text-wasatch-primary hover:underline">Resend code</button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSmsVerify}
                disabled={smsCode.length !== 6}
                className={`px-wasatch-4 py-wasatch-2 rounded-wasatch-sm text-wasatch-text-inverse font-wasatch-medium transition-colors ${
                  smsCode.length === 6
                    ? 'bg-wasatch-accent hover:bg-wasatch-accent-hover cursor-pointer'
                    : 'bg-wasatch-neutral-300 cursor-not-allowed'
                }`}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
