import { motion } from "framer-motion";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyKeyDecisionsProps {
  caseStudy: CaseStudy;
}

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5 },
} as const;

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function AnimatedDecision({
  decision,
  index,
}: {
  decision: { title: string; description: string; images?: string[] };
  index: number;
}) {
  return (
    <motion.div variants={itemVariants} className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-8">
          <div className="lg:pr-8">
            <div className="text-6xl lg:text-8xl font-light text-portfolio-accent mb-6">
              0{index + 1}
            </div>
            <h3 className="text-2xl lg:text-4xl font-medium text-portfolio-ink leading-snug">
              {decision.title}
            </h3>
          </div>

          <div className="lg:pl-8">
            <p className="text-lg text-portfolio-ink leading-relaxed">
              {decision.description}
            </p>
          </div>
        </div>

        {decision.images && decision.images.length > 0 && (
          <div className="w-full">
            <img
              src={decision.images[0]}
              alt={`${decision.title} illustration`}
              className="w-full h-64 lg:h-96 object-cover rounded-xl bg-portfolio-surface"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CaseStudyKeyDecisions({ caseStudy }: CaseStudyKeyDecisionsProps) {
  if (!caseStudy.keyDecisions || caseStudy.keyDecisions.length === 0) {
    return null;
  }

  return (
    <section className="bg-portfolio-page">
      <motion.div className="py-16 lg:py-24" {...sectionReveal}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif italic font-bold mb-4 text-portfolio-ink">
            Key Design Decisions
          </h2>
          <p className="text-lg text-portfolio-muted max-w-2xl mx-auto">
            Strategic choices that shaped the user experience and drove measurable impact
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {caseStudy.keyDecisions.map((decision, index) => (
          <AnimatedDecision key={index} decision={decision} index={index} />
        ))}
      </motion.div>
    </section>
  );
}
