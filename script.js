const chatMessages = document.getElementById('chat-messages');
const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const btnTheme = document.getElementById('btn-theme');
const btnHome = document.getElementById('btn-home');
const btnSummary = document.getElementById('btn-summary');

let state = { mode: null, country: null, stage: 1, quiz: [], quizIdx: 0, score: 0, history: [], awaitingQuizAnswer: false, awaitingCountry: null, eligStep: 0, ftvStep: 0, mythInput: null, ballotSection: 0 };

// Particles
(function initParticles() {
  const c = document.getElementById('particles-bg');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = Math.random() * 4 + 2;
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;background:${['#6366f1','#8b5cf6','#a78bfa','#818cf8'][Math.floor(Math.random()*4)]};animation-duration:${Math.random()*10+10}s;animation-delay:${Math.random()*10}s;`;
    c.appendChild(p);
  }
})();

// Theme
btnTheme.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
  btnTheme.textContent = isLight ? '🌙' : '☀️';
});

// Scroll
function scrollBottom() { setTimeout(() => chatArea.scrollTop = chatArea.scrollHeight, 100); }

// Add message
function addMsg(text, isUser) {
  const d = document.createElement('div');
  d.className = `message ${isUser ? 'user' : 'bot'}`;
  d.innerHTML = `<div class="message-avatar">${isUser ? '👤' : '🗳️'}</div><div class="message-content">${text}</div>`;
  chatMessages.appendChild(d);
  if (!isUser) state.history.push(text.replace(/<[^>]*>/g, '').substring(0, 100));
  scrollBottom();
}

// Typing indicator
function showTyping() {
  const t = document.createElement('div');
  t.className = 'typing-indicator'; t.id = 'typing';
  t.innerHTML = `<div class="message-avatar">🗳️</div><div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(t); scrollBottom();
}
function hideTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

function botReply(html, delay = 600) {
  showTyping();
  setTimeout(() => { hideTyping(); addMsg(html, false); }, delay);
}

function botReplyWithButtons(html, buttons, delay = 600) {
  showTyping();
  setTimeout(() => {
    hideTyping();
    let btnHtml = `<div class="quick-actions">` + buttons.map(b => `<button class="quick-action-btn" data-value="${b.value}">${b.label}</button>`).join('') + `</div>`;
    addMsg(html + btnHtml, false);
    document.querySelectorAll('.quick-action-btn:not(.bound)').forEach(btn => {
      btn.classList.add('bound');
      btn.addEventListener('click', function() {
        document.querySelectorAll('.quick-action-btn').forEach(b => b.classList.add('selected'));
        handleInput(this.dataset.value);
      });
    });
  }, delay);
}

// Country resolver
function resolveCountry(input) {
  const t = input.toLowerCase().trim();
  const map = { india: 'india', 'united states': 'us', us: 'us', usa: 'us', america: 'us', 'united kingdom': 'uk', uk: 'uk', britain: 'uk', england: 'uk', 'european union': 'eu', eu: 'eu', europe: 'eu', brazil: 'brazil', brasil: 'brazil', canada: 'canada', australia: 'australia', japan: 'japan', germany: 'germany', france: 'france' };
  return map[t] || null;
}

// Main menu
const MAIN_MENU_BUTTONS = [
  { label: "🗺️ [1] Election Guide", value: "1" },
  { label: "⚖️ [2] Compare Systems", value: "2" },
  { label: "✅ [3] Am I Eligible?", value: "3" },
  { label: "🔍 [4] Myth Buster", value: "4" },
  { label: "🗳️ [5] Ballot Simulator", value: "5" },
  { label: "🧭 [6] First-Time Voter", value: "6" },
  { label: "📰 [7] Headline Decoder", value: "7" },
  { label: "🧠 [8] Quiz Me", value: "8" }
];

const COUNTRY_ACCESS_BTNS = Object.entries(COUNTRIES).map(([k, v]) => ({ label: `${v.flag} ${v.name}`, value: `country_${k}` }));

function showMainMenu() {
  state.mode = null; state.awaitingCountry = null; state.awaitingQuizAnswer = false;
  botReplyWithButtons(`<p>What would you like to do today?</p>`, MAIN_MENU_BUTTONS);
}

function showMiniMenu() {
  botReplyWithButtons(`<p>What would you like to do next?</p>`, [
    { label: "➡️ Continue", value: "continue" },
    { label: "🔍 Go deeper", value: "deeper" },
    { label: "🔄 Switch country", value: "switch" },
    { label: "📋 Summary", value: "summary" },
    { label: "🏠 Home", value: "home" }
  ]);
}

function showCountryPicker(prompt, callback) {
  const btns = Object.entries(COUNTRIES).map(([k, v]) => ({ label: `${v.flag} ${v.name}`, value: k }));
  state.awaitingCountry = callback;
  botReplyWithButtons(`<p>${prompt}</p>`, btns);
}

// Greet / Home Page
function greet() {
  let html = `<div class="home-banner">`;
  html += `<div class="home-title">🗳️ ELECTBOT</div>`;
  html += `<div class="home-subtitle">Your Global Election Guide</div>`;
  html += `<div class="home-tagline">Making democracy understandable for everyone</div>`;
  html += `<div class="home-stats">🌍 10 Countries &nbsp;|&nbsp; 8 Modes &nbsp;|&nbsp; 970M+ Voters Covered</div>`;
  html += `</div>`;
  html += `<p style="margin-top:12px"><strong>🧭 What would you like to do?</strong></p>`;
  botReplyWithButtons(html, MAIN_MENU_BUTTONS, 300);
  setTimeout(() => {
    botReplyWithButtons(`<p><strong>🌐 Quick Country Access</strong> — tap any country to explore:</p>`, COUNTRY_ACCESS_BTNS, 200);
  }, 1000);
}

// Stage mode
function showStage(n, countryKey) {
  const s = STAGES_DATA[n];
  if (!s) { botReply(`<p>🎉 You've covered all 8 stages of the election process! You now have a solid understanding of how elections work from start to finish.</p>`); showMiniMenu(); return; }
  const c = countryKey ? COUNTRIES[countryKey] : null;
  const title = `Stage ${n} of 8`;
  let html = `<div class="stage-card"><div class="stage-header">${s.icon} ${title} — ${s.title}</div><div class="stage-body">`;
  html += `<div class="stage-section"><div class="section-title">📌 What Happens</div><p>${s.what}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">👥 Who's Involved</div><p>${s.who}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">⏱️ Duration</div><p>${s.duration}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">🌍 Real Example</div><p>${s.example}</p></div>`;
  html += `<div class="myth-box"><strong>⚠️ Myth vs Fact</strong><br>${s.myth.replace('\n', '<br>')}</div>`;
  html += `</div></div>`;
  addMsg(html, false);
  state.stage = n;
  setTimeout(() => {
    botReplyWithButtons(`<p>That's <strong>Stage ${n}</strong>! What next?</p>`, [
      ...(n < 8 ? [{ label: `➡️ Stage ${n+1}`, value: "next_stage" }] : []),
      { label: "🔍 Go deeper", value: "deeper" },
      { label: "🏠 Main menu", value: "home" }
    ]);
  }, 700);
}

// Facts mode
function showFacts(key) {
  const c = COUNTRIES[key];
  let html = `<p>${c.flag} <strong>${c.name} — Quick Election Facts</strong></p>`;
  html += `<p>⚡ <em>${c.surprise}</em></p><hr style="border-color:var(--border-subtle);margin:8px 0">`;
  const facts = [
    ['🔢', 'Registered Voters', c.voters],
    ['📅', 'Last Election', c.lastElection],
    ['📅', 'Next Expected', c.nextElection],
    ['🏆', 'Current Governing', c.governing],
    ['🌍', 'System Type', c.system],
    ['🗳️', 'Voting Method', c.method],
    ['✅', 'Compulsory', c.compulsory],
    ['📈', 'Avg Turnout', c.turnout],
    ['🌟', 'Milestone', c.milestone]
  ];
  facts.forEach(([icon, label, val]) => {
    html += `<div class="fact-item"><span class="fact-icon">${icon}</span><span><span class="fact-label">${label}:</span> ${val}</span></div>`;
  });
  state.country = key;
  botReply(html, 800);
  setTimeout(() => showMiniMenu(), 1500);
}

// Compare mode
function showComparison(k1, k2) {
  const a = COUNTRIES[k1], b = COUNTRIES[k2];
  const rows = [
    ['System Type', a.system, b.system],
    ['Governing Body', a.body, b.body],
    ['Voting Frequency', a.frequency, b.frequency],
    ['Voting Method', a.method, b.method],
    ['Compulsory Voting?', a.compulsory, b.compulsory],
    ['Min Voting Age', a.age, b.age],
    ['Key Feature', a.feature, b.feature],
    ['Avg Turnout', a.turnout, b.turnout]
  ];
  let html = `<p>⚖️ <strong>Election System Comparison</strong></p>`;
  html += `<table class="comparison-table"><tr><th>Category</th><th>${a.flag} ${a.name}</th><th>${b.flag} ${b.name}</th></tr>`;
  rows.forEach(([cat, va, vb]) => { html += `<tr><td class="category-cell">${cat}</td><td>${va}</td><td>${vb}</td></tr>`; });
  html += `</table>`;

  const diffs = [];
  if (a.compulsory !== b.compulsory) diffs.push(`🔑 <strong>Key Difference:</strong> ${a.compulsory === 'Yes' ? a.name + ' has compulsory voting while ' + b.name + ' does not' : b.name + ' has compulsory voting while ' + a.name + ' does not'}.`);
  else diffs.push(`🔑 <strong>Key Difference:</strong> ${a.name} uses ${a.method} while ${b.name} uses ${b.method}.`);
  diffs.push(`🤝 <strong>Common Ground:</strong> Both hold regular democratic elections with independent oversight bodies.`);
  diffs.push(`🧠 <strong>Interesting Contrast:</strong> ${a.name} has ${a.turnout} average turnout vs ${b.name}'s ${b.turnout}.`);
  html += diffs.map(d => `<p style="margin-top:8px">${d}</p>`).join('');

  botReply(html, 900);
  setTimeout(() => {
    botReplyWithButtons(`<p>Want to explore further?</p>`, [
      { label: `🔍 Deep dive: ${a.name}`, value: `explore_${k1}` },
      { label: `🔍 Deep dive: ${b.name}`, value: `explore_${k2}` },
      { label: "⚖️ Compare different pair", value: "3" },
      { label: "🏠 Main menu", value: "home" }
    ]);
  }, 1600);
}

// Timeline mode
function showTimeline(key) {
  const c = COUNTRIES[key], tl = TIMELINES[key];
  if (!tl) { botReply(`<p>Timeline data not available for this selection. Try one of the 10 featured countries!</p>`); showMainMenu(); return; }
  let html = `<p>🗓️ <strong>Election Timeline — ${c.flag} ${c.name}</strong></p><div class="timeline">`;
  tl.forEach((item, i) => {
    html += `<div class="timeline-item" style="animation-delay:${i * 0.08}s"><span class="time-label">⏳ ${item.time}</span><span class="time-desc">→ ${item.desc}</span>`;
    if (item.note) html += `<span class="time-note">📌 ${item.note}</span>`;
    html += `</div>`;
  });
  html += `</div>`;
  state.country = key;
  botReply(html, 800);
  setTimeout(() => showMiniMenu(), 1500);
}

// Quiz mode
function startQuiz(countryKey) {
  let pool = [...QUIZ_BANK];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
  state.quiz = pool.slice(0, 5);
  state.quizIdx = 0; state.score = 0; state.mode = 'quiz'; state.awaitingQuizAnswer = true;
  botReply(`<p>🧠 <strong>Quiz Time!</strong> — 5 questions to test your election knowledge. Let's go!</p>`, 400);
  setTimeout(() => showQuizQuestion(), 1100);
}

function showQuizQuestion() {
  const q = state.quiz[state.quizIdx];
  let html = `<p class="quiz-question">Q${state.quizIdx + 1}/5: ${q.q}</p><div class="quiz-options">`;
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    html += `<button class="quiz-option-btn" data-qi="${i}"><span class="option-letter">${letters[i]}</span>${opt}</button>`;
  });
  html += `</div>`;
  addMsg(html, false);
  state.awaitingQuizAnswer = true;
  setTimeout(() => {
    document.querySelectorAll('.quiz-option-btn:not(.bound)').forEach(btn => {
      btn.classList.add('bound');
      btn.addEventListener('click', function () { handleQuizAnswer(parseInt(this.dataset.qi)); });
    });
  }, 100);
}

