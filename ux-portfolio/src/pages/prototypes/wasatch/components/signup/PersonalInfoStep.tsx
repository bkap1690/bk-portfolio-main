import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSignup } from '../../contexts/SignupContext';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateZipCode,
  formatPhone,
} from '../../utils/validation';

export default function PersonalInfoStep() {
  const { formData, updateFormData, nextStep, errors, setErrors } = useSignup();
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const handlePersonalInfoChange = (field: string, value: string) => {
    // Format phone number as user types
    if (field === 'phone') {
      value = formatPhone(value);
    }
    updateFormData('personalInfo', { [field]: value } as any);
    // Clear error for this field
    if (localErrors[field]) {
      setLocalErrors({ ...localErrors, [field]: '' });
    }
  };

  const handleOrganizationInfoChange = (field: string, value: string) => {
    // Format organization phone number as user types
    if (field === 'phone') {
      value = formatPhone(value);
    }
    updateFormData('organizationInfo', { [field]: value } as any);
    // Clear error for this field
    if (localErrors[`org_${field}`]) {
      setLocalErrors({ ...localErrors, [`org_${field}`]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate personal info
    const firstNameValidation = validateRequired(formData.personalInfo.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error!;
    }

    const lastNameValidation = validateRequired(formData.personalInfo.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error!;
    }

    const emailValidation = validateEmail(formData.personalInfo.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
    }

    const phoneValidation = validatePhone(formData.personalInfo.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error!;
    }

    // Validate organization info (only if institutional account)
    if (formData.accountType === 'institutional') {
      const orgNameValidation = validateRequired(
        formData.organizationInfo.name,
        'Organization name'
      );
      if (!orgNameValidation.isValid) {
        newErrors.org_name = orgNameValidation.error!;
      }

      const addressValidation = validateRequired(
        formData.organizationInfo.addressLine1,
        'Address'
      );
      if (!addressValidation.isValid) {
        newErrors.org_addressLine1 = addressValidation.error!;
      }

      const cityValidation = validateRequired(formData.organizationInfo.city, 'City');
      if (!cityValidation.isValid) {
        newErrors.org_city = cityValidation.error!;
      }

      const stateValidation = validateRequired(formData.organizationInfo.state, 'State');
      if (!stateValidation.isValid) {
        newErrors.org_state = stateValidation.error!;
      }

      const zipValidation = validateZipCode(formData.organizationInfo.zipCode);
      if (!zipValidation.isValid) {
        newErrors.org_zipCode = zipValidation.error!;
      }

      const countryValidation = validateRequired(formData.organizationInfo.country, 'Country');
      if (!countryValidation.isValid) {
        newErrors.org_country = countryValidation.error!;
      }

      const roleValidation = validateRequired(formData.organizationInfo.role, 'Role');
      if (!roleValidation.isValid) {
        newErrors.org_role = roleValidation.error!;
      }

      const orgPhoneValidation = validatePhone(formData.organizationInfo.phone);
      if (!orgPhoneValidation.isValid) {
        newErrors.org_phone = orgPhoneValidation.error!;
      }
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-wasatch-6 py-wasatch-8">
      <div className="text-center mb-wasatch-8">
        <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-3">Tell us a bit about yourself</h1>
        <p className="text-wasatch-text-secondary">We need some basic information to set up your account.</p>
      </div>

      {/* Personal Information Section */}
      <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6 mb-wasatch-6">
        <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-4">Please enter your general information below.</p>

        <div className="space-y-wasatch-4">
          {/* First Name */}
          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
              First name <span className="text-wasatch-status-error">*</span>
            </label>
            <input
              type="text"
              value={formData.personalInfo.firstName}
              onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                localErrors.firstName ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
              }`}
            />
            {localErrors.firstName && (
              <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
              Last name <span className="text-wasatch-status-error">*</span>
            </label>
            <input
              type="text"
              value={formData.personalInfo.lastName}
              onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                localErrors.lastName ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
              }`}
            />
            {localErrors.lastName && (
              <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.lastName}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
              Email Address <span className="text-wasatch-status-error">*</span>
            </label>
            <input
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                localErrors.email ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
              }`}
            />
            {localErrors.email && <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">Phone number</label>
            <div className="flex gap-wasatch-2">
              <select className="px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm bg-wasatch-surface focus:outline-none focus:ring-2 focus:ring-wasatch-accent">
                <option value="+1">United States (+1)</option>
              </select>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="+1 123-456-7890"
                className={`flex-1 px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                  localErrors.phone ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                }`}
              />
            </div>
            {localErrors.phone && <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Organization Information Section (only for institutional accounts) */}
      {formData.accountType === 'institutional' && (
        <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6 mb-wasatch-6">
          <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-4">
            Please enter your organization details below. A verification is required to send a
            purchase order which will be processed shortly after registration is complete.
          </p>

          <div className="space-y-wasatch-4">
            {/* Organization Name */}
            <div>
              <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                Organization / Institution name <span className="text-wasatch-status-error">*</span>
              </label>
              <input
                type="text"
                value={formData.organizationInfo.name}
                onChange={(e) => handleOrganizationInfoChange('name', e.target.value)}
                placeholder="Enter your organization's name"
                className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                  localErrors.org_name ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                }`}
              />
              {localErrors.org_name && (
                <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_name}</p>
              )}
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                Address line 1 <span className="text-wasatch-status-error">*</span>
              </label>
              <input
                type="text"
                value={formData.organizationInfo.addressLine1}
                onChange={(e) => handleOrganizationInfoChange('addressLine1', e.target.value)}
                placeholder="Enter your street address"
                className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                  localErrors.org_addressLine1 ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                }`}
              />
              {localErrors.org_addressLine1 && (
                <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_addressLine1}</p>
              )}
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                Address line 2 <span className="text-wasatch-status-error">*</span>
              </label>
              <input
                type="text"
                value={formData.organizationInfo.addressLine2}
                onChange={(e) => handleOrganizationInfoChange('addressLine2', e.target.value)}
                placeholder="PO Box, Apt, Suite, unit, etc."
                className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-wasatch-4">
              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  City <span className="text-wasatch-status-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.organizationInfo.city}
                  onChange={(e) => handleOrganizationInfoChange('city', e.target.value)}
                  placeholder="Enter your city"
                  className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                    localErrors.org_city ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                  }`}
                />
                {localErrors.org_city && (
                  <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_city}</p>
                )}
              </div>
              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  State <span className="text-wasatch-status-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.organizationInfo.state}
                    onChange={(e) => handleOrganizationInfoChange('state', e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm bg-wasatch-surface appearance-none focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      localErrors.org_state ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                    }`}
                  >
                    <option value="">Select a state</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    {/* Add more states as needed */}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder pointer-events-none"
                    size={18}
                  />
                </div>
                {localErrors.org_state && (
                  <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_state}</p>
                )}
              </div>
            </div>

            {/* Zip Code and Country */}
            <div className="grid grid-cols-2 gap-wasatch-4">
              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Zip code <span className="text-wasatch-status-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.organizationInfo.zipCode}
                  onChange={(e) => handleOrganizationInfoChange('zipCode', e.target.value)}
                  placeholder="Enter a zip code"
                  className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                    localErrors.org_zipCode ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                  }`}
                />
                {localErrors.org_zipCode && (
                  <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_zipCode}</p>
                )}
              </div>
              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Country <span className="text-wasatch-status-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.organizationInfo.country}
                    onChange={(e) => handleOrganizationInfoChange('country', e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm bg-wasatch-surface appearance-none focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      localErrors.org_country ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                    }`}
                  >
                    <option value="">Choose a country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    {/* Add more countries as needed */}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder pointer-events-none"
                    size={18}
                  />
                </div>
                {localErrors.org_country && (
                  <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_country}</p>
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                Role <span className="text-wasatch-status-error">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.organizationInfo.role}
                  onChange={(e) => handleOrganizationInfoChange('role', e.target.value)}
                  className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm bg-wasatch-surface appearance-none focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                    localErrors.org_role ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                  }`}
                >
                  <option value="">Choose an appropriate role</option>
                  <option value="researcher">Researcher</option>
                  <option value="lab-manager">Lab Manager</option>
                  <option value="principal-investigator">Principal Investigator</option>
                  <option value="technician">Technician</option>
                  <option value="administrator">Administrator</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder pointer-events-none"
                  size={18}
                />
              </div>
              {localErrors.org_role && (
                <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_role}</p>
              )}
            </div>

            {/* Organization Phone Number */}
            <div>
              <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">Phone number</label>
              <div className="flex gap-wasatch-2">
                <select className="px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm bg-wasatch-surface focus:outline-none focus:ring-2 focus:ring-wasatch-accent">
                  <option value="+1">United States (+1)</option>
                </select>
                <input
                  type="tel"
                  value={formData.organizationInfo.phone}
                  onChange={(e) => handleOrganizationInfoChange('phone', e.target.value)}
                  placeholder="+1 123-456-7890"
                  className={`flex-1 px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                    localErrors.org_phone ? 'border-wasatch-status-error' : 'border-wasatch-border-strong'
                  }`}
                />
              </div>
              {localErrors.org_phone && (
                <p className="mt-wasatch-1 text-wasatch-sm text-wasatch-status-error">{localErrors.org_phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

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
