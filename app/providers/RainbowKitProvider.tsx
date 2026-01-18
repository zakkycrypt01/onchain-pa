"use client";

import React, { ReactNode } from "react";
import {
  RainbowKitProvider as RainbowKitProviderComponent,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "@wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

// This file will contain the RainbowKit wallet provider setup
// Migration from Reown/AppKit to RainbowKit

const queryClient = new QueryClient();
  return <>{children}</>;
};
