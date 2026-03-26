import type { OrderType } from "../data/orderTypes";

interface OrderTypeCardProps {
  orderType: OrderType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function OrderTypeCard({
  orderType,
  isSelected,
  onSelect,
}: OrderTypeCardProps) {
  return (
    <div
      onClick={() => onSelect(orderType.id)}
      className={`relative rounded-wasatch-md border-2 p-wasatch-6 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-wasatch-accent bg-wasatch-accent/10"
          : "border-wasatch-border bg-wasatch-surface hover:shadow-md"
      }`}
    >
      {/* Radio Button */}
      <div className="absolute top-wasatch-6 left-wasatch-6">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? "border-wasatch-accent bg-wasatch-accent"
              : "border-wasatch-border-strong bg-wasatch-surface"
          }`}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-wasatch-full bg-wasatch-surface" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pl-wasatch-8">
        <h3 className="text-wasatch-lg font-wasatch-medium text-wasatch-text-heading mb-wasatch-3">
          {orderType.name}
        </h3>
        <ul className="space-y-wasatch-2">
          {orderType.description.map((point, index) => (
            <li key={index} className="text-wasatch-sm text-wasatch-text-secondary flex items-start">
              <span className="mr-wasatch-2 mt-1.5 flex-shrink-0">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

