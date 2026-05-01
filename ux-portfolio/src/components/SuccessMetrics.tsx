import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
    <div className="bg-portfolio-surface rounded-xl p-8 shadow-lg border border-portfolio-border text-center">
      <div className="text-4xl md:text-5xl font-bold text-portfolio-muted mb-2">
        {metric.prefix || ''}
        {animatedValue.toLocaleString()}
        {metric.suffix || ''}
      </div>
      <div className="text-lg text-portfolio-ink font-medium">
        {metric.label}
      </div>
    </div>
  );
}

export default function SuccessMetrics({ metrics }: SuccessMetricsProps) {
  const [ref, isInView] = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-portfolio-on-surface">
      <motion.div
        className="max-w-6xl mx-auto px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-center mb-4 text-portfolio-on-ink">
          Impact & Results
        </h2>
        <p className="text-lg text-center mb-12 text-portfolio-muted max-w-2xl mx-auto">
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
      </motion.div>
    </section>
  );
}
