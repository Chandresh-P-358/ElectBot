// MODE 3 — Am I Eligible?
function showEligibility(key) {
  const c = COUNTRIES[key], e = ELIGIBILITY[key];
  if (!e) { botReply(`<p>Eligibility data not available for this country yet.</p>`); showMiniMenu(); return; }
  let html = `<div class="stage-card"><div class="stage-header">✅ Voter Eligibility — ${c.flag} ${c.name}</div><div class="stage-body">`;
  html += `<div class="fact-item"><span class="fact-icon">🎂</span><span><span class="fact-label">Minimum Age:</span> ${e.minAge}</span></div>`;
  html += `<div class="fact-item"><span class="fact-icon">🏛️</span><span><span class="fact-label">Citizenship:</span> ${e.citizenship}</span></div>`;
  html += `<div class="fact-item"><span class="fact-icon">📄</span><span><span class="fact-label">Documents Needed:</span> ${e.docs.join(', ')}</span></div>`;
  html += `<div class="fact-item"><span class="fact-icon">📝</span><span><span class="fact-label">How to Register:</span> ${e.register}</span></div>`;
  html += `<div class="fact-item"><span class="fact-icon">📅</span><span><span class="fact-label">Deadline:</span> ${e.deadline}</span></div>`;
  html += `<div class="fact-item"><span class="fact-icon">📍</span><span><span class="fact-label">Where:</span> ${e.where}</span></div>`;
  html += `<div class="fact-item"><span class="fact-icon">🔔</span><span><span class="fact-label">Special Note:</span> ${e.special}</span></div>`;
  html += `<div class="myth-box"><strong>⚡ One thing most people miss:</strong><br>${e.gotcha}</div>`;
  html += `<p style="margin-top:10px;font-size:0.8rem;color:var(--text-muted)">⚠️ This is general guidance. Always confirm with your country's official electoral body.</p>`;
  html += `</div></div>`;
  state.country = key;
  botReply(html, 800);
  setTimeout(() => showMiniMenu(), 1500);
}

// MODE 4 — Myth Buster
function showMythBuster(claimText) {
  if (!claimText) {
    const btns = COMMON_MYTHS.map((m, i) => ({ label: m.claim, value: `myth_${i}` }));
    btns.push({ label: "✍️ Type my own claim", value: "myth_custom" });
    botReplyWithButtons(`<p>🔍 <strong>Myth Buster</strong> — Pick a common claim to fact-check, or type your own:</p>`, btns);
    state.mode = 'mythbuster';
    return;
  }
  // Check against known myths
  const lower = claimText.toLowerCase();
  let myth = COMMON_MYTHS.find(m => lower.includes(m.claim.toLowerCase().split(' ').slice(0,3).join(' ')));
  if (!myth) myth = COMMON_MYTHS[Math.floor(Math.random() * COMMON_MYTHS.length)];
  
  let html = `<div class="stage-card"><div class="stage-header">🔍 MYTH BUSTER</div><div class="stage-body">`;
  html += `<div class="stage-section"><div class="section-title">📌 Claim</div><p>"${myth.claim}"</p></div>`;
  html += `<div class="stage-section"><div class="section-title">⚖️ Verdict</div><p style="font-size:1.1rem;font-weight:700">${myth.verdict}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">📋 What's Actually True</div><p>${myth.explanation}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">🏛️ Official Position</div><p>${myth.authority}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">📊 Evidence</div><p>${myth.evidence}</p></div>`;
  html += `</div></div>`;
  botReply(html, 800);
  setTimeout(() => {
    botReplyWithButtons(`<p>Want to bust another myth?</p>`, [
      { label: "🔍 Another myth", value: "4" },
      { label: "🏠 Home", value: "home" }
    ]);
  }, 1500);
}

function showMythByIndex(idx) {
  const myth = COMMON_MYTHS[idx];
  if (!myth) return;
  let html = `<div class="stage-card"><div class="stage-header">🔍 MYTH BUSTER</div><div class="stage-body">`;
  html += `<div class="stage-section"><div class="section-title">📌 Claim</div><p>"${myth.claim}"</p></div>`;
  html += `<div class="stage-section"><div class="section-title">⚖️ Verdict</div><p style="font-size:1.1rem;font-weight:700">${myth.verdict}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">📋 What's Actually True</div><p>${myth.explanation}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">🏛️ Official Position</div><p>${myth.authority}</p></div>`;
  html += `<div class="stage-section"><div class="section-title">📊 Evidence</div><p>${myth.evidence}</p></div>`;
  html += `</div></div>`;
  botReply(html, 800);
  setTimeout(() => {
    botReplyWithButtons(`<p>Want to bust another myth?</p>`, [
      { label: "🔍 Another myth", value: "4" },
      { label: "🏠 Home", value: "home" }
    ]);
  }, 1500);
}

// MODE 5 — Ballot Simulator
function showBallotSim(key) {
  const c = COUNTRIES[key], b = BALLOT_DATA[key];
  if (!b) { botReply(`<p>Ballot data not available for this country yet.</p>`); showMiniMenu(); return; }
  let html = `<div class="stage-card"><div class="stage-header">🗳️ Ballot Simulator — ${c.flag} ${c.name}</div><div class="stage-body">`;
  html += `<p style="margin-bottom:10px"><strong>Ballot Type:</strong> ${b.type}</p>`;
  b.sections.forEach((sec, i) => {
    html += `<div class="stage-section"><div class="section-title">Section ${i+1}: ${sec.title}</div><p>${sec.desc}</p></div>`;
  });
  html += `</div></div>`;
  state.country = key;
  botReply(html, 800);
  setTimeout(() => {
    botReplyWithButtons(`<p>Ready to explore more?</p>`, [
      { label: "🔄 Different country's ballot", value: "5" },
      { label: "🧭 First-time voter guide", value: "6" },
      { label: "🏠 Home", value: "home" }
    ]);
  }, 1500);
}

