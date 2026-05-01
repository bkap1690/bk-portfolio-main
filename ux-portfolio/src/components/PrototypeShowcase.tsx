import { motion } from "framer-motion";

interface PrototypeShowcaseProps {
  sectionNumber: string;
  title: string;
  description: string;
  prototypeUrl: string;
  videoSrc?: string;
  highlights?: string[];
}

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5 },
} as const;

function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="flex items-center gap-2 bg-white/5 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="block h-3 w-3 rounded-full bg-white/15" />
          <span className="block h-3 w-3 rounded-full bg-white/15" />
          <span className="block h-3 w-3 rounded-full bg-white/15" />
        </div>
        <div className="ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 text-xs text-white/30 select-none">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

function PlayPlaceholder() {
  return (
    <div className="flex aspect-video w-full items-center justify-center bg-white/5">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 transition-colors hover:border-white/40">
        <svg
          className="ml-1 h-8 w-8 text-white/30"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

export default function PrototypeShowcase({
  sectionNumber,
  title,
  description,
  prototypeUrl,
  videoSrc,
  highlights = [],
}: PrototypeShowcaseProps) {
  const displayHighlights = highlights.slice(0, 3);

  return (
    <section className="bg-portfolio-dark py-20 lg:py-28">
      <motion.div className="mx-auto max-w-6xl px-6" {...sectionReveal}>
        {/* Section label */}
        <div className="mb-12 lg:mb-16">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-portfolio-muted">
            {sectionNumber} / Showcase
          </span>
          <h2 className="mt-3 text-3xl font-serif italic font-bold text-white lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-white/50 lg:text-xl">
            {description}
          </p>
        </div>

        {/* Browser chrome + video */}
        <BrowserChrome url={prototypeUrl}>
          {videoSrc ? (
            <video
              className="aspect-video w-full bg-black object-cover"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <PlayPlaceholder />
          )}
        </BrowserChrome>

        {/* Bottom row: highlights + CTAs */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {displayHighlights.length > 0 && (
            <ul className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              {displayHighlights.map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/30" />
                  {text}
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-3">
            <motion.a
              href={prototypeUrl}
              className="group inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-portfolio-dark"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.15 }}
            >
              View prototype
              <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">
                &rarr;
              </span>
            </motion.a>
            {videoSrc && (
              <a
                href={videoSrc}
                className="inline-flex items-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                Watch demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
