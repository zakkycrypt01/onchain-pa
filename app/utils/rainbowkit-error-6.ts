// RainbowKit Error Handler 6
import { logger } from "./logger";

export class RainbowKitError6 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError6";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError6(error: any): RainbowKitError6 {
  return new RainbowKitError6(error?.message || "Unknown error");
}
