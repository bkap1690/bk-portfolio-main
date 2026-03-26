import { useRef, useEffect, useState } from "react";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
}

interface TabBarProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
}

export default function TabBar<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabBarProps<T>) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateUnderline = () => {
      const btn = tabRefs.current.get(activeTab);
      if (btn) {
        const container = btn.parentElement;
        if (container) {
          const containerLeft = container.getBoundingClientRect().left;
          setUnderline({
            left: btn.getBoundingClientRect().left - containerLeft,
            width: btn.offsetWidth,
          });
        }
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab]);

  return (
    <div className={`border-b border-wasatch-border ${className}`}>
      <div className="relative flex gap-wasatch-8">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              onClick={() => onChange(tab.id)}
              className={`pb-wasatch-3 text-wasatch-sm font-wasatch-medium transition-colors ${
                isActive
                  ? "text-wasatch-text-heading"
                  : "cursor-pointer text-wasatch-text-muted hover:text-wasatch-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        {/* Animated sliding underline */}
        <div
          className="absolute bottom-0 h-[2px] bg-wasatch-text-heading transition-all duration-300 ease-in-out"
          style={{ left: underline.left, width: underline.width }}
        />
      </div>
    </div>
  );
}
