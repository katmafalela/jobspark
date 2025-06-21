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
  CheckCircle,
  Edit3,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Building2,
  Palette,
  Type,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserProfile,
  getUserExperiences,
  getUserEducation,
  getUserSkills,
  createGeneratedCV,
  getUserCVs
} from "@/lib/database";
import { generateCV, enhanceProfessionalSummary, generateExperienceDescription, suggestSkills, type CVData } from "@/lib/api";

interface CVSection {
  id: string;
  title: string;
  isComplete: boolean;
  isEditing: boolean;
}

const CVBuilderPage = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [cvType, setCvType] = useState<'professional' | 'creative' | 'technical' | 'executive'>('professional');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [enhancingExperience, setEnhancingExperience] = useState<number | null>(null);
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

  const [sections, setSections] = useState<CVSection[]>([
    { id: "personal", title: "Personal Info", isComplete: false, isEditing: false },
    { id: "experience", title: "Experience", isComplete: false, isEditing: false },
    { id: "education", title: "Education", isComplete: false, isEditing: false },
    { id: "skills", title: "Skills", isComplete: false, isEditing: false }
  ]);

  useEffect(() => {
    loadUserData();
  }, [user]);

  useEffect(() => {
    updateSectionCompleteness();
  }, [cvData]);

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

  const updateSectionCompleteness = () => {
    setSections(prev => prev.map(section => {
      let isComplete = false;
      switch (section.id) {
        case "personal":
          isComplete = !!(cvData.personalInfo.fullName && cvData.personalInfo.email);
          break;
        case "experience":
          isComplete = cvData.experiences.length > 0 && cvData.experiences.some(exp => exp.title && exp.company);
          break;
        case "education":
          isComplete = cvData.education.length > 0 && cvData.education.some(edu => edu.degree && edu.institution);
          break;
        case "skills":
          isComplete = cvData.skills.length > 0 && cvData.skills.some(skill => skill.name);
          break;
      }
      return { ...section, isComplete };
    }));
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

  const handleGenerateExperience = async (index: number) => {
    const experience = cvData.experiences[index];
    if (!experience.title || !experience.company) return;

    setEnhancingExperience(index);
    try {
      const enhanced = await generateExperienceDescription(
        experience.title,
        experience.company,
        experience.description || `Worked as ${experience.title} at ${experience.company}`
      );

      setCvData(prev => ({
        ...prev,
        experiences: prev.experiences.map((exp, i) => 
          i === index ? { ...exp, description: enhanced } : exp
        )
      }));
    } catch (error) {
      console.error('Error generating experience:', error);
      alert('Failed to generate experience description. Please try again.');
    } finally {
      setEnhancingExperience(null);
    }
  };

  const handleSuggestSkills = async () => {
    if (cvData.experiences.length === 0) return;

    setIsGenerating(true);
    try {
      const suggested = await suggestSkills(cvData.experiences, jobDescription);
      
      // Add suggested skills that aren't already in the list
      const existingSkillNames = cvData.skills.map(s => s.name.toLowerCase());
      const newSkills = suggested.filter(s => !existingSkillNames.includes(s.name.toLowerCase()));
      
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, ...newSkills]
      }));
    } catch (error) {
      console.error('Error suggesting skills:', error);
      alert('Failed to suggest skills. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: ""
      }]
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: "",
        institution: "",
        location: "",
        graduationYear: "",
        description: ""
      }]
    }));
  };

  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: "", level: "Intermediate" }]
    }));
  };

  const removeExperience = (index: number) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const removeEducation = (index: number) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeSkill = (index: number) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateSkill = (index: number, field: string, value: any) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case "Beginner": return "25%";
      case "Intermediate": return "50%";
      case "Advanced": return "75%";
      case "Expert": return "100%";
      default: return "50%";
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-red-400";
      case "Intermediate": return "bg-yellow-400";
      case "Advanced": return "bg-blue-400";
      case "Expert": return "bg-green-400";
      default: return "bg-gray-400";
    }
  };

  // Helper function to render bullet points properly
  const renderBulletPoints = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n').filter(line => line.trim());
    
    return (
      <ul className="space-y-1">
        {lines.map((line, index) => {
          // Remove bullet point if it exists and clean the line
          const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
          return (
            <li key={index} className="flex items-start text-sm text-slate-700 leading-relaxed">
              <span className="text-sky-500 mr-2 mt-1 flex-shrink-0">•</span>
              <span>{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
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
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24 space-y-6">
              <div>
                <h2 className="font-semibold text-slate-900 mb-4">CV Customization</h2>
                
                {/* CV Style */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">CV Style</label>
                  <select
                    value={cvType}
                    onChange={(e) => setCvType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="technical">Technical</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Job (Optional)</label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    placeholder="Paste job description to tailor your CV..."
                  />
                </div>

                {/* Section Status */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Section Status</h3>
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <div key={section.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                        <span className="text-sm text-slate-700">{section.title}</span>
                        <div className="flex items-center space-x-2">
                          {section.isComplete ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Actions */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-3">AI Tools</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleSuggestSkills}
                      disabled={isGenerating || cvData.experiences.length === 0}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      <span>Suggest Skills</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - CV Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              {/* CV Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="flex-1">
                    {editingSection === "personal" ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={cvData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/60 text-lg"
                          placeholder="Full Name"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="email"
                            value={cvData.personalInfo.email}
                            onChange={(e) => updatePersonalInfo("email", e.target.value)}
                            className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white placeholder-white/60"
                            placeholder="Email"
                          />
                          <input
                            type="tel"
                            value={cvData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                            className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white placeholder-white/60"
                            placeholder="Phone"
                          />
                        </div>
                        <input
                          type="text"
                          value={cvData.personalInfo.location}
                          onChange={(e) => updatePersonalInfo("location", e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white placeholder-white/60"
                          placeholder="Location"
                        />
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <div className="group cursor-pointer" onClick={() => setEditingSection("personal")}>
                        <h1 className="text-3xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                          {cvData.personalInfo.fullName || "Your Name"}
                          <Edit3 className="inline w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h1>
                        <div className="space-y-1 text-white/80 text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{cvData.personalInfo.email || "email@example.com"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{cvData.personalInfo.phone || "+27 XX XXX XXXX"}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{cvData.personalInfo.location || "City, Province"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CV Body */}
              <div className="p-8 space-y-8">
                {/* Professional Summary */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-sky-500" />
                      Professional Summary
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleEnhanceSummary}
                        disabled={isEnhancing || !cvData.personalInfo.professionalSummary}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                      >
                        {isEnhancing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span>Enhance</span>
                      </button>
                    </div>
                  </div>
                  {editingSection === "summary" ? (
                    <div className="space-y-3">
                      <textarea
                        rows={4}
                        value={cvData.personalInfo.professionalSummary}
                        onChange={(e) => updatePersonalInfo("professionalSummary", e.target.value)}
                        className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        placeholder="Write your professional summary..."
                      />
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="group cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      onClick={() => setEditingSection("summary")}
                    >
                      <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
                        {cvData.personalInfo.professionalSummary || "Click to add your professional summary..."}
                        <Edit3 className="inline w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  )}
                </div>

                {/* Work Experience */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-sky-500" />
                      Work Experience
                    </h2>
                    <button
                      onClick={addExperience}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {cvData.experiences.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No work experience added yet</p>
                        <button
                          onClick={addExperience}
                          className="mt-2 text-sky-500 hover:text-sky-600 text-sm"
                        >
                          Add your first experience
                        </button>
                      </div>
                    ) : (
                      cvData.experiences.map((exp, index) => (
                        <div key={index} className="border-l-4 border-sky-500 pl-4 relative group">
                          <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleGenerateExperience(index)}
                                disabled={enhancingExperience === index}
                                className="p-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                              >
                                {enhancingExperience === index ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => removeExperience(index)}
                                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          {editingSection === `experience-${index}` ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Job Title"
                                />
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Company"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <input
                                  type="text"
                                  value={exp.location}
                                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Location"
                                />
                                <input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                                {!exp.isCurrent && (
                                  <input
                                    type="month"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                                    className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  />
                                )}
                              </div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={exp.isCurrent}
                                  onChange={(e) => updateExperience(index, "isCurrent", e.target.checked)}
                                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="text-sm">Currently working here</span>
                              </label>
                              <textarea
                                rows={3}
                                value={exp.description}
                                onChange={(e) => updateExperience(index, "description", e.target.value)}
                                className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                placeholder="Describe your responsibilities and achievements..."
                              />
                              <button
                                onClick={() => setEditingSection(null)}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                              >
                                Done
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="cursor-pointer p-2 rounded hover:bg-slate-50 transition-colors"
                              onClick={() => setEditingSection(`experience-${index}`)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-slate-900 text-base">
                                    {exp.title || "Job Title"}
                                  </h3>
                                  <div className="flex items-center space-x-2 text-slate-600 text-sm">
                                    <Building2 className="w-4 h-4" />
                                    <span>{exp.company || "Company Name"}</span>
                                    {exp.location && (
                                      <>
                                        <span>•</span>
                                        <span>{exp.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-slate-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                {exp.description ? (
                                  renderBulletPoints(exp.description)
                                ) : (
                                  <p className="text-sm text-slate-500 italic">Click to add job description...</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-sky-500" />
                      Education
                    </h2>
                    <button
                      onClick={addEducation}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {cvData.education.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No education added yet</p>
                        <button
                          onClick={addEducation}
                          className="mt-2 text-sky-500 hover:text-sky-600 text-sm"
                        >
                          Add your education
                        </button>
                      </div>
                    ) : (
                      cvData.education.map((edu, index) => (
                        <div key={index} className="border-l-4 border-purple-500 pl-4 relative group">
                          <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeEducation(index)}
                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          {editingSection === `education-${index}` ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Degree"
                                />
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Institution"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={edu.location}
                                  onChange={(e) => updateEducation(index, "location", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Location"
                                />
                                <input
                                  type="text"
                                  value={edu.graduationYear}
                                  onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Graduation Year"
                                />
                              </div>
                              <button
                                onClick={() => setEditingSection(null)}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                              >
                                Done
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="cursor-pointer p-2 rounded hover:bg-slate-50 transition-colors"
                              onClick={() => setEditingSection(`education-${index}`)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-slate-900 text-base">
                                    {edu.degree || "Degree"}
                                  </h3>
                                  <div className="flex items-center space-x-2 text-slate-600 text-sm">
                                    <Building2 className="w-4 h-4" />
                                    <span>{edu.institution || "Institution"}</span>
                                    {edu.location && (
                                      <>
                                        <span>•</span>
                                        <span>{edu.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm text-slate-500">{edu.graduationYear}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-sky-500" />
                      Skills
                    </h2>
                    <button
                      onClick={addSkill}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {cvData.skills.length === 0 ? (
                      <div className="col-span-2 text-center py-8 text-slate-500">
                        <Award className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No skills added yet</p>
                        <button
                          onClick={addSkill}
                          className="mt-2 text-sky-500 hover:text-sky-600 text-sm"
                        >
                          Add your skills
                        </button>
                      </div>
                    ) : (
                      cvData.skills.map((skill, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                              onClick={() => removeSkill(index)}
                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          {editingSection === `skill-${index}` ? (
                            <div className="space-y-2 p-3 border border-slate-200 rounded-lg">
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => updateSkill(index, "name", e.target.value)}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Skill name"
                              />
                              <select
                                value={skill.level}
                                onChange={(e) => updateSkill(index, "level", e.target.value)}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                              <button
                                onClick={() => setEditingSection(null)}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                              >
                                Done
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => setEditingSection(`skill-${index}`)}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-slate-900 text-sm">
                                  {skill.name || "Skill name"}
                                </span>
                                <span className="text-xs text-slate-500">{skill.level}</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${getSkillLevelColor(skill.level)}`}
                                  style={{ width: getSkillLevelWidth(skill.level) }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
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