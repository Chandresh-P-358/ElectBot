// ── DOM ───────────────────────────────────────────────────────────────
const chatBody     = document.getElementById('chat-body');
const messagesEl   = document.getElementById('messages');
const userInput    = document.getElementById('user-input');
const sendBtn      = document.getElementById('send-btn');
const statusText   = document.getElementById('status-text');
const btnClear     = document.getElementById('btn-clear');
const btnTheme     = document.getElementById('btn-theme');
const btnExport    = document.getElementById('btn-export');
const quickPrompts = document.getElementById('quick-prompts');
const exportModal  = document.getElementById('export-modal');
const voiceBtn     = document.getElementById('voice-btn');
const voiceOverlay = document.getElementById('voice-overlay');
const voiceStatus  = document.getElementById('voice-status');
const voiceTranscript = document.getElementById('voice-transcript');
const voiceCancel  = document.getElementById('voice-cancel');

// ── State ─────────────────────────────────────────────────────────────
let state = { mode: null, country: null, stage: 1, quiz: [], quizIdx: 0, score: 0, awaitingCountry: null, awaitingQuizAnswer: false };
let compareFirst = null;
let chatLog = [];

// ── Theme ─────────────────────────────────────────────────────────────
const savedTheme = localStorage.getItem('electbot_theme') || '';
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'light') btnTheme.textContent = '☀️';
btnTheme.addEventListener('click', () => {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', light ? '' : 'light');
    btnTheme.textContent = light ? '🌙' : '☀️';
    localStorage.setItem('electbot_theme', light ? '' : 'light');
});

// ── Clear ─────────────────────────────────────────────────────────────
btnClear.addEventListener('click', () => {
    messagesEl.innerHTML = '';
    chatLog = [];
    state = { mode: null, country: null, stage: 1, quiz: [], quizIdx: 0, score: 0, awaitingCountry: null, awaitingQuizAnswer: false };
    quickPrompts.style.display = 'flex';
    greet();
});

// ── Export ────────────────────────────────────────────────────────────
btnExport.addEventListener('click', () => exportModal.classList.remove('hidden'));
document.getElementById('export-close').addEventListener('click', () => exportModal.classList.add('hidden'));
document.getElementById('export-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(chatLog.join('\n')).then(() => {
        const btn = document.getElementById('export-copy');
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy to Clipboard', 2000);
    });
});
document.getElementById('export-txt').addEventListener('click', () => {
    const blob = new Blob([chatLog.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `ElectBot-${new Date().toISOString().slice(0,10)}.txt`; a.click();
});
exportModal.addEventListener('click', e => { if (e.target === exportModal) exportModal.classList.add('hidden'); });

// ── Voice ─────────────────────────────────────────────────────────────
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (!SpeechRecognition) { voiceBtn.disabled = true; voiceBtn.style.opacity = '0.4'; }
voiceBtn.addEventListener('click', () => {
    if (!SpeechRecognition) return;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; recognition.interimResults = true;
    voiceOverlay.classList.remove('hidden');
    recognition.onresult = e => {
        const t = Array.from(e.results).map(r => r[0].transcript).join('');
        voiceTranscript.textContent = t;
        if (e.results[e.results.length-1].isFinal) { userInput.value = t; stopVoice(); setTimeout(() => send(), 300); }
    };
    recognition.onerror = () => stopVoice();
    recognition.onend = stopVoice;
    recognition.start();
});
voiceCancel.addEventListener('click', stopVoice);
function stopVoice() { if (recognition) { try { recognition.stop(); } catch(e){} recognition = null; } voiceOverlay.classList.add('hidden'); }

// ── Auto-resize ───────────────────────────────────────────────────────
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
});

// ── Messaging helpers ─────────────────────────────────────────────────
function scroll() { setTimeout(() => chatBody.scrollTop = chatBody.scrollHeight, 50); }
function setStatus(t, c) { statusText.textContent = t; statusText.style.color = c || 'var(--success)'; }

function addMessage(html, role) {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    const avatar = role === 'bot' ? '🗳️' : '👤';
    div.innerHTML = `<div class="msg-avatar">${avatar}</div><div class="msg-bubble">${html}</div>`;
    messagesEl.appendChild(div);
    scroll();
    chatLog.push(`[${role === 'bot' ? 'ElectBot' : 'You'}] ${html.replace(/<[^>]*>/g,'').trim().slice(0,120)}\n`);
}

function showTyping() {
    const d = document.createElement('div'); d.className = 'typing'; d.id = 'typing-indicator';
    d.innerHTML = `<div class="msg-avatar">🗳️</div><div class="typing-dots"><span></span><span></span><span></span></div>`;
    messagesEl.appendChild(d); scroll();
}
function hideTyping() { const e = document.getElementById('typing-indicator'); if (e) e.remove(); }

function botReply(html, delay = 600) {
    showTyping();
    setTimeout(() => { hideTyping(); addMessage(html, 'bot'); }, delay);
}

function botReplyWithButtons(html, buttons, delay = 600) {
    showTyping();
    setTimeout(() => {
        hideTyping();
        const btnHtml = `<div class="quick-actions" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">` +
            buttons.map(b => `<button class="quick-action-btn" data-value="${b.value}" style="padding:6px 14px;border-radius:999px;background:var(--surface2);border:1px solid var(--border2);color:var(--text);cursor:pointer;font-size:0.82rem;font-family:var(--font);transition:all .2s">${b.label}</button>`).join('') + `</div>`;
        addMessage(html + btnHtml, 'bot');
        messagesEl.querySelectorAll('.quick-action-btn:not([data-bound])').forEach(btn => {
            btn.setAttribute('data-bound','1');
            btn.addEventListener('mouseenter', () => { btn.style.borderColor='var(--accent)'; btn.style.color='var(--accent2)'; });
            btn.addEventListener('mouseleave', () => { btn.style.borderColor='var(--border2)'; btn.style.color='var(--text)'; });
            btn.addEventListener('click', () => { addMessage(`<p>${btn.textContent}</p>`, 'user'); handleInput(btn.dataset.value); });
        });
    }, delay);
}

// ── Country resolver ──────────────────────────────────────────────────
function resolveCountry(input) {
    const t = input.toLowerCase().trim();
    const map = { india:'india', 'united states':'us', us:'us', usa:'us', america:'us', 'united kingdom':'uk', uk:'uk', britain:'uk', england:'uk', 'european union':'eu', eu:'eu', europe:'eu', brazil:'brazil', brasil:'brazil', canada:'canada', australia:'australia', japan:'japan', germany:'germany', france:'france' };
    return map[t] || Object.keys(COUNTRIES).find(k => t.includes(k)) || null;
}

// ── Menus ─────────────────────────────────────────────────────────────
const MAIN_MENU = [
    { label:'🗺️ [1] Election Guide', value:'1' },
    { label:'⚖️ [2] Compare Systems', value:'2' },
    { label:'✅ [3] Am I Eligible?', value:'3' },
    { label:'🔍 [4] Myth Buster', value:'4' },
    { label:'🗳️ [5] Ballot Simulator', value:'5' },
    { label:'🧭 [6] First-Time Voter', value:'6' },
    { label:'📰 [7] Headline Decoder', value:'7' },
    { label:'🧠 [8] Quiz Me', value:'8' }
];

function showMainMenu() {
    state.mode = null; state.awaitingCountry = null; state.awaitingQuizAnswer = false;
    botReplyWithButtons(`<p>What would you like to explore?</p>`, MAIN_MENU);
}

function showMiniMenu() {
    botReplyWithButtons(`<p>What next?</p>`, [
        { label:'➡️ Continue', value:'continue' },
        { label:'🔍 Go deeper', value:'deeper' },
        { label:'🔄 Switch country', value:'switch' },
        { label:'🏠 Home', value:'home' }
    ]);
}

