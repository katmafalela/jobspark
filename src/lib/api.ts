// API client functions for calling our backend routes

export interface CVData {
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
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationYear: string;
    description?: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
}

export async function generateCV(data: {
  cvData: CVData;
  jobDescription?: string;
  cvType?: "professional" | "creative" | "technical" | "executive";
}): Promise<string> {
  const response = await fetch("/api/generate-cv", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate CV");
  }

  const result = await response.json();
  return result.cv;
}

export async function enhanceProfessionalSummary(
  currentSummary: string,
  experiences: CVData["experiences"],
  targetRole?: string
): Promise<string> {
  const response = await fetch("/api/enhance-summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentSummary,
      experiences,
      targetRole,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to enhance summary");
  }

  const result = await response.json();
  return result.summary;
}

export async function generateExperienceDescription(
  jobTitle: string,
  company: string,
  basicDescription: string
): Promise<string> {
  const response = await fetch("/api/generate-experience", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jobTitle,
      company,
      basicDescription,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate experience description");
  }

  const result = await response.json();
  return result.description;
}

export async function suggestSkills(
  experiences: CVData["experiences"],
  jobDescription?: string
): Promise<Array<{ name: string; level: string }>> {
  const response = await fetch("/api/suggest-skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      experiences,
      jobDescription,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to suggest skills");
  }

  const result = await response.json();
  return result.skills;
}
