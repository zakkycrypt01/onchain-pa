// RainbowKit Error Handler 4
import { logger } from "./logger";

export class RainbowKitError4 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RainbowKitError4";
    logger.error(this.name, message);
  }
}

export function handleRainbowKitError4(error: any): RainbowKitError4 {
  return new RainbowKitError4(error?.message || "Unknown error");
}
