const storageKey = "workroom-campus-state-v1";

export const defaultState = {
  user: null,
  currentView: "login",
  completed: false,
  selectedMission: "incident-zero",
  simulation: {
    step: 0,
    evidence: null,
    hypothesis: null,
    update: "",
    decisions: [],
    aiFeedback: null,
    aiFeedbackStatus: "idle"
  },
  portfolio: []
};

export const missionData = {
  "incident-zero": {
    title: "Incident Zero",
    eyebrow: "Systems apprenticeship · 18 min",
    description: "A new deployment has pushed the campus learning portal into failure. Triage ambiguity, direct an AI agent responsibly, and keep people informed.",
    categories: ["Systems thinking", "Verification", "Communication"],
    difficulty: "Foundation",
    color: "violet"
  },
  "spec-before-code": {
    title: "Spec before code",
    eyebrow: "Engineering craft · 12 min",
    description: "Turn a vague feature request into constraints an agent can safely execute.",
    categories: ["Problem framing", "AI direction"],
    difficulty: "Next up",
    color: "orange"
  },
  "feedback-loop": {
    title: "The hard feedback",
    eyebrow: "Human skills · 9 min",
    description: "Give a teammate specific feedback without reducing trust.",
    categories: ["Leadership", "Communication"],
    difficulty: "21st-century skill",
    color: "blue"
  }
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === "object") return { ...structuredClone(defaultState), ...saved };
  } catch (_) {
    // A corrupt local demo state should never prevent a student from entering.
  }
  return structuredClone(defaultState);
}

