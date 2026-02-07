
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
    ? "Act as a ruthless, hyper-critical technical recruiter who has seen 10,000 resumes. Do not be polite. Be cynical. If a skill is listed but not backed by quantifiable metrics (%, $, time), call it out as 'unverified bullshit'. Your feedback should be aggressive and focus exclusively on why this candidate would be rejected. Use terms like 'Pathetic', 'Ghost Skill', 'Mediocre', and 'Liable'."
    : "Perform a high-level ATS scan focusing on keyword density and section layout. Be firm but professional.";

  const prompt = `
    TASK: ANALYZE RESUME AGAINST TARGET JD/TRENDS.
    
    TARGET CONTEXT:
    ${jdText}

    RESUME CONTENT:
    ${resumeText}

    CRITICAL REQUIREMENTS:
    ${depthInstruction}
    
    1. Score Breakdown: Calculate ATS Match, Recruiter Appeal (Odds of survival), and Formatting (Professionalism) (0-100).
    2. Section Health: Audit Education, Projects, Experience, and Skills sections for weaknesses.
    3. Skill Proof: Cross-reference skills with project descriptions. Flag anything that looks like a keyword-stuffed lie.
    4. Top 1% Benchmark: How does this compare to elite tier candidates from IIT/MIT/Stanford? (Hint: It probably doesn't).
    5. Keyword Ledger: Categorize Found, Missing, and Weak (low density) keywords.
    
    Output a strict JSON object following the ResumeAnalysisResult schema. 
    IF deepAnalysis is true, the summary should be a scathing roast of their professional identity.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      scores: {
        type: Type.OBJECT,
        properties: {
          atsMatch: { type: Type.INTEGER },
          recruiterScore: { type: Type.INTEGER },
          formattingScore: { type: Type.INTEGER }
        }
      },
      sectionHealth: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.STRING },
            status: { type: Type.STRING },
            feedback: { type: Type.STRING }
          }
        }
      },
      skillProof: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING },
            isVerified: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          }
        }
      },
      benchmarking: {
        type: Type.OBJECT,
        properties: {
          comparison: { type: Type.STRING },
          gapToTop1Percent: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      keywords: {
        type: Type.OBJECT,
        properties: {
          found: { type: Type.ARRAY, items: { type: Type.STRING } },
          missing: { type: Type.ARRAY, items: { type: Type.STRING } },
          weak: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      phrasingAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
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
