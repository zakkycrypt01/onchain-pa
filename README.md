# Onchain Agent Powered by AgentKit

This is a [Next.js](https://nextjs.org) project bootstrapped with `create-onchain-agent`.  

It integrates [AgentKit](https://github.com/coinbase/agentkit) with [Google Generative AI](https://ai.google.dev/) to provide intelligent AI-driven interactions with on-chain capabilities using the Gemini 2.5 Flash model.

## Features

- **AI-Powered Agent**: Uses Google's Gemini 2.5 Flash LLM for intelligent decision-making
- **On-Chain Capabilities**: Interact with blockchain networks via AgentKit
- **Smart Wallet Management**: Integrated CDP Smart Wallet support
- **Real-Time Chat Interface**: Interactive web UI for agent communication
- **Function Response Serialization**: Handles proper JSON serialization of tool responses for LLM compatibility

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Generative AI API key ([Get one here](https://ai.google.dev/))
- Coinbase Developer Platform (CDP) credentials

### Installation

1. Install dependencies:

```sh
npm install
```

2. Configure your environment variables by copying the template:

```sh
cp .env.local .env.local
```

3. Add your credentials to `.env.local`:

```env
# Required: Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# Optional: Fallback API key for rate limit resilience (recommended for production)
GOOGLE_GENERATIVE_AI_API_KEY_FALLBACK=your_fallback_api_key_here

# Required: Coinbase Developer Platform
CDP_API_KEY_ID=your_key_id
CDP_API_KEY_SECRET=your_key_secret
CDP_WALLET_SECRET=your_wallet_secret

# Optional: Network configuration
NETWORK_ID=base-sepolia
```

> **Production Tip**: Configure `GOOGLE_GENERATIVE_AI_API_KEY_FALLBACK` to handle API rate limits gracefully. When the primary key hits quota limits, the system logs warnings and provides better error messages to users.

4. Run the development server:

```sh
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── api/agent/
│   ├── route.ts              # Main API endpoint for agent interactions
│   ├── create-agent.ts       # Agent initialization and LLM configuration
│   └── prepare-agentkit.ts   # AgentKit and wallet provider setup
├── hooks/
│   └── useAgent.ts           # React hook for agent communication
├── types/
│   └── api.ts                # TypeScript type definitions
└── page.tsx                  # Main chat interface
```

## Configuring Your Agent

You can customize your agent's behavior and capabilities:

### 1. Modify the LLM Model  
Edit `/api/agent/create-agent.ts` to use a different Google Generative AI model or adjust model parameters like temperature and max tokens.

### 2. Configure the Wallet Provider  
Edit `/api/agent/prepare-agentkit.ts` to change the blockchain network, wallet type, or network settings.

### 3. Add or Remove Action Providers  
The agent comes with the following action providers enabled:
- `walletActionProvider()` - Basic wallet operations
- `wethActionProvider()` - WETH token interactions
- `erc20ActionProvider()` - ERC-20 token operations
- `cdpApiActionProvider()` - CDP API actions
- `cdpSmartWalletActionProvider()` - Smart wallet operations
- `pythActionProvider()` - Python oracle data
- `x402ActionProvider()` - Payment operations

You can modify these in the `AgentKit.from()` configuration.

## Technical Implementation

### Tool Response Handling

This project includes a custom wrapper for agent tools that ensures all responses are properly serialized as JSON objects before being sent to the Google Generative AI API. This prevents validation errors when tools return formatted string responses.

The wrapper automatically:
- Converts formatted string responses to structured JSON objects
- Parses nested sections (like wallet network details) into proper object hierarchies
- Provides fallback handling for unparseable responses

See `/api/agent/route.ts` for the implementation.

## Troubleshooting

### "Google Generative AI API key is missing"
Make sure `GOOGLE_GENERATIVE_AI_API_KEY` is set in your `.env.local` file and the development server has been restarted.

### "CDP credentials are missing"
Ensure all three CDP credentials are configured:
- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`

### "bigint: Failed to load bindings"
This is a warning about native module compilation. It's not critical - the application will fall back to pure JavaScript. You can try running `npm run rebuild` to compile native modules for your environment.

## Production Deployment

Before deploying to production:

1. Build the project:
```sh
npm run build
```

2. Start the production server:
```sh
npm start
```

3. Ensure all environment variables are properly set in your production environment
4. Use environment-specific secrets management for sensitive credentials

## Next Steps

- Explore the [AgentKit Documentation](https://github.com/coinbase/agentkit)
- Review [Google Generative AI API docs](https://ai.google.dev/docs)
- Learn more about [Coinbase Developer Platform](https://docs.cdp.coinbase.com/)
- Customize the chat UI in `/app/page.tsx`

## Learn More

- [AgentKit GitHub](https://github.com/coinbase/agentkit)
- [Google Generative AI](https://ai.google.dev/)
- [Coinbase Developer Platform](https://docs.cdp.coinbase.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

Interested in contributing to AgentKit? Follow the contribution guide:

- [AgentKit Contribution Guide](https://github.com/coinbase/agentkit/blob/main/CONTRIBUTING.md)
- Join the discussion on [Discord](https://discord.gg/CDP)

## License

This project is part of the AgentKit ecosystem. See the [AgentKit repository](https://github.com/coinbase/agentkit) for license information.
