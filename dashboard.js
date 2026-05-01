// dashboard.js — Live Dashboard logic

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

// News emoji mapping by keywords
function getNewsEmoji(title) {
    const t = title.toLowerCase();
    if (t.includes('india') || t.includes('modi')) return '🇮🇳';
    if (t.includes('usa') || t.includes('united states') || t.includes('american') || t.includes('biden') || t.includes('trump')) return '🇺🇸';
    if (t.includes('uk') || t.includes('britain') || t.includes('london') || t.includes('parliament')) return '🇬🇧';
    if (t.includes('france') || t.includes('macron') || t.includes('paris')) return '🇫🇷';
    if (t.includes('germany') || t.includes('berlin') || t.includes('bundestag')) return '🇩🇪';
    if (t.includes('brazil') || t.includes('lula') || t.includes('brasilia')) return '🇧🇷';
    if (t.includes('australia') || t.includes('canberra')) return '🇦🇺';
    if (t.includes('japan') || t.includes('tokyo')) return '🇯🇵';
    if (t.includes('canada') || t.includes('ottawa') || t.includes('trudeau')) return '🇨🇦';
    if (t.includes('eu') || t.includes('europe') || t.includes('brussels')) return '🇪🇺';
    if (t.includes('fraud') || t.includes('hack') || t.includes('security')) return '🔐';
    if (t.includes('vote') || t.includes('voter') || t.includes('ballot')) return '🗳️';
    if (t.includes('poll') || t.includes('survey') || t.includes('turnout')) return '📊';
    if (t.includes('campaign') || t.includes('rally')) return '📣';
    if (t.includes('court') || t.includes('law') || t.includes('legal')) return '⚖️';
    if (t.includes('winner') || t.includes('victory') || t.includes('won')) return '🏆';
    return '📰';
}

// ── News ──────────────────────────────────────────────────────────────
async function loadNews() {
    const list = document.getElementById('news-list');
    const lastUpdated = document.getElementById('last-updated');
    try {
        const res = await fetch(`${API_BASE}/api/news`);
        const data = await res.json();
        const articles = data.articles || [];

        if (articles.length === 0) {
            list.innerHTML = '<p style="color:var(--text3);text-align:center;padding:20px">No headlines available right now.</p>';
            return;
        }

        list.innerHTML = '';
        articles.forEach((a, i) => {
            const card = document.createElement('a');
            card.className = 'news-card';
            card.href = a.link || '#';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.style.animationDelay = `${i * 0.04}s`;
            card.innerHTML = `
                <div class="news-emoji">${getNewsEmoji(a.title)}</div>
                <div class="news-body">
                    <div class="news-title">${escapeHtml(a.title)}</div>
                    <div class="news-meta">
                        <span class="news-source">${escapeHtml(a.source || 'News')}</span>
                        <span class="news-time">${a.timeAgo || ''}</span>
                    </div>
                </div>`;
            list.appendChild(card);
        });

        const t = data.fetchedAt ? new Date(data.fetchedAt) : new Date();
        lastUpdated.textContent = `Updated ${t.toLocaleTimeString()}${data.fallback ? ' (cached)' : ''}`;

        // Update ticker
        updateTicker(articles);
    } catch (err) {
        list.innerHTML = '<p style="color:var(--text3);text-align:center;padding:20px">⚠️ Could not load news. Is the server running?</p>';
    }
}

function escapeHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Ticker ────────────────────────────────────────────────────────────
function updateTicker(articles) {
    const el = document.getElementById('ticker-content');
    if (!articles || articles.length === 0) return;
    const htmlItems = articles.map(a =>
        `<span>${getNewsEmoji(a.title)} ${escapeHtml(a.title)}</span><span class="ticker-sep">•</span>`
    ).join('');
    // Double up for seamless loop
    el.innerHTML = htmlItems + htmlItems;
    // Adjust animation duration based on content width
    const totalWidth = el.scrollWidth;
    const duration = Math.max(30, totalWidth / 80);
    el.style.animationDuration = `${duration}s`;
}

// ── Upcoming Elections ────────────────────────────────────────────────
async function loadUpcoming() {
    const list = document.getElementById('upcoming-list');
    try {
        const res = await fetch(`${API_BASE}/api/upcoming`);
        const data = await res.json();
        const elections = data.elections || [];

        list.innerHTML = '';
        elections.forEach((e, i) => {
            const card = document.createElement('div');
            card.className = 'upcoming-card';
            card.style.animationDelay = `${i * 0.06}s`;
            const statusClass = e.status === 'upcoming' ? 'upcoming-status' : 'scheduled-status';
            card.innerHTML = `
                <div class="upcoming-flag">${e.flag}</div>
                <div class="upcoming-info">
                    <div class="upcoming-country">${escapeHtml(e.country)}</div>
                    <div class="upcoming-type">${escapeHtml(e.type)}</div>
                </div>
                <div class="upcoming-date ${statusClass}">${escapeHtml(e.date)}</div>`;
            card.title = e.details;
            list.appendChild(card);
        });
    } catch (err) {
        list.innerHTML = '<p style="color:var(--text3);padding:12px">⚠️ Could not load election calendar.</p>';
    }
}

// ── Stats ─────────────────────────────────────────────────────────────
async function loadStats() {
    try {
        const res = await fetch(`${API_BASE}/api/stats`);
        const data = await res.json();
        if (data.totalVoters) document.getElementById('stat-voters').textContent = data.totalVoters;
        if (data.countriesCovered) document.getElementById('stat-countries').textContent = data.countriesCovered;
        if (data.avgTurnout) document.getElementById('stat-turnout').textContent = data.avgTurnout;
        if (data.electionsThisYear) document.getElementById('stat-elections').textContent = data.electionsThisYear;
        if (data.totalDemocracies) document.getElementById('stat-democracies').textContent = data.totalDemocracies;
        if (data.youngestVotingAge) document.getElementById('stat-youngest').textContent = data.youngestVotingAge;
    } catch (e) { /* use defaults */ }
}

// ── Animated counters ─────────────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    const prefix = target.match(/[^0-9.]*/)[0];
    const postfix = target.replace(/^[0-9.]+/, '') || suffix;
    let start = 0;
    const duration = 1200;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + (Math.floor(eased * num)) + postfix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function initCounterAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateCounter(el, el.textContent);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-value').forEach(el => observer.observe(el));
}

// ── Navbar ────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// ── Refresh button ────────────────────────────────────────────────────
document.getElementById('refresh-news').addEventListener('click', () => {
    document.getElementById('news-list').innerHTML = `
        <div class="news-skeleton"><div class="skeleton-line w80"></div><div class="skeleton-line w60"></div></div>
        <div class="news-skeleton"><div class="skeleton-line w70"></div><div class="skeleton-line w50"></div></div>`;
    loadNews();
});

// ── Auto-refresh every 5 minutes ──────────────────────────────────────
setInterval(() => { loadNews(); }, 5 * 60 * 1000);

// ── Init ──────────────────────────────────────────────────────────────
(async () => {
    initCounterAnimations();
    await Promise.all([loadStats(), loadNews(), loadUpcoming()]);
    // Init map after data is loaded
    if (typeof initWorldMap === 'function') initWorldMap();
})();
