# Hands-on — the Claude API, by actually using it (Python)

> The explainers give you the mental model. **This is where it sticks** — by running real calls and watching what
> happens. Ten progressive exercises, each with a **goal**, **starter code**, what to **observe**, and the
> **learning**. Do them in order; each builds on the last. A 🟨 **Java bridge** note appears where your existing
> background helps.
>
> Pair with the explainers: [what is the API](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/what-is-the-api.html) →
> [Messages API](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/messages-api.html) →
> [parameters](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/parameters.html) →
> [reading the docs](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/reading-the-docs.html).

---

## Setup (5 minutes, once)

> ☁️ **Zero-install option:** all 10 exercises are also packaged as a **Colab notebook** —
> [`notebooks/foundations-api.ipynb`](../notebooks/foundations-api.ipynb). Upload it to
> [colab.research.google.com](https://colab.research.google.com) (or open it from GitHub once the repo is
> pushed), run the setup cell (it asks for your key with a hidden prompt), and go. Nothing to install locally.

> Don't have a key yet? **[Getting your API key →](../reference/getting-started.md)** walks through the console
> signup, billing, creating the key, storing it safely, and the errors you'll hit if something's misconfigured.
> Quick version if you already have one:

```bash
# 1. A virtual env (keeps things tidy)
python3 -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate

# 2. Install the official SDK
pip install anthropic

# 3. Set your key as an env var (see the full guide above if you need to create one)
export ANTHROPIC_API_KEY="sk-ant-..."                  # Windows: setx ANTHROPIC_API_KEY "sk-ant-..."
```

**Cost note:** every exercise here uses **Haiku or short Sonnet calls** — running the whole set costs a few US
cents. To spend even less, keep `max_tokens` small. Never commit your key; `export` it, don't paste it in code.

> 🟨 **Java bridge:** this is the same as adding a dependency + reading a config value from the environment. The
> SDK is your HTTP client, pre-written. If you'd rather, every exercise can be done with `java.net.http.HttpClient`
> POSTing to `https://api.anthropic.com/v1/messages` — the JSON body is identical to what the Python builds.

---

## Exercise 1 — Your first call (prove the doorway works)
**Goal:** send one message, get one reply.
```python
import anthropic
client = anthropic.Anthropic()

msg = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    messages=[{"role": "user", "content": "In one sentence, what is an API?"}],
)
print(msg.content[0].text)
```
**Observe:** a one-sentence answer prints. **Learning:** this is the whole API — one call, `content[0].text` is the
reply. If it errors with 401, your key isn't set (see [reading the docs → errors]).

---

## Exercise 2 — Inspect the whole response object
**Goal:** see what *else* comes back besides the text.
```python
msg = client.messages.create(
    model="claude-haiku-4-5", max_tokens=100,
    messages=[{"role": "user", "content": "Name three primary colors."}],
)
print("text:       ", msg.content[0].text)
print("stop_reason:", msg.stop_reason)          # why it stopped
print("usage:      ", msg.usage)                # input/output tokens (your bill)
print("model:      ", msg.model)
```
**Observe:** `stop_reason` = `end_turn`; `usage` shows token counts. **Learning:** the reply is an *object*, not
just a string. You'll check `stop_reason` and `usage` constantly.

---

## Exercise 3 — Feel `max_tokens` cut a reply off
**Goal:** trigger a truncated response on purpose.
```python
for cap in (20, 500):
    msg = client.messages.create(
        model="claude-haiku-4-5", max_tokens=cap,
        messages=[{"role": "user", "content": "Explain how rainbows form."}],
    )
    print(f"\n--- max_tokens={cap} | stop_reason={msg.stop_reason} ---")
    print(msg.content[0].text)
```
**Observe:** at 20, the text is cut mid-thought and `stop_reason == "max_tokens"`. At 500 it finishes with
`end_turn`. **Learning:** `max_tokens` caps the *reply*. Truncated output? Check `stop_reason` and raise the cap —
a real exam/debug reflex.

---

## Exercise 4 — Temperature: repeatable vs varied
**Goal:** see determinism appear at `temperature=0`.
```python
def ask(temp):
    m = client.messages.create(
        model="claude-haiku-4-5", max_tokens=30, temperature=temp,
        messages=[{"role": "user", "content": "Invent a name for a coffee shop."}],
    )
    return m.content[0].text.strip()

print("temp=1.0:", [ask(1.0) for _ in range(3)])   # three different names
print("temp=0.0:", [ask(0.0) for _ in range(3)])   # nearly identical
```
**Observe:** high temp → variety; temp 0 → (near-)identical each run. **Learning:** set `temperature=0` whenever
you need consistency (extraction, classification, evals). Leaving it high is why "the same prompt gives different
answers."

---

## Exercise 5 — The `system` prompt changes behavior
**Goal:** see the same question answered in two personas.
```python
def ask(system):
    m = client.messages.create(
        model="claude-haiku-4-5", max_tokens=120, system=system,
        messages=[{"role": "user", "content": "What is a black hole?"}],
    )
    return m.content[0].text

print(ask("You explain things to a curious 5-year-old, with a simple analogy."))
print("\n---\n")
print(ask("You are an astrophysicist writing for a graduate seminar."))
```
**Observe:** wildly different tone/level, same question. **Learning:** `system` is a *separate parameter* (not a
message) that sets role + rules. This is your main lever for controlling behavior → prompt anatomy.

---

## Exercise 6 — Multi-turn: prove statelessness yourself
**Goal:** show Claude "forgets" unless you resend history.
```python
# WRONG way — no history carried:
client.messages.create(model="claude-haiku-4-5", max_tokens=50,
    messages=[{"role":"user","content":"My cat is named Pip."}])
r = client.messages.create(model="claude-haiku-4-5", max_tokens=50,
    messages=[{"role":"user","content":"What is my cat's name?"}])
print("no-history →", r.content[0].text)      # it does NOT know

# RIGHT way — carry the whole conversation:
history = [
    {"role":"user","content":"My cat is named Pip."},
    {"role":"assistant","content":"Nice to meet Pip!"},
    {"role":"user","content":"What is my cat's name?"},
]
r = client.messages.create(model="claude-haiku-4-5", max_tokens=50, messages=history)
print("with-history →", r.content[0].text)     # → "Pip"
```
**Observe:** the first path can't recall the name; the second can. **Learning:** the API is **stateless** — *you*
own the conversation and resend it every turn. This is *why* long chats fill the context window (Domain 5).

---

## Exercise 7 — Build a tiny REPL chatbot
**Goal:** turn statelessness into a working chat loop.
```python
history = []
print("Chat with Claude (Ctrl-C to quit).")
while True:
    user = input("you: ")
    history.append({"role": "user", "content": user})
    msg = client.messages.create(
        model="claude-haiku-4-5", max_tokens=300,
        system="You are a concise, friendly assistant.",
        messages=history,
    )
    reply = msg.content[0].text
    print("claude:", reply)
    history.append({"role": "assistant", "content": reply})   # ← append the reply!
```
**Observe:** it remembers across turns because *you* keep appending. **Learning:** a chatbot is just: append user
turn → call → append assistant turn → repeat. That append is the entire "memory."

---

## Exercise 8 — Stream the reply (typing effect)
**Goal:** see tokens arrive live.
```python
with client.messages.stream(
    model="claude-haiku-4-5", max_tokens=200,
    messages=[{"role": "user", "content": "Write a haiku about the ocean."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```
**Observe:** text appears word-by-word instead of all at once. **Learning:** use `stream()` for chat UIs; plain
`create()` for backend/batch. Same request, different delivery.

---

## Exercise 9 — Handle errors like a grown-up
**Goal:** catch and read a real API error.
```python
import anthropic
client = anthropic.Anthropic()
try:
    client.messages.create(
        model="claude-does-not-exist", max_tokens=10,
        messages=[{"role": "user", "content": "hi"}],
    )
except anthropic.APIStatusError as e:
    print("status:", e.status_code)   # 404 / 400
    print("body:  ", e.message)
```
**Observe:** a clean, catchable exception instead of a crash. **Learning:** the SDK raises typed errors
(`APIStatusError`, `RateLimitError`, `AuthenticationError`). Look up status codes with the
[reading-the-docs](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/reading-the-docs.html) map (401=key, 429=rate limit, 400=bad
request).

---

## Exercise 10 — Mini use-case: a support-ticket classifier
**Goal:** combine everything into something real (and a preview of Domain 4).
```python
TICKETS = [
    "I was charged twice this month!",
    "The app crashes when I open settings.",
    "Please cancel my subscription.",
]
def classify(ticket):
    m = client.messages.create(
        model="claude-haiku-4-5", max_tokens=20, temperature=0,   # temp 0 = consistent
        system="Classify the support ticket into exactly one of: billing, technical, cancellation. "
               "Reply with ONLY that one word, lowercase.",
        messages=[{"role": "user", "content": ticket}],
    )
    return m.content[0].text.strip()

for t in TICKETS:
    print(f"{classify(t):12}  <- {t}")
```
**Observe:**
```
billing       <- I was charged twice this month!
technical     <- The app crashes when I open settings.
cancellation  <- Please cancel my subscription.
```
**Learning:** you just built a real classifier: Haiku (cheap, high-volume), `temperature=0` (repeatable),
`system` for the rules, small `max_tokens`. Every choice is an architect decision you can now *defend*. This is
the on-ramp to [proj-05 extraction](../projects/proj-05-structured-extraction/README.md).

---

## Checkpoint — you've "got it" when you can, without looking:
- [ ] Explain the difference between the **API**, the **SDK**, and **Claude Code**.
- [ ] Write a `messages.create` call from memory with model, max_tokens, system, messages.
- [ ] Say what `content[0].text`, `stop_reason`, and `usage` are.
- [ ] Explain why the chatbot needs you to **append** the assistant reply.
- [ ] Say when you'd set `temperature=0` and why.
- [ ] Predict what `stop_reason` you'll get if `max_tokens` is too small.

Miss any? Re-run that exercise and re-drive the matching explainer. **Running it beats re-reading it.**

> **Optional Java track:** redo Exercises 1, 6, and 10 with `java.net.http.HttpClient` POSTing the same JSON to
> `/v1/messages`. You'll feel *viscerally* that the SDK is just this HTTP call — and you'll never again wonder
> "is it the API or the SDK?" It's both: the SDK **is** how you call the API.
