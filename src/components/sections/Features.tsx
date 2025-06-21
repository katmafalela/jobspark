"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { FileText, MessageSquare, Briefcase, Target, Mic } from "lucide-react";
import React, { useState, useEffect } from "react";

// --- Enhanced Visual Components ---

const CVVisual = () => (
  <div className="w-full h-full p-8 flex flex-col justify-center items-start bg-white shadow-lg rounded-2xl">
    <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}
        className="font-bold text-slate-800 mb-4 text-lg">AI Generating CV...</motion.p>
    <motion.div
        className="w-full space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
            visible: { transition: { staggerChildren: 0.3 } }
        }}
    >
        {[...Array(4)].map((_, i) => (
            <motion.div 
                key={i}
                className="h-3 rounded-full bg-gradient-to-r from-sky-200 to-indigo-200"
                variants={{
                    hidden: { opacity: 0, width: "0%" },
                    visible: { opacity: 1, width: i % 2 === 0 ? "100%" : "85%" }
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
        ))}
    </motion.div>
  </div>
);

const InterviewVisual = () => (
  <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-white shadow-lg rounded-2xl">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-4 p-4 bg-indigo-100 rounded-full">
      <Mic className="w-8 h-8 text-indigo-500" />
    </motion.div>
    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
      className="text-sm text-center font-medium text-indigo-700 bg-indigo-100 px-3 py-2 rounded-lg">
      "Tell me about a time you showed leadership."
    </motion.p>
  </div>
);

const ConnectionsVisual = () => (
    <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-white shadow-lg rounded-2xl">
        <p className="font-bold text-slate-800 mb-4 text-lg">Matching with Companies...</p>
        <div className="relative w-48 h-24">
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-full h-full p-4 bg-green-100 border-2 border-green-200 rounded-xl flex items-center"
                    initial={{ y: 0, rotate: 0, scale: 1 }}
                    animate={{ 
                        y: -i * 15,
                        rotate: (i - 1) * 10,
                        scale: 1 - i * 0.05
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 10, delay: i * 0.2 }}
                >
                    <Briefcase className="w-6 h-6 text-green-600 mr-2"/>
                    <span className="font-semibold text-green-800">Company {i + 1}</span>
                </motion.div>
            ))}
        </div>
    </div>
);

const ScoreVisual = () => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    const circumference = 2 * Math.PI * 45; // r=45

    useEffect(() => {
        const controls = animate(count, 88, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [count]);

    return (
        <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-white shadow-lg rounded-2xl">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="stroke-amber-100" strokeWidth="10" fill="none" />
                    <motion.circle
                        cx="50" cy="50" r="45"
                        className="stroke-amber-400 -rotate-90 origin-center"
                        strokeWidth="10" fill="none"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference * (1 - 0.88) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span className="text-4xl font-extrabold text-amber-500">{rounded}</motion.span>
                    <span className="text-xl font-bold text-amber-500">%</span>
                </div>
            </div>
            <p className="font-bold text-slate-800 mt-4 text-lg">Readiness Score</p>
        </div>
    );
};

// --- Main Feature List ---
const features = [
  { icon: FileText, title: "AI-Powered CV Generation", description: "Our AI crafts a professional CV tailored to your dream job.", visual: <CVVisual/> },
  { icon: MessageSquare, title: "Interview Coaching", description: "Practice with our AI coach and get instant, actionable feedback.", visual: <InterviewVisual/> },
  { icon: Briefcase, title: "Direct Employer Connections", description: "Get discovered by top companies actively hiring on our platform.", visual: <ConnectionsVisual/> },
  { icon: Target, title: "Career Readiness Score", description: "Quantify your job-readiness and get insights to improve your profile.", visual: <ScoreVisual/> },
];

export const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section id="features" className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">A Smarter Way to Get Hired</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">Our intelligent suite of tools gives you a competitive edge at every stage.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div key={feature.title} onMouseEnter={() => setActiveIndex(index)}
                className="relative p-6 rounded-2xl cursor-pointer">
                {activeIndex === index && (
                  <motion.div layoutId="active-feature-background"
                    className="absolute inset-0 bg-white border border-slate-200/80 shadow-md"
                    style={{ borderRadius: 16 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
                )}
                <div className="relative z-10 flex items-start gap-4">
                  <motion.div className="p-2.5 rounded-lg"
                    animate={{
                        backgroundColor: activeIndex === index ? "#0ea5e91a" : "#f1f5f9",
                        color: activeIndex === index ? "#0ea5e9" : "#64748b"
                    }}>
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative w-full aspect-[4/3] backdrop-blur-sm rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                {features[activeIndex].visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};