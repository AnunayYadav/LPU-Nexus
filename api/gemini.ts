
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API Key not configured on server." }), { status: 500 });
  }

  try {
    const { action, payload } = await req.json();
    const ai = new GoogleGenAI({ apiKey });
    
    // Determine model based on complexity
    let modelId = "gemini-3-flash-preview";
    if (action === "ANALYZE_RESUME" && payload.deep) {
        modelId = "gemini-3-pro-preview"; // Use Pro for deep scrutiny
    }

    switch (action) {
      case "ANALYZE_RESUME": {
        const response = await ai.models.generateContent({
          model: modelId,
          contents: payload.prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: payload.schema,
            temperature: payload.deep ? 0.2 : 0.4,
          },
        });
        return new Response(JSON.stringify({ text: response.text }), { status: 200 });
      }

      case "EXTRACT_TIMETABLE": {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            { text: payload.prompt },
            { inlineData: { mimeType: "image/png", data: payload.imageData } }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: payload.schema,
            temperature: 0.1,
          },
        });
        return new Response(JSON.stringify({ text: response.text }), { status: 200 });
      }

      case "GLOBAL_GATEWAY": {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: payload.prompt,
          config: {
            systemInstruction: payload.systemInstruction,
            tools: [{ googleSearch: {} }],
            temperature: 0.2,
          },
        });
        return new Response(JSON.stringify({
          text: response.text,
          groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        }), { status: 200 });
      }

      case "CAMPUS_NEWS": {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: payload.prompt,
          config: {
            systemInstruction: payload.systemInstruction,
            tools: [{ googleSearch: {} }],
            temperature: 0.2,
          },
        });
        return new Response(JSON.stringify({
          text: response.text,
          groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        }), { status: 200 });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }
  } catch (error: any) {
    console.error("Backend Gemini Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}
