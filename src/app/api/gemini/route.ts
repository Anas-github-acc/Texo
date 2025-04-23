import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const FASTAPI_URL = "http://127.0.0.1:8000";

export async function POST(req: Request) {
  try {
    const { prompt, documentId } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Valid prompt required" }, { status: 400 });
    }

    // If no documentId, use Gemini directly
    if (!documentId) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContentStream(prompt);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(JSON.stringify({ text }) + "\n"));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // If documentId is provided, query FastAPI /query endpoint
    const queryParams = new URLSearchParams({ query: prompt });
    const fastApiResponse = await fetch(`${FASTAPI_URL}/query?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json().catch(() => ({}));
      throw new Error(`FastAPI error: ${fastApiResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await fastApiResponse.json();
    
    // Create a stream with the single response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the complete response as a single chunk
          controller.enqueue(encoder.encode(JSON.stringify({ text: data.gemini_response }) + "\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
