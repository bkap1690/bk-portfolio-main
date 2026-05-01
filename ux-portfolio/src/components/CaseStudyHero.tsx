import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "../data/caseStudies";
import { motion, useScroll, useTransform } from "framer-motion";

interface CaseStudyHeroProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  const heroImages = caseStudy.heroImages;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [entranceDone, setEntranceDone] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Safety fallback: ensure entranceDone fires even if onAnimationComplete is missed
  useEffect(() => {
    const timer = setTimeout(() => setEntranceDone(true), 3800);
    return () => clearTimeout(timer);
  }, []);

  // -- Phase 1 (0.00–0.20): Side images retract behind center --
  const leftX = useTransform(scrollYProgress, [0, 0.2], ["0%", "55%"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.2], ["0%", "-55%"]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // -- Phase 2–3 (0.20–0.65): Center image scales up --
  const centerScale = useTransform(scrollYProgress, [0.2, 0.65], [1, 4]);

  // -- Phase 2 (0.20–0.35): Breadcrumb/subheadline fades out --
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0.2, 0.35], [0, -30]);

  // -- Phase 3 (0.40–0.65): White overlay fades in --
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);

  // -- Phase 4 (0.65–0.80): Large gradient subheadline rises --
  const bigTextY = useTransform(scrollYProgress, [0.65, 0.8], ["100%", "0%"]);
  const bigTextOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);

  return (
    <div ref={wrapperRef} className="relative h-[500vh] overflow-x-clip">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FAF8F5 0%, #F0EBE3 100%)",
        }}
      >
        {/* Content area */}
        <div className="mx-auto max-w-screen-full px-[5%] h-full pt-20">
          {/* Breadcrumb + subheadline */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
            style={
              entranceDone
                ? { opacity: textOpacity, y: textY }
                : undefined
            }
          >
            <div className="mb-4 text-2xl md:text-4xl text-portfolio-ink">
              <Link
                to="/projects"
                className="text-portfolio-muted hover:text-portfolio-ink transition-colors"
              >
                Work
              </Link>
              <span className="mx-1">/</span>
              <span className="text-portfolio-ink font-medium">
                {caseStudy.title}
              </span>
            </div>
          </motion.div>

          {/* Hero images */}
          <div className="relative flex w-full h-full items-center justify-center">
            {/* Left — Create Order */}
            <motion.img
              src={heroImages?.[1]}
              alt="Create Order"
              className="absolute rounded-xl shadow-2xl"
              style={{
                width: "50%",
                zIndex: 1,
                left: 0,
                top: "20%",
                ...(entranceDone
                  ? { x: leftX, opacity: leftOpacity }
                  : {}),
              }}
              initial={{ opacity: 0, x: "55%", scale: 0.88 }}
              animate={{ opacity: 1, x: "0%", scale: 0.88 }}
              transition={{
                opacity: { duration: 0.4, delay: 1.8 },
                x: {
                  delay: 1.8,
                  duration: 1.0,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            />

            {/* Center — Dashboard */}
            <motion.img
              src={heroImages?.[0]}
              alt={caseStudy.title}
              className="relative rounded-xl shadow-2xl origin-center"
              style={{
                width: "50%",
                zIndex: 10,
                ...(entranceDone ? { scale: centerScale } : {}),
              }}
              initial={{ scale: 2, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 3,
                ease: [0.5, 1, 0.3, 1],
              }}
              onAnimationComplete={() => setEntranceDone(true)}
            />

            {/* Right — Specimen Details */}
            <motion.img
              src={heroImages?.[2]}
              alt="Specimen Details"
              className="absolute rounded-xl shadow-2xl"
              style={{
                width: "50%",
                zIndex: 1,
                right: 0,
                top: "20%",
                ...(entranceDone
                  ? { x: rightX, opacity: rightOpacity }
                  : {}),
              }}
              initial={{ opacity: 0, x: "-55%", scale: 0.88 }}
              animate={{ opacity: 1, x: "0%", scale: 0.88 }}
              transition={{
                opacity: { duration: 0.4, delay: 1.95 },
                x: {
                  delay: 1.95,
                  duration: 1.0,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            />
          </div>
        </div>

        {/* White overlay — fades in during Phase 3 */}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-white"
          style={{
            zIndex: 20,
            opacity: entranceDone ? overlayOpacity : 0,
          }}
        />

        {/* Large gradient subheadline — rises during Phase 4 */}
        {caseStudy.subheadline && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-[10%] pointer-events-none"
            style={{
              zIndex: 30,
              y: entranceDone ? bigTextY : "100%",
              opacity: entranceDone ? bigTextOpacity : 0,
            }}
          >
            <p
              className="text-4xl md:text-6xl lg:text-7xl font-serif italic font-medium leading-tight text-center max-w-4xl"
              style={{
                background:
                  "linear-gradient(180deg, #1a1a1a 0%, #a0956e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {caseStudy.subheadline}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
