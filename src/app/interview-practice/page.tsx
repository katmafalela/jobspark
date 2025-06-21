"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  Star,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type CategoryKey = "behavioral" | "technical";

const InterviewPracticePage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>("behavioral");
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const categories = [
    {
      id: "behavioral",
      title: "Behavioral",
      description: "Tell me about a time when...",
      count: 25,
    },
    {
      id: "technical",
      title: "Technical",
      description: "Problem-solving questions",
      count: 30,
    },
    {
      id: "situational",
      title: "Situational",
      description: "How would you handle...",
      count: 20,
    },
    {
      id: "leadership",
      title: "Leadership",
      description: "Management scenarios",
      count: 15,
    },
  ];

  const questions: Record<CategoryKey, string[]> = {
    behavioral: [
      "Tell me about a time when you had to work under pressure.",
      "Describe a situation where you had to work with a difficult team member.",
      "Give me an example of when you showed leadership.",
      "Tell me about a time you failed and what you learned from it.",
    ],
    technical: [
      "How would you approach debugging a complex system issue?",
      "Explain the difference between SQL and NoSQL databases.",
      "Walk me through your problem-solving process.",
      "How do you stay updated with new technologies?",
    ],
  };

  const currentQuestions = questions[selectedCategory] || questions.behavioral;

  const feedback = {
    overall: 85,
    categories: [
      {
        name: "Clarity",
        score: 88,
        feedback: "Your responses were clear and well-structured",
      },
      {
        name: "Confidence",
        score: 82,
        feedback: "Good confidence level, try to reduce filler words",
      },
      {
        name: "Relevance",
        score: 90,
        feedback: "Excellent use of relevant examples",
      },
      {
        name: "Communication",
        score: 80,
        feedback: "Good pace, consider varying your tone more",
      },
    ],
  };

  const startSession = () => {
    setSessionStarted(true);
    setCurrentQuestion(0);
    setShowFeedback(false);
  };

  const endSession = () => {
    setSessionStarted(false);
    setShowFeedback(true);
    setIsRecording(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endSession();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 text-purple-500" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Interview Practice
                  </h1>
                  <p className="text-sm text-slate-600">
                    Practice with our AI coach
                  </p>
                </div>
              </div>
            </div>

            {sessionStarted && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Question {currentQuestion + 1} of {currentQuestions.length}
                  </span>
                </div>
                <button
                  onClick={endSession}
                  className="px-4 py-2 text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  End Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!sessionStarted && !showFeedback && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Choose Your Interview Focus
                </h2>
                <p className="text-lg text-slate-600">
                  Select a category to practice with AI-powered interview
                  questions
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {category.title}
                      </h3>
                      <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {category.count} questions
                      </span>
                    </div>
                    <p className="text-slate-600">{category.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Ready to Practice?
                  </h3>
                  <p className="text-slate-600">
                    You'll be asked {currentQuestions.length} questions from the{" "}
                    {categories.find((c) => c.id === selectedCategory)?.title}{" "}
                    category. Take your time to think and respond naturally.
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={startSession}
                    className="flex items-center space-x-2 px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Practice Session</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {sessionStarted && (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Interview Question
                  </h2>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentQuestion + 1) / currentQuestions.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 mb-8">
                  <p className="text-lg text-slate-800 leading-relaxed">
                    {currentQuestions[currentQuestion]}
                  </p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-600"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="w-8 h-8" />
                      ) : (
                        <Mic className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600">
                    {isRecording
                      ? "Recording your response..."
                      : "Click to start recording"}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() =>
                      setCurrentQuestion(Math.max(0, currentQuestion - 1))
                    }
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {currentQuestion === currentQuestions.length - 1
                      ? "Finish"
                      : "Next Question"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {showFeedback && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Session Complete!
                </h2>
                <p className="text-lg text-slate-600">
                  Here's your AI-powered feedback
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {feedback.overall}%
                  </div>
                  <div className="text-slate-600">Overall Score</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {currentQuestions.length}
                  </div>
                  <div className="text-slate-600">Questions Answered</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    12m
                  </div>
                  <div className="text-slate-600">Session Duration</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Detailed Feedback
                </h3>
                <div className="space-y-6">
                  {feedback.categories.map((category, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            category.score >= 85
                              ? "bg-green-100"
                              : category.score >= 70
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          {category.score >= 85 ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : category.score >= 70 ? (
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {category.name}
                          </h4>
                          <span className="text-lg font-bold text-slate-700">
                            {category.score}%
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">
                          {category.feedback}
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              category.score >= 85
                                ? "bg-green-500"
                                : category.score >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${category.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    setSessionStarted(false);
                  }}
                  className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Practice Again
                </button>
                <Link href="/dashboard">
                  <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewPracticePage;