function handleQuizAnswer(idx) {
  state.awaitingQuizAnswer = false;
  const q = state.quiz[state.quizIdx];
  const btns = document.querySelectorAll('.quiz-option-btn:not(.correct):not(.incorrect)');
  btns.forEach((btn, i) => {
    const qi = parseInt(btn.dataset.qi);
    if (qi === q.answer) btn.classList.add('correct');
    else if (qi === idx) btn.classList.add('incorrect');
    else btn.classList.add('disabled');
  });
  const correct = idx === q.answer;
  if (correct) state.score++;
  setTimeout(() => {
    botReply(correct
      ? `<p>✅ <strong>Correct!</strong> ${q.explanation}</p>`
      : `<p>❌ <strong>Not quite!</strong> The correct answer was <strong>${q.options[q.answer]}</strong>. ${q.explanation}</p>`, 400);
    state.quizIdx++;
    if (state.quizIdx < 5) {
      setTimeout(() => showQuizQuestion(), 1200);
    } else {
      setTimeout(() => showQuizScore(), 1200);
    }
  }, 600);
}

function showQuizScore() {
  const s = state.score;
  const emoji = s === 5 ? '🏆' : s === 4 ? '🥈' : s === 3 ? '🥉' : '📚';
  const msg = s === 5 ? 'Perfect score! You\'re an election expert!' : s >= 3 ? 'Great job! You know your stuff!' : 'Keep learning — democracy needs informed citizens!';
  let html = `<div class="score-card"><span class="score-emoji">${emoji}</span><span class="score-number">${s}/5</span><p class="score-label">${msg}</p></div>`;
  botReply(html, 600);
  state.mode = null;
  setTimeout(() => {
    botReplyWithButtons(`<p>What next?</p>`, [
      { label: "🔄 Retake quiz", value: "6" },
      { label: "🏠 Main menu", value: "home" }
    ]);
  }, 1300);
}

