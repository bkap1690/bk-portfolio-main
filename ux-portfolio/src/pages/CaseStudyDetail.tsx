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
import PrototypeShowcase from "../components/PrototypeShowcase.tsx";
import SuccessMetrics from "../components/SuccessMetrics.tsx";
import ScrollspyNav from "../components/ScrollspyNav.tsx";

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const caseStudy = caseStudies.find((c) => c.id === id);
  const navigate = useNavigate();

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'insights', label: 'Insights' },
    { id: 'decisions', label: 'Decisions' },
    { id: 'showcase', label: 'Showcase' },
    ...(caseStudy?.metrics ? [{ id: 'metrics', label: 'Metrics' }] : []),
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-background max-w-none"
    >
      <CaseStudyHero caseStudy={caseStudy} />

      <div id="overview" className="bg-portfolio-page mx-auto flex max-w-screen-full flex-col gap-8 md:flex-row h-screen">
        <CaseStudyOverview caseStudy={caseStudy} />
        <CaseStudyMetadata caseStudy={caseStudy} />
      </div>

      <div id="insights"><CaseStudyResearchInsights caseStudy={caseStudy} /></div>

      <div id="decisions"><CaseStudyKeyDecisions caseStudy={caseStudy} /></div>

      <div id="showcase">
        <PrototypeShowcase
          sectionNumber="04"
          title={caseStudy.title}
          description={caseStudy.subheadline}
          prototypeUrl={caseStudy.prototypeUrl ?? '#'}
          videoSrc={caseStudy.videoSrc}
          highlights={caseStudy.highlights ? [...caseStudy.highlights] : []}
        />
      </div>

      {caseStudy.metrics && <div id="metrics"><SuccessMetrics metrics={caseStudy.metrics} /></div>}

      <div id="learnings">
        <CaseStudyWhatILearned
          sectionNumber="06"
          reflections={caseStudy.reflections ?? []}
          intro={caseStudy.reflectionIntro ?? ''}
          differently={caseStudy.differently ?? caseStudy.learningSummary ?? ''}
        />
      </div>

      <CaseStudyFooter caseStudy={caseStudy} />

      <ScrollspyNav
        sections={sections}
        heroHeight={caseStudy.heroImages?.length === 3 ? window.innerHeight * 4.5 : 600}
      />
    </motion.main>
  );
}
