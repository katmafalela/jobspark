"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Eye, 
  Sparkles, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Plus,
  Trash2,
  Save
} from "lucide-react";
import Link from "next/link";

const CVBuilderPage = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvData, setCvData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: []
  });

  const sections = [
    { id: "personal", title: "Personal Info", icon: User },
    { id: "experience", title: "Experience", icon: Briefcase },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "skills", title: "Skills", icon: Award }
  ];

  const handleGenerateCV = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        title: "",
        company: "",
        duration: "",
        description: ""
      }]
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        degree: "",
        institution: "",
        year: "",
        description: ""
      }]
    }));
  };

  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now(), name: "", level: "Intermediate" }]
    }));
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
                <FileText className="w-8 h-8 text-sky-500" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">CV Builder</h1>
                  <p className="text-sm text-slate-600">Create your professional CV with AI</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button 
                onClick={handleGenerateCV}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isGenerating ? "Generating..." : "AI Generate"}</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">CV Sections</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-sky-100 text-sky-700 border border-sky-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-sm text-slate-600 mb-2">Completion</div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <div className="text-sm text-slate-500 mt-1">65% Complete</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <AnimatePresence mode="wait">
                {activeSection === "personal" && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <User className="w-6 h-6 text-sky-500" />
                      <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          placeholder="+27 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          placeholder="City, Province"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Write a brief summary of your professional background and career objectives..."
                      />
                    </div>
                  </motion.div>
                )}

                {activeSection === "experience" && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-6 h-6 text-sky-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
                      </div>
                      <button
                        onClick={addExperience}
                        className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Experience</span>
                      </button>
                    </div>
                    
                    {cvData.experience.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>No work experience added yet.</p>
                        <p className="text-sm">Click "Add Experience" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cvData.experience.map((exp, index) => (
                          <div key={exp.id} className="border border-slate-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-semibold text-slate-900">Experience #{index + 1}</h3>
                              <button className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <input
                                type="text"
                                placeholder="Job Title"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                              />
                              <input
                                type="text"
                                placeholder="Company Name"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Duration (e.g., Jan 2020 - Present)"
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
                            />
                            <textarea
                              rows={3}
                              placeholder="Describe your responsibilities and achievements..."
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSection === "education" && (
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="w-6 h-6 text-sky-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                      </div>
                      <button
                        onClick={addEducation}
                        className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Education</span>
                      </button>
                    </div>
                    
                    {cvData.education.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>No education added yet.</p>
                        <p className="text-sm">Click "Add Education" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cvData.education.map((edu, index) => (
                          <div key={edu.id} className="border border-slate-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-semibold text-slate-900">Education #{index + 1}</h3>
                              <button className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <input
                                type="text"
                                placeholder="Degree/Qualification"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                              />
                              <input
                                type="text"
                                placeholder="Institution"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Year (e.g., 2020)"
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
                            />
                            <textarea
                              rows={2}
                              placeholder="Additional details (optional)..."
                              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSection === "skills" && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Award className="w-6 h-6 text-sky-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
                      </div>
                      <button
                        onClick={addSkill}
                        className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Skill</span>
                      </button>
                    </div>
                    
                    {cvData.skills.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>No skills added yet.</p>
                        <p className="text-sm">Click "Add Skill" to get started.</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {cvData.skills.map((skill, index) => (
                          <div key={skill.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-semibold text-slate-900">Skill #{index + 1}</h3>
                              <button className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Skill name"
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 mb-3"
                            />
                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                              <option>Expert</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors">
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <div className="flex space-x-3">
                  <button className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    Next Section
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilderPage;