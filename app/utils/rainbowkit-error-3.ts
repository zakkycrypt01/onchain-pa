// RainbowKit Error Handler 3
import { logger } from "./logger";

export class RainbowKitError3 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError3";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError3(error: any): RainbowKitError3 {
  return new RainbowKitError3(error?.message || "Unknown error");
}
