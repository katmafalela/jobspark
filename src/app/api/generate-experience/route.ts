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
    const { jobTitle, company, basicDescription }: {
      jobTitle: string;
      company: string;
      basicDescription: string;
    } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are a professional CV writer. Help enhance a work experience description to make it more compelling and achievement-focused.

**Job Details:**
- Position: ${jobTitle}
- Company: ${company}
- Basic Description: ${basicDescription}

**Requirements:**
1. Transform the basic description into professional, achievement-focused bullet points
2. Use strong action verbs (Led, Developed, Implemented, Achieved, etc.)
3. Quantify achievements where possible (use realistic estimates if specific numbers aren't provided)
4. Make it relevant for the South African job market
5. Keep it concise but impactful (3-5 bullet points)
6. Focus on results and value delivered

**Format the response as bullet points that can be directly used in a CV:**

Please provide an enhanced experience description:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedDescription = response.text().trim();

    return NextResponse.json({ description: enhancedDescription });
  } catch (error) {
    console.error('Error generating experience description:', error);
    return NextResponse.json(
      { error: 'Failed to generate experience description. Please try again.' },
      { status: 500 }
    );
  }
}