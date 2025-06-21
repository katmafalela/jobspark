"use client";

import { motion } from "framer-motion";
import { UserPlus, PencilRuler, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Build Your Profile",
    description: "Our intuitive onboarding helps you create a comprehensive professional profile that truly stands out.",
  },
  {
    number: "02",
    icon: PencilRuler,
    title: "Enhance & Prepare",
    description: "Leverage AI tools to craft the perfect CV, write compelling cover letters, and ace your interviews.",
  },
  {
    number: "03",
    icon: Send,
    title: "Apply & Succeed",
    description: "Connect with curated opportunities and track your application progress all in one unified platform.",
  },
];

const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", duration: 0.8 }
    }
};

const pathVariants = (isReversed: boolean) => ({
    offscreen: { pathLength: 0 },
    onscreen: { 
        pathLength: 1,
        transition: { duration: 1, ease: "easeInOut", delay: 0.5 }
    }
});

const cometVariants = (isReversed: boolean) => ({
    offscreen: { opacity: 0, offsetDistance: "0%" },
    onscreen: {
        opacity: [0, 1, 1, 0],
        offsetDistance: "100%",
        transition: { duration: 1.5, ease: "linear", delay: 0.7 }
    }
});


const ConnectingLine = ({ isReversed = false }) => (
    <motion.svg
        width="110" height="200" viewBox="0 0 110 200" fill="none"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.5 }}
    >
        <motion.path
            d={isReversed ? "M5 200C125.5 -26.5 5 26.5 105 0" : "M105 200C-15.5 -26.5 105 26.5 5 0"}
            stroke="url(#line-gradient)" strokeWidth="2"
            variants={pathVariants(isReversed)}
        />
        <motion.path
            d={isReversed ? "M5 200C125.5 -26.5 5 26.5 105 0" : "M105 200C-15.5 -26.5 105 26.5 5 0"}
            stroke="url(#glow-gradient)" strokeWidth="8"
            strokeLinecap="round"
            variants={cometVariants(isReversed)}
            className="blur-md"
        />
        <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
        </defs>
    </motion.svg>
);

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">
            Your Path to Success in 3 Steps
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Follow our proven process to go from job seeker to valued employee.
          </p>
        </motion.div>

        <div className="relative max-w-2xl mx-auto">
            {steps.map((step, index) => (
                <div key={step.number} className="relative">
                    <div className={`flex items-center gap-8 ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
                       <motion.div 
                            className="text-8xl font-bold text-slate-200"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            {step.number}
                       </motion.div>
                        <motion.div 
                            variants={cardVariants}
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.4 }}
                            whileHover={{ scale: 1.03, shadow: '0px 15px 30px -10px rgba(0,0,0,0.1)' }}
                            className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg flex-1"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2.5 bg-sky-100 text-sky-500 rounded-lg">
                                    <step.icon className="w-6 h-6"/>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{step.description}</p>
                        </motion.div>
                    </div>

                    {index < steps.length - 1 && (
                        <div className="h-48 w-full">
                            <ConnectingLine isReversed={index % 2 !== 0} />
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};