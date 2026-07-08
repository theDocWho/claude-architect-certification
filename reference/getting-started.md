# Getting Started — your API key, set up properly

> Five minutes, once. Do this before the [hands-on Python exercises](../practice/foundations-api.md).

## 1. Create a developer account
The **API console** is separate from the **claude.ai chat app** — same company, different product, and you may
need to sign up separately even if you already use claude.ai.

1. Go to **[console.anthropic.com](https://console.anthropic.com)** and sign up / log in.
2. Verify your email (and phone, if asked).

## 2. Set up billing
The API is **pay-as-you-go** (not part of a claude.ai subscription). You typically need a payment method on file
before keys will work, though new accounts sometimes get a small starting credit.

1. In the console, go to **Settings → Billing**.
2. Add a payment method.
3. **Set a spend limit / budget alert** here too — cheap to do, and it caps surprises while you're learning. This
   whole cert's practice exercises cost a few cents total if you stick to Haiku with small `max_tokens`.

## 3. Create your API key
1. Go to **Settings → API Keys**.
2. Click **Create Key**, give it a name (e.g. `cca-practice`).
3. **Copy it immediately** — most consoles show the full key only once. If you lose it, delete it and make a
   new one; there's no "reveal again."

## 4. Store it as an environment variable — never in code

```bash
# macOS/Linux (bash/zsh) — add to your shell profile to persist it
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows (PowerShell)
setx ANTHROPIC_API_KEY "sk-ant-..."
```

Or, for a project, use a `.env` file **that is git-ignored**:
```
# .env  (add this filename to .gitignore!)
ANTHROPIC_API_KEY=sk-ant-...
```
```python
# pip install python-dotenv
from dotenv import load_dotenv
load_dotenv()          # reads .env into the environment
import anthropic
client = anthropic.Anthropic()   # picks up ANTHROPIC_API_KEY automatically
```

### Security — treat it like a password
- **Never** paste it directly into code, notebooks, or a commit. If you accidentally commit one, **revoke it
  immediately** in the console (delete the key) and issue a new one — don't just delete the commit, assume it's
  compromised forever once it's been pushed anywhere public.
- Add `.env` (and any file holding it) to `.gitignore` **before** your first commit.
- Use **separate keys** for separate projects/environments if your plan supports it, so a leak in one doesn't
  expose the others.
- In production, use a real secrets manager (not an env var in a Dockerfile) — out of scope for this cert's
  practice, but know the principle.

## 5. Verify it works
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-haiku-4-5","max_tokens":20,"messages":[{"role":"user","content":"Say hi in 3 words."}]}'
```
A JSON reply with a `content` field means you're set. Now go run
**[Exercise 1 in the hands-on practice](../practice/foundations-api.md)**.

## Troubleshooting the errors you'll actually hit

| Symptom | Likely cause | Fix |
|---|---|---|
| `401 authentication_error` | Key missing, wrong, or not loaded into the environment | `echo $ANTHROPIC_API_KEY` to confirm it's set in *this* shell/process |
| `400 invalid_request_error` | Malformed JSON, bad model name, missing required field | Re-check `model`, `max_tokens`, `messages` are present and spelled right |
| `403 permission_error` | Key valid but lacks access to something (e.g. a restricted model) | Check the console for plan/model access |
| `429 rate_limit_error` | Too many requests too fast, or over your quota | Back off and retry (Domain 2's retryable pattern); check Billing for limits |
| "insufficient credit / balance" | No payment method or credit exhausted | Add billing in **Settings → Billing** |

## Where this fits
This key is for the **raw API and the SDK** — the ground-truth layer. If you mostly use **claude.ai** or **VS
Code** day to day, you may never need a key at all for that usage; those products manage their own API access.
See [Same concepts, different surface](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/same-concepts-everywhere.html) for how your
API knowledge still applies there.
