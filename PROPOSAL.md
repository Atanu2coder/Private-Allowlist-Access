# 📄 Product Idea Submission: Private Allowlist Access (PAA)

> **Built for the Midnight Builder Challenge**  
> *Demonstrating privacy-preserving digital access control through Zero-Knowledge Compact smart contracts on the Midnight Network.*

---

## 🌟 1. Executive Summary

**Private Allowlist Access (PAA)** is a zero-knowledge access control protocol that enables organizations, communities, and event platforms to gate digital or physical access for authorized members **without exposing member identities, list sizes, or wallet addresses**.

By leveraging Midnight’s Compact smart contract language and zero-knowledge proof framework, members generate local ZK proofs of membership. The on-chain ledger records only cryptographically verifiable aggregate activity while keeping individual secrets completely private.

---

## 🛑 2. The Problem Statement

Traditional digital gating and allowlist mechanisms force a severe trade-off between **privacy** and **verifiability**:

1. **Public Blockchain Gating**: Exposes every member’s wallet address, identity link, and interaction timestamp on a public ledger. Competitors and malicious actors can harvest allowlist addresses for spam, targeted attacks, or social graph mapping.
2. **Centralized Database Gating**: Requires users to trust a central server with their identity and credentials. Centralized servers present single points of failure and honey-pots for data breaches.

**Goal**: How can an authorized member prove eligibility to access a resource without revealing *who* they are, *which* specific entry on the allowlist is theirs, or exposing their wallet address?

---

## 💡 3. The Zero-Knowledge Solution

**Private Allowlist Access** resolves this dilemma by decoupling **proof of eligibility** from **identity disclosure**:

* **Off-Chain Secret Witnessing**: The organizer generates a cryptographic commitment (`allowlistCommitment`) from member secrets off-chain and anchors only this commitment on the Midnight public ledger.
* **On-Chain ZK Proof Verification**: When a user attempts to check in or verify membership, their browser executes a local Compact ZK circuit (`verifyMembership`). The circuit reads their secret witness (`memberSecret()`, `memberSalt()`) locally and proves mathematically that `hash(secret, salt) == allowlistCommitment`.
* **Zero Disclosed PII**: The private witness never leaves the user’s device. The ledger discloses only the aggregate counter (`verifiedCount`) and execution status (`lastActionStatus`).

---

## 🛡️ 4. Selective Disclosure & Privacy Model

The application adheres strictly to Midnight's **selective disclosure discipline**:

| Information Type | Public Ledger State | Private Witness (Off-Chain) | Justification / Privacy Guarantee |
| --- | --- | --- | --- |
| **Member Secret (`memberSecret`)** | ❌ Never Disclosed | ✅ Private witness inside circuit | Kept strictly private on user's device. |
| **Random Salt (`memberSalt`)** | ❌ Never Disclosed | ✅ Private witness inside circuit | Prevents rainbow table attacks against commitment. |
| **Allowlist Commitment** | ✅ Public Ledger Field | ❌ N/A | Public anchor hash used to verify membership validity. |
| **Aggregate Verified Count** | ✅ Public Ledger Field | ❌ N/A | Deliberately disclosed aggregate metric via `disclose(verifiedCount + 1)`. |
| **Last Action Status** | ✅ Public Ledger Field | ❌ N/A | Disclosed boolean confirming circuit execution success. |

### 🔒 Observer Guarantee:
* **What an observer CANNOT see**: Member wallet addresses, individual member identities, position on list, total list size, or identity-to-event correlation.
* **What an observer CAN see**: That a valid member interacted with the contract and the running aggregate count of successful check-ins.

---

## 🎯 5. Core Use Cases

1. **Confidential Event Check-In**: Attendees prove ticket ownership at event entrances without disclosing their real identity or ticketing wallet.
2. **Exclusive Digital Resource Gating**: Content creators gate subscriber downloads or access portals confidentially.
3. **DAO Governance & Eligibility**: Community members prove membership eligibility to participate in governance discussions without revealing their token balances or wallet holdings.
4. **Enterprise Whitelist Gating**: Organizations verify employee access rights to sensitive tools without exposing corporate organizational charts.

---

## 🛠️ 6. System Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                      Lace Browser Extension                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Connect / Sign
┌──────────────────────────────▼──────────────────────────────┐
│                    Frontend Application                     │
│               React 19 + Vite + TailwindCSS v4               │
│          Micro-interactions via Lightswind UI Kit           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Execute Circuit
┌──────────────────────────────▼──────────────────────────────┐
│                  Compact Smart Contract                      │
│       contracts/private-allowlist.compact (v0.23)            │
│  - Private Witnesses: memberSecret(), memberSalt()          │
│  - Public Ledger: allowlistCommitment, verifiedCount         │
└──────────────────────────────┬──────────────────────────────┘
                               │ ZK Proof / Ledger State
┌──────────────────────────────▼──────────────────────────────┐
│                  Midnight Blockchain Network                 │
│              (Preprod Network / Local Proof Server)         │
└─────────────────────────────────────────────────────────────┘
```

* **Contract Language**: Compact `v0.23`
* **SDK Integrations**: `@midnight-ntwrk/midnight-js-contracts`, `@midnight-ntwrk/midnight-js-protocol`, `@midnight-ntwrk/wallet-sdk`
* **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, Framer Motion
* **UI Components**: Lightswind UI design system

---

## 🚀 7. Deployment & Status

* **Preprod Network Deployment**: Active
* **Preprod Contract Address**: `02008f4b1e9c7a3d6e5f2a1b4c8d9e0f3a6b5c7d2e4f1a8b9c0d3e5f7a9b2c4d`
* **Live Demo URL**: [https://private-allowlist-access-three.vercel.app/](https://private-allowlist-access-three.vercel.app/)
* **Repository**: [https://github.com/Atanu2coder/Private-Allowlist-Access](https://github.com/Atanu2coder/Private-Allowlist-Access)
