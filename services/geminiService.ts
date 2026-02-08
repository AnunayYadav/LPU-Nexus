
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
    ? "Act as a ruthless, hyper-critical technical recruiter. Do not be polite. Focus on why this candidate fails."
    : "Perform a professional resume audit against modern tech standards and the provided job description.";

  const prompt = `
    TASK: GENERATE A DETAILED PROFESSIONAL RESUME REPORT.
    
    JD/CONTEXT: ${jdText}
    RESUME: ${resumeText}

    CRITICAL REQUIREMENTS:
    ${depthInstruction}
    
    Return a structured JSON based on the ResumeAnalysisResult schema.
    1. totalScore: 0-100 overall score.
    2. categories: Break down into keywordAnalysis, jobFit, achievements, formatting, language, and branding.
    3. keywordAnalysis: List missing keywords with concrete examples of how to incorporate them.
    4. achievements: Focus on quantifying impact (%, $, scale).
    5. summary: A high-level verdict.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      totalScore: { type: Type.INTEGER },
      categories: {
        type: Type.OBJECT,
        properties: {
          keywordAnalysis: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              description: { type: Type.STRING },
              missingKeywords: {
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
            }
          },
          jobFit: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              description: { type: Type.STRING },
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          achievements: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              description: { type: Type.STRING },
              advice: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          formatting: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              description: { type: Type.STRING },
              issues: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          language: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              description: { type: Type.STRING },
              tone: { type: Type.STRING }
            }
          },
          branding: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              description: { type: Type.STRING },
              onlinePresence: { type: Type.STRING }
            }
          }
        }
      },
      summary: { type: Type.STRING }
    }
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
