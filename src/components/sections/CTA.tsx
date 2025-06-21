"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
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
          className="relative text-center p-2 rounded-3xl overflow-hidden bg-slate-100"
        >
          <div className="relative bg-white backdrop-blur-sm p-8 md:p-12 rounded-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 mb-6">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Create your profile in minutes and let our AI co-pilot guide you
              to career success. Your next opportunity is just a click away.
            </p>
            <ShimmerButton className="bg-white text-slate-900 px-10 py-4 text-lg">
              Get Started for Free
              <Zap className="ml-2 w-5 h-5" />
            </ShimmerButton>
            <p className="text-slate-500 text-sm mt-4">
              No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
