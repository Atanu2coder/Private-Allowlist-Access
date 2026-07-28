# DESIGN.md

Covers architecture, contract design, frontend design, wallet/network integration, folder
structure, and CI pipeline design in one place. (Consolidated from what would otherwise be
separate `architecture.md` / `frontend.md` / `backend.md` / `blockchain.md` files — split
this out later if any one section outgrows the file.)

---

## 1. Architecture Overview

```
                     ┌─────────────────────────┐
                     │      Lace Wallet         │  (browser extension)
                     └────────────┬────────────┘
                                  │ connect / sign
                     ┌────────────▼────────────┐
                     │   Frontend (Vite+React)  │  Lightswind UI components
                     │  - wallet connect UI      │
                     │  - private-input form     │
                     │  - public state panel     │
                     └────────────┬────────────┘
                                  │ circuit calls
                     ┌────────────▼────────────┐
                     │   Compact Contract        │  contracts/*.compact
                     │  - public ledger state     │  → contracts/managed/ (generated)
                     │  - private witness inputs  │
                     │  - disclose() boundary     │
                     └────────────┬────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                                       ▼
   ┌─────────────────────┐               ┌─────────────────────────┐
   │  Local proof server   │               │  Network (undeployed /   │
   │  (Docker, port 6300)  │               │  Preprod indexer + node) │
   └─────────────────────┘               └─────────────────────────┘
```

There is no separate custom backend/API server in v1. "Backend" logic lives entirely in
the Compact contract plus the Midnight indexer/proof-server infrastructure. If a future
version needs off-chain indexing or notifications, that would be introduced as an explicit
addition to this diagram, not assumed.

## 2. Contract Design (Blockchain Layer)

**Folder:** `contracts/<project-name>.compact` → compiled output in
`contracts/managed/<project-name>/`.

**Public ledger state (visible to anyone watching the chain):**
- `allowlistCommitment` — a commitment (e.g. hash/Merkle root) over the private allowlist.
  Never the list itself.
- `verifiedCount` — aggregate count of successful membership proofs (via `disclose()`).
- `lastActionStatus` — a boolean/enum status flag if the UI needs one (via `disclose()`).

**Private witness/input (never leaves the prover's machine as plaintext):**
- The user's individual allowlist entry/secret.
- Their membership path/proof material against `allowlistCommitment`.

**`disclose()` discipline:** every `disclose()` call should be next to a one-line comment
explaining *why* that specific value is safe to make public. If a value doesn't have an
obvious one-sentence justification, it probably shouldn't be disclosed.

**Compact toolchain:** compile with whatever `compact compile --version` currently reports
(see `RULES.md` §1). Don't pin an exact patch version in scripts unless there's a specific
compatibility reason to.

## 3. Frontend Design

**Stack:** Vite + React (or the framework `create-mn-app` scaffolds), Tailwind CSS.

**UI kit:** [Lightswind UI](https://lightswind.com/) — a Tailwind + Framer Motion component
library with a shadcn-style "copy the source into your repo, own the code" model rather
than a runtime dependency. Practical implications for this project:

- Install via CLI, not a single npm package pull: `npx create-lightswind` (scaffolds
  `src/components/lightswind/`, `src/lib/`, theme config, and TypeScript types) or
  `npx lightswind add <component>` for individual components.
- Because components are copied into the repo, they show up in `git diff` like any other
  source file — that's expected, not bloat.
- Lightswind ships an MCP server, so a coding agent connected to it can search components,
  read usage docs, and install them directly instead of guessing at APIs — worth wiring up
  if the agent supports MCP servers.
- Recommended components for this project: form/input components for the private-value
  entry, a card/panel component for the public-state display, alert/toast for
  success/error states, and a skeleton/loading component for the loading state.

**Required UI states (Level 2 + Level 3):**
1. Disconnected (no wallet connected yet)
2. Connecting / loading (circuit call in flight)
3. Success (circuit call resolved, public state updated)
4. Error (circuit call failed — show *why*, not a generic failure)
5. Empty (no public state yet, e.g. allowlist not yet published)

**Env variables (see `.env.example`):**
```
VITE_NETWORK=undeployed
VITE_CONTRACT_ADDRESS=
VITE_PROOF_SERVER_URL=http://localhost:6300
```
No contract address should ever be hardcoded outside of these env vars.

## 4. Wallet & Network Integration

- Lace connect/disconnect buttons, with visible connection + network status at all times.
- Network switch (`undeployed` → `preprod`) should be a config change, not a code change —
  driven entirely by `VITE_NETWORK` and `VITE_CONTRACT_ADDRESS`.
- If Preprod sync hangs: confirm endpoints first —
  ```bash
  curl -I https://rpc.preprod.midnight.network
  curl -I https://indexer.preprod.midnight.network/api/v4/graphql
  ```
  (HTTP 405 on a HEAD request is fine — it means the endpoint is up.) Print the wallet
  address before syncing, fund only the `mn_addr_preprod...` address shown, and never
  delete `.midnight-state.json` after funding.

## 5. Suggested Folder Structure

```
<project-name>/
├── contracts/
│   ├── <project-name>.compact
│   └── managed/<project-name>/        # generated, gitignored contents as appropriate
├── frontend/
│   ├── src/
│   │   ├── components/lightswind/     # Lightswind-installed components
│   │   ├── components/                # project-specific components
│   │   ├── lib/
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
├── tests/
├── .github/workflows/ci.yml
├── README.md
├── AGENT.md
├── PROJECT.md
├── RULES.md
├── PHASE.md
├── DESIGN.md
├── MEMORY.md                          # created by the coding agent, not by hand
└── .env.example
```

## 6. CI/CD Pipeline Design

`.github/workflows/ci.yml`, triggered on push and pull request, in this order:

1. Checkout + install dependencies (root and `frontend/` if separate).
2. Install/set up the Compact toolchain (installer script + `compact update`).
3. **Compile the contract** — `npm run compile` or the equivalent direct invocation
   (e.g. `compact compile contracts/<name>.compact contracts/managed/<name>`). This step
   is mandatory per `RULES.md` §5 — CI that skips it is a fail, not a partial pass.
4. Run tests — `npm test`.
5. Build/type-check the frontend — `cd frontend && npm install && npm run build`.

## 7. Privacy Model Skeleton (fill in for the README's Privacy Model section)

| Question | Answer for this project |
|---|---|
| What can an observer of the chain learn? | That *someone* valid interacted with the allowlist, and the running count of verified interactions. |
| What can an observer *not* learn? | Who interacted, their wallet-to-identity link, their position on the allowlist, or the allowlist's contents/size. |
| What is disclosed deliberately, and why? | `verifiedCount` / status flags — disclosed because the product needs a public, verifiable aggregate without needing to know who contributed to it. |
