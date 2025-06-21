"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Building2,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  MessageSquare,
  FileText,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import AnimatedCounter from "@/components/AnimatedCounter";
import { cn } from "@/lib/utils";

// Animation variants for sections and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// A sleek, glowing button component
const GlowButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      "relative inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 overflow-hidden transition-all duration-300 hover:bg-blue-700 group",
      className
    )}
  >
    <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
    <span className="relative">{children}</span>
  </motion.button>
);

export default function Home() {
  // Data structures updated for the new design
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

  const steps = [
    {
      number: "01",
      title: "Build Your Profile",
      description:
        "Our intuitive onboarding process helps you create a comprehensive professional profile that stands out.",
    },
    {
      number: "02",
      title: "Enhance & Prepare",
      description:
        "Leverage AI tools to craft the perfect CV, write compelling cover letters, and ace your interviews.",
    },
    {
      number: "03",
      title: "Apply & Succeed",
      description:
        "Connect with curated opportunities and track your application progress all in one place.",
    },
  ];

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
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* --- Navigation --- */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 w-full bg-slate-50/80 backdrop-blur-xl z-50 border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.a
              href="#"
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-7 h-7 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">
                JobSpark
              </span>
            </motion.a>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Company
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ y: -2 }}
                className="font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Login
              </motion.button>
              <GlowButton>Get Started Free</GlowButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.h1
              variants={itemVariants as any}
              className="text-5xl lg:text-7xl font-bold tracking-tighter text-slate-900 mb-6"
            >
              Your AI-Powered <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                Career Co-Pilot
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants as any}
              className="text-lg lg:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Accelerate your job search in South Africa with intelligent tools
              for CV building, interview practice, and direct connections to top
              employers.
            </motion.p>

            <motion.div
              variants={itemVariants as any}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <GlowButton className="px-10 py-4 text-lg">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </GlowButton>
              <motion.button
                whileHover={{ y: -2 }}
                className="font-semibold text-slate-600 hover:text-blue-600 transition-colors px-10 py-4"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="relative"
          >
            {/* Abstract UI Representation */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl transform -rotate-6"></div>
              <div className="absolute w-full h-full bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
                <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg flex flex-col p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <p className="font-semibold text-slate-700">
                      Profile Strength:{" "}
                      <span className="text-blue-600">Excellent</span>
                    </p>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <p className="text-sm font-medium text-slate-600">
                      AI Suggestion: Add 'Project Management' skill
                    </p>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <p className="text-sm font-medium text-slate-600">
                      New Match: Senior Analyst at FinCorp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid md:grid-cols-4 gap-y-12 gap-x-8 text-center"
          >
            {[
              { value: 12500, label: "Careers Launched", icon: Zap },
              { value: 650, label: "Partner Companies", icon: Building2 },
              {
                value: 92,
                suffix: "%",
                label: "Interview Success Rate",
                icon: TrendingUp,
              },
              {
                value: 4.9,
                suffix: "/5",
                label: "Avg. User Rating",
                icon: Star,
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants as any}
                className="flex flex-col items-center"
              >
                <stat.icon className="w-8 h-8 text-blue-500 mb-3" />
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

      {/* --- Features Section --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 mb-4">
              A Smarter Way to Get Hired
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our intelligent suite of tools is designed to give you a
              competitive edge at every stage of your job search.
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
                className="group bg-slate-50 p-8 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-600 leading-relaxed pl-16">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 mb-4">
              Your Path to Success in 3 Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Follow our proven process to go from job seeker to valued
              employee.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 hidden lg:block"></div>

            <div className="grid lg:grid-cols-3 gap-12 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="bg-slate-50 p-8 rounded-xl text-center lg:text-left"
                >
                  <div className="mb-4">
                    <span className="text-6xl font-bold text-blue-200">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 mb-4">
              Loved by Professionals in SA
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real stories from people who've transformed their careers with
              JobSpark.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl relative"
              >
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7 }}
            className="relative bg-blue-600 text-white p-12 lg:p-16 rounded-3xl overflow-hidden text-center"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                Ready to Find Your Dream Job?
              </h2>
              <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                Create your profile in minutes and let our AI co-pilot guide you
                to career success. Your next opportunity is just a click away.
              </p>
              <GlowButton className="bg-white text-blue-600 hover:bg-slate-100 px-10 py-4 text-lg">
                Get Started for Free
                <Zap className="ml-2 w-5 h-5" />
              </GlowButton>
              <p className="text-blue-200 text-sm mt-4">
                No credit card required
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-4 md:col-span-1 mb-8 md:mb-0">
              <a href="#" className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-7 h-7 text-blue-500" />
                <span className="text-2xl font-bold text-white">JobSpark</span>
              </a>
              <p className="text-slate-400 text-sm max-w-xs">
                AI-powered career tools for the modern South African
                professional.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 col-span-4 md:col-span-3 gap-8">
              <div>
                <h3 className="font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Integrations
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} JobSpark. All rights reserved.</p>
            <p>Proudly built for South Africa 🇿🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
