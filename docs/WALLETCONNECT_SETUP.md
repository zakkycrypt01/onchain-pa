# WalletConnect (Reown) Integration Guide

## Overview

This guide explains how to set up and use WalletConnect (powered by Reown) for wallet connections outside of the Farcaster Mini App environment.

## Features

✅ **Multi-wallet support**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and more  
✅ **Dual provider support**: Works alongside Farcaster Mini App wallet  
✅ **One-click connect**: Simple "Connect Wallet" button on landing page  
✅ **Persistent connection**: Wallet session persists across page reloads  
✅ **Mobile-friendly**: Full mobile wallet support  
✅ **Transaction signing**: Use connected wallet for server-side signing  

## Setup Instructions

### 1. Get a WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in with your account
3. Create a new project
4. Copy your **Project ID**

### 2. Add Project ID to Environment

Add the following to `.env.local`:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

**Example:**
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 3. Install Dependencies

The WalletConnect/Reown packages will be installed automatically. If needed, manually install:

```bash
npm install @reown/appkit @reown/appkit-adapter-ethers @reown/appkit-adapter-wagmi
```

## How It Works

### Architecture

```
User visits https://onchain-pa.vercel.app/
    ↓
Checks for Farcaster Mini App context (isInMiniApp)
    ↓
If NOT in Mini App:
    - Shows "Connect Wallet" button
    - User clicks button
    - WalletConnect modal opens
    - User selects wallet (MetaMask, WalletConnect, etc.)
    - Wallet connects to dApp
    - User can now execute transactions
    ↓
If IN Mini App:
    - Uses Farcaster Mini App wallet automatically
    - No "Connect Wallet" needed
    - User can still manually connect WalletConnect as fallback
```

### Priority System

The app uses this priority for wallet selection:

1. **Farcaster Mini App wallet** (if available and in Mini App frame)
2. **WalletConnect/Reown wallet** (if user clicks Connect)
3. **None** (fallback, show connect button)

## Usage

### Landing Page

The home page (`/`) automatically displays:

- **If Farcaster Mini App is detected**: Shows user info from Mini App context
- **If WalletConnect is connected**: Shows connected address with status indicator
- **If no wallet**: Shows "Connect Wallet" button

```tsx
import ConnectWalletButton from "@/app/components/ConnectWalletButton";
import { useWalletSession } from "@/app/hooks/useWalletSession";

export function MyComponent() {
  const { session, isConnected } = useWalletSession();

  if (isConnected) {
    return <div>Connected: {session?.displayName}</div>;
  }

  return <ConnectWalletButton />;
}
```

### Using the Wallet Session Hook

```typescript
import { useWalletSession } from "@/app/hooks/useWalletSession";

export function WalletInfo() {
  const { session, provider, isConnected } = useWalletSession();

  if (!isConnected) {
    return <div>No wallet connected</div>;
  }

  return (
    <div>
      <p>Provider: {provider}</p> {/* "farcaster" or "reown" */}
      <p>Address: {session?.address}</p>
      <p>Name: {session?.displayName}</p>
      {provider === "farcaster" && (
        <p>FID: {session?.fid}</p>
      )}
    </div>
  );
}
```

### Getting the Active Wallet Address

```typescript
import { useActiveWalletAddress } from "@/app/hooks/useWalletSession";

export function SendTransaction() {
  const address = useActiveWalletAddress();

  if (!address) {
    return <div>Please connect a wallet first</div>;
  }

  return <div>Your wallet: {address}</div>;
}
```

### Checking Wallet Provider Type

```typescript
import { useWalletProviderInfo } from "@/app/hooks/useWalletSession";

export function ProviderSpecificUI() {
  const { isFarcaster, isReown, displayName } = useWalletProviderInfo();

  if (isFarcaster) {
    return <div>Farcaster Mini App: {displayName}</div>;
  }

  if (isReown) {
    return <div>WalletConnect: {displayName}</div>;
  }

  return <div>No wallet connected</div>;
}
```

## Supported Wallets

WalletConnect v2 supports:

- **MetaMask**
- **Coinbase Wallet**
- **Rainbow Wallet**
- **Trust Wallet**
- **WalletConnect compatible wallets** (1000+ supported)
- **Mobile wallets** (wallet apps with WalletConnect support)

## Transaction Signing with Connected Wallet

When using the terminal with a WalletConnect wallet:

