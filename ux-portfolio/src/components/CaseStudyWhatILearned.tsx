import { motion } from "framer-motion";

interface CaseStudyWhatILearnedProps {
  reflections: Array<{ title: string; body: string }>;
  intro: string;
  differently: string;
  sectionNumber: string;
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

export default function CaseStudyWhatILearned({
  reflections,
  intro,
  differently,
  sectionNumber,
}: CaseStudyWhatILearnedProps) {
  return (
    <section className="bg-portfolio-page py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* ── Header ── */}
        <motion.div
          className="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-2 lg:gap-16"
          {...sectionReveal}
        >
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-portfolio-muted">
              {sectionNumber} / Learnings
            </span>
            <h2 className="mt-3 font-serif text-3xl italic lg:text-5xl text-portfolio-ink">
              What I Learned
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-lg font-light leading-relaxed text-portfolio-muted lg:text-xl">
              {intro}
            </p>
          </div>
        </motion.div>

        <div className="border-t border-portfolio-border" />

        {/* ── Reflections ── */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {reflections.map((reflection, i) => (
            <motion.div key={i} variants={itemVariants}>
              <div className="grid grid-cols-[4rem_1fr] gap-8 py-10 lg:grid-cols-[6rem_1fr] lg:gap-16 lg:py-14">
                <motion.span
                  className="font-serif text-5xl italic text-portfolio-accent lg:text-7xl"
                  initial={{ opacity: 0.2 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {i + 1}
                </motion.span>
                <div>
                  <h3 className="mb-3 text-lg font-medium text-portfolio-ink lg:text-xl">
                    {reflection.title}
                  </h3>
                  <p className="text-base font-light leading-relaxed text-portfolio-muted lg:text-lg">
                    {reflection.body}
                  </p>
                </div>
              </div>
              {i < reflections.length - 1 && (
                <div className="border-t border-portfolio-border" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* ── What I'd do differently ── */}
        {differently && (
          <motion.div
            className="mt-14 overflow-hidden rounded-2xl bg-portfolio-dark lg:mt-20"
            {...sectionReveal}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[4rem_1fr]">
              <div className="hidden items-center justify-center lg:flex">
                <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-portfolio-accent [writing-mode:vertical-lr] rotate-180">
                  If I did it again
                </span>
              </div>

              <div className="px-8 py-10 lg:py-14 lg:pr-14 lg:pl-6">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-white/40 lg:hidden">
                  If I did it again
                </span>
                <span className="mt-1 hidden font-mono text-xs font-medium uppercase tracking-[0.12em] text-white/40 lg:inline-block">
                  What I'd do differently
                </span>
                <p className="mt-4 font-serif text-xl italic leading-relaxed text-white/80 lg:text-2xl">
                  {differently}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
