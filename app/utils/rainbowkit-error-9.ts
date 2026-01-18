// RainbowKit Error Handler 9
import { logger } from "./logger";

export class RainbowKitError9 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError9";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError9(error: any): RainbowKitError9 {
  return new RainbowKitError9(error?.message || "Unknown error");
}
