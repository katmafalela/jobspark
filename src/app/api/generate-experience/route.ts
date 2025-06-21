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
You are a professional CV writer. Transform the basic job description into professional, achievement-focused bullet points.

**Job Details:**
- Position: ${jobTitle}
- Company: ${company}
- Basic Description: ${basicDescription}

**Requirements:**
1. Create 3-5 professional bullet points
2. Use strong action verbs (Led, Developed, Implemented, Achieved, etc.)
3. Quantify achievements where possible (use realistic estimates)
4. Make it relevant for the South African job market
5. Focus on results and value delivered
6. No explanatory text or brackets with additional information

**CRITICAL: Return ONLY the bullet points in plain text format. Each bullet point should start with "• " and be on a new line. Do not include any explanations, introductions, or additional commentary.**

Bullet points:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedDescription = response.text().trim();

    // Clean up the response to ensure proper bullet point formatting
    enhancedDescription = enhancedDescription
      .replace(/^(Here's|Here are|Enhanced.*?:|Bullet points:).*?\n?/i, '')
      .replace(/^\*\*.*?\*\*:?\s*/gm, '')
      .replace(/\(.*?\)/g, '') // Remove all bracketed explanations
      .replace(/^\*\s*/gm, '• ') // Convert * to •
      .replace(/^-\s*/gm, '• ') // Convert - to •
      .replace(/^\d+\.\s*/gm, '• ') // Convert numbered lists to bullets
      .split('\n')
      .filter(line => line.trim()) // Remove empty lines
      .map(line => line.trim().startsWith('•') ? line.trim() : `• ${line.trim()}`)
      .join('\n')
      .trim();

    return NextResponse.json({ description: enhancedDescription });
  } catch (error) {
    console.error('Error generating experience description:', error);
    return NextResponse.json(
      { error: 'Failed to generate experience description. Please try again.' },
      { status: 500 }
    );
  }
}