let state = loadState();

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name = "Student") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function icon(name, size = 20) {
  const icons = {
    spark: '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/>',
    library: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    shield: '<path d="M12 22s8-3.8 8-10V5l-8-3-8 3v7c0 6.2 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect width="14" height="11" x="5" y="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/>',
    code: '<path d="m8 9-3 3 3 3"/><path d="m16 9 3 3-3 3"/><path d="m14 5-4 14"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 6-8"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
}

function setView(view) {
  state.currentView = view;
  saveState();
  render();
}

function nav(active) {
  const user = state.user || { name: "Student" };
  const items = [
    ["dashboard", "home", "Home"],
    ["missions", "compass", "Work worlds"],
    ["portfolio", "library", "My proof"]
  ];
  return `
    <header class="topbar">
      <a class="brand" href="#dashboard" data-view="dashboard" aria-label="Workroom home">
        <span class="brand-mark">${icon("spark", 17)}</span><span>workroom</span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${items.map(([view, ico, label]) => `<button class="nav-item ${active === view ? "active" : ""}" data-view="${view}">${icon(ico, 18)}<span>${label}</span></button>`).join("")}
      </nav>
      <div class="top-actions">
        <button class="icon-button" aria-label="Notifications">${icon("bell", 19)}<i></i></button>
        <button class="avatar" data-action="profile" aria-label="Open student profile">${initials(user.name)}</button>
      </div>
    </header>
    <nav class="mobile-nav" aria-label="Primary navigation">
      ${items.map(([view, ico, label]) => `<button class="nav-item ${active === view ? "active" : ""}" data-view="${view}">${icon(ico, 18)}<span>${label}</span></button>`).join("")}
    </nav>`;
}

function loginView() {
  return `<main class="auth-shell">
    <section class="auth-story">
      <a class="brand light" href="#login"><span class="brand-mark">${icon("spark", 17)}</span><span>workroom</span></a>
      <div class="story-copy">
        <span class="eyebrow light-eyebrow">THE COLLEGE WORK LAYER</span>
        <h1>Don’t just learn<br/><em>the future.</em><br/>Practise owning it.</h1>
        <p>Real engineering decisions. Real collaborators. Evidence of how you think—not just what you know.</p>
      </div>
      <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
      <div class="story-art" aria-hidden="true">
        <div class="glow-orb"></div>
        <div class="art-card art-card-one"><span>01</span><strong>Frame</strong><small>Ask what others miss.</small></div>
        <div class="art-card art-card-two"><span>02</span><strong>Direct</strong><small>Give agents the right harness.</small></div>
        <div class="art-card art-card-three"><span>03</span><strong>Own</strong><small>Verify what reaches people.</small></div>
      </div>
      <p class="story-foot">Designed for learners. Protected by responsible AI.</p>
    </section>
    <section class="auth-panel">
      <div class="auth-card">
        <span class="eyebrow">WELCOME TO YOUR WORKROOM</span>
        <h2>Start your apprenticeship.</h2>
        <p class="muted">Use your college email to save your progress on this device.</p>
        <form id="login-form" class="auth-form">
          <label>Full name<input id="name" name="name" autocomplete="name" required placeholder="e.g. Ananya Rao" /></label>
          <label>College email<input id="email" name="email" type="email" autocomplete="email" required placeholder="you@college.edu" /></label>
          <button class="primary-btn" type="submit">Enter Workroom ${icon("arrow", 18)}</button>
        </form>
        <div class="auth-divider"><span>or</span></div>
        <button class="google-button" data-action="demo-login"><span class="google-mark">G</span> Continue with demo profile</button>
        <div class="privacy-note">${icon("shield", 16)} <span>Your reflections stay private. You decide what becomes part of your portfolio.</span></div>
      </div>
    </section>
  </main>`;
}

function objectiveCard() {
  return `<div class="objective-card">
    <div class="objective-art"><div class="server-stack"><span></span><span></span><span></span></div><div class="pulse-line"></div><div class="alert-dot"></div></div>
    <div class="objective-content">
      <span class="eyebrow">CURRENT WORK WORLD · WEEK 02</span>
      <h2>Incident Zero</h2>
      <p>Your first on-call handover: find the signal in noisy data, direct your AI agent safely, and protect student learning time.</p>
      <div class="objective-meta"><span>${icon("terminal", 16)} CSE / Platform engineering</span><span>${icon("chart", 16)} 18 min</span></div>
      <button class="primary-btn" data-action="start-simulation">Continue mission ${icon("arrow", 18)}</button>
    </div>
    <div class="objective-side"><span>YOUR ROLE</span><strong>Systems<br/>apprentice</strong><div class="progress-track"><i style="width:46%"></i></div><small>2 of 4 moments complete</small></div>
  </div>`;
}

function dashboardView() {
  const user = state.user || { name: "Student" };
  return `<div class="shell">${nav("dashboard")}
    <main class="page dashboard-page">
      <section class="welcome-row"><div><span class="eyebrow">THIRD-YEAR CSE · AI-NATIVE PATHWAY</span><h1>Good evening, ${escapeHtml(user.name.split(" ")[0])}.</h1><p>Today, do work that future you can point to.</p></div><div class="streak"><span class="streak-fire">✦</span><strong>3</strong><small>weeks of deliberate practice</small></div></section>
      ${objectiveCard()}
      <section class="dashboard-grid">
        <div class="panel growth-panel"><div class="panel-head"><div><span class="eyebrow">YOUR EVOLVING EDGE</span><h3>Engineering is 70%.<br/>Human judgment is 30%.</h3></div><button class="text-button" data-view="portfolio">View proof ${icon("arrow", 15)}</button></div>
          <div class="skill-bars">
            ${skillBar("Systems thinking", 74, "violet")}${skillBar("Agent direction", 62, "orange")}${skillBar("Verification", 48, "blue")}${skillBar("Communication", 67, "pink")}
          </div>
          <p class="insight">Your strongest move: you frame ambiguity before building. Next edge: prove agent output under failure conditions.</p>
        </div>
        <div class="panel signal-panel"><div class="signal-top"><span class="signal-icon">${icon("heart", 18)}</span><span class="eyebrow">MOMENTUM CHECK</span></div><h3>How’s the pace?</h3><p>Progress is not a streak. Take the pace that helps you learn.</p><div class="mood-options" role="group" aria-label="How are you feeling"><button data-action="mood" data-mood="energised">Energised</button><button data-action="mood" data-mood="steady">Steady</button><button data-action="mood" data-mood="overloaded">Overloaded</button></div><small id="mood-response" aria-live="polite">Your wellbeing is never scored or shared.</small></div>
      </section>
      <section class="section-head"><div><span class="eyebrow">NEXT ON YOUR PATH</span><h2>Choose your next stretch.</h2></div><button class="text-button" data-view="missions">Explore all ${icon("arrow", 15)}</button></section>
      <section class="mission-row">${missionCard("spec-before-code")}${missionCard("feedback-loop")}</section>
      <section class="responsible-strip"><span class="strip-icon">${icon("shield", 20)}</span><div><strong>Responsible AI, by design.</strong><span>Workroom never uses personality labels, hidden scores, or automated placement decisions.</span></div><button class="text-button" data-action="open-safety">See our learner promise ${icon("arrow", 15)}</button></section>
    </main>
  </div>`;
}

function skillBar(label, value, color) {
  return `<div class="skill-bar"><div><span>${label}</span><b>${value}</b></div><div class="bar-track"><i class="${color}" style="width:${value}%"></i></div></div>`;
}

function missionCard(id) {
  const mission = missionData[id];
  return `<article class="mission-card ${mission.color}"><div class="mission-card-art"><span class="mission-index">${id === "spec-before-code" ? "02" : "03"}</span><div class="symbol">${id === "spec-before-code" ? icon("code", 30) : icon("users", 30)}</div></div><div class="mission-card-body"><span class="eyebrow">${mission.eyebrow}</span><h3>${mission.title}</h3><p>${mission.description}</p><button class="round-arrow" data-action="select-mission" data-mission="${id}" aria-label="Open ${mission.title}">${icon("arrow", 18)}</button></div></article>`;
}

function missionsView() {
  return `<div class="shell">${nav("missions")}<main class="page missions-page"><section class="page-intro"><span class="eyebrow">YOUR PRACTICE LIBRARY</span><h1>Build a body of<br/><em>work and judgment.</em></h1><p>Every work world leaves you with a decision record—not a generic completion badge.</p></section><div class="filter-row"><button class="filter active">All worlds</button><button class="filter">Engineering core</button><button class="filter">Human edge</button><button class="filter">Research & thought</button></div><section class="mission-grid">${Object.entries(missionData).map(([id, mission]) => `<article class="world-card ${mission.color}"><div class="world-top"><span>${mission.difficulty}</span><span>•</span><span>${mission.eyebrow.split("·")[1] || "18 min"}</span></div><div class="world-symbol">${id === "incident-zero" ? icon("terminal", 36) : id === "spec-before-code" ? icon("code", 36) : icon("users", 36)}</div><h2>${mission.title}</h2><p>${mission.description}</p><div class="tag-row">${mission.categories.map((tag) => `<span>${tag}</span>`).join("")}</div><button class="primary-btn dark-button" data-action="select-mission" data-mission="${id}">${id === "incident-zero" ? "Enter world" : "Preview world"} ${icon("arrow", 18)}</button></article>`).join("")}</section></main></div>`;
}

function portfolioView() {
  const items = state.portfolio;
  return `<div class="shell">${nav("portfolio")}<main class="page portfolio-page"><section class="page-intro"><span class="eyebrow">YOUR CAREER PROVENANCE</span><h1>Proof of how<br/><em>you create value.</em></h1><p>Private by default. You choose what you share with mentors or employers.</p></section><section class="proof-summary"><div><span class="eyebrow">READINESS PROFILE</span><h2>Systems apprentice</h2><p>You are developing a reliable pattern: clarify → verify → communicate.</p></div><div class="proof-stats"><span><b>${items.length}</b> decision records</span><span><b>1</b> team signal</span><span><b>0</b> hidden scores</span></div></section><section class="portfolio-list"><div class="section-head"><div><span class="eyebrow">DECISION RECORDS</span><h2>What you have practised.</h2></div></div>${items.length ? items.map((item) => `<article class="record-card"><div class="record-status">${icon("check", 18)}</div><div><span class="eyebrow">${item.date}</span><h3>${item.title}</h3><p>${item.summary}</p></div><div class="record-score"><b>${item.score}</b><span>evidence score</span></div></article>`).join("") : `<div class="empty-card">${icon("library", 28)}<h3>Your proof starts with a real decision.</h3><p>Complete Incident Zero to add an evidence-backed record here.</p><button class="primary-btn" data-action="start-simulation">Start Incident Zero ${icon("arrow", 18)}</button></div>`}</section></main></div>`;
}

function stepLabel(step) {
  return ["Read the system", "Gather evidence", "Choose a hypothesis", "Own the update"][step] || "Debrief";
}

function choice(id, title, description, score, secondary = "") {
  return `<button class="choice-card" data-action="evidence" data-choice="${id}" data-score="${score}"><span class="choice-key">${id.toUpperCase()}</span><span><strong>${title}</strong><small>${description}</small>${secondary ? `<em>${secondary}</em>` : ""}</span>${icon("arrow", 18)}</button>`;
}

function simulationView() {
  const sim = state.simulation;
  const content = simulationContent(sim.step);
  return `<div class="simulation-shell"><header class="sim-topbar"><a class="brand" href="#dashboard" data-view="dashboard"><span class="brand-mark">${icon("spark", 17)}</span><span>workroom</span></a><div class="sim-progress"><span>INCIDENT ZERO</span><div>${[0, 1, 2, 3].map((n) => `<i class="${n <= sim.step ? "filled" : ""}"></i>`).join("")}</div><small>${Math.min(sim.step + 1, 4)} / 4</small></div><button class="exit-sim" data-view="dashboard">Save & exit</button></header><main class="simulation-main"><aside class="mission-sidebar"><span class="eyebrow">YOUR MISSION</span><h1>When the system breaks, what do you protect first?</h1><p>Learn to operate with agents without handing over judgment.</p><div class="mission-principle"><span>${icon("shield", 18)}</span><p><strong>Human owns the call.</strong> AI can investigate and propose. You set scope, verify evidence, and decide what ships.</p></div><div class="role-chip"><span class="avatar small">${initials((state.user || {}).name)}</span><div><small>YOU ARE</small><strong>Systems apprentice</strong></div></div></aside><section class="scenario-area"><div class="scenario-head"><span class="eyebrow">MOMENT ${sim.step + 1} · ${stepLabel(sim.step).toUpperCase()}</span><button class="safety-pill" data-action="open-safety">${icon("shield", 15)} Learner-safe mode</button></div>${content}</section></main></div>`;
}

function simulationContent(step) {
  if (step === 0) return `<div class="brief-panel"><span class="incident-badge">● LIVE INCIDENT</span><h2>The learning portal is failing—five minutes before a high-stakes quiz.</h2><p>Support reports that students see intermittent 500 errors after the 09:14 deployment. Your team lead is offline. An AI agent is available, but you must give it safe, useful direction.</p><div class="chat-preview"><div class="chat-avatar">S</div><div><strong>Support · 09:19</strong><p>“We have 14 reports. Some students can still log in, but quiz submissions are timing out.”</p></div></div><div class="system-map"><span>Browser</span><i></i><span>API</span><i></i><span>Quiz service</span><i class="danger"></i><span>Database</span></div><div class="callout"><span>${icon("spark", 18)}</span><p><b>Before you act:</b> the fastest-looking move is not always the safest. Start by making the failure legible.</p></div><button class="primary-btn" data-action="next-step">Open the incident room ${icon("arrow", 18)}</button></div>`;
  if (step === 1) return `<div class="scenario-prompt"><h2>What evidence do you ask your agent to gather first?</h2><p>A good agent request narrows uncertainty without causing irreversible change.</p><div class="choice-list">${choice("a", "Map the failing request path", "Ask the agent to correlate error rate, endpoint, deploy diff, and service logs—read-only.", 28, "High signal · safe scope")}${choice("b", "Restart every service", "Ask the agent to restore normality as quickly as possible.", 7, "Fast, but destroys useful evidence")}${choice("c", "Write an apology to students", "Communicate immediately, before the technical picture is clear.", 13, "Caring, but incomplete")}</div></div>`;
  if (step === 2) return `<div class="scenario-prompt"><div class="agent-report"><div class="report-head"><span>${icon("spark", 17)}</span><b>Agent investigation report</b><span class="read-only">READ-ONLY</span></div><p><b>Finding:</b> 92% of errors come from <code>POST /attempts</code>. They began 43 seconds after deployment <code>2026.07.18-4</code>. Database connections are saturated; the new retry wrapper can issue duplicate writes under slow responses.</p><div class="mini-metrics"><span><b>5.8%</b> error rate</span><span><b>96%</b> DB pool</span><span><b>14</b> student reports</span></div></div><h2>What is your safest working hypothesis?</h2><p>Name what you know, what you infer, and the next reversible action.</p><div class="choice-list">${choice("a", "Revert the retry-wrapper release and monitor", "The timing, endpoint, and saturation evidence point to a contained regression. Revert is reversible.", 30, "Evidence-led · reversible")}${choice("b", "Increase database capacity permanently", "The database is saturated, so more capacity must be the fix.", 12, "Treats a symptom as a cause")}${choice("c", "Wait for more student reports", "The impact may not be significant enough to act yet.", 4, "Delays protection for affected users")}</div></div>`;
  if (step === 3) return `<div class="scenario-prompt"><h2>Own the update.</h2><p>Write a short message for the academic operations lead. It should name the impact, action, and next update—without pretending certainty.</p><label class="update-label" for="stakeholder-update">Your incident update</label><textarea id="stakeholder-update" maxlength="520" placeholder="Example: We’re investigating intermittent quiz-submission failures affecting some students. We have isolated the likely change and are rolling it back now. We’ll confirm recovery and provide an update in 10 minutes.">${escapeHtml(state.simulation.update)}</textarea><div class="writing-prompts"><span>Include: impact</span><span>current action</span><span>next update</span><span>avoid blame</span></div><button class="primary-btn" data-action="finish-simulation">Finish & see my debrief ${icon("arrow", 18)}</button><small class="privacy-helper">${icon("lock", 14)} This reflection stays in your private learning record until you choose to share it.</small></div>`;
  return debriefContent();
}

export function calculateScore(simulation) {
  let score = 30;
  if (simulation.evidence === "a") score += 28;
  else if (simulation.evidence) score += 7;
  if (simulation.hypothesis === "a") score += 30;
  else if (simulation.hypothesis) score += 4;
  const update = (simulation.update || "").toLowerCase();
  const signals = ["student", "impact", "rollback", "update", "investigat", "minute"];
  score += Math.min(12, signals.filter((word) => update.includes(word)).length * 2);
  return Math.min(100, score);
}

function feedbackFor(score, sim) {
  const strong = [];
  const next = [];
  if (sim.evidence === "a") strong.push("You made the system legible before changing it. That is how reliable engineers preserve both evidence and options.");
  else next.push("Start with a read-only evidence request before taking broad action. It narrows the problem without erasing the trail.");
  if (sim.hypothesis === "a") strong.push("You chose a reversible action matched to the evidence—not a permanent fix based on a symptom.");
  else next.push("Separate the symptom from the cause. State a testable hypothesis and take the safest reversible next step.");
  if ((sim.update || "").trim().length > 70) strong.push("Your stakeholder update acknowledges uncertainty while giving people a clear next checkpoint.");
  else next.push("Communicate earlier and more concretely: impact, action, and the time of the next update.");
  if (!strong.length) strong.push("You entered the incident room and made decisions under uncertainty. The next run is where deliberate practice compounds.");
  return { strong, next, level: score >= 82 ? "Evidence-led operator" : score >= 60 ? "Developing systems thinker" : "Early systems apprentice" };
}

function debriefContent() {
  const score = calculateScore(state.simulation);
  const feedback = feedbackFor(score, state.simulation);
  const ai = state.simulation.aiFeedback;
  const aiSection = state.simulation.aiFeedbackStatus === "loading"
    ? `<div class="ai-debrief-loading" aria-live="polite">${icon("spark", 17)} Gemini is preparing a personalised coaching note…</div>`
    : ai
      ? `<section class="ai-coaching"><div><span>${icon("spark", 17)}</span><div><span class="feedback-label good">PERSONALISED AI COACHING</span><h3>${escapeHtml(ai.title)}</h3></div></div><p>${escapeHtml(ai.coaching)}</p><div class="coach-rep"><b>Next practice:</b> ${escapeHtml(ai.nextRep)}</div><small>${escapeHtml(ai.boundary)}</small></section>`
      : ``;
  return `<div class="debrief"><span class="eyebrow">MISSION COMPLETE · PRIVATE DEBRIEF</span><h2>You practised the work<br/>behind the work.</h2><div class="debrief-score"><div class="score-ring"><b>${score}</b><small>/100</small></div><div><span class="score-label">${feedback.level}</span><p>This is not a hiring score. It is a private snapshot of this one practice run.</p></div></div><div class="feedback-grid"><div><span class="feedback-label good">WHAT YOU DID WELL</span>${feedback.strong.map((text) => `<p>${icon("check", 16)} ${text}</p>`).join("")}</div><div><span class="feedback-label next">YOUR NEXT REP</span>${(feedback.next.length ? feedback.next : ["Try the advanced incident next: introduce an incomplete runbook, a worried stakeholder, and a misleading metric."]).map((text) => `<p>${icon("arrow", 16)} ${text}</p>`).join("")}</div></div>${aiSection}<div class="decision-record"><span>${icon("library", 18)}</span><p><strong>Decision record created.</strong> Your portfolio now shows how you handled ambiguity, evidence, reversibility, and communication.</p></div><div class="debrief-actions"><button class="primary-btn" data-action="save-debrief">Save to my proof ${icon("check", 18)}</button><button class="secondary-btn" data-view="dashboard">Return home</button></div></div>`;
}

async function getGeminiDebrief() {
  state.simulation.aiFeedbackStatus = "loading";
  saveState();
  render();
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mission: "Incident Zero", evidenceChoice: state.simulation.evidence, hypothesisChoice: state.simulation.hypothesis, stakeholderUpdate: state.simulation.update })
    });
    if (!response.ok) throw new Error("Gemini coaching is unavailable");
    const payload = await response.json();
    state.simulation.aiFeedback = payload.feedback;
    state.simulation.aiFeedbackStatus = "ready";
  } catch (_) {
    state.simulation.aiFeedbackStatus = "unavailable";
  }
  saveState();
  render();
}

