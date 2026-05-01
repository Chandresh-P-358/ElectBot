# 🗳️ ElectBot — AI-Powered Election Education Platform

> **Making democracy understandable for everyone.**

ElectBot is a full-stack, interactive election education platform that helps anyone — from a first-time voter to a political science student — understand how elections work across 10 major democracies through 8 specialized learning modes.

---

## 🌐 Live Features

- **Interactive Chatbot** — Rule-based local engine, no API quota issues
- **Live Dashboard** — Real-time election news, upcoming elections, global stats
- **Interactive World Map** — Click any country to explore its election system
- **Voice Input** — Ask questions hands-free (Chrome/Edge)
- **Live News Ticker** — Scrolling election headlines on the home page

---

## 🧠 8 Learning Modes

| # | Mode | Description |
|---|------|-------------|
| 🗺️ | **Election Guide** | Walk through all 8 stages of any country's election |
| ⚖️ | **Compare Systems** | Side-by-side breakdown of two countries |
| ✅ | **Am I Eligible?** | Check voter eligibility by country |
| 🔍 | **Myth Buster** | Fact-check common election claims |
| 🗳️ | **Ballot Simulator** | Practice reading a real ballot |
| 🧭 | **First-Time Voter** | Step-by-step voting checklist |
| 📰 | **Headline Decoder** | Decode election news in plain English |
| 🧠 | **Quiz Me** | Test your knowledge with 5 scored questions |

---

## 🌍 Countries Covered

🇮🇳 India &nbsp;|&nbsp; 🇺🇸 USA &nbsp;|&nbsp; 🇬🇧 UK &nbsp;|&nbsp; 🇪🇺 EU &nbsp;|&nbsp; 🇧🇷 Brazil &nbsp;|&nbsp; 🇨🇦 Canada &nbsp;|&nbsp; 🇦🇺 Australia &nbsp;|&nbsp; 🇯🇵 Japan &nbsp;|&nbsp; 🇩🇪 Germany &nbsp;|&nbsp; 🇫🇷 France

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Backend | Node.js + Express |
| AI/Chat | Local rule-based engine (no API required) |
| News Feed | Google News RSS → JSON proxy |
| Maps | SVG World Map with interactive click |
| Fonts | Inter (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Chandresh-P-358/ElectBot.git
cd ElectBot

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env
```

### Running Locally

```bash
npm run dev
```

Open your browser and go to → **http://localhost:3000**

### Environment Variables (Optional)

The `.env` file is only needed if you want to enable the Gemini AI backend proxy (optional — the chatbot works fully without it):

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

> 💡 Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## 📁 Project Structure

```
ElectBot/
├── index.html          # Home page
├── chat.html           # Chat interface
├── dashboard.html      # Live Dashboard
├── home.css            # Home page styles
├── chat.css            # Chat styles
├── dashboard.css       # Dashboard styles
├── style.css           # Shared / base styles
├── chat.js             # Local chatbot engine
├── script.js           # Alternate chat logic
├── modes.js            # 8 mode handlers (eligibility, myth, ballot, etc.)
├── data.js             # All election data (countries, quizzes, timelines)
├── dashboard.js        # Dashboard logic + news fetch
├── map.js              # SVG interactive map
├── server.js           # Express server + news RSS proxy
├── package.json
├── .env.example        # Environment variable template
└── .gitignore
```

---

## 📊 Dashboard Features

- 📰 **Live Election News** — Fetched from Google News RSS (cached 5 mins)
- 🗓️ **Upcoming Elections** — Scheduled elections for 2026–2029
- 🌍 **Global Stats** — Voter counts, democracies, turnout averages
- 🗺️ **Interactive Map** — Click countries to explore election systems

---

## 🔒 Privacy & Neutrality

- ✅ **Strictly neutral** — No political opinions, parties, or candidates
- ✅ **Educational only** — All content is for learning purposes
- ✅ **No tracking** — No analytics or user data collected
- ✅ **API key safe** — `.env` is gitignored and never committed

---

## 📸 Pages

| Page | Route |
|------|-------|
| 🏠 Home | `/` |
| 💬 Chat | `/chat` |
| 📊 Dashboard | `/dashboard` |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License — free to use and modify.

---

<p align="center">Made with ❤️ for democratic education · <strong>ElectBot v2.0</strong></p>
