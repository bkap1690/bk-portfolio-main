import { useState } from "react";
import { 
  CheckCircle2, 
  Edit, 
  Package, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
} from "lucide-react";
import { orderTypes } from "../data/orderTypes";
import type { OrderSamples } from "./SampleDetailsStep";

interface ReviewConfirmStepProps {
  selectedOrderTypeIds: string[];
  orderSamples: OrderSamples;
  onEditStep: (stepId: number) => void;
}

// Mock pricing structure - in a real app, this would come from an API
const getPricing = (orderTypeId: string, sampleCount: number) => {
  const basePrices: { [key: string]: number } = {
    "direct-rna-sequencing": 450,
    "targeted-dna-methylation": 380,
    "pcr-amplicon-sequencing": 280,
    "whole-genome-sequencing": 850,
    "pcr-cdna-sequencing": 320,
  };

  const basePrice = basePrices[orderTypeId] || 300;
  const perSamplePrice = basePrice;
  const subtotal = perSamplePrice * sampleCount;
  
  // Volume discount
  let discount = 0;
  if (sampleCount >= 10) {
    discount = subtotal * 0.15; // 15% discount for 10+ samples
  } else if (sampleCount >= 5) {
    discount = subtotal * 0.10; // 10% discount for 5-9 samples
  }

  return {
    basePrice: perSamplePrice,
    subtotal,
    discount,
    total: subtotal - discount,
  };
};