function safetyModal() {
  return `<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="safety-title"><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close", 20)}</button><span class="modal-icon">${icon("shield", 24)}</span><span class="eyebrow">THE LEARNER PROMISE</span><h2 id="safety-title">AI should expand your agency—not silently judge it.</h2><ul><li><b>Private by default.</b> Reflections and practice history belong to you.</li><li><b>No personality scoring.</b> We assess observable work decisions, never identity or emotional state.</li><li><b>Human accountability.</b> The AI can propose; you remain responsible for decisions and verification.</li><li><b>Explainable feedback.</b> Every suggestion links to evidence from your response.</li><li><b>Pause is progress.</b> There are no punitive streaks, public rankings, or automatic escalation.</li></ul><button class="primary-btn" data-action="close-modal">I understand ${icon("check", 18)}</button></section></div>`;
}

function render() {
  const root = document.querySelector("#app");
  let markup = "";
  if (!state.user || state.currentView === "login") markup = loginView();
  else if (state.currentView === "dashboard") markup = dashboardView();
  else if (state.currentView === "missions") markup = missionsView();
  else if (state.currentView === "portfolio") markup = portfolioView();
  else if (state.currentView === "simulation") markup = simulationView();
  root.innerHTML = markup;
  if (state.modal === "safety") root.insertAdjacentHTML("beforeend", safetyModal());
  bindEvents(root);
}

