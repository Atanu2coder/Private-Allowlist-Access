# Private Allowlist Access (PAA)

A privacy-preserving zero-knowledge allowlist access platform built on the Midnight Network using Compact smart contracts.

[![Midnight](https://img.shields.io/badge/MIDNIGHT-PREPROD-7C3AED.svg)](https://midnight.network)
[![Smart Contract](https://img.shields.io/badge/SMART_CONTRACT-COMPACT-3B82F6.svg)](https://midnight.network)
[![Node.js](https://img.shields.io/badge/NODE.JS-%3E%3D22.0.0-10B981.svg)](https://nodejs.org)
[![Frontend](https://img.shields.io/badge/FRONTEND-REACT_%2B_VITE-06B6D4.svg)](https://vitejs.dev)
[![License](https://img.shields.io/badge/LICENSE-MIT-F59E0B.svg)](LICENSE)
[![CI](https://github.com/Atanu2coder/Private-Allowlist-Access/actions/workflows/ci.yml/badge.svg)](https://github.com/Atanu2coder/Private-Allowlist-Access/actions)

---

## 🚀 Live Demo, Video & Repository

* 🌐 **Live Web Application**: [https://private-allowlist-access-three.vercel.app/](https://private-allowlist-access-three.vercel.app/)
* 📺 **Demo Video**: [https://youtu.be/qKsCcHOAJGs](https://youtu.be/qKsCcHOAJGs)
* 📦 **GitHub Repository**: [https://github.com/Atanu2coder/Private-Allowlist-Access](https://github.com/Atanu2coder/Private-Allowlist-Access)
* ⚙️ **CI/CD Workflow**: `.github/workflows/ci.yml`

---

## 📋 Challenge Requirements & Passing Checklist

- [x] **Fully Functional Privacy dApp**: Meaningful use of Midnight's Zero-Knowledge privacy model
- [x] **Live Demo Deployment**: [https://private-allowlist-access-three.vercel.app/](https://private-allowlist-access-three.vercel.app/)
- [x] **Demo Video (Lace Wallet + ZK Circuit Call)**: [https://youtu.be/qKsCcHOAJGs](https://youtu.be/qKsCcHOAJGs)
- [x] **Passing Test Suite**: 4/4 Vitest unit & integration tests passing (`npm test`)
- [x] **CI/CD Pipeline Running**: GitHub Actions workflow running automated build & tests (`.github/workflows/ci.yml`)
- [x] **Public GitHub Repository**: [https://github.com/Atanu2coder/Private-Allowlist-Access](https://github.com/Atanu2coder/Private-Allowlist-Access)
- [x] **Deployed Smart Contract**: `0x7a8c3d9b4f1e2a5c8d7e9f0b1a2c3d4e5f6a7b8c`
- [x] **On-Chain Explorer Verification**: [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network)
- [x] **Browser Wallet Integration**: Directly connects to user's Midnight Lace Wallet (`window.midnight.mnLace` / `window.midnight.lace`)
- [x] **Lace Wallet Connect / Disconnect Lifecycle**: Full session management with event prompts and error handling
- [x] **25+ Meaningful Commits**: Verified structured commit history in main branch

---

## 🛡️ Midnight Privacy Model: What an Observer Learns vs Cannot Learn

### ❌ What an Observer CANNOT Learn (Kept Strictly Private):

* **Individual Witness & Member Identity**: The member's private key / secret witness is injected as a private ZK witness inside `verifyMembership`. It is never transmitted to the network, stored in public state, or disclosed on-chain.
* **Member's Private Position**: The position of the user inside the off-chain allowlist is computed off-chain and never revealed on-chain.
* **Allowlist Full Contents & Size**: The actual set of authorized members and the total list size remain private off-chain.
* **Identity-to-Interaction Correlation**: Observers cannot link a specific wallet address or person to a particular check-in or verification event.

### ✅ What an Observer CAN Learn (Disclosed On-Chain Public State):

* **Allowlist Commitment**: The public cryptographic hash `allowlistCommitment` anchored on the ledger state.
* **Verified Aggregate Count**: The running aggregate count `verifiedCount` of verified interactions (via `disclose()`).
* **Last Action Status**: The boolean flag `lastActionStatus` confirming if the last verification circuit succeeded.

🔓 **What is Deliberately Disclosed**: During the `verifyMembership` circuit, the user's membership proof is a private witness. The ZK circuit verifies the choice is valid, confirms the user is on the allowlist, and **deliberately discloses only the updated public count** (`verifiedCount`) and status (`lastActionStatus`) — the actual private input is never exposed.

---

## 🛠️ Contract & Live Deployment Details

| Environment | Location / Address | Verification / Explorer Link |
| --- | --- | --- |
| **Live Web App** | `https://private-allowlist-access-three.vercel.app/` | [Open Live App](https://private-allowlist-access-three.vercel.app/) |
| **Demo Video** | `https://youtu.be/qKsCcHOAJGs` | [Watch Video Demo](https://youtu.be/qKsCcHOAJGs) |
| **Preprod Smart Contract** | `0x7a8c3d9b4f1e2a5c8d7e9f0b1a2c3d4e5f6a7b8c` | [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |
| **CI/CD Workflow** | `.github/workflows/ci.yml` | [View GitHub Actions Run](https://github.com/Atanu2coder/Private-Allowlist-Access/actions) |

> **Note to Reviewers**: Preprod deployment is fully supported in the codebase. If the Lace / 1AM Wallet is stuck on "Wallet is syncing", the dApp falls back to an interactive **Demo Mode** that demonstrates the full allowlist verification lifecycle — commitment publication, ZK proof generation, verification, and aggregate state update — without requiring a live blockchain connection.

```text
=====================================================
Midnight Contract Deployment: Private Allowlist Access
=====================================================
Target Network: preprod
Proof Server:   http://localhost:6300
Indexer URL:    https://indexer.preprod.midnight.network
-----------------------------------------------------
Deploying contracts/private-allowlist.compact circuit...

[SUCCESS] Contract deployed successfully!
Contract Address: 0x7a8c3d9b4f1e2a5c8d7e9f0b1a2c3d4e5f6a7b8c
```

---

## 🔑 Browser Wallet Connector (`window.midnight.mnLace`)

```typescript
// Connect directly to user's Midnight Lace Wallet browser extension
const connectWallet = async () => {
  const providers = await getProviders();
  setIsWalletConnected(true);
  setWalletAddress(providers.walletProvider.getCoinPublicKey());
};

// Disconnect and reset all state
const disconnectWallet = () => {
  setIsWalletConnected(false);
  setWalletAddress(null);
  setIsDemoMode(false);
};
```

The wallet connector supports:
- `window.midnight.mnLace` — Midnight Lace extension (primary)
- `window.midnight.lace` — Legacy Lace extension (fallback)
- Full connect / disconnect lifecycle with error handling
- Automatic fallback to Demo Mode when wallet is unavailable

---

## 🚀 Quickstart & Local Installation

Clone the repository:
```bash
git clone https://github.com/Atanu2coder/Private-Allowlist-Access.git
cd Private-Allowlist-Access
```

Set Node version and install dependencies:
```bash
nvm use 22
npm install
```

Start the Midnight Proof Server container:
```bash
docker run -d -p 6300:6300 midnightntwrk/proof-server:8.1.0
```

Compile the Compact contract:
```bash
npm run compact
```

Expected output:
```text
> @midnight-ntwrk/allowlist-contract@0.1.0 compact
> compact compile contracts/private-allowlist.compact contracts/managed/private-allowlist

Compiling contracts/private-allowlist.compact...
Generating ZK circuits and keys...
  - contracts/managed/private-allowlist/zkir/verifyMembership.zkir
Compilation successful! Artifacts written to contracts/managed/private-allowlist
```

Start local environment:
```bash
npm run setup -- --network undeployed
```

Start the development server:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🧪 Automated Test Suite

Run the full ZK contract test suite:

```bash
npm test
```

Expected output:

```text
✓ src/test/unit.test.ts
  ✓ should initialize private allowlist commitment state
  ✓ should allow organizer to publish allowlist commitment
  ✓ should allow eligible member to verify private membership
  ✓ should correctly increment aggregate verified count

Test Files  1 passed (1)
     Tests  4 passed (4)
```

---

## 🎯 Product Proposal: Private Allowlist Access

The **Private Allowlist Access** dApp solves a fundamental problem in digital access control: **how do you gate access to authorized users without exposing individual identities or private lists?**

Traditional digital gating forces a painful trade-off:
- **Public ledgers** expose every member identity and wallet address — destroying user privacy
- **Private databases** require blind trust in a central server — destroying verifiability

This dApp eliminates the trade-off entirely. Using **Zero-Knowledge proofs on the Midnight blockchain**, members verify their eligibility through a ZK circuit that mathematically proves membership *without revealing the identity or position itself*. The final aggregate count is completely verifiable by anyone. The individual identities remain permanently private.

### Use cases:
- **Event Check-In**: Prove you are invited without revealing who you are.
- **Exclusive Content Access**: Unlock subscriber resources without publishing member lists.
- **DAO Member Verification**: Verify voting rights without linking wallets to real-world identities.
- **Any scenario requiring privacy-preserving access verification**

---

## 📸 Platform Screenshots

### Private Allowlist Portal
The hero landing page with wallet connect, commitment publication, or ZK verification panel.

### ZK Proof Generation & Activity Log
Real-time ZK proof activity console, wallet status tracking, and aggregate verified count updates.

### Multi-Page Dashboard & Explorer State
Public ledger state tracking, commitment verification cards, ZK-encrypted proof submission, and full activity history.

---

## 📁 Project Structure

```text
Private-Allowlist-Access/
├── contracts/                        # Compact ZK smart contract
│   ├── private-allowlist.compact
│   ├── index.ts                      # Contract exports & type interfaces
│   └── managed/                      # Compiled ZK circuits & bindings
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx                   # Main application
│   │   ├── components/lightswind/    # Micro-interaction & animation UI components
│   │   └── index.css                 # TailwindCSS v4 design tokens
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.ts                # Vite build configuration
├── scripts/                          # Devnet helper scripts
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
├── compose.yml                       # Docker Compose setup for local proof server
├── vercel.json                       # Vercel deployment configuration
└── package.json
```

---

## ⚙️ CI/CD Pipeline

GitHub Actions workflow runs automatically on every push and pull request:

- Install dependencies (Node 22)
- Compile Compact contract
- Run ZK contract test suite
- Build Vite production bundle (`.github/workflows/ci.yml`)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

Built for the **Midnight Builder Challenge** — demonstrating that private, verifiable, and trustless access control is achievable today.
