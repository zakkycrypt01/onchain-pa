# Base Mini App Migration Guide

Your Onchain Terminal PA has been migrated to work as a Base Mini App. Follow these steps to complete the deployment:

## ✅ Completed Steps

1. **Installed MiniApp SDK** - Added `@farcaster/miniapp-sdk` to dependencies
2. **Created Manifest File** - Added `/public/.well-known/farcaster.json`
3. **Updated Layout** - Added `MiniAppProvider` component and embed metadata
4. **Created MiniAppProvider** - Component that initializes the SDK on app load

## 📋 Next Steps

### 1. Update Manifest Fields
Edit `/public/.well-known/farcaster.json` and replace all `https://your-domain.com` URLs with your actual domain:

```json
{
  "miniapp": {
    "homeUrl": "https://your-actual-domain.com",
    "iconUrl": "https://your-actual-domain.com/icon.png",
    "splashImageUrl": "https://your-actual-domain.com/splash.png",
    // ... other URLs
  }
}
```

**Required assets:**
- `icon.png` - App icon (suggested 512x512px)
- `splash.png` - Splash screen image
- `screenshot1-3.png` - 3 app screenshots
- `hero.png` - Hero image for marketing
- `og.png` - OpenGraph image for sharing
- `embed-image.png` - Embed preview image

### 2. Deploy Your App
Push your changes to production. The mini app must be accessible at:
```
https://your-domain.com/.well-known/farcaster.json
```

### 3. Generate Account Association Credentials
Once deployed, go to [Base Build](https://www.base.dev/preview?tab=account):

1. Paste your domain in the "App URL" field
2. Click "Submit"
3. Click the "Verify" button and follow instructions
4. Copy the generated `accountAssociation` fields:
   ```json
   {
     "header": "eyJ...",
     "payload": "eyJ...",
     "signature": "MHg..."
   }
   ```
5. Paste these into your `/public/.well-known/farcaster.json`

### 4. Verify Configuration
Use the [Base Build Preview Tool](https://www.base.dev/preview):
- Test embeds display correctly
- Verify the launch button works
- Check Account Association tab shows "verified"
- Review Metadata tab for completeness

### 5. Publish Your App
Create a post in the Base app with your app's URL. The launch button will appear in the embed!

## 🎨 Mini App Considerations

Your existing UI has been preserved, but consider these optimizations for mini apps:

- **Responsive Design**: Mini apps run in a mobile-like container, ensure your terminal UI is responsive
- **Touch-friendly**: Increase touch targets if needed (buttons, inputs)
- **Performance**: Minimize bundle size for faster loads
- **Wallet Integration**: The SDK provides access to user's connected wallet through `sdk.context.user`

## 🔗 Accessing Mini App Context

To access user and wallet information in your components:

```typescript
import { sdk } from '@farcaster/miniapp-sdk';

// Get user context
const user = sdk.context.user;
console.log(user.fid); // Farcaster ID
console.log(user.username); // Username
console.log(user.displayName); // Display name
console.log(user.pfpUrl); // Profile picture URL

// Get wallet context  
const wallet = sdk.context.user.wallet;
if (wallet) {
  console.log(wallet.address); // User's wallet address
}
```

## 📚 Useful Links

- [Base Mini App Docs](https://docs.base.org/mini-apps/quickstart/migrate-existing-apps)
- [Manifest Field Reference](https://docs.base.org/mini-apps/features/manifest#field-reference)
- [MiniApp SDK Documentation](https://docs.base.org/mini-apps)
- [Base Build](https://www.base.dev/preview)

## 🚀 Development Tips

1. **Test Locally**: Run `npm run dev` to test locally
2. **SDK Ready Check**: The app waits for `sdk.actions.ready()` before showing content
3. **Error Handling**: Check browser console for SDK initialization errors
4. **Responsive Testing**: Test at different viewport sizes

Your terminal UI should now work great as a Base Mini App! 🎉
