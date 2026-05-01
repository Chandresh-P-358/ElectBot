require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

// ─── Gemini AI Chat Proxy ────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured on server.' });
  }

  const { systemPrompt, chatHistory, generationConfig } = req.body;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: chatHistory,
    generationConfig: generationConfig || {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData.error?.message || `Gemini API error: ${response.status}`
      });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    res.json({ reply });
  } catch (err) {
    console.error('Gemini proxy error:', err.message);
    res.status(500).json({ error: 'Failed to reach Gemini API: ' + err.message });
  }
});

// ─── Live Election News (RSS → JSON) ─────────────────────────────────
const NEWS_FEEDS = [
  { name: 'Reuters', url: 'https://news.google.com/rss/search?q=election+voting+2025+2026&hl=en-US&gl=US&ceid=US:en' },
  { name: 'World', url: 'https://news.google.com/rss/search?q=global+elections+democracy&hl=en-US&gl=US&ceid=US:en' }
];

function parseRSSItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
    const content = match[1];
    const title = (content.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/) || [])[1] || (content.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    const link = (content.match(/<link>(.*?)<\/link>/) || [])[1] || '';
    const pubDate = (content.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
    const source = (content.match(/<source[^>]*>(.*?)<\/source>/) || [])[1] || '';

    if (title) {
      items.push({
        title: title.replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
        link: link.trim(),
        pubDate,
        source: source.trim(),
        timeAgo: getTimeAgo(pubDate)
      });
    }
  }
  return items;
}

function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch { return ''; }
}

let newsCache = { data: null, timestamp: 0 };

app.get('/api/news', async (req, res) => {
  const now = Date.now();
  if (newsCache.data && (now - newsCache.timestamp) < 5 * 60 * 1000) {
    return res.json(newsCache.data);
  }

  try {
    const allItems = [];
    for (const feed of NEWS_FEEDS) {
      try {
        const response = await fetch(feed.url, {
          headers: { 'User-Agent': 'ElectBot/2.0' }
        });
        if (response.ok) {
          const xml = await response.text();
          const items = parseRSSItems(xml);
          allItems.push(...items);
        }
      } catch (e) {
        console.warn(`Failed to fetch ${feed.name}:`, e.message);
      }
    }

    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const unique = allItems.filter((item, idx, arr) =>
      arr.findIndex(i => i.title === item.title) === idx
    ).slice(0, 20);

    newsCache = { data: { articles: unique, fetchedAt: new Date().toISOString() }, timestamp: now };
    res.json(newsCache.data);
  } catch (err) {
    console.error('News fetch error:', err.message);
    res.json({ articles: getFallbackNews(), fetchedAt: new Date().toISOString(), fallback: true });
  }
});

function getFallbackNews() {
  return [
    { title: "India prepares for state assembly elections in 2026", source: "Reuters", timeAgo: "Live", link: "#" },
    { title: "US midterm campaigning enters final phase", source: "AP News", timeAgo: "Live", link: "#" },
    { title: "EU reviews digital voting security for 2029 elections", source: "BBC", timeAgo: "Live", link: "#" },
    { title: "Brazil's TSE announces electronic voting system upgrades", source: "Al Jazeera", timeAgo: "Live", link: "#" },
    { title: "Australia debates lowering voting age to 16", source: "ABC News", timeAgo: "Live", link: "#" },
    { title: "Germany coalition talks shape future policy direction", source: "DW", timeAgo: "Live", link: "#" },
    { title: "France municipal elections see record young voter turnout", source: "France24", timeAgo: "Live", link: "#" },
    { title: "Japan considers online voting pilot program", source: "NHK", timeAgo: "Live", link: "#" },
    { title: "Canada's Elections Canada launches new voter education initiative", source: "CBC", timeAgo: "Live", link: "#" },
    { title: "UK Electoral Commission publishes voter ID impact report", source: "The Guardian", timeAgo: "Live", link: "#" }
  ];
}

// ─── Upcoming Elections ───────────────────────────────────────────────
app.get('/api/upcoming', (req, res) => {
  res.json({ elections: getUpcomingElections() });
});

function getUpcomingElections() {
  return [
    { country: "India", flag: "🇮🇳", type: "State Assembly", date: "2026", status: "upcoming", details: "Multiple state assembly elections expected" },
    { country: "Brazil", flag: "🇧🇷", type: "Presidential & Congressional", date: "October 2026", status: "upcoming", details: "General elections with compulsory voting" },
    { country: "United States", flag: "🇺🇸", type: "Midterm Elections", date: "November 2026", status: "upcoming", details: "All House seats + 1/3 Senate seats" },
    { country: "France", flag: "🇫🇷", type: "Presidential", date: "April 2027", status: "scheduled", details: "Two-round presidential election" },
    { country: "Germany", flag: "🇩🇪", type: "Federal", date: "~2029", status: "scheduled", details: "Bundestag election with MMP system" },
    { country: "United Kingdom", flag: "🇬🇧", type: "General Election", date: "~2029", status: "scheduled", details: "Next general election (5-year max term)" },
    { country: "European Union", flag: "🇪🇺", type: "Parliament", date: "2029", status: "scheduled", details: "EU-wide elections across 27 nations" },
    { country: "Australia", flag: "🇦🇺", type: "Federal", date: "~2028", status: "scheduled", details: "Compulsory preferential voting" },
    { country: "Japan", flag: "🇯🇵", type: "House of Representatives", date: "~2028", status: "scheduled", details: "Mixed FPTP + Proportional system" },
    { country: "Canada", flag: "🇨🇦", type: "Federal", date: "~2029", status: "scheduled", details: "FPTP parliamentary election" }
  ];
}

// ─── Global Stats ─────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    totalVoters: "2.1B+",
    countriesCovered: 10,
    avgTurnout: "68%",
    electionsThisYear: 3,
    totalDemocracies: 167,
    youngestVotingAge: 16,
    oldestDemocracy: "United States (1789)",
    largestElection: "India 2024 (640M+ votes)"
  });
});

// ─── API Key status check ─────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    hasApiKey: !!GEMINI_KEY,
    serverTime: new Date().toISOString(),
    version: '2.0.0'
  });
});

// ─── Serve SPA fallback ───────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname, 'chat.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

app.listen(PORT, () => {
  console.log(`\n🗳️  ElectBot Server v2.0`);
  console.log(`   ├─ Running on http://localhost:${PORT}`);
  console.log(`   ├─ Gemini API: ${GEMINI_KEY ? '✅ Connected' : '❌ No key set'}`);
  console.log(`   └─ Press Ctrl+C to stop\n`);
});
