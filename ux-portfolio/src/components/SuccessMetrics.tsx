import { useState, useEffect, useRef } from "react";

interface Metric {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface SuccessMetricsProps {
  metrics: Metric[];
}

// Custom hook for intersection observer
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView] as const;
}

// Custom hook for number animation
function useAnimatedNumber(target: number, isActive: boolean, duration = 2000) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(startValue + (target - startValue) * easeOut);
      
      setCurrent(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [target, isActive, duration]);

  return current;
}

function MetricCard({ metric, isInView }: { metric: Metric; isInView: boolean }) {
  const animatedValue = useAnimatedNumber(metric.value, isInView);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-800 text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary dark:text-primary mb-2">
        {metric.prefix || ''}
        {animatedValue.toLocaleString()}
        {metric.suffix || ''}
      </div>
      <div className="text-lg text-text-primary dark:text-text-primary font-medium">
        {metric.label}
      </div>
    </div>
  );
}

export default function SuccessMetrics({ metrics }: SuccessMetricsProps) {
  const [ref, isInView] = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-text-primary dark:text-text-primary">
          Impact & Results
        </h2>
        <p className="text-lg text-center mb-12 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Measurable improvements achieved through user-centered design
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={index} 
              metric={metric} 
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
