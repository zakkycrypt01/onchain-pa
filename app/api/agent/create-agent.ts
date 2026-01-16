import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider } from "./prepare-agentkit";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { tool } from "ai";
import { exec } from "child_process";
import { promisify } from "util";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

// import type { LanguageModelV1, LanguageModelV1 as LanguageModel } from "ai";
const execAsync = promisify(exec);


/**
 * Agent Configuration Guide
 *
 * This file handles the core configuration of your AI agent's behavior and capabilities.
 *
 * Key Steps to Customize Your Agent:
 *
 * 1. Select your LLM:
 *    - Modify the `openai` instantiation to choose your preferred LLM
 *    - Configure model parameters like temperature and max tokens
 *
 * 2. Instantiate your Agent:
 *    - Pass the LLM, tools, and memory into `createReactAgent()`
 *    - Configure agent-specific parameters
 */

// The agent
type Agent = {
  tools: any;
  system: string;
  model: ReturnType<typeof google>;  // Use the actual model type
  maxSteps?: number;
};
let agent: Agent;

/**
 * Initializes and returns an instance of the AI agent.
 * If an agent instance already exists, it returns the existing one.
 *
 * @function getOrInitializeAgent
 * @returns {Promise<ReturnType<typeof createReactAgent>>} The initialized AI agent.
 *
 * @description Handles agent setup
 *
 * @throws {Error} If the agent initialization fails.
 */
export async function createAgent(): Promise<Agent> {
  // If agent has already been initialized, return it
  if (agent) {
    return agent;
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("I need a GOOGLE_GENERATIVE_AI_API_KEY in your .env file...");
  }

  const { agentkit, walletProvider } = await prepareAgentkitAndWalletProvider();

  try {
    // Initialize LLM: https://platform.openai.com/docs/models#gpt-4o
  const model = google("gemini-2.5-flash");

    // Initialize Agent
    const canUseFaucet = walletProvider.getNetwork().networkId == "base-sepolia";
    const faucetMessage = `If you ever need funds, you can request them from the faucet.`;
    const cantUseFaucetMessage = `If you need funds, you can provide your wallet details and request funds from the user.`;
    const system = `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. ${canUseFaucet ? faucetMessage : cantUseFaucetMessage}.
        Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, you must say so, and 
        explain that they can add more capabilities by adding more action providers to your AgentKit configuration.
        ALWAYS include this link when mentioning missing capabilities, which will help them discover available action providers: https://github.com/coinbase/agentkit/tree/main/typescript/agentkit#action-providers
        If users require more information regarding CDP or AgentKit, recommend they visit docs.cdp.coinbase.com for more information.
        Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
        `;
    const agentKitTools = getVercelAITools(agentkit);
    const tools = {
      ...agentKitTools,
      runTerminalCommand: tool({
        description: "Execute a command in the terminal",
        parameters: z.object({
          command: z.string().describe("The command to execute"),
        }),
        execute: async ({ command }) => {
          try {
            const { stdout, stderr } = await execAsync(command);
            return stdout || stderr;
          } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return `Error executing command: ${(error as any).message}`;
          }
        },
      }),
      listTransactionHistory: tool({
        description: "List all transaction history for the wallet",
        parameters: z.object({
          limit: z.number().optional().describe("Maximum number of transactions to return (default: 10)"),
        }),
        execute: async ({ limit = 10 }) => {
          try {
            const walletAddress = walletProvider.getAddress();
            const network = walletProvider.getNetwork();
            
            // Create a public client to query the blockchain
            const publicClient = createPublicClient({
              chain: baseSepolia,
              transport: http(process.env.RPC_URL || "https://sepolia.base.org"),
            });

            // Get the current block number
            const blockNumber = await publicClient.getBlockNumber();
            
            // Search for transactions in recent blocks (last 1000 blocks)
            const searchFromBlock = blockNumber > 1000n ? blockNumber - 1000n : 0n;
            
            // Create a filter for transactions to/from the wallet
            const logs = await publicClient.getLogs({
              fromBlock: searchFromBlock,
              toBlock: blockNumber,
              address: walletAddress as `0x${string}`,
            });

            // Get block details and transaction details
            const transactions: any[] = [];
            const seenTxHashes = new Set<string>();

            for (let i = 0; i < Math.min(limit, logs.length); i++) {
              const log = logs[i];
              if (!seenTxHashes.has(log.transactionHash || "")) {
                try {
                  const tx = await publicClient.getTransaction({
                    hash: log.transactionHash as `0x${string}`,
                  });
                  
                  const receipt = await publicClient.getTransactionReceipt({
                    hash: log.transactionHash as `0x${string}`,
                  });

                  transactions.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value.toString(),
                    gasUsed: receipt?.gasUsed?.toString() || "0",
                    gasPrice: tx.gasPrice?.toString() || "0",
                    status: receipt?.status === "success" ? "confirmed" : "failed",
                    blockNumber: tx.blockNumber?.toString() || "0",
                    type: tx.type,
                  });
                  seenTxHashes.add(log.transactionHash || "");
                } catch (e) {
                  // Skip transactions we can't fetch details for
                  continue;
                }
              }
            }

            return {
              success: true,
              walletAddress,
              networkId: network.networkId,
              currentBlock: blockNumber.toString(),
              searchFromBlock: searchFromBlock.toString(),
              transactionCount: transactions.length,
              limit,
              transactions: transactions.slice(0, limit),
            };
          } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return `Error fetching transaction history: ${(error as any).message}`;
          }
        },
      }),
    };

    agent = {
      tools,
      system,
      model,
      maxSteps: 10,
    };

    return agent;
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw new Error("Failed to initialize agent");
  }
}