function showCountryPicker(prompt, cb) {
    const btns = Object.entries(COUNTRIES).map(([k,v]) => ({ label:`${v.flag} ${v.name}`, value:k }));
    state.awaitingCountry = cb;
    botReplyWithButtons(`<p>${prompt}</p>`, btns);
}

// ── Greet ─────────────────────────────────────────────────────────────
function greet() {
    setStatus('Ready', 'var(--success)');
    let html = `<div style="text-align:center;padding:16px 0">`;
    html += `<div style="font-size:2.5rem">🗳️</div>`;
    html += `<div style="font-size:1.4rem;font-weight:900;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:8px 0">ElectBot</div>`;
    html += `<div style="color:var(--text2);font-size:0.9rem">Your Global Election Guide — 10 Countries · 8 Modes</div></div>`;
    botReplyWithButtons(html, MAIN_MENU, 300);
    const countryBtns = Object.entries(COUNTRIES).map(([k,v]) => ({ label:`${v.flag} ${v.name}`, value:`country_${k}` }));
    setTimeout(() => botReplyWithButtons(`<p><strong>🌐 Quick Country Access</strong></p>`, countryBtns, 200), 1000);
}

// ── Election Guide (stages) ───────────────────────────────────────────
function showStage(n) {
    const s = STAGES_DATA[n];
    if (!s) { botReply(`<p>🎉 You've completed all 8 stages!</p>`); showMiniMenu(); return; }
    let html = `<div style="background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:16px;margin:4px 0">`;
    html += `<div style="font-weight:700;font-size:1rem;margin-bottom:10px;color:var(--accent2)">${s.icon} Stage ${n}/8 — ${s.title}</div>`;
    html += `<p><strong>📌 What Happens:</strong> ${s.what}</p>`;
    html += `<p style="margin-top:8px"><strong>👥 Who's Involved:</strong> ${s.who}</p>`;
    html += `<p style="margin-top:8px"><strong>⏱️ Duration:</strong> ${s.duration}</p>`;
    html += `<p style="margin-top:8px"><strong>🌍 Example:</strong> ${s.example}</p>`;
    html += `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:10px;margin-top:10px;font-size:0.85rem">⚠️ ${s.myth.replace('\n','<br>')}</div>`;
    html += `</div>`;
    state.stage = n;
    botReply(html, 600);
    setTimeout(() => botReplyWithButtons(`<p>Stage ${n} done! What next?</p>`, [
        ...(n < 8 ? [{ label:`➡️ Stage ${n+1}`, value:'next_stage' }] : []),
        { label:'🏠 Home', value:'home' }
    ]), 1300);
}

// ── Country facts ─────────────────────────────────────────────────────
function showFacts(key) {
    const c = COUNTRIES[key];
    let html = `<p>${c.flag} <strong>${c.name}</strong></p>`;
    html += `<p style="color:var(--accent2);margin-bottom:8px">⚡ ${c.surprise}</p>`;
    [['🗳️','Voting Method',c.method],['📅','Next Election',c.nextElection],['🏆','Governing',c.governing],['📈','Turnout',c.turnout],['✅','Compulsory',c.compulsory],['🎂','Min Age',c.age],['👥','Voters',c.voters]].forEach(([icon,label,val]) => {
        html += `<div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)"><span>${icon}</span><span><strong>${label}:</strong> ${val}</span></div>`;
    });
    state.country = key;
    botReply(html, 700);
    setTimeout(() => showMiniMenu(), 1400);
}

// ── Compare ───────────────────────────────────────────────────────────
function showComparison(k1, k2) {
    const a = COUNTRIES[k1], b = COUNTRIES[k2];
    const rows = [['System',a.system,b.system],['Method',a.method,b.method],['Frequency',a.frequency,b.frequency],['Compulsory?',a.compulsory,b.compulsory],['Min Age',a.age,b.age],['Turnout',a.turnout,b.turnout]];
    let html = `<p>⚖️ <strong>${a.flag} ${a.name} vs ${b.flag} ${b.name}</strong></p>`;
    html += `<table style="width:100%;border-collapse:collapse;font-size:0.82rem;margin-top:8px">`;
    html += `<tr><th style="text-align:left;padding:6px;background:var(--surface2)">Category</th><th style="padding:6px;background:var(--surface2)">${a.flag} ${a.name}</th><th style="padding:6px;background:var(--surface2)">${b.flag} ${b.name}</th></tr>`;
    rows.forEach(([cat,va,vb]) => html += `<tr><td style="padding:5px 6px;border-bottom:1px solid var(--border);font-weight:600">${cat}</td><td style="padding:5px 6px;border-bottom:1px solid var(--border);text-align:center">${va}</td><td style="padding:5px 6px;border-bottom:1px solid var(--border);text-align:center">${vb}</td></tr>`);
    html += `</table>`;
    html += `<p style="margin-top:10px">🔑 <strong>Key Difference:</strong> ${a.name} uses ${a.method} while ${b.name} uses ${b.method}.</p>`;
    html += `<p>📈 <strong>Turnout:</strong> ${a.name} ${a.turnout} vs ${b.name} ${b.turnout}</p>`;
    botReply(html, 800);
    setTimeout(() => showMiniMenu(), 1500);
}

// ── Timeline ──────────────────────────────────────────────────────────
function showTimeline(key) {
    const c = COUNTRIES[key], tl = TIMELINES[key];
    if (!tl) { botReply(`<p>Timeline not available for this country yet.</p>`); return; }
    let html = `<p>🗓️ <strong>Election Timeline — ${c.flag} ${c.name}</strong></p><div style="margin-top:8px">`;
    tl.forEach(item => {
        html += `<div style="display:flex;flex-direction:column;gap:2px;padding:8px 0;border-bottom:1px solid var(--border)">`;
        html += `<span style="font-size:0.75rem;color:var(--accent2);font-weight:600">⏳ ${item.time}</span>`;
        html += `<span style="font-size:0.85rem">→ ${item.desc}</span>`;
        if (item.note) html += `<span style="font-size:0.78rem;color:var(--text3)">📌 ${item.note}</span>`;
        html += `</div>`;
    });
    html += `</div>`;
    state.country = key;
    botReply(html, 700);
    setTimeout(() => showMiniMenu(), 1400);
}

