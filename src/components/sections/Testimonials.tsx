"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const testimonials = [
    { name: "Thabo Ndlovu", role: "Software Engineer, Vodacom", content: "JobSpark's AI CV builder is a game-changer. It helped me highlight my skills in a way I never could have on my own. I landed my dream job in just three weeks.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Aisha Khan", role: "Marketing Manager, Takealot", content: "The interview prep tool was incredible. I went into my interviews feeling so much more confident and prepared. It made all the difference.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Michael Botha", role: "Data Analyst, Standard Bank", content: "A fantastic platform for the South African market. The direct connections to employers are invaluable. I received three offers!", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
];

// Helper to handle wrapping indices
const wrap = (index: number, length: number) => {
  return ((index % length) + length) % length;
};

export const Testimonials = () => {
    const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
    const [isHovered, setIsHovered] = useState(false);

    const changeTestimonial = (newDirection: number) => {
        setActiveIndex([wrap(activeIndex + newDirection, testimonials.length), newDirection]);
    };
    
    useEffect(() => {
        if(isHovered) return;
        const interval = setInterval(() => changeTestimonial(1), 6000);
        return () => clearInterval(interval);
    }, [isHovered, activeIndex]);

    const activeTestimonial = testimonials[activeIndex];

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
        center: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 25 } },
        exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0, scale: 0.95, transition: { type: "spring", stiffness: 200, damping: 25 } }),
    };

    return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">Loved by Professionals in SA</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Real stories from people who've transformed their careers with JobSpark.</p>
        </motion.div>
        
        <div 
            className="relative h-80 flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={activeIndex} custom={direction} variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    className="absolute w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-slate-200/80">
                    <Quote className="absolute -top-4 -left-4 w-16 h-16 text-slate-100" />
                    <p className="relative text-lg text-slate-700 mb-6 leading-relaxed">"{activeTestimonial.content}"</p>
                    <div className="flex items-center space-x-4">
                        <Image src={activeTestimonial.avatar} alt={activeTestimonial.name} width={56} height={56} className="w-14 h-14 rounded-full border-2 border-sky-200 object-cover" />
                        <div>
                            <div className="font-bold text-slate-800">{activeTestimonial.name}</div>
                            <div className="text-sm text-slate-500">{activeTestimonial.role}</div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
            <button onClick={() => changeTestimonial(-1)} className="absolute left-0 -translate-x-12 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors shadow-md z-20"><ArrowLeft className="w-6 h-6 text-slate-600"/></button>
            <button onClick={() => changeTestimonial(1)} className="absolute right-0 translate-x-12 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors shadow-md z-20"><ArrowRight className="w-6 h-6 text-slate-600"/></button>
        </div>
      </div>
    </section>
  );
};