// MODE 6 — First-Time Voter Roadmap
function showFirstVoter(key) {
  const c = COUNTRIES[key], fv = FIRST_VOTER[key];
  if (!fv) {
    // Fallback: show eligibility + ballot info instead
    botReply(`<p>🧭 Full first-time voter roadmap for ${c.flag} ${c.name} is being expanded! Here's what we have:</p>`, 400);
    setTimeout(() => showEligibility(key), 1100);
    return;
  }
  let html = `<div class="stage-card"><div class="stage-header">🧭 First-Time Voter Roadmap — ${c.flag} ${c.name}</div><div class="stage-body">`;
  fv.steps.forEach((step, i) => {
    html += `<div class="stage-section" style="padding:8px 0;border-bottom:1px solid var(--border-subtle)">`;
    html += `<div class="section-title">☐ Step ${i+1} — ${step.title}</div>`;
    html += `<p>${step.detail}</p>`;
    html += `<p style="margin-top:4px">💡 <em>Tip: ${step.tip}</em></p>`;
    html += `<p style="color:var(--warning)">⚠️ Common mistake: ${step.mistake}</p>`;
    html += `</div>`;
  });
  html += `</div></div>`;
  state.country = key;
  botReply(html, 900);
  setTimeout(() => showMiniMenu(), 1600);
}

// MODE 7 — Headline Decoder
function showHeadlineDecoder(headline) {
  if (!headline) {
    botReply(`<p>📰 <strong>Headline Decoder</strong></p><p>Paste any election headline or news snippet, and I'll break it down in plain English!</p><p>Type or paste your headline now:</p>`);
    state.mode = 'headline';
    return;
  }
  const stages = ["Announcement", "Registration", "Nominations", "Campaigning", "Voting", "Counting", "Results", "Government Formation"];
  const lower = headline.toLowerCase();
  let stage = "General election news";
  let stageNum = 0;
  if (lower.match(/announc|schedule|date set|call.*election/)) { stage = stages[0]; stageNum = 1; }
  else if (lower.match(/register|voter roll|enroll/)) { stage = stages[1]; stageNum = 2; }
  else if (lower.match(/nominat|candidat|file|running for/)) { stage = stages[2]; stageNum = 3; }
  else if (lower.match(/campaign|rally|debate|poll|survey|ad spend/)) { stage = stages[3]; stageNum = 4; }
  else if (lower.match(/vot|ballot|polling|turnout|cast/)) { stage = stages[4]; stageNum = 5; }
  else if (lower.match(/count|recount|tally|margin/)) { stage = stages[5]; stageNum = 6; }
  else if (lower.match(/result|winner|won|victory|defeat|elect/)) { stage = stages[6]; stageNum = 7; }
  else if (lower.match(/sworn|inaugur|coalition|form.*government|prime minister|president.*takes/)) { stage = stages[7]; stageNum = 8; }

  // Detect loaded words
  const loadedWords = [];
  const biasTerms = { "slam": "criticize", "crush": "defeat", "shocking": "unexpected", "disaster": "setback", "landslide": "large margin", "steal": "dispute", "rig": "question integrity", "radical": "non-mainstream", "flip-flop": "change position" };
  Object.keys(biasTerms).forEach(term => {
    if (lower.includes(term)) loadedWords.push(`"${term}" → more neutral: "${biasTerms[term]}"`);
  });

  let html = `<div class="stage-card"><div class="stage-header">📰 HEADLINE DECODER</div><div class="stage-body">`;
  html += `<div class="stage-section"><div class="section-title">📰 Headline</div><p>"${headline}"</p></div>`;
  html += `<div class="stage-section"><div class="section-title">🔤 Plain English</div><p>This headline is reporting on election-related developments. It relates to the ${stage.toLowerCase()} phase of the electoral process${stageNum ? ` (Stage ${stageNum} of 8)` : ''}.</p></div>`;
  html += `<div class="stage-section"><div class="section-title">📌 Election Stage</div><p>${stageNum ? `Stage ${stageNum} — ${stage}` : 'General coverage — spans multiple stages'}</p></div>`;
  if (loadedWords.length > 0) {
    html += `<div class="myth-box"><strong>⚠️ Language Check:</strong><br>Loaded words detected:<br>${loadedWords.join('<br>')}</div>`;
  } else {
    html += `<div class="stage-section"><div class="section-title">⚠️ Language Check</div><p>No obviously loaded or biased language detected. The headline appears relatively neutral.</p></div>`;
  }
  html += `<div class="stage-section"><div class="section-title">🧠 Context</div><p>Election headlines often use dramatic language for engagement. Always cross-reference with official election commission announcements for accuracy.</p></div>`;
  html += `</div></div>`;
  botReply(html, 800);
  state.mode = null;
  setTimeout(() => {
    botReplyWithButtons(`<p>Want to decode another headline?</p>`, [
      { label: "📰 Another headline", value: "7" },
      { label: "🏠 Home", value: "home" }
    ]);
  }, 1500);
}
