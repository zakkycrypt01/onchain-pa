// RainbowKit Error Handler 7
import { logger } from "./logger";

export class RainbowKitError7 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError7";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError7(error: any): RainbowKitError7 {
  return new RainbowKitError7(error?.message || "Unknown error");
}
