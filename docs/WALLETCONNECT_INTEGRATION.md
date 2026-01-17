# Wallet Connect Integration Guide

## Overview

Onchain PA now supports two authentication methods:

1. **Farcaster Mini App** - For users accessing through Farcaster
2. **WalletConnect** - For standalone web access via MetaMask or other Web3 wallets

This allows users to use the app in different contexts and provides a seamless experience regardless of how they access it.

## Architecture

```
Landing Page (/landing)
├── Farcaster Mini App Path
│   └── Auto-detect and connect via Farcaster SDK
│       └── Terminal (/terminal)
│
└── WalletConnect Path
    ├── Click "Connect Wallet" button
    ├── Select wallet (MetaMask, etc.)
    └── Terminal (/terminal)
```

## Components

### 1. **WalletProvider** (`app/providers/WalletProvider.tsx`)

Manages wallet connection state and provides Web3 integration.

**Features:**
- MetaMask/Web3 wallet detection
- Automatic Base Sepolia chain switching
- Balance tracking
- Error handling
- Disconnect support

**Usage:**
```tsx
import { useWallet } from "@/app/providers/WalletProvider";

function MyComponent() {
  const { wallet, connect, disconnect, isConnecting, error } = useWallet();
  
  if (wallet?.isConnected) {
    return <div>Connected: {wallet.address}</div>;
  }
  
  return (
    <button onClick={connect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
```

### 2. **useAuthenticatedUser Hook** (`app/hooks/useAuthenticatedUser.ts`)

Combines both Farcaster and WalletConnect authentication into a single interface.

**Returns:**
```typescript
{
  user: CombinedUser | null,
  isLoading: boolean,
  error: string | null,
  disconnect: () => Promise<void>,
  isFarcaster: boolean,
  isWalletConnect: boolean
}
```

**Usage:**
```tsx
import { useAuthenticatedUser } from "@/app/hooks/useAuthenticatedUser";

function Terminal() {
  const { user, isLoading, isFarcaster, isWalletConnect } = useAuthenticatedUser();
  
  if (isFarcaster) {
    return <div>Farcaster: {user?.displayName}</div>;
  }
  
  if (isWalletConnect) {
    return <div>Wallet: {user?.address}</div>;
  }
}
```

### 3. **Landing Page** (`app/landing/page.tsx`)

Beautiful landing page with both connection options.

**Features:**
- Display current connection status
- One-click wallet connection
- Feature highlights
- Connection options comparison
- Responsive design

## User Flows

### Flow 1: Farcaster Mini App User

1. User opens Farcaster frame link
2. App auto-detects Farcaster context via SDK
3. Fetches user data and wallet address
4. User redirected to terminal automatically
5. Full session management with per-user history

### Flow 2: WalletConnect User

1. User visits landing page directly
2. Clicks "Connect Wallet" button
3. MetaMask (or other wallet) opens
4. User approves connection
5. App switches to Base Sepolia chain
6. User is directed to terminal
7. Can execute transactions with their wallet

## Supported Chains

- **Base Sepolia** (84532) - Default, testnet
- **Base Mainnet** (8453) - Production
- **Ethereum Mainnet** (1) - Fallback detection

The app automatically suggests switching to Base Sepolia when connecting.

## API Integration

### Transaction Signing with Both Auth Methods

The `/api/agent/sign-transaction` endpoint works with both authentication methods:

```typescript
// For Farcaster users
await signTransaction({
  to: recipientAddress,
  value: amountInWei,
  userWalletAddress: user.walletAddress, // From Farcaster context
  userMessage: "send 1 ETH"
});

// For WalletConnect users
await signTransaction({
  to: recipientAddress,
  value: amountInWei,
  userWalletAddress: user.address, // From MetaMask
  userMessage: "send 1 ETH"
});
```

## Session Management

### Farcaster Sessions
- Per-user command history
- Stored in UserContext
- Persists during Mini App session
- Auto-isolated by FID

