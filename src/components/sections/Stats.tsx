"use client";

import { motion } from "framer-motion";
import { Zap, Building2, TrendingUp, Star } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" } },
};

export const Stats = () => {
  const stats = [
    { value: 12500, label: "Careers Launched", icon: Zap },
    { value: 650, label: "Partner Companies", icon: Building2 },
    { value: 92, suffix: "%", label: "Success Rate", icon: TrendingUp },
    { value: 4.9, suffix: "/5", label: "User Rating", icon: Star },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 text-center"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants as any}
              className="flex flex-col items-center"
            >
              <motion.div whileHover={{ scale: 1.1, y: -5 }}>
                <stat.icon className="w-10 h-10 mb-3 text-neon-cyan drop-shadow-[0_0_8px_rgba(var(--neon-cyan-rgb),0.6)]" />
              </motion.div>
              <div className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate-500 mt-1 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
