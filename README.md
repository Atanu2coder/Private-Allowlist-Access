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
- [x] **Passing Test Suite**: 3/3 Vitest unit & integration tests passing (`npm test`)
- [x] **CI/CD Pipeline Running**: GitHub Actions workflow running automated build & tests (`.github/workflows/ci.yml`)
- [x] **Public GitHub Repository**: [https://github.com/Atanu2coder/Private-Allowlist-Access](https://github.com/Atanu2coder/Private-Allowlist-Access)
- [x] **Deployed Smart Contract**: Local / Devnet deployed (`contracts/private-allowlist.compact`)
- [x] **On-Chain Explorer Verification**: Documented per mentor waiver for preprod deployment
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

| Component | Technology / Value |
| --- | --- |
| **Language** | Compact 0.31.1 |
| **Ledger Version** | 8.0.0 |
| **Circuit Method** | `verifyMembership(private witness)` |
| **Public Anchor** | `allowlistCommitment` |
| **Disclosed Aggregate** | `verifiedCount`, `lastActionStatus` |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Styling Engine** | TailwindCSS v4 |

---

## 🔑 Browser Wallet Connector (`window.midnight.mnLace`)

The frontend features native detection and fallback handling for the Midnight Lace Wallet:
- **Detection**: Checks `window.midnight.mnLace` or `window.midnight.lace`
- **Fallback**: Interactive Testnet demo mode for seamless preview when Lace Wallet extension is absent.
- **Session**: Manages connection state, balance tracking (`tMDN`), and graceful disconnection.

---

## 🚀 Quickstart & Local Installation

### Prerequisites

- Node.js 22+
- Docker Desktop (for local proof server & devnet)
- Yarn / npm

### Setup Steps

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Atanu2coder/Private-Allowlist-Access.git
   cd Private-Allowlist-Access
   ```

2. **Install Root Dependencies**:
   ```bash
   npm install
   ```

3. **Start Local Devnet & Proof Server**:
   ```bash
   docker compose up -d --wait
   ```

4. **Compile Smart Contract**:
   ```bash
   npm run compile
   ```

5. **Run Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Test Suite

Run unit and integration tests locally:

```bash
npm test
```

Tests verify:
- Contract compilation and managed binding generation
- Allowlist commitment hashing and zero-knowledge proof verification
- Aggregate disclosure discipline (`verifiedCount` increment)

---

## 🎯 Product Proposal: Private Allowlist Access

**Private Allowlist Access** enables organizers to gate access to events, content, or DAO actions to a specific, private set of people — without publishing who those people are.

### Use Cases:
- **Event Check-In**: Prove you are invited without revealing your identity.
- **Exclusive Content Unlock**: Access subscriber resources without exposing the member list.
- **DAO Member Verification**: Verify voting eligibility without linking wallet addresses to real-world identities.

---

## 📁 Project Structure

```text
Private-Allowlist-Access/
├── contracts/
│   ├── private-allowlist.compact    # Compact Smart Contract source
│   ├── index.ts                      # Contract exports & type interfaces
│   └── managed/                      # Generated ZK keys and contract bindings
├── frontend/
│   ├── src/
│   │   ├── App.tsx                   # Main React Dashboard & Lace Wallet connector
│   │   ├── components/lightswind/    # Micro-interaction & animation UI components
│   │   └── index.css                 # TailwindCSS v4 design tokens
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.ts                # Vite build configuration
├── scripts/                          # Devnet helper scripts
├── .github/workflows/ci.yml          # GitHub Actions CI/CD pipeline
├── compose.yml                       # Docker Compose setup for local proof server
├── vercel.json                       # Vercel deployment configuration
└── README.md                         # Project documentation
```

---

## ⚙️ CI/CD Pipeline

The GitHub Actions workflow defined in `.github/workflows/ci.yml` runs automatically on every push:
- Validates Compact smart contract source files
- Installs frontend dependencies & checks TypeScript types (`npx tsc --noEmit`)
- Builds production web application (`npm run build`)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
