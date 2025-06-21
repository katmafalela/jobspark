"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Sparkles, Sun, Moon, Menu, X } from "lucide-react";
import ShimmerButton from "../ui/ShimmerButton";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/20"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-neon-cyan neon-glow" />
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    JobSpark
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              <nav className="space-y-6">
                {["Features", "Pricing", "Company"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
                    onClick={onClose}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button className="block w-full text-left text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors mb-4">
                    Login
                  </button>
                  <ShimmerButton className="w-full justify-center">
                    Get Started
                  </ShimmerButton>
                </div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-50 border-b border-slate-200/60 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.a
              href="#"
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-7 h-7 text-neon-cyan neon-glow" />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                JobSpark
              </span>
            </motion.a>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Pricing", "Company"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="font-medium text-slate-600 dark:text-slate-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors relative"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
              <motion.button
                whileHover={{ y: -2 }}
                className="font-semibold px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors hidden sm:block"
              >
                Login
              </motion.button>
              <div className="hidden md:block">
                <ShimmerButton>Get Started</ShimmerButton>
              </div>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};