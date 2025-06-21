"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, MessageSquare, Briefcase, Target, ArrowRight } from "lucide-react";
import React, { useState } from "react";

const features = [
  {
    icon: FileText,
    title: "AI-Powered CV Generation",
    description: "Our AI analyzes your experience and crafts a professional CV tailored to your dream job, highlighting your most impactful skills.",
    visual: (
        <div className="w-full h-full p-8 flex flex-col justify-center items-start bg-sky-50 rounded-2xl">
            <p className="font-bold text-sky-900 mb-2">CV_Alice_ProductManager_v4.pdf</p>
            <div className="w-full h-2 rounded-full bg-sky-200 mb-3" />
            <div className="w-4/5 h-2 rounded-full bg-sky-200 mb-3" />
            <div className="w-full h-2 rounded-full bg-sky-200 mb-3" />
            <div className="w-3/5 h-2 rounded-full bg-sky-200" />
        </div>
    ),
  },
  {
    icon: MessageSquare,
    title: "Interview Coaching",
    description: "Practice with our AI coach. Record your answers, get instant feedback on clarity and confidence, and access tailored tips.",
    visual: (
        <div className="w-full h-full p-8 flex flex-col justify-center items-start bg-indigo-50 rounded-2xl">
            <p className="font-semibold text-indigo-800 bg-indigo-200/50 px-3 py-2 rounded-lg">"Tell me about a time you led a project."</p>
            <ArrowRight className="w-6 h-6 my-4 text-indigo-300 self-center" />
            <p className="font-semibold text-indigo-800 bg-white px-3 py-2 rounded-lg self-end">"Certainly. In my role at Acme Corp..."</p>
        </div>
    ),
  },
  {
    icon: Briefcase,
    title: "Direct Employer Connections",
    description: "Your profile gets matched with top companies. Receive interview requests directly from hiring managers, not just automated portals.",
     visual: (
        <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-green-50 rounded-2xl">
            <p className="font-bold text-green-900 text-lg">New Interview Request!</p>
            <p className="text-green-700">From: TechCorp</p>
            <div className="mt-4 p-4 bg-white rounded-full shadow-lg">
                <Briefcase className="w-8 h-8 text-green-500"/>
            </div>
        </div>
    ),
  },
   {
    icon: Target,
    title: "Career Readiness Score",
    description: "Our system gives you a quantifiable score on your job-readiness and provides actionable insights to improve your profile.",
     visual: (
        <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-amber-50 rounded-2xl">
             <p className="font-bold text-amber-900 text-lg">Readiness Score</p>
             <p className="text-5xl font-extrabold text-amber-500 my-2">88%</p>
             <div className="w-full h-3 bg-amber-200/80 rounded-full overflow-hidden">
                <div className="w-[88%] h-full bg-amber-400" />
             </div>
        </div>
    ),
  },
];

export const Features = () => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">
            A Smarter Way to Get Hired
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our intelligent suite of tools gives you a competitive edge at every stage of your job search.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Feature List */}
          <div className="flex flex-col gap-4">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                onHoverStart={() => setActiveFeature(feature)}
                className="relative p-6 rounded-2xl cursor-pointer"
              >
                {activeFeature.title === feature.title && (
                  <motion.div
                    layoutId="active-feature-background"
                    className="absolute inset-0 bg-sky-50 border border-sky-200/60"
                    style={{ borderRadius: 16 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <div className="relative z-10 flex items-start gap-4">
                  <motion.div 
                    className="p-2.5 rounded-lg"
                    animate={{ 
                        backgroundColor: activeFeature.title === feature.title ? "#ffffff" : "#f1f5f9",
                        color: activeFeature.title === feature.title ? "#0ea5e9" : "#64748b"
                    }}
                   >
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <motion.h3 
                        className="text-lg font-bold text-slate-800 mb-1"
                        animate={{ color: activeFeature.title === feature.title ? "#0f172a" : "#475569" }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p 
                        className="text-slate-600"
                        animate={{ color: activeFeature.title === feature.title ? "#334155" : "#64748b" }}
                    >
                        {feature.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Right Column: Visual Display */}
          <div className="relative w-full aspect-square">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.title}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                {activeFeature.visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};