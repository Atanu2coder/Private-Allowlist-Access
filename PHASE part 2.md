# PHASE.md

The build, in order. Each phase has a **goal**, a **checklist**, the **commands** that prove
it, and a **definition of done**. Do not start a phase until the previous one's definition of
done is met (or explicitly, honestly marked BLOCKED per `RULES.md` §6).

---

## Phase 0 — Environment Bring-Up (do this before any code)

**Goal:** Prove the Windows/WSL toolchain actually works before writing Compact.

Checklist:
- [ ] Confirm shell is Ubuntu WSL: `pwd`, `uname -a`
- [ ] Node 22+, WSL path: `node -v`, `which node` → `/home/<user>/.nvm/...`
- [ ] npm is WSL npm: `npm -v`, `which npm`
- [ ] Docker reachable from WSL: `docker --version`, `docker compose version`, `docker ps`
- [ ] Compact resolves correctly: `which compact`, `compact --version`,
      `compact compile --version` (see `RULES.md` §1 for what each number means)
- [ ] Project sits at a native WSL path, not `/mnt/c` or `/mnt/d`
- [ ] Port 6300 free, or the occupying proof-server container identified
      (`docker ps`)

**Definition of done:** every command above prints WSL-native output with no PATH
confusion. If any fails, fix it here — don't carry a broken environment into Phase 1.

---

## Phase 1 — Level 1: New Moon

**Goal:** A real Compact contract exists, compiles, and runs locally.

Checklist:
- [ ] Compact toolchain assumptions documented in README.
- [ ] Contract exists and is a real design — not the default hello-world template.
- [ ] Contract has genuine public ledger state.
- [ ] Contract has genuine private input/witness behavior.
- [ ] `disclose()` used only for intentionally public values (`RULES.md` §4).
- [ ] Contract compiles with the current Compact compiler (`compact compile`).
- [ ] `contracts/managed/` artifacts generated (circuits/keys present).
- [ ] Local deploy works: `npm run setup -- --network undeployed`.
- [ ] CLI interaction against the local deployment works.
- [ ] README: setup instructions, initial product idea, public-state-vs-private-witness
      explanation.
- [ ] Preview/Preprod deploy either completed **or** documented as blocked per the mentor
      waiver (`RULES.md` §6).
- [ ] Minimum 5 meaningful commits.

Commands:
```bash
npm run compile
npm run setup -- --network undeployed
npm run cli
```

**Definition of done:** contract compiles clean, `managed/` artifacts exist, local
deployment + CLI round-trip works, README covers the four required sections above.

---

## Phase 2 — Level 2: Waxing Crescent

**Goal:** A working frontend that talks to the contract and shows real state.

Checklist:
- [ ] Frontend exists and builds.
- [ ] Lace wallet connect + disconnect UI both exist.
- [ ] Wallet connection status is visible in the UI.
- [ ] Network and contract address are configurable via env
      (`VITE_NETWORK`, `VITE_CONTRACT_ADDRESS`, `VITE_PROOF_SERVER_URL`).
- [ ] UI calls, or is wired to call, the main circuit.
- [ ] UI handles loading, success, and error states (not just the happy path).
- [ ] Public ledger state panel exists and shows live values.
- [ ] Privacy behavior is observable: user enters a private value, app proves/calls the
      circuit without ever displaying that private value publicly.
- [ ] README documents the privacy claim in plain terms.
- [ ] README explains how to run the frontend locally.
- [ ] README explains how to switch to Preprod once/if an address becomes available.
- [ ] Minimum 8 meaningful commits.

Commands:
```bash
cd frontend
npm install
npm run build
```

**Definition of done:** a person can connect Lace, submit a private input, see the circuit
call resolve (success or error, both handled), and see the public state panel update — all
without the private input ever appearing anywhere observable.

---

## Phase 3 — Level 3: First Quarter

**Goal:** Production polish — tests, CI, and a submission-ready README.

Checklist:
- [ ] Project clearly maps to the chosen official category (Private Allowlist Access).
- [ ] At least 3 meaningful tests exist and pass.
- [ ] CI workflow exists at `.github/workflows/ci.yml`.
- [ ] CI runs contract compile (`RULES.md` §5 — non-negotiable).
- [ ] CI runs tests.
- [ ] CI type-checks/builds the frontend.
- [ ] README has a **Privacy Model** section: what observers can learn, what they cannot,
      what is disclosed deliberately and why.
