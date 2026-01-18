// RainbowKit Type Extension 2

export interface RainbowKitExtension2 {
  id: string;
  name: string;
  version: string;
}

export type RainbowKitExtensionConfig2 = RainbowKitExtension2 & {
  enabled: boolean;
};
