
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
    
    Output a strict JSON object with: matchScore, missingKeywords, phrasingAdvice, projectFeedback, summary.
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

  const data = await callGeminiProxy("ANALYZE_RESUME", { prompt, schema, deep: deepAnalysis });
  return JSON.parse(data.text) as ResumeAnalysisResult;
};

/**
 * Module: Timetable Hub
 */
export const extractTimetableFromImage = async (base64Image: string): Promise<DaySchedule[]> => {
  const prompt = `
    Extract the LPU University timetable from this screenshot. 
    Identify the days (Monday to Saturday) and slots.
    Return a structured JSON array of DaySchedule objects.
    Each object has: day, slots (array of objects with id, subject, room, startTime, endTime, type).
    Subject should ONLY be the subject code (e.g. CSE101).
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
