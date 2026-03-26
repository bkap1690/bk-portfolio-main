import { useState } from 'react';
import { useSignup } from '../../contexts/SignupContext';
import { useNavigate } from 'react-router-dom';

export default function ReviewConfirmStep() {
  const { formData, goToStep, updateFormData } = useSignup();
  const [termsAccepted, setTermsAccepted] = useState(formData.termsAccepted);
  const navigate = useNavigate();

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    updateFormData('termsAccepted', checked as any);
  };

  const handleConfirm = () => {
    if (termsAccepted) {
      // Navigate to success page
      navigate('/prototypes/wasatch-success');
    }
  };

  const handleEdit = (step: number) => {
    goToStep(step);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-wasatch-6 py-wasatch-8">
      <div className="text-center mb-wasatch-8">
        <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-3">Review & Confirm</h1>
        <p className="text-wasatch-text-secondary">
          Take a moment to check your details before we create your account.
        </p>
      </div>

      <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6 mb-wasatch-6">
        <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-6">
          Please review the information below to ensure everything is correct. If you need to make
          any changes, click the Edit button next to the section you'd like to update.
        </p>

        <div className="space-y-wasatch-6">
          {/* Account Type */}
          <div className="border-b border-wasatch-border pb-wasatch-6">
            <div className="flex items-center justify-between mb-wasatch-3">
              <h3 className="text-wasatch-base font-wasatch-medium text-wasatch-text-heading">Account type</h3>
              <button
                onClick={() => handleEdit(1)}
                className="text-sm text-wasatch-primary hover:underline"
              >
                ✎ Edit
              </button>
            </div>
            <div>
              <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">Selected Account Type</p>
              <p className="text-wasatch-sm text-wasatch-text-secondary capitalize">
                {formData.accountType === 'individual'
                  ? 'Individual Account'
                  : 'Institutional Account / Institutional Account'}
              </p>
              <p className="text-wasatch-xs text-wasatch-text-muted mt-wasatch-1">
                {formData.accountType === 'individual'
                  ? '[Account type description from account type card]'
                  : '[Account type description from account type card]'}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-b border-wasatch-border pb-wasatch-6">
            <div className="flex items-center justify-between mb-wasatch-3">
              <h3 className="text-wasatch-base font-wasatch-medium text-wasatch-text-heading">Personal Information</h3>
              <button
                onClick={() => handleEdit(2)}
                className="text-sm text-wasatch-primary hover:underline"
              >
                ✎ Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-wasatch-8 gap-y-wasatch-3">
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">First name</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.personalInfo.firstName}</p>
              </div>
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Last name</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Email Address</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Phone number</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.personalInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* Organization Information (only for institutional) */}
          {formData.accountType === 'institutional' && (
            <div className="border-b border-wasatch-border pb-wasatch-6">
              <div className="flex items-center justify-between mb-wasatch-3">
                <h3 className="text-wasatch-base font-wasatch-medium text-wasatch-text-heading">Organization Information</h3>
                <button
                  onClick={() => handleEdit(2)}
                  className="text-sm text-wasatch-primary hover:underline"
                >
                  ✎ Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-wasatch-8 gap-y-wasatch-3">
                <div>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Organization name</p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.organizationInfo.name}</p>
                </div>
                <div>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Role/Position</p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary capitalize">
                    {formData.organizationInfo.role.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Street Address</p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.organizationInfo.addressLine1}</p>
                </div>
                <div>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">City</p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.organizationInfo.city}</p>
                </div>
                <div>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">State/Province</p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.organizationInfo.state}</p>
                </div>
                <div>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Postal Code</p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.organizationInfo.zipCode}</p>
                </div>
                <div>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Country</p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.organizationInfo.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Account Details */}
          <div className="border-b border-wasatch-border pb-wasatch-6">
            <div className="flex items-center justify-between mb-wasatch-3">
              <h3 className="text-wasatch-base font-wasatch-medium text-wasatch-text-heading">Account Details</h3>
              <button
                onClick={() => handleEdit(3)}
                className="text-sm text-wasatch-primary hover:underline"
              >
                ✎ Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-wasatch-8 gap-y-wasatch-3">
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Username</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">{formData.accountDetails.username}</p>
              </div>
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Password</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">••••••••</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <div className="flex items-center justify-between mb-wasatch-3">
              <h3 className="text-wasatch-base font-wasatch-medium text-wasatch-text-heading">Security Settings</h3>
              <button
                onClick={() => handleEdit(4)}
                className="text-sm text-wasatch-primary hover:underline"
              >
                ✎ Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-wasatch-8 gap-y-wasatch-3">
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Email Verified</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">
                  {formData.verificationInfo.emailVerified ? '[Yes / No]' : '[Yes / No]'}
                </p>
              </div>
              <div>
                <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary">Two-Factor Authentication</p>
                <p className="text-wasatch-sm text-wasatch-text-secondary">
                  {formData.verificationInfo.twoFactorEnabled
                    ? `[Enabled/Disabled]`
                    : '[Enabled/Disabled]'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6 mb-wasatch-6">
        <h3 className="text-wasatch-base font-wasatch-medium text-wasatch-text-heading mb-wasatch-4">Terms and Conditions</h3>
        <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-4">
          Before creating your account, please read and agree to our Terms and Conditions.
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => handleTermsChange(e.target.checked)}
            className="mt-wasatch-1 w-4 h-4 text-wasatch-accent border-wasatch-border-strong rounded focus:ring-wasatch-accent"
          />
          <span className="text-wasatch-sm text-wasatch-text-secondary">
            I have read and agree to the{' '}
            <a href="#" className="text-wasatch-primary hover:underline">
              Terms and Conditions
            </a>{' '}
            and acknowledge the{' '}
            <a href="#" className="text-wasatch-primary hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goToStep(4)}
          className="px-wasatch-6 py-wasatch-3 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-text-secondary font-wasatch-medium hover:bg-wasatch-surface-subtle transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleConfirm}
          disabled={!termsAccepted}
          className={`px-wasatch-8 py-wasatch-3 rounded-wasatch-sm text-wasatch-text-inverse font-wasatch-medium transition-colors ${
            termsAccepted
              ? 'bg-wasatch-accent hover:bg-wasatch-accent-hover cursor-pointer'
              : 'bg-wasatch-neutral-300 cursor-not-allowed opacity-50'
          }`}
        >
          Confirm & Create Account
        </button>
      </div>

      <p className="text-wasatch-xs text-center text-wasatch-text-muted mt-wasatch-4">
        By clicking 'Confirm & Create Account', you agree to our Terms and Conditions and confirm
        that all information provided is accurate.
      </p>
    </div>
  );
}
