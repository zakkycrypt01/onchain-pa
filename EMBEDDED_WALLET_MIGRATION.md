# Embedded Wallet Migration Guide

## Overview

The application has been migrated from **Server Wallet** (CDP Smart Wallet) to **Embedded Wallet** for client-side key management. This provides better security and user experience.

## Key Changes

### 1. **Environment Variables**
Change from server-based to client-accessible variables:

**Old (Server Wallet):**
```env
CDP_API_KEY_ID=xxx
CDP_API_KEY_SECRET=xxx
CDP_WALLET_SECRET=xxx
NETWORK_ID=base-sepolia
RPC_URL=xxx
```

**New (Embedded Wallet):**
```env
NEXT_PUBLIC_CDP_API_KEY_ID=xxx
NEXT_PUBLIC_NETWORK_ID=base-sepolia
NEXT_PUBLIC_RPC_URL=xxx
```

### 2. **File Structure Changes**

**Removed:**
- `wallet_data.txt` (no longer needed for server-side storage)
- File-based wallet persistence

**Added:**
- `app/api/agent/embedded-wallet.ts` - Embedded wallet utilities
- `app/hooks/useWallet.tsx` - Client-side wallet context
- `app/api/wallet/connect/route.ts` - Wallet connection endpoint
- `app/api/wallet/details/route.ts` - Wallet details endpoint

### 3. **Core Changes**

#### `prepare-agentkit.ts`
```typescript
// Before: CdpSmartWalletProvider
const walletProvider = await CdpSmartWalletProvider.configureWithWallet({
  apiKeyId: process.env.CDP_API_KEY_ID,
  apiKeySecret: process.env.CDP_API_KEY_SECRET,
  // ... server credentials
});

// After: EmbeddedWalletProvider
const walletProvider = await EmbeddedWalletProvider.configure({
  apiKeyId: process.env.NEXT_PUBLIC_CDP_API_KEY_ID,
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID,
  privateKey: userPrivateKey, // Optional: for wallet recovery
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
});
```

#### `create-agent.ts`
```typescript
// Now accepts optional privateKey parameter
export async function createAgent(userPrivateKey?: string): Promise<Agent>
```

#### `route.ts` (Agent API)
```typescript
// Now accepts privateKey in request body
const { userMessage, privateKey } = await req.json();
const agent = await createAgent(privateKey);
```

### 4. **New Wallet Management**

**Client-Side Wallet Hook:**
```typescript
import { useWallet } from "@/app/hooks/useWallet";

function MyComponent() {
  const { wallet, connectWallet, importWallet, exportWallet } = useWallet();
  
  // Use wallet state and methods
}
```

**Wallet API Endpoints:**
- `POST /api/wallet/connect` - Connect/create wallet with optional private key
- `GET /api/wallet/details` - Get current wallet details

## Migration Steps

1. **Update Environment Variables**
   - Remove: `CDP_API_KEY_SECRET`, `CDP_WALLET_SECRET`
   - Add `NEXT_PUBLIC_` prefix to public variables
   - Keep `NEXT_PUBLIC_CDP_API_KEY_ID` and network configuration

2. **Remove Server Wallet Files**
   - Delete `wallet_data.txt`
   - No longer store wallet data server-side

3. **Update Frontend**
   - Wrap app with `WalletProvider` from `useWallet.tsx`
   - Use `useWallet()` hook to manage wallet connection
   - Pass private key to agent requests if needed

4. **Client-Side Key Management**
   - Private keys stay in the browser
   - Use browser storage (localStorage, sessionStorage) cautiously
   - Consider using secure key management libraries

## Security Considerations

### ✅ Advantages
- Private keys never leave the client
- Better user control over assets
- No server-side key storage needed
- Faster transaction signing

### ⚠️ Important
- Store private keys securely on client (consider using secure enclaves)
- Never log or expose private keys
- Use HTTPS only
- Implement proper error handling
- Consider adding password protection for wallet access

## Usage Examples

### Import Existing Wallet
```typescript
const { importWallet } = useWallet();
await importWallet("0x1234...5678");
```

### Create New Wallet
```typescript
const { connectWallet } = useWallet();
await connectWallet(); // Creates new embedded wallet
```

### Agent API with Wallet
```typescript
const response = await fetch("/api/agent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userMessage: "swap 1 ETH to USDC",
    privateKey: "0x...", // optional
  }),
});
```

## Troubleshooting

**Error: "NEXT_PUBLIC_CDP_API_KEY_ID not configured"**
- Ensure `NEXT_PUBLIC_CDP_API_KEY_ID` is set in `.env`
- Restart dev server after env changes

**Wallet Not Connecting**
- Check network connectivity
- Verify CDP API key is valid
- Check RPC URL is accessible

**Private Key Import Fails**
- Verify key is valid hex format (0x...)
- Ensure key is for the correct network
- Check for sufficient gas balance for first transaction

## References

- [AgentKit Documentation](https://github.com/coinbase/agentkit)
- [Embedded Wallet Provider](https://docs.cdp.coinbase.com/agentkit/docs/wallet-management#embedded-wallet)
- [CDP API Reference](https://docs.cdp.coinbase.com/agentkit/docs/agent-actions)
