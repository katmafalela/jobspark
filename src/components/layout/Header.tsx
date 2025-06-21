"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sparkles, Sun, Moon } from "lucide-react";
import ShimmerButton from "../ui/ShimmerButton";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9, rotate: -15 }}
      className="p-2 rounded-full text-slate-600 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
};

export const Header = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg z-50 border-b border-slate-200/60 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.a
            href="#"
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-7 h-7 text-neon-cyan drop-shadow-[0_0_5px_rgba(var(--neon-cyan-rgb),0.7)]" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              JobSpark
            </span>
          </motion.a>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="font-medium text-slate-600 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="font-medium text-slate-600 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="font-medium text-slate-600 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
            >
              Company
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <motion.button
              whileHover={{ y: -2 }}
              className="font-semibold px-4 py-2 text-slate-600 dark:text-gray-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors hidden sm:block"
            >
              Login
            </motion.button>
            <ShimmerButton>Get Started</ShimmerButton>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
