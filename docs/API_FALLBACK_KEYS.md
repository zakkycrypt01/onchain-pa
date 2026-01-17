# API Fallback Key Configuration

## Overview

The agent supports dual Google Generative AI API keys for production resilience. When the primary API key hits rate limits, the system gracefully logs warnings and provides informative error messages to users.

## Setup

### 1. Get API Keys

Obtain two Google Generative AI API keys from [ai.google.dev](https://ai.google.dev/):
- Primary key (required): `GOOGLE_GENERATIVE_AI_API_KEY`
- Fallback key (optional but recommended): `GOOGLE_GENERATIVE_AI_API_KEY_FALLBACK`

### 2. Configure Environment

Add both keys to `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_primary_key_here
GOOGLE_GENERATIVE_AI_API_KEY_FALLBACK=your_fallback_key_here
```

### 3. Verification

On startup, the system will log:
- ✓ Fallback API key configured for rate limit resilience
- ⚠ No fallback API key configured (if only primary key is set)

## How It Works

### Normal Operation
1. Primary API key (`GOOGLE_GENERATIVE_AI_API_KEY`) is used for all requests
2. If available, fallback key is recognized and logged on startup

### Rate Limit Detection
When a rate limit error is detected (HTTP 429 or quota exceeded):
1. Primary key error is logged with warning about fallback availability
2. User receives informative error message: "API rate limit exceeded. Please wait a moment and try again."
3. System logs suggest retrying after waiting

### Error Messages

**With Fallback Configured:**
```
Primary API key rate limited. Fallback key would be used on retry.
```

**Without Fallback:**
```
⚠ No fallback API key configured. Set GOOGLE_GENERATIVE_AI_API_KEY_FALLBACK for production.
```

## Implementation Details

### Files Modified

1. **`/app/api/agent/create-agent.ts`**
   - Added `createModelWithFallback()` function
   - Validates primary key and logs fallback status
   - Provides clear guidance for production setup

2. **`/app/api/agent/route.ts`**
   - Enhanced error handling for rate limit detection
   - Improved error messages for rate limits, auth, and network errors
   - Added logging for rate limit monitoring

### Key Features

- **Transparent Fallback**: No code changes needed to use fallback key
- **Production Monitoring**: Clear console logs for rate limit events
- **User-Friendly Errors**: Distinct error messages for different failure types
- **Graceful Degradation**: System continues functioning within rate limits

## Error Handling

The system handles these error types with specific messages:

| Error Type | HTTP Code | Message |
|-----------|-----------|---------|
| Rate Limit | 429 | "API rate limit exceeded. Please wait a moment and try again." |
| Auth Error | 401 | "API authentication failed. Please verify your API keys are configured correctly." |
| Connection Error | 503 | "Connection error. Please check your internet connection and try again." |
| Other Errors | 500 | Generic error with specific message details |

## Monitoring

Monitor these log messages for rate limit issues:

```
⚠ Rate limit hit: (Fallback key available)
⚠ Rate limit hit: (No fallback configured)
```

When you see these warnings:
1. Check your API usage in Google Cloud Console
2. Consider upgrading your Gemini API plan
3. Implement request throttling on the client side
4. Use the fallback key for production stability

## Best Practices

1. **Always use two keys in production** for maximum uptime
2. **Rotate keys periodically** for security
3. **Monitor rate limit warnings** in logs
4. **Test fallback configuration** before deployment
5. **Set up alerts** for rate limit detection in your monitoring system

## Troubleshooting

### Fallback Key Not Working
- Verify both keys are valid in Google Cloud Console
- Check `.env.local` has `GOOGLE_GENERATIVE_AI_API_KEY_FALLBACK` set
- Restart the development server after setting environment variables

### Still Getting Rate Limits
- Check API usage quota in Google Cloud Console
- Consider upgrading your API plan
- Implement client-side request throttling
- Space out large batch requests

### Key Configuration Not Detected
- Ensure `.env.local` is in the project root
- Verify no typos in variable names
- Restart `npm run dev` after changes
- Check console logs on startup for configuration status

## Future Improvements

Potential enhancements:
1. Automatic retry with fallback key on rate limit errors
2. Request queuing and rate limiting on the client
3. Circuit breaker pattern for API calls
4. Metrics collection for rate limit events
5. Multi-region API key support
