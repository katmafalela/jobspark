'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Video, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Zap,
  CheckCircle,
  Play,
  Menu,
  X,
  Star,
  Award,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import AnimatedCounter from '@/components/AnimatedCounter'
import FloatingElements from '@/components/FloatingElements'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

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
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: FileText,
      title: "AI-Powered CV Builder",
      description: "Create professional, ATS-friendly CVs that get noticed. Our AI ensures your experience shines through perfectly formatted documents.",
      color: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: Video,
      title: "Interview Coach",
      description: "Practice with our AI interview coach and record your best answers. Build confidence and create compelling video pitches.",
      color: "from-purple-500 to-pink-500",
      delay: 0.2
    },
    {
      icon: Users,
      title: "Direct Job Matching",
      description: "Connect directly with quality employers through our integrated TalentSpark network. Skip the generic applications.",
      color: "from-green-500 to-emerald-500",
      delay: 0.4
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Build Your Profile",
      description: "Create a comprehensive professional profile with guided prompts and structured fields.",
      color: "from-blue-500 to-purple-500"
    },
    {
      number: "02", 
      title: "Practice & Prepare",
      description: "Use our AI coach to practice interviews and generate perfect CVs tailored to your goals.",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      title: "Apply with Confidence", 
      description: "Submit high-quality applications with video pitches that showcase your personality.",
      color: "from-pink-500 to-red-500"
    },
    {
      number: "04",
      title: "Get Hired",
      description: "Connect directly with employers who value quality candidates and structured applications.",
      color: "from-red-500 to-orange-500"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      company: "TechCorp",
      content: "JobSpark transformed my job search. The AI CV builder helped me land interviews at top companies.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "GrowthCo",
      content: "The interview coach feature gave me the confidence I needed. Got my dream job within 2 weeks!",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Data Analyst",
      company: "DataFlow",
      content: "Amazing platform! The direct employer connections saved me months of job searching.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobSpark
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'How It Works', 'Testimonials'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
              <ThemeToggle />
              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-4 py-4 space-y-4">
              {['Features', 'How It Works', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <FloatingElements />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-sm font-medium text-blue-800 dark:text-blue-200 mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Transforming South African Careers
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Your Career Journey
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Starts Here
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            >
              JobSpark empowers South African talent with AI-powered tools to build perfect CVs, 
              practice interviews, and connect directly with quality employers.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                Build Your Profile
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                className="group border-2 border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative h-96 lg:h-[500px] flex items-center justify-center"
          >
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Central gradient orb */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
              
              {/* Rotating rings */}
              <div className="absolute inset-4 border-2 border-blue-500/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-8 border-2 border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              <div className="absolute inset-12 border-2 border-pink-500/30 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
              
              {/* Floating icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
              
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Our comprehensive platform prepares you for every step of your job search journey
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group bg-card p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300",
                    feature.color
                  )}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How JobSpark{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, powerful process that transforms how you approach job searching
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  className={cn(
                    "w-16 h-16 bg-gradient-to-r rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                    step.color
                  )}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-white font-bold text-xl">{step.number}</span>
                </motion.div>
                <h3 className="text-lg font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 text-center text-white"
          >
            {[
              { value: 10000, suffix: '+', label: 'Candidates Prepared', icon: Users },
              { value: 500, suffix: '+', label: 'Partner Companies', icon: Award },
              { value: 85, suffix: '%', label: 'Success Rate', icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  className="flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <stat.icon className="w-8 h-8 mr-2 opacity-80" />
                </motion.div>
                <motion.div
                  className="text-4xl md:text-6xl font-bold mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                <div className="text-xl opacity-90 group-hover:opacity-100 transition-opacity">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What Our Users{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from professionals who transformed their careers with JobSpark
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-2xl shadow-lg border border-border"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Career?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of South African professionals who have already elevated their job search with JobSpark.
            </p>
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey Today
              <Zap className="inline-block ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <motion.div
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">JobSpark</span>
              </motion.div>
              <p className="text-muted-foreground leading-relaxed">
                Empowering South African talent with the tools and connections needed to succeed in today's job market.
              </p>
            </div>
            
            {[
              {
                title: 'Platform',
                links: ['CV Builder', 'Interview Coach', 'Job Board', 'Profile Builder']
              },
              {
                title: 'Company', 
                links: ['About Us', 'Careers', 'Contact', 'Blog']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Cookie Policy']
              }
            ].map((section, index) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        className="hover:text-foreground transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <motion.div
            className="border-t border-border mt-12 pt-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2025 JobSpark. All rights reserved. Empowering South African talent.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}