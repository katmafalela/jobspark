"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import ShimmerButton from "../ui/ShimmerButton";

export const CTA = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7 }}
          className="relative text-center overflow-hidden"
        >
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-blue-500 to-neon-magenta bg-[length:200%_200%] animate-gradient-fade rounded-3xl p-1">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl" />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/10 to-blue-500/10 border border-neon-cyan/20 mb-6">
                <Zap className="w-4 h-4 text-neon-cyan mr-2" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Ready to transform your career?
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6"
            >
              Ready to Find Your Dream Job?
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Create your profile in minutes and let our AI co-pilot guide you
              to career success. Your next opportunity is just a click away.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <ShimmerButton className="px-10 py-4 text-lg">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </ShimmerButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 text-lg font-semibold text-slate-600 dark:text-slate-300 hover:text-neon-cyan dark:hover:text-neon-cyan transition-colors"
              >
                Schedule Demo
              </motion.button>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-slate-500 dark:text-slate-400 text-sm mt-6"
            >
              No credit card required • Setup in 2 minutes • Free forever plan
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};