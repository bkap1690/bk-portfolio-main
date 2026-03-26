import { useState } from "react";
import { ChevronDown, Search, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import TabBar from "../components/TabBar";
import { ordersData } from "../data/ordersData";

interface OrdersPageProps {
  onOrderClick: (orderId: string) => void;
  onCreateOrder?: () => void;
}

export default function OrdersPage({ onOrderClick, onCreateOrder }: OrdersPageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statusColorClasses = {
    blue: "bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border",
    orange: "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border",
    purple: "bg-wasatch-status-purple-bg text-wasatch-status-purple border-wasatch-status-purple-border",
    green: "bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border",
    red: "bg-wasatch-status-error-bg text-wasatch-status-error border-wasatch-status-error-border",
    yellow: "bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border",
  };

  return (
    <div className="min-h-screen bg-wasatch-surface">
      {/* Breadcrumb */}
      <div className="border-b border-wasatch-border bg-wasatch-surface px-wasatch-6 py-wasatch-4">
        <div className="flex items-center gap-wasatch-2 text-wasatch-sm text-wasatch-text-secondary">
          <span className="cursor-pointer hover:text-wasatch-primary">Home</span>
          <span>›</span>
          <span className="font-wasatch-medium text-wasatch-text-heading">Orders</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="px-wasatch-6 py-wasatch-6">
        <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-6">Orders</h1>

        {/* Tabs */}
        <TabBar
          className="mb-wasatch-6"
          tabs={[
            { id: "all", label: "All Orders" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
            { id: "archived", label: "Archived" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Filters */}
        <div className="flex items-center gap-wasatch-3 mb-wasatch-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
              size={18}
            />
            <input
              type="text"
              placeholder="Placeholder text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface py-wasatch-2 pl-wasatch-10 pr-wasatch-4 text-wasatch-sm focus:border-wasatch-accent focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle">
            <Calendar size={16} />
            Dates
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle">
            Protocol
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle">
            Status
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-wasatch-2 rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface px-wasatch-4 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle">
            Payment
            <ChevronDown size={16} />
          </button>
          <button 
            onClick={onCreateOrder}
            className="rounded-wasatch-sm bg-wasatch-accent px-wasatch-6 py-wasatch-2 text-wasatch-sm font-wasatch-medium text-wasatch-text-inverse transition-colors hover:bg-wasatch-accent-hover"
          >
            Create Order
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
          <table className="w-full">
            <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
              <tr>
                <th className="px-wasatch-4 py-wasatch-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded-wasatch-sm border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent"
                  />
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Order ID
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Company
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  <div className="flex items-center gap-wasatch-1">
                    Order Status
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  <div className="flex items-center gap-wasatch-1">
                    Type
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  <div className="flex items-center gap-wasatch-1">
                    Specimen
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  <div className="flex items-center gap-wasatch-1">
                    Payment Status
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  <div className="flex items-center gap-wasatch-1">
                    Date Created
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-wasatch-border"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {ordersData.orders.map((order) => (
                <motion.tr
                  key={order.id}
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
                  }}
                  className="hover:bg-wasatch-surface-subtle transition-colors cursor-pointer"
                  onClick={() => onOrderClick(order.orderNumber)}
                >
                  <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded-wasatch-sm border-wasatch-border-strong text-wasatch-accent focus:ring-wasatch-accent"
                    />
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm font-wasatch-medium text-wasatch-text-heading">
                    {order.orderNumber}
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                    {order.company}
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
                    <span
                      className={`inline-flex items-center rounded-wasatch-full border px-wasatch-3 py-wasatch-1 text-wasatch-xs font-wasatch-medium ${
                        statusColorClasses[order.orderStatusColor]
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                    {order.type}
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                    {order.specimen}
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                    {order.paymentStatus}
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary">
                    {order.dateCreated}
                  </td>
                  <td className="px-wasatch-4 py-wasatch-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOrderClick(order.orderNumber)}
                      className="rounded-wasatch-sm border border-wasatch-border-strong px-wasatch-3 py-wasatch-1 text-wasatch-sm font-wasatch-medium text-wasatch-text-secondary transition-colors hover:bg-wasatch-surface-subtle"
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-wasatch-neutral-800 py-wasatch-4 text-center text-wasatch-sm text-wasatch-text-inverse mt-auto">
        © 2024 Wasatch BioLabs. All rights reserved
      </footer>
    </div>
  );
}
