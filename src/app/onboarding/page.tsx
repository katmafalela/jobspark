"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Plus,
  Trash2,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  createUserProfile,
  updateUserProfile,
  createUserExperience,
  createUserEducation,
  createUserSkill,
  getUserProfile
} from "@/lib/database";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  professionalSummary: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  description: string;
}

interface Skill {
  name: string;
  level: string;
}

interface FormData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

const OnboardingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      professionalSummary: ""
    },
    experiences: [
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: ""
      }
    ],
    education: [
      {
        degree: "",
        institution: "",
        location: "",
        graduationYear: "",
        description: ""
      }
    ],
    skills: [
      { name: "", level: "Intermediate" }
    ]
  });

  const steps = [
    { id: "personal", title: "Personal Information", icon: User },
    { id: "experience", title: "Work Experience", icon: Briefcase },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "skills", title: "Skills", icon: Award }
  ];

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: user.email,
          fullName: user.user_metadata?.full_name || ""
        }
      }));
    }
  }, [user]);

  const handleInputChange = (section: keyof FormData, field: string, value: any, index?: number) => {
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

  const addItem = (section: keyof FormData) => {
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

  const removeItem = (section: keyof FormData, index: number) => {
    setFormData(prev => {
      const sectionData = prev[section] as any[];
      return {
        ...prev,
        [section]: sectionData.filter((_: any, i: number) => i !== index)
      };
    });
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0: // Personal Info
        return formData.personalInfo.fullName && formData.personalInfo.email && formData.personalInfo.phone;
      case 1: // Experience
        return formData.experiences.some(exp => exp.title && exp.company);
      case 2: // Education
        return formData.education.some(edu => edu.degree && edu.institution);
      case 3: // Skills
        return formData.skills.some(skill => skill.name);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if profile exists
      let profile = await getUserProfile(user.id);
      
      if (profile) {
        // Update existing profile
        await updateUserProfile(user.id, {
          full_name: formData.personalInfo.fullName,
          email: formData.personalInfo.email,
          phone: formData.personalInfo.phone,
          location: formData.personalInfo.location,
          professional_summary: formData.personalInfo.professionalSummary,
          onboarding_completed: true
        });
      } else {
        // Create new profile
        await createUserProfile({
          user_id: user.id,
          full_name: formData.personalInfo.fullName,
          email: formData.personalInfo.email,
          phone: formData.personalInfo.phone,
          location: formData.personalInfo.location,
          professional_summary: formData.personalInfo.professionalSummary,
          onboarding_completed: true
        });
      }

      // Save experiences
      for (const exp of formData.experiences) {
        if (exp.title && exp.company) {
          await createUserExperience({
            user_id: user.id,
            title: exp.title,
            company: exp.company,
            location: exp.location,
            start_date: exp.startDate,
            end_date: exp.isCurrent ? null : exp.endDate,
            is_current: exp.isCurrent,
            description: exp.description
          });
        }
      }

      // Save education
      for (const edu of formData.education) {
        if (edu.degree && edu.institution) {
          await createUserEducation({
            user_id: user.id,
            degree: edu.degree,
            institution: edu.institution,
            location: edu.location,
            graduation_year: edu.graduationYear,
            description: edu.description
          });
        }
      }

      // Save skills
      for (const skill of formData.skills) {
        if (skill.name) {
          await createUserSkill({
            user_id: user.id,
            name: skill.name,
            level: skill.level
          });
        }
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('There was an error completing your onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="+27 XX XXX XXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <input
            type="text"
            value={formData.personalInfo.location}
            onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="City, Province"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
        <textarea
          rows={4}
          value={formData.personalInfo.professionalSummary}
          onChange={(e) => handleInputChange("personalInfo", "professionalSummary", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Brief summary of your professional background and career objectives..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {formData.experiences.map((exp, index) => (
        <div key={index} className="border border-slate-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-slate-900">Experience #{index + 1}</h3>
            {formData.experiences.length > 1 && (
              <button
                onClick={() => removeItem("experiences", index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => handleInputChange("experiences", "title", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={exp.company}
              onChange={(e) => handleInputChange("experiences", "company", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={(e) => handleInputChange("experiences", "location", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="month"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) => handleInputChange("experiences", "startDate", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {!exp.isCurrent && (
              <input
                type="month"
                placeholder="End Date"
                value={exp.endDate}
                onChange={(e) => handleInputChange("experiences", "endDate", e.target.value, index)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => handleInputChange("experiences", "isCurrent", e.target.checked, index)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-700">I currently work here</span>
            </label>
          </div>
          <textarea
            rows={3}
            placeholder="Describe your responsibilities and achievements..."
            value={exp.description}
            onChange={(e) => handleInputChange("experiences", "description", e.target.value, index)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      ))}
      <button
        onClick={() => addItem("experiences")}
        className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Experience</span>
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {formData.education.map((edu, index) => (
        <div key={index} className="border border-slate-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-slate-900">Education #{index + 1}</h3>
            {formData.education.length > 1 && (
              <button
                onClick={() => removeItem("education", index)}
                className="text-red-500 hover:text-red-700"
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
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleInputChange("education", "institution", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Location"
              value={edu.location}
              onChange={(e) => handleInputChange("education", "location", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="text"
              placeholder="Graduation Year"
              value={edu.graduationYear}
              onChange={(e) => handleInputChange("education", "graduationYear", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Additional details (optional)..."
            value={edu.description}
            onChange={(e) => handleInputChange("education", "description", e.target.value, index)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      ))}
      <button
        onClick={() => addItem("education")}
        className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Education</span>
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {formData.skills.map((skill, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-slate-900">Skill #{index + 1}</h3>
              {formData.skills.length > 1 && (
                <button
                  onClick={() => removeItem("skills", index)}
                  className="text-red-500 hover:text-red-700"
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
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 mb-3"
            />
            <select
              value={skill.level}
              onChange={(e) => handleInputChange("skills", "level", e.target.value, index)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => addItem("skills")}
        className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Skill</span>
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderExperience();
      case 2: return renderEducation();
      case 3: return renderSkills();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-sky-500" />
            <h1 className="text-3xl font-bold text-slate-900">Welcome to JobSpark!</h1>
          </div>
          <p className="text-lg text-slate-600">Let's set up your profile to get you started</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-4 ${
                    index < currentStep ? 'bg-sky-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <steps[currentStep].icon className="w-6 h-6 text-sky-500" />
                <h2 className="text-2xl font-bold text-slate-900">{steps[currentStep].title}</h2>
              </div>
              
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="text-sm text-slate-500">
              {currentStep + 1} / {steps.length}
            </div>
            
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep) || isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{currentStep === steps.length - 1 ? "Complete" : "Next"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;