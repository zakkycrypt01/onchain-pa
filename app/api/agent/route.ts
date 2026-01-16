import { AgentRequest, AgentResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { createAgent } from "./create-agent";
import { Message, generateId, generateText, LanguageModel } from "ai";

const messages: Message[] = [];

export async function POST(
  req: Request & { json: () => Promise<AgentRequest> },
): Promise<NextResponse<AgentResponse>> {
  try {
    // 1️. Extract user message from the request body with proper validation
    let body: AgentRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          error: "Invalid request format. Please send a valid JSON object with 'userMessage' field.",
        },
        { status: 400 }
      );
    }

    // Validate userMessage exists and is not empty
    const { userMessage } = body;
    if (!userMessage || typeof userMessage !== "string" || userMessage.trim() === "") {
      return NextResponse.json(
        {
          error: "Missing or empty 'userMessage' field. Please provide a message.",
        },
        { status: 400 }
      );
    }

    // 2. Get the agent
    const agent = await createAgent();

    // 3. Start streaming the agent's response
    messages.push({ id: generateId(), role: "user", content: userMessage });
    const { text } = await generateText({
      ...agent,
      messages,
    });

    // 4. Add the agent's response to the messages
    messages.push({ id: generateId(), role: "assistant", content: text });

    // 5. Return the final response
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Rate limit or quota errors
      if (error.message.includes("quota") || error.message.includes("429")) {
        return NextResponse.json(
          {
            error: "API rate limit exceeded. Please wait a moment and try again.",
            details: error.message,
          },
          { status: 429 }
        );
      }
      
      // Network/connection errors
      if (error.message.includes("ECONNREFUSED") || error.message.includes("network")) {
        return NextResponse.json(
          {
            error: "Connection error. Please check your internet connection and try again.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "I'm sorry, I encountered an issue processing your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
