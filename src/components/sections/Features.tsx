"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
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

// --- NEW Multi-Layered Interactive Parallax Card ---
const InteractiveFeatureCard = ({ feature }: { feature: any }) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };
    
    // Parallax transformations for inner elements
    const iconX = useTransform(mouseX, [0, 300], [15, -15]);
    const iconY = useTransform(mouseY, [0, 380], [15, -15]);
    const titleX = useTransform(mouseX, [0, 300], [8, -8]);
    const titleY = useTransform(mouseY, [0, 380], [8, -8]);
    const textX = useTransform(mouseX, [0, 300], [4, -4]);
    const textY = useTransform(mouseY, [0, 380], [4, -4]);
    
    // 3D Tilt for the card itself
    const rotateX = useTransform(mouseY, [0, 380], [-7, 7]);
    const rotateY = useTransform(mouseX, [0, 300], [7, -7]);
    
    // Dynamic glow effect
    const glowX = useTransform(mouseX, [0, 300], [-100, 400]);
    const glowY = useTransform(mouseY, [0, 380], [-100, 480]);


    return (
        <motion.div
            ref={cardRef}
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="group relative w-full aspect-[4/5] p-8 rounded-3xl overflow-hidden
                       bg-white/40 backdrop-blur-lg 
                       border border-slate-200/50 shadow-2xl shadow-slate-300/20"
        >
            <motion.div 
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    x: glowX,
                    y: glowY,
                    background: "radial-gradient(circle, #0ea5e966, transparent 50%)",
                }}
            />
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
                <motion.div
                    style={{ x: iconX, y: iconY }}
                    className="p-4 bg-white rounded-full mb-6 shadow-lg"
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                >
                    <feature.icon className="w-10 h-10 text-sky-500" />
                </motion.div>
                
                <motion.h3 
                    style={{ x: titleX, y: titleY }}
                    className="text-xl font-bold text-slate-900 mb-2"
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                >
                    {feature.title}
                </motion.h3>
                
                <motion.p 
                    style={{ x: textX, y: textY }}
                    className="text-slate-600 leading-relaxed max-w-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                >
                    {feature.description}
                </motion.p>
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
    <section className="py-24 bg-slate-50 relative">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-50" />

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
                <InteractiveFeatureCard key={feature.title} feature={feature} />
            ))}
            </motion.div>
        </div>
    </section>
  );
};