"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  TrendingDown,
  CheckCircle, 
  AlertCircle,
  Star,
  Award,
  FileText,
  MessageSquare,
  Briefcase,
  User,
  RefreshCw,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const CareerScorePage = () => {
  const [overallScore, setOverallScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const scoreData = {
    overall: 88,
    categories: [
      {
        name: "Profile Completeness",
        score: 92,
        maxScore: 100,
        icon: User,
        status: "excellent",
        description: "Your profile is comprehensive and well-detailed",
        improvements: ["Add professional photo", "Include more certifications"]
      },
      {
        name: "CV Quality",
        score: 85,
        maxScore: 100,
        icon: FileText,
        status: "good",
        description: "Strong CV with room for enhancement",
        improvements: ["Add more quantified achievements", "Update skills section"]
      },
      {
        name: "Interview Readiness",
        score: 78,
        maxScore: 100,
        icon: MessageSquare,
        status: "needs-work",
        description: "Practice more to improve confidence",
        improvements: ["Complete more practice sessions", "Work on behavioral questions"]
      },
      {
        name: "Market Alignment",
        score: 95,
        maxScore: 100,
        icon: Briefcase,
        status: "excellent",
        description: "Your skills match current market demands",
        improvements: ["Stay updated with emerging technologies"]
      }
    ],
    trends: [
      { period: "This Week", change: +3, score: 88 },
      { period: "Last Month", change: +7, score: 85 },
      { period: "3 Months Ago", change: +12, score: 81 }
    ],
    recommendations: [
      {
        title: "Complete Interview Practice",
        description: "Boost your interview readiness score by completing 3 more practice sessions",
        impact: "+8 points",
        action: "Start Practice",
        href: "/interview-practice",
        priority: "high"
      },
      {
        title: "Update Your CV",
        description: "Add recent achievements and quantify your impact to improve CV quality",
        impact: "+5 points",
        action: "Edit CV",
        href: "/cv-builder",
        priority: "medium"
      },
      {
        title: "Apply to More Jobs",
        description: "Increase your market presence by applying to 5 more relevant positions",
        impact: "+3 points",
        action: "View Jobs",
        href: "/job-matches",
        priority: "low"
      }
    ]
  };

  useEffect(() => {
    // Animate score on load
    const timer = setTimeout(() => {
      setOverallScore(scoreData.overall);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const recalculateScore = async () => {
    setIsCalculating(true);
    // Simulate recalculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCalculating(false);
    // Could update score here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "needs-work": return "text-orange-600 bg-orange-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return CheckCircle;
      case "good": return CheckCircle;
      case "needs-work": return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-orange-500" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Career Score</h1>
                  <p className="text-sm text-slate-600">Check your readiness</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={recalculateScore}
              disabled={isCalculating}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
              <span>{isCalculating ? "Calculating..." : "Recalculate"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Score Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Career Readiness Score</h2>
                <p className="text-slate-600">Based on your profile, CV, and market alignment</p>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-slate-200"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-orange-500"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - overallScore / 100) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="text-5xl font-bold text-slate-900"
                      >
                        {overallScore}
                      </motion.div>
                      <div className="text-slate-600 font-medium">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full mb-4">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Strong Candidate</span>
                </div>
                <p className="text-slate-600">
                  You're well-positioned for your target roles. Focus on the recommendations below to reach the next level.
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Score Trends</h3>
              <div className="space-y-4">
                {scoreData.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{trend.period}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900">{trend.score}</span>
                      <div className={`flex items-center space-x-1 ${
                        trend.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.change > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {trend.change > 0 ? '+' : ''}{trend.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Rank</span>
                  <span className="font-semibold text-slate-900">Top 15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Improvement</span>
                  <span className="font-semibold text-green-600">+12 this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Next Goal</span>
                  <span className="font-semibold text-slate-900">90+ Score</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Score Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {scoreData.categories.map((category, index) => {
              const StatusIcon = getStatusIcon(category.status);
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <category.icon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{category.name}</h3>
                        <p className="text-sm text-slate-600">{category.description}</p>
                      </div>
                    </div>
                    <div className={`p-1 rounded-full ${getStatusColor(category.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Score</span>
                      <span className="font-bold text-slate-900">{category.score}/{category.maxScore}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        className="bg-orange-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(category.score / category.maxScore) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Improvements:</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {category.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-900">Recommendations</h2>
          </div>
          
          <div className="space-y-4">
            {scoreData.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`border-l-4 pl-6 py-4 ${
                  rec.priority === 'high' ? 'border-red-400 bg-red-50' :
                  rec.priority === 'medium' ? 'border-orange-400 bg-orange-50' :
                  'border-blue-400 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-slate-600 mb-2">{rec.description}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span className="font-medium text-orange-600">Potential impact: {rec.impact}</span>
                    </div>
                  </div>
                  <Link href={rec.href}>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                      <span>{rec.action}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerScorePage;