import { AgentRequest, AgentResponse } from "@/app/types/api";
import { NextResponse } from "next/server";
import { createAgent } from "./create-agent";
import { Message, generateId, generateText, LanguageModel, Tool } from "ai";

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
      execute: async (input: any) => {
        const result = await tool.execute(input);

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
    // 1️. Extract user message from the request body
    const { userMessage } = await req.json();

    // 2. Get the agent
    let agent = await createAgent();

    // 3. Wrap tools to convert string responses to JSON objects
    agent = {
      ...agent,
      tools: wrapToolsForJsonResponse(agent.tools),
    };

    // 4. Start streaming the agent's response
    messages.push({ id: generateId(), role: "user", content: userMessage });
    const { text } = await generateText({
      ...agent,
      messages,
    });

    // 5. Add the agent's response to the messages
    messages.push({ id: generateId(), role: "assistant", content: text });

    // 6. Return the final response
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      error:
        error instanceof Error
          ? error.message
          : "I'm sorry, I encountered an issue processing your message. Please try again later.",
    });
  }
}
