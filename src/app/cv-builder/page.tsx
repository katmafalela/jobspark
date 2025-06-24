"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Save, 
  Sparkles, 
  Plus,
  Trash2,
  Edit3,
  Eye,
  Copy,
  RefreshCw,
  Wand2,
  Target,
  Building2,
  Calendar,
  MapPin,
  User,
  GraduationCap,
  Award,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { 
  getUserProfile, 
  getUserExperiences, 
  getUserEducation, 
  getUserSkills,
  createGeneratedCV,
  getUserCVs,
  updateGeneratedCV,
  deleteGeneratedCV,
  type UserProfile,
  type UserExperience,
  type UserEducation,
  type UserSkill,
  type GeneratedCV
} from "@/lib/database";
import { generateCV, enhanceProfessionalSummary, generateExperienceDescription, suggestSkills, type CVData } from "@/lib/api";
import { exportToPDF } from "@/lib/pdf-export";

interface CVFormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    professionalSummary: string;
    profileImageUrl: string;
  };
  experiences: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationYear: string;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
}

const CVBuilderPage = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<string>("");
  const [savedCVs, setSavedCVs] = useState<GeneratedCV[]>([]);
  const [selectedCVId, setSelectedCVId] = useState<string | null>(null);
  const [cvName, setCvName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvType, setCvType] = useState<"professional" | "creative" | "technical" | "executive">("professional");
  
  const [formData, setFormData] = useState<CVFormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      professionalSummary: "",
      profileImageUrl: ""
    },
    experiences: [],
    education: [],
    skills: []
  });

  const steps = [
    { id: "personal", title: "Personal Info", icon: User, description: "Basic information and summary" },
    { id: "experience", title: "Experience", icon: Briefcase, description: "Work history and achievements" },
    { id: "education", title: "Education", icon: GraduationCap, description: "Academic background" },
    { id: "skills", title: "Skills", icon: Award, description: "Technical and soft skills" },
    { id: "generate", title: "Generate", icon: Sparkles, description: "Create your CV" }
  ];

  useEffect(() => {
    if (user) {
      loadUserData();
      loadSavedCVs();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [profile, experiences, education, skills] = await Promise.all([
        getUserProfile(user.id),
        getUserExperiences(user.id),
        getUserEducation(user.id),
        getUserSkills(user.id)
      ]);

      if (profile) {
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            fullName: profile.full_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            professionalSummary: profile.professional_summary || "",
            profileImageUrl: profile.profile_image_url || ""
          }
        }));
      }

      setFormData(prev => ({
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
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedCVs = async () => {
    if (!user) return;
    
    try {
      const cvs = await getUserCVs(user.id);
      setSavedCVs(cvs);
    } catch (error) {
      console.error('Error loading saved CVs:', error);
    }
  };

  const handleInputChange = (section: keyof CVFormData, field: string, value: any, index?: number) => {
    setFormData(prev => {
      if (section === "personalInfo") {
        return {
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            [field]: value
          }
        };
      } else if (index !== undefined) {
        const sectionData = prev[section] as any[];
        return {
          ...prev,
          [section]: sectionData.map((item: any, i: number) => 
            i === index ? { ...item, [field]: value } : item
          )
        };
      }
      return prev;
    });
  };

  const addItem = (section: keyof CVFormData) => {
    setFormData(prev => {
      let newItem: any;
      
      if (section === "experiences") {
        newItem = { title: "", company: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "" };
      } else if (section === "education") {
        newItem = { degree: "", institution: "", location: "", graduationYear: "", description: "" };
      } else if (section === "skills") {
        newItem = { name: "", level: "Intermediate" };
      }
      
      if (newItem) {
        const sectionData = prev[section] as any[];
        return {
          ...prev,
          [section]: [...sectionData, newItem]
        };
      }
      
      return prev;
    });
  };

  const removeItem = (section: keyof CVFormData, index: number) => {
    setFormData(prev => {
      const sectionData = prev[section] as any[];
      return {
        ...prev,
        [section]: sectionData.filter((_: any, i: number) => i !== index)
      };
    });
  };

  const enhanceSummary = async () => {
    if (!formData.personalInfo.professionalSummary) return;
    
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceProfessionalSummary(
        formData.personalInfo.professionalSummary,
        formData.experiences,
        jobDescription
      );
      
      setFormData(prev => ({
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

  const enhanceExperience = async (index: number) => {
    const exp = formData.experiences[index];
    if (!exp.title || !exp.company || !exp.description) return;
    
    try {
      const enhanced = await generateExperienceDescription(
        exp.title,
        exp.company,
        exp.description
      );
      
      handleInputChange("experiences", "description", enhanced, index);
    } catch (error) {
      console.error('Error enhancing experience:', error);
      alert('Failed to enhance experience. Please try again.');
    }
  };

  const suggestNewSkills = async () => {
    try {
      const suggestions = await suggestSkills(formData.experiences, jobDescription);
      
      // Add only new skills that aren't already in the list
      const existingSkillNames = formData.skills.map(s => s.name.toLowerCase());
      const newSkills = suggestions.filter(s => 
        !existingSkillNames.includes(s.name.toLowerCase())
      );
      
      if (newSkills.length > 0) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, ...newSkills]
        }));
      }
    } catch (error) {
      console.error('Error suggesting skills:', error);
      alert('Failed to suggest skills. Please try again.');
    }
  };

  const generateCVContent = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const cvData: CVData = {
        personalInfo: formData.personalInfo,
        experiences: formData.experiences,
        education: formData.education,
        skills: formData.skills
      };

      const generated = await generateCV({
        cvData,
        jobDescription: jobDescription || undefined,
        cvType
      });
      
      setGeneratedCV(generated);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Failed to generate CV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCV = async () => {
    if (!user || !generatedCV) return;
    
    setIsSaving(true);
    try {
      const cvData = {
        user_id: user.id,
        title: cvName || `CV - ${new Date().toLocaleDateString()}`,
        content: generatedCV,
        job_description: jobDescription || null,
        cv_name: cvName || null
      };

      if (selectedCVId) {
        await updateGeneratedCV(selectedCVId, cvData);
      } else {
        await createGeneratedCV(cvData);
      }
      
      await loadSavedCVs();
      alert('CV saved successfully!');
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Failed to save CV. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedCV = (cv: GeneratedCV) => {
    setGeneratedCV(cv.content);
    setCvName(cv.cv_name || cv.title);
    setJobDescription(cv.job_description || "");
    setSelectedCVId(cv.id);
    setShowPreview(true);
  };

  const deleteSavedCV = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    
    try {
      await deleteGeneratedCV(cvId);
      await loadSavedCVs();
      if (selectedCVId === cvId) {
        setSelectedCVId(null);
        setGeneratedCV("");
        setShowPreview(false);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Failed to delete CV. Please try again.');
    }
  };

  const exportCV = () => {
    if (!generatedCV) return;
    
    const cvData: CVData = {
      personalInfo: formData.personalInfo,
      experiences: formData.experiences,
      education: formData.education,
      skills: formData.skills
    };
    
    exportToPDF(cvData, cvName || 'CV');
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Full Name *</label>
          <input
            type="text"
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Email *</label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="your.email@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Phone *</label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+27 XX XXX XXXX"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={formData.personalInfo.location}
              onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="City, Province"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-700">Professional Summary</label>
          <button
            onClick={enhanceSummary}
            disabled={isEnhancing || !formData.personalInfo.professionalSummary}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isEnhancing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>Enhance with AI</span>
          </button>
        </div>
        <textarea
          rows={4}
          value={formData.personalInfo.professionalSummary}
          onChange={(e) => handleInputChange("personalInfo", "professionalSummary", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Brief summary of your professional background and career objectives..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {formData.experiences.map((exp, index) => (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-slate-200 rounded-xl p-6 bg-slate-50/50"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Experience #{index + 1}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => enhanceExperience(index)}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="Enhance with AI"
              >
                <Wand2 className="w-4 h-4" />
              </button>
              {formData.experiences.length > 1 && (
                <button
                  onClick={() => removeItem("experiences", index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => handleInputChange("experiences", "title", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleInputChange("experiences", "company", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location"
                value={exp.location}
                onChange={(e) => handleInputChange("experiences", "location", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="month"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => handleInputChange("experiences", "startDate", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {!exp.isCurrent && (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="month"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => handleInputChange("experiences", "endDate", e.target.value, index)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => handleInputChange("experiences", "isCurrent", e.target.checked, index)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">I currently work here</span>
            </label>
          </div>
          
          <textarea
            rows={3}
            placeholder="Describe your responsibilities and achievements..."
            value={exp.description}
            onChange={(e) => handleInputChange("experiences", "description", e.target.value, index)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </motion.div>
      ))}
      
      <button
        onClick={() => addItem("experiences")}
        className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600 hover:text-blue-600 w-full justify-center"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Another Experience</span>
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {formData.education.map((edu, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-slate-200 rounded-xl p-6 bg-slate-50/50"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Education #{index + 1}</h3>
            </div>
            {formData.education.length > 1 && (
              <button
                onClick={() => removeItem("education", index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Degree/Qualification"
              value={edu.degree}
              onChange={(e) => handleInputChange("education", "degree", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => handleInputChange("education", "institution", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location"
                value={edu.location}
                onChange={(e) => handleInputChange("education", "location", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="Graduation Year"
              value={edu.graduationYear}
              onChange={(e) => handleInputChange("education", "graduationYear", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <textarea
            rows={2}
            placeholder="Additional details (optional)..."
            value={edu.description}
            onChange={(e) => handleInputChange("education", "description", e.target.value, index)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </motion.div>
      ))}
      
      <button
        onClick={() => addItem("education")}
        className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600 hover:text-blue-600 w-full justify-center"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Another Education</span>
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Your Skills</h3>
        <button
          onClick={suggestNewSkills}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Suggest Skills</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {formData.skills.map((skill, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Skill #{index + 1}</h3>
              </div>
              {formData.skills.length > 1 && (
                <button
                  onClick={() => removeItem("skills", index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <input
              type="text"
              placeholder="Skill name"
              value={skill.name}
              onChange={(e) => handleInputChange("skills", "name", e.target.value, index)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-3"
            />
            
            <select
              value={skill.level}
              onChange={(e) => handleInputChange("skills", "level", e.target.value, index)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </motion.div>
        ))}
      </div>
      
      <button
        onClick={() => addItem("skills")}
        className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600 hover:text-blue-600 w-full justify-center"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Another Skill</span>
      </button>
    </div>
  );

  const renderGenerate = () => (
    <div className="space-y-8">
      {/* CV Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">CV Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">CV Name</label>
            <input
              type="text"
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Software Engineer CV"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">CV Type</label>
            <select
              value={cvType}
              onChange={(e) => setCvType(e.target.value as any)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Target Job Description (Optional)</label>
          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Paste the job description here to tailor your CV..."
          />
          <p className="text-sm text-slate-500">Adding a job description helps our AI tailor your CV to match the role requirements.</p>
        </div>
      </div>

      {/* Saved CVs */}
      {savedCVs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Saved CVs</h3>
          <div className="space-y-3">
            {savedCVs.map((cv) => (
              <div key={cv.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-slate-900">{cv.cv_name || cv.title}</h4>
                  <p className="text-sm text-slate-500">Created {new Date(cv.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadSavedCV(cv)}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Load CV"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSavedCV(cv.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete CV"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateCVContent}
          disabled={isGenerating}
          className="flex items-center space-x-3 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto text-lg font-semibold"
        >
          {isGenerating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6" />
          )}
          <span>{isGenerating ? "Generating CV..." : "Generate CV with AI"}</span>
        </button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderExperience();
      case 2: return renderEducation();
      case 3: return renderSkills();
      case 4: return renderGenerate();
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">Loading your data...</span>
        </div>
      </div>
    );
  }

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
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">CV Builder</h1>
                  <p className="text-sm text-slate-600">Create your professional CV</p>
                </div>
              </div>
            </div>
            
            {showPreview && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={exportCV}
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={saveCV}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? "Saving..." : "Save CV"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">Build Your CV</h2>
              <nav className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      currentStep === index
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      currentStep === index ? "bg-blue-200" : "bg-slate-100"
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className={`${showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="flex items-center space-x-3 mb-8">
                {React.createElement(steps[currentStep].icon, { 
                  className: "w-7 h-7 text-blue-500" 
                })}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{steps[currentStep].title}</h2>
                  <p className="text-slate-600">{steps[currentStep].description}</p>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation */}
              {currentStep < 4 && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    <span>Next</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">CV Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed bg-slate-50 p-4 rounded-lg border">
                    {generatedCV}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVBuilderPage;