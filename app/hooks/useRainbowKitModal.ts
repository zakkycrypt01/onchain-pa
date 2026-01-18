"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";

/**
 * Hook to open the RainbowKit modal
 */
export function useRainbowKitModal() {
  const { openConnectModal } = useConnectModal();

  return {
    openModal: openConnectModal,
  };
}

export default useRainbowKitModal;
