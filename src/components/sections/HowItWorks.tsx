"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Build Your Profile",
      description:
        "Our intuitive onboarding process helps you create a comprehensive professional profile that stands out.",
    },
    {
      number: "02",
      title: "Enhance & Prepare",
      description:
        "Leverage AI tools to craft the perfect CV, write compelling cover letters, and ace your interviews.",
    },
    {
      number: "03",
      title: "Apply & Succeed",
      description:
        "Connect with curated opportunities and track your application progress all in one place.",
    },
  ];

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "center center"],
  });
  // Transform the scroll progress to control the line's scale
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={targetRef} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-4">
            Your Path to Success in 3 Steps
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow our proven process to go from job seeker to valued employee.
          </p>
        </motion.div>

        <div className="relative">
          {/* Neon Connecting Line */}
          <motion.div
            style={{ scaleX: lineScaleX }}
            className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-magenta -translate-y-1/2 hidden lg:block origin-left"
          />

          <div className="grid lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-xl text-center lg:text-left shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/50 dark:border-white/10"
              >
                <div className="mb-4">
                  <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-800">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
