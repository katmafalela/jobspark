"use client";

import { motion } from "framer-motion";
import { Zap, Building2, TrendingUp, Star } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter"; // Assuming this component exists

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

export const Stats = () => {
  const stats = [
    { value: 12500, label: "Careers Launched", icon: Zap },
    { value: 650, label: "Partner Companies", icon: Building2 },
    { value: 92, suffix: "%", label: "Success Rate", icon: TrendingUp },
    { value: 4.9, suffix: "/5", label: "User Rating", icon: Star, precision: 1 },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform's success is measured by the success of our users.
            Here's a look at our impact.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="relative group"
            >
              {/* Background Glow on Hover */}
              <div className="absolute -inset-2 bg-gradient-to-br from-sky-200 to-indigo-200 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-xl"></div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative text-center bg-white/60 backdrop-blur-md border border-slate-200/80 p-8 rounded-2xl h-full flex flex-col items-center justify-center shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-4 bg-sky-100 rounded-full mb-4"
                >
                  <stat.icon className="w-8 h-8 text-sky-500" />
                </motion.div>

                <div className="text-5xl font-extrabold tracking-tighter text-slate-900">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} precision={stat.precision} />
                </div>
                <div className="text-slate-500 mt-2 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};