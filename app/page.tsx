'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Users, 
  Building2, 
  TrendingUp, 
  Star,
  Play,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Award,
  MessageSquare
} from 'lucide-react'
import { useState } from 'react'
import AnimatedCounter from '@/components/AnimatedCounter'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered CV Generation",
      description: "Create professional CVs in minutes with intelligent content optimization",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Interview Coaching",
      description: "Practice with AI-powered feedback and real-time performance analytics",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Direct Employer Connections",
      description: "Connect with South African companies actively hiring",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Target,
      title: "Career Readiness Score",
      description: "Track your job application progress with AI-driven insights",
      color: "from-orange-500 to-red-500"
    }
  ]

  const steps = [
    {
      number: 1,
      title: "Build Your Profile",
      description: "Complete your professional profile with our guided setup process",
      color: "bg-blue-500"
    },
    {
      number: 2,
      title: "Practice & Prepare",
      description: "Use AI-powered tools to create CVs and practice interviews",
      color: "bg-purple-500"
    },
    {
      number: 3,
      title: "Apply & Succeed",
      description: "Apply to curated job opportunities and track your progress",
      color: "bg-green-500"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer at TechCorp",
      content: "JobSpark helped me land my dream job in just 3 weeks. The AI coaching was incredible.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager at Digital Agency",
      content: "The CV builder created a professional resume that got me 5 interviews in one week.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Data Analyst at FinTech Solutions",
      content: "Interview practice sessions boosted my confidence and improved my success rate.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50"
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
              <span className="text-xl font-bold text-gray-900">JobSpark</span>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              <motion.button 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                whileHover={{ y: -2 }}
              >
                Login
              </motion.button>
              <motion.button 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover-lift"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-50 blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Land Your Dream Job with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Career Tools
                </span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl"
              >
                Join thousands of South African job seekers who've accelerated their careers with our intelligent platform. Get personalized CV generation, interview coaching, and direct employer connections.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              >
                <motion.button
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center group hover-lift"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center hover-lift"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-sm text-gray-500 text-center lg:text-left"
              >
                Trusted by professionals at
                <div className="flex items-center justify-center lg:justify-start space-x-6 mt-2 text-gray-400">
                  <span>TechCorp</span>
                  <span>•</span>
                  <span>Standard Bank</span>
                  <span>•</span>
                  <span>Shoprite</span>
                  <span>•</span>
                  <span>MTN Group</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Professional handshake" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: 10000, suffix: '+', label: 'Careers Helped', icon: Users },
              { value: 500, suffix: '+', label: 'Partner Companies', icon: Building2 },
              { value: 85, suffix: '%', label: 'Success Rate', icon: TrendingUp },
              { value: 4.9, suffix: '/5', label: 'User Rating', icon: Star }
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
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </motion.div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <div className="text-gray-600 mt-2 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
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
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Our comprehensive platform provides all the tools you need to land your next role
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover-lift"
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300",
                    feature.color
                  )}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How JobSpark Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get job-ready in three simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                    step.color
                  )}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-white font-bold text-xl">{step.number}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how JobSpark has transformed careers across South Africa
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
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover-lift"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful job seekers who've found their dream roles with JobSpark
            </p>
            <motion.button
              className="bg-white text-blue-600 px-12 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 group hover-lift"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Access the App Now
              <Zap className="inline-block ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </motion.button>
            <p className="text-blue-100 text-sm mt-4">
              Free to start • No Credit Card Required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              className="flex items-center justify-center space-x-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">JobSpark</span>
            </motion.div>
            
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Empowering South African professionals to achieve their career goals through AI-powered tools and personalized guidance.
            </p>
            
            <div className="flex justify-center space-x-8 mb-8 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms & Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">South Africa Focused</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">24/7 Support</a>
            </div>
            
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm">
                &copy; 2025 JobSpark. All rights reserved. Empowering South African talent.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}