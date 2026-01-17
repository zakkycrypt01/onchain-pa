# Server-Side Transaction Signing Architecture

## Overview

This document outlines how server-side transaction signing works in the Onchain PA Mini App.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Client (Browser / Mini App)                                     │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ TerminalUI Component                                        │ │
│ │  1. User enters command (e.g., "send 1 ETH to 0x...")      │ │
│ │  2. handleCommand() calls /api/agent                        │ │
│ │  3. Receives agent response                                 │ │
│ │  4. Detects transaction pattern in response                 │ │
│ │  5. Calls useTransactionSigning hook                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ useTransactionSigning Hook                                  │ │
│ │  - Formats transaction data                                 │ │
│ │  - Calls /api/agent/sign-transaction endpoint              │ │
│ │  - Handles response with tx hash                            │ │
│ │  - Provides callbacks for success/error                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ useFarcasterUser Hook                                       │ │
│ │  - Provides wallet address from Mini App context            │ │
│ │  - User FID, username, and wallet info                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP POST
┌─────────────────────────────────────────────────────────────────┐
│ Server (Node.js / Next.js API Route)                            │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ /api/agent/sign-transaction endpoint                        │ │
│ │  1. Receives transaction request                            │ │
│ │  2. Validates transaction data                              │ │
│ │  3. Creates agent instance                                  │ │
│ │  4. Constructs instruction prompt for agent                 │ │
│ │  5. Agent uses CDP wallet provider to sign/execute          │ │
│ │  6. Returns transaction hash to client                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ AgentKit + CDP Wallet Provider                              │ │
│ │  - Access to CDP Smart Wallet                               │ │
│ │  - Can sign and execute transactions                        │ │
│ │  - Uses CDP API keys for authentication                     │ │
│ │  - Operates on Base Sepolia or Base mainnet                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Blockchain (Base Sepolia / Base Mainnet)                    │ │
│ │  - Transaction is signed and broadcast                      │ │
│ │  - On-chain execution occurs                                │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. **Sign Transaction Endpoint** (`/api/agent/sign-transaction`)

**File**: `app/api/agent/sign-transaction.ts`

**Request**:
```typescript
{
  to: "0x...",              // Recipient address (required)
  value?: "1000000000000000000",  // Amount in wei
  data?: "0x...",           // Encoded function call
  type?: "transfer" | "swap" | "contract_call" | "custom",
  description?: "Transfer 1 ETH to recipient",
  userWalletAddress?: "0x...",   // For logging/context
  userMessage?: "send 1 ETH to..."  // Original request
}
```

**Response**:
```typescript
{
  success: boolean;
  transactionHash?: "0x...";
  error?: string;
  details?: {
    from: string;
    to: string;
    value?: string;
    data?: string;
    gasUsed?: string;
    status?: string;
  };
  message?: string;
}
```

### 2. **useTransactionSigning Hook**

**File**: `app/hooks/useTransactionSigning.ts`

**Usage**:
```typescript
const { signTransaction, sendTransfer, isLoading, error } = useTransactionSigning({
  onSuccess: (hash) => console.log("Transaction:", hash),
  onError: (err) => console.error("Failed:", err),
});

// Simple transfer
await sendTransfer("0x...", "1000000000000000000", userWalletAddress);

// Or full transaction
await signTransaction({
  to: "0x...",
  value: "1000000000000000000",
  type: "transfer",
  description: "Send 1 ETH",
});
```

### 3. **Transaction Utilities**

**File**: `app/utils/transaction-utils.ts`

Provides helper functions:
- `parseTransactionFromResponse()` - Extract tx data from agent responses
- `isValidEthereumAddress()` - Validate addresses
- `weiToEth()` / `ethToWei()` - Unit conversion
- `formatTxHash()` - Format hashes for display
- `getTxExplorerUrl()` - Generate block explorer URLs
- `extractTransactionHash()` - Find tx hash in text

### 4. **Terminal Integration**

