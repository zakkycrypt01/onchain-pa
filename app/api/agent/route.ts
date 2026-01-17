import { AgentRequest, AgentResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { createAgent } from "./create-agent";
import { Message, generateId, generateText, LanguageModel, Tool, ToolExecutionOptions } from "ai";

const messages: Message[] = [];

/**
 * Wraps tools to convert string results to JSON objects for Google API compatibility
 */
function wrapToolsForJsonResponse(
  tools: Record<string, Tool<any, any>>,
): Record<string, Tool<any, any>> {
  const wrappedTools: Record<string, Tool<any, any>> = {};

  for (const [toolName, tool] of Object.entries(tools)) {
    wrappedTools[toolName] = {
      ...tool,
      execute: tool.execute ? async (input: any, options?: ToolExecutionOptions) => {
        const result = await tool.execute!(input, options);

        // Convert string results to JSON objects
        if (typeof result === "string") {
          // Try to parse as JSON first
          try {
            return JSON.parse(result);
          } catch {
            // If it's a formatted string (like wallet details), convert it to an object
            if (
              result.includes("Wallet Details") ||
              result.includes("Address") ||
              result.includes("Provider:")
            ) {
              const obj: Record<string, unknown> = {};

              // Parse formatted output into structured object
              const lines = result.split("\n");
              let currentSection = "root";
              const sections: Record<string, Record<string, unknown>> = {
                root: obj,
              };

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                // Check if this is a subsection header (e.g., "Network:")
                if (trimmed.endsWith(":") && !trimmed.startsWith("-")) {
                  currentSection = trimmed.slice(0, -1).toLowerCase();
                  sections[currentSection] = {};
                  obj[currentSection] = sections[currentSection];
                  continue;
                }

                // Parse key-value pairs
                const match = trimmed.match(/^[\*\-]\s*(.+?):\s*(.+)$/);
                if (match) {
                  const [, key, value] = match;
                  const cleanKey = key
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^\w_]/g, "");
                  sections[currentSection][cleanKey] = value.trim();
                }
              }

              return Object.keys(obj).length > 0 ? obj : { result };
            }

            // Fallback: return as simple text object
            return { result };
          }
        }

        return result;
      },
    };
  }

  return wrappedTools;
}

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
    let agent = await createAgent();

    // 3. Wrap tools to convert string responses to JSON objects
    agent = {
      ...agent,
      tools: wrapToolsForJsonResponse(agent.tools),
    };

    // 4. Start streaming the agent's response
    messages.push({ id: generateId(), role: "user", content: userMessage });
    
    try {
      const { text } = await generateText({
        ...agent,
        messages,
      });

      // 5. Add the agent's response to the messages
      messages.push({ id: generateId(), role: "assistant", content: text });

      // 6. Return the final response
      return NextResponse.json({ response: text });
    } catch (generateError) {
      // If we get a rate limit error and have a fallback key, log it for monitoring
      if (
        generateError instanceof Error &&
        (generateError.message.includes("quota") || generateError.message.includes("429"))
      ) {
        console.warn(
          "Primary API key rate limited. Fallback key would be used on retry.",
          generateError.message
        );
        throw generateError; // Will be caught by outer catch block
      }
      throw generateError;
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      // Rate limit or quota errors
      if (errorMsg.includes("quota") || errorMsg.includes("429") || errorMsg.includes("rate_limit")) {
        const hasFallback = process.env.GOOGLE_GENERATIVE_AI_API_KEY_FALLBACK ? " (Fallback key available)" : " (No fallback configured)";
        console.warn(`Rate limit hit:${hasFallback}`);
        return NextResponse.json(
          {
            error: "API rate limit exceeded. Please wait a moment and try again.",
            details: error.message,
          },
          { status: 429 }
        );
      }
      
      // Network/connection errors
      if (errorMsg.includes("econnrefused") || errorMsg.includes("network")) {
        return NextResponse.json(
          {
            error: "Connection error. Please check your internet connection and try again.",
          },
          { status: 503 }
        );
      }
      
      // API key errors
      if (errorMsg.includes("api key") || errorMsg.includes("unauthorized")) {
        return NextResponse.json(
          {
            error: "API authentication failed. Please verify your API keys are configured correctly.",
          },
          { status: 401 }
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
