# RULES.md

These are constraints, not suggestions. Where `PHASE.md` describes *what* to build, this
file describes *what may never happen* while building it. Any coding agent, at the start of
any session, should treat a violation of these rules as more important than finishing a
task faster.

---

## 1. Environment Rules (Windows + WSL)

- All Midnight/Compact/Node commands run **inside Ubuntu WSL**, never Windows
  PowerShell. If a command is being run in PowerShell, stop and say so.
- Project lives at a **native WSL path** (e.g. `~/midnight-projects/<project-name>`), never
  under `/mnt/c/...` or `/mnt/d/...`. Compact-generated files under `contracts/managed/`
  have hit `chmod`/permission errors on Windows-mounted paths — don't reintroduce that.
- Node must be **22+**, installed via `nvm` inside WSL. `which node` / `which npm` must
  resolve to `/home/<user>/.nvm/...`, never `/mnt/c/Program Files/nodejs`.
- Docker must be reachable from inside WSL (`docker --version`, `docker compose version`,
  `docker ps` all succeed). If not, that's a Docker Desktop → WSL Integration setting, not a
  project bug — don't try to "fix" it by installing Docker separately inside WSL.
- `compact` must resolve to `/home/<user>/.local/bin/compact` (Midnight Compact), never
  Windows' built-in `compact.exe` (file compression). If `compact` output looks like
  `Listing C:\...`, the wrong binary is being called — fix `PATH`, don't work around it.
- **Version check nuance:** `compact --version` reports the **devtools** version (small
  number, e.g. `0.x.x`). `compact compile --version` reports the **compiler/language**
  version (currently in the `0.28.x`–`0.31.x` line as of mid-2026). These are two different
  numbers for two different components — don't treat a mismatch between them as a bug.
  Use `compact update` to get the latest compiler; don't hardcode a patch version in docs
  or CI unless the project intentionally pins one.

## 2. Git & Commit Hygiene

- Minimum meaningful commits: **5 by end of Level 1, 8 by end of Level 2, 10 by end of
  Level 3**. "Meaningful" = one logical change per commit, not one giant commit at the end.
- No AI co-author trailers (e.g. `Co-authored-by: Cursor`, `Co-authored-by: Claude`) unless
  the founder explicitly asks for them.
- `git status` should be clean before calling any phase "done," or the agent must report
  exactly what's uncommitted and why.

## 3. Security Rules — Never Commit

- No `.env` file with real secrets (only `.env.example` with placeholder values).
- No private wallet seed, mnemonic, or key material, anywhere in the repo or commit
  history.
- No `.midnight-state.json` or `.midnight-wallet-state` file committed to git — but also:
  **never delete `.midnight-state.json` locally after a Preprod wallet has been funded** by
  the faucet. Deleting it can lose the funded wallet's state/seed. Add it to `.gitignore`;
  don't delete the file itself.
- No hardcoded Preprod contract address in frontend code or env defaults **unless that
  deployment actually succeeded**. A placeholder or "not yet deployed" value is correct
  until then.

## 4. Contract & Privacy Discipline

- The contract must have genuine **public ledger state** and genuine **private
  witness/input** — not a hello-world contract with everything public.
- `disclose()` is used **only** for values that are intentionally, deliberately public (e.g.
  an aggregate counter or a boolean status) — never as a shortcut to make private data
  public because it was easier to wire up.
- Before marking Level 1 "done," the agent should be able to state, in one sentence each:
  (a) what's public, (b) what's private, (c) which values cross that boundary via
  `disclose()` and why that's safe to disclose.

## 5. CI/CD Rule (Non-Negotiable)

The GitHub Actions workflow at `.github/workflows/ci.yml` **must** run the contract
compile step — not just build the frontend. Minimum pipeline, in order:

1. Install dependencies.
2. Install/set up the Compact toolchain if needed.
3. Run the contract compile command (e.g. `npm run compile`, or the project's Compact
   compile invocation).
4. Run tests.
5. Build/type-check the frontend.

If CI is missing step 3, that is a **NEEDS FIX**, not a pass, regardless of how good the
frontend looks. This is the single most commonly-missed requirement — check it explicitly
every time CI is touched.

## 6. Preprod Deployment & Mentor Waiver Rule

Preprod/Preview deployment is **best-effort**, not required for submission, under this
exact condition (the founder's mentor approved this explicitly):

> If Preprod deployment is blocked or cannot complete, do not block the project. Build the
> full-stack dApp, document the blocker honestly, and submit without a live Preprod
> address.

For this waiver to apply, **all** of the following must be true — otherwise it's a real
NEEDS FIX, not a waived blocker:

- The contract compiles successfully.
- Local deployment (`--network undeployed`) works and the CLI/frontend can interact with it.
- The specific blocker (e.g. wallet sync hang, endpoint unreachable) is documented in the
  README with what was tried: endpoints checked, faucet funding status, wallet address
  behavior, and how long sync was attempted.
- The README states plainly that the mentor authorized submitting without a completed
  Preprod deployment.
- No fake/placeholder Preprod address is presented as if it were real.

If any of the above is missing, status is **NEEDS FIX**, not **BLOCKED/WAIVED**.

## 7. "Don't Rewrite Unless Broken" Rule

When asked to verify or audit the project (see `PHASE.md` §Verification), do not rewrite
working code. Inspect first, run checks second, report third. Only change code when
verification finds a real, specific issue — and when it does, state the file path and the
issue before changing anything.

## 8. Documentation Honesty Rule

Every claim in the README about what works must be true at the moment it's written. A
Preprod blocker documented honestly is a pass condition; a Preprod blocker glossed over or
a fabricated "deployed" status is a fail condition, full stop — this matters more than
looking finished.