```typescript
import { useTransactionSigning } from "@/app/hooks/useTransactionSigning";
import { useActiveWalletAddress } from "@/app/hooks/useWalletSession";

export function ExecuteTransaction() {
  const { signTransaction } = useTransactionSigning();
  const walletAddress = useActiveWalletAddress();

  const handleTransfer = async () => {
    const result = await signTransaction({
      to: "0x...",
      value: "1000000000000000000", // 1 ETH in wei
      type: "transfer",
      userWalletAddress: walletAddress,
      userMessage: "Send 1 ETH",
    });

    if (result?.success) {
      console.log("Transaction hash:", result.transactionHash);
    }
  };

  return <button onClick={handleTransfer}>Send 1 ETH</button>;
}
```

## Files and Components

### Providers
- **`app/providers/ReownWalletProvider.tsx`** - Main WalletConnect provider configuration

### Components
- **`app/components/ConnectWalletButton.tsx`** - "Connect Wallet" button component

### Hooks
- **`app/hooks/useWalletSession.ts`** - Unified wallet session management
  - `useWalletSession()` - Main hook for wallet state
  - `useActiveWalletAddress()` - Get current wallet address
  - `useWalletProviderInfo()` - Get provider type and details
- **`app/hooks/useReownWallet.ts`** (in ReownWalletProvider)
  - `useReownWallet()` - Direct WalletConnect/Reown hook
  - `useReownModal()` - Open WalletConnect modal

### Updated Files
- **`app/layout.tsx`** - Added `ReownWalletProvider` wrapper
- **`app/page.tsx`** - Added wallet status display and connect button

## Customization

### Change Network

Edit `app/providers/ReownWalletProvider.tsx`:

```typescript
const networks: any = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://eth.rpc.blxrbdn.com",
  },
  // Add more networks...
];
```

### Custom Button Styling

The `ConnectWalletButton` supports variants and sizes:

```tsx
<ConnectWalletButton 
  variant="secondary"  // "primary" | "secondary"
  size="lg"           // "sm" | "md" | "lg"
  className="custom-class"
/>
```

### Custom Modal

To create a custom wallet modal instead of using the default:

```typescript
import { useReownModal } from "@/app/providers/ReownWalletProvider";

export function CustomWalletConnect() {
  const { openModal } = useReownModal();

  return <button onClick={() => openModal()}>Custom Connect Button</button>;
}
```

## Troubleshooting

### "Project ID not found" warning

**Solution**: Make sure `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set in `.env.local`

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_id_here
```

### Wallet connection not persisting

**Solution**: Check browser localStorage permissions and clear cache:

```bash
# In browser DevTools Console
localStorage.clear()
# Then reload the page
```

### User sees both Farcaster and WalletConnect buttons

**Solution**: This is expected behavior. The app prioritizes Farcaster in Mini App frames but allows WalletConnect as a fallback.

### "Not in Mini App" error in terminal

**Solution**: This means you're testing outside a Farcaster frame. The app automatically falls back to WalletConnect - just click the connect button.

## Testing

### Local Testing

1. Set `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` in `.env.local`
2. Run `npm run dev`
3. Visit `http://localhost:3000`
4. Click "Connect Wallet"
5. Select a wallet from the modal
6. Approve the connection

### Test on Different Networks

The app supports:
- Base Mainnet (id: 8453)
- Base Sepolia (id: 84532)

Users can switch networks in their wallet after connecting.

## Security Notes

✅ Private keys never exposed to the app  
✅ WalletConnect handles key management securely  
✅ Transactions can only be executed with wallet user approval  
✅ All signing happens in the user's wallet application  
✅ Server-side wallet (CDP) handles agent transactions separately  

## Migration from Previous Setup

If you were using a different wallet provider before:

1. The new system is **fully backward compatible**
2. Farcaster Mini App wallet is **still the priority** when available
3. WalletConnect is an **additional option** for non-Mini App users
4. No breaking changes to existing code

## Deployment

When deploying to production:

1. Update the metadata in `ReownWalletProvider.tsx`:
   ```typescript
   metadata: {
     url: "https://your-production-domain.com",
     icons: ["https://your-production-domain.com/icon.png"],
   }
   ```

2. Make sure `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set in your production environment variables

3. Update the return URL in WalletConnect dashboard if needed

## Support

For issues with WalletConnect/Reown:
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Reown AppKit Docs](https://docs.reown.com/)

For issues with this integration:
- Check this file for setup instructions
- Review the component code in `app/providers/ReownWalletProvider.tsx`
- Check browser console for error messages
