"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Briefcase, Target } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "AI-Powered CV Generation",
      description:
        "Create professional CVs in minutes with intelligent content suggestions tailored to your target role.",
    },
    {
      icon: MessageSquare,
      title: "Interview Coaching",
      description:
        "Practice with our AI coach and get instant feedback on your answers, tone, and delivery.",
    },
    {
      icon: Briefcase,
      title: "Direct Employer Connections",
      description:
        "Get discovered by top South African companies actively hiring on our exclusive platform.",
    },
    {
      icon: Target,
      title: "Career Readiness Score",
      description:
        "Quantify your job-readiness and get actionable insights to improve your profile and skills.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-4">
            A Smarter Way to Get Hired
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our intelligent suite of tools gives you a competitive edge at every
            stage of your job search.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 overflow-hidden"
            >
              {/* Neon border glow on hover */}
              <div className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-2xl blur-md"></div>
                <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-2xl"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <feature.icon className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_3px_rgba(var(--neon-cyan-rgb),0.5)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed pl-16">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
