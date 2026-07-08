# proj-04 — Claude Code in CI/CD

> **Exam scenario:** Claude Code in CI/CD · **Domain:** 3 (Claude Code Config, 20%) · ⭐⭐⭐
> Wire Claude Code into a real pipeline: an **automated PR reviewer** and a **test-generator** that run headless
> on every pull request, plus the **team configuration** (CLAUDE.md hierarchy, rules, hooks, slash commands) that
> makes Claude behave consistently for everyone. This is the build that proves you can operationalise Claude Code,
> not just chat with it.

> 🎨 Drive it first: [headless mode & CI/CD](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/cicd-headless.html) ·
> [CLAUDE.md hierarchy](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/claudemd-hierarchy.html) ·
> [skills, rules & hooks](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/skills-rules.html) ·
> [Grep vs Glob](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/grep-vs-glob.html).

## What you'll build
A GitHub repo where opening a PR triggers a **GitHub Action** that runs `claude -p` headless with
`--output-format json` to (a) review the diff for bugs/security and post inline comments, and (b) generate tests
for any uncovered functions. Plus the **committed config**: a layered `CLAUDE.md`, a path-scoped `.claude/rules/`
file, a **PreToolUse hook** that blocks edits to secrets, and a couple of team **slash commands**.

## Why it matters for the exam
Domain 3 is "the most configuration-heavy domain — either you know where the files go or you don't." This build
forces the muscle memory: **where each config file lives**, **headless flags** (`-p`, `--output-format json`,
permission modes), **session isolation**, and **hook vs rule vs skill** decisions.

## Stages
1. **Team config baseline.** Write a project `CLAUDE.md` (stack, conventions, "never edit generated/"), a
   directory-level `CLAUDE.md` or `.claude/rules/backend.md` with a glob scope, and 1–2 slash commands.
   *Checkpoint: Claude Code obeys the right rules in the right folders.*
2. **A deterministic guardrail.** Add a **PreToolUse hook** that **blocks** writes to `secrets.env` / `.env`.
   Prove the model cannot override it. *Checkpoint: an attempted secret edit is denied by the harness, not a
   polite refusal.*
3. **Headless PR review.** A GitHub Action runs `claude -p "review this diff…" --output-format json
   --permission-mode plan` on PRs; parse the JSON and post comments; **fail the build** on high-severity findings.
   *Checkpoint: a PR with a planted bug gets a precise inline comment and a red check.*
4. **Headless test generation.** A second job finds untested functions and generates tests (write-permitted, but
   scoped to `tests/`). *Checkpoint: it adds passing tests and touches nothing else.*
5. **Session isolation proof.** Show each run starts clean (no leakage between PRs) and is reproducible given the
   same diff + committed CLAUDE.md.

## Make it better
- (stretch) A `Stop` hook that runs the linter/test suite after Claude finishes locally.
- (stretch) Matrix the review across changed-files only (use Grep/Glob to scope) to cut tokens.
- (stretch) Add a "needs human review" label when findings exceed a confidence threshold (ties to Domain 5).

## Done when
- [ ] Opening a PR auto-runs a review that posts useful inline comments and gates merges on severity.
- [ ] A test-gen job adds passing tests scoped to `tests/` and nothing else.
- [ ] The secret-edit hook **blocks** deterministically; you can demonstrate it.
- [ ] You can point to each config file and say exactly *why it lives there* and *what scope it has*.

## Architect's Decision Lens
1. **Problem:** consistent, automated code review + test coverage without a human in the loop every time.
2. **Is automation right?** Yes for the repetitive 80%; humans still own merge + high-severity calls.
3. **Design:** headless `claude -p` in CI; layered CLAUDE.md for shared standards; hooks for hard guarantees.
4. **Guardrails:** read-only perms for review; scoped writes for test-gen; PreToolUse hook for secrets.
5. **Evals:** does it catch a planted bug? does test-gen produce passing tests? regression over time.
6. **Cost:** scope to changed files; JSON output for cheap parsing; cache standards via committed config.
7. **Reliability:** session isolation = reproducible runs; flag low-confidence to humans.
8. **Build vs buy:** Claude Code + Actions are the platform; *your* config + gating logic is the value.

## Concepts you must be able to explain
The CLAUDE.md hierarchy (user/project/directory/local) and precedence; why hooks (not prompts) enforce hard
rules; `-p` / `--output-format json` / permission modes; session isolation and why it matters in CI; Grep vs Glob
for scoping; read-only vs write permissions per job.

**Résumé line:** *Integrated Claude Code into CI/CD via headless `-p` GitHub Actions for automated PR review and
test generation, with a layered CLAUDE.md, path-scoped rules, and a PreToolUse hook enforcing secret-file
protection; merges gate on severity.*
