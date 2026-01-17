# Complete Authentication & Wallet Integration Flow

## Overview

The app now supports dual authentication methods with seamless integration:

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER ENTRY POINTS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Path 1: Farcaster Frame          Path 2: Direct Web Link        │
│  (/terminal or /)                 (/landing)                     │
│         │                                 │                      │
│         ├─ Auto-detect SDK        ├─ Display options             │
│         │  available              │                              │
│         └─ Load Farcaster context  └─ User clicks "Connect       │
│                                       Wallet"                    │
│                                                                   │
└──────────────────────────┬───────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
   ┌────▼─────────────┐          ┌──────────▼──────────┐
   │   FARCASTER      │          │   WALLETCONNECT     │
   │   SDK Context    │          │   MetaMask          │
   │                  │          │                     │
   │ • FID            │          │ • address           │
   │ • username       │          │ • chainId           │
   │ • displayName    │          │ • balance           │
   │ • wallet address │          │ • chain name        │
   └────┬─────────────┘          └──────────┬──────────┘
        │                                    │
        └──────────────────┬─────────────────┘
                           │
              ┌────────────▼────────────┐
              │  useAuthenticatedUser   │
              │      Hook              │
              │                        │
              │ Unified Interface:     │
              │ • user (CombinedUser)  │
              │ • isLoading            │
              │ • error                │
              │ • isFarcaster          │
              │ • isWalletConnect      │
              └────────────┬───────────┘
                           │
              ┌────────────▼────────────┐
              │   Terminal Page         │
              │   (/terminal)           │
              │                        │
              │ • Display user info    │
              │ • Accept commands      │
              │ • Route to agent       │
              │ • Sign transactions    │
              └────────────┬───────────┘
                           │
              ┌────────────▼────────────┐
              │   Agent Processing     │
              │   (/api/agent)         │
              │                        │
              │ • Parse commands       │
              │ • Execute tools        │
              │ • Return results       │
              └────────────┬───────────┘
                           │
              ┌────────────▼────────────┐
              │   Transaction Signing  │
              │  (/api/sign-transaction)
              │                        │
              │ • Validate tx data     │
              │ • Use CDP wallet       │
              │ • Return tx hash       │
              └────────────┬───────────┘
                           │
              ┌────────────▼────────────┐
              │   Base Blockchain      │
              │                        │
              │ • Broadcast tx         │
              │ • Confirm on-chain     │
              │ • Return receipt       │
              └────────────────────────┘
```

## Data Flow: Complete Transaction

### Step 1: User Access
```
User opens app via Farcaster Frame or direct link
         ↓
App detects source (Farcaster or Web)
         ↓
WalletProvider + MiniAppProvider initialize
         ↓
useAuthenticatedUser determines auth source
         ↓
App redirects to /terminal or /landing
```

### Step 2: User Interaction
```
User types command in terminal
"send 1 ETH to 0x123..."
         ↓
handleCommand() in terminal/page.tsx processes
         ↓
parseCommandInput() expands aliases if needed
         ↓
Check if local command (help, clear) → handle locally
         ↓
Otherwise: POST /api/agent with message
```

### Step 3: Agent Processing
```
POST /api/agent receives command
         ↓
createAgent() initializes with CDP wallet
         ↓
generateText() calls LLM with command
         ↓
LLM generates response with tool calls
         ↓
Tools execute (balance check, wallet ops, etc.)
         ↓
Response returned to client
```

### Step 4: Transaction Detection
```
Terminal receives agent response
         ↓
Check if response contains transaction pattern
         ↓
parseTransactionFromResponse() extracts tx data
         ↓
Valid tx data found
         ↓
POST /api/agent/sign-transaction with tx details
         ↓
Include userWalletAddress from:
  • user.walletAddress (if Farcaster)
  • user.address (if WalletConnect)
```

### Step 5: Transaction Signing
```
POST /api/agent/sign-transaction
         ↓
Validate transaction parameters
         ↓
Re-create agent with CDP wallet
         ↓
Construct instruction for agent to execute tx
         ↓
Agent calls AgentKit wallet tools
         ↓
CDP wallet signs transaction
         ↓
Transaction broadcast to Base Sepolia
         ↓
Return transaction hash to client
         ↓
Terminal displays: "Transaction hash: 0x..."
```

## Authentication Priority Matrix

```
Scenario                    Result                    Source
─────────────────────────────────────────────────────────────
Running in Farcaster     Farcaster auto-loads      SDK detects
Frame                    Wallet from context       iframe context

Farcaster Frame + Failed  Falls back to             Catches error,
to load SDK               WalletConnect             redirects gracefully

Direct web access        Shows landing with        No SDK context
(no Farcaster)           Connect Wallet button

Farcaster Frame +         Farcaster priority       useAuthenticatedUser
WalletConnect connected   (ignores WalletConnect)  checks Farcaster first

Browser without wallet    Landing page shows       Can't connect,
extension                 helpful error message     directs to install
```

## State Management During Session

### Farcaster User Session
```
Session Start
  └─ FID: 12345
  └─ Username: @alice
  └─ Wallet: 0x123...
  └─ Commands history: []

