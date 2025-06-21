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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

**CRITICAL: Return ONLY a valid JSON array. No explanations, no markdown formatting, no additional text. Just the JSON array.**

Skill levels should be: Beginner, Intermediate, Advanced, or Expert

Format: [{"name": "Project Management", "level": "Advanced"}, {"name": "Python", "level": "Intermediate"}]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let suggestedSkills;
    
    try {
      // Clean the response to ensure it's valid JSON
      let responseText = response.text().trim();
      
      // Remove any markdown formatting
      responseText = responseText.replace(/```json\n?|\n?```/g, '');
      
      // Remove any explanatory text before the JSON
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }
      
      suggestedSkills = JSON.parse(responseText);
      
      // Validate the structure
      if (!Array.isArray(suggestedSkills)) {
        throw new Error('Response is not an array');
      }
      
      // Ensure each skill has name and level
      suggestedSkills = suggestedSkills.filter(skill => 
        skill && typeof skill === 'object' && skill.name && skill.level
      );
      
    } catch (parseError) {
      // If JSON parsing fails, return a fallback response based on experience
      console.error('Failed to parse AI response as JSON:', parseError);
      
      // Generate fallback skills based on job titles
      const jobTitles = experiences.map(exp => exp.title.toLowerCase()).join(' ');
      let fallbackSkills = [
        { name: "Communication", level: "Advanced" },
        { name: "Problem Solving", level: "Advanced" },
        { name: "Team Collaboration", level: "Intermediate" },
        { name: "Project Management", level: "Intermediate" }
      ];
      
      // Add tech skills if relevant
      if (jobTitles.includes('engineer') || jobTitles.includes('developer') || jobTitles.includes('technical')) {
        fallbackSkills.push(
          { name: "Software Development", level: "Advanced" },
          { name: "Technical Documentation", level: "Intermediate" }
        );
      }
      
      if (jobTitles.includes('manager') || jobTitles.includes('lead')) {
        fallbackSkills.push(
          { name: "Leadership", level: "Advanced" },
          { name: "Strategic Planning", level: "Intermediate" }
        );
      }
      
      suggestedSkills = fallbackSkills;
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