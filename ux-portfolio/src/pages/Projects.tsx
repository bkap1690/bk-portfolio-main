import { Link } from "react-router-dom";
import { caseStudies } from "../data/caseStudies";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <div className="pt-20 p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-primary dark:text-primary-dark">Projects</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((cs) => (
          <motion.article
            key={cs.id}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(99,102,241,0.12)" }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden flex flex-col border border-border-neutral dark:border-border-neutral focus-within:ring-2 focus-within:ring-primary transition-all"
          >
            <Link to={`/case-studies/${cs.id}`} aria-label={`View details for ${cs.title}`} className="flex flex-col h-full focus:outline-none">
              <img
                src={cs.heroImage}
                alt={cs.title}
                className="w-full h-48 object-cover object-center bg-zinc-100 dark:bg-zinc-800"
                loading="lazy"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-primary dark:text-primary mb-1">{cs.title}</h3>
                <p className="text-sm text-text-primary dark:text-text-primary mb-2 line-clamp-2">{cs.context.split('\n')[0]}</p>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {cs.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary dark:text-primary-dark rounded-full px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
} 