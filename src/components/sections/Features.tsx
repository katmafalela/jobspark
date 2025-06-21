"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Briefcase, Target, ArrowRight } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "AI-Powered CV Generation",
      description:
        "Create professional CVs in minutes with intelligent content suggestions tailored to your target role.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
      icon: MessageSquare,
      title: "Interview Coaching",
      description:
        "Practice with our AI coach and get instant feedback on your answers, tone, and delivery.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    },
    {
      icon: Briefcase,
      title: "Direct Employer Connections",
      description:
        "Get discovered by top South African companies actively hiring on our exclusive platform.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    },
    {
      icon: Target,
      title: "Career Readiness Score",
      description:
        "Quantify your job-readiness and get actionable insights to improve your profile and skills.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
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
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
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
              whileHover={{ y: -5 }}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:border-transparent transition-all duration-300"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Animated border */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-sm`} />
                <div className="absolute inset-0.5 bg-white dark:bg-slate-900 rounded-2xl" />
              </div>

              <div className="relative z-10 p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                <motion.div
                  className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};