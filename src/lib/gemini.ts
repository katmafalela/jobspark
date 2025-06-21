import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if we're in a browser environment and handle missing env var gracefully
const apiKey = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_GEMINI_API_KEY : '';

if (!apiKey && typeof window === 'undefined') {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    professionalSummary: string;
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

export interface GenerateCVRequest {
  cvData: CVData;
  jobDescription?: string;
  cvType?: 'professional' | 'creative' | 'technical' | 'executive';
}

export async function generateCV({ cvData, jobDescription, cvType = 'professional' }: GenerateCVRequest): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please check your NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are an expert CV writer specializing in South African job market. Create a professional, ATS-friendly CV based on the following information:

**Personal Information:**
- Name: ${cvData.personalInfo.fullName}
- Email: ${cvData.personalInfo.email}
- Phone: ${cvData.personalInfo.phone}
- Location: ${cvData.personalInfo.location}
- Professional Summary: ${cvData.personalInfo.professionalSummary}

**Work Experience:**
${cvData.experiences.map(exp => `
- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate})
  Location: ${exp.location || 'Not specified'}
  Description: ${exp.description}
`).join('\n')}

**Education:**
${cvData.education.map(edu => `
- ${edu.degree} from ${edu.institution} (${edu.graduationYear})
  Location: ${edu.location || 'Not specified'}
  ${edu.description ? `Description: ${edu.description}` : ''}
`).join('\n')}

**Skills:**
${cvData.skills.map(skill => `- ${skill.name} (${skill.level})`).join('\n')}

${jobDescription ? `**Target Job Description:**\n${jobDescription}\n\nPlease tailor the CV to match this job description, highlighting relevant skills and experiences.` : ''}

**CV Style:** ${cvType}

**Requirements:**
1. Create a professional, well-structured CV suitable for the South African job market
2. Use proper formatting with clear sections
3. Make it ATS-friendly with appropriate keywords
4. Keep it concise but comprehensive (2-3 pages max)
5. Use action verbs and quantify achievements where possible
6. Include a compelling professional summary
7. Format as clean, readable text that can be easily copied

**Output the CV in clean, formatted text that includes:**
- Header with contact information
- Professional Summary
- Work Experience (reverse chronological order)
- Education
- Skills
- Any additional relevant sections

Please generate the CV now:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating CV:', error);
    throw new Error('Failed to generate CV. Please try again.');
  }
}

export async function enhanceProfessionalSummary(currentSummary: string, experiences: CVData['experiences'], targetRole?: string): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please check your NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are a professional CV writer. Enhance the following professional summary to make it more compelling and tailored for the South African job market.

**Current Summary:**
${currentSummary}

**Work Experience Context:**
${experiences.map(exp => `- ${exp.title} at ${exp.company}: ${exp.description}`).join('\n')}

${targetRole ? `**Target Role:** ${targetRole}` : ''}

**Requirements:**
1. Keep it concise (3-4 sentences, max 100 words)
2. Highlight key achievements and skills
3. Make it compelling and professional
4. Include relevant keywords for ATS systems
5. Tailor for South African job market
6. Focus on value proposition

Please provide an enhanced professional summary:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error enhancing summary:', error);
    throw new Error('Failed to enhance summary. Please try again.');
  }
}