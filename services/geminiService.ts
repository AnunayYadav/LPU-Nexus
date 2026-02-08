
import { Type } from "@google/genai";
import { ResumeAnalysisResult, DaySchedule, QuizQuestion } from "../types.ts";

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
 * Module: Quiz Taker
 */
export const generateQuizFromSyllabus = async (subjectName: string, syllabusText: string, units: number[]): Promise<QuizQuestion[]> => {
  const prompt = `
    CRITICAL INSTRUCTION: GENERATE AN MCQ QUIZ STRICTLY FOR THE SUBJECT: "${subjectName}".
    
    SOURCE MATERIAL (SYLLABUS):
    ---
    ${syllabusText.substring(0, 12000)}
    ---

    SCOPE: ONLY COVER TOPICS FROM UNIT(S): ${units.join(", ")}.

    STRICT GUIDELINES:
    1. SUBJECT LOCK: You are restricted to "${subjectName}". Do not include generic questions or topics from unrelated engineering/management subjects.
    2. TOPIC EXTRACTION: Scan the syllabus text for sections labeled "Unit ${units.join('", "Unit ')}" or similar numbering. Identify the technical keywords and concepts within these specific sections.
    3. QUESTION QUALITY: Generate exactly 10 high-level MCQs. Questions should test understanding, application, and theory of the topics found.
    4. DISTRACTORS: All 4 options must be plausible. No "none of the above" or "all of the above" unless absolutely necessary.
    5. EXPLANATION: Each explanation MUST reference why the answer is correct according to the principles of "${subjectName}".
    6. FALLBACK: If the provided text is too short or missing specific units, use your internal LPU curriculum knowledge for "${subjectName}" but anchor it heavily to any provided keywords.

    Output format: JSON array of objects.
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
        correctAnswer: { type: Type.INTEGER, description: "Index 0-3 of the correct option" },
        explanation: { type: Type.STRING }
      },
      required: ["question", "options", "correctAnswer", "explanation"]
    }
  };

  const data = await callGeminiProxy("GENERATE_QUIZ", { prompt, schema });
  return JSON.parse(data.text) as QuizQuestion[];
};

/**
 * Module: Placement Prefect
 */
export const analyzeResume = async (resumeText: string, jdText: string, deepAnalysis: boolean = false): Promise<ResumeAnalysisResult> => {
  const depthInstruction = deepAnalysis 
    ? "Act as a ruthless, hyper-critical technical recruiter. Point out exactly where the candidate is failing. Be scathing and exhaustive."
    : "Perform a professional resume audit against modern tech standards. Be detailed in every section.";

  const prompt = `
    TASK: GENERATE A SEMANTIC ATS DIAGNOSTIC REPORT AND FULL TEXT X-RAY.
    
    TARGET CONTEXT (JD/TRENDS): ${jdText}
    RESUME CONTENT: ${resumeText}

    CRITICAL REQUIREMENTS:
    ${depthInstruction}
    
    1. EXHAUSTIVE ANALYSIS: You MUST provide detailed feedback for ALL 6 categories: keywordAnalysis, jobFit, achievements, formatting, language, and branding.
    2. NO EMPTY SECTIONS: Every category's 'found' and 'missing' arrays MUST contain at least 2-4 specific, high-quality bullet points. Do not leave them empty.
    3. DETECT: "Keyword Stuffing", "No-Meaning List Dumping", and "Generic Buzzwords".
    4. VALIDATE: "Action Verb + Skill + Metric" integrity.
    
    CRITICAL X-RAY REQUIREMENT:
    The "annotatedContent" field MUST contain the FULL AND COMPLETE original resume text provided. 
    Do not skip, summarize, or omit any parts of the input text. 
    Break the entire input text into a sequence of fragments that, when joined, exactly match the original resume.
    
    Label each fragment:
    - 'good': Strong impact, relevant keywords, metrics, or professional verbs.
    - 'bad': Weak buzzwords, keyword stuffing, lack of context, or formatting issues.
    - 'neutral': Standard information (names, contact info, dates) or connective text.
    
    For every 'good' and 'bad' fragment, you MUST provide a 'reason' and a 'suggestion'.
    
    Output a JSON object matching this schema:
    {
      "totalScore": number,
      "meaningScore": number,
      "keywordQuality": { "contextual": number, "weak": number, "stuffed": number },
      "annotatedContent": [ { "text": string, "type": "good" | "bad" | "neutral", "reason": string, "suggestion": string } ],
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
      annotatedContent: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            type: { type: Type.STRING },
            reason: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          },
          required: ["text", "type"]
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
    required: ["totalScore", "meaningScore", "keywordQuality", "annotatedContent", "flags", "categories", "summary"]
  };

  const data = await callGeminiProxy("ANALYZE_RESUME", { prompt, schema, deep: deepAnalysis });
  const parsed = JSON.parse(data.text);
  
  // Robust normalization to prevent empty boxes in UI
  const normalizeCategory = (cat: any) => ({
    score: cat?.score ?? 0,
    description: cat?.description || 'Analytical module completed.',
    found: Array.isArray(cat?.found) && cat.found.length > 0 ? cat.found : ['Signal detected but requires more context.'],
    missing: Array.isArray(cat?.missing) && cat.missing.length > 0 ? cat.missing : ['No critical gaps detected in this segment.'],
    missingKeywordsExtended: cat?.missingKeywordsExtended || []
  });

  const categories = {
    keywordAnalysis: normalizeCategory(parsed.categories?.keywordAnalysis),
    jobFit: normalizeCategory(parsed.categories?.jobFit),
    achievements: normalizeCategory(parsed.categories?.achievements),
    formatting: normalizeCategory(parsed.categories?.formatting),
    language: normalizeCategory(parsed.categories?.language),
    branding: normalizeCategory(parsed.categories?.branding),
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
 * Module: LPU Pulse News
 */
export const fetchCampusNews = async (query: string) => {
  return await callGeminiProxy("CAMPUS_NEWS", {
    prompt: query,
    systemInstruction: `You are "LPU Pulse", a campus news scout for LPU Phagwara. Use Google Search to find 2025 events, placements, and notices.`
  });
};

/**
 * Module: Global Gateway
 */
export const searchGlobalOpportunities = async (query: string) => {
  return await callGeminiProxy("GLOBAL_SEARCH", {
    prompt: query,
    systemInstruction: `You are "Global Gateway", a study-abroad expert for LPU Phagwara. Use Google Search to find 2025 details on masters programs, visa rules, and scholarships for Indian students.`
  });
};
