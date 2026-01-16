import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider } from "./prepare-agentkit";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { tool } from "ai";
import { exec } from "child_process";
import { promisify } from "util";

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
      // Transaction history tool
      getTransactionHistory: tool({
        description: "Retrieve recent transaction history for the wallet",
        parameters: z.object({
          limit: z.number().optional().describe("Number of transactions to retrieve (default: 10)"),
        }),
        execute: async ({ limit = 10 }) => {
          return `Fetching last ${limit} transactions from wallet history. This includes swaps, transfers, and smart contract interactions.`;
        },
      }),
      // Market analysis tool
      analyzeMarket: tool({
        description: "Get market data and analysis for a specific token or pair",
        parameters: z.object({
          tokenSymbol: z.string().describe("The token symbol (e.g., ETH, USDC, BASE)"),
          period: z.enum(["1h", "24h", "7d", "30d"]).describe("Time period for analysis"),
        }),
        execute: async ({ tokenSymbol, period }) => {
          return `Market analysis for ${tokenSymbol} over ${period}: Current price, 24h volume, market cap, and ${period} performance metrics`;
        },
      }),
      // Portfolio tool
      getPortfolioSummary: tool({
        description: "Get a complete summary of the wallet's portfolio including all tokens and their values",
        parameters: z.object({}).strict(),
        execute: async () => {
          return `Portfolio Summary: Total portfolio value, token breakdown by count and percentage, NFT holdings, and estimated gains/losses`;
        },
      }),
      // Gas optimization tool
      estimateGasCost: tool({
        description: "Estimate gas costs for a transaction before execution",
        parameters: z.object({
          transactionType: z.string().describe("Type of transaction (swap, transfer, stake, etc.)"),
          amount: z.string().describe("Amount in the transaction"),
        }),
        execute: async ({ transactionType, amount }) => {
          return `Estimated gas cost for ${transactionType} of ${amount}: Standard, Fast, and Instant gas price options`;
        },
      }),
      // Liquidity tool
      checkLiquidity: tool({
        description: "Check available liquidity for a trading pair or token",
        parameters: z.object({
          tokenPair: z.string().describe("Token pair (e.g., ETH/USDC)"),
          amount: z.string().describe("Amount to check liquidity for"),
        }),
        execute: async ({ tokenPair, amount }) => {
          return `Checking liquidity for ${amount} on ${tokenPair} across all available DEXs. Price impact and slippage estimates included.`;
        },
      }),
      // Smart recommendations tool
      getSmartRecommendations: tool({
        description: "Get AI-powered recommendations for optimizing token holdings and yield farming opportunities",
        parameters: z.object({
          riskLevel: z.enum(["low", "medium", "high"]).describe("Your risk tolerance"),
        }),
        execute: async ({ riskLevel }) => {
          return `Smart recommendations based on ${riskLevel} risk tolerance: yield farming opportunities, staking options, and portfolio rebalancing suggestions`;
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
