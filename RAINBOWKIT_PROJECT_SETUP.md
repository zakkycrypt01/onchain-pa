# RainbowKit Project Setup

## Installation Steps

1. Install dependencies
   ```bash
   npm install
   ```

2. Configure environment
   - Copy .env.rainbowkit to .env.local
   - Set NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

3. Run development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## Project Structure

```
app/
├── config/           # RainbowKit configuration
├── hooks/            # Custom hooks
├── providers/        # Context providers
├── types/            # TypeScript types
└── utils/            # Utility functions
```

