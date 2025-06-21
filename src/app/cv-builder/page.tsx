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
  Zap,
  Undo,
  FolderPlus,
  Folder,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserProfile,
  getUserExperiences,
  getUserEducation,
  getUserSkills,
  getUserCVs,
  createGeneratedCV,
  updateGeneratedCV,
  deleteGeneratedCV,
  getCVSections,
  createCVSection,
  updateCVSection,
  createCVVersion,
  getLatestCVVersion,
  type GeneratedCV,
  type CVSection,
} from "@/lib/database";
import {
  generateCV,
  enhanceProfessionalSummary,
  generateExperienceDescription,
  suggestSkills,
  type CVData,
} from "@/lib/api";
import { exportToPDF } from "@/lib/pdf-export";

interface CVBuilderState {
  currentCV: GeneratedCV | null;
  userCVs: GeneratedCV[];
  cvSections: CVSection[];
  showCVSelector: boolean;
}

const CVBuilderPage = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [cvType, setCvType] = useState<
    "professional" | "creative" | "technical" | "executive"
  >("professional");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [enhancingExperience, setEnhancingExperience] = useState<number | null>(
    null
  );
  const [showNewCVModal, setShowNewCVModal] = useState(false);
  const [newCVName, setNewCVName] = useState("");

  const [builderState, setBuilderState] = useState<CVBuilderState>({
    currentCV: null,
    userCVs: [],
    cvSections: [],
    showCVSelector: false,
  });

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      professionalSummary: "",
      profileImageUrl: "",
    },
    experiences: [],
    education: [],
    skills: [],
  });

  useEffect(() => {
    loadUserData();
  }, [user]);

  useEffect(() => {
    if (builderState.currentCV) {
      loadCVSections();
    }
  }, [builderState.currentCV]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [profile, experiences, education, skills, userCVs] =
        await Promise.all([
          getUserProfile(user.id),
          getUserExperiences(user.id),
          getUserEducation(user.id),
          getUserSkills(user.id),
          getUserCVs(user.id),
        ]);

      // Load profile data
      if (profile) {
        setCvData((prev) => ({
          ...prev,
          personalInfo: {
            fullName: profile.full_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            professionalSummary: profile.professional_summary || "",
            profileImageUrl: profile.profile_image_url || "",
          },
        }));
      }

      // Load experiences, education, skills
      setCvData((prev) => ({
        ...prev,
        experiences: experiences.map((exp) => ({
          title: exp.title,
          company: exp.company,
          location: exp.location || "",
          startDate: exp.start_date,
          endDate: exp.end_date || "",
          isCurrent: exp.is_current,
          description: exp.description || "",
        })),
        education: education.map((edu) => ({
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location || "",
          graduationYear: edu.graduation_year,
          description: edu.description || "",
        })),
        skills: skills.map((skill) => ({
          name: skill.name,
          level: skill.level,
        })),
      }));

      // Set up CV state
      setBuilderState((prev) => ({
        ...prev,
        userCVs,
        currentCV: userCVs[0] || null,
        showCVSelector: userCVs.length > 1,
      }));
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadCVSections = async () => {
    if (!builderState.currentCV) return;

    try {
      const sections = await getCVSections(builderState.currentCV.id);
      setBuilderState((prev) => ({ ...prev, cvSections: sections }));

      // Apply saved sections to CV data
      sections.forEach((section) => {
        switch (section.section_type) {
          case "summary":
            setCvData((prev) => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                professionalSummary: section.section_data.summary,
              },
            }));
            break;
          case "experience":
            if (section.section_data.experiences) {
              setCvData((prev) => ({
                ...prev,
                experiences: section.section_data.experiences,
              }));
            }
            break;
          case "education":
            if (section.section_data.education) {
              setCvData((prev) => ({
                ...prev,
                education: section.section_data.education,
              }));
            }
            break;
          case "skills":
            if (section.section_data.skills) {
              setCvData((prev) => ({
                ...prev,
                skills: section.section_data.skills,
              }));
            }
            break;
        }
      });
    } catch (error) {
      console.error("Error loading CV sections:", error);
    }
  };

  const saveSection = async (
    sectionType: "summary" | "experience" | "education" | "skills",
    data: any,
    aiGenerated: boolean = false
  ) => {
    if (!builderState.currentCV || !user) return;

    try {
      // Create version backup before saving
      const existingSection = builderState.cvSections.find(
        (s) => s.section_type === sectionType
      );
      if (existingSection) {
        const latestVersion = await getLatestCVVersion(
          builderState.currentCV.id,
          sectionType
        );
        const versionNumber = latestVersion
          ? latestVersion.version_number + 1
          : 1;

        await createCVVersion({
          cv_id: builderState.currentCV.id,
          section_type: sectionType,
          version_number: versionNumber,
          previous_data: existingSection.section_data,
        });

        // Update existing section
        await updateCVSection(existingSection.id, {
          section_data: data,
          ai_generated: aiGenerated,
        });
      } else {
        // Create new section
        await createCVSection({
          user_id: user.id,
          cv_id: builderState.currentCV.id,
          section_type: sectionType,
          section_data: data,
          ai_generated: aiGenerated,
        });
      }

      // Reload sections
      await loadCVSections();
    } catch (error) {
      console.error("Error saving section:", error);
      alert("Failed to save section. Please try again.");
    }
  };

  const undoSection = async (
    sectionType: "summary" | "experience" | "education" | "skills"
  ) => {
    if (!builderState.currentCV) return;

    try {
      const latestVersion = await getLatestCVVersion(
        builderState.currentCV.id,
        sectionType
      );
      if (!latestVersion) {
        alert("No previous version available to undo.");
        return;
      }

      const existingSection = builderState.cvSections.find(
        (s) => s.section_type === sectionType
      );
      if (existingSection) {
        await updateCVSection(existingSection.id, {
          section_data: latestVersion.previous_data,
          ai_generated: false,
        });

        // Apply the undone data to the current state
        switch (sectionType) {
          case "summary":
            setCvData((prev) => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                professionalSummary: latestVersion.previous_data.summary,
              },
            }));
            break;
          case "experience":
            setCvData((prev) => ({
              ...prev,
              experiences: latestVersion.previous_data.experiences,
            }));
            break;
          case "education":
            setCvData((prev) => ({
              ...prev,
              education: latestVersion.previous_data.education,
            }));
            break;
          case "skills":
            setCvData((prev) => ({
              ...prev,
              skills: latestVersion.previous_data.skills,
            }));
            break;
        }

        await loadCVSections();
      }
    } catch (error) {
      console.error("Error undoing section:", error);
      alert("Failed to undo changes. Please try again.");
    }
  };

  const createNewCV = async () => {
    if (!user || !newCVName.trim()) return;

    try {
      setIsSaving(true);
      const newCV = await createGeneratedCV({
        user_id: user.id,
        title: newCVName,
        content: "",
        job_description: null,
        cv_name: newCVName,
      });

      setBuilderState((prev) => ({
        ...prev,
        userCVs: [newCV, ...prev.userCVs],
        currentCV: newCV,
        cvSections: [],
      }));

      setNewCVName("");
      setShowNewCVModal(false);
    } catch (error: any) {
      console.error("Error creating new CV:", error);
      if (error.message?.includes("Maximum of 3 active CVs")) {
        alert(
          "You can only have 3 active CVs. Please delete one to create a new CV."
        );
      } else {
        alert("Failed to create new CV. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const switchCV = (cv: GeneratedCV) => {
    setBuilderState((prev) => ({
      ...prev,
      currentCV: cv,
      showCVSelector: false,
    }));
  };

  const deleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      await deleteGeneratedCV(cvId);
      const updatedCVs = builderState.userCVs.filter((cv) => cv.id !== cvId);

      setBuilderState((prev) => ({
        ...prev,
        userCVs: updatedCVs,
        currentCV: updatedCVs[0] || null,
        showCVSelector: updatedCVs.length > 1,
      }));
    } catch (error) {
      console.error("Error deleting CV:", error);
      alert("Failed to delete CV. Please try again.");
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

      setCvData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          professionalSummary: enhanced,
        },
      }));

      // Save to database
      await saveSection("summary", { summary: enhanced }, true);
    } catch (error) {
      console.error("Error enhancing summary:", error);
      alert("Failed to enhance summary. Please try again.");
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
        experience.description ||
          `Worked as ${experience.title} at ${experience.company}`
      );

      const updatedExperiences = cvData.experiences.map((exp, i) =>
        i === index ? { ...exp, description: enhanced } : exp
      );

      setCvData((prev) => ({
        ...prev,
        experiences: updatedExperiences,
      }));

      // Save to database
      await saveSection(
        "experience",
        { experiences: updatedExperiences },
        true
      );
    } catch (error) {
      console.error("Error generating experience:", error);
      alert("Failed to generate experience description. Please try again.");
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
      const existingSkillNames = cvData.skills.map((s) => s.name.toLowerCase());
      const newSkills = suggested.filter(
        (s) => !existingSkillNames.includes(s.name.toLowerCase())
      );

      const updatedSkills = [...cvData.skills, ...newSkills];
      setCvData((prev) => ({ ...prev, skills: updatedSkills }));

      // Save to database
      await saveSection("skills", { skills: updatedSkills }, true);
    } catch (error) {
      console.error("Error suggesting skills:", error);
      alert("Failed to suggest skills. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!builderState.currentCV) return;

    const cvName =
      builderState.currentCV.cv_name || builderState.currentCV.title;
    exportToPDF(cvData, cvName);
  };

  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
        },
      ],
    }));
  };

  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          location: "",
          graduationYear: "",
          description: "",
        },
      ],
    }));
  };

  const addSkill = () => {
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", level: "Intermediate" }],
    }));
  };

  const removeExperience = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const removeEducation = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const removeSkill = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const updateSkill = (index: number, field: string, value: any) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case "Beginner":
        return "25%";
      case "Intermediate":
        return "50%";
      case "Advanced":
        return "75%";
      case "Expert":
        return "100%";
      default:
        return "50%";
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-red-400";
      case "Intermediate":
        return "bg-yellow-400";
      case "Advanced":
        return "bg-blue-400";
      case "Expert":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  // Helper function to render bullet points properly
  const renderBulletPoints = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n").filter((line) => line.trim());

    return (
      <ul className="space-y-1">
        {lines.map((line, index) => {
          // Remove bullet point if it exists and clean the line
          const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();
          return (
            <li
              key={index}
              className="flex items-start text-sm text-slate-700 leading-relaxed"
            >
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
              <Link
                href="/dashboard"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-sky-500" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    CV Builder
                  </h1>
                  <p className="text-sm text-slate-600">
                    {builderState.currentCV
                      ? builderState.currentCV.cv_name ||
                        builderState.currentCV.title
                      : "Create your professional CV"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* CV Selector */}
              <div className="relative">
                <button
                  onClick={() =>
                    setBuilderState((prev) => ({
                      ...prev,
                      showCVSelector: !prev.showCVSelector,
                    }))
                  }
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Folder className="w-4 h-4" />
                  <span className="text-sm">
                    CVs ({builderState.userCVs.length}/3)
                  </span>
                  <MoreVertical className="w-4 h-4" />
                </button>

                {builderState.showCVSelector && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900">Your CVs</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {builderState.userCVs.map((cv) => (
                        <div
                          key={cv.id}
                          className="flex items-center justify-between p-3 hover:bg-slate-50"
                        >
                          <button
                            onClick={() => switchCV(cv)}
                            className={`flex-1 text-left text-sm ${
                              builderState.currentCV?.id === cv.id
                                ? "font-semibold text-sky-600"
                                : "text-slate-700"
                            }`}
                          >
                            {cv.cv_name || cv.title}
                          </button>
                          <button
                            onClick={() => deleteCV(cv.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {builderState.userCVs.length < 3 && (
                      <div className="p-3 border-t border-slate-200">
                        <button
                          onClick={() => setShowNewCVModal(true)}
                          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                        >
                          <FolderPlus className="w-4 h-4" />
                          <span className="text-sm">New CV</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleExportPDF}
                disabled={!builderState.currentCV}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* New CV Modal */}
      {showNewCVModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Create New CV
            </h3>
            <input
              type="text"
              value={newCVName}
              onChange={(e) => setNewCVName(e.target.value)}
              placeholder="Enter CV name (e.g., Software Engineer CV)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewCVModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewCV}
                disabled={!newCVName.trim() || isSaving}
                className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24 space-y-6">
              <div>
                <h2 className="font-semibold text-slate-900 mb-4">
                  CV Customization
                </h2>

                {/* CV Style */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CV Style
                  </label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Job (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    placeholder="Paste job description to tailor your CV..."
                  />
                </div>

                {/* AI Tools */}
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
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {cvData.personalInfo.profileImageUrl ? (
                      <Image
                        src={cvData.personalInfo.profileImageUrl}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                  <div className="flex-1">
                    {editingSection === "personal" ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={cvData.personalInfo.fullName}
                          onChange={(e) =>
                            updatePersonalInfo("fullName", e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-white/60 text-lg"
                          placeholder="Full Name"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="email"
                            value={cvData.personalInfo.email}
                            onChange={(e) =>
                              updatePersonalInfo("email", e.target.value)
                            }
                            className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white placeholder-white/60"
                            placeholder="Email"
                          />
                          <input
                            type="tel"
                            value={cvData.personalInfo.phone}
                            onChange={(e) =>
                              updatePersonalInfo("phone", e.target.value)
                            }
                            className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white placeholder-white/60"
                            placeholder="Phone"
                          />
                        </div>
                        <input
                          type="text"
                          value={cvData.personalInfo.location}
                          onChange={(e) =>
                            updatePersonalInfo("location", e.target.value)
                          }
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
                      <div
                        className="group cursor-pointer"
                        onClick={() => setEditingSection("personal")}
                      >
                        <h1 className="text-3xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                          {cvData.personalInfo.fullName || "Your Name"}
                          <Edit3 className="inline w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h1>
                        <div className="space-y-1 text-white/80 text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>
                                {cvData.personalInfo.email ||
                                  "email@example.com"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>
                                {cvData.personalInfo.phone || "+27 XX XXX XXXX"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {cvData.personalInfo.location || "City, Province"}
                            </span>
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
                        onClick={() => undoSection("summary")}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Undo className="w-3 h-3" />
                        <span>Undo</span>
                      </button>
                      <button
                        onClick={handleEnhanceSummary}
                        disabled={
                          isEnhancing ||
                          !cvData.personalInfo.professionalSummary
                        }
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
                        onChange={(e) =>
                          updatePersonalInfo(
                            "professionalSummary",
                            e.target.value
                          )
                        }
                        className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        placeholder="Write your professional summary..."
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingSection(null);
                            saveSection("summary", {
                              summary: cvData.personalInfo.professionalSummary,
                            });
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="group cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      onClick={() => setEditingSection("summary")}
                    >
                      <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
                        {cvData.personalInfo.professionalSummary ||
                          "Click to add your professional summary..."}
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => undoSection("experience")}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Undo className="w-3 h-3" />
                        <span>Undo</span>
                      </button>
                      <button
                        onClick={addExperience}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
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
                        <div
                          key={index}
                          className="border-l-4 border-sky-500 pl-4 relative group"
                        >
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
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Job Title"
                                />
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "company",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Company"
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <input
                                  type="text"
                                  value={exp.location}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "location",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Location"
                                />
                                <input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                                {!exp.isCurrent && (
                                  <input
                                    type="month"
                                    value={exp.endDate}
                                    onChange={(e) =>
                                      updateExperience(
                                        index,
                                        "endDate",
                                        e.target.value
                                      )
                                    }
                                    className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  />
                                )}
                              </div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={exp.isCurrent}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "isCurrent",
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="text-sm">
                                  Currently working here
                                </span>
                              </label>
                              <textarea
                                rows={3}
                                value={exp.description}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                placeholder="Describe your responsibilities and achievements..."
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingSection(null);
                                    saveSection("experience", {
                                      experiences: cvData.experiences,
                                    });
                                  }}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingSection(null)}
                                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer p-2 rounded hover:bg-slate-50 transition-colors"
                              onClick={() =>
                                setEditingSection(`experience-${index}`)
                              }
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
                                    {exp.startDate} -{" "}
                                    {exp.isCurrent ? "Present" : exp.endDate}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                {exp.description ? (
                                  renderBulletPoints(exp.description)
                                ) : (
                                  <p className="text-sm text-slate-500 italic">
                                    Click to add job description...
                                  </p>
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => undoSection("education")}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Undo className="w-3 h-3" />
                        <span>Undo</span>
                      </button>
                      <button
                        onClick={addEducation}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
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
                        <div
                          key={index}
                          className="border-l-4 border-purple-500 pl-4 relative group"
                        >
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
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "degree",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Degree"
                                />
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "institution",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Institution"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={edu.location}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "location",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Location"
                                />
                                <input
                                  type="text"
                                  value={edu.graduationYear}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "graduationYear",
                                      e.target.value
                                    )
                                  }
                                  className="border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                  placeholder="Graduation Year"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingSection(null);
                                    saveSection("education", {
                                      education: cvData.education,
                                    });
                                  }}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingSection(null)}
                                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer p-2 rounded hover:bg-slate-50 transition-colors"
                              onClick={() =>
                                setEditingSection(`education-${index}`)
                              }
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-slate-900 text-base">
                                    {edu.degree || "Degree"}
                                  </h3>
                                  <div className="flex items-center space-x-2 text-slate-600 text-sm">
                                    <Building2 className="w-4 h-4" />
                                    <span>
                                      {edu.institution || "Institution"}
                                    </span>
                                    {edu.location && (
                                      <>
                                        <span>•</span>
                                        <span>{edu.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm text-slate-500">
                                  {edu.graduationYear}
                                </span>
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => undoSection("skills")}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Undo className="w-3 h-3" />
                        <span>Undo</span>
                      </button>
                      <button
                        onClick={addSkill}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
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
                                onChange={(e) =>
                                  updateSkill(index, "name", e.target.value)
                                }
                                className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Skill name"
                              />
                              <select
                                value={skill.level}
                                onChange={(e) =>
                                  updateSkill(index, "level", e.target.value)
                                }
                                className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">
                                  Intermediate
                                </option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingSection(null);
                                    saveSection("skills", {
                                      skills: cvData.skills,
                                    });
                                  }}
                                  className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingSection(null)}
                                  className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() =>
                                setEditingSection(`skill-${index}`)
                              }
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-slate-900 text-sm">
                                  {skill.name || "Skill name"}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {skill.level}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${getSkillLevelColor(
                                    skill.level
                                  )}`}
                                  style={{
                                    width: getSkillLevelWidth(skill.level),
                                  }}
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
