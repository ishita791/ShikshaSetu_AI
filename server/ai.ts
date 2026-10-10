// LearnReach AI - Gemini AI Integration Service
// Model: gemini-3.8-flash with server-side SDK calls, user-agent telemetry, and robust rural pedagogical adaptations

import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface TutoringParams {
  message: string;
  subject?: string;
  topic?: string;
  language?: string; // 'en' | 'hi' | 'or' | 'bn'
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  gradeLevel?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface TutoringResponse {
  content: string;
  stepByStepExplanation: string;
  practicalExample: string;
  suggestedQuestions: string[];
}

export interface TranslationParams {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslationResponse {
  translatedText: string;
  simplifiedExplanation: string;
  keyVocabulary: { original: string; translated: string; definition: string }[];
  verificationNote: string;
}

export interface SimplifyParams {
  text: string;
  language: string;
  difficulty?: string;
}

export interface GeneratedQuizQuestion {
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topicConcept: string;
}

export interface GenerateQuizParams {
  subject: string;
  topic: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: string;
  questionCount: number;
  studentWeakConcepts?: string[];
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  or: 'Odia (ଓଡ଼ିଆ)',
  bn: 'Bengali (বাংলা)',
};

/**
 * AI Tutoring Agent
 * Provides patient, step-by-step pedagogical explanations tailored with rural context and everyday analogies.
 */
export async function getTutoringAdvice(params: TutoringParams): Promise<TutoringResponse> {
  const ai = getAiClient();
  const langName = LANGUAGE_NAMES[params.language || 'en'] || 'English';

  if (!ai) {
    // Helpful educational fallback if GEMINI_API_KEY is not configured
    return {
      content: `[Sample Educational Tutor]: To understand "${params.topic || 'this concept'}", let's relate it to everyday life. When learning ${params.subject || 'this subject'}, breaking it down step by step helps build lasting comprehension.`,
      stepByStepExplanation: `Step 1: Identify the main question and the facts given.\nStep 2: Connect it with a familiar physical example from nature or community.\nStep 3: Test your understanding with a small trial calculation or diagram.`,
      practicalExample: `In a rural community or farming context, understanding rates and quantities is like measuring seed distribution per bigha or checking sunlight hours for crops.`,
      suggestedQuestions: [
        'Can you explain this with a simpler village analogy?',
        'What is a common mistake students make here?',
        'Can you give me a practice question on this step?'
      ]
    };
  }

  const systemInstruction = `You are "LearnReach AI", an encouraging, deeply empathetic personal tutor designed for students in rural and underserved areas under UN SDG 4 (Quality Education).
Rules:
1. Explain in ${langName}. If technical terms are used, provide both local and English terms.
2. Adapt difficulty strictly to level: ${params.difficulty || 'BEGINNER'} and grade: ${params.gradeLevel || 'Class 8'}.
3. Subject context: ${params.subject || 'General Studies'}. Topic: ${params.topic || 'General'}.
4. Use relatable rural and nature analogies (farms, trees, rain cycles, solar lanterns, market stalls, craft work).
5. DO NOT just give direct exam answers; guide the student through step-by-step conceptual mastery.
6. Always return a valid JSON object matching the requested schema.`;

  const conversationHistory = (params.history || [])
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
    .join('\n');

  const prompt = `Student's current question: "${params.message}"
${conversationHistory ? `Recent conversation context:\n${conversationHistory}\n` : ''}

Provide your tutoring response with:
1. "content": The primary warm, encouraging explanation in ${langName}.
2. "stepByStepExplanation": Numbered, concise steps to understand or solve the concept.
3. "practicalExample": A vivid, practical real-world example suitable for rural learners.
4. "suggestedQuestions": 3 thoughtful follow-up questions the student might ask next.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            stepByStepExplanation: { type: Type.STRING },
            practicalExample: { type: Type.STRING },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['content', 'stepByStepExplanation', 'practicalExample', 'suggestedQuestions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      content: parsed.content || 'Here is an explanation of the topic.',
      stepByStepExplanation: parsed.stepByStepExplanation || 'Step 1: Review the core concept.',
      practicalExample: parsed.practicalExample || 'Think of a harvest cycle.',
      suggestedQuestions: Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions : [
        'Can you give another example?',
        'Why does this happen?',
      ],
    };
  } catch (err) {
    console.error('Gemini Tutoring API error:', err);
    return {
      content: `Let's break down this topic clearly. When studying ${params.topic || params.subject || 'this concept'}, focusing on root principles makes difficult ideas straightforward.`,
      stepByStepExplanation: `1. Understand the core definition.\n2. Observe where it happens in nature or daily tasks.\n3. Verify by applying it to a practical question.`,
      practicalExample: `Consider how soil holds moisture after gentle rain compared to a sudden flash flood: natural systems show us balance and rates of absorption.`,
      suggestedQuestions: [
        'Can you show another step?',
        'How does this apply in science experiments?',
      ]
    };
  }
}

