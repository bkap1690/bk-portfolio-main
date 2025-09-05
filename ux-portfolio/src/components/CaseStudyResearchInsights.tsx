import { useEffect, useRef, useState } from "react";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyResearchInsightsProps {
  caseStudy: CaseStudy;
}

// Hook to track which section is currently active based on scroll position
function useActiveSection(sectionsCount: number) {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress through the container with more granular control
        const scrollProgress = Math.max(0, Math.min(1, -containerTop / (containerHeight - viewportHeight)));
        
        // Add buffer zones between sections to prevent rapid jumping
        // Each section gets more scroll space and transitions are smoothed
        const bufferedProgress = scrollProgress * 0.85; // Reduce sensitivity
        const sectionProgress = bufferedProgress * sectionsCount;
        
        // Add hysteresis to prevent rapid section switching
        const newActiveSection = Math.floor(sectionProgress + 0.3); // Slight offset for stability
        const clampedActiveSection = Math.max(0, Math.min(sectionsCount - 1, newActiveSection));
        
        if (clampedActiveSection !== activeSection) {
          setActiveSection(clampedActiveSection);
        }
      }, 16); // ~60fps throttling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [sectionsCount, activeSection]);

  return { activeSection, containerRef, sectionRefs };
}

// Individual insight component with fade in/out animation
function StickyInsight({ 
  insight, 
  index,
  isActive 
}: { 
  insight: { title: string; description: string; findings?: string[]; };
  index: number;
  isActive: boolean;
}) {
  return (
    <div className={`absolute inset-0 flex items-center transition-all duration-1200 ease-out ${
      isActive 
        ? 'opacity-100 translate-y-0 delay-300' 
        : 'opacity-0 translate-y-8 delay-0'
    }`}>
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Title Column */}
          <div className="lg:pr-8">
            <div className="text-6xl lg:text-8xl font-light text-zinc-300 dark:text-zinc-700 mb-6">
              0{index + 1}
            </div>
            <h3 className="text-3xl lg:text-5xl font-medium text-text-primary dark:text-text-primary leading-tight">
              {insight.title}
            </h3>
          </div>
          
          {/* Content Column */}
          <div className="lg:pl-8 flex flex-col justify-center">
            <p className="text-xl lg:text-2xl text-text-primary dark:text-text-primary leading-relaxed mb-8">
              {insight.description}
            </p>
            
            {/* Key Findings */}
            {insight.findings && insight.findings.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary dark:text-text-primary uppercase tracking-wider">
                  Key Findings
                </h4>
                <ul className="space-y-3">
                  {insight.findings.map((finding, findingIndex) => (
                    <li 
                      key={findingIndex}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {finding}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyResearchInsights({ caseStudy }: CaseStudyResearchInsightsProps) {
  // Placeholder research insights data
  const researchInsights = [
    {
      title: "User Pain Points Discovery",
      description: "Through comprehensive user interviews and behavioral analysis, we uncovered critical friction points in the current workflow that were significantly impacting user productivity and satisfaction.",
      findings: [
        "78% of users abandoned tasks due to complex navigation",
        "Average task completion time exceeded industry benchmarks by 40%",
        "Users reported high cognitive load during multi-step processes"
      ]
    },
    {
      title: "Competitive Landscape Analysis",
      description: "A deep dive into competitor solutions revealed market gaps and opportunities for differentiation, helping us position our solution strategically within the competitive ecosystem.",
      findings: [
        "Market leaders focused on features over user experience",
        "Opportunity identified for mobile-first approach",
        "Price sensitivity varies significantly across user segments"
      ]
    },
    {
      title: "Behavioral Pattern Insights",
      description: "Analytics data and user session recordings revealed unexpected usage patterns that challenged our initial assumptions and informed critical design pivots.",
      findings: [
        "Peak usage occurs during non-traditional hours",
        "Mobile usage growing 150% year-over-year",
        "Users prefer progressive disclosure over upfront complexity"
      ]
    },
    {
      title: "Accessibility & Inclusion Research",
      description: "Comprehensive accessibility audits and inclusive design research ensured our solution works for users with diverse abilities and contexts of use.",
      findings: [
        "23% of target users rely on assistive technologies",
        "Color contrast issues affected 15% of user base",
        "Voice interaction preference in hands-busy scenarios"
      ]
    },
    {
      title: "Technology Constraints & Opportunities",
      description: "Technical research revealed both limitations and innovative possibilities that shaped our design approach and informed feasible solution boundaries.",
      findings: [
        "Legacy system integration required phased approach",
        "API limitations influenced data display strategies",
        "Emerging technologies offered future enhancement paths"
      ]
    }
  ];

  const { activeSection, containerRef } = useActiveSection(researchInsights.length);

  return (
    <section className="bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-text-primary dark:text-text-primary">
            Research & Insights
          </h2>
          <p className="text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Deep user research and market analysis that uncovered critical insights and shaped our design strategy
          </p>
        </div>
      </div>

      {/* Mobile/Tablet: Normal vertical layout */}
      <div className="lg:hidden">
        {researchInsights.map((insight, index) => (
          <div key={index} className="py-12 lg:py-20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Title Column */}
                <div className="md:pr-8">
                  <div className="text-4xl md:text-6xl font-light text-zinc-300 dark:text-zinc-700 mb-4">
                    0{index + 1}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-medium text-text-primary dark:text-text-primary leading-tight">
                    {insight.title}
                  </h3>
                </div>
                
                {/* Content Column */}
                <div className="md:pl-8 flex flex-col justify-center">
                  <p className="text-lg md:text-xl text-text-primary dark:text-text-primary leading-relaxed mb-6">
                    {insight.description}
                  </p>
                  
                  {/* Key Findings */}
                  {insight.findings && insight.findings.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary uppercase tracking-wider">
                        Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {insight.findings.map((finding, findingIndex) => (
                          <li 
                            key={findingIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              {finding}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Sticky scrolling container */}
      <div 
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${researchInsights.length * 180}vh` }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Progress indicator - vertically centered */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
            <div className="flex flex-col gap-2">
              {researchInsights.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-8 rounded-full transition-all duration-500 ${
                    index === activeSection
                      ? 'bg-blue-500'
                      : 'bg-zinc-300 dark:bg-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* All sections rendered absolutely */}
          {researchInsights.map((insight, index) => (
            <StickyInsight
              key={index}
              insight={insight}
              index={index}
              isActive={index === activeSection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
