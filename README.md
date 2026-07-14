# 🏛️ Claude Certified Architect — a visual, project-first prep track

> [!IMPORTANT]
> **📦 This repo has moved.** The maintained version lives in
> [`theDocWho/ai-ml-roadmap`](https://github.com/theDocWho/ai-ml-roadmap) under `architect/`, deployed at
> **[learn-by-visuallization.org/architect](https://learn-by-visuallization.org/architect/)** — with everything
> here **plus** 🧭 The Path (six mastery ladders with quizzes, exercises and scenario drills), 🧪 guided
> experiments on all 26 explainers, and a 50-question quiz bank. This copy is **archived** and no longer updated.

A free, **build-it-to-learn-it** path to passing the **Claude Certified Architect — Foundations (CCA-F)** exam —
and to actually *being* an architect, not just passing a test. Everything here is mapped to the exam's five
domains, taught with **interactive explainers you can click and drive**, and reinforced with **résumé-worthy
projects** you build yourself.

> 🎯 Designed so a curious **10-year-old** can grasp every concept *and* an engineer can pass a proctored exam.
> Every explainer has an **"Explain like I'm 10"** box, a hands-on widget, and an **exam-trap** warning.

[![▶ Open the live site](https://img.shields.io/badge/%E2%96%B6%20Open%20the%20live%20site-cc785c?style=for-the-badge)](https://thedocwho.github.io/claude-architect-certification/)
[![🚀 The Agent Hangar (game)](https://img.shields.io/badge/%F0%9F%9A%80%20Agent%20Hangar%20game-131009?style=for-the-badge)](https://thedocwho.github.io/claude-architect-certification/hangar.html)
[![📝 Quiz](https://img.shields.io/badge/%F0%9F%93%9D%20Quiz%20%E2%80%94%2042%20questions-4ade80?style=for-the-badge)](https://thedocwho.github.io/claude-architect-certification/quiz.html)
[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/theDocWho/claude-architect-certification/blob/main/notebooks/foundations-api.ipynb)

> **🌐 See it live:** the whole track runs in your browser at
> **[thedocwho.github.io/claude-architect-certification](https://thedocwho.github.io/claude-architect-certification/)** —
> explainers, the Hangar game, the quiz, and every doc rendered on-site. (Clicking a `.html` link *inside*
> GitHub shows source code, not the page — use the live links.)

## ▶ Start here — it's a website

This repo **is a deployable learning site** with a guided path, progress tracking, and every doc readable
in-browser — live at the badge above, or run it locally in one command ([deploy notes](DEPLOY.md)):

```bash
cd claude-architect-certification
python3 -m http.server 8000
# then open http://localhost:8000/          ← the landing page & learning path
```

From the landing page ([`index.html`](https://thedocwho.github.io/claude-architect-certification/index.html)):
1. **New to APIs / confused by "CLI vs API vs SDK"?** The path starts at
   [**What is the Claude API?**](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/what-is-the-api.html) — it draws the whole map
   before any code — then follows Next → arrows through all 26 explainers. Your progress is tracked in-browser
   and the catalog offers a **Resume** button.
2. **Read the map:** [`BLUEPRINT.md`](BLUEPRINT.md) — the 5 domains, their weights, the 6 scenarios, and the
   **14 exam traps** that decide pass/fail.
3. **Run the code:** the 10 API exercises work three ways — **Google Colab**
   ([`notebooks/foundations-api.ipynb`](notebooks/foundations-api.ipynb), zero install), **VS Code** (Copilot
   Chat or the Claude Code extension), or the **terminal**. The site's "Practice anywhere" section walks each lane.
4. **Follow the plan:** [`STUDY-PLAN.md`](STUDY-PLAN.md) — a 6-week learn → build → prove loop.

## What's inside

| Folder / file | What it is |
|---|---|
| [`index.html`](https://thedocwho.github.io/claude-architect-certification/index.html) | 🌐 The **site landing page**: guided 9-step path, domain map, progress tracking, practice lanes. |
| [`hangar.html`](https://thedocwho.github.io/claude-architect-certification/hangar.html) | 🚀 **The Agent Hangar** — the game: master 6 ship parts in mini-games (model, API, context, tools, budget, guardrails), assemble the ship, fly 3 decision-point missions built from the exam traps. |
| [`viewer.html`](https://thedocwho.github.io/claude-architect-certification/viewer.html) | Renders every Markdown doc as a styled page on the deployed site (no raw text). |
| [`DEPLOY.md`](DEPLOY.md) | Put the site online **free** (GitHub Pages / Netlify / Vercel) in ~5 minutes. |
| [`notebooks/`](notebooks/foundations-api.ipynb) | ☁️ **Colab notebook** of the 10 API exercises — zero-install practice. |
| [`illustrated/`](https://thedocwho.github.io/claude-architect-certification/illustrated/index.html) | 🏛️ **26 interactive explainers** across all 5 domains + a ground-up API foundations track. Searchable catalog, prev/next path. |
| [`BLUEPRINT.md`](BLUEPRINT.md) | The **exam map**: domains, weights, scenarios, and the 14 high-frequency traps. |
| [`STUDY-PLAN.md`](STUDY-PLAN.md) | A **6-week** schedule (learn → build → prove), compressible to 3. |
| [`projects/`](projects/README.md) | **6 production projects**, each mapped to an exam scenario, with a résumé line. |
| [`capstone/`](capstone/enterprise-agent-platform/README.md) | The **Enterprise Agent Platform** — the portfolio flagship that proves *architect-level* judgment. |
| [`practice/`](practice/README.md) | **Scenario drills** per domain + a timed **mock exam**, with answer keys and "why-wrong" explanations. |
| [`reference/`](reference/cheatsheet.md) | A one-page **cheatsheet** + **master prompts** (one reusable scaffold per domain). |

## The exam, in one table

| Domain | Weight | Build it with |
|---|:--:|---|
| **Agentic Architecture & Orchestration** | 27% | [explainers](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/agent-loop.html) → [proj-01](projects/proj-01-support-agent/README.md), [proj-02](projects/proj-02-multi-agent-research/README.md) |
| **Claude Code Configuration & Workflows** | 20% | [explainers](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/claudemd-hierarchy.html) → [proj-04](projects/proj-04-claude-code-cicd/README.md) |
| **Prompt Engineering & Structured Output** | 20% | [explainers](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/prompt-anatomy.html) → [proj-05](projects/proj-05-structured-extraction/README.md) |
| **Tool Design & MCP Integration** | 18% | [explainers](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/tool-anatomy.html) → [proj-03](projects/proj-03-mcp-server/README.md) |
| **Context Management & Reliability** | 15% | [explainers](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/context-window.html) → [proj-06](projects/proj-06-context-engine/README.md) |

## Why this works

- **Visual-first.** Every concept is an interactive widget — drive the agent loop, pack a context window, watch a
  cache cut the bill, flip a tool from sloppy to sharp. Built in the style of StatQuest / The Illustrated
  Transformer: prose that teaches *plus* visuals that stick.
- **Project-first.** You don't pass an architecture exam by reading. Each domain ends in a real build with a
  "Done when" checklist and a line you can put on your CV.
- **Trap-aware.** The exam's wrong answers *sound* smart. Every explainer ends with the specific trap it defuses,
  and the [blueprint](BLUEPRINT.md) collects all 14 in one place.
- **Free & offline.** Anthropic API is pay-as-you-go (Haiku is cheap); the learning materials need no internet
  and no accounts.

## What you'll be able to do at the end
Design a governed, production Claude system: pick the simplest architecture that works, write tools Claude uses
correctly, configure Claude Code for a team, engineer context so agents don't die of overflow, measure everything
with evals, route work to the cheapest capable model, and make agents that **escalate instead of bluff** — and
prove all of it with a portfolio.

---

*The certification is run by Anthropic (Claude Certified Architect — Foundations, launched March 2026). Exam
structure and weightings here reflect public reporting as of mid-2026 — **confirm current details on Anthropic's
official certification page before you book**. This is an independent study track, not affiliated with or endorsed
by Anthropic.*
