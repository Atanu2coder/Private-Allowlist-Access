# PROJECT.md

Single source of truth for **what** this project is and **why**. The coding agent should
treat this file as the product brief. If something in `PHASE.md`, `DESIGN.md`, or a prompt
conflicts with this file, this file wins for *intent*; `RULES.md` wins for *constraints*.

---

## 1. Identity

| Field | Value |
|---|---|
| Project name | `<PROJECT_NAME>` — replace before coding starts |
| Submission track | Midnight Network dApp — New Moon (L1) → Waxing Crescent (L2) → First Quarter (L3) |
| Level 3 official category | **Private Allowlist Access** |
| Primary chain / network | Midnight Network (Compact contracts, Preprod/Preview + local `undeployed` network) |
| Frontend UI kit | [Lightswind UI](https://lightswind.com/) (Tailwind + Framer Motion, copy-paste/CLI component library) |
| Primary dev environment | Windows 11 + WSL2 (Ubuntu) — see `RULES.md` §1 |

## 2. One-Paragraph Pitch

`<PROJECT_NAME>` is a privacy-preserving allowlist-gated access dApp on Midnight. An
organizer publishes a **commitment to a private allowlist** (not the list itself) on the
public ledger. A person who is genuinely on that list can prove membership — and unlock
gated access — using a private witness, without revealing their identity, their position on
the list, the list's contents, or the list's size to anyone observing the chain.

## 3. Default Product Idea (edit this — it's a working default, not a requirement)

> **Use case:** A community, event, or DAO organizer wants to gate an action (event
> check-in, content unlock, vote eligibility, whitelist claim) to a specific, private set of
> people — without publishing who those people are.
>
> **Flow:**
> 1. Organizer computes a commitment (e.g. a Merkle root or hash set) over the allowlist
>    off-chain and publishes only the **commitment** as public ledger state.
> 2. A user proves "I am one of the entries under this commitment" using a **private
>    witness** (their secret + a private membership path), calling a circuit that verifies
>    membership without disclosing the entry itself.
> 3. On success, the contract updates a public counter / status flag (e.g. "checked in: true",
>    "total verified: N") via `disclose()` — deliberately, and only for that aggregate value.
> 4. Observers of the chain can see *that* someone valid checked in and *how many* people
>    have, but never *who*, never their identity/wallet correlation to the list, and never the
>    list itself.

Replace this scenario with your real one (ticketed event, token-gated allowlist, DAO
member vote, etc.) — the privacy shape (public commitment + public aggregate, private
membership proof) stays the same regardless of the concrete story.

## 4. Why This Counts as "Private Allowlist Access" (not Age Gate / Voting / Auction)

- The gating condition is **membership in a private, organizer-controlled set**, not a
  numeric threshold (age gate), a tally of choices (voting), or a bid (auction).
- The set itself (who is on the allowlist) is the thing being kept private — the public
  ledger only ever sees a commitment and an aggregate count/status.
- If your idea drifts toward "prove you're over 18" or "prove your bid is highest," update
  the category in this file and in `PHASE.md` §Level 3 before continuing — category and
  contract design should match.

## 5. Tech Stack

- **Contract:** Compact (Midnight's smart-contract language) — public ledger state +
  private witness, compiled with the Compact toolchain.
- **Local network:** `undeployed` network via `npm run setup -- --network undeployed`.
- **Target network:** Preprod (best-effort; see `RULES.md` §6 for the mentor waiver).
- **Frontend:** Vite + React (or whatever `create-mn-app` scaffolds), styled with
  **Lightswind UI** components (Tailwind CSS + Framer Motion, installed via
  `npx lightswind add <component>` / `npx create-lightswind`).
- **Wallet:** Lace wallet (browser extension) connect/disconnect flow.
- **CI:** GitHub Actions — install deps → compile contract → run tests → build/type-check
  frontend (see `RULES.md` §5 — this is non-negotiable).

## 6. What "Done" Looks Like

Done = `PHASE.md`'s Level 1, Level 2, and Level 3 checklists all report **PASS**, using the
verification pass defined in `PHASE.md` §Verification. Preprod deployment may legitimately
be **BLOCKED/WAIVED** per the mentor rule in `RULES.md` §6 — that does not block "done."

## 7. Explicitly Out of Scope for v1

- Multi-chain support, mainnet deployment, mobile app.
- Admin UI for editing the allowlist on-chain after publication (v1: allowlist commitment is
  published once; updates are a v2 idea).
- Anything not listed in `PHASE.md` Level 1/2/3 — resist scope creep until L3 passes.

## 8. Source Documents

This project's rules and phases were synthesized from three prompts supplied by the
founder: a coding-agent build prompt, a Windows/WSL setup-and-troubleshooting guide, and
a post-build verification prompt. Their content now lives, reorganized, in `RULES.md`,
`PHASE.md`, and `DESIGN.md` — those three files are the operative versions going forward.
