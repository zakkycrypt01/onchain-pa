// RainbowKit Error Handler 8
import { logger } from "./logger";

export class RainbowKitError8 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError8";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError8(error: any): RainbowKitError8 {
  return new RainbowKitError8(error?.message || "Unknown error");
}
