"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import React, { useRef } from "react";

// --- Reusing the SpotlightButton from the Hero component ---
const SpotlightButton = ({ children }: { children: React.ReactNode }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: -999, y: -999 })}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full sm:w-auto px-8 py-4 text-lg font-bold text-slate-800 bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0.1), transparent 80%)`,
          opacity: mousePos.x === -999 ? 0 : 1,
        }}
      />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
};

export const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="relative text-center rounded-3xl overflow-hidden"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 bg-[length:200%_200%] animate-gradient-fade" />
          
          <div className="relative bg-white/10 backdrop-blur-md p-12 md:p-16 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.2)]">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-lg text-sky-50 mb-10 max-w-2xl mx-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
              Create your profile in minutes and let our AI co-pilot guide you
              to career success. Your next opportunity is just a click away.
            </p>
            <SpotlightButton>
              Get Started for Free <Zap className="ml-2 w-5 h-5" />
            </SpotlightButton>
            <p className="text-sky-100/80 text-sm mt-4">
              No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};