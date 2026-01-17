# Quick Start: Dual Authentication

## For Users

### Access via Farcaster
1. Open the Farcaster frame link
2. App auto-loads your Farcaster account
3. Start using the terminal immediately

### Access via Web Wallet
1. Visit the landing page (`/landing`)
2. Click "Connect Wallet"
3. Approve connection in MetaMask
4. Start using the terminal

## For Developers

### Setup (One-Time)
```bash
# Everything is already configured!
# Just make sure you have:
# - @farcaster/miniapp-sdk installed
# - MetaMask browser extension (for testing)
# - .env variables set
```

### Using Combined Auth in Components
```tsx
import { useAuthenticatedUser } from "@/app/hooks/useAuthenticatedUser";

export function MyComponent() {
  const { user, isLoading, isFarcaster, isWalletConnect } = useAuthenticatedUser();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!user) return <div>Not authenticated</div>;
  
  return (
    <div>
      <h1>Welcome {user.displayName || user.address}</h1>
      <p>Wallet: {user.walletAddress}</p>
      <p>Source: {isFarcaster ? "Farcaster" : "Web3"}</p>
    </div>
  );
}
```

### Just Using WalletConnect
```tsx
import { useWallet } from "@/app/providers/WalletProvider";

export function ConnectButton() {
  const { wallet, connect, isConnecting, error } = useWallet();
  
  return (
    <>
      <button onClick={connect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {wallet?.isConnected && <p>✓ {wallet.address}</p>}
      {error && <p>Error: {error}</p>}
    </>
  );
}
```

## File Reference

| File | Purpose | Import |
|------|---------|--------|
| `app/providers/WalletProvider.tsx` | Wallet state | `useWallet()` |
| `app/hooks/useAuthenticatedUser.ts` | Combined auth | `useAuthenticatedUser()` |
| `app/landing/page.tsx` | Landing page | Visit `/landing` |
| `app/terminal/page.tsx` | Terminal | Visit `/terminal` |

## Common Patterns

### Check Authentication Type
```tsx
const { isFarcaster, isWalletConnect } = useAuthenticatedUser();

if (isFarcaster) {
  // Farcaster-specific code
} else if (isWalletConnect) {
  // Web3 wallet-specific code
}
```

### Get User Wallet Address
```tsx
const { user } = useAuthenticatedUser();

// Works for both sources
const walletAddress = user?.walletAddress || user?.address;
```

### Handle Disconnect
```tsx
const { user, disconnect } = useAuthenticatedUser();

const handleLogout = async () => {
  await disconnect();
  // User will be redirected to landing page
};
```

### Execute Transaction
```tsx
const { user } = useAuthenticatedUser();
const { signTransaction } = useTransactionSigning();

const sendEth = async () => {
  const result = await signTransaction({
    to: "0x...",
    value: "1000000000000000000", // 1 ETH in wei
    userWalletAddress: user?.walletAddress || user?.address,
  });
  
  if (result?.success) {
    console.log("Hash:", result.transactionHash);
  }
};
```

## URLs

| URL | Purpose |
|-----|---------|
| `/landing` | Landing page with both auth options |
| `/terminal` | Terminal interface (both auth methods) |
| `/settings` | User settings and theme |
| `/api/agent` | Send commands to AI agent |
| `/api/agent/sign-transaction` | Sign and broadcast transactions |

## Environment Variables

Already set up! The app uses:
```
GOOGLE_GENERATIVE_AI_API_KEY=xxx
CDP_API_KEY_ID=xxx
CDP_API_KEY_SECRET=xxx
```

## Testing Commands

### Test MetaMask Connection
```bash
# In browser console:
window.ethereum.request({ method: 'eth_accounts' })
```

### Test Farcaster Context
```bash
# In browser console (in Farcaster frame only):
(async () => {
  const { isInMiniApp, context } = await import('@farcaster/miniapp-sdk');
  console.log({ isInMiniApp, context });
})()
```

## Troubleshooting

### "useAuthenticatedUser must be used within..."
Make sure component is wrapped by:
```tsx
<WalletProvider>
  <UserProvider>
    <MiniAppProvider>
      <YourComponent />
    </MiniAppProvider>
  </UserProvider>
</WalletProvider>
```

### MetaMask not detected
- Install MetaMask extension
- Or use any Web3 wallet (Coinbase Wallet, etc.)
- Reload page after installation

### Transaction fails
- Check wallet has balance: `bal`
- Check on correct network: `wallet`
- View recent transactions: `tx`

## Next Steps

1. **Test locally**: `npm run dev`
2. **Visit landing page**: http://localhost:3000/landing
3. **Connect wallet** or **access via Farcaster frame**
4. **Try commands**: `bal`, `wallet`, `help`
5. **Deploy** when ready

## Need Help?

- Landing page: `app/landing/page.tsx`
- Terminal: `app/terminal/page.tsx`
- Auth hook: `app/hooks/useAuthenticatedUser.ts`
- Docs: `docs/WALLETCONNECT_INTEGRATION.md`