// Summary
function showSummary() {
  if (state.history.length === 0) { botReply(`<p>📋 No topics covered yet! Start exploring and I'll keep track.</p>`); return; }
  let html = `<p>📋 <strong>Session Summary</strong></p><ul>`;
  state.history.slice(-10).forEach(h => { html += `<li>${h}...</li>`; });
  html += `</ul><p>💾 You can copy this summary to review later!</p>`;
  botReply(html);
  setTimeout(() => showMiniMenu(), 1200);
}

// Deep dive
function showDeepDive(key) {
  const c = COUNTRIES[key];
  let html = `<p>🔍 <strong>Deep Dive: ${c.flag} ${c.name} Election System</strong></p>`;
  html += `<p><strong>1. System:</strong> ${c.system}</p>`;
  html += `<p><strong>2. How it works:</strong> ${c.name} uses ${c.method}. Elections are held ${c.frequency.toLowerCase()}. The election is overseen by ${c.body}.</p>`;
  html += `<p><strong>3. Voting:</strong> ${c.compulsory === 'Yes' ? 'Voting is compulsory' : 'Voting is voluntary'}. Minimum age: ${c.age}. Average turnout: ${c.turnout}.</p>`;
  html += `<p><strong>4. Key Feature:</strong> ${c.feature}</p>`;
  html += `<p><strong>5. Fun Fact:</strong> ${c.surprise}</p>`;
  state.country = key;
  botReply(html, 800);
  setTimeout(() => showMiniMenu(), 1500);
}

// Handle input
let compareFirst = null;

function handleInput(raw) {
  const input = raw.trim();
  if (!input) return;

  const isButtonValue = /^(home|continue|deeper|switch|summary|next_stage|explore_\w+|country_\w+|myth_\w+|\d)$/.test(input);
  if (!isButtonValue) addMsg(`<p>${input}</p>`, true);

  // Quiz answer
  if (state.awaitingQuizAnswer) {
    const map = { a: 0, b: 1, c: 2, d: 3 };
    const idx = map[input.toLowerCase()];
    if (idx !== undefined) { handleQuizAnswer(idx); return; }
  }

  // Country awaiting
  if (state.awaitingCountry) {
    const key = resolveCountry(input) || input;
    if (COUNTRIES[key]) { const cb = state.awaitingCountry; state.awaitingCountry = null; cb(key); return; }
    else { botReply(`<p>Please pick a country from the buttons or type a name (e.g., India, US, France).</p>`); return; }
  }

  // Headline mode awaiting text
  if (state.mode === 'headline' && input !== 'home' && !input.match(/^\d$/)) {
    showHeadlineDecoder(input); return;
  }

  // Myth buster awaiting custom text
  if (state.mode === 'mythbuster_custom' && input !== 'home') {
    showMythBuster(input); state.mode = null; return;
  }

  // Compare flow
  if (state.mode === 'compare_pick1') {
    const key = resolveCountry(input) || input;
    if (COUNTRIES[key]) {
      compareFirst = key; state.mode = 'compare_pick2';
      showCountryPicker(`Now pick the <strong>second country</strong> to compare with ${COUNTRIES[key].flag} ${COUNTRIES[key].name}:`, k2 => {
        state.awaitingCountry = null; state.mode = null; showComparison(compareFirst, k2);
      });
      return;
    }
  }

  // Country quick access
  if (input.startsWith('country_')) {
    const k = input.replace('country_', '');
    if (COUNTRIES[k]) { showDeepDive(k); return; }
  }

  // Explore shortcut
  if (input.startsWith('explore_')) {
    const k = input.replace('explore_', '');
    if (COUNTRIES[k]) { showDeepDive(k); return; }
  }

  // Myth index
  if (input.startsWith('myth_')) {
    if (input === 'myth_custom') { botReply(`<p>Type any election claim you've heard and I'll fact-check it:</p>`); state.mode = 'mythbuster_custom'; return; }
    const idx = parseInt(input.replace('myth_', ''));
    if (!isNaN(idx)) { showMythByIndex(idx); return; }
  }

  // Menu choices
  switch (input) {
    case '1':
      state.mode = 'stages'; state.stage = 1;
      showCountryPicker("Which country's election process would you like to explore step-by-step?", k => {
        state.awaitingCountry = null; state.country = k;
        botReply(`<p>🗺️ <strong>Election Guide — ${COUNTRIES[k].flag} ${COUNTRIES[k].name}</strong></p><p>Let's walk through all 8 stages. Starting with Stage 1!</p>`, 500);
        setTimeout(() => showStage(1, k), 1200);
      });
      return;
    case '2':
      state.mode = 'compare_pick1'; compareFirst = null;
      showCountryPicker("Pick the <strong>first country</strong> to compare:", k => {
        compareFirst = k; state.awaitingCountry = null; state.mode = 'compare_pick2';
        showCountryPicker(`Now pick the <strong>second country</strong> to compare with ${COUNTRIES[k].flag} ${COUNTRIES[k].name}:`, k2 => {
          state.awaitingCountry = null; state.mode = null; showComparison(compareFirst, k2);
        });
      });
      return;
    case '3':
      showCountryPicker("Which country do you want to check voter eligibility for?", k => { state.awaitingCountry = null; showEligibility(k); });
      return;
    case '4':
      showMythBuster(null);
      return;
    case '5':
      showCountryPicker("Which country's ballot would you like to explore?", k => { state.awaitingCountry = null; showBallotSim(k); });
      return;
    case '6':
      showCountryPicker("Which country are you voting in for the first time?", k => { state.awaitingCountry = null; showFirstVoter(k); });
      return;
    case '7':
      showHeadlineDecoder(null);
      return;
    case '8':
      startQuiz();
      return;
    case 'home':
      showMainMenu();
      return;
    case 'continue':
    case 'next_stage':
      if (state.mode === 'stages') { state.stage++; showStage(state.stage); return; }
      showMainMenu();
      return;
    case 'deeper':
      if (state.country) { showDeepDive(state.country); return; }
      showCountryPicker("Which country would you like to dive deeper into?", k => { state.awaitingCountry = null; showDeepDive(k); });
      return;
    case 'switch':
      showCountryPicker("Which country would you like to explore?", k => { state.awaitingCountry = null; showDeepDive(k); });
      return;
    case 'summary':
      showSummary(); return;
  }

  // Country name
  const ck = resolveCountry(input);
  if (ck) { showDeepDive(ck); return; }

  // Keyword matching
  const lower = input.toLowerCase();
  if (lower.includes('fptp') || lower.includes('first past')) {
    botReply(`<p>🔍 <strong>FPTP (First-Past-The-Post)</strong></p><p>The candidate with the most votes wins — even without 50%. Used by India, US (Congress), UK, Canada.</p><p><strong>Pros:</strong> Simple, fast, clear local representation.</p><p><strong>Cons:</strong> "Wasted votes," smaller parties underrepresented.</p>`);
    setTimeout(() => showMiniMenu(), 1200); return;
  }
  if (lower.includes('electoral college')) {
    botReply(`<p>🔍 <strong>Electoral College (US)</strong></p><p>538 electors cast official votes. Need 270 to win. Most states are winner-take-all. A candidate can win without the popular vote — happened 5 times.</p>`);
    setTimeout(() => showMiniMenu(), 1200); return;
  }
  if (lower.includes('eligible') || lower.includes('can i vote')) {
    handleInput('3'); return;
  }
  if (lower.includes('myth') || lower.includes('fact check')) {
    handleInput('4'); return;
  }
  if (lower.includes('ballot')) {
    handleInput('5'); return;
  }
  if (lower.includes('first time') || lower.includes('first-time')) {
    handleInput('6'); return;
  }
  if (lower.includes('quiz')) {
    handleInput('8'); return;
  }
  if (lower.includes('compare')) {
    handleInput('2'); return;
  }
  if (lower === 'menu' || lower === 'start') {
    showMainMenu(); return;
  }

  botReply(`<p>I'm not sure about that specific topic, but try picking from the menu! I cover election guides, comparisons, eligibility checks, myth busting, ballot simulations, first-time voter help, headline decoding, and quizzes.</p>`);
  setTimeout(() => showMainMenu(), 1200);
}

// Input handlers
sendBtn.addEventListener('click', () => { if (userInput.value.trim()) { const v = userInput.value; userInput.value = ''; handleInput(v); } });
userInput.addEventListener('keydown', e => { if (e.key === 'Enter' && userInput.value.trim()) { const v = userInput.value; userInput.value = ''; handleInput(v); } });

// Header buttons
btnHome.addEventListener('click', () => { addMsg('<p>🏠 Home</p>', true); showMainMenu(); });
btnSummary.addEventListener('click', () => { addMsg('<p>📋 Summary</p>', true); showSummary(); });

// Init
greet();