export default function ReviewConfirmStep({
  selectedOrderTypeIds,
  orderSamples,
  onEditStep,
}: ReviewConfirmStepProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(selectedOrderTypeIds)
  );
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [rushProcessing, setRushProcessing] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getOrderTypeName = (id: string) => {
    const orderType = orderTypes.find((ot) => ot.id === id);
    return orderType?.name || id;
  };

  const getTotalSamples = () => {
    return Object.values(orderSamples).reduce(
      (total, samples) => total + samples.length,
      0
    );
  };

  const calculateGrandTotal = () => {
    let subtotal = 0;
    let totalDiscount = 0;

    selectedOrderTypeIds.forEach((orderTypeId) => {
      const samples = orderSamples[orderTypeId] || [];
      const pricing = getPricing(orderTypeId, samples.length);
      subtotal += pricing.subtotal;
      totalDiscount += pricing.discount;
    });

    const processingFee = 50;
    const rushFee = rushProcessing ? 150 : 0;
    const grandTotal = subtotal - totalDiscount + processingFee + rushFee;

    return {
      subtotal,
      totalDiscount,
      processingFee,
      rushFee,
      grandTotal,
    };
  };

  const totals = calculateGrandTotal();

  // Mock data for contact and delivery info
  const contactInfo = {
    name: "Dr. Sarah Chen",
    email: "s.chen@university.edu",
    phone: "+1 (555) 123-4567",
    institution: "University Research Lab",
  };

  const deliveryInfo = {
    address: "123 Research Drive, Building A, Room 401",
    city: "Cambridge",
    state: "MA",
    zip: "02139",
    instructions: "Please deliver to the main reception desk",
  };

  const estimatedCompletion = rushProcessing ? "5-7 business days" : "10-14 business days";
  const orderDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="pb-wasatch-4">
      {/* Header */}
      <div className="mb-wasatch-6">
        <h2 className="text-wasatch-2xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-2">
          Review & Confirm Order
        </h2>
        <p className="text-wasatch-text-secondary">
          Please review your order details carefully before submitting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-wasatch-6">
        {/* Main Content - Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-wasatch-6">
          {/* Order Overview */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border flex items-center justify-between">
              <div className="flex items-center gap-wasatch-2">
                <Package className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Order Overview
                </h3>
              </div>
              <button
                onClick={() => onEditStep(1)}
                className="flex items-center gap-wasatch-1 text-wasatch-sm text-wasatch-accent hover:text-wasatch-accent-hover transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
            <div className="p-wasatch-4 space-y-wasatch-3">
              <div className="flex items-center justify-between text-wasatch-sm">
                <span className="text-wasatch-text-secondary">Total Order Types:</span>
                <span className="font-wasatch-medium text-wasatch-text-heading">
                  {selectedOrderTypeIds.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-wasatch-sm">
                <span className="text-wasatch-text-secondary">Total Samples:</span>
                <span className="font-wasatch-medium text-wasatch-text-heading">
                  {getTotalSamples()}
                </span>
              </div>
              <div className="flex items-center justify-between text-wasatch-sm">
                <span className="text-wasatch-text-secondary">Order Date:</span>
                <span className="font-wasatch-medium text-wasatch-text-heading">{orderDate}</span>
              </div>
              <div className="flex items-center justify-between text-wasatch-sm">
                <span className="text-wasatch-text-secondary">Estimated Completion:</span>
                <span className="font-wasatch-medium text-wasatch-text-heading">
                  {estimatedCompletion}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border flex items-center justify-between">
              <div className="flex items-center gap-wasatch-2">
                <User className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Contact Information
                </h3>
              </div>
              <button
                onClick={() => onEditStep(4)}
                className="flex items-center gap-wasatch-1 text-wasatch-sm text-wasatch-accent hover:text-wasatch-accent-hover transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
            <div className="p-wasatch-4 space-y-wasatch-3">
              <div className="flex items-start gap-wasatch-3">
                <User size={16} className="text-wasatch-text-placeholder mt-0.5" />
                <div>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">Name</p>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                    {contactInfo.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-wasatch-text-placeholder mt-0.5" />
                <div>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">Email</p>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                    {contactInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-wasatch-text-placeholder mt-0.5" />
                <div>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">Phone</p>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                    {contactInfo.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package size={16} className="text-wasatch-text-placeholder mt-0.5" />
                <div>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">Institution</p>
                  <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                    {contactInfo.institution}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Sample Delivery Address
                </h3>
              </div>
              <button
                onClick={() => onEditStep(4)}
                className="flex items-center gap-wasatch-1 text-wasatch-sm text-wasatch-accent hover:text-wasatch-accent-hover transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
            <div className="p-wasatch-4 space-y-wasatch-2">
              <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                {deliveryInfo.address}
              </p>
              <p className="text-wasatch-sm text-wasatch-text-heading">
                {deliveryInfo.city}, {deliveryInfo.state} {deliveryInfo.zip}
              </p>
              {deliveryInfo.instructions && (
                <div className="mt-wasatch-3 pt-wasatch-3 border-t border-wasatch-border">
                  <p className="text-wasatch-xs text-wasatch-text-secondary mb-wasatch-1">
                    Delivery Instructions:
                  </p>
                  <p className="text-wasatch-sm text-wasatch-text-secondary">
                    {deliveryInfo.instructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Details by Type */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Order Details
                </h3>
              </div>
              <button
                onClick={() => onEditStep(2)}
                className="flex items-center gap-wasatch-1 text-wasatch-sm text-wasatch-accent hover:text-wasatch-accent-hover transition-colors"
              >
                <Edit size={16} />
                Edit Samples
              </button>
            </div>

            {selectedOrderTypeIds.map((orderTypeId, index) => {
              const samples = orderSamples[orderTypeId] || [];
              const isExpanded = expandedSections.has(orderTypeId);
              const pricing = getPricing(orderTypeId, samples.length);

              return (
                <div
                  key={orderTypeId}
                  className={`${
                    index > 0 ? "border-t border-wasatch-border" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleSection(orderTypeId)}
                    className="w-full p-wasatch-4 flex items-center justify-between hover:bg-wasatch-surface-subtle transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-wasatch-text-placeholder" />
                      ) : (
                        <ChevronDown size={20} className="text-wasatch-text-placeholder" />
                      )}
                      <div className="text-left">
                        <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                          {getOrderTypeName(orderTypeId)}
                        </p>
                        <p className="text-wasatch-xs text-wasatch-text-secondary">
                          {samples.length} sample{samples.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                        ${pricing.total.toFixed(2)}
                      </p>
                      {pricing.discount > 0 && (
                        <p className="text-wasatch-xs text-wasatch-status-success">
                          Saved ${pricing.discount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </button>

                  {isExpanded && samples.length > 0 && (
                    <div className="px-wasatch-4 pb-wasatch-4">
                      <div className="bg-wasatch-surface-subtle rounded-wasatch-md p-wasatch-3 space-y-wasatch-2">
                        <div className="flex items-center justify-between text-wasatch-xs font-wasatch-medium text-wasatch-text-secondary pb-wasatch-2 border-b border-wasatch-border">
                          <span>Sample ID</span>
                          <span>Species</span>
                          <span>Type</span>
                          <span>Nucleic Acid</span>
                        </div>
                        {samples.slice(0, 5).map((sample) => (
                          <div
                            key={sample.id}
                            className="flex items-center justify-between text-wasatch-xs text-wasatch-text-secondary py-wasatch-1"
                          >
                            <span className="font-medium">
                              {sample.sampleId || "-"}
                            </span>
                            <span>{sample.sourceSpecies || "-"}</span>
                            <span>{sample.specimenType || "-"}</span>
                            <span>{sample.nucleicAcid || "-"}</span>
                          </div>
                        ))}
                        {samples.length > 5 && (
                          <p className="text-wasatch-xs text-wasatch-text-muted text-center pt-wasatch-2">
                            +{samples.length - 5} more sample{samples.length - 5 !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Processing Options */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4 border-b border-wasatch-border">
              <div className="flex items-center gap-2">
                <Clock className="text-wasatch-accent" size={20} />
                <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                  Processing Options
                </h3>
              </div>
            </div>
            <div className="p-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rushProcessing}
                  onChange={(e) => setRushProcessing(e.target.checked)}
                  className="mt-1 w-4 h-4 text-wasatch-accent border-wasatch-border-strong rounded focus:ring-wasatch-accent"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading group-hover:text-wasatch-accent transition-colors">
                      Rush Processing
                    </span>
                    <span className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                      +$150.00
                    </span>
                  </div>
                  <p className="text-wasatch-xs text-wasatch-text-secondary mt-wasatch-1">
                    Expedite your order with priority processing (5-7 business days)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
            <div className="p-wasatch-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-wasatch-accent border-wasatch-border-strong rounded focus:ring-wasatch-accent"
                />
                <div className="flex-1">
                  <span className="text-wasatch-sm text-wasatch-text-secondary">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-wasatch-accent hover:text-wasatch-accent-hover underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-wasatch-accent hover:text-wasatch-accent-hover underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Sample Submission Guidelines
                    </a>
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Price Summary (1/3 width, sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="border border-wasatch-border rounded-wasatch-md bg-wasatch-surface">
              <div className="p-wasatch-4 border-b border-wasatch-border">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-wasatch-accent" size={20} />
                  <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading">
                    Order Summary
                  </h3>
                </div>
              </div>

              <div className="p-wasatch-4 space-y-wasatch-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-wasatch-text-secondary">Subtotal</span>
                  <span className="font-wasatch-medium text-wasatch-text-heading">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Volume Discount */}
                {totals.totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-wasatch-status-success">Volume Discount</span>
                    <span className="font-wasatch-medium text-wasatch-status-success">
                      -${totals.totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Processing Fee */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-wasatch-text-secondary">Processing Fee</span>
                  <span className="font-wasatch-medium text-wasatch-text-heading">
                    ${totals.processingFee.toFixed(2)}
                  </span>
                </div>

                {/* Rush Processing Fee */}
                {rushProcessing && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-wasatch-text-secondary">Rush Processing</span>
                    <span className="font-wasatch-medium text-wasatch-text-heading">
                      ${totals.rushFee.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-wasatch-border pt-wasatch-3">
                  <div className="flex items-center justify-between">
                    <span className="text-wasatch-base font-wasatch-medium text-wasatch-text-heading">
                      Total
                    </span>
                    <span className="text-wasatch-xl font-wasatch-semibold text-wasatch-accent">
                      ${totals.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Discount Info Badge */}
                {getTotalSamples() >= 5 && getTotalSamples() < 10 && (
                  <div className="bg-wasatch-status-success-bg border border-wasatch-status-success-border rounded-wasatch-md p-wasatch-3 mt-wasatch-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-wasatch-status-success mt-0.5 flex-shrink-0"
                      />
                        <p className="text-wasatch-xs text-wasatch-status-success">
                        You're saving 10% with our volume discount!
                      </p>
                    </div>
                  </div>
                )}

                {getTotalSamples() >= 10 && (
                  <div className="bg-wasatch-status-success-bg border border-wasatch-status-success-border rounded-wasatch-md p-wasatch-3 mt-wasatch-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-wasatch-status-success mt-0.5 flex-shrink-0"
                      />
                        <p className="text-wasatch-xs text-wasatch-status-success">
                        You're saving 15% with our volume discount!
                      </p>
                    </div>
                  </div>
                )}

                {getTotalSamples() < 5 && getTotalSamples() > 0 && (
                    <div className="bg-wasatch-status-info-bg border border-wasatch-status-info-border rounded-wasatch-md p-wasatch-3 mt-wasatch-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={16}
                        className="text-wasatch-status-info mt-0.5 flex-shrink-0"
                      />
                        <p className="text-wasatch-xs text-wasatch-status-info">
                        Add {5 - getTotalSamples()} more sample{5 - getTotalSamples() !== 1 ? "s" : ""} to save 10%
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="p-wasatch-4 border-t border-wasatch-border">
                <button
                  disabled={!agreeToTerms}
                  className={`w-full py-wasatch-3 px-wasatch-4 rounded-wasatch-sm text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse transition-all duration-200 ${
                    agreeToTerms
                      ? "bg-wasatch-accent hover:bg-wasatch-accent-hover hover:shadow-lg cursor-pointer"
                      : "bg-wasatch-neutral-300 cursor-not-allowed"
                  }`}
                >
                  {agreeToTerms ? "Submit Order Request" : "Accept Terms to Continue"}
                </button>
                {!agreeToTerms && (
                  <p className="text-wasatch-xs text-wasatch-text-muted text-center mt-wasatch-2">
                    Please accept the terms and conditions
                  </p>
                )}
              </div>
            </div>

            {/* Help Card */}
            <div className="mt-wasatch-4 border border-wasatch-border rounded-wasatch-md bg-gradient-to-br from-wasatch-accent/10 to-wasatch-status-info-bg p-wasatch-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-wasatch-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-wasatch-sm font-wasatch-medium text-wasatch-text-heading mb-wasatch-1">
                    Need Help?
                  </h4>
                  <p className="text-wasatch-xs text-wasatch-text-secondary mb-wasatch-2">
                    Our team is here to assist you with your order
                  </p>
                  <a
                    href="#"
                    className="text-xs text-wasatch-accent hover:text-wasatch-accent-hover font-medium"
                    onClick={(e) => e.preventDefault()}
                  >
                    Contact Support →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
