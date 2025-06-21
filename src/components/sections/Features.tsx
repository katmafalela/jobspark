"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { FileText, MessageSquare, Briefcase, Target, Zap } from "lucide-react";
import React, { useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 13 },
  },
};

// --- Custom Interactive Feature Card ---
const FeatureCard = ({ feature }: { feature: any }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width);
        mouseY.set((clientY - top) / height);
    }
    
    // Spring-based transformations for a smooth 3D tilt
    const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
    const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);
    
    // Spotlight gradient position
    const spotlightX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
    const spotlightY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

    return (
        <motion.div
            ref={cardRef}
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                mouseX.set(0.5);
                mouseY.set(0.5);
            }}
            style={{ rotateX, rotateY, perspective: 800 }}
            className="relative w-full aspect-square bg-white/40 backdrop-blur-lg border border-white/50 rounded-3xl p-8 text-center flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-slate-300/20"
        >
             {/* The moving spotlight effect */}
            <motion.div
                className="absolute inset-0 z-0 opacity-50"
                style={{
                    background: `radial-gradient(circle at ${spotlightX} ${spotlightY}, #bae6fd, transparent 40%)`,
                }}
            />
            
            {/* The content */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    className="p-4 bg-white/80 rounded-full mb-6 shadow-lg"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
                className="grid sm:grid-cols-2 md:grid-cols-4 gap-8"
            >
            {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
            ))}
            </motion.div>
        </div>
    </section>
  );
};