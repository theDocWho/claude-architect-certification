/* Claude Certified Architect — Illustrated explainers. Shared helpers.
   Vanilla JS, no external deps. */
(function (global) {
  "use strict";

  // ---- math ----
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  function softmax(xs, temp) {
    const t = temp == null ? 1 : Math.max(1e-6, temp);
    const m = Math.max(...xs);
    const ex = xs.map((x) => Math.exp((x - m) / t));
    const s = ex.reduce((a, b) => a + b, 0);
    return ex.map((e) => e / s);
  }
  // deterministic RNG (mulberry32)
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- DOM ----
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  function el(tag, attrs, kids) {
    const ns = tag === "svg" || ["g","rect","circle","line","path","text","polyline","polygon","defs","marker","tspan","ellipse"].includes(tag);
    const node = ns ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "style" && typeof attrs[k] === "object") Object.assign(node.style, attrs[k]);
      else if (k === "text") node.textContent = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k in node && !ns) node[k] = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (kids) (Array.isArray(kids) ? kids : [kids]).forEach((c) =>
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }
  // wire a range input to a callback + live value label
  function slider(input, fmt, onInput) {
    const lab = input.closest(".ctrl") && input.closest(".ctrl").querySelector(".val");
    const update = () => {
      const v = parseFloat(input.value);
      if (lab) lab.textContent = fmt ? fmt(v) : v;
      if (onInput) onInput(v);
    };
    input.addEventListener("input", update);
    update();
    return update;
  }
  // draw an arrowed line on an svg between two points
  function arrow(svg, x1, y1, x2, y2, color, label, dashed) {
    color = color || "var(--muted)";
    svg.appendChild(el("line", { x1, y1, x2, y2, stroke: color, "stroke-width": 1.6,
      "stroke-dasharray": dashed ? "5 3" : "" }));
    const ang = Math.atan2(y2 - y1, x2 - x1);
    [-0.5, 0.5].forEach((d) => svg.appendChild(el("line", {
      x1: x2, y1: y2, x2: x2 - 9 * Math.cos(ang - d), y2: y2 - 9 * Math.sin(ang - d),
      stroke: color, "stroke-width": 1.6 })));
    if (label) svg.appendChild(el("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 6,
      "text-anchor": "middle", "font-size": 10, fill: color, text: label }));
  }
  // labelled rounded node, returns geometry
  function box(svg, x, y, w, h, label, bg, fg) {
    svg.appendChild(el("rect", { x: x - w/2, y: y - h/2, width: w, height: h, rx: 8, fill: bg, stroke: fg }));
    (Array.isArray(label) ? label : [label]).forEach((ln, i, arr) =>
      svg.appendChild(el("text", { x, y: y + 4 - (arr.length-1)*6 + i*12, "text-anchor": "middle",
        "font-size": 11, "font-weight": 600, fill: fg, text: ln })));
    return { x, y, w, h };
  }

  // ---- sequential prev/next navigation across our explainer pages ----
  // Single source of truth for "study order" — follows the 5 exam domains.
  const SEQ = [
    // API foundations (start here — ground-up)
    ["api-foundations/what-is-the-api.html", "What is the API?"],
    ["api-foundations/same-concepts-everywhere.html", "Same concepts, different surface"],
    ["api-foundations/messages-api.html", "The Messages API"],
    ["api-foundations/parameters.html", "Parameters that matter"],
    ["api-foundations/reading-the-docs.html", "Reading the API docs"],
    ["api-foundations/model-selection.html", "Opus / Sonnet / Haiku"],
    ["api-foundations/extended-thinking.html", "Extended thinking"],
    // Domain 4 — Prompt Engineering & Structured Output (20%)
    ["4-prompting/prompt-anatomy.html", "Anatomy of a prompt"],
    ["4-prompting/few-shot.html", "Few-shot prompting"],
    ["4-prompting/structured-output.html", "Structured output"],
    ["4-prompting/eval-driven.html", "Eval-driven prompting"],
    // Domain 2 — Tool Design & MCP Integration (18%)
    ["2-tools-mcp/tool-anatomy.html", "Anatomy of a tool"],
    ["2-tools-mcp/structured-errors.html", "Structured errors & retries"],
    ["2-tools-mcp/mcp-architecture.html", "MCP architecture"],
    // Domain 1 — Agentic Architecture & Orchestration (27%)
    ["1-agentic/agent-loop.html", "The agent loop"],
    ["1-agentic/workflows-vs-agents.html", "Workflows vs agents"],
    ["1-agentic/orchestrator-workers.html", "Multi-agent orchestration"],
    ["1-agentic/guardrails.html", "Loop control & guardrails"],
    // Domain 3 — Claude Code Configuration (20%)
    ["3-claude-code/claudemd-hierarchy.html", "CLAUDE.md hierarchy"],
    ["3-claude-code/grep-vs-glob.html", "Grep vs Glob & tools"],
    ["3-claude-code/skills-rules.html", "Skills, rules & hooks"],
    ["3-claude-code/cicd-headless.html", "Headless mode & CI/CD"],
    // Domain 5 — Context Management & Reliability (15%)
    ["5-context/context-window.html", "The context window"],
    ["5-context/prompt-caching.html", "Prompt caching"],
    ["5-context/compaction.html", "Compaction & memory"],
    ["5-context/reliability.html", "Reliability & escalation"],
  ];

  function navCard(item, kind) {
    if (!item) return el("span", { class: "pn empty" });
    return el("a", { class: "pn " + kind, href: "../" + item[0] }, [
      el("span", { class: "dir", text: kind === "prev" ? "← Previous" : "Next →" }),
      el("span", { class: "t", text: item[1] }),
    ]);
  }

  // ---- progress tracking (localStorage; read by the home page & catalog) ----
  const PKEY = "cca-visited";
  function getVisited() {
    try { return JSON.parse(localStorage.getItem(PKEY) || "{}"); } catch (e) { return {}; }
  }
  function markVisited(seqPath) {
    try {
      const v = getVisited();
      v[seqPath] = Date.now();
      localStorage.setItem(PKEY, JSON.stringify(v));
    } catch (e) { /* private mode etc. — fine */ }
  }

  function injectNav() {
    const wrap = document.querySelector(".wrap");
    if (!wrap) return;
    const path = location.pathname.split("/").slice(-2).join("/").toLowerCase();
    const i = SEQ.findIndex((s) => s[0].toLowerCase() === path);
    if (i === -1) return; // index/catalog or an unknown page → no sequential nav
    markVisited(SEQ[i][0]);
    const prev = i > 0 ? SEQ[i - 1] : null;
    const next = i < SEQ.length - 1 ? SEQ[i + 1] : null;

    const bar = el("div", { class: "prevnext" }, [navCard(prev, "prev"), navCard(next, "next")]);
    const footer = wrap.querySelector(".footer");
    if (footer) wrap.insertBefore(bar, footer); else wrap.appendChild(bar);

    const tb = document.querySelector(".topbar");
    if (tb) {
      const mini = el("span", { class: "tbnav" });
      if (prev) mini.appendChild(el("a", { href: "../" + prev[0], title: "Previous: " + prev[1], text: "‹ Prev" }));
      mini.appendChild(el("span", { class: "of", text: (i + 1) + " / " + SEQ.length }));
      if (next) mini.appendChild(el("a", { href: "../" + next[0], title: "Next: " + next[1], text: "Next ›" }));
      const sp = tb.querySelector(".spacer");
      if (sp && sp.nextSibling) tb.insertBefore(mini, sp.nextSibling); else tb.appendChild(mini);
    }
  }
  // ---- v2 page enhancements: reveal-on-scroll, reading bar, keys, confetti ----
  const reduceMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function confetti() {
    if (reduceMotion || typeof requestAnimationFrame !== "function") return;
    const cv = el("canvas", { style: { position: "fixed", inset: "0", width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 999 } });
    document.body.appendChild(cv);
    cv.width = innerWidth; cv.height = innerHeight;
    const ctx = cv.getContext("2d");
    const cols = ["#cc785c", "#3d8a5f", "#c08a2e", "#7a5ea8", "#2c6e9b"];
    const ps = Array.from({ length: 60 }, () => ({
      x: cv.width / 2 + (Math.random() - .5) * 220, y: cv.height * .72,
      vx: (Math.random() - .5) * 7, vy: -5 - Math.random() * 7,
      s: 4 + Math.random() * 5, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
      c: cols[(Math.random() * cols.length) | 0],
    }));
    let t = 0;
    (function tick() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .22; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 80);
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore(); });
      if (++t < 85) requestAnimationFrame(tick); else cv.remove();
    })();
  }

  // ---- inline quiz (same shape as roadmap Ill.quiz) ----
  // questions = [{ q, choices: [..], a: idx, why }]. Score persists to localStorage.
  function quiz(host, questions, storeKey) {
    if (typeof host === "string") host = $(host);
    if (!host) return;
    const store = storeKey || "cca-quiz:" + location.pathname.split("/").slice(-2).join("/");
    let score = 0, answered = 0;
    const wrap = el("div", { class: "quizwrap" });
    const tally = el("div", { class: "qscore" });
    questions.forEach((q, qi) => {
      const card = el("div", { class: "qcard" });
      card.appendChild(el("p", { class: "qq", html: "<b>Q" + (qi + 1) + ".</b> " + q.q }));
      const fb = el("div", { class: "fb2" });
      const box = el("div", { class: "choices" });
      const btns = q.choices.map((c, ci) => {
        const b = el("button", { class: "choice", type: "button", html: c });
        b.addEventListener("click", () => {
          if (b.disabled) return;
          btns.forEach((x) => { x.disabled = true; });
          answered++;
          if (ci === q.a) {
            score++; b.classList.add("good");
            fb.className = "fb2 ok"; fb.innerHTML = "✓ " + (q.why || "Correct.");
          } else {
            b.classList.add("bad"); btns[q.a].classList.add("good");
            fb.className = "fb2 no"; fb.innerHTML = "✗ " + (q.why || "");
          }
          if (answered === questions.length) {
            tally.textContent = "Score: " + score + " / " + questions.length +
              (score === questions.length ? " — perfect 🎯" : "");
            try { localStorage.setItem(store, JSON.stringify({ score, total: questions.length, ts: Date.now() })); } catch (e) {}
          }
        });
        box.appendChild(b);
        return b;
      });
      card.appendChild(box);
      card.appendChild(fb);
      wrap.appendChild(card);
    });
    wrap.appendChild(tally);
    host.appendChild(wrap);
    return wrap;
  }

  // Load the domain quiz bank + injector on domain explainer pages (reuses window.QUIZ).
  function loadPageQuiz() {
    const dir = location.pathname.split("/").slice(-2, -1)[0];
    const DOMAIN = { "1-agentic": "d1", "2-tools-mcp": "d2", "3-claude-code": "d3", "4-prompting": "d4", "5-context": "d5" };
    if (!DOMAIN[dir] || document.querySelector(".quizwrap") || document.getElementById("pagequiz-js")) return;
    const me = document.querySelector('script[src*="assets/app.js"]');
    if (!me) return;
    const base = me.getAttribute("src").replace(/app\.js$/, "");
    const inject = () => {
      const s = document.createElement("script");
      s.id = "pagequiz-js"; s.src = base + "page-quiz.js";
      document.body.appendChild(s);
    };
    if (window.QUIZ) { inject(); return; }
    const qd = document.createElement("script");
    qd.src = base + "quiz-data.js"; qd.onload = inject;
    document.body.appendChild(qd);
  }

  // ---- practice notebooks (hands-on Claude API, run on Colab/Kaggle) ----
  // Domain dir -> notebook path in the public companion repo. Cert notebooks call
  // the live API (need a key + internet), so we link them from GitHub rather than
  // shipping offline copies.
  const NB_REPO = "theDocWho/lbv-notebooks";
  const NB = {
    "api-foundations": "claude-architect/00-foundations-api.ipynb",
    "1-agentic": "claude-architect/01-agentic-tool-loop.ipynb",
  };
  function practicePanel() {
    const dir = location.pathname.split("/").slice(-2, -1)[0];
    const nb = NB[dir];
    if (!nb || document.querySelector(".practice")) return;
    const wrap = document.querySelector(".wrap");
    if (!wrap) return;
    const raw = "https://raw.githubusercontent.com/" + NB_REPO + "/main/" + nb;
    const box = el("div", { class: "practice" }, [
      el("div", { class: "plabel", text: "🧪 PRACTICE — RUN IT YOURSELF" }),
      el("p", { class: "ptext", html: "Reading builds intuition; <b>running the API cements it</b>. This domain has a " +
        "hands-on notebook — a live Claude agent loop with TODO exercises and self-checking asserts. " +
        "Run it free on Colab or Kaggle (you supply an Anthropic API key; a full pass costs a few cents)." }),
      el("div", { class: "pbtns" }, [
        el("a", { class: "nbbtn colab", target: "_blank", rel: "noopener",
          href: "https://colab.research.google.com/github/" + NB_REPO + "/blob/main/" + nb, text: "▶ Open in Colab" }),
        el("a", { class: "nbbtn kaggle", target: "_blank", rel: "noopener",
          href: "https://kaggle.com/kernels/welcome?src=" + raw, text: "Open in Kaggle" }),
        el("a", { class: "nbbtn", target: "_blank", rel: "noopener", href: raw, text: "⬇ Notebook (.ipynb)" }),
      ]),
    ]);
    const pn = wrap.querySelector(".prevnext");
    if (pn) wrap.insertBefore(box, pn); else wrap.appendChild(box);
  }

  function enhance() {
    const wrap = document.querySelector(".wrap");
    if (!wrap) return;
    loadPageQuiz();
    practicePanel();

    // reading progress bar
    if (!document.getElementById("readbar")) {
      const bar = el("div", { id: "readbar" });
      document.body.appendChild(bar);
      const upd = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.width = (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + "%";
      };
      addEventListener("scroll", upd, { passive: true }); upd();
    }

    // reveal-on-scroll for the main content blocks
    if (typeof IntersectionObserver === "function") {
      const targets = $$(".wrap > h2, .wrap > .panel, .wrap > table, .wrap > .note, .wrap > .eli10, .wrap > .callout, .wrap > .grid, .wrap > ol.steps");
      if (targets.length) {
        const io = new IntersectionObserver((es) => es.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }), { rootMargin: "0px 0px -8% 0px" });
        targets.forEach(t => { t.classList.add("rv"); io.observe(t); });
      }
    }

    // page-in-SEQ extras: keyboard nav, hint, first-completion confetti
    const path = location.pathname.split("/").slice(-2).join("/").toLowerCase();
    const i = SEQ.findIndex((s) => s[0].toLowerCase() === path);
    if (i === -1) return;

    addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if (e.key === "ArrowLeft" && i > 0) location.href = "../" + SEQ[i - 1][0];
      if (e.key === "ArrowRight" && i < SEQ.length - 1) location.href = "../" + SEQ[i + 1][0];
    });
    document.body.appendChild(el("div", { class: "kbdhint",
      html: "<kbd>←</kbd> prev &nbsp;·&nbsp; next <kbd>→</kbd>" }));

    // confetti the first time the takeaways box is reached on this page
    const take = document.querySelector(".note.green");
    if (take && typeof IntersectionObserver === "function") {
      try {
        const done = JSON.parse(localStorage.getItem("cca-confetti") || "{}");
        if (!done[SEQ[i][0]]) {
          const io2 = new IntersectionObserver((es) => es.forEach(en => {
            if (!en.isIntersecting) return;
            io2.disconnect(); confetti();
            done[SEQ[i][0]] = 1;
            localStorage.setItem("cca-confetti", JSON.stringify(done));
          }), { threshold: .4 });
          io2.observe(take);
        }
      } catch (e) { /* storage unavailable */ }
    }
  }

  // ---- moved banner: this deployment is archival; the canonical site lives on-domain ----
  function movedBanner() {
    var NEW_BASE = "https://learn-by-visuallization.org/architect/";
    var path = location.pathname.replace(/^\/claude-architect-certification\//, "").replace(/^\//, "");
    var target = NEW_BASE + path + location.search;
    var bar = el("div", { style: {
      background: "linear-gradient(135deg, #ff8a5c, #f4603a)", color: "#1d1207",
      padding: "9px 16px", textAlign: "center", fontSize: "13.5px", fontWeight: "600",
      lineHeight: "1.5", position: "relative", zIndex: "1000",
    } });
    var a = el("a", { href: target, text: "learn-by-visuallization.org/architect", style: {
      color: "#1d1207", fontWeight: "800", textDecoration: "underline", textUnderlineOffset: "2px",
    } });
    bar.appendChild(document.createTextNode("📦 This site has moved — the maintained version (with The Path, guided experiments & more) is at "));
    bar.appendChild(a);
    bar.appendChild(document.createTextNode(". This copy is archived."));
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function boot() { movedBanner(); injectNav(); enhance(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  global.Ill = { clamp, lerp, softmax, rng, $, $$, el, slider, arrow, box, SEQ, getVisited, confetti, quiz };
})(window);
