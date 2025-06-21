import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: NextRequest) {
  if (!genAI) {
    return NextResponse.json(
      { error: 'Gemini AI is not configured. Please check your GEMINI_API_KEY environment variable.' },
      { status: 500 }
    );
  }

  try {
    const { experiences, jobDescription }: {
      experiences: Array<{
        title: string;
        company: string;
        description: string;
      }>;
      jobDescription?: string;
    } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are a career advisor specializing in the South African job market. Based on the user's work experience${jobDescription ? ' and target job description' : ''}, suggest relevant skills they should highlight on their CV.

**Work Experience:**
${experiences.map(exp => `- ${exp.title} at ${exp.company}: ${exp.description}`).join('\n')}

${jobDescription ? `**Target Job Description:**\n${jobDescription}` : ''}

**Requirements:**
1. Suggest 8-12 relevant skills based on their experience
2. Include both technical and soft skills
3. Consider skills that are in demand in the South African job market
4. Mix of specific tools/technologies and broader competencies
5. Skills should be realistic based on their experience level
6. Include skills that would make them competitive

**Format the response as a JSON array of objects with "name" and "level" properties:**
Example: [{"name": "Project Management", "level": "Advanced"}, {"name": "Python", "level": "Intermediate"}]

Skill levels should be: Beginner, Intermediate, Advanced, or Expert

Please provide the suggested skills:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let suggestedSkills;
    
    try {
      // Try to parse as JSON
      const responseText = response.text().trim();
      // Remove any markdown formatting
      const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '');
      suggestedSkills = JSON.parse(cleanedResponse);
    } catch (parseError) {
      // If JSON parsing fails, return a fallback response
      console.error('Failed to parse AI response as JSON:', parseError);
      suggestedSkills = [
        { name: "Communication", level: "Advanced" },
        { name: "Problem Solving", level: "Advanced" },
        { name: "Team Collaboration", level: "Intermediate" },
        { name: "Project Management", level: "Intermediate" }
      ];
    }

    return NextResponse.json({ skills: suggestedSkills });
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return NextResponse.json(
      { error: 'Failed to suggest skills. Please try again.' },
      { status: 500 }
    );
  }
}