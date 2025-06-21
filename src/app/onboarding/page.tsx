"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
  Sparkles,
  Calendar,
  MapPin,
  Building2,
  Star,
  Camera,
  Upload,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
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
  profileImage: File | null;
  profileImageUrl: string;
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      professionalSummary: "",
      profileImage: null,
      profileImageUrl: ""
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
    { id: "personal", title: "Personal Information", icon: User, description: "Tell us about yourself" },
    { id: "experience", title: "Work Experience", icon: Briefcase, description: "Your professional journey" },
    { id: "education", title: "Education", icon: GraduationCap, description: "Your academic background" },
    { id: "skills", title: "Skills", icon: Award, description: "Your expertise and abilities" }
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

  const handleImageUpload = async (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploadingImage(true);
    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profileImage: file,
          profileImageUrl: previewUrl
        }
      }));
    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProfileImage = () => {
    if (formData.personalInfo.profileImageUrl) {
      URL.revokeObjectURL(formData.personalInfo.profileImageUrl);
    }
    
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        profileImage: null,
        profileImageUrl: ""
      }
    }));
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

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    // In a real implementation, you would upload to Supabase Storage
    // For now, we'll return the preview URL
    // This should be replaced with actual Supabase Storage upload
    return formData.personalInfo.profileImageUrl;
  };

  const handleComplete = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }
    
    setIsLoading(true);
    try {
      // Upload profile image if exists
      let profileImageUrl = null;
      if (formData.personalInfo.profileImage) {
        profileImageUrl = await uploadImageToSupabase(formData.personalInfo.profileImage);
      }

      // Check if profile exists
      let profile = null;
      try {
        profile = await getUserProfile(user.id);
      } catch (error) {
        console.log('Profile does not exist, will create new one');
      }
      
      const profileData = {
        full_name: formData.personalInfo.fullName,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone || null,
        location: formData.personalInfo.location || null,
        professional_summary: formData.personalInfo.professionalSummary || null,
        profile_image_url: profileImageUrl,
        onboarding_completed: true
      };

      if (profile) {
        // Update existing profile
        await updateUserProfile(user.id, profileData);
      } else {
        // Create new profile
        await createUserProfile({
          user_id: user.id,
          ...profileData
        });
      }

      // Save experiences
      for (const exp of formData.experiences) {
        if (exp.title && exp.company) {
          await createUserExperience({
            user_id: user.id,
            title: exp.title,
            company: exp.company,
            location: exp.location || null,
            start_date: exp.startDate,
            end_date: exp.isCurrent ? null : (exp.endDate || null),
            is_current: exp.isCurrent,
            description: exp.description || null
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
            location: edu.location || null,
            graduation_year: edu.graduationYear,
            description: edu.description || null
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

      // Clean up any object URLs
      if (formData.personalInfo.profileImageUrl) {
        URL.revokeObjectURL(formData.personalInfo.profileImageUrl);
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
    <div className="space-y-8">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {formData.personalInfo.profileImageUrl ? (
            <div className="relative">
              <Image
                src={formData.personalInfo.profileImageUrl}
                alt="Profile preview"
                width={120}
                height={120}
                className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button
                onClick={removeProfileImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-gray-800">Profile Photo</h3>
          <p className="text-sm text-gray-600">Add a professional headshot (max 5MB)</p>
          {uploadingImage && (
            <p className="text-sm text-blue-600">Processing image...</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Full Name *</label>
          <input
            type="text"
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Email *</label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            placeholder="your.email@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Phone *</label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="City, Province"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Professional Summary</label>
        <textarea
          rows={4}
          value={formData.personalInfo.professionalSummary}
          onChange={(e) => handleInputChange("personalInfo", "professionalSummary", e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
          placeholder="Brief summary of your professional background and career objectives..."
        />
        <p className="text-sm text-slate-500">This will help employers understand your career goals and experience.</p>
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
              <div className="p-2 bg-sky-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Experience #{index + 1}</h3>
            </div>
            {formData.experiences.length > 1 && (
              <button
                onClick={() => removeItem("experiences", index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleInputChange("experiences", "company", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="month"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => handleInputChange("experiences", "startDate", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">I currently work here</span>
            </label>
          </div>
          <textarea
            rows={3}
            placeholder="Describe your responsibilities and achievements..."
            value={exp.description}
            onChange={(e) => handleInputChange("experiences", "description", e.target.value, index)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
          />
        </motion.div>
      ))}
      <button
        onClick={() => addItem("experiences")}
        className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-sky-400 hover:bg-sky-50 transition-all text-slate-600 hover:text-sky-600 w-full justify-center"
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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => handleInputChange("education", "institution", e.target.value, index)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="Graduation Year"
              value={edu.graduationYear}
              onChange={(e) => handleInputChange("education", "graduationYear", e.target.value, index)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Additional details (optional)..."
            value={edu.description}
            onChange={(e) => handleInputChange("education", "description", e.target.value, index)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
          />
        </motion.div>
      ))}
      <button
        onClick={() => addItem("education")}
        className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-sky-400 hover:bg-sky-50 transition-all text-slate-600 hover:text-sky-600 w-full justify-center"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Another Education</span>
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
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
                  <Star className="w-4 h-4 text-orange-600" />
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
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all mb-3"
            />
            <select
              value={skill.level}
              onChange={(e) => handleInputChange("skills", "level", e.target.value, index)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
        className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-sky-400 hover:bg-sky-50 transition-all text-slate-600 hover:text-sky-600 w-full justify-center"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Another Skill</span>
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:36px_36px] opacity-50" />
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#bae6fd_0%,_transparent_40%)] animate-pulse-slow" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#c7d2fe_0%,_transparent_45%)] animate-pulse-slow animation-delay-2000" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-sky-100 rounded-full">
              <Sparkles className="w-8 h-8 text-sky-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Welcome to JobSpark!</h1>
          </div>
          <p className="text-lg text-slate-600">Let's set up your profile to get you started on your career journey</p>
        </motion.div>

        {/* Enhanced Progress Bar */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div 
                  key={step.id} 
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-6 h-6" />
                    )}
                    {index <= currentStep && (
                      <div className="absolute inset-0 bg-sky-500 rounded-full animate-ping opacity-20"></div>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-1 mx-4 transition-all duration-500 ${
                      index < currentStep ? 'bg-sky-500' : 'bg-slate-200'
                    }`} />
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </span>
            <p className="text-xs text-slate-500 mt-1">{steps[currentStep].description}</p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl shadow-slate-400/20 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-8">
                {React.createElement(steps[currentStep].icon, { 
                  className: "w-7 h-7 text-sky-500" 
                })}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{steps[currentStep].title}</h2>
                  <p className="text-slate-600">{steps[currentStep].description}</p>
                </div>
              </div>
              
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep ? 'bg-sky-500 w-8' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep) || isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/30"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{currentStep === steps.length - 1 ? "Complete Setup" : "Next"}</span>
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