**File**: `app/terminal/page.tsx`

The terminal automatically:
1. Detects when agent response contains transaction data
2. Parses transaction details from the response
3. Calls the signing endpoint with those details
4. Displays the transaction hash when successful

## Flow Example

### User Command: "Send 1 ETH to 0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"

1. **Client**: User types command in terminal
2. **Terminal**: Sends to `/api/agent` with the message
3. **Agent**: Generates response like:
   ```
   I'll send 1 ETH to that address for you.
   Transaction ready to execute to: 0x742d35Cc6634C0532925a3b844Bc9e7595f42bE
   ```
4. **Terminal**: Parses response, detects address
5. **Terminal**: Calls `useTransactionSigning.signTransaction()` with:
   - `to`: "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"
   - `value`: "1000000000000000000" (1 ETH in wei)
   - `type`: "transfer"
   - `description`: "Send 1 ETH"
   - `userWalletAddress`: User's address from Mini App context
6. **Hook**: Calls `/api/agent/sign-transaction` endpoint
7. **Endpoint**: 
   - Validates transaction data
   - Creates agent with CDP wallet
   - Sends instruction: "Execute transfer to 0x... of 1 ETH"
   - Agent uses AgentKit tools to sign and broadcast
   - Returns transaction hash
8. **Terminal**: Displays success with transaction hash
9. **User**: Can click hash to view on block explorer

## Security Considerations

### Client-Side
- ✅ User wallet address from Mini App SDK is trusted (Farcaster verified)
- ✅ Transaction data is validated before sending to server
- ✅ No private keys on client

### Server-Side
- ✅ CDP_API_KEY and CDP_API_KEY_SECRET are environment variables (not exposed)
- ✅ Agent validates all transaction parameters
- ✅ AgentKit handles secure signing with CDP Smart Wallet
- ✅ Transactions are signed by the server's wallet (not user's private key)

## Network Support

- **Primary**: Base Sepolia (testnet for development)
- **Alternative**: Base Mainnet (production)
- **Detection**: Automatic via AgentKit's wallet provider network detection

## Error Handling

The flow handles various error scenarios:

1. **Invalid Address**: Returns 400 error
2. **Agent Execution Error**: Catches and returns friendly error
3. **Network Issues**: Returns 503 error with retry suggestion
4. **Transaction Failure**: Returns error details from blockchain

## Transaction Types

### Transfer
```typescript
await signTransaction({
  to: "0x...",
  value: "1000000000000000000",
  type: "transfer",
});
```

### Contract Call
```typescript
await signTransaction({
  to: "0xContractAddress",
  data: "0x...", // Encoded function call
  type: "contract_call",
});
```

### Swap (DEX)
```typescript
await signTransaction({
  to: "0xDexAddress",
  data: "0x...",
  value: "0", // May vary
  type: "swap",
});
```

## Future Enhancements

1. **Multi-step Transactions**: Handle complex flows (approve → swap → deposit)
2. **Gas Optimization**: Allow user to adjust gas prices
3. **Transaction Queue**: Queue multiple transactions
4. **Simulation**: Preview transaction results before signing
5. **User Wallet Integration**: Allow signing with user's own wallet (instead of server wallet)
6. **Transaction History**: Track all user transactions per FID

## Environment Variables Required

```
GOOGLE_GENERATIVE_AI_API_KEY=xxx     # For agent LLM
CDP_API_KEY_ID=xxx                   # For CDP wallet
CDP_API_KEY_SECRET=xxx               # For CDP wallet
RPC_URL=https://sepolia.base.org     # For blockchain queries
```

## Related Files

- Client component: `app/terminal/page.tsx`
- Server endpoint: `app/api/agent/sign-transaction.ts`
- Hook: `app/hooks/useTransactionSigning.ts`
- Utilities: `app/utils/transaction-utils.ts`
- Agent: `app/api/agent/create-agent.ts`
- Mini App user context: `app/hooks/useFarcasterUser.ts`
