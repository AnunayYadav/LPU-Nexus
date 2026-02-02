
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysisResult, Flashcard } from "../types.ts";

/**
 * Ensures process.env.API_KEY is available even if the global shim in index.tsx 
 * was bypassed due to ESM hoisting.
 */
const syncEnv = () => {
  if (typeof process !== 'undefined' && !process.env.API_KEY) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        process.env.API_KEY = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
      }
    } catch (e) {
      // Ignore errors during env sync
    }
  }
};

// Run immediately on module load
syncEnv();

/**
 * Module A: The Placement Prefect
 * Analyzes resume against job description.
 */
export const analyzeResume = async (resumeText: string, jdText: string, deepAnalysis: boolean = false): Promise<ResumeAnalysisResult> => {
  syncEnv();
  if (!process.env.API_KEY) throw new Error("Gemini API Key is missing. Please check environment variables.");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview"; 

  const analysisType = deepAnalysis ? "DEEP ANALYSIS (STRICT)" : "STANDARD ANALYSIS";
  const depthInstruction = deepAnalysis 
    ? "Provide extremely detailed, critical feedback. Scrutinize every bullet point. Be harsh but constructive. The summary should be longer and comprehensive."
    : "Provide a quick, punchy analysis highlighting key gaps.";

  const prompt = `
    You are a ruthless technical recruiter for a top-tier tech company. 
    Perform a ${analysisType} of the following Candidate Resume against the provided Job Description.
    ${depthInstruction}
    
    JOB DESCRIPTION:
    ${jdText}

    RESUME CONTENT:
    ${resumeText}

    Output a strict JSON object with:
    1. matchScore (0-100 integer)
    2. missingKeywords (array of strings, critical skills missing)
    3. phrasingAdvice (array of strings, specific bullet point improvements)
    4. projectFeedback (string, critique on the projects section specifically)
    5. summary (string, overall verdict)
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      matchScore: { type: Type.INTEGER },
      missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      phrasingAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
      projectFeedback: { type: Type.STRING },
      summary: { type: Type.STRING },
    },
    required: ["matchScore", "missingKeywords", "phrasingAdvice", "projectFeedback", "summary"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: deepAnalysis ? 0.2 : 0.3, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ResumeAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

/**
 * Module B: The Academic Oracle
 */
export const askAcademicOracle = async (
  query: string, 
  contextText: string, 
  chatHistory: { role: string; text: string }[]
): Promise<string> => {
  syncEnv();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview";

  const systemInstruction = `
    You are "The Academic Oracle", an intelligent assistant for university students.
    You have access to a specific academic document provided in the context.
    
    RULES:
    1. Answer ONLY based on the provided Context. 
    2. If the answer is not in the context, state "I do not have that information in the uploaded document."
    3. Be precise with rules, fees, and penalties. Do not guess.
    4. Keep answers concise and student-friendly.
  `;

  const fullPrompt = `
    CONTEXT DOCUMENT:
    ${contextText.slice(0, 500000)} 
    
    USER QUERY:
    ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: fullPrompt, 
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, 
      }
    });

    return response.text || "I could not generate an answer.";
  } catch (error) {
    console.error("Oracle Error:", error);
    throw error;
  }
};

export const generateFlashcards = async (contextText: string): Promise<Flashcard[]> => {
  syncEnv();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview";
  const prompt = `
    Create 5 high-quality flashcards based on the following text.
    Focus on key definitions, dates, or formulas.
    
    TEXT:
    ${contextText.slice(0, 100000)}

    Output strictly in JSON format as an array of objects with "front" and "back" keys.
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        front: { type: Type.STRING },
        back: { type: Type.STRING },
      },
      required: ["front", "back"],
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const generateFlowchart = async (contextText: string): Promise<string> => {
  syncEnv();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview";
  const prompt = `
    Create a Mermaid.js flowchart syntax based on the key processes or concepts in the following text.
    Return ONLY the mermaid syntax string (start with 'graph TD'). Do not include markdown code fences.
    
    TEXT:
    ${contextText.slice(0, 100000)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    let text = response.text || "";
    text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
    return text;
  } catch (e) {
    console.error(e);
    return "graph TD; A[Error] --> B[Could not generate chart];";
  }
}

export const searchGlobalOpportunities = async (query: string) => {
  syncEnv();
  if (!process.env.API_KEY) throw new Error("Gemini API Key is missing.");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview"; 
  const contextualQuery = `
    Context: I am a student at Lovely Professional University (LPU), India. 
    I am looking for study abroad opportunities, semester exchange programs, university tie-ups, or masters programs relevant to my background.
    
    User Query: ${query}
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: contextualQuery,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Global Gateway Error:", error);
    throw error;
  }
};
