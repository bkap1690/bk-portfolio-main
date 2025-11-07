import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
          <span className="font-bold text-2xl text-primary dark:text-primary tracking-tight">BK</span>
        </div>
        {/* Animated Hamburger for mobile */}
        <div className="block md:hidden">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center px-3 py-2 rounded-full text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/10 focus:outline-none cursor-pointer transition-colors duration-200"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center relative z-[1000]">
              <motion.span
                className="w-5 h-0.5 bg-current rounded-full block absolute"
                animate={{
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? 0 : -6,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="w-5 h-0.5 bg-current rounded-full block absolute"
                animate={{
                  opacity: menuOpen ? 0 : 1,
                  x: menuOpen ? -10 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
              <motion.span
                className="w-5 h-0.5 bg-current rounded-full block absolute"
                animate={{
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? 0 : 6,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          </button>
        </div>
        {/* Desktop Nav links */}
        <div className="hidden md:flex md:items-center md:w-auto">
          <div className="flex flex-row gap-6 items-center">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }: { isActive: boolean }) =>
                  `font-normal text-base cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-semibold dark:text-primary"
                      : "text-text-primary dark:text-text-primary hover:text-primary dark:hover:text-primary"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {/* Dark mode toggle */}
            <div className="ml-4">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Sliding Menu */}
            <motion.div
              className="fixed top-0 right-0 w-full z-50 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4
              }}
            >
              <div className="flex flex-col h-screen pt-20 px-8 space-y-8 bg-white dark:bg-black/80 backdrop-blur-lg">
                {/* Navigation Links */}
                <div className="flex flex-col space-y-8">
                  {navLinks.map(({ to, label, end }, index) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.1 + (index * 0.1),
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }: { isActive: boolean }) =>
                          `text-2xl font-medium cursor-pointer transition-colors duration-200 block ${
                            isActive
                              ? "text-primary dark:text-primary"
                              : "text-text-primary dark:text-text-primary hover:text-primary dark:hover:text-primary"
                          }`
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
                
                {/* Dark mode toggle at bottom */}
                <motion.div 
                  className="mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.5,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-text-primary dark:text-text-primary font-medium">Theme</span>
                    <DarkModeToggle />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
} 