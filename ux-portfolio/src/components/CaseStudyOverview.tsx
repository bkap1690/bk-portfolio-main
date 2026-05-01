import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyOverviewProps {
  caseStudy: CaseStudy;
  className?: string;
}

export default function CaseStudyOverview({ caseStudy }: CaseStudyOverviewProps) {
  return (
    <motion.div
      className="flex flex-col justify-center p-24"
      initial={{ opacity: 0, x: -200 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.60 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <h2 className="mb-2 text-2xl font-serif italic font-medium text-portfolio-ink">Context</h2>
      <div className="text-lg text-portfolio-muted mb-4">
        <ReactMarkdown>{caseStudy.context}</ReactMarkdown>
      </div>
      <h2 className="mb-2 text-2xl font-serif italic font-medium text-portfolio-ink">Design Challenge</h2>
      <div className="text-lg text-portfolio-muted mb-4">
        <ReactMarkdown>{caseStudy.challenge}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
