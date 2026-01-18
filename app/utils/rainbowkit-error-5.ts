// RainbowKit Error Handler 5
import { logger } from "./logger";

export class RainbowKitError5 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError5";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError5(error: any): RainbowKitError5 {
  return new RainbowKitError5(error?.message || "Unknown error");
}
