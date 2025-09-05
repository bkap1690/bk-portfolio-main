import { useEffect, useRef, useState } from "react";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyKeyDecisionsProps {
  caseStudy: CaseStudy;
}

// Hook to handle intersection observer for scroll animations with stable once-only triggering
function useIntersectionObserver(options = {}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Only trigger animation once when element becomes sufficiently visible
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        // Disconnect observer after first trigger to prevent flickering
        observer.disconnect();
      }
    }, {
      threshold: 0.3, // Increase threshold for more stable triggering
      rootMargin: '-100px 0px', // More conservative margin to prevent premature triggering
      ...options,
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return { ref, isIntersecting: hasAnimated };
}

// Individual decision component with scroll animation
function AnimatedDecision({ 
  decision, 
  index 
}: { 
  decision: { title: string; description: string; images?: string[]; };
  index: number;
}) {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div 
      ref={ref}
      className={`py-16 lg:py-24 transition-all duration-700 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-8">
          {/* Title Column */}
          <div className="lg:pr-8">
            <div className="text-6xl lg:text-8xl font-light text-zinc-300 dark:text-zinc-700 mb-6">
              0{index + 1}
            </div>
            <h3 className="text-2xl lg:text-4xl font-medium text-text-primary dark:text-text-primary leading-snug">
              {decision.title}
            </h3>
          </div>
          
          {/* Description Column */}
          <div className="lg:pl-8">
            <p className="text-lg text-text-primary dark:text-text-primary leading-relaxed">
              {decision.description}
            </p>
          </div>
        </div>
        
        {/* Full-width image */}
        {decision.images && decision.images.length > 0 && (
          <div className="w-full">
            <img
              src={decision.images[0]}
              alt={`${decision.title} illustration`}
              className="w-full h-64 lg:h-96 object-cover rounded-xl bg-zinc-100 dark:bg-zinc-800"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseStudyKeyDecisions({ caseStudy }: CaseStudyKeyDecisionsProps) {
  if (!caseStudy.keyDecisions || caseStudy.keyDecisions.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-text-primary dark:text-text-primary">
            Key Design Decisions
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Strategic choices that shaped the user experience and drove measurable impact
          </p>
        </div>
      </div>

      {/* All decisions with scroll animations */}
      {caseStudy.keyDecisions.map((decision, index) => (
        <AnimatedDecision 
          key={index}
          decision={decision}
          index={index}
        />
      ))}
    </section>
  );
}
