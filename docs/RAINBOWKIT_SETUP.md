# RainbowKit Integration Guide

This guide explains how to set up and use RainbowKit for multi-chain wallet connections.

## Overview

RainbowKit provides a modern, user-friendly wallet connection experience with support for multiple chains and wallets.

## Key Features

- Multi-chain support
- Built-in theme customization
- Wagmi integration
- React Query support
- TypeScript support

## Installation

```bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
```

## Configuration

See `app/providers/RainbowKitProvider.tsx` for the provider setup.

## Usage

Import and use the hooks:

- `useRainbowKit()` - Get wallet connection info
- `useRainbowKitModal()` - Control the connection modal

