# Base Mini App Wallet Provider Migration

## Overview

The application has been migrated to support the **Base Mini App Wallet Provider**, allowing users to interact with the onchain terminal using their connected Farcaster wallet within the Base Mini App environment.

## Key Changes

### 1. New Base Mini App Wallet Provider Module
**File**: `/app/api/agent/base-miniapp-wallet.ts`

This new module provides:
- `getBaseMiniAppWalletContext()` - Retrieves user and wallet info from the Farcaster Mini App SDK
- `createBaseMiniAppWalletProvider()` - Creates a wallet provider compatible with AgentKit
- `signTransactionWithBaseMiniApp()` - Placeholder for transaction signing (to be fully implemented)

**Features**:
- Extracts wallet address from the Farcaster Mini App SDK context
- Verifies user is in a Mini App environment
- Provides wallet information (address, network, export functionality)
- Maintains compatibility with AgentKit's WalletProvider interface

### 2. Updated Agent Initialization
**File**: `/app/api/agent/prepare-agentkit.ts`

New functions added:
- `prepareAgentkitWithBaseMiniAppWallet()` - Initializes AgentKit with Base Mini App wallet
- `prepareAgentkitAndWalletProviderAuto()` - Intelligently selects wallet provider based on environment

**Behavior**:
- Attempts to use Base Mini App wallet if available (when running in Farcaster Mini App)
- Falls back to CDP wallet provider if not in Mini App environment
- Provides clear console logging for debugging

### 3. Updated Agent Creation
**File**: `/app/api/agent/create-agent.ts`

**Changes**:
- `createAgent()` now attempts Base Mini App wallet first, then CDP wallet as fallback
- System prompt includes Mini App context when available (displays user's FID and username)
- Maintains all existing tools and capabilities with either wallet provider

**Fallback Logic**:
```typescript
try {
  // Try Base Mini App wallet
  const miniAppResult = await prepareAgentkitWithBaseMiniAppWallet();
  // Success - use Mini App wallet
} catch (miniAppError) {
  // Fall back to CDP wallet
  const cdpResult = await prepareAgentkitAndWalletProvider();
}
```

## How It Works

### User Flow

1. **Mini App Context Detection**
   - Agent checks if running in Farcaster Mini App using `sdk.isInMiniApp()`
   - Retrieves user context via `sdk.context`

2. **Wallet Connection**
   - Extracts wallet address from SDK context
   - User's wallet is automatically connected (no additional sign-in needed)
   - Wallet address is displayed in terminal header and settings

3. **Transaction Execution**
   - Agent uses connected wallet for all blockchain interactions
   - Each user has their own isolated command history and transaction context
   - Per-user state is managed through UserContext provider

4. **Fallback Behavior**
   - If not in Mini App, agent falls back to CDP wallet provider
   - Allows testing and development outside of Mini App environment
   - CDP wallet uses stored credentials from `wallet_data.txt`

## Integration Points

### Terminal UI Integration
The terminal displays:
- User's username and FID in the header
- Truncated wallet address (e.g., `0x1234...5678`)
- All commands execute with the connected wallet context

### Settings Page Integration
The settings page shows:
- Full wallet address
- User's FID and display name
- Theme customization for terminal colors
- Terminal commands reference

### Agent Commands
All agent commands work with Base Mini App wallet:
- `bal` - Check wallet balance
- `wallet` - Get wallet details
- `tx` - List transaction history
- `send` - Send transactions
- `swap` - Swap tokens on DEX

## Environment Variables

Required for CDP wallet fallback:
```
CDP_API_KEY_ID=your_api_key
CDP_API_KEY_SECRET=your_api_secret
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

Optional:
```
NETWORK_ID=base-sepolia
RPC_URL=https://sepolia.base.org
PAYMASTER_URL=your_paymaster_url
```

## Implementation Status

### ✅ Completed
- Base Mini App wallet provider implementation
- User context detection and extraction
- AgentKit integration with Mini App wallet
- Fallback to CDP wallet provider
- Per-user wallet context display
- System prompt updates for Mini App context

### 🟡 Partial (To be implemented based on SDK capabilities)
- Transaction signing through Mini App wallet
- Direct transaction broadcasting
- Wallet switching functionality

### 📋 Recommended Next Steps

1. **Test in Farcaster Client**
   - Deploy to production domain
   - Test wallet connection in Farcaster/Base app
   - Verify transaction signing works

2. **Implement Full Transaction Signing**
   - Use Base Mini App SDK's signing capabilities
   - Handle transaction approval flow
   - Implement error handling for failed transactions

3. **Add Transaction Confirmation UI**
   - Show transaction preview
   - Get user confirmation before broadcasting
   - Display transaction status and results

4. **Multi-user Testing**
   - Test with multiple Farcaster users
   - Verify per-user command history isolation
   - Confirm wallet address accuracy per user

## Code Examples

### Using Base Mini App Wallet in Custom Actions

```typescript
import { getBaseMiniAppWalletContext } from './base-miniapp-wallet';

// Get current user's wallet
const walletContext = await getBaseMiniAppWalletContext();
console.log(`User: ${walletContext.displayName} (${walletContext.fid})`);
console.log(`Wallet: ${walletContext.walletAddress}`);
```

### Checking Wallet Connection Status

```typescript
const context = await getBaseMiniAppWalletContext();
if (context.isConnected) {
  console.log("Wallet is connected and ready");
} else {
  console.log("Wallet connection failed");
}
```

## Debugging

Enable console logging to see wallet provider selection:

```
[Agent] Attempting to initialize with Base Mini App wallet...
[Base Mini App] Connected to wallet: 0x...
[Base Mini App] User: @username (FID: 12345)
[Agent] Successfully initialized with Base Mini App wallet
```

If Base Mini App wallet fails:
```
[Agent] Base Mini App wallet not available, using CDP wallet provider...
```

## Related Files

- User context: `/app/providers/UserContext.tsx`
- User hook: `/app/hooks/useFarcasterUser.ts`
- Terminal UI: `/app/components/TerminalUI.tsx`
- Settings page: `/app/settings/page.tsx`
- Mini App provider: `/app/components/MiniAppProvider.tsx`

## References

- [Farcaster Mini App SDK](https://docs.farcaster.xyz/reference/miniapp-sdk)
- [Base Mini App Framework](https://docs.base.org/mini-apps)
- [AgentKit Documentation](https://github.com/coinbase/agentkit)
- [Coinbase Developer Platform](https://docs.cdp.coinbase.com)