function bindEvents(root) {
  root.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  root.querySelectorAll('[data-action="open-safety"]').forEach((button) => button.addEventListener("click", () => { state.modal = "safety"; saveState(); render(); }));
  root.querySelectorAll('[data-action="close-modal"]').forEach((button) => button.addEventListener("click", () => { delete state.modal; saveState(); render(); }));
  root.querySelectorAll('[data-action="demo-login"]').forEach((button) => button.addEventListener("click", () => login({ name: "Ananya Rao", email: "ananya@workroom.demo" })));
  const form = root.querySelector("#login-form");
  if (form) form.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(form); login({ name: data.get("name").trim(), email: data.get("email").trim() }); });
  root.querySelectorAll('[data-action="start-simulation"]').forEach((button) => button.addEventListener("click", startSimulation));
  root.querySelectorAll('[data-action="select-mission"]').forEach((button) => button.addEventListener("click", () => { const id = button.dataset.mission; state.selectedMission = id; saveState(); if (id === "incident-zero") startSimulation(); else previewMission(id); }));
  root.querySelectorAll('[data-action="mood"]').forEach((button) => button.addEventListener("click", () => { const response = root.querySelector("#mood-response"); if (response) response.textContent = button.dataset.mood === "overloaded" ? "Thanks for noticing. It’s okay to pause—your progress is still yours." : "Thanks for checking in. Your wellbeing is never scored or shared."; root.querySelectorAll('[data-action="mood"]').forEach((item) => item.classList.remove("selected")); button.classList.add("selected"); }));
  const next = root.querySelector('[data-action="next-step"]'); if (next) next.addEventListener("click", () => { state.simulation.step = 1; saveState(); render(); });
  root.querySelectorAll('[data-action="evidence"]').forEach((button) => button.addEventListener("click", () => { if (state.simulation.step === 1) state.simulation.evidence = button.dataset.choice; else state.simulation.hypothesis = button.dataset.choice; state.simulation.decisions.push({ step: state.simulation.step, choice: button.dataset.choice }); state.simulation.step += 1; saveState(); render(); }));
  const finish = root.querySelector('[data-action="finish-simulation"]'); if (finish) finish.addEventListener("click", () => { const area = root.querySelector("#stakeholder-update"); state.simulation.update = area ? area.value.trim() : ""; state.simulation.step = 4; saveState(); render(); getGeminiDebrief(); });
  const save = root.querySelector('[data-action="save-debrief"]'); if (save) save.addEventListener("click", () => { const score = calculateScore(state.simulation); if (!state.completed) { state.portfolio.unshift({ title: "Incident Zero", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), score, summary: "Triaged a production incident using evidence, reversible action, and a stakeholder update." }); state.completed = true; } state.currentView = "portfolio"; saveState(); render(); });
}

