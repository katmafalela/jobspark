"use client";

import { useState, useEffect } from "react";
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
  Save,
  Loader2,
  Copy,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserProfile,
  getUserExperiences,
  getUserEducation,
  getUserSkills,
  createGeneratedCV,
  getUserCVs
} from "@/lib/database";
import { generateCV, enhanceProfessionalSummary } from "@/lib/gemini";
import type { CVData } from "@/lib/gemini";

const CVBuilderPage = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedCV, setGeneratedCV] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [cvType, setCvType] = useState<'professional' | 'creative' | 'technical' | 'executive'>('professional');
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      professionalSummary: ""
    },
    experiences: [],
    education: [],
    skills: []
  });

  const sections = [
    { id: "personal", title: "Personal Info", icon: User },
    { id: "experience", title: "Experience", icon: Briefcase },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "skills", title: "Skills", icon: Award },
    { id: "generate", title: "Generate CV", icon: Sparkles }
  ];

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [profile, experiences, education, skills] = await Promise.all([
        getUserProfile(user.id),
        getUserExperiences(user.id),
        getUserEducation(user.id),
        getUserSkills(user.id)
      ]);

      if (profile) {
        setCvData(prev => ({
          ...prev,
          personalInfo: {
            fullName: profile.full_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            professionalSummary: profile.professional_summary || ""
          }
        }));
      }

      setCvData(prev => ({
        ...prev,
        experiences: experiences.map(exp => ({
          title: exp.title,
          company: exp.company,
          location: exp.location || "",
          startDate: exp.start_date,
          endDate: exp.end_date || "",
          isCurrent: exp.is_current,
          description: exp.description || ""
        })),
        education: education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location || "",
          graduationYear: edu.graduation_year,
          description: edu.description || ""
        })),
        skills: skills.map(skill => ({
          name: skill.name,
          level: skill.level
        }))
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleGenerateCV = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const cv = await generateCV({
        cvData,
        jobDescription: jobDescription || undefined,
        cvType
      });

      setGeneratedCV(cv);
      setShowPreview(true);

      // Save to database
      await createGeneratedCV({
        user_id: user.id,
        title: `CV - ${new Date().toLocaleDateString()}`,
        content: cv,
        job_description: jobDescription || null
      });
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Failed to generate CV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceSummary = async () => {
    if (!cvData.personalInfo.professionalSummary) return;

    setIsEnhancing(true);
    try {
      const enhanced = await enhanceProfessionalSummary(
        cvData.personalInfo.professionalSummary,
        cvData.experiences
      );

      setCvData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          professionalSummary: enhanced
        }
      }));
    } catch (error) {
      console.error('Error enhancing summary:', error);
      alert('Failed to enhance summary. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCV);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadCV = () => {
    const blob = new Blob([generatedCV], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV-${cvData.personalInfo.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
          <input
            type="text"
            value={cvData.personalInfo.fullName}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: e.target.value }
            }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            type="email"
            value={cvData.personalInfo.email}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
          <input
            type="tel"
            value={cvData.personalInfo.phone}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="+27 XX XXX XXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <input
            type="text"
            value={cvData.personalInfo.location}
            onChange={(e) => setCvData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, location: e.target.value }
            }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="City, Province"
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-slate-700">Professional Summary</label>
          <button
            onClick={handleEnhanceSummary}
            disabled={isEnhancing || !cvData.personalInfo.professionalSummary}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            {isEnhancing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            <span>Enhance with AI</span>
          </button>
        </div>
        <textarea
          rows={4}
          value={cvData.personalInfo.professionalSummary}
          onChange={(e) => setCvData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, professionalSummary: e.target.value }
          }))}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Write a brief summary of your professional background and career objectives..."
        />
      </div>
    </div>
  );

  const renderGenerate = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Job Description (Optional)</label>
        <textarea
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Paste the job description here to tailor your CV..."
        />
        <p className="text-sm text-slate-500 mt-1">
          Adding a job description will help AI tailor your CV to match the role requirements.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">CV Style</label>
        <select
          value={cvType}
          onChange={(e) => setCvType(e.target.value as any)}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="professional">Professional</option>
          <option value="creative">Creative</option>
          <option value="technical">Technical</option>
          <option value="executive">Executive</option>
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Ready to Generate Your CV?</h3>
        <p className="text-blue-800 text-sm mb-4">
          Our AI will create a professional, ATS-friendly CV based on your information. 
          Make sure all sections are complete for the best results.
        </p>
        <button
          onClick={handleGenerateCV}
          disabled={isGenerating || !cvData.personalInfo.fullName}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Your CV...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate CV with AI</span>
            </>
          )}
        </button>
      </div>

      {generatedCV && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">Generated CV</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadCV}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
              {generatedCV}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

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
              {generatedCV && (
                <button 
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? 'Hide' : 'Preview'}</span>
                </button>
              )}
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
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    {sections.find(s => s.id === activeSection)?.icon && (
                      <sections.find(s => s.id === activeSection)!.icon className="w-6 h-6 text-sky-500" />
                    )}
                    <h2 className="text-2xl font-bold text-slate-900">
                      {sections.find(s => s.id === activeSection)?.title}
                    </h2>
                  </div>
                  
                  {activeSection === "personal" && renderPersonalInfo()}
                  {activeSection === "generate" && renderGenerate()}
                  
                  {/* Other sections would be rendered here with similar patterns */}
                  {activeSection === "experience" && (
                    <div className="text-center py-12 text-slate-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>Experience data loaded from your profile.</p>
                      <p className="text-sm">Go to Personal Info or Generate CV to continue.</p>
                    </div>
                  )}
                  
                  {activeSection === "education" && (
                    <div className="text-center py-12 text-slate-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>Education data loaded from your profile.</p>
                      <p className="text-sm">Go to Personal Info or Generate CV to continue.</p>
                    </div>
                  )}
                  
                  {activeSection === "skills" && (
                    <div className="text-center py-12 text-slate-500">
                      <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>Skills data loaded from your profile.</p>
                      <p className="text-sm">Go to Personal Info or Generate CV to continue.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilderPage;