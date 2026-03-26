import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Package,
  CreditCard,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";

interface CheckoutStepProps {
  onCheckoutComplete?: (data: CheckoutData) => void;
}

export interface CheckoutData {
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    institution: string;
    department: string;
  };
  deliveryInfo: {
    address: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    instructions: string;
  };
  billingInfo: {
    sameAsDelivery: boolean;
    address: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentInfo: {
    method: "po" | "credit" | "invoice";
    poNumber: string;
    accountNumber: string;
    notes: string;
  };
  shippingPreference: "standard" | "expedited" | "rush";
}

export default function CheckoutStep({
  onCheckoutComplete,
}: CheckoutStepProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    contactInfo: {
      firstName: "Sarah",
      lastName: "Chen",
      email: "s.chen@university.edu",
      phone: "+1 (555) 123-4567",
      institution: "University Research Lab",
      department: "Molecular Biology",
    },
    deliveryInfo: {
      address: "123 Research Drive, Building A",
      addressLine2: "Room 401",
      city: "Cambridge",
      state: "MA",
      zip: "02139",
      country: "United States",
      instructions: "Please deliver to the main reception desk",
    },
    billingInfo: {
      sameAsDelivery: true,
      address: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
    paymentInfo: {
      method: "po",
      poNumber: "",
      accountNumber: "",
      notes: "",
    },
    shippingPreference: "standard",
  });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleContactChange = (field: keyof CheckoutData["contactInfo"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
    // Clear validation error for this field
    if (validationErrors[`contact.${field}`]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`contact.${field}`];
        return newErrors;
      });
    }
  };

  const handleDeliveryChange = (field: keyof CheckoutData["deliveryInfo"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      deliveryInfo: {
        ...prev.deliveryInfo,
        [field]: value,
      },
    }));
    if (validationErrors[`delivery.${field}`]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`delivery.${field}`];
        return newErrors;
      });
    }
  };

  const handleBillingChange = (field: keyof CheckoutData["billingInfo"], value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      billingInfo: {
        ...prev.billingInfo,
        [field]: value,
      },
    }));
  };

  const handlePaymentChange = (field: keyof CheckoutData["paymentInfo"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        [field]: value,
      },
    }));
    if (validationErrors[`payment.${field}`]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`payment.${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validate contact info
    if (!formData.contactInfo.firstName.trim()) {
      errors["contact.firstName"] = "First name is required";
    }
    if (!formData.contactInfo.lastName.trim()) {
      errors["contact.lastName"] = "Last name is required";
    }
    if (!formData.contactInfo.email.trim()) {
      errors["contact.email"] = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      errors["contact.email"] = "Invalid email format";
    }
    if (!formData.contactInfo.phone.trim()) {
      errors["contact.phone"] = "Phone is required";
    }
    if (!formData.contactInfo.institution.trim()) {
      errors["contact.institution"] = "Institution is required";
    }

    // Validate delivery info
    if (!formData.deliveryInfo.address.trim()) {
      errors["delivery.address"] = "Address is required";
    }
    if (!formData.deliveryInfo.city.trim()) {
      errors["delivery.city"] = "City is required";
    }
    if (!formData.deliveryInfo.state.trim()) {
      errors["delivery.state"] = "State is required";
    }
    if (!formData.deliveryInfo.zip.trim()) {
      errors["delivery.zip"] = "ZIP code is required";
    }

    // Validate payment info
    if (formData.paymentInfo.method === "po" && !formData.paymentInfo.poNumber.trim()) {
      errors["payment.poNumber"] = "PO number is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.contactInfo.firstName &&
      formData.contactInfo.lastName &&
      formData.contactInfo.email &&
      formData.contactInfo.phone &&
      formData.contactInfo.institution &&
      formData.deliveryInfo.address &&
      formData.deliveryInfo.city &&
      formData.deliveryInfo.state &&
      formData.deliveryInfo.zip &&
      (formData.paymentInfo.method !== "po" || formData.paymentInfo.poNumber)
    );
  };

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "Delivery in 5-7 business days",
      price: 0,
      icon: Package,
    },
    {
      id: "expedited",
      name: "Expedited Shipping",
      description: "Delivery in 2-3 business days",
      price: 25,
      icon: Truck,
    },
    {
      id: "rush",
      name: "Rush Shipping",
      description: "Next business day delivery",
      price: 75,
      icon: Clock,
    },
  ];

  return (
    <div className="pb-wasatch-4">
      {/* Header */}
      <div className="mb-wasatch-6">
        <h2 className="text-wasatch-2xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-2">
          Checkout Information
        </h2>
        <p className="text-wasatch-text-secondary">
          Please provide your contact, delivery, and payment information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-wasatch-6">
        {/* Main Content - Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-wasatch-6">
          {/* Contact Information */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border">
              <div className="flex items-center gap-wasatch-2">
                <User className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Contact Information
                </h3>
              </div>
            </div>
            <div className="p-wasatch-4 space-y-wasatch-4">
              <div className="grid grid-cols-2 gap-wasatch-4">
                <div>
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    First Name <span className="text-wasatch-status-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.firstName}
                    onChange={(e) => handleContactChange("firstName", e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["contact.firstName"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="Enter first name"
                  />
                  {validationErrors["contact.firstName"] && (
                    <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                      {validationErrors["contact.firstName"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    Last Name <span className="text-wasatch-status-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.lastName}
                    onChange={(e) => handleContactChange("lastName", e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["contact.lastName"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="Enter last name"
                  />
                  {validationErrors["contact.lastName"] && (
                    <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                      {validationErrors["contact.lastName"]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Email Address <span className="text-wasatch-status-error">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
                  />
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    className={`w-full pl-wasatch-10 pr-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["contact.email"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="your.email@institution.edu"
                  />
                </div>
                {validationErrors["contact.email"] && (
                  <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                    {validationErrors["contact.email"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Phone Number <span className="text-wasatch-status-error">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
                  />
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    className={`w-full pl-wasatch-10 pr-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["contact.phone"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {validationErrors["contact.phone"] && (
                  <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                    {validationErrors["contact.phone"]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-wasatch-4">
                <div>
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    Institution <span className="text-wasatch-status-error">*</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
                    />
                    <input
                      type="text"
                      value={formData.contactInfo.institution}
                      onChange={(e) => handleContactChange("institution", e.target.value)}
                      className={`w-full pl-wasatch-10 pr-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                        validationErrors["contact.institution"]
                          ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                          : "border-wasatch-border-strong"
                      }`}
                      placeholder="University or Organization"
                    />
                  </div>
                  {validationErrors["contact.institution"] && (
                    <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                      {validationErrors["contact.institution"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.department}
                    onChange={(e) => handleContactChange("department", e.target.value)}
                    className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent"
                    placeholder="Department (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sample Delivery Address */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border">
              <div className="flex items-center gap-wasatch-2">
                <MapPin className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Sample Delivery Address
                </h3>
              </div>
            </div>
            <div className="p-wasatch-4 space-y-wasatch-4">
              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Address Line 1 <span className="text-wasatch-status-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.deliveryInfo.address}
                  onChange={(e) => handleDeliveryChange("address", e.target.value)}
                  className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                    validationErrors["delivery.address"]
                      ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                      : "border-wasatch-border-strong"
                  }`}
                  placeholder="Street address, building name"
                />
                {validationErrors["delivery.address"] && (
                  <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                    {validationErrors["delivery.address"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.deliveryInfo.addressLine2}
                  onChange={(e) => handleDeliveryChange("addressLine2", e.target.value)}
                  className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent"
                  placeholder="Apartment, suite, room number (optional)"
                />
              </div>

              <div className="grid grid-cols-3 gap-wasatch-4">
                <div className="col-span-1">
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    City <span className="text-wasatch-status-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryInfo.city}
                    onChange={(e) => handleDeliveryChange("city", e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["delivery.city"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="City"
                  />
                  {validationErrors["delivery.city"] && (
                    <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                      {validationErrors["delivery.city"]}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    State <span className="text-wasatch-status-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryInfo.state}
                    onChange={(e) => handleDeliveryChange("state", e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["delivery.state"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="State"
                  />
                  {validationErrors["delivery.state"] && (
                    <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                      {validationErrors["delivery.state"]}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    ZIP Code <span className="text-wasatch-status-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryInfo.zip}
                    onChange={(e) => handleDeliveryChange("zip", e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["delivery.zip"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="ZIP"
                  />
                  {validationErrors["delivery.zip"] && (
                    <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                      {validationErrors["delivery.zip"]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Country
                </label>
                <select
                  value={formData.deliveryInfo.country}
                  onChange={(e) => handleDeliveryChange("country", e.target.value)}
                  className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Delivery Instructions
                </label>
                <textarea
                  value={formData.deliveryInfo.instructions}
                  onChange={(e) => handleDeliveryChange("instructions", e.target.value)}
                  rows={3}
                  className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent resize-none"
                  placeholder="Any special delivery instructions (e.g., reception desk, loading dock, contact person)"
                />
              </div>
            </div>
          </div>

          {/* Shipping Preference */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border">
              <div className="flex items-center gap-2">
                <Truck className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Shipping Preference
                </h3>
              </div>
            </div>
            <div className="p-wasatch-4 space-y-wasatch-3">
              {shippingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.id}
                    className={`flex items-start gap-wasatch-3 p-wasatch-4 border-2 rounded-wasatch-md cursor-pointer transition-all ${
                      formData.shippingPreference === option.id
                        ? "border-wasatch-accent bg-wasatch-accent/10"
                        : "border-wasatch-border hover:border-wasatch-border-strong"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={formData.shippingPreference === option.id}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shippingPreference: e.target.value as "standard" | "expedited" | "rush",
                        }))
                      }
                      className="mt-1 w-4 h-4 text-wasatch-accent border-wasatch-border-strong focus:ring-wasatch-accent"
                    />
                    <Icon
                      size={20}
                      className={`mt-0.5 ${
                        formData.shippingPreference === option.id
                          ? "text-wasatch-accent"
                          : "text-wasatch-text-placeholder"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                          {option.name}
                        </span>
                        <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                          {option.price === 0 ? "Free" : `+$${option.price}`}
                        </span>
                      </div>
                      <p className="text-xs text-wasatch-text-secondary mt-wasatch-1">
                        {option.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Information */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border">
              <div className="flex items-center gap-2">
                <CreditCard className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Payment Information
                </h3>
              </div>
            </div>
            <div className="p-wasatch-4 space-y-wasatch-4">
              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-3">
                  Payment Method <span className="text-wasatch-status-error">*</span>
                </label>
                <div className="space-y-wasatch-2">
                  <label className="flex items-center gap-wasatch-3 p-wasatch-3 border-2 rounded-wasatch-md cursor-pointer transition-all hover:border-wasatch-border-strong">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="po"
                      checked={formData.paymentInfo.method === "po"}
                      onChange={(e) => handlePaymentChange("method", e.target.value)}
                      className="w-4 h-4 text-wasatch-accent border-wasatch-border-strong focus:ring-wasatch-accent"
                    />
                    <FileText size={18} className="text-wasatch-text-placeholder" />
                    <span className="text-wasatch-sm font-medium text-wasatch-text-heading">
                      Purchase Order (PO)
                    </span>
                  </label>

                  <label className="flex items-center gap-wasatch-3 p-wasatch-3 border-2 rounded-wasatch-md cursor-pointer transition-all hover:border-wasatch-border-strong">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="invoice"
                      checked={formData.paymentInfo.method === "invoice"}
                      onChange={(e) => handlePaymentChange("method", e.target.value)}
                      className="w-4 h-4 text-wasatch-accent border-wasatch-border-strong focus:ring-wasatch-accent"
                    />
                    <Calendar size={18} className="text-wasatch-text-placeholder" />
                    <span className="text-wasatch-sm font-medium text-wasatch-text-heading">
                      Invoice (Net 30)
                    </span>
                  </label>

                  <label className="flex items-center gap-wasatch-3 p-wasatch-3 border-2 rounded-wasatch-md cursor-pointer transition-all hover:border-wasatch-border-strong">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentInfo.method === "credit"}
                      onChange={(e) => handlePaymentChange("method", e.target.value)}
                      className="w-4 h-4 text-wasatch-accent border-wasatch-border-strong focus:ring-wasatch-accent"
                    />
                    <CreditCard size={18} className="text-wasatch-text-placeholder" />
                    <span className="text-wasatch-sm font-medium text-wasatch-text-heading">
                      Credit Account
                    </span>
                  </label>
                </div>
              </div>

              {formData.paymentInfo.method === "po" && (
                <div>
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    Purchase Order Number <span className="text-wasatch-status-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.paymentInfo.poNumber}
                    onChange={(e) => handlePaymentChange("poNumber", e.target.value)}
                    className={`w-full px-wasatch-3 py-wasatch-2 border rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent ${
                      validationErrors["payment.poNumber"]
                        ? "border-wasatch-status-error-border bg-wasatch-status-error-bg"
                        : "border-wasatch-border-strong"
                    }`}
                    placeholder="Enter PO number"
                  />
                  {validationErrors["payment.poNumber"] && (
                    <p className="text-wasatch-xs text-wasatch-status-error mt-wasatch-1">
                      {validationErrors["payment.poNumber"]}
                    </p>
                  )}
                </div>
              )}

              {formData.paymentInfo.method === "credit" && (
                <div>
                  <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.paymentInfo.accountNumber}
                    onChange={(e) => handlePaymentChange("accountNumber", e.target.value)}
                    className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent"
                    placeholder="Enter account number"
                  />
                </div>
              )}

              <div>
                <label className="block text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary mb-wasatch-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.paymentInfo.notes}
                  onChange={(e) => handlePaymentChange("notes", e.target.value)}
                  rows={3}
                  className="w-full px-wasatch-3 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm text-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent resize-none"
                  placeholder="Any additional notes or special instructions"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary (1/3 width, sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
              <div className="p-wasatch-4 border-b border-wasatch-border">
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Information Summary
                </h3>
              </div>

              <div className="p-wasatch-4 space-y-wasatch-4">
                {/* Contact Summary */}
                <div>
                  <div className="flex items-center gap-wasatch-2 mb-wasatch-2">
                    <User size={16} className="text-wasatch-accent" />
                    <h4 className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">Contact</h4>
                  </div>
                  <div className="pl-wasatch-6 space-y-wasatch-1">
                    {formData.contactInfo.firstName && formData.contactInfo.lastName ? (
                      <p className="text-wasatch-sm text-wasatch-text-secondary">
                        {formData.contactInfo.firstName} {formData.contactInfo.lastName}
                      </p>
                    ) : (
                      <p className="text-wasatch-xs text-wasatch-text-placeholder italic">Name not provided</p>
                    )}
                    {formData.contactInfo.email ? (
                      <p className="text-wasatch-xs text-wasatch-text-secondary">{formData.contactInfo.email}</p>
                    ) : (
                      <p className="text-wasatch-xs text-wasatch-text-placeholder italic">Email not provided</p>
                    )}
                    {formData.contactInfo.phone && (
                      <p className="text-wasatch-xs text-wasatch-text-secondary">{formData.contactInfo.phone}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Summary */}
                <div className="pt-wasatch-3 border-t border-wasatch-border">
                  <div className="flex items-center gap-wasatch-2 mb-wasatch-2">
                    <MapPin size={16} className="text-wasatch-accent" />
                    <h4 className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">Delivery</h4>
                  </div>
                  <div className="pl-wasatch-6 space-y-wasatch-1">
                    {formData.deliveryInfo.address ? (
                      <>
                        <p className="text-wasatch-sm text-wasatch-text-secondary">
                          {formData.deliveryInfo.address}
                        </p>
                        {formData.deliveryInfo.addressLine2 && (
                          <p className="text-wasatch-sm text-wasatch-text-secondary">
                            {formData.deliveryInfo.addressLine2}
                          </p>
                        )}
                        {formData.deliveryInfo.city && formData.deliveryInfo.state && (
                          <p className="text-wasatch-sm text-wasatch-text-secondary">
                            {formData.deliveryInfo.city}, {formData.deliveryInfo.state}{" "}
                            {formData.deliveryInfo.zip}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-wasatch-xs text-wasatch-text-placeholder italic">Address not provided</p>
                    )}
                  </div>
                </div>

                {/* Shipping Summary */}
                <div className="pt-wasatch-3 border-t border-wasatch-border">
                  <div className="flex items-center gap-wasatch-2 mb-wasatch-2">
                    <Truck size={16} className="text-wasatch-accent" />
                    <h4 className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">Shipping</h4>
                  </div>
                  <div className="pl-wasatch-6">
                    <p className="text-wasatch-sm text-wasatch-text-secondary">
                      {shippingOptions.find((opt) => opt.id === formData.shippingPreference)
                        ?.name || "Not selected"}
                    </p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="pt-wasatch-3 border-t border-wasatch-border">
                  <div className="flex items-center gap-wasatch-2 mb-wasatch-2">
                    <CreditCard size={16} className="text-wasatch-accent" />
                    <h4 className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">Payment</h4>
                  </div>
                  <div className="pl-wasatch-6">
                    <p className="text-wasatch-sm text-wasatch-text-secondary">
                      {formData.paymentInfo.method === "po"
                        ? "Purchase Order"
                        : formData.paymentInfo.method === "invoice"
                        ? "Invoice (Net 30)"
                        : "Credit Account"}
                    </p>
                    {formData.paymentInfo.method === "po" &&
                      formData.paymentInfo.poNumber && (
                        <p className="text-wasatch-xs text-wasatch-text-secondary mt-wasatch-1">
                          PO: {formData.paymentInfo.poNumber}
                        </p>
                      )}
                  </div>
                </div>

                {/* Validation Status */}
                <div className="pt-wasatch-3 border-t border-wasatch-border">
                  {isFormValid() ? (
                    <div className="flex items-start gap-wasatch-2 p-wasatch-3 bg-wasatch-status-success-bg border border-wasatch-status-success-border rounded-wasatch-md">
                      <CheckCircle2 size={16} className="text-wasatch-status-success mt-0.5 flex-shrink-0" />
                      <p className="text-wasatch-xs text-wasatch-status-success">
                        All required information provided
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-wasatch-2 p-wasatch-3 bg-wasatch-status-warning-bg border border-wasatch-status-warning-border rounded-wasatch-md">
                      <AlertCircle size={16} className="text-wasatch-status-warning mt-0.5 flex-shrink-0" />
                      <p className="text-wasatch-xs text-wasatch-status-warning">
                        Please complete all required fields
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="mt-wasatch-4 border border-wasatch-border rounded-wasatch-md bg-gradient-to-br from-wasatch-status-info-bg to-wasatch-accent/10 p-wasatch-4">
              <div className="flex items-start gap-wasatch-3">
                <AlertCircle size={20} className="text-wasatch-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading mb-wasatch-1">
                    Secure Checkout
                  </h4>
                  <p className="text-wasatch-xs text-wasatch-text-secondary">
                    Your information is encrypted and secure. We never share your data
                    with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