function login(user) {
  state.user = user;
  state.currentView = "dashboard";
  saveState();
  render();
}

function startSimulation() {
  state.currentView = "simulation";
  state.selectedMission = "incident-zero";
  state.simulation = structuredClone(defaultState.simulation);
  saveState();
  render();
}

function previewMission(id) {
  const mission = missionData[id];
  state.modal = "safety";
  saveState();
  render();
  setTimeout(() => {
    const modal = document.querySelector(".modal");
    if (modal) modal.innerHTML = `<button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close", 20)}</button><span class="modal-icon">${id === "spec-before-code" ? icon("code", 24) : icon("users", 24)}</span><span class="eyebrow">COMING IN THE NEXT SPRINT</span><h2>${mission.title}</h2><p>${mission.description}</p><p class="muted">For this product MVP, Incident Zero is the full interactive work world. This card shows how the pathway expands from engineering practice into the human skills that make technical work matter.</p><button class="primary-btn" data-action="close-modal">Back to worlds ${icon("arrow", 18)}</button>`;
    bindEvents(document.querySelector("#app"));
  }, 0);
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("hashchange", () => {
    const view = location.hash.slice(1);
    if (["login", "dashboard", "missions", "portfolio"].includes(view) && state.user) setView(view);
  });
  render();
}
