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
    const { currentSummary, experiences, targetRole }: {
      currentSummary: string;
      experiences: Array<{
        title: string;
        company: string;
        description: string;
      }>;
      targetRole?: string;
    } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

**CRITICAL: Return ONLY the enhanced professional summary text. Do not include any explanations, introductions, or additional commentary. Just return the improved summary paragraph.**

Enhanced summary:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedSummary = response.text().trim();

    // Clean up any unwanted formatting or explanatory text
    enhancedSummary = enhancedSummary
      .replace(/^(Here's|Here is|Enhanced summary:|The enhanced summary is:).*?:/i, '')
      .replace(/^\*\*.*?\*\*:?\s*/i, '')
      .replace(/^Enhanced.*?:\s*/i, '')
      .trim();

    return NextResponse.json({ summary: enhancedSummary });
  } catch (error) {
    console.error('Error enhancing summary:', error);
    return NextResponse.json(
      { error: 'Failed to enhance summary. Please try again.' },
      { status: 500 }
    );
  }
}