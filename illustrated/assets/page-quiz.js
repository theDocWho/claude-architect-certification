/* page-quiz.js — inline "Check yourself" quiz on a domain explainer page.
   Reuses the existing exam-calibrated bank in quiz-data.js (window.QUIZ) rather
   than authoring new questions: each page shows a DISTINCT slice of 3 questions
   from its domain so siblings in the same domain don't overlap.
   Loaded on demand by app.js loadPageQuiz(). */
(function () {
  if (!window.QUIZ || !window.Ill || !Ill.quiz || document.querySelector(".quizwrap")) return;
  var parts = location.pathname.split("/");
  var file = (parts[parts.length - 1] || "").toLowerCase();
  var dir = parts[parts.length - 2];
  var DOMAIN = { "1-agentic": "d1", "2-tools-mcp": "d2", "3-claude-code": "d3", "4-prompting": "d4", "5-context": "d5" };
  var domId = DOMAIN[dir];
  if (!domId) return;
  var set = window.QUIZ.filter(function (s) { return s.id === domId; })[0];
  if (!set || !set.questions || !set.questions.length) return;

  // position of THIS page among its domain's explainer pages (from Ill.SEQ order)
  var sibs = (Ill.SEQ || []).filter(function (e) { return e[0].toLowerCase().indexOf(dir + "/") === 0; })
    .map(function (e) { return e[0].split("/").pop().toLowerCase(); });
  var pageIdx = sibs.indexOf(file); if (pageIdx < 0) pageIdx = 0;

  var n = set.questions.length;
  var start = (pageIdx * 3) % n;
  var picked = [];
  for (var k = 0; k < Math.min(3, n); k++) picked.push(set.questions[(start + k) % n]);

  var qs = picked.map(function (q) {
    return { q: q.q, choices: q.opts, a: q.a, why: q.why };
  });

  var wrap = document.querySelector(".wrap");
  if (!wrap) return;
  var h = document.createElement("h2");
  h.textContent = "✍️ Check yourself";
  var sub = document.createElement("p");
  sub.className = "small muted";
  sub.style.marginTop = "-4px";
  sub.innerHTML = "Exam-style scenarios from <b>" + (set.label || "this domain") +
    "</b>. Drill the full set on the <a href=\"../../quiz.html\">Quiz</a> page.";
  var host = document.createElement("div");
  var anchor = wrap.querySelector(".prevnext");
  if (anchor) { wrap.insertBefore(h, anchor); wrap.insertBefore(sub, anchor); wrap.insertBefore(host, anchor); }
  else { wrap.appendChild(h); wrap.appendChild(sub); wrap.appendChild(host); }
  Ill.quiz(host, qs, "cca-quiz:" + dir + "/" + file);
})();