/**
 * Regional Language Educational Translation
 * Translates academic texts accurately with bilingual terminology and simplified glossaries.
 */
export async function translateContent(params: TranslationParams): Promise<TranslationResponse> {
  const ai = getAiClient();
  const sourceName = LANGUAGE_NAMES[params.sourceLang] || params.sourceLang;
  const targetName = LANGUAGE_NAMES[params.targetLang] || params.targetLang;

  if (!ai) {
    return {
      translatedText: `[Translation Sample]: ${params.text} (Simulated translation from ${sourceName} to ${targetName})`,
      simplifiedExplanation: `This concept explains foundational academic knowledge in accessible phrasing for students.`,
      keyVocabulary: [
        { original: 'Education', translated: 'शिक्षा / ଶିକ୍ଷା / শিক্ষা', definition: 'The process of facilitating learning and knowledge acquisition.' }
      ],
      verificationNote: 'Always confirm important academic terms with your teacher.'
    };
  }

  const prompt = `Translate the following educational text from ${sourceName} to ${targetName}.
Input text: "${params.text}"

Also provide:
1. "translatedText": Fluent, natural educational translation into ${targetName}.
2. "simplifiedExplanation": A simplified 2-3 sentence explanation of the main concept in ${targetName} so young rural students can understand easily.
3. "keyVocabulary": Array of key academic terms with { "original", "translated", "definition" }.
4. "verificationNote": A gentle reminder in ${targetName} encouraging the student to verify with their teacher.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert bilingual EdTech translator for Indian and regional languages (English, Hindi, Odia, Bengali). Ensure academic accuracy while preserving cultural clarity.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            simplifiedExplanation: { type: Type.STRING },
            keyVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  translated: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ['original', 'translated', 'definition'],
              },
            },
            verificationNote: { type: Type.STRING },
          },
          required: ['translatedText', 'simplifiedExplanation', 'keyVocabulary', 'verificationNote'],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Translation error:', err);
    return {
      translatedText: `Translation service error. Please try again.`,
      simplifiedExplanation: `Unable to translate at this moment.`,
      keyVocabulary: [],
      verificationNote: 'Please verify with textbook or teacher.'
    };
  }
}

/**
 * Simplification Tool
 * Simplifies dense textbook paragraphs with vivid metaphors.
 */
export async function simplifyText(params: SimplifyParams): Promise<{ simplifiedText: string; analog: string; keyPoints: string[] }> {
  const ai = getAiClient();
  const langName = LANGUAGE_NAMES[params.language || 'en'] || 'English';

  if (!ai) {
    return {
      simplifiedText: `Here is the simplified explanation: The core idea is that big complex systems are just made of small, simple steps working together.`,
      analog: `Like water flowing through village irrigation canals to each row of crops.`,
      keyPoints: ['Keep it clear', 'Focus on the main cause and effect']
    };
  }

  const prompt = `Simplify the following educational text into clear, easy-to-grasp prose in ${langName} for a rural student:
"${params.text}"

Return JSON:
- "simplifiedText": Clear, approachable rewriting.
- "analog": A relatable everyday village/nature metaphor.
- "keyPoints": Array of 3 bullet takeaways.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an educator skilled at explaining advanced science, math, and social topics in plain, accessible language.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            simplifiedText: { type: Type.STRING },
            analog: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['simplifiedText', 'analog', 'keyPoints'],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error('Simplify text error:', err);
    return {
      simplifiedText: params.text,
      analog: 'Like steps in a daily harvest routine.',
      keyPoints: ['Core idea', 'Practical application']
    };
  }
}

