
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
    ? "Act as a ruthless, hyper-critical technical recruiter. Do not be polite. Point out exactly where the candidate is lying or failing."
    : "Perform a professional resume audit against modern tech standards and the provided context.";

  const prompt = `
    TASK: GENERATE A COMPREHENSIVE ATS DIAGNOSTIC REPORT.
    
    TARGET CONTEXT (JD/TRENDS): ${jdText}
    RESUME CONTENT: ${resumeText}

    REQUIREMENTS:
    ${depthInstruction}
    
    1. For EVERY category below, you MUST identify what is present (found) and what is absent (missing) relative to the target context.
    2. Categories: keywordAnalysis, jobFit, achievements, formatting, language, branding.
    3. totalScore: 0-100 overall ranking.
    
    Output a JSON object exactly matching this schema:
    {
      "totalScore": number,
      "categories": {
        "category_id": {
          "score": number,
          "description": string,
          "found": string[],
          "missing": string[],
          "missingKeywordsExtended": [ { "name": string, "example": string, "importance": "High" | "Medium" | "Low" } ] (ONLY for keywordAnalysis)
        }
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
      categories: {
        type: Type.OBJECT,
        properties: {
          keywordAnalysis: categorySchema,
          jobFit: categorySchema,
          achievements: categorySchema,
          formatting: categorySchema,
          language: categorySchema,
          branding: categorySchema
        }
      },
      summary: { type: Type.STRING }
    },
    required: ["totalScore", "categories", "summary"]
  };

  const data = await callGeminiProxy("ANALYZE_RESUME", { prompt, schema, deep: deepAnalysis });
  return {
    ...(JSON.parse(data.text)),
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
