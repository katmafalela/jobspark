"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import ShimmerButton from "../ui/ShimmerButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Grid - Only visible in Light Mode */}
      <div className="absolute inset-0 z-0 dark:hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"></div>
      </div>
      {/* Background Neon Gradient - Only visible in Dark Mode */}
      <div className="absolute inset-0 -z-10 hidden dark:block">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-neon-cyan/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neon-magenta/10 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.h1
            variants={itemVariants as any}
            className="text-5xl lg:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6"
          >
            Your AI-Powered <br />
            <span className="bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
              Career Co-Pilot
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants as any}
            className="text-lg lg:text-xl text-slate-600 dark:text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0"
          >
            Accelerate your job search with intelligent tools for CV building,
            interview practice, and direct connections to top employers.
          </motion.p>

          <motion.div
            variants={itemVariants as any}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <ShimmerButton className="px-10 py-4 text-lg">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </ShimmerButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative group"
        >
          {/* Background Shape */}
          <div className="absolute -top-4 -left-4 w-full h-full bg-slate-200 dark:bg-slate-800 rounded-2xl transform -rotate-6 transition-colors"></div>

          {/* Neon Glow Effect for dark mode */}
          <div className="absolute -inset-4 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-2xl opacity-0 dark:opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500"></div>

          {/* Abstract UI Representation */}
          <div className="relative w-full aspect-square max-w-md mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-2xl shadow-slate-400/20 dark:shadow-black/50">
            <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-lg flex flex-col p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <p className="font-semibold text-slate-700 dark:text-gray-200">
                  Profile Strength:{" "}
                  <span className="text-neon-cyan">Excellent</span>
                </p>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full"></div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md text-sm font-medium text-slate-600 dark:text-gray-300">
                AI Suggestion: Add 'Project Management' skill
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md text-sm font-medium text-slate-600 dark:text-gray-300">
                New Match: Senior Analyst at FinCorp
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
