import { useParams, useNavigate } from "react-router-dom";
import { caseStudies } from "../data/caseStudies";
import { motion } from "framer-motion";
import CaseStudyHero from "../components/CaseStudyHero.tsx";
import CaseStudyOverview from "../components/CaseStudyOverview.tsx";
import CaseStudyMetadata from "../components/CaseStudyMetadata.tsx";
import CaseStudyFooter from "../components/CaseStudyFooter.tsx";
import CaseStudyKeyDecisions from "../components/CaseStudyKeyDecisions.tsx";
import CaseStudyResearchInsights from "../components/CaseStudyResearchInsights.tsx";
import CaseStudyWhatILearned from "../components/CaseStudyWhatILearned.tsx";
import BentoGrid from "../components/BentoGrid.tsx";
import SuccessMetrics from "../components/SuccessMetrics.tsx";
import ScrollspyNav from "../components/ScrollspyNav.tsx";

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const caseStudy = caseStudies.find((c) => c.id === id);
  const navigate = useNavigate();

  // Define sections for scrollspy navigation
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'showcase', label: 'Showcase' },
    ...(caseStudy?.metrics ? [{ id: 'metrics', label: 'Metrics' }] : []),
    { id: 'insights', label: 'Insights' },
    { id: 'decisions', label: 'Decisions' },
    { id: 'learnings', label: 'Learnings' }
  ];

  if (!caseStudy) {
    return (
      <div className="mx-auto max-w-3xl p-8 pt-20">
        <h2 className="text-primary dark:text-primary-dark mb-4 text-2xl font-bold">
          Case Study Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-text-primary dark:text-text-primary"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-background max-w-none py-32"
    >
      <CaseStudyHero caseStudy={caseStudy} />

      <div id="overview" className="mx-auto flex max-w-6xl flex-col gap-8 p-12 md:flex-row md:gap-16 md:py-24">
        <CaseStudyOverview caseStudy={caseStudy} />
        <CaseStudyMetadata caseStudy={caseStudy} />
      </div>

       <div id="showcase" className="max-w-screen-full mx-auto mb-12 flex flex-col gap-8 bg-neutral-100 md:flex-row md:gap-16">
         <BentoGrid />
       </div>

       {caseStudy.metrics && <div id="metrics"><SuccessMetrics metrics={caseStudy.metrics} /></div>}

       <div id="insights"><CaseStudyResearchInsights caseStudy={caseStudy} /></div>

       <div id="decisions"><CaseStudyKeyDecisions caseStudy={caseStudy} /></div>

       <div id="learnings"><CaseStudyWhatILearned caseStudy={caseStudy} /></div>

       <CaseStudyFooter caseStudy={caseStudy} />

       {/* Scrollspy Navigation */}
       <ScrollspyNav sections={sections} heroHeight={600} />
    </motion.main>
  );
}
