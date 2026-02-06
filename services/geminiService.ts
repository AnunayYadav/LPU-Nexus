
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysisResult, Flashcard, DaySchedule } from "../types.ts";

/**
 * Module A: The Placement Prefect
 */
export const analyzeResume = async (resumeText: string, jdText: string, deepAnalysis: boolean = false): Promise<ResumeAnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key Missing: Please configure VITE_API_KEY in environment.");
  
  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-pro-preview"; 

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
 * Module: Timetable Parser
 */
export const extractTimetableFromImage = async (base64Image: string): Promise<DaySchedule[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key Missing");

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    Extract the LPU University timetable from this screenshot. 
    Identify the days (Monday to Saturday) and slots.
    Return a structured JSON array of DaySchedule objects.
    Each object has: day, slots (array of objects with id, subject, room, startTime, endTime, type).
    Subject should ONLY be the subject code (e.g. CSE101) if full name is not present.
    Ensure startTime and endTime are in 'HH:mm' 24-hour format.
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.STRING },
        slots: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subject: { type: Type.STRING },
              room: { type: Type.STRING },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["id", "subject", "room", "startTime", "endTime", "type"]
          }
        }
      },
      required: ["day", "slots"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        { text: prompt },
        { inlineData: { mimeType: "image/png", data: base64Image.split(',')[1] || base64Image } }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1
      }
    });

    return JSON.parse(response.text || "[]") as DaySchedule[];
  } catch (error) {
    console.error("Timetable AI Error:", error);
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key Missing");

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview";

  const systemInstruction = `
    You are "The Academic Oracle", an assistant for LPU students.
    Answer ONLY based on the provided Context. 
    If not in context, state "I do not have that information in the uploaded document."
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

export const searchGlobalOpportunities = async (query: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key Missing");

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-pro-preview"; 
  
  const systemInstruction = `
    You are the "LPU Global Gateway" counselor.
    Provide up-to-date information on international programs, visas, and scholarships for Indian students.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Student query: ${query}`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, 
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

export const fetchCampusNews = async (query: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key Missing");

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-flash-preview"; 

  const systemInstruction = `
    You are "LPU Pulse", a campus news scout for LPU Phagwara.
    Use Google Search to find 2025 events, placements, and notices.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: query,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, 
      },
    });

    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("LPU Pulse Error:", error);
    throw error;
  }
};