User executes "bal"
  └─ Agent returns balance
  └─ Stored in UserContext
  └─ Per-FID isolated

User executes "send 1 ETH"
  └─ Agent returns tx details
  └─ Endpoint signs with CDP wallet
  └─ Blockchain confirms
  └─ History updated
```

### WalletConnect User Session
```
Session Start
  └─ Address: 0x456...
  └─ Chain: base-sepolia
  └─ Balance: 5.2 ETH
  └─ Commands history: []

User executes "bal"
  └─ Agent returns balance
  └─ Displayed in terminal

User executes "send 1 ETH"
  └─ Agent returns tx details
  └─ Endpoint signs with CDP wallet
  └─ Blockchain confirms
  └─ Terminal shows hash
```

## Error Handling Flows

### MetaMask Not Installed
```
User clicks "Connect Wallet"
       ↓
window.ethereum check fails
       ↓
useWallet.connect() throws
       ↓
Landing page displays: "Please install MetaMask"
       ↓
User directed to extension marketplace
```

### Chain Switch Requested
```
User connects with Ethereum Mainnet
       ↓
connect() attempts wallet_switchEthereumChain
       ↓
MetaMask prompts user
       ↓
User approves or rejects
       ↓
Either:
  ✓ Switched to Base Sepolia → Terminal loads
  ✗ Rejected → Error message shown
```

### Insufficient Balance
```
User command: "send 100 ETH"
       ↓
Agent generates response
       ↓
Transaction detected
       ↓
Transaction sent to sign-transaction endpoint
       ↓
Agent attempts to execute with CDP wallet
       ↓
AgentKit returns "Insufficient balance" error
       ↓
Response: "Failed to execute transaction: Insufficient balance"
       ↓
Terminal displays error to user
```

## Security Checkpoints

```
┌─────────────────────────────────────────────────────┐
│              INPUT VALIDATION                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Landing Page                                      │
│  ├─ Validate wallet exists (window.ethereum)     │
│  └─ Validate address format (0x...)              │
│                                                     │
│  Terminal Page                                     │
│  ├─ Validate command format                       │
│  └─ Check authentication before execution         │
│                                                     │
│  Transaction Endpoint                             │
│  ├─ Validate recipient address                    │
│  ├─ Validate amount is positive                   │
│  ├─ Validate chain matches expectations           │
│  └─ Rate limit API calls                          │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│             AUTHORIZATION CHECKS                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Agent API (POST /api/agent)                       │
│  ├─ User message required                          │
│  ├─ Parse and validate command                     │
│  └─ Use CDP wallet (server-controlled)             │
│                                                     │
│  Transaction Signing                              │
│  ├─ User wallet address from context               │
│  ├─ Validate transaction data                      │
│  ├─ CDP wallet signs (not user's private key)     │
│  └─ Return only transaction hash                   │
│                                                     │
│  Terminal Page                                     │
│  ├─ Check useAuthenticatedUser returns valid user │
│  ├─ Redirect to landing if not authenticated      │
│  └─ Only show terminal if auth succeeds           │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│           DATA PRIVACY MEASURES                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ Private keys: Never stored on app              │
│  ✓ MetaMask: Handles all key management           │
│  ✓ Farcaster: Wallet via SDK only                 │
│  ✓ Session: Isolated per user (FID or address)   │
│  ✓ Transactions: Server-side signing only         │
│  ✓ History: Per-user, not shared                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Testing Paths

### Test Path 1: Full Farcaster Flow
1. Create Farcaster frame pointing to app
2. Open frame in Farcaster client
3. App auto-detects and loads user
4. Execute command (bal, send, etc.)
5. Terminal displays results
6. ✓ Verify per-user isolation with multiple users

### Test Path 2: Full WalletConnect Flow
1. Visit `/landing` directly
2. See "Connect Wallet" option
3. Click button → MetaMask opens
4. Approve connection
5. Automatically switch to Base Sepolia
6. Redirected to terminal
7. Execute commands
8. Transactions sign and broadcast
9. ✓ Verify all features work

### Test Path 3: Mixed Flow
1. Start with Farcaster frame (auto-auth)
2. Open new browser window
3. Visit direct landing page
4. Connect MetaMask wallet
5. Each session independent
6. ✓ Verify no cross-contamination

### Test Path 4: Error Recovery
1. Test MetaMask not installed
2. Test wallet rejection
3. Test insufficient balance
4. Test network error
5. ✓ Verify helpful error messages

## Rollout Checklist

- [ ] All files compile without errors
- [ ] Landing page displays correctly
- [ ] WalletConnect integration works
- [ ] Farcaster auto-detection still works
- [ ] Terminal works with both auth methods
- [ ] Transaction signing works with both sources
- [ ] Error handling for all scenarios
- [ ] No breaking changes to existing functionality
- [ ] Documentation updated
- [ ] Ready for production deployment
