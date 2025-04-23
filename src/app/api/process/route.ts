import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function POST(req: Request) {
  try {

    // Check FastAPI health
    try {
      const healthCheck = await axios.get(`${API_BASE_URL}/health`, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 5000
      });

      if (healthCheck.status !== 200) {
        throw new Error("FastAPI server is not healthy");
      }
    } catch (error) {
      console.error("FastAPI health check failed:", error);
      return NextResponse.json(
        { error: "FastAPI server is not reachable" }, 
        { status: 503 }
      );
    }

    // Process the actual request
    const { documentId, content } = await req.json();
    console.log("Document ID:", documentId);

    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json({ error: "Valid documentId required" }, { status: 400 });
    }

    const fastApiResponse = await fetch(`${API_BASE_URL}/process/${documentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content })
    });

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json().catch(() => ({}));
      throw new Error(`FastAPI error: ${fastApiResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await fastApiResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Process API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: "Failed to process document",
      details: errorMessage 
    }, { status: 500 });
  }
}
