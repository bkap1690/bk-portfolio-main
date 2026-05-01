import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyFooterProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyFooter({ caseStudy }: CaseStudyFooterProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4 flex flex-wrap gap-2">
        {caseStudy.tags.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 text-primary rounded px-2 py-1 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-2 text-sm text-portfolio-muted">
        {caseStudy.date} &middot; {caseStudy.role} &middot;{" "}
        {caseStudy.tools.join(", ")}
      </div>
    </div>
  );
} 