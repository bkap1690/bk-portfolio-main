import { useState } from "react";
import { Link } from "react-router-dom";
import { caseStudies } from '../data/caseStudies';
import type { CaseStudy } from '../data/caseStudies';

export default function ProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const project = caseStudies[current];

  return (
    <section className="flex min-h-[100vh] w-full items-center justify-center bg-background dark:bg-background">
      <div className="relative flex w-full flex-col items-center gap-8 p-4 md:flex-row md:p-16">
        {/* Left: Info (on desktop), below image on mobile */}
        <div className="order-2 flex w-full flex-col items-start justify-center md:order-1 md:w-1/2">
          <h1 className="mb-2 text-2xl font-medium text-text-primary dark:text-text-primary md:text-7xl leading-tight">
            {project.title}
          </h1>
          <h2 className="mb-4 text-lg font-medium text-text-primary dark:text-text-primary md:text-2xl">
            {project.subheadline}
          </h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-primary/10 rounded-full px-3 py-1 text-xs font-semibold text-primary dark:text-primary md:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link 
            to={`/case-studies/${project.id}`}
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            View Case Study
          </Link>
        </div>
        {/* Right: Image (on desktop), above info on mobile */}
        <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-1/2">
          <img
            src={project.heroImage}
            alt={project.title}
            className="h-full w-full object-cover object-center md:h-[28rem]"
            draggable={false}
          />
        </div>
        {/* Dots */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 z-10 translate-y-6 md:inset-x-auto md:inset-y-0 md:right-4 md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-2 md:p-0">
          {caseStudies.map((_: CaseStudy, i: number) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 w-3 rounded-full border-2 transition-colors duration-200 ${i === current ? "border-primary bg-primary" : "border-gray-400 bg-white/60 dark:bg-gray-800/60"}`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
