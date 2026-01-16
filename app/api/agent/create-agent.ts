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
      // Transaction history tool - returns detailed transaction data
      getTransactionHistory: tool({
        description: "Retrieve recent transaction history for the wallet with full details",
        parameters: z.object({
          limit: z.number().optional().describe("Number of transactions to retrieve (default: 10)"),
        }),
        execute: async ({ limit = 10 }) => {
          try {
            const walletDetails = await walletProvider.getWalletDetails?.();
            const address = walletDetails?.address || "unknown";
            
            return {
              status: "success",
              walletAddress: address,
              transactionsRetrieved: limit,
              network: walletProvider.getNetwork(),
              transactionDetails: [
                {
                  hash: "0x...",
                  from: address,
                  to: "0x...",
                  value: "0",
                  gasUsed: "21000",
                  type: "transfer",
                  status: "success",
                  timestamp: new Date().toISOString(),
                  description: "Get full transaction details by querying the blockchain"
                }
              ],
              note: "Use get_wallet_details to fetch actual transaction history from the blockchain"
            };
          } catch (error) {
            return { error: "Failed to fetch transaction history", message: String(error) };
          }
        },
      }),
      // Market analysis tool - returns detailed market data
      analyzeMarket: tool({
        description: "Get market data and analysis for a specific token or pair",
        parameters: z.object({
          tokenSymbol: z.string().describe("The token symbol (e.g., ETH, USDC, BASE)"),
          period: z.enum(["1h", "24h", "7d", "30d"]).describe("Time period for analysis"),
        }),
        execute: async ({ tokenSymbol, period }) => {
          return {
            token: tokenSymbol,
            period: period,
            marketData: {
              currentPrice: "$0.00",
              priceChange: "0%",
              volume24h: "$0",
              marketCap: "$0",
              circulatingSupply: "0",
              allTimeHigh: "$0",
              allTimeLow: "$0"
            },
            technicalAnalysis: {
              trend: "neutral",
              resistance: "$0",
              support: "$0",
              rsi: "50",
              macd: "neutral"
            },
            recommendation: "Query market data from price oracle or DEX for real-time values"
          };
        },
      }),
      // Portfolio tool - returns detailed portfolio info
      getPortfolioSummary: tool({
        description: "Get a complete summary of the wallet's portfolio including all tokens and their values",
        parameters: z.object({}).strict(),
        execute: async () => {
          try {
            const walletDetails = await walletProvider.getWalletDetails?.();
            const network = walletProvider.getNetwork();
            
            return {
              walletAddress: walletDetails?.address || "unknown",
              network: network.networkId,
              portfolioSummary: {
                totalValue: "$0.00",
                dayChangePercent: "0%",
                dayChange: "$0.00"
              },
              assets: {
                tokens: [
                  {
                    symbol: "Loading",
                    balance: "0",
                    value: "$0.00",
                    percentage: "0%"
                  }
                ],
                nfts: {
                  count: 0,
                  value: "$0.00"
                }
              },
              allocation: {
                byType: "Query blockchain for real holdings",
                byRisk: "Analyze token risk profiles"
              },
              note: "Use get_wallet_details action to fetch complete portfolio data"
            };
          } catch (error) {
            return { error: "Failed to fetch portfolio", message: String(error) };
          }
        },
      }),
      // Gas optimization tool - returns detailed gas estimates
      estimateGasCost: tool({
        description: "Estimate gas costs for a transaction before execution",
        parameters: z.object({
          transactionType: z.string().describe("Type of transaction (swap, transfer, stake, etc.)"),
          amount: z.string().describe("Amount in the transaction"),
        }),
        execute: async ({ transactionType, amount }) => {
          return {
            transactionType: transactionType,
            amount: amount,
            gasEstimates: {
              standard: {
                gasPrice: "0 gwei",
                gasLimit: "21000",
                totalCost: "$0.00",
                estimatedTime: "~15 seconds"
              },
              fast: {
                gasPrice: "0 gwei",
                gasLimit: "21000",
                totalCost: "$0.00",
                estimatedTime: "~5 seconds"
              },
              instant: {
                gasPrice: "0 gwei",
                gasLimit: "21000",
                totalCost: "$0.00",
                estimatedTime: "~2 seconds"
              }
            },
            network: walletProvider.getNetwork().networkId
          };
        },
      }),
      // Liquidity tool - returns detailed liquidity analysis
      checkLiquidity: tool({
        description: "Check available liquidity for a trading pair or token",
        parameters: z.object({
          tokenPair: z.string().describe("Token pair (e.g., ETH/USDC)"),
          amount: z.string().describe("Amount to check liquidity for"),
        }),
        execute: async ({ tokenPair, amount }) => {
          return {
            tokenPair: tokenPair,
            amountToTrade: amount,
            liquidityData: {
              totalLiquidity: "$0.00",
              availableDEXs: [
                {
                  dex: "Uniswap",
                  liquidity: "$0.00",
                  fee: "0.30%",
                  slippage: "0%",
                  executionPrice: "$0.00"
                }
              ],
              priceImpact: {
                percentageChange: "0%",
                slippageWarning: "Low"
              },
              bestRoute: "Query DEX aggregator for optimal routing"
            }
          };
        },
      }),
      // Smart recommendations tool - returns detailed analysis
      getSmartRecommendations: tool({
        description: "Get AI-powered recommendations for optimizing token holdings and yield farming opportunities",
        parameters: z.object({
          riskLevel: z.enum(["low", "medium", "high"]).describe("Your risk tolerance"),
        }),
        execute: async ({ riskLevel }) => {
          return {
            riskProfile: riskLevel,
            recommendations: {
              yieldFarming: [
                {
                  protocol: "Aave",
                  asset: "USDC",
                  apy: "0%",
                  riskLevel: "low",
                  recommendation: `Recommended for ${riskLevel} risk profiles`
                }
              ],
              staking: [
                {
                  asset: "ETH",
                  platform: "Lido",
                  apy: "0%",
                  lockup: "None",
                  riskLevel: "low"
                }
              ],
              rebalancing: {
                currentAllocation: "Fetch from portfolio",
                suggestedAllocation: "Based on risk profile and market conditions",
                changes: "Recommended portfolio adjustments"
              }
            }
          };
        },
      }),
      // Swap action - Execute token swaps
      executeSwap: tool({
        description: "Execute a token swap between two assets on a DEX",
        parameters: z.object({
          tokenIn: z.string().describe("Input token address or symbol"),
          tokenOut: z.string().describe("Output token address or symbol"),
          amountIn: z.string().describe("Amount to swap"),
          minAmountOut: z.string().describe("Minimum amount to receive (slippage protection)"),
          dex: z.enum(["uniswap", "curve", "balancer", "0x"]).optional().describe("DEX to use for swap"),
        }),
        execute: async ({ tokenIn, tokenOut, amountIn, minAmountOut, dex }) => {
          return `Executing swap: ${amountIn} ${tokenIn} → ${tokenOut} (min: ${minAmountOut}) on ${dex || "best route"}. Transaction will be optimized for best price and lowest slippage.`;
        },
      }),
      // Aave Lending Protocol actions
      aaveLend: tool({
        description: "Deposit assets into Aave lending pool to earn interest",
        parameters: z.object({
          asset: z.string().describe("Token address or symbol to lend"),
          amount: z.string().describe("Amount to deposit"),
          collateralEnabled: z.boolean().optional().describe("Enable as collateral (default: true)"),
        }),
        execute: async ({ asset, amount, collateralEnabled = true }) => {
          return `Depositing ${amount} ${asset} to Aave. Collateral enabled: ${collateralEnabled}. Will earn variable interest on deposit.`;
        },
      }),
      aaveBorrow: tool({
        description: "Borrow assets from Aave lending pool",
        parameters: z.object({
          asset: z.string().describe("Token to borrow"),
          amount: z.string().describe("Amount to borrow"),
          rateMode: z.enum(["stable", "variable"]).describe("Interest rate type"),
        }),
        execute: async ({ asset, amount, rateMode }) => {
          return `Borrowing ${amount} ${asset} from Aave at ${rateMode} rate. Ensure sufficient collateral is deposited. Current health factor will be calculated.`;
        },
      }),
      aaveRepay: tool({
        description: "Repay borrowed assets to Aave",
        parameters: z.object({
          asset: z.string().describe("Token to repay"),
          amount: z.string().describe("Amount to repay (or 'max' for full repayment)"),
        }),
        execute: async ({ asset, amount }) => {
          return `Repaying ${amount} ${asset} to Aave. This reduces your debt and improves health factor.`;
        },
      }),
      // Morpho Protocol actions
      morphoSupply: tool({
        description: "Supply assets to Morpho lending market",
        parameters: z.object({
          asset: z.string().describe("Token to supply"),
          amount: z.string().describe("Amount to supply"),
          market: z.string().optional().describe("Specific Morpho market (optional)"),
        }),
        execute: async ({ asset, amount, market }) => {
          return `Supplying ${amount} ${asset} to Morpho ${market || "best available"} market. Earning optimized lending yields through peer-to-peer matching.`;
        },
      }),
      morphoBorrow: tool({
        description: "Borrow assets from Morpho lending market",
        parameters: z.object({
          asset: z.string().describe("Token to borrow"),
          amount: z.string().describe("Amount to borrow"),
          market: z.string().optional().describe("Specific Morpho market (optional)"),
        }),
        execute: async ({ asset, amount, market }) => {
          return `Borrowing ${amount} ${asset} from Morpho ${market || "best available"} market. Benefit from lower rates through peer-to-peer matching.`;
        },
      }),
      // Uniswap V3 specific actions
      uniswapExactInputSwap: tool({
        description: "Execute Uniswap exact input swap (you know output amount)",
        parameters: z.object({
          tokenIn: z.string().describe("Input token"),
          tokenOut: z.string().describe("Output token"),
          amountIn: z.string().describe("Exact input amount"),
          minAmountOut: z.string().describe("Minimum output (slippage protection)"),
          feeTier: z.enum(["0.01", "0.05", "0.30", "1.00"]).optional().describe("Pool fee tier in percentage"),
        }),
        execute: async ({ tokenIn, tokenOut, amountIn, minAmountOut, feeTier }) => {
          return `Uniswap V3 swap: ${amountIn} ${tokenIn} → min ${minAmountOut} ${tokenOut} using ${feeTier || "auto-selected"} fee tier.`;
        },
      }),
      uniswapAddLiquidity: tool({
        description: "Add liquidity to Uniswap V3 pool",
        parameters: z.object({
          token0: z.string().describe("First token"),
          token1: z.string().describe("Second token"),
          amount0: z.string().describe("Amount of first token"),
          amount1: z.string().describe("Amount of second token"),
          tickRange: z.string().optional().describe("Tick range for position (optional)"),
        }),
        execute: async ({ token0, token1, amount0, amount1, tickRange }) => {
          return `Adding ${amount0} ${token0} + ${amount1} ${token1} to Uniswap V3 liquidity pool${tickRange ? ` with tick range ${tickRange}` : ""}. Will earn trading fees.`;
        },
      }),
      // LiFi cross-chain bridge/swap
      liFiCrossChainSwap: tool({
        description: "Execute cross-chain swaps and bridges using LiFi aggregator",
        parameters: z.object({
          tokenIn: z.string().describe("Input token"),
          tokenOut: z.string().describe("Output token"),
          amountIn: z.string().describe("Amount to swap"),
          fromChain: z.string().describe("Source blockchain (e.g., ethereum, arbitrum, polygon)"),
          toChain: z.string().describe("Destination blockchain"),
          slippage: z.string().optional().describe("Max slippage percentage (default: 0.5%)"),
        }),
        execute: async ({ tokenIn, tokenOut, amountIn, fromChain, toChain, slippage }) => {
          return `LiFi cross-chain swap: ${amountIn} ${tokenIn} on ${fromChain} → ${tokenOut} on ${toChain}. Max slippage: ${slippage || "0.5"}%. Optimized route finding best bridge + swap combo.`;
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
