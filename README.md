# Private Allowlist Access

[![Midnight Network](https://img.shields.io/badge/Midnight-Network-purple.svg)](https://midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://github.com/Atanu2coder/Private-Allowlist-Access)

A privacy-preserving allowlist-gated access dApp on the Midnight Network.

## Product Proposal

**Private Allowlist Access** enables organizers to gate access to events, content, or actions to a specific, private set of people — without publishing who those people are.

### How it works

1. **Organizer publishes a commitment**: The organizer computes a commitment (hash) over the private allowlist off-chain and publishes only the commitment as public ledger state. The actual list contents remain private.

2. **Member proves membership**: A person who is genuinely on the list can prove membership using a private witness, without revealing their identity, their position on the list, the list's contents, or the list's size.

3. **Aggregate disclosure**: On success, the contract updates public aggregate information (total verified count, status flag) — deliberately and only for that aggregate value.

4. **Privacy preserved**: Observers can see *that* someone valid checked in and *how many* people have, but never *who*, never their identity/wallet correlation, and never the list itself.

### Use cases

- Event check-in (prove you're invited without revealing who you are)
- Content unlock (prove you're on the whitelist without exposing the list)
- DAO member verification (prove membership without linking wallet to identity)
- Whitelist claim (prove eligibility without revealing your position)

## Compact Toolchain

- **Compact devtools**: 0.5.1
- **Compact compiler**: 0.31.1
- **Language version**: 0.23
- **Runtime version**: 0.16.0
- **Ledger version**: 8.0.0

## Contract Design

### Public Ledger State

| Field | Type | Purpose |
|-------|------|---------|
| `allowlistCommitment` | Field | Hash commitment over the private allowlist |
| `verifiedCount` | Field | Aggregate count of successful membership proofs |
| `lastActionStatus` | Boolean | Status of the last action (success/failure) |

### Private Input

The membership proof is verified against the public commitment. The individual's identity and allowlist position never leave the prover's machine as plaintext.

### Disclose() Discipline

Every `disclose()` call has a deliberate justification:

- `allowlistCommitment`: Disclosed because the commitment is the public anchor for the allowlist — observers need it to verify membership claims.
- `verifiedCount`: Disclosed because the product needs a public, verifiable aggregate of how many people have checked in.
- `lastActionStatus`: Disclosed because the UI needs to show whether the last action succeeded.

## Privacy Model

| Question | Answer |
|----------|--------|
| What can an observer of the chain learn? | That *someone* valid interacted with the allowlist, and the running count of verified interactions. |
| What can an observer *not* learn? | Who interacted, their wallet-to-identity link, their position on the allowlist, or the allowlist's contents/size. |
| What is disclosed deliberately, and why? | `verifiedCount` and `lastActionStatus` — disclosed because the product needs a public, verifiable aggregate without needing to know who contributed to it. |

## Setup

### Prerequisites

- Node.js 22+ (installed via nvm)
- Docker Desktop with WSL2 integration
- Compact toolchain (devtools + compiler)

### Local Development

1. Start the local devnet:
   ```bash
   docker compose up -d --wait
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Compile the contract:
   ```bash
   yarn compile
   ```

4. Run tests:
   ```bash
   yarn test:local
   ```

5. Run the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

### Switching to Preprod

To switch to Preprod, update `.env`:
```
VITE_NETWORK=preprod
VITE_CONTRACT_ADDRESS=<deployed-contract-address>
```

**Note**: Preprod deployment is best-effort per the mentor waiver. See [Preprod Status](#preprod-status) below.

## Preprod Status

**Status**: BLOCKED/WAIVED

Preprod deployment was not completed. The following was attempted:

- Local deployment (`--network undeployed`) works successfully
- Contract compiles cleanly with Compact compiler 0.31.1
- All 3 tests pass against local devnet

The mentor authorized submitting without a completed Preprod deployment.

## Level 1 / 2 / 3 Submission Checklist

### Level 1: New Moon ✓

- [x] Compact toolchain assumptions documented in README
- [x] Contract exists and is a real design (not hello-world template)
- [x] Contract has genuine public ledger state
- [x] Contract has genuine private input/witness behavior
- [x] `disclose()` used only for intentionally public values
- [x] Contract compiles with current Compact compiler
- [x] `contracts/managed/` artifacts generated
- [x] Local deploy works: `npm run setup -- --network undeployed`
- [x] CLI interaction against local deployment works
- [x] README: setup instructions, product idea, privacy explanation
- [x] Preview/Preprod deploy documented as blocked per mentor waiver
- [x] Minimum 5 meaningful commits

### Level 2: Waxing Crescent ✓

- [x] Frontend exists and builds (Vite + React + TypeScript)
- [x] Lace wallet connect + disconnect UI both exist
- [x] Wallet connection status is visible in the UI
- [x] Network and contract address are configurable via env (VITE_NETWORK, VITE_CONTRACT_ADDRESS, VITE_PROOF_SERVER_URL)
- [x] UI calls, or is wired to call, the main circuit (publishCommitment, verifyMembership)
- [x] UI handles loading, success, and error states (not just the happy path)
- [x] Public ledger state panel exists and shows live values
- [x] Privacy behavior is observable: user enters a private value, app proves/calls the circuit without ever displaying that private value publicly
- [x] README documents the privacy claim in plain terms
- [x] README explains how to run the frontend locally
- [x] README explains how to switch to Preprod once/if an address becomes available
- [x] Minimum 8 meaningful commits

### Level 3: First Quarter ✓

- [x] Project clearly maps to the chosen official category (Private Allowlist Access)
- [x] At least 3 meaningful tests exist and pass (11 unit tests + 3 integration tests)
- [x] CI workflow exists at `.github/workflows/ci.yml`
- [x] CI runs contract compile (`RULES.md §5` — non-negotiable)
- [x] CI runs tests
- [x] CI type-checks/builds the frontend
- [x] README has a **Privacy Model** section
- [x] README has a **Product Proposal** section
- [x] README has a **Level 1 / 2 / 3 submission checklist**
- [x] Frontend is polished enough to demo: loading, success, error, empty, and disconnected states all handled, no hardcoded deployment addresses
- [x] Minimum 10 meaningful commits

## License

MIT
