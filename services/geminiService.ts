
import { Type } from "@google/genai";
import { ResumeAnalysisResult, DaySchedule } from "../types.ts";

/**
 * Internal helper to communicate with the backend Gemini proxy
 */
const callGeminiProxy = async (action: string, payload: any) => {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to communicate with Nexus Intelligence.");
  }

  return await res.json();
};

/**
 * Module: Placement Prefect
 */
export const analyzeResume = async (resumeText: string, jdText: string, deepAnalysis: boolean = false): Promise<ResumeAnalysisResult> => {
  const depthInstruction = deepAnalysis 
    ? "Act as a ruthless, hyper-critical technical recruiter. Do not be polite. Expose 'fake' keywords, lack of metrics, and keyword dumping. Be scathing in the summary."
    : "Perform a professional resume audit against modern tech standards and the provided context.";

  const prompt = `
    TASK: GENERATE A SEMANTIC ATS DIAGNOSTIC REPORT.
    
    TARGET CONTEXT (JD/TRENDS): ${jdText}
    RESUME CONTENT: ${resumeText}

    REQUIREMENTS:
    ${depthInstruction}
    
    CRITICAL QUALITY CHECK (Is this written for humans or bots?):
    1. Detect "Keyword Stuffing": Skills listed in a dump without being used in a sentence or project.
    2. Detect "Action Verb + Skill" absence: Are skills tied to action verbs like "Developed", "Optimized", "Architected"?
    3. Detect "Impact Metrics": Are there numbers/percentages/scale? (%, users, $, scale).
    4. Meaningfulness Score: Calculate a 0-100% score based on Sentence Quality, Metrics Presence, and Contextual Usage.
    
    Output a JSON object exactly matching this schema:
    {
      "totalScore": number,
      "meaningScore": number,
      "keywordQuality": { "contextual": number, "weak": number, "stuffed": number },
      "flags": [ { "type": "warning" | "critical" | "success", "message": string } ],
      "categories": {
        "keywordAnalysis": { "score": number, "description": string, "found": string[], "missing": string[], "missingKeywordsExtended": [ { "name": string, "example": string, "importance": "High" | "Medium" | "Low" } ] },
        "jobFit": { "score": number, "description": string, "found": string[], "missing": string[] },
        "achievements": { "score": number, "description": string, "found": string[], "missing": string[] },
        "formatting": { "score": number, "description": string, "found": string[], "missing": string[] },
        "language": { "score": number, "description": string, "found": string[], "missing": string[] },
        "branding": { "score": number, "description": string, "found": string[], "missing": string[] }
      },
      "summary": string
    }
  `;

  const categorySchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER },
      description: { type: Type.STRING },
      found: { type: Type.ARRAY, items: { type: Type.STRING } },
      missing: { type: Type.ARRAY, items: { type: Type.STRING } },
      missingKeywordsExtended: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            example: { type: Type.STRING },
            importance: { type: Type.STRING }
          }
        }
      }
    },
    required: ["score", "description", "found", "missing"]
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      totalScore: { type: Type.INTEGER },
      meaningScore: { type: Type.INTEGER },
      keywordQuality: {
        type: Type.OBJECT,
        properties: {
          contextual: { type: Type.INTEGER },
          weak: { type: Type.INTEGER },
          stuffed: { type: Type.INTEGER }
        }
      },
      flags: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            message: { type: Type.STRING }
          }
        }
      },
      categories: {
        type: Type.OBJECT,
        properties: {
          keywordAnalysis: categorySchema,
          jobFit: categorySchema,
          achievements: categorySchema,
          formatting: categorySchema,
          language: categorySchema,
          branding: categorySchema
        },
        required: ["keywordAnalysis", "jobFit", "achievements", "formatting", "language", "branding"]
      },
      summary: { type: Type.STRING }
    },
    required: ["totalScore", "meaningScore", "keywordQuality", "flags", "categories", "summary"]
  };

  const data = await callGeminiProxy("ANALYZE_RESUME", { prompt, schema, deep: deepAnalysis });
  const parsed = JSON.parse(data.text);
  
  const defaultCategory = { score: 0, description: 'No data', found: [], missing: [] };
  const categories = {
    keywordAnalysis: parsed.categories?.keywordAnalysis || defaultCategory,
    jobFit: parsed.categories?.jobFit || defaultCategory,
    achievements: parsed.categories?.achievements || defaultCategory,
    formatting: parsed.categories?.formatting || defaultCategory,
    language: parsed.categories?.language || defaultCategory,
    branding: parsed.categories?.branding || defaultCategory,
  };

  return {
    ...parsed,
    categories,
    analysisDate: Date.now()
  } as ResumeAnalysisResult;
};

/**
 * Module: Timetable Hub
 */
export const extractTimetableFromImage = async (base64Image: string): Promise<DaySchedule[]> => {
  const prompt = `
    Extract the LPU University timetable from this screenshot. 
    Identify the days (Monday to Saturday) and slots.
    Return a structured JSON array of DaySchedule objects.
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

  const data = await callGeminiProxy("EXTRACT_TIMETABLE", { 
    prompt, 
    schema, 
    imageData: base64Image.split(',')[1] || base64Image 
  });
  return JSON.parse(data.text) as DaySchedule[];
};

/**
 * Module: Global Gateway
 */
export const searchGlobalOpportunities = async (query: string) => {
  return await callGeminiProxy("GLOBAL_GATEWAY", {
    prompt: `Student query: ${query}`,
    systemInstruction: `You are the "LPU Global Gateway" counselor. Provide up-to-date information on international programs, visas, and scholarships for Indian students.`
  });
};

/**
 * Module: LPU Pulse News
 */
export const fetchCampusNews = async (query: string) => {
  return await callGeminiProxy("CAMPUS_NEWS", {
    prompt: query,
    systemInstruction: `You are "LPU Pulse", a campus news scout for LPU Phagwara. Use Google Search to find 2025 events, placements, and notices.`
  });
};
