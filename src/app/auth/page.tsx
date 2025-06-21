"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle, Shield, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

// --- Custom Floating Label Input ---
const FloatingLabelInput = ({ id, label, icon: Icon, ...props }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(e.target.value !== "");
        if (props.onChange) props.onChange(e);
    };
    const isFloating = isFocused || hasValue;
    return (
        <div className="relative">
            <motion.label htmlFor={id} className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                animate={{ y: isFloating ? -26 : -10, scale: isFloating ? 0.85 : 1, color: isFocused ? "#0ea5e9" : "#64748b" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}>{label}</motion.label>
            <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isFocused ? 'text-sky-500' : 'text-slate-400'}`} />
            <input id={id} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 transition-colors duration-200 text-slate-900" {...props} />
        </div>
    );
};

// --- Animated Benefits Showcase ---
const benefits = [
    { icon: Zap, text: "AI-powered CV generation" },
    { icon: Shield, text: "Secure profile management" },
    { icon: CheckCircle, text: "Direct employer connections" }
];
const AnimatedBenefits = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => { setActiveIndex(prev => (prev + 1) % benefits.length); }, 3000);
        return () => clearInterval(interval);
    }, []);
    const CurrentBenefit = benefits[activeIndex];
    const Icon = CurrentBenefit.icon;
    return (
        <div className="flex flex-col gap-y-4 h-20">
             <AnimatePresence mode="wait">
                <motion.div key={activeIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
                    exit={{ opacity: 0, y: -15, transition: { duration: 0.4, ease: "easeInOut" } }} className="flex items-center space-x-4">
                    <div className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg shadow-md">
                        <Icon className="w-6 h-6 text-sky-500" />
                    </div>
                    <span className="text-slate-700 font-medium text-lg">{CurrentBenefit.text}</span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- Main AuthPage Component ---
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50" />
      <div className="absolute inset-[-200%] -z-10 animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#e0f2fe_0%,#a5b4fc_50%,#e0f2fe_100%)] opacity-30" />

      <main className="w-full max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-slate-400/20 overflow-hidden">
            {/* Left Side */}
            <div className="w-full lg:w-5/12 p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-md mx-auto lg:mx-0">
                    <Link href="/" className="flex items-center space-x-3 mb-8 group">
                        <div className="p-2 border border-slate-200 rounded-full group-hover:bg-white transition-colors"><ArrowLeft className="w-5 h-5 text-slate-500" /></div>
                        <Sparkles className="w-8 h-8 text-sky-500" />
                        <span className="text-2xl font-bold text-slate-900">JobSpark</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">Your Career<br />
                        <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Starts Here</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 leading-relaxed">Join thousands of professionals accelerating their careers with AI-powered tools.</p>
                    <AnimatedBenefits />
                </motion.div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-7/12 p-8 lg:p-12 xl:p-16 bg-white/50 flex items-center justify-center">
                <motion.div className="w-full max-w-md" style={{ perspective: "1000px" }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={isLogin ? "login" : "signup"} initial={{ rotateY: isLogin ? -90 : 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: isLogin ? 90 : -90, opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} style={{ transformStyle: "preserve-3d" }}>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                                <p className="text-slate-600">{isLogin ? "Sign in to continue your journey" : "Start your career transformation today"}</p>
                            </div>
                            <form className="space-y-5">
                                {!isLogin && <FloatingLabelInput id="name" label="Full Name" type="text" icon={User} />}
                                <FloatingLabelInput id="email" label="Email Address" type="email" icon={Mail} />
                                <div className="relative">
                                    <FloatingLabelInput id="password" label="Password" type={showPassword ? "text" : "password"} icon={Lock} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {!isLogin && <FloatingLabelInput id="confirmPassword" label="Confirm Password" type="password" icon={Lock} />}
                                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors">
                                {isLogin ? "Sign In" : "Create Account"}
                                </motion.button>
                                <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500">or</span></div></div>
                                <motion.button type="button" whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }} whileTap={{ scale: 0.98 }} className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:border-slate-300 transition-all flex items-center justify-center space-x-3">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    <span>Continue with Google</span>
                                </motion.button>
                                <p className="text-center pt-4 text-slate-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-sky-500 hover:text-sky-600 font-semibold">{isLogin ? "Sign Up" : "Sign In"}</button>
                                </p>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;