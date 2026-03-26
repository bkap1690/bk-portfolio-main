import { useState } from "react";
import { Search } from "lucide-react";
import { orderTypes } from "../data/orderTypes";
import OrderTypeCard from "./OrderTypeCard";

interface OrderTypeStepProps {
  selectedOrderTypes: Set<string>;
  onOrderTypeToggle: (id: string) => void;
}

export default function OrderTypeStep({
  selectedOrderTypes,
  onOrderTypeToggle,
}: OrderTypeStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter order types based on search query
  const filteredOrderTypes = orderTypes.filter(
    (orderType) =>
      searchQuery === "" ||
      orderType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderType.description.some((desc) =>
        desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="space-y-wasatch-6">
      {/* Header */}
      <div>
        <h2 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-2">
          Choose Order Types
        </h2>
        <p className="text-wasatch-sm text-wasatch-text-secondary">
          Please select the order types you wish to submit
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search
          className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
          size={18}
        />
        <input
          type="text"
          placeholder="Search for order types"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-wasatch-sm border border-wasatch-border-strong bg-wasatch-surface py-wasatch-2 pl-wasatch-10 pr-wasatch-4 text-wasatch-sm focus:border-wasatch-accent focus:outline-none focus:ring-1 focus:ring-wasatch-accent"
        />
      </div>

      {/* Order Type Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-wasatch-4">
        {filteredOrderTypes.map((orderType) => (
          <OrderTypeCard
            key={orderType.id}
            orderType={orderType}
            isSelected={selectedOrderTypes.has(orderType.id)}
            onSelect={onOrderTypeToggle}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredOrderTypes.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-wasatch-text-muted">
            No order types found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

