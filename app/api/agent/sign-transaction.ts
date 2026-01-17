import { NextResponse } from "next/server";
import { createAgent } from "./create-agent";
import { Message, generateId, generateText } from "ai";

/**
 * Transaction Signing Request
 */
export interface SignTransactionRequest {
  // Transaction details
  to: string; // recipient address
  value?: string; // amount in wei
  data?: string; // encoded function call
  type?: "transfer" | "swap" | "contract_call" | "custom";
  description?: string; // human-readable description of what this transaction does
  userWalletAddress?: string; // user's wallet address for context
  userMessage?: string; // original user request that prompted this transaction
}

/**
 * Transaction Signing Response
 */
export interface SignTransactionResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
  details?: {
    from: string;
    to: string;
    value?: string;
    data?: string;
    gasUsed?: string;
    blockNumber?: string;
    status?: string;
  };
  message?: string;
}

/**
 * Server-side transaction signing endpoint
 * 
 * Uses the agent's CDP wallet provider to sign and execute transactions
 * Receives transaction details from the client (Mini App) and processes them securely on the server
 */
export async function POST(
  req: Request & { json: () => Promise<SignTransactionRequest> },
): Promise<NextResponse<SignTransactionResponse>> {
  try {
    // Extract transaction details from request
    let body: SignTransactionRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format. Please send a valid JSON object with transaction details.",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.to || !body.to.startsWith("0x")) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or invalid 'to' address. Must be a valid Ethereum address.",
        },
        { status: 400 }
      );
    }

    console.log(`[Transaction Signing] Processing ${body.type || "custom"} transaction`);
    console.log(`[Transaction Signing] To: ${body.to}`);
    if (body.userWalletAddress) {
      console.log(`[Transaction Signing] User: ${body.userWalletAddress}`);
    }

    // Get or create the agent
    const agent = await createAgent();

    // Create a prompt that instructs the agent to execute the transaction
    const transactionPrompt = `
You need to execute a blockchain transaction with the following details:
- Type: ${body.type || "custom"}
- Recipient: ${body.to}
${body.value ? `- Amount: ${body.value} wei` : ""}
${body.description ? `- Description: ${body.description}` : ""}
${body.userMessage ? `- Original request: ${body.userMessage}` : ""}

Please execute this transaction using the available tools. First, get your wallet details to confirm you have funds, then execute the transaction.
${body.data ? `Use this data for the transaction: ${body.data}` : ""}
`;

    // Use the agent to execute the transaction
    const messages: Message[] = [];
    messages.push({ id: generateId(), role: "user", content: transactionPrompt });

    try {
      const { text: response } = await generateText({
        ...agent,
        messages,
      });

      console.log(`[Transaction Signing] Agent response: ${response}`);

      // Parse the response to extract transaction results
      // Look for transaction hash in the response
      const txHashMatch = response.match(/0x[a-fA-F0-9]{64}/);
      const txHash = txHashMatch ? txHashMatch[0] : undefined;

      if (response.toLowerCase().includes("success") || response.toLowerCase().includes("completed") || txHash) {
        return NextResponse.json({
          success: true,
          transactionHash: txHash,
          message: response,
          details: {
            from: "agent-wallet",
            to: body.to,
            value: body.value,
            data: body.data,
          },
        });
      } else if (response.toLowerCase().includes("error") || response.toLowerCase().includes("failed")) {
        return NextResponse.json(
          {
            success: false,
            error: response,
          },
          { status: 400 }
        );
      } else {
        // Return whatever response we got
        return NextResponse.json({
          success: true,
          message: response,
          details: {
            from: "agent-wallet",
            to: body.to,
            value: body.value,
            data: body.data,
          },
        });
      }
    } catch (agentError) {
      console.error("Agent execution error:", agentError);
      return NextResponse.json(
        {
          success: false,
          error: `Agent failed to execute transaction: ${agentError instanceof Error ? agentError.message : "Unknown error"}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Transaction signing error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to sign transaction",
      },
      { status: 500 }
    );
  }
}
