import { useState } from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 md:top-4 md:left-1/2 md:transform md:-translate-x-1/2 md:inset-x-auto z-50 transition-all duration-300 ease-in-out bg-white/10 dark:bg-black/20 backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-110 rounded-none md:rounded-full shadow-md md:shadow-lg border-0 md:border md:border-white/10 md:dark:border-white/5">
      <div className="max-w-full md:max-w-4xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        {/* Branding */}
        <div className="flex items-center flex-shrink-0 mr-6">
          <span className="font-bold text-2xl text-primary dark:text-primary tracking-tight">UXfolio</span>
        </div>
        {/* Hamburger for mobile */}
        <div className="block md:hidden">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center px-3 py-2 border rounded text-primary dark:text-primary border-primary dark:border-primary hover:bg-primary/10 dark:hover:bg-primary/10 focus:outline-none"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <svg className="fill-current h-5 w-5" viewBox="0 0 20 20">
              {menuOpen ? (
                <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
        {/* Nav links */}
        <div className={`w-full md:flex md:items-center md:w-auto ${menuOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-col md:flex-row md:gap-6 gap-2 items-start md:items-center mt-4 md:mt-0">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }: { isActive: boolean }) =>
                  `font-normal text-base cursor-pointer ${
                    isActive
                      ? "text-primary font-semibold dark:text-primary"
                      : "text-text-primary dark:text-text-primary"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            {/* Dark mode toggle aligned right on desktop, below links on mobile */}
            <div className="md:ml-4 mt-2 md:mt-0">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 