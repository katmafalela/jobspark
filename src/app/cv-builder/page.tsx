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
  Wand2,
  Lightbulb
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
import { 
  generateCV, 
  enhanceProfessionalSummary, 
  generateExperienceDescription,
  suggestSkills,
  type CVData 
} from "@/lib/api";

interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Skill {
  id?: string;
  name: string;
  level: string;
  category: string;
}

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  professionalSummary?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

const CVBuilderPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cvs, setCvs] = useState([]);

  // AI enhancement states
  const [enhancingSummary, setEnhancingSummary] = useState(false);
  const [generatingExperience, setGeneratingExperience] = useState<string | null>(null);
  const [suggestingSkills, setSuggestingSkills] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [profileData, experienceData, educationData, skillsData, cvsData] = await Promise.all([
        getUserProfile(user.id),
        getUserExperiences(user.id),
        getUserEducation(user.id),
        getUserSkills(user.id),
        getUserCVs(user.id)
      ]);

      setProfile(profileData);
      setExperiences(experienceData || []);
      setEducation(educationData || []);
      setSkills(skillsData || []);
      setCvs(cvsData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (field: string, value: string) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addExperience = () => {
    const newExperience: Experience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false
    };
    setExperiences([...experiences, newExperience]);
  };

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    const updated = experiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    const newEducation: Education = {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: ""
    };
    setEducation([...education, newEducation]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      name: "",
      level: "Intermediate",
      category: "Technical"
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const updated = skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    setSkills(updated);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleEnhanceSummary = async () => {
    if (!profile?.professionalSummary) return;
    
    setEnhancingSummary(true);
    try {
      const enhanced = await enhanceProfessionalSummary(profile.professionalSummary);
      handleProfileUpdate('professionalSummary', enhanced);
    } catch (error) {
      console.error('Error enhancing summary:', error);
    } finally {
      setEnhancingSummary(false);
    }
  };

  const handleGenerateExperienceDescription = async (index: number) => {
    const experience = experiences[index];
    if (!experience.company || !experience.position) return;

    setGeneratingExperience(index.toString());
    try {
      const description = await generateExperienceDescription(
        experience.position,
        experience.company
      );
      updateExperience(index, 'description', description);
    } catch (error) {
      console.error('Error generating experience description:', error);
    } finally {
      setGeneratingExperience(null);
    }
  };

  const handleSuggestSkills = async () => {
    if (!profile || experiences.length === 0) return;

    setSuggestingSkills(true);
    try {
      const jobTitles = experiences.map(exp => exp.position).filter(Boolean);
      const suggestedSkills = await suggestSkills(jobTitles);
      
      // Add suggested skills that aren't already in the list
      const existingSkillNames = skills.map(s => s.name.toLowerCase());
      const newSkills = suggestedSkills
        .filter(skill => !existingSkillNames.includes(skill.toLowerCase()))
        .map(skill => ({
          name: skill,
          level: "Intermediate",
          category: "Technical"
        }));
      
      setSkills([...skills, ...newSkills]);
    } catch (error) {
      console.error('Error suggesting skills:', error);
    } finally {
      setSuggestingSkills(false);
    }
  };

  const handleGenerateCV = async () => {
    if (!profile || !user) return;

    setIsGenerating(true);
    try {
      const cvData: CVData = {
        personalInfo: {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone || '',
          location: profile.location || '',
          linkedinUrl: profile.linkedinUrl || '',
          portfolioUrl: profile.portfolioUrl || ''
        },
        professionalSummary: profile.professionalSummary || '',
        experiences: experiences.map(exp => ({
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.current ? 'Present' : exp.endDate,
          description: exp.description
        })),
        education: education.map(edu => ({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          startDate: edu.startDate,
          endDate: edu.endDate,
          gpa: edu.gpa
        })),
        skills: skills.map(skill => ({
          name: skill.name,
          level: skill.level,
          category: skill.category
        }))
      };

      const generatedCV = await generateCV(cvData);
      await createGeneratedCV(user.id, generatedCV);
      
      // Reload CVs
      const updatedCVs = await getUserCVs(user.id);
      setCvs(updatedCVs || []);
      
    } catch (error) {
      console.error('Error generating CV:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Award }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              CV Builder
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
            
            <button
              onClick={handleGenerateCV}
              disabled={isGenerating || !profile}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate CV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <AnimatePresence mode="wait">
                {activeTab === "personal" && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile?.fullName || ''}
                          onChange={(e) => handleProfileUpdate('fullName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile?.email || ''}
                          onChange={(e) => handleProfileUpdate('email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profile?.phone || ''}
                          onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profile?.location || ''}
                          onChange={(e) => handleProfileUpdate('location', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your location"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={profile?.linkedinUrl || ''}
                          onChange={(e) => handleProfileUpdate('linkedinUrl', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={profile?.portfolioUrl || ''}
                          onChange={(e) => handleProfileUpdate('portfolioUrl', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Professional Summary
                        </label>
                        <button
                          onClick={handleEnhanceSummary}
                          disabled={enhancingSummary || !profile?.professionalSummary}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                        >
                          {enhancingSummary ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Wand2 className="w-3 h-3" />
                          )}
                          Enhance with AI
                        </button>
                      </div>
                      <textarea
                        value={profile?.professionalSummary || ''}
                        onChange={(e) => handleProfileUpdate('professionalSummary', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Write a brief professional summary about yourself..."
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "experience" && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                      <button
                        onClick={addExperience}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Experience
                      </button>
                    </div>

                    <div className="space-y-6">
                      {experiences.map((experience, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Experience #{index + 1}
                            </h3>
                            <button
                              onClick={() => removeExperience(index)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                              </label>
                              <input
                                type="text"
                                value={experience.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Company name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                              </label>
                              <input
                                type="text"
                                value={experience.position}
                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Job title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <input
                                type="month"
                                value={experience.startDate}
                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <div className="space-y-2">
                                <input
                                  type="month"
                                  value={experience.endDate}
                                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                  disabled={experience.current}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                />
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={experience.current}
                                    onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-600">Currently working here</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <button
                                onClick={() => handleGenerateExperienceDescription(index)}
                                disabled={generatingExperience === index.toString() || !experience.company || !experience.position}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                              >
                                {generatingExperience === index.toString() ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Lightbulb className="w-3 h-3" />
                                )}
                                Generate with AI
                              </button>
                            </div>
                            <textarea
                              value={experience.description}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Describe your responsibilities and achievements..."
                            />
                          </div>
                        </div>
                      ))}

                      {experiences.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No work experience added yet.</p>
                          <p className="text-sm">Click "Add Experience" to get started.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "education" && (
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                      <button
                        onClick={addEducation}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Education
                      </button>
                    </div>

                    <div className="space-y-6">
                      {education.map((edu, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Education #{index + 1}
                            </h3>
                            <button
                              onClick={() => removeEducation(index)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institution
                              </label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="University/School name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Degree
                              </label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Bachelor's, Master's, etc."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Field of Study
                              </label>
                              <input
                                type="text"
                                value={edu.field}
                                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Computer Science, Business, etc."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                GPA (Optional)
                              </label>
                              <input
                                type="text"
                                value={edu.gpa || ''}
                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="3.8/4.0"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {education.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No education added yet.</p>
                          <p className="text-sm">Click "Add Education" to get started.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "skills" && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSuggestSkills}
                          disabled={suggestingSkills || experiences.length === 0}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {suggestingSkills ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Lightbulb className="w-4 h-4" />
                          )}
                          Suggest Skills
                        </button>
                        <button
                          onClick={addSkill}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Skill
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-700">Skill #{index + 1}</h3>
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Skill Name
                              </label>
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="e.g., JavaScript, Project Management"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Level
                              </label>
                              <select
                                value={skill.level}
                                onChange={(e) => updateSkill(index, 'level', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Category
                              </label>
                              <select
                                value={skill.category}
                                onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="Technical">Technical</option>
                                <option value="Soft Skills">Soft Skills</option>
                                <option value="Languages">Languages</option>
                                <option value="Tools">Tools</option>
                                <option value="Frameworks">Frameworks</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {skills.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No skills added yet.</p>
                        <p className="text-sm">Click "Add Skill" or "Suggest Skills" to get started.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilderPage;