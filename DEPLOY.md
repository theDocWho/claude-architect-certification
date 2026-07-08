# Deploy — put the learning site online, free, in ~5 minutes

The whole site is **static** (vanilla HTML/CSS/JS, no build step), so any free static host works. GitHub Pages
is the recommended path — it also unlocks the "Open in Colab from GitHub" flow for the notebook.

## Option A — GitHub Pages (recommended)

```bash
cd claude-architect-certification

# 1. Make it a git repo and commit everything
git init
git add -A
git commit -m "Claude Certified Architect learning site"

# 2. Create the GitHub repo and push (using the gh CLI)
gh repo create claude-architect-certification --public --source=. --push

# 3. Turn on GitHub Pages (serve the main branch root)
gh api -X POST "repos/{owner}/claude-architect-certification/pages" \
  -f "source[branch]=main" -f "source[path]=/"
```

Your site goes live at:

```
https://theDocWho.github.io/claude-architect-certification/
```

(First deploy can take a minute or two. If you prefer clicking: repo → **Settings → Pages** → Source:
*Deploy from a branch* → `main` / `/ (root)` → Save.)

**Already included for you:**
- `.nojekyll` — stops GitHub from mangling the site with Jekyll processing.
- `viewer.html` — renders all the Markdown docs (blueprint, projects, drills) as styled pages *on the site*,
  so nothing shows up as raw text.
- Root `index.html` — the landing page with the learning path and progress tracking.

**After pushing, the Colab badge works too.** Open the notebook directly in Colab at:

```
https://colab.research.google.com/github/theDocWho/claude-architect-certification/blob/main/notebooks/foundations-api.ipynb
```

You can add that as a link/badge in `practice/foundations-api.md` once you know your username.

## Option B — Netlify / Vercel / Cloudflare Pages

All three have generous free tiers and need zero config for a static folder:

- **Netlify:** drag-and-drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop) — live in
  seconds, no account CLI needed.
- **Vercel:** `npx vercel` in the folder → accept defaults.
- **Cloudflare Pages:** dashboard → *Create project* → *Direct upload* → drop the folder.

## Updating the site

```bash
git add -A && git commit -m "update" && git push
```

GitHub Pages redeploys automatically on push (usually < 1 minute).

## Local preview (no deploy needed)

```bash
python3 -m http.server 8000
# → http://localhost:8000/
```

> Note: `viewer.html` fetches the Markdown files over HTTP, so use the local server rather than double-clicking
> the file — `file://` blocks fetch in most browsers. The explainers themselves work either way.

## A note on privacy & keys

The site is 100% client-side: no backend, no analytics, no accounts. Progress tracking lives in *your* browser's
localStorage. **Your API key never touches the site** — it's only used in the exercises you run yourself
(Colab / local), and the notebook asks for it with a hidden prompt at runtime.
