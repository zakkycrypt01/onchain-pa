// RainbowKit Error Handler 10
import { logger } from "./logger";

export class RainbowKitError10 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError10";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError10(error: any): RainbowKitError10 {
  return new RainbowKitError10(error?.message || "Unknown error");
}
