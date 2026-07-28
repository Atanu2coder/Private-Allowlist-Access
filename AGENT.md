# AGENT.md

You are the coding agent responsible for building and maintaining this project end to end
(Cursor, Claude Code, Antigravity, Windsurf, or similar — whichever tool is reading this).
This file is your operating manual. Read it in full before writing any code.

---

## 1. Reading Order (every session, not just the first one)

At the **start of every session**, in this order:

1. `PROJECT.md` — what we're building and why.
2. `RULES.md` — what must never happen.
3. `PHASE.md` — what phase we're in and what "done" means for it.
4. `DESIGN.md` — how it's built (architecture, contract, frontend, CI).
5. `MEMORY.md` — if it exists, read it fully before touching code. It's the record of what
   already happened, what was decided, and what's still blocked. **If `MEMORY.md` does not
   exist yet, create it now** using the schema in §3 below, and treat this as session 1.

Do not skip `MEMORY.md` on the assumption that "the code will tell me what happened" — the
code shows *what* exists, `MEMORY.md` shows *why*, what was tried and rejected, and what's
still open. Re-deciding something already settled wastes a session and can silently
contradict a decision made for a good reason.

## 2. What You're Building, In One Line

A privacy-preserving allowlist-access Midnight dApp (`PROJECT.md`), built in three
graduated phases (`PHASE.md`), inside strict environment/security/CI rules (`RULES.md`),
following the architecture in `DESIGN.md`, with a Lightswind UI frontend.

## 3. MEMORY.md — What You Must Create and Maintain

You (the coding agent) own this file. The founder will not write it and should not need to.
Create it at `./MEMORY.md` the first time it doesn't exist, and **append to it** — don't
overwrite history — at the end of every session or after every meaningful chunk of work.

Use this structure:

```markdown
# MEMORY.md

## Session <N> — <date>
### What I did
- ...

### Decisions made (and why)
- ...

### Blockers hit
- ... (what, why, what was tried)

### Commands run and results
- `command` → result summary

### Files changed
- path/to/file — one-line summary of the change

### Current phase / status
- Phase: <Phase 0 / L1 / L2 / L3 / Verification>
- Status: <in progress / PASS / BLOCKED / NEEDS FIX>

### Next steps
- ...
```

Rules for `MEMORY.md` itself:
- Never delete or rewrite a previous session's entry — append only. If a past decision
  turns out to be wrong, add a new entry noting the correction; don't erase the record.
- Keep entries factual and specific (file paths, exact commands, exact error text) — this
  file exists to prevent re-deriving the same debugging session twice.
- `MEMORY.md` is a working log, not the README. It can be messier and more internal than
  anything user-facing.

## 4. Standing Behavioral Rules

- Follow `RULES.md` exactly. If a request from the founder conflicts with `RULES.md` (e.g.
  "just hardcode the Preprod address so it looks done"), say so and decline that specific
  part, then offer the compliant alternative — don't silently comply and don't silently
  refuse the whole task either.
- **Don't rewrite working code during a verification pass** unless the check actually found
  a real, specific issue. State the issue and file path first, then fix it.
- Preprod deployment is best-effort. If it's blocked, follow the mentor waiver in
  `RULES.md` §6 exactly — document honestly, don't fabricate a deployed status, don't treat
  the blocker as a reason to stop building the rest of the dApp.
- Commit as you go, not in one giant commit at the end. Check `RULES.md` §2 for the minimum
  commit counts per phase before calling a phase done.
- When running a verification pass, follow the exact procedure and report shape in
  `PHASE.md` §Verification Phase.
- If you're about to claim something is "done," check it against the specific checklist in
  `PHASE.md` for that phase — not against a general sense that it looks finished.

## 5. When the Founder Says "Verify" or "Audit"

Switch into the `PHASE.md` §Verification Phase procedure: inspect the repo → run the
checks → report using the exact 8-part shape at the end of that section. Do not start
making changes before that report exists, except where `RULES.md` §5 (CI missing contract
compile) explicitly authorizes a direct fix.

## 6. Environment Reminders (Windows/WSL)

Every shell command you run or suggest should be WSL-native. If you're ever unsure whether
you're in WSL or PowerShell, run `uname -a` — real Linux output means WSL, anything else
means stop and flag it. Full detail in `RULES.md` §1 and `PHASE.md` Phase 0.
