import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysisResult, Flashcard } from "../types.ts";

/**
 * Internal utility to retrieve the API key with maximum redundancy.
 */
const getApiKey = (): string => {
  // 1. Try process.env (populated by our shim)
  let key = (typeof process !== 'undefined' && process.env.API_KEY) ? process.env.API_KEY : undefined;
  
  // 2. Try direct literal access (triggers Vite static replacement in this module)
  if (!key) {
    try {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
    } catch (e) {}
  }
  
  if (!key) {
    throw new Error("Gemini API Key is missing. Check your environment variables (VITE_API_KEY).");
  }
  
  return key;
};

/**
 * Module A: The Placement Prefect
 * Analyzes resume against job description or industry trends.
 */
export const analyzeResume = async (resumeText: string, jdText: string, deepAnalysis: boolean = false): Promise<ResumeAnalysisResult> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview"; 

  const analysisType = deepAnalysis ? "DEEP CRITICAL ANALYSIS (STRICT)" : "STANDARD ATS SCAN";
  const depthInstruction = deepAnalysis 
    ? "Scrutunize every bullet point for quantifiable impact (metrics, percentages). Identify weak action verbs. Provide 'harsh' feedback on whether the candidate actually demonstrates seniority or proficiency. Scrutunize '2025 Industry Trends' alignment specifically."
    : "Highlight missing keywords and provide high-level phrasing improvements to bypass modern ATS filters.";

  const prompt = `
    You are a ruthless technical recruiter at a FAANG+ company specializing in university hiring. 
    Perform a ${analysisType} of the following Candidate Resume.
    
    TARGET TARGET (JD or Industry Trends):
    ${jdText}

    CANDIDATE RESUME:
    ${resumeText}

    INSTRUCTIONS:
    ${depthInstruction}
    
    If the TARGET text mentions 'Trends', evaluate the resume against current 2025 technology standards and high-demand skills for that specific role.
    
    Output a strict JSON object with:
    1. matchScore (0-100 integer)
    2. missingKeywords (array of strings, specific technical skills or buzzwords missing for 2025 market)
    3. phrasingAdvice (array of strings, specific 'Before/After' improvements for bullet points)
    4. projectFeedback (string, critique on project complexity and technical depth)
    5. summary (string, maximum 2 sentences, overall fit verdict)
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
        temperature: deepAnalysis ? 0.2 : 0.4, 
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
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
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
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
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
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
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
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview"; // Optimized for search grounding
  
  const systemInstruction = `
    You are the "LPU Global Gateway", a specialized counselor helping students at Lovely Professional University (LPU), India, find international academic and professional opportunities.
    
    Your goal is to provide up-to-date, live web information on:
    - Master's programs and PhDs in USA, UK, Europe, Australia, and Canada.
    - Visa processing times and requirements for Indian citizens.
    - Scholarships specifically for Indian students (e.g., Commonwealth, Chevening, DAAD).
    - Cost of living conversions to Indian Rupees (INR).
    - LPU tie-ups with foreign universities if mentioned in recent web news.
    
    STRICT RULES:
    1. Be concise and use Markdown tables or lists where appropriate.
    2. Always list key deadlines.
    3. If information is uncertain, specify that the user should verify with the official university website.
  `;

  const contextualQuery = `
    Student at LPU, India query: ${query}
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: contextualQuery,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for more factual search results
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