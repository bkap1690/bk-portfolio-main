
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyMetadataProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyMetadata({ caseStudy }: CaseStudyMetadataProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-4 h-fit">
      <div>
        <div className="text-base font-semibold text-text-primary dark:text-text-primary mb-1">Client</div>
        <div className="text-md font-medium text-text-secondary dark:text-text-secondary">
          {caseStudy.client || '—'}
        </div>
      </div>
      <div>
        <div className="text-base font-semibold text-text-primary dark:text-text-primary mb-1">Scope</div>
        <div className="text-md font-medium text-text-secondary dark:text-text-secondary">
          {caseStudy.scope?.join(', ') || '—'}
        </div>
      </div>
      <div>
        <div className="text-base font-semibold text-text-primary dark:text-text-primary mb-1">Role</div>
        <div className="text-md font-medium text-text-secondary dark:text-text-secondary">
          {caseStudy.role}
        </div>
      </div>
      <div>
        <div className="text-base font-semibold text-text-primary dark:text-text-primary mb-1">Timeline</div>
        <div className="text-md font-medium text-text-secondary dark:text-text-secondary">
          {caseStudy.timeline || caseStudy.date}
        </div>
      </div>
    </aside>
  );
} 