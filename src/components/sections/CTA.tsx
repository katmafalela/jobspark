"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import React from "react";

// --- NEW Custom "Shine" Button ---
const ShineButton = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full sm:w-auto px-8 py-4 text-lg font-bold text-slate-800 bg-white rounded-lg overflow-hidden shadow-lg"
        >
            {/* The base text */}
            <span className="relative z-10 flex items-center justify-center">{children}</span>

            {/* The animated shine element */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ x: "-150%", skewX: "-25deg" }}
                whileHover={{
                    x: "150%",
                    transition: { duration: 0.6, ease: "easeInOut" }
                }}
                style={{
                    background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)",
                }}
            />
        </motion.button>
    );
};

export const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="relative text-center rounded-3xl overflow-hidden p-1 bg-gradient-to-br from-sky-300 via-indigo-300 to-sky-300"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-[-100%] -z-10 animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#e0f2fe_0%,#a5b4fc_50%,#e0f2fe_100%)]" />
          
          <div className="relative bg-slate-900/90 backdrop-blur-xl p-12 md:p-16 rounded-[22px]">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-lg text-sky-100/90 mb-10 max-w-2xl mx-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
              Create your profile in minutes and let our AI co-pilot guide you
              to career success. Your next opportunity is just a click away.
            </p>
            <ShineButton>
              Get Started for Free <Zap className="ml-2 w-5 h-5" />
            </ShineButton>
            <p className="text-sky-200/60 text-sm mt-4">
              No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};