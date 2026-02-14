
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
    return new Response(JSON.stringify({
      error: "Gateway configuration missing. The server is unable to process intelligence requests at this time."
    }), { status: 500 });
  }

  try {
    const { action, payload } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    let responseText = "";
    let groundingData = null;

    switch (action) {
      case "ANALYZE_RESUME": {
        const response = await ai.models.generateContent({
          model: payload.deep ? "gemini-1.5-pro" : "gemini-2.0-flash",
          contents: [{ role: 'user', parts: [{ text: payload.prompt.substring(0, 30000) }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: payload.schema,
            temperature: payload.deep ? 0.2 : 0.4,
          },
        });
        responseText = response.text || "";
        break;
      }

      case "GENERATE_QUIZ": {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: 'user', parts: [{ text: payload.prompt.substring(0, 30000) }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: payload.schema,
            temperature: 0.7,
          },
        });
        responseText = response.text || "";
        break;
      }

      case "EXTRACT_TIMETABLE": {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{
            role: 'user',
            parts: [
              { text: payload.prompt },
              { inlineData: { mimeType: "image/png", data: payload.imageData } }
            ]
          }],
          config: {
            responseMimeType: "application/json",
            responseSchema: payload.schema,
            temperature: 0.1,
          },
        });
        responseText = response.text || "";
        break;
      }


      default:
        return new Response(JSON.stringify({ error: "Invalid protocol action requested." }), { status: 400 });
    }

    return new Response(JSON.stringify({
      text: responseText,
      groundingChunks: groundingData
    }), { status: 200 });

  } catch (error: any) {
    console.error("Backend Gemini Error:", error);

    const errorMsg = error.message || "";

    // Detect Rate Limits (Quota)
    if (errorMsg.includes("429") || errorMsg.toLowerCase().includes("quota") || errorMsg.toLowerCase().includes("rate limit")) {
      return new Response(JSON.stringify({
        error: "System Cool-down Required: The AI is currently processing a high volume of requests. Please wait about 60 seconds and try again.",
        type: "RATE_LIMIT"
      }), { status: 429 });
    }

    // Detect Overload/Server Issues
    if (errorMsg.includes("500") || errorMsg.includes("503") || errorMsg.toLowerCase().includes("overloaded")) {
      return new Response(JSON.stringify({
        error: "Server Congestion: Nexus Intelligence servers are temporarily overloaded. Please try again in a few minutes.",
        type: "SERVER_OVERLOAD"
      }), { status: 503 });
    }

    return new Response(JSON.stringify({
      error: "Interface Error: A communication failure occurred between the client and the AI core. Ensure your connection is stable.",
      details: errorMsg
    }), { status: 500 });
  }
}
