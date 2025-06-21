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
  // ... [rest of the component code remains exactly the same]
};

export default CVBuilderPage;