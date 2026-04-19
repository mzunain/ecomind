import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ecoAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    annualCO2Kg: {
      type: SchemaType.NUMBER,
      description: 'Estimated annual CO2 emissions in kilograms',
    },
    sustainabilityScore: {
      type: SchemaType.NUMBER,
      description: 'Sustainability score from 1 (worst) to 10 (best)',
    },
    summary: {
      type: SchemaType.STRING,
      description: 'Brief personalised summary of the lifestyle analysis',
    },
    topActions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          action: { type: SchemaType.STRING },
          annualSavingKg: { type: SchemaType.NUMBER },
          difficulty: {
            type: SchemaType.STRING,
            enum: ['easy', 'medium', 'hard'],
          },
          category: { type: SchemaType.STRING },
          reasoning: { type: SchemaType.STRING },
        },
        required: ['action', 'annualSavingKg', 'difficulty', 'category', 'reasoning'],
      },
    },
    regionalContext: {
      type: SchemaType.STRING,
      description: 'Region-specific advice relevant to the user location',
    },
  },
  required: ['annualCO2Kg', 'sustainabilityScore', 'summary', 'topActions', 'regionalContext'],
};

export async function POST(request: NextRequest) {
  try {
    const { lifestyle, region } = await request.json();

    if (!lifestyle || typeof lifestyle !== 'string') {
      return NextResponse.json({ error: 'Lifestyle description is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: ecoAnalysisSchema as any,
        temperature: 0.4,
      },
      systemInstruction: `You are an expert environmental scientist and carbon footprint analyst.
        Analyze the user's lifestyle description and provide a detailed, accurate carbon footprint assessment.
        Consider regional factors when provided (e.g., Nordic countries have cleaner electricity grids,
        Finland has excellent public transport in cities like Turku and Helsinki).
        Be specific, data-driven, and actionable. All CO2 estimates should be realistic annual figures.`,
    });

    const prompt = `Analyze this lifestyle for carbon footprint impact:

"${lifestyle}"

User region: ${region || 'Not specified'}

Provide:
1. Estimated total annual CO2 in kg (global average is ~4,000-7,000 kg/year)
2. Top 5 most impactful reduction actions ranked by annual CO2 savings
3. A sustainability score (1-10)
4. A personalised summary
5. Region-specific context and advice`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const analysis = JSON.parse(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lifestyle. Please try again.' },
      { status: 500 }
    );
  }
}
