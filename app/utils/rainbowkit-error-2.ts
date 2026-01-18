// RainbowKit Error Handler 2
import { logger } from "./logger";

export class RainbowKitError2 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError2";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError2(error: any): RainbowKitError2 {
  return new RainbowKitError2(error?.message || "Unknown error");
}