// ── Quiz ──────────────────────────────────────────────────────────────
function startQuiz() {
    let pool = [...QUIZ_BANK];
    for (let i = pool.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
    state.quiz = pool.slice(0,5); state.quizIdx = 0; state.score = 0; state.mode = 'quiz'; state.awaitingQuizAnswer = true;
    botReply(`<p>🧠 <strong>Quiz Time!</strong> — 5 questions. Ready?</p>`, 400);
    setTimeout(showQuizQ, 1000);
}
function showQuizQ() {
    const q = state.quiz[state.quizIdx];
    const letters = ['A','B','C','D'];
    let html = `<p style="font-weight:600;margin-bottom:10px">Q${state.quizIdx+1}/5: ${q.q}</p>`;
    html += `<div style="display:flex;flex-direction:column;gap:8px">`;
    q.options.forEach((opt,i) => {
        html += `<button class="quiz-opt" data-qi="${i}" style="text-align:left;padding:10px 14px;border-radius:10px;background:var(--surface2);border:1px solid var(--border2);color:var(--text);cursor:pointer;font-family:var(--font);font-size:0.88rem;transition:all .2s"><span style="font-weight:700;color:var(--accent2);margin-right:8px">${letters[i]}</span>${opt}</button>`;
    });
    html += `</div>`;
    addMessage(html, 'bot');
    state.awaitingQuizAnswer = true;
    setTimeout(() => {
        document.querySelectorAll('.quiz-opt:not([data-bound])').forEach(btn => {
            btn.setAttribute('data-bound','1');
            btn.addEventListener('mouseenter', () => btn.style.borderColor='var(--accent)');
            btn.addEventListener('mouseleave', () => btn.style.borderColor='var(--border2)');
            btn.addEventListener('click', () => handleQuizAnswer(parseInt(btn.dataset.qi)));
        });
    }, 100);
}
function handleQuizAnswer(idx) {
    state.awaitingQuizAnswer = false;
    const q = state.quiz[state.quizIdx];
    const correct = idx === q.answer;
    if (correct) state.score++;
    document.querySelectorAll('.quiz-opt').forEach(btn => {
        const qi = parseInt(btn.dataset.qi);
        if (qi === q.answer) btn.style.background = 'rgba(34,197,94,0.15)';
        else if (qi === idx && !correct) btn.style.background = 'rgba(239,68,68,0.15)';
        btn.disabled = true;
    });
    setTimeout(() => {
        botReply(correct ? `<p>✅ <strong>Correct!</strong> ${q.explanation}</p>` : `<p>❌ <strong>Incorrect.</strong> Answer: <strong>${q.options[q.answer]}</strong>. ${q.explanation}</p>`, 400);
        state.quizIdx++;
        if (state.quizIdx < 5) setTimeout(showQuizQ, 1200);
        else setTimeout(showScore, 1200);
    }, 500);
}
function showScore() {
    const s = state.score;
    const emoji = s===5?'🏆':s===4?'🥈':s===3?'🥉':'📚';
    const msg = s===5?'Perfect! Election expert!':s>=3?'Great job!':'Keep learning!';
    botReply(`<div style="text-align:center;padding:20px"><div style="font-size:3rem">${emoji}</div><div style="font-size:2rem;font-weight:800;margin:8px 0">${s}/5</div><p>${msg}</p></div>`, 600);
    state.mode = null;
    setTimeout(() => botReplyWithButtons(`<p>What next?</p>`, [{ label:'🔄 Retake quiz', value:'8' },{ label:'🏠 Home', value:'home' }]), 1300);
}

// ── Main input handler ────────────────────────────────────────────────
function handleInput(raw) {
    const input = String(raw).trim();
    if (!input) return;
    quickPrompts.style.display = 'none';

    if (state.awaitingQuizAnswer) {
        const map = {a:0,b:1,c:2,d:3};
        const idx = map[input.toLowerCase()];
        if (idx !== undefined) { handleQuizAnswer(idx); return; }
    }

    if (state.awaitingCountry) {
        const key = resolveCountry(input) || (COUNTRIES[input] ? input : null);
        if (key) { const cb = state.awaitingCountry; state.awaitingCountry = null; cb(key); return; }
        else { botReply(`<p>Please pick a country from the buttons.</p>`); return; }
    }

    if (state.mode === 'headline' && input !== 'home' && !/^\d$/.test(input)) { showHeadlineDecoder(input); return; }
    if (state.mode === 'mythbuster_custom' && input !== 'home') { showMythBuster(input); state.mode = null; return; }

    if (input.startsWith('country_')) { const k = input.slice(8); if (COUNTRIES[k]) { showFacts(k); return; } }
    if (input.startsWith('explore_')) { const k = input.slice(8); if (COUNTRIES[k]) { showFacts(k); return; } }
    if (input.startsWith('myth_')) {
        if (input === 'myth_custom') { botReply(`<p>Type any election claim to fact-check:</p>`); state.mode = 'mythbuster_custom'; return; }
        const idx = parseInt(input.slice(5));
        if (!isNaN(idx)) { showMythByIndex(idx); return; }
    }

    switch(input) {
        case '1':
            state.mode = 'stages'; state.stage = 1;
            showCountryPicker("Which country's election process to explore?", k => {
                state.awaitingCountry = null; state.country = k;
                botReply(`<p>🗺️ <strong>${COUNTRIES[k].flag} ${COUNTRIES[k].name} — Election Guide</strong><br>Walking through all 8 stages…</p>`, 400);
                setTimeout(() => showStage(1), 1000);
            }); return;
        case '2':
            state.mode = 'compare_pick1'; compareFirst = null;
            showCountryPicker("Pick the <strong>first</strong> country to compare:", k1 => {
                compareFirst = k1; state.awaitingCountry = null;
                showCountryPicker(`Now pick the <strong>second</strong> country to compare with ${COUNTRIES[k1].flag} ${COUNTRIES[k1].name}:`, k2 => {
                    state.awaitingCountry = null; state.mode = null; showComparison(compareFirst, k2);
                });
            }); return;
        case '3': showCountryPicker("Which country to check eligibility for?", k => { state.awaitingCountry = null; showEligibility(k); }); return;
        case '4': showMythBuster(null); return;
        case '5': showCountryPicker("Which country's ballot to simulate?", k => { state.awaitingCountry = null; showBallotSim(k); }); return;
        case '6': showCountryPicker("Which country are you voting in for the first time?", k => { state.awaitingCountry = null; showFirstVoter(k); }); return;
        case '7': showHeadlineDecoder(null); return;
        case '8': startQuiz(); return;
        case 'home': showMainMenu(); return;
        case 'continue': case 'next_stage':
            if (state.mode === 'stages') { state.stage++; showStage(state.stage); return; }
            showMainMenu(); return;
        case 'deeper':
            if (state.country) { showTimeline(state.country); return; }
            showCountryPicker("Which country to explore?", k => { state.awaitingCountry = null; showTimeline(k); }); return;
        case 'switch':
            showCountryPicker("Switch to which country?", k => { state.awaitingCountry = null; showFacts(k); }); return;
    }

    const ck = resolveCountry(input);
    if (ck) { showFacts(ck); return; }

    const lower = input.toLowerCase();
    if (lower.includes('eligible') || lower.includes('can i vote')) { handleInput('3'); return; }
    if (lower.includes('myth') || lower.includes('fact check') || lower.includes('is it true')) { handleInput('4'); return; }
    if (lower.includes('ballot') || lower.includes('how to vote') || lower.includes('fill')) { handleInput('5'); return; }
    if (lower.includes('first time') || lower.includes('first-time') || lower.includes('new voter')) { handleInput('6'); return; }
    if (lower.includes('headline') || lower.includes('decode') || lower.includes('news')) { handleInput('7'); return; }
    if (lower.includes('quiz') || lower.includes('test me')) { handleInput('8'); return; }
    if (lower.includes('compare')) { handleInput('2'); return; }
    if (lower.includes('guide') || lower.includes('stage') || lower.includes('process')) { handleInput('1'); return; }
    if (lower === 'menu' || lower === 'home' || lower === 'start') { showMainMenu(); return; }

    botReply(`<p>I'm not sure about that, but I can help with elections! Choose a mode below:</p>`);
    setTimeout(() => showMainMenu(), 800);
}

// ── Send ──────────────────────────────────────────────────────────────
function send() {
    const text = userInput.value.trim();
    if (!text) return;
    userInput.value = ''; userInput.style.height = 'auto';
    addMessage(`<p>${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`, 'user');
    handleInput(text);
}
sendBtn.addEventListener('click', send);
userInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
document.querySelectorAll('.qp').forEach(btn => btn.addEventListener('click', () => { userInput.value = btn.dataset.msg; send(); }));

// ── URL params ────────────────────────────────────────────────────────
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const country = params.get('country');
    const action = params.get('action') || window.location.hash.replace('#','');
    if (country) { const k = resolveCountry(country); if (k) setTimeout(() => { addMessage(`<p>Tell me about ${COUNTRIES[k].name}</p>`, 'user'); showFacts(k); }, 1500); }
    else if (action === 'quiz') setTimeout(() => handleInput('8'), 1500);
    else if (action === 'compare') setTimeout(() => handleInput('2'), 1500);
    else if (action === 'eligible') setTimeout(() => handleInput('3'), 1500);
}

// ── Init ──────────────────────────────────────────────────────────────
setStatus('Ready ✓', 'var(--success)');
greet();
handleUrlParams();
