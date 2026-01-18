# Migration from Reown to RainbowKit

This document outlines the migration from Reown/AppKit to RainbowKit.

## What Changed

### Dependencies
- Removed: `@reown/appkit`, `@reown/appkit-adapter-ethers`
- Added: `@rainbow-me/rainbowkit`, `wagmi`, `viem`

### File Changes
- Old: `app/providers/ReownWalletProvider.tsx` → New: `app/providers/RainbowKitProvider.tsx`
- Old: `app/lib/appkit-init.ts` → New: `app/lib/rainbowkit-init.ts`
- Old: `useReownWallet()` → New: `useRainbowKit()`
- Old: `useReownModal()` → New: `useRainbowKitModal()`

### Type Changes
- Old: `"farcaster" | "reown" | "none"` → New: `"farcaster" | "rainbowkit" | "none"`

### Variable Names
- `reownAddress` → `rainbowkitAddress`
- `reownConnected` → `rainbowkitConnected`
- `isReown` → `isRainbowKit`

## Hooks Update

All wallet session hooks have been updated to use RainbowKit instead of Reown.

