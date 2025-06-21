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

const CVBuilderPage = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingExperience, setIsGeneratingExperience] = useState<number | null>(null);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
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

  const handleGenerateExperienceDescription = async (index: number) => {
    const experience = cvData.experiences[index];
    if (!experience.title || !experience.company) {
      alert('Please fill in the job title and company first.');
      return;
    }

    setIsGeneratingExperience(index);
    try {
      const enhanced = await generateExperienceDescription(
        experience.title,
        experience.company,
        experience.description || `Worked as ${experience.title} at ${experience.company}`
      );

      updateExperience(index, 'description', enhanced);
    } catch (error) {
      console.error('Error generating experience description:', error);
      alert('Failed to generate experience description. Please try again.');
    } finally {
      setIsGeneratingExperience(null);
    }
  };

  const handleSuggestSkills = async () => {
    if (cvData.experiences.length === 0) {
      alert('Please add some work experience first to get skill suggestions.');
      return;
    }

    setIsSuggestingSkills(true);
    try {
      const suggested = await suggestSkills(cvData.experiences, jobDescription);
      
      // Add suggested skills to existing skills (avoid duplicates)
      setCvData(prev => {
        const existingSkillNames = prev.skills.map(s => s.name.toLowerCase());
        const newSkills = suggested.filter(s => 
          !existingSkillNames.includes(s.name.toLowerCase())
        );
        
        return {
          ...prev,
          skills: [...prev.skills, ...newSkills]
        };
      });
    } catch (error) {
      console.error('Error suggesting skills:', error);
      alert('Failed to suggest skills. Please try again.');
    } finally {
      setIsSuggestingSkills(false);
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

  const removeExperience = (index: number) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
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

  const removeEducation = (index: number) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
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

  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, {
        name: "",
        level: "Beginner"
      }]
    }));
  };

  const removeSkill = (index: number) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
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

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-600">Add your work experience and professional background.</p>
        <button
          onClick={addExperience}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {cvData.experiences.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cvData.experiences.map((experience, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-slate-900">Experience {index + 1}</h3>
                <button
                  onClick={() => removeExperience(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={experience.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Software Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Tech Company Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={experience.location}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Cape Town, South Africa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={`current-${index}`}
                    checked={experience.isCurrent}
                    onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  <label htmlFor={`current-${index}`} className="text-sm font-medium text-slate-700">
                    I currently work here
                  </label>
                </div>
                {!experience.isCurrent && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <button
                    onClick={() => handleGenerateExperienceDescription(index)}
                    disabled={isGeneratingExperience === index || !experience.title || !experience.company}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingExperience === index ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    <span>Generate with AI</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={experience.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-600">Add your educational background and qualifications.</p>
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
          {cvData.education.map((education, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-slate-900">Education {index + 1}</h3>
                <button
                  onClick={() => removeEducation(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Degree/Qualification</label>
                  <input
                    type="text"
                    value={education.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Institution</label>
                  <input
                    type="text"
                    value={education.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. University of Cape Town"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={education.location}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Cape Town, South Africa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Graduation Year</label>
                  <input
                    type="number"
                    value={education.graduationYear}
                    onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. 2023"
                    min="1950"
                    max="2030"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={education.description}
                  onChange={(e) => updateEducation(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Relevant coursework, achievements, or additional details..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-600">Add your technical and professional skills.</p>
        <div className="flex space-x-2">
          <button
            onClick={handleSuggestSkills}
            disabled={isSuggestingSkills || cvData.experiences.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {isSuggestingSkills ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lightbulb className="w-4 h-4" />
            )}
            <span>Suggest Skills</span>
          </button>
          <button
            onClick={addSkill}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {cvData.skills.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>No skills added yet.</p>
          <p className="text-sm">Click "Add Skill" or "Suggest Skills" to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cvData.skills.map((skill, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-slate-900">Skill {index + 1}</h3>
                <button
                  onClick={() => removeSkill(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. JavaScript, Project Management"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Proficiency Level</label>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(index, 'level', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
                  {activeSection === "experience" && renderExperience()}
                  {activeSection === "education" && renderEducation()}
                  {activeSection === "skills" && renderSkills()}
                  {activeSection === "generate" && renderGenerate()}
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