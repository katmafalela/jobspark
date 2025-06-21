"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
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
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Light mode grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] dark:hidden"></div>
        
        {/* Dark mode gradient */}
        <div className="hidden dark:block">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-neon-cyan/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neon-magenta/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon-cyan rounded-full opacity-20"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.div
            variants={itemVariants as any}
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-6"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan mr-2" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              AI-Powered Career Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants as any}
            className="text-5xl lg:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Your AI-Powered <br />
            <span className="bg-gradient-to-r from-neon-cyan via-blue-500 to-neon-magenta bg-clip-text text-transparent animate-gradient-fade bg-[length:200%_200%]">
              Career Co-Pilot
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants as any}
            className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Accelerate your job search with intelligent tools for CV building,
            interview practice, and direct connections to top South African employers.
          </motion.p>

          <motion.div
            variants={itemVariants as any}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <ShimmerButton className="px-10 py-4 text-lg font-semibold">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </ShimmerButton>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 text-lg font-semibold text-slate-600 dark:text-slate-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants as any}
            className="flex items-center justify-center lg:justify-start space-x-6 mt-10 text-sm text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Free to start
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No credit card
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Setup in 2 mins
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative group"
        >
          {/* Background decorative elements */}
          <div className="absolute -top-8 -left-8 w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-3xl transform -rotate-6 transition-all duration-500 group-hover:-rotate-3 blur-xl"></div>
          <div className="absolute -top-4 -left-4 w-full h-full bg-slate-200 dark:bg-slate-800 rounded-2xl transform -rotate-3 transition-all duration-500 group-hover:-rotate-1"></div>

          {/* Main dashboard mockup */}
          <div className="relative w-full aspect-square max-w-md mx-auto glass rounded-2xl p-6 shadow-2xl shadow-slate-400/20 dark:shadow-black/50 border border-slate-200/50 dark:border-white/10">
            <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Career Dashboard
                  </span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              {/* Profile strength */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                    Profile Strength: <span className="text-neon-cyan">Excellent</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </div>
              </div>

              {/* AI suggestions */}
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800"
                >
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                    AI Suggestion
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Add 'Project Management' skill
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 }}
                  className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md border border-purple-200 dark:border-purple-800"
                >
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                    New Match
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Senior Analyst at FinCorp
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};