"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/lib/database";
import { 
  Sparkles, 
  LogOut, 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Target,
  User,
  Settings,
  TrendingUp,
  Calendar,
  Bell,
  Send
} from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!loading && !user) {
        router.push('/auth');
        return;
      }

      if (user) {
        try {
          const profile = await getUserProfile(user.id);
          if (!profile || !profile.onboarding_completed) {
            router.push('/onboarding');
            return;
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          // If profile doesn't exist, redirect to onboarding
          router.push('/onboarding');
          return;
        } finally {
          setProfileLoading(false);
        }
      }
    };

    checkOnboarding();
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      icon: FileText,
      title: "Generate CV",
      description: "Create a professional CV with AI",
      color: "from-blue-500 to-cyan-500",
      href: "/cv-builder"
    },
    {
      icon: MessageSquare,
      title: "Interview Practice",
      description: "Practice with our AI coach",
      color: "from-purple-500 to-pink-500",
      href: "/interview-practice"
    },
    {
      icon: Briefcase,
      title: "Job Matches",
      description: "Find your perfect role",
      color: "from-green-500 to-emerald-500",
      href: "/job-matches"
    },
    {
      icon: Target,
      title: "Career Score",
      description: "Check your readiness",
      color: "from-orange-500 to-red-500",
      href: "/career-score"
    }
  ];

  const stats = [
    { label: "Profile Completion", value: "85%", icon: User },
    { label: "Applications Sent", value: "12", icon: Send },
    { label: "Interview Invites", value: "3", icon: Calendar },
    { label: "Career Score", value: "88", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-sky-500" />
              <span className="text-2xl font-bold text-slate-900">JobSpark</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-slate-700 font-medium hidden sm:block">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-slate-600">
            Ready to take the next step in your career journey?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-sky-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                       style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                  <div className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm group-hover:shadow-lg transition-all duration-300">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.title}</h3>
                    <p className="text-slate-600 text-sm">{action.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Profile Completed</p>
                <p className="text-sm text-slate-600">You completed your onboarding process</p>
              </div>
              <span className="text-sm text-slate-500">Just now</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Account Created</p>
                <p className="text-sm text-slate-600">Welcome to JobSpark!</p>
              </div>
              <span className="text-sm text-slate-500">Today</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;