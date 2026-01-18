# TypeScript Configuration for RainbowKit

## Path Aliases

Update tsconfig.json:

```json
{
  "compilerOptions": {
    "paths": {
      "@/providers/*": ["./app/providers/*"],
      "@/config/*": ["./app/config/*"],
      "@/types/*": ["./app/types/*"]
    }
  }
}
```

## Type Definitions

Key types:
- `WalletProvider` - Union type of supported providers
- `WalletSession` - User's wallet session info
- `RainbowKitConfig` - Configuration type