- [ ] README has a **Product Proposal** section.
- [ ] README has a **Level 1 / 2 / 3 submission checklist**.
- [ ] Frontend is polished enough to demo: loading, success, error, empty, and
      disconnected states all handled, no hardcoded deployment addresses.
- [ ] Minimum 10 meaningful commits.

Commands:
```bash
npm run compile
npm test
npm run build
```

**Definition of done:** `npm test` passes with ≥3 meaningful tests, CI is green on a fresh
clone (contract compile + tests + frontend build all run in CI, not just locally), and the
README's Privacy Model / Product Proposal / checklist sections are complete and accurate.

---

## Verification Phase (run after any "we're done" claim, or after frontend/UI changes)

This mirrors the founder's post-build audit prompt. Order of operations: **inspect the repo
→ run checks → report**. Do not rewrite anything unless a check finds a real issue
(`RULES.md` §7).

1. **Repo inspection** — read the actual code, don't assume from commit messages.
2. **Environment checks** — confirm WSL/Node 22+/WSL npm/Docker/Midnight Compact per
   Phase 0.
3. **Run the commands:**
   ```bash
   npm run compile
   npm test
   npm run build
   ```
   and, inside `frontend/` if separate:
   ```bash
   npm install
   npm run build
   ```
   Run a type-check command if one exists. If local deploy is safe and Docker is available:
   ```bash
   npm run setup -- --network undeployed
   ```
4. **CI/CD check** — open `.github/workflows/ci.yml` and confirm it runs a contract
   compile step, not just a frontend build. If missing, this is the one thing the
   verification pass is explicitly allowed to fix (`RULES.md` §5).
5. **Security/hygiene check:**
   - No hardcoded Preprod address unless deployment actually succeeded.
   - Preprod blocker (if any) documented honestly, mentor waiver referenced.
   - `.env.example` exists with required variables.
   - No secrets, no wallet seeds, no `.midnight-state.json`/`.midnight-wallet-state`
     committed.
   - No unwanted AI co-author trailers in commit history.
   - `git status` clean, or exactly what changed is reported.
6. **Report, in this exact shape:**
   1. Level 1 status: PASS / BLOCKED / NEEDS FIX
   2. Level 2 status: PASS / BLOCKED / NEEDS FIX
   3. Level 3 status: PASS / BLOCKED / NEEDS FIX
   4. CI/CD status — specifically, is contract compile included
   5. Exact issues found, with file paths
   6. Exact fixes made, if any
   7. Commands run and results
   8. Remaining submission items

---

## Phase 6 — Local Launch & Demo

**Goal:** Actually run the whole stack end to end — local network, contract, frontend,
Lace wallet — so it can be seen and demoed, not just verified by scripts.

Checklist:
- [ ] Local Midnight network (node + indexer + proof server) running via Docker and
      healthy.
- [ ] Lace wallet installed, switched to the Undeployed network, pointed at local
      endpoints.
- [ ] Wallet funded on Undeployed (no built-in faucet there — funding is via a local
      script, not the public faucet).
- [ ] Frontend `.env` wired to the local contract address from Level 1's
      `--network undeployed` deployment.
- [ ] Frontend running locally and reachable in Chrome.
- [ ] Full demo flow walked through at least once: connect → private submit → success →
      public state update → error case → disconnect.

**Definition of done:** you can watch the app work in a browser, end to end, with a real
(if local) wallet and a real (if local) contract — this is what gets screen-recorded for
the Level 3 demo requirement. Full step-by-step in `LAUNCH_PLAYBOOK.md`.

---

## Phase 7 — Publish (GitHub + Netlify)

**Goal:** Code is pushed publicly, and the frontend is deployed somewhere reviewable —
honestly labeled as to what it can and can't actually do live.

Checklist:
- [ ] Repo pushed to GitHub, with `.gitignore` confirmed to exclude secrets/state files
      *before* the first push (`RULES.md` §3).
- [ ] Frontend deployed to Netlify (or Vercel).
- [ ] README states plainly whether the live Netlify URL is fully functional (only true if
      pointed at a real, publicly-reachable network) or a UI/build showcase (true if still
      pointed at the local Undeployed network) — see `DEPLOY_PLAYBOOK.md` §2 for why this
      distinction is real, not just a formality.
- [ ] If it's a showcase, the honest README language from `RULES.md` §6/§8 is used, and it
      links to the local demo recording from `LAUNCH_PLAYBOOK.md` Step 6 as the actual
      proof of functionality.

**Definition of done:** anyone can open the GitHub repo and the Netlify link and get an
accurate picture of what's real, what's local-only, and why — per `DEPLOY_PLAYBOOK.md`.
