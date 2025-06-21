"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import React, { useRef, useState } from "react";

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: -999, y: -999 })} // Hide spotlight on leave
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-slate-900 p-8 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/50 dark:border-white/10"
    >
      {/* Neon Spotlight Effect */}
      <div
        className="absolute inset-0 opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--neon-cyan-rgb), 0.15), transparent 80%)`,
        }}
      />

      <div className="relative z-10">
        <Quote className="absolute -top-2 -left-2 w-10 h-10 text-slate-200 dark:text-slate-700" />
        <p className="text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">
          "{testimonial.content}"
        </p>
        <div className="flex items-center space-x-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full border-2 border-neon-cyan"
          />
          <div>
            <div className="font-semibold text-slate-800 dark:text-white">
              {testimonial.name}
            </div>
            <div className="text-sm text-slate-500 dark:text-gray-400">
              {testimonial.role}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Thabo Ndlovu",
      role: "Software Engineer, Vodacom",
      content:
        "JobSpark's AI CV builder is a game-changer. It helped me highlight my skills in a way I never could have on my own. I landed my dream job in just three weeks.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Aisha Khan",
      role: "Marketing Manager, Takealot",
      content:
        "The interview prep tool was incredible. I went into my interviews feeling so much more confident and prepared. It made all the difference.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Botha",
      role: "Data Analyst, Standard Bank",
      content:
        "A fantastic platform for the South African market. The direct connections to employers are invaluable. I received three offers!",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-4">
            Loved by Professionals in SA
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from people who've transformed their careers with
            JobSpark.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