### WalletConnect Sessions
- Stored in browser localStorage
- Wallet address is source of identity
- Can persist across page reloads
- Single user per browser instance

## Security Considerations

### Farcaster
✅ User verified by Farcaster protocol  
✅ Wallet address from trusted SDK  
✅ FID prevents cross-user pollution  
✅ Server validates wallet context  

### WalletConnect
✅ Wallet provider handles private keys  
✅ No private keys stored on app  
✅ User controls wallet via MetaMask  
✅ Chain validation before transactions  

## Error Handling

### Connection Errors
```
"Please install MetaMask or another Web3 wallet"
"User rejected connection"
"Failed to switch chain"
```

### Transaction Errors
```
"Insufficient balance"
"Transaction reverted"
"Gas price too low"
```

## File Structure

```
app/
├── landing/
│   └── page.tsx              # Landing page with both auth options
├── terminal/
│   └── page.tsx              # Terminal (works with both auth)
├── providers/
│   ├── WalletProvider.tsx     # Wallet connection state
│   ├── UserContext.tsx        # Farcaster user context
│   └── MiniAppProvider.tsx    # Farcaster Mini App SDK init
├── hooks/
│   ├── useAuthenticatedUser.ts # Combined auth hook
│   ├── useFarcasterUser.ts    # Farcaster-specific
│   ├── useWallet.tsx          # Wallet-specific (in provider)
│   └── useTransactionSigning.ts # Works with both
└── api/
    └── agent/
        └── sign-transaction.ts # Works with both auth methods
```

## Environment Setup

### Required for Farcaster
- `@farcaster/miniapp-sdk` package
- App deployed with manifest at `/.well-known/farcaster.json`

### Required for WalletConnect
- `window.ethereum` support (MetaMask or similar)
- Base Sepolia RPC endpoint (auto-configured)

## Testing Scenarios

### Scenario 1: Farcaster User
1. Frame loads → Auto-authenticate
2. User sees terminal immediately
3. Commands execute with Farcaster wallet
4. Per-user history persists

### Scenario 2: MetaMask User
1. Direct landing page access
2. Click "Connect Wallet"
3. MetaMask opens → Approve
4. Terminal loads with wallet address
5. All features available

### Scenario 3: Mixed Usage
1. User can switch between methods
2. Each maintains separate session
3. Agent pool serves both appropriately

## Future Enhancements

1. **Multiple Wallet Support**
   - WalletConnect mobile SDK
   - Hardware wallets (Ledger, Trezor)
   - Argent, Rainbow, etc.

2. **Session Persistence**
   - Save WalletConnect session across page reloads
   - Encrypted local storage

3. **Multi-Chain Support**
   - Optimism, Arbitrum, Polygon support
   - Chain-aware command execution

4. **User Profile Sync**
   - Save settings per wallet/FID
   - Cross-device account recovery

5. **Advanced Signing**
   - Batch transaction signing
   - Multi-sig wallet support
   - Sponsored transactions

## Troubleshooting

### "Not running in a Farcaster Mini App"
- App correctly falls back to WalletConnect
- User should click "Connect Wallet"

### "Please install MetaMask"
- MetaMask extension not installed
- User needs to install Web3 wallet extension

### "Failed to switch chain"
- User rejected chain switch in MetaMask
- Try adding chain manually: Base Sepolia RPC

### "Transaction signing failed"
- Insufficient balance
- Account doesn't have connect permission
- Try disconnecting and reconnecting wallet

## Related Files

- Landing page: `app/landing/page.tsx`
- Terminal (both auth): `app/terminal/page.tsx`
- Wallet provider: `app/providers/WalletProvider.tsx`
- Combined hook: `app/hooks/useAuthenticatedUser.ts`
- Transaction signing: `app/api/agent/sign-transaction.ts`
- Mini App provider: `app/components/MiniAppProvider.tsx`
- Farcaster user hook: `app/hooks/useFarcasterUser.ts`