/**
 * Smart Quiz Generator
 * Generates MCQs calibrated to student performance, targeting weak concepts.
 */
export async function generateSmartQuizQuestions(params: GenerateQuizParams): Promise<GeneratedQuizQuestion[]> {
  const ai = getAiClient();
  const langName = LANGUAGE_NAMES[params.language || 'en'] || 'English';
  const count = Math.min(Math.max(params.questionCount || 5, 3), 8);

  if (!ai) {
    // High-quality sample questions
    return [
      {
        prompt: `In the study of ${params.subject} (${params.topic}), which foundational principle is most critical?`,
        options: [
          'Observation and repeatable measurement',
          'Memorizing numbers without understanding meaning',
          'Ignoring environmental factors',
          'Skipping preliminary calculations'
        ],
        correctOptionIndex: 0,
        explanation: 'Scientific and mathematical reasoning relies first on careful observation and clear measurement.',
        topicConcept: 'Foundational Observation'
      },
      {
        prompt: `How does understanding ${params.topic} benefit community and rural life?`,
        options: [
          'It only applies in laboratory rooms',
          'It improves practical decision-making in resources and health',
          'It has no relation to daily tasks',
          'It is only meant for high-speed computers'
        ],
        correctOptionIndex: 1,
        explanation: 'Real-world knowledge enables efficient resource usage and informed daily choices.',
        topicConcept: 'Practical Application'
      },
      {
        prompt: `When analyzing a problem in ${params.topic}, what is the recommended first step?`,
        options: [
          'Guess the final answer immediately',
          'Break the problem down into known values and clear goals',
          'Change the units randomly',
          'Assume the answer is always zero'
        ],
        correctOptionIndex: 1,
        explanation: 'Deconstructing the problem identifies known information and the unknown target.',
        topicConcept: 'Systematic Problem Solving'
      }
    ];
  }

  const weakNotes = params.studentWeakConcepts && params.studentWeakConcepts.length > 0
    ? `Pay special attention to targeting these previously identified student weak concepts: ${params.studentWeakConcepts.join(', ')}.`
    : '';

  const prompt = `Generate exactly ${count} multiple-choice quiz questions for:
Subject: ${params.subject}
Topic: ${params.topic}
Difficulty: ${params.difficulty}
Language: ${langName}
${weakNotes}

Requirements:
- Each question must have exactly 4 distinct options.
- "correctOptionIndex" must be 0, 1, 2, or 3.
- Provide a clear, educational "explanation" that teaches why the answer is correct and explains any common misconceptions.
- "topicConcept": short 2-4 word concept tag (e.g. "Rate Calculation", "Leaf Respiration").
- Avoid trick questions; focus on genuine comprehension and reasoning.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an educational assessment specialist creating high-quality, culturally respectful MCQs for students in ${langName}.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctOptionIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              topicConcept: { type: Type.STRING },
            },
            required: ['prompt', 'options', 'correctOptionIndex', 'explanation', 'topicConcept'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Validate schema
      return parsed.map((q: any) => ({
        prompt: String(q.prompt || 'Question'),
        options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: typeof q.correctOptionIndex === 'number' && q.correctOptionIndex >= 0 && q.correctOptionIndex < 4 ? q.correctOptionIndex : 0,
        explanation: String(q.explanation || 'Review lesson material.'),
        topicConcept: String(q.topicConcept || params.topic),
      }));
    }
  } catch (err) {
    console.error('Quiz generation error:', err);
  }

  // Graceful fallback
  return [
    {
      prompt: `Regarding ${params.topic}, what is the most fundamental concept?`,
      options: ['The foundational principle', 'An arbitrary rule', 'An untested guess', 'An unrelated formula'],
      correctOptionIndex: 0,
      explanation: `Foundations are key to mastering ${params.topic}.`,
      topicConcept: 'Core Foundations'
    }
  ];
}
