// RainbowKit Type Extension 1

export interface RainbowKitExtension1 {
  id: string;
  name: string;
  version: string;
}

export type RainbowKitExtensionConfig1 = RainbowKitExtension1 & {
  enabled: boolean;
};
