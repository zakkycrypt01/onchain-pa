// RainbowKit Error Handler 1
import { logger } from "./logger";

export class RainbowKitError1 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError1";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError1(error: any): RainbowKitError1 {
  return new RainbowKitError1(error?.message || "Unknown error");
}
