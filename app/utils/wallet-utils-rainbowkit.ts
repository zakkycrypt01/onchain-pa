import { Address } from "viem";

export function formatWalletAddress(address: Address | string): string {
  if (!address) return "";
  const addr = typeof address === "string" ? address : address;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function isValidWalletAddress(address: any): address is Address {
  return typeof address === "string" && address.startsWith("0x") && address.length === 42;
}
