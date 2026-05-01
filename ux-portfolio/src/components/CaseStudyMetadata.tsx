
import { motion } from "framer-motion";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyMetadataProps {
  caseStudy: CaseStudy;
  className?: string;
}

export default function CaseStudyMetadata({ caseStudy }: CaseStudyMetadataProps) {
  return (
    <motion.div
      className="w-full flex flex-col justify-center gap-4 bg-portfolio-dark dark:bg-portfolio-on-page p-24"
      initial={{ opacity: 0, x: 200 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.60 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div>
        <div className="text-base font-semibold text-portfolio-on-surface dark:text-portfolio-on-background mb-1">Client</div>
        <div className="text-md font-medium text-portfolio-on-surface dark:text-portfolio-on-background">
          {caseStudy.client || '—'}
        </div>
      </div>
      <div>
        <div className="text-base font-semibold text-portfolio-on-surface dark:text-portfolio-on-background mb-1">Scope</div>
        <div className="text-md font-medium text-portfolio-on-surface dark:text-portfolio-on-background">
          {caseStudy.scope?.join(', ') || '—'}
        </div>
      </div>
      <div>
        <div className="text-base font-semibold text-portfolio-on-surface dark:text-portfolio-on-background mb-1">Role</div>
        <div className="text-md font-medium text-portfolio-on-surface dark:text-portfolio-on-background">
          {caseStudy.role}
        </div>
      </div>
      <div>
        <div className="text-base font-semibold text-portfolio-on-surface dark:text-portfolio-on-background mb-1">Timeline</div>
        <div className="text-md font-medium text-portfolio-on-surface dark:text-portfolio-on-background">
          {caseStudy.timeline || caseStudy.date}
        </div>
      </div>
    </motion.div>
  );
} 