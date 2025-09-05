import { Link } from "react-router-dom";
import type { CaseStudy } from "../data/caseStudies";

interface CaseStudyHeroProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  return (
    <>
      <div className="mx-auto max-w-screen-full px-[5%]">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 text-2xl md:text-4xl text-text-primary dark:text-text-primary">
          <Link 
            to="/projects" 
            className="text-text-secondary hover:text-text-primary dark:hover:text-text-primary transition-colors"
          >
            Work
          </Link>
          <span className="mx-1">/</span>
          <span className="text-text-primary dark:text-text-primary font-medium">
            {caseStudy.title}
          </span>
        </div>
        
        {caseStudy.subheadline && (
          <h1 className="text-text-secondary dark:text-text-secondary mb-8 text-xl md:text-2xl font-medium leading-snug">
            {caseStudy.subheadline}
          </h1>
        )}
        
        <div className="flex w-full justify-center">
          <img
            src={caseStudy.heroImage}
            alt={caseStudy.title}
            className="max-h-[600px] w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </>
  );
}
