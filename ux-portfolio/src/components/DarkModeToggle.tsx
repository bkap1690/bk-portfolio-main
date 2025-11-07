import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  if (localStorage.theme) return localStorage.theme;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
};

export default function DarkModeToggle() {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev: string) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 bg-transparent cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/10"
      type="button"
    >
      {theme === "dark" ? (
        <Moon className="w-5 h-5 text-primary dark:text-primary" strokeWidth={2} />
      ) : (
        <Sun className="w-5 h-5 text-primary dark:text-primary" strokeWidth={2} />
      )}
    </button>
  );
} 