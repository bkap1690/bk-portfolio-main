import { useEffect, useRef, useState } from "react";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyWhatILearnedProps {
  caseStudy: CaseStudy;
}

// Hook to handle intersection observer for scroll animations
function useIntersectionObserver(options = {}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.2,
      rootMargin: '-50px 0px',
      ...options,
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return { ref, isIntersecting: hasAnimated };
}

// Individual reflection card component with animation
function ReflectionCard({ 
  title, 
  body, 
  index 
}: { 
  title: string; 
  body: string; 
  index: number;
}) {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div 
      ref={ref}
      className={`p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-500 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <h3 className="text-lg lg:text-xl font-semibold text-text-primary dark:text-text-primary mb-4">
        {title}
      </h3>
      <p className="text-text-secondary dark:text-text-secondary leading-relaxed">
        {body}
      </p>
    </div>
  );
}

// Default reflections data - can be moved to caseStudies data model later
const defaultReflections = [
  {
    title: "Balancing Competing Stakeholder Needs",
    body: "I learned to mediate between the CEO's desire for detailed reporting and lab technicians' need for speed and simplicity."
  },
  {
    title: "Designing for Scalability",
    body: "By creating modular UI components and flexible data structures, I ensured the platform could evolve with new lab requirements."
  },
  {
    title: "The Value of Progressive Onboarding",
    body: "Introducing guidance only when needed kept users from feeling overwhelmed while learning a complex system."
  }
];

export default function CaseStudyWhatILearned({ caseStudy }: CaseStudyWhatILearnedProps) {
  // Use reflections from case study data if available, otherwise use defaults
  const reflections = caseStudy.reflections || defaultReflections;
  const summaryStatement = caseStudy.learningSummary || 
    "This project reinforced the importance of deeply understanding user workflows before making major design decisions.";

  const { ref: sectionRef, isIntersecting: sectionVisible } = useIntersectionObserver();

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-zinc-950">
      <div 
        ref={sectionRef}
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ease-out ${
          sectionVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section Header */}
        <div className="mb-16 lg:mb-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-text-primary dark:text-text-primary">
            What I Learned
          </h2>
        </div>

        {/* Two-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left Column: Intro */}
          <div className="lg:pr-8">
            <p className="text-lg lg:text-xl text-text-secondary dark:text-text-secondary leading-relaxed">
              Every project brings new insights and challenges that shape my approach to design. 
              Here are the key takeaways that will inform how I tackle future UX problems.
            </p>
          </div>
          
          {/* Right Column: Reflection Cards */}
          <div className="space-y-6">
            {reflections.map((reflection, index) => (
              <ReflectionCard
                key={index}
                title={reflection.title}
                body={reflection.body}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Summary Callout */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 lg:p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Key Takeaway
              </h3>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                {summaryStatement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
