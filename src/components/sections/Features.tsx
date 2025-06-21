"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Briefcase, Target } from "lucide-react";
import React from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

// --- NEW Interactive Feature Card with Animated Border ---
const FeatureCard = ({ feature }: { feature: any }) => {
    return (
        <motion.div
            variants={itemVariants}
            className="relative w-full aspect-[4/5] p-px rounded-3xl overflow-hidden
                       bg-slate-100 border border-slate-200
                       hover:bg-white hover:border-transparent transition-colors duration-500"
        >
             {/* This inner div is for the main content styling */}
             <div className="relative z-10 w-full h-full bg-white/80 backdrop-blur-md rounded-[23px] p-8 text-center flex flex-col items-center justify-center">
                
                {/* The "Comet" that orbits on hover */}
                <motion.div 
                    className="absolute -z-10 w-40 h-40 opacity-0 group-hover:opacity-100"
                    style={{
                        background: 'radial-gradient(circle, #0ea5e9, transparent 35%)',
                        top: '-50px',
                        left: '-50px',
                    }}
                    whileHover={{
                        opacity: [0.5, 1, 0.5],
                        x: [0, 230, 230, 0, 0],
                        y: [0, 0, 260, 260, 0],
                        transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                />

                <motion.div
                    className="p-4 bg-white rounded-full mb-6 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                >
                    <feature.icon className="w-10 h-10 text-sky-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
};


export const Features = () => {
  const features = [
    { icon: FileText, title: "AI-Powered CV Generation", description: "Create professional CVs in minutes with intelligent suggestions tailored to your target role." },
    { icon: MessageSquare, title: "Interview Coaching", description: "Practice with our AI coach and get instant feedback on your answers, tone, and delivery." },
    { icon: Briefcase, title: "Direct Employer Connections", description: "Get discovered by top companies actively hiring on our exclusive platform." },
    { icon: Target, title: "Career Readiness Score", description: "Quantify your job-readiness and get actionable insights to improve your profile and skills." },
  ];

  return (
    <section className="py-24 bg-white relative">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-20"
            >
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">
                    A Smarter Way to Get Hired
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Our intelligent suite of tools gives you a competitive edge at every stage of your job search.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 group" // Add group here
            >
            {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
            ))}
            </motion.div>
        </div>
    </section>
  );
};