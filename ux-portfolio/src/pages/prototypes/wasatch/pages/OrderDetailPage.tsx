import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { getOrderDetail } from "../data/ordersData";
import { getResultsByOrderId } from "../data/resultsData";
import TabBar from "../components/TabBar";

interface OrderDetailPageProps {
  orderNumber: string;
  onResultClick?: (resultId: string) => void;
}

export default function OrderDetailPage({ orderNumber, onResultClick }: OrderDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "samples" | "tests" | "results" | "documents" | "activity">("overview");
  
  const orderDetail = getOrderDetail(orderNumber);

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-wasatch-surface p-wasatch-6">
        <p className="text-wasatch-text-secondary">Order not found</p>
      </div>
    );
  }

  // Placeholder image component for RNA sequencing
  const RNASequencingImage = () => (
    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-wasatch-accent rounded-wasatch-md flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 20 L12 16 L16 24 L20 12 L24 20 L28 16 L32 20" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="16" r="2" fill="white"/>
        <circle cx="16" cy="24" r="2" fill="white"/>
        <circle cx="20" cy="12" r="2" fill="white"/>
        <circle cx="24" cy="20" r="2" fill="white"/>
        <circle cx="28" cy="16" r="2" fill="white"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-wasatch-surface">
      {/* Breadcrumb */}
      <div className="border-b border-wasatch-border bg-wasatch-surface px-wasatch-6 py-wasatch-4">
        <div className="flex items-center gap-wasatch-2 text-wasatch-sm text-wasatch-text-secondary">
          <span className="cursor-pointer hover:text-wasatch-primary">Home</span>
          <span>›</span>
          <span className="cursor-pointer hover:text-wasatch-primary">Orders</span>
          <span>›</span>
          <span className="font-wasatch-medium text-wasatch-text-heading">{orderDetail.orderNumber}</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-wasatch-border px-wasatch-6 py-wasatch-6">
        <div className="flex items-center justify-between mb-wasatch-6">
          <div className="flex items-center gap-wasatch-4">
            <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading">{orderDetail.orderNumber}</h1>
            <span className="inline-flex items-center rounded-wasatch-full border border-wasatch-status-success-border bg-wasatch-status-success-bg px-wasatch-3 py-wasatch-1 text-wasatch-sm font-wasatch-medium text-wasatch-status-success">
              <span className="mr-1">✓</span> {orderDetail.orderStatus}
            </span>
          </div>
          <button className="rounded-wasatch-sm p-wasatch-2 transition-colors hover:bg-wasatch-surface-subtle">
            <MoreVertical size={20} className="text-wasatch-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <TabBar
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "samples", label: "Samples" },
            { id: "tests", label: "Tests" },
            { id: "results", label: "Results & Reporting" },
            { id: "documents", label: "Documents & Protocols" },
            { id: "activity", label: "Activity Log" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Content */}
      <div className="px-wasatch-6 py-wasatch-6">
        {activeTab === "results" ? (
          <OrderResultsTab
            orderId={orderNumber}
            onResultClick={onResultClick}
          />
        ) : activeTab === "overview" ? (
        <div className="grid grid-cols-3 gap-wasatch-6">
          {/* Left Column - Order Summary */}
          <div className="col-span-2">
            <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6">
              <div className="flex items-center justify-between mb-wasatch-6">
                <h2 className="text-wasatch-xl font-wasatch-medium text-wasatch-text-heading">Order Summary</h2>
                <div className="flex items-center gap-wasatch-4">
                  <span className="text-wasatch-sm text-wasatch-text-secondary">
                    Order Date: <span className="font-wasatch-medium text-wasatch-text-heading">{orderDetail.orderDate}</span>
                  </span>
                  <button className="rounded-wasatch-sm p-wasatch-2 transition-colors hover:bg-wasatch-surface-subtle">
                    <MoreVertical size={20} className="text-wasatch-text-secondary" />
                  </button>
                </div>
              </div>

              <div className="mb-wasatch-4">
                <p className="text-wasatch-sm text-wasatch-text-secondary mb-wasatch-2">
                  Total items: <span className="font-wasatch-medium text-wasatch-text-heading">{orderDetail.totalItems}</span>
                </p>
              </div>

              {/* Order Items */}
              <div className="space-y-wasatch-4">
                {orderDetail.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-wasatch-4 p-wasatch-4 rounded-wasatch-md border border-wasatch-border bg-wasatch-surface-subtle"
                  >
                    <RNASequencingImage />
                    <div className="flex-1">
                      <h3 className="font-wasatch-medium text-wasatch-text-heading mb-wasatch-1">{item.name}</h3>
                      <div className="grid grid-cols-3 gap-wasatch-4 text-wasatch-sm text-wasatch-text-secondary">
                        <div>
                          <span className="block">Quantity: <span className="font-wasatch-medium text-wasatch-text-heading">{item.quantity}</span></span>
                        </div>
                        <div>
                          <span className="block">Total Batches: <span className="font-wasatch-medium text-wasatch-text-heading">{item.totalBatches}</span></span>
                        </div>
                        <div>
                          <span className="block">Total Samples: <span className="font-wasatch-medium text-wasatch-text-heading">{item.totalSamples}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Account Information, Shipping, Billing */}
          <div className="space-y-wasatch-6">
            {/* Account Information */}
            <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6">
              <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-4">Account Information</h3>
              <div className="space-y-wasatch-2 text-wasatch-sm">
                <div>
                  <span className="text-wasatch-text-secondary">Company:</span>
                  <p className="font-wasatch-medium text-wasatch-text-heading">{orderDetail.accountInfo.company}</p>
                </div>
                <div>
                  <span className="text-wasatch-text-secondary">Created By:</span>
                  <p className="font-wasatch-medium text-wasatch-text-heading">{orderDetail.accountInfo.createdBy}</p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6">
              <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-4">Shipping</h3>
              <div className="space-y-wasatch-1 text-wasatch-sm text-wasatch-text-heading">
                <p className="font-wasatch-medium">{orderDetail.shipping.companyName}</p>
                <p>{orderDetail.shipping.addressLine1}</p>
                <p>{orderDetail.shipping.addressLine2}</p>
                <p>{orderDetail.shipping.cityStateZip}</p>
              </div>
            </div>

            {/* Billing */}
            <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6">
              <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-4">Billing</h3>
              <div className="space-y-wasatch-1 text-wasatch-sm text-wasatch-text-heading">
                <p className="font-wasatch-medium">{orderDetail.billing.companyName}</p>
                <p>{orderDetail.billing.addressLine1}</p>
                <p>{orderDetail.billing.addressLine2}</p>
                <p>{orderDetail.billing.cityStateZip}</p>
              </div>
            </div>

            {/* Need Assistance */}
            <div className="bg-wasatch-surface rounded-wasatch-md border border-wasatch-border p-wasatch-6">
              <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-2">Need Assistance?</h3>
              <a
                href="#"
                className="text-sm text-wasatch-primary hover:text-wasatch-primary-hover transition-colors"
              >
                Contact Help & Support
              </a>
            </div>
          </div>
        </div>
        ) : (
          <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 text-center text-wasatch-text-muted">
            {activeTab === "samples" && "Samples will be displayed here."}
            {activeTab === "tests" && "Tests will be displayed here."}
            {activeTab === "documents" && "Documents & Protocols will be displayed here."}
            {activeTab === "activity" && "Activity log will be displayed here."}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-wasatch-neutral-800 py-wasatch-4 text-center text-wasatch-sm text-wasatch-text-inverse mt-auto">
        © 2024 Wasatch BioLabs. All rights reserved
      </footer>
    </div>
  );
}

function OrderResultsTab({
  orderId,
  onResultClick,
}: {
  orderId: string;
  onResultClick?: (resultId: string) => void;
}) {
  const results = getResultsByOrderId(orderId);

  if (results.length === 0) {
    return (
      <div className="rounded-wasatch-md border border-wasatch-border bg-wasatch-surface p-wasatch-8 text-center text-wasatch-text-muted">
        No results for this order yet.
      </div>
    );
  }

  const statusColorClasses: Record<string, string> = {
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info",
    orange: "bg-wasatch-status-warning-bg text-wasatch-status-warning",
    purple: "bg-wasatch-status-purple-bg text-wasatch-status-purple",
    green: "bg-wasatch-status-success-bg text-wasatch-status-success",
    red: "bg-wasatch-status-error-bg text-wasatch-status-error",
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning",
  };

  return (
    <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
      <table className="w-full">
        <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
          <tr>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Result ID
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Protocol Type
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Date Conducted
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Status
            </th>
            <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-wasatch-border">
          {results.map((result) => (
            <tr key={result.id} className="hover:bg-wasatch-surface-subtle">
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                {result.id}
              </td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                {result.protocolType}
              </td>
              <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                {result.dateConducted}
              </td>
              <td className="px-wasatch-4 py-wasatch-3">
                <span
                  className={`inline-flex items-center rounded-wasatch-full px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${statusColorClasses[result.statusColor]}`}
                >
                  {result.status}
                </span>
              </td>
              <td className="px-wasatch-4 py-wasatch-3">
                {onResultClick ? (
                  <button
                    onClick={() => onResultClick(result.id)}
                    className="text-wasatch-sm font-wasatch-medium text-wasatch-primary hover:text-wasatch-primary-hover"
                  >
                    View Result
                  </button>
                ) : (
                  <span className="text-wasatch-sm text-wasatch-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
