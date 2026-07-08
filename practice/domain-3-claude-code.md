# Drill — Domain 3: Claude Code Configuration & Workflows (20%)

---

**Q1.** Your team needs Claude Code to **always** run the linter after editing any file — no exceptions, even if
the model forgets. Where does this belong?

- A. An instruction in the project `CLAUDE.md`.
- B. A custom skill.
- C. A **`PostToolUse` hook** that runs the linter on Edit/Write.
- D. A slash command the developer runs manually.

---

**Q2.** Backend files need Python-specific conventions that shouldn't apply to the frontend. Best approach?

- A. Put everything in the user-level `~/.claude/CLAUDE.md`.
- B. A **directory-level `CLAUDE.md`** (or `.claude/rules/backend.md` with a `backend/**` glob) under the backend
  tree.
- C. Paste both frontend and backend rules into one root `CLAUDE.md`.
- D. A hook.

---

**Q3.** "Find every file in the repo where the function `authorize()` is defined." Which built-in tool?

- A. Glob.
- B. **Grep** (searches file contents).
- C. Read.
- D. Bash `find`.

---

**Q4.** You want a CI job that reviews each PR's diff and **fails the build** on high-severity issues. Which
command shape is right?

- A. `claude` (interactive) in the CI runner.
- B. `claude -p "review this diff" --output-format json --permission-mode plan`, then parse the JSON and set the
  exit code.
- C. `claude -p "review this diff" --permission-mode acceptEdits`.
- D. A hook.

---

**Q5.** A personal preference ("I like terse commit messages") that should **not** be shared with the team
belongs in:

- A. The committed project `CLAUDE.md`.
- B. **`~/.claude/CLAUDE.md`** (user level) or a git-ignored `CLAUDE.local.md`.
- C. A `.claude/rules/` file committed to the repo.
- D. A hook.

---

**Q6.** "Find all the `*.test.ts` files." Which tool?

- A. **Glob** (matches file names/paths).
- B. Grep.
- C. Read.
- D. Edit.

---

## Answers

**Q1 — C.** "Always / no exceptions" = deterministic → **hook**. Prompts and skills are probabilistic (the model
can skip them). *(Trap: hard guarantee in a prompt.)*

**Q2 — B.** Scope the rules to the subtree with a directory `CLAUDE.md` / path-globbed rule. **A/C** leak rules
across the repo; **D** is overkill for guidance. *(File precedence + scoping.)*

**Q3 — B.** Definition search = **contents** = Grep. Glob matches names; Bash `find` is the discouraged manual
route. *(Trap: Grep vs Glob.)*

**Q4 — B.** Headless `-p` + **JSON** output (parseable) + read-only **plan** mode for a review job. **A** has no
human to answer prompts; **C** lets a review mutate code. *(Trap: interactive in CI / write perms on review.)*

**Q5 — B.** Personal, unshared → user-level or git-ignored local file. **A/C** commit it to everyone. *(Shared vs
personal config.)*

**Q6 — A.** File names → **Glob**. *(Trap: Grep vs Glob.)*
