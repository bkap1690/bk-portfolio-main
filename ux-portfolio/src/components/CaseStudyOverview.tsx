
import ReactMarkdown from "react-markdown";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyOverviewProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyOverview({ caseStudy }: CaseStudyOverviewProps) {
  return (
    <div className="flex-1 min-w-0">
      <h2 className="mb-2 text-2xl font-medium">Context</h2>
      <div className="text-lg text-text-primary dark:text-text-primary mb-4">
        <ReactMarkdown>{caseStudy.context}</ReactMarkdown>
      </div>
      <h2 className="mb-2 text-2xl font-medium">Design Challenge</h2>
      <div className="text-lg text-text-primary dark:text-text-primary mb-4">
        <ReactMarkdown>{caseStudy.challenge}</ReactMarkdown>
      </div>
    </div>
  );
} 