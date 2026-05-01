const COUNTRIES = {
  india: { name: "India", flag: "🇮🇳", system: "Parliamentary Republic", body: "Election Commission of India (ECI)", frequency: "Every 5 years", method: "First-Past-The-Post (FPTP)", compulsory: "No", age: 18, feature: "Largest democracy — 900M+ voters", turnout: "~67%", voters: "~950 million", lastElection: "April–June 2024", nextElection: "~2029", governing: "BJP-led NDA coalition", milestone: "Largest democratic election in history with 640M+ votes cast in 2024", surprise: "EVMs (Electronic Voting Machines) are used nationwide since 2004, making India one of the few large countries to fully digitize voting" },
  us: { name: "United States", flag: "🇺🇸", system: "Presidential Republic (Electoral College)", body: "Federal Election Commission (FEC) + state officials", frequency: "Every 4 years (Presidential)", method: "FPTP + Electoral College", compulsory: "No", age: 18, feature: "Electoral College decides the President", turnout: "~62%", voters: "~161 million registered", lastElection: "November 2024", nextElection: "November 2028", governing: "Republican Party (as of 2025)", milestone: "2020 had the highest voter turnout in 120 years (~66.8%)", surprise: "A candidate can win the popular vote but lose the presidency — it has happened 5 times" },
  uk: { name: "United Kingdom", flag: "🇬🇧", system: "Parliamentary Constitutional Monarchy", body: "Electoral Commission", frequency: "Every 5 years (max)", method: "First-Past-The-Post (FPTP)", compulsory: "No", age: 18, feature: "PM is not directly elected by voters", turnout: "~67%", voters: "~48 million", lastElection: "July 2024", nextElection: "~2029", governing: "Labour Party", milestone: "Continuous parliamentary democracy since 1707", surprise: "The PM can call a snap election before the 5-year term ends — it happened in 2017 and 2024" },
  eu: { name: "European Union", flag: "🇪🇺", system: "Supranational Parliamentary", body: "National election authorities of each member state", frequency: "Every 5 years", method: "Proportional Representation (varies by state)", compulsory: "Varies (Yes in Belgium, Luxembourg, Greece)", age: "16–18 (varies)", feature: "Citizens vote for MEPs across 27 nations", turnout: "~51%", voters: "~373 million eligible", lastElection: "June 2024", nextElection: "~2029", governing: "European People's Party (largest group)", milestone: "Largest transnational election in the world", surprise: "Belgium has compulsory voting — citizens can be fined for not voting" },
  brazil: { name: "Brazil", flag: "🇧🇷", system: "Presidential Federal Republic", body: "Superior Electoral Court (TSE)", frequency: "Every 4 years", method: "Two-round system (runoff if no majority)", compulsory: "Yes (18–70)", age: 16, feature: "Compulsory voting with electronic ballot", turnout: "~79%", voters: "~156 million", lastElection: "October 2022", nextElection: "October 2026", governing: "PT (Workers' Party)", milestone: "Fully electronic voting since 2000 — one of the first countries", surprise: "Voting is optional for 16–17 year olds and people over 70, but mandatory for ages 18–70" },
  canada: { name: "Canada", flag: "🇨🇦", system: "Parliamentary Constitutional Monarchy", body: "Elections Canada", frequency: "Every 4 years (max)", method: "First-Past-The-Post (FPTP)", compulsory: "No", age: 18, feature: "Governor General dissolves Parliament for elections", turnout: "~67%", voters: "~27 million", lastElection: "April 2025", nextElection: "~2029", governing: "Liberal Party (as of 2025)", milestone: "One of the fastest vote-counting systems among major democracies", surprise: "Canadian elections often have campaign periods of just 36–50 days — much shorter than most countries" },
  australia: { name: "Australia", flag: "🇦🇺", system: "Parliamentary Constitutional Monarchy", body: "Australian Electoral Commission (AEC)", frequency: "Every 3 years", method: "Preferential (ranked-choice) voting", compulsory: "Yes", age: 18, feature: "Compulsory voting + preferential ballots", turnout: "~92%", voters: "~17 million", lastElection: "May 2025", nextElection: "~2028", governing: "Labor Party", milestone: "Has had compulsory voting since 1924 — over 100 years", surprise: "Election day is always a Saturday, and polling stations often have 'democracy sausage' BBQs" },
  japan: { name: "Japan", flag: "🇯🇵", system: "Parliamentary Constitutional Monarchy", body: "Ministry of Internal Affairs", frequency: "Every 4 years (House of Representatives)", method: "Mixed (FPTP + Proportional)", compulsory: "No", age: 18, feature: "Candidates campaign with loudspeaker trucks", turnout: "~56%", voters: "~104 million", lastElection: "October 2024", nextElection: "~2028", governing: "Liberal Democratic Party (LDP)", milestone: "LDP has been in power for most of the post-WWII era — one of the longest-ruling democratic parties", surprise: "Campaign regulations are extremely strict — candidates can only use a limited number of posters and specific campaign vehicles" },
  germany: { name: "Germany", flag: "🇩🇪", system: "Federal Parliamentary Republic", body: "Federal Returning Officer", frequency: "Every 4 years", method: "Mixed Member Proportional (MMP)", compulsory: "No", age: 18, feature: "Two votes: one for candidate, one for party", turnout: "~77%", voters: "~61 million", lastElection: "February 2025", nextElection: "~2029", governing: "CDU/CSU-led coalition", milestone: "MMP system is considered one of the most balanced in the world", surprise: "Germans cast TWO votes — one for a local candidate and one for a political party — and both affect the final result differently" },
  france: { name: "France", flag: "🇫🇷", system: "Semi-Presidential Republic", body: "Constitutional Council + Ministry of Interior", frequency: "Every 5 years (Presidential)", method: "Two-round system", compulsory: "No", age: 18, feature: "Runoff election if no one gets 50%+", turnout: "~72%", voters: "~49 million", lastElection: "April 2022 (Presidential)", nextElection: "April 2027", governing: "Renaissance (Macron's party)", milestone: "French presidential elections consistently see 70%+ turnout", surprise: "Campaigning is banned on the day before and the day of the election — complete media blackout" }
};

const STAGES_DATA = {
  1: { icon: "📢", title: "Announcement & Schedule", what: "The election authority officially announces the election date and releases the complete schedule — including deadlines for nominations, campaigning, and voting day.", who: "Election Commission / Electoral Authority, Head of State (in some countries)", duration: "Announced 1–12 months before voting day depending on the country", example: "In India's 2024 general election, the ECI announced a 7-phase schedule spanning April to June, covering 543 constituencies.", myth: "Myth: The government decides when elections happen.\nFact: In most democracies, an independent election body sets the schedule. The ruling government cannot delay or manipulate the date." },
  2: { icon: "📝", title: "Voter Registration", what: "Citizens register to vote by proving eligibility (age, citizenship, residency). Voter rolls are compiled and published for verification.", who: "Citizens, Election officials, Verification officers", duration: "Ongoing process; registration drives intensify 3–6 months before election day", example: "In the US, voter registration drives before the 2020 election registered over 17 million new voters.", myth: "Myth: You're automatically registered to vote when you turn 18.\nFact: In many countries (like the US), you must actively register. Some countries (like Australia) do have automatic enrollment." },
  3: { icon: "🏅", title: "Candidate Nominations", what: "Individuals or parties file official paperwork to become candidates. This includes submitting signatures, paying deposits, and meeting eligibility criteria.", who: "Candidates, Political parties, Election officials (for verification)", duration: "Usually 2–6 weeks; deadlines are strict", example: "In France's 2022 presidential election, candidates needed 500 signatures from elected officials to qualify — only 12 of 60+ aspirants succeeded.", myth: "Myth: Anyone can just sign up and run for office.\nFact: Most countries require candidates to meet specific criteria — age limits, citizenship requirements, nomination deposits, or signature thresholds." },
  4: { icon: "📣", title: "Campaigning Period", what: "Candidates and parties publicly campaign through rallies, ads, debates, door-to-door outreach, and social media to win voter support.", who: "Candidates, Political parties, Media, Voters", duration: "Varies widely: 36 days in Canada to 18+ months in the US", example: "India's 2024 campaign saw PM Modi address 200+ rallies across states, while opposition held large united rallies in key battlegrounds.", myth: "Myth: Whoever spends the most money always wins.\nFact: While funding matters, many elections have been won by underfunded candidates with strong grassroots support (e.g., AOC's 2018 primary win in the US)." },
  5: { icon: "🗳️", title: "Voting Day Process", what: "Registered voters visit polling stations to cast their ballot — either on paper or electronically. Some countries offer early voting or mail-in ballots.", who: "Voters, Polling officers, Election observers, Security personnel", duration: "1 day (with some countries having multiple voting phases over weeks)", example: "Australia's 2022 election day featured the famous 'democracy sausage' tradition at polling stations, with 92% turnout due to compulsory voting.", myth: "Myth: Electronic voting is always more accurate than paper ballots.\nFact: Both methods have pros and cons. Paper leaves a physical audit trail; electronic is faster but requires cybersecurity safeguards." },
  6: { icon: "🔢", title: "Vote Counting & Verification", what: "Ballots are counted — manually, electronically, or both. Results are tallied at local, regional, and national levels. Recounts may occur in close races.", who: "Counting officials, Party agents/observers, Election commission", duration: "Hours to weeks depending on the country and closeness of results", example: "In the US 2020 election, some states like Pennsylvania took 4+ days to count mail-in ballots, leading to intense public speculation.", myth: "Myth: If counting takes long, something suspicious is happening.\nFact: Thorough counting is a sign of a careful process. Mail-in ballots and multiple verification steps naturally take more time." },
  7: { icon: "📊", title: "Results Declaration", what: "The election authority officially announces the winners after all votes are counted and any legal challenges are resolved.", who: "Election Commission, Courts (if disputes arise), Media", duration: "Same day to several weeks after voting", example: "In India, results for 543 seats are typically declared within a single day of counting, tracked live on national TV.", myth: "Myth: Early trends always predict the final result.\nFact: Counting order varies by region — early results may come from urban areas that vote differently from rural areas, making trends misleading." },
  8: { icon: "🏛️", title: "Government Formation", what: "The winning party/candidate forms the government. In parliamentary systems, the leader must prove majority support. In presidential systems, the winner takes office on a set date.", who: "Winning candidate/party, Head of State, Parliament (in some systems)", duration: "Days to weeks; some coalition negotiations take months", example: "After Germany's 2021 election, it took nearly 3 months of coalition negotiations before Olaf Scholz was sworn in as Chancellor in December.", myth: "Myth: The party with the most votes always forms the government.\nFact: In parliamentary systems, it's about seats, not total votes. A party can win more votes nationally but fewer seats — and a coalition of smaller parties can form government instead." }
};

const TIMELINES = {
  india: [
    { time: "~2 months before", desc: "ECI announces election dates and Model Code of Conduct begins", note: "Model Code of Conduct immediately bans all policy announcements by ruling government" },
    { time: "~6 weeks before", desc: "Candidate nominations open" },
    { time: "~4 weeks before", desc: "Scrutiny of nominations and withdrawal deadline" },
    { time: "~3 weeks before", desc: "Official campaigning intensifies" },
    { time: "48 hours before", desc: "Campaign silence period begins", note: "No campaigning allowed 48 hours before each phase" },
    { time: "Election Days", desc: "Voting in multiple phases (up to 7 phases over 6 weeks)", note: "Multi-phase voting is unique to India — allows security forces to be redeployed" },
    { time: "Counting Day", desc: "All votes counted in a single day using EVMs" },
    { time: "Same day", desc: "Results declared; winning party invited to form government" },
    { time: "~10 days later", desc: "New PM sworn in" }
  ],
  us: [
    { time: "~18 months before", desc: "Candidates begin announcing campaigns", note: "US campaigns are the longest and most expensive in the world" },
    { time: "~12 months before", desc: "Primary elections and caucuses begin" },
    { time: "~6 months before", desc: "Party conventions and official nominations" },
    { time: "~3 months before", desc: "General election campaign and presidential debates" },
    { time: "~1 month before", desc: "Early voting and mail-in ballots begin" },
    { time: "Election Day", desc: "First Tuesday after first Monday in November" },
    { time: "Days after", desc: "Vote counting (may take days for mail-in ballots)" },
    { time: "December", desc: "Electoral College casts official votes", note: "The Electoral College, not the popular vote, decides the president" },
    { time: "January 6", desc: "Congress certifies Electoral College results" },
    { time: "January 20", desc: "Inauguration Day — new President sworn in" }
  ],
  uk: [
    { time: "~6 weeks before", desc: "PM requests Parliament dissolution; election announced" },
    { time: "~5 weeks before", desc: "Candidate nominations open" },
    { time: "~25 days before", desc: "Voter registration deadline" },
    { time: "~4 weeks before", desc: "Official campaign period begins", note: "UK campaigns are very short compared to the US — usually just 5-6 weeks total" },
    { time: "~2 weeks before", desc: "Postal vote applications deadline" },
    { time: "Election Day", desc: "Polls open 7am–10pm (always on a Thursday)", note: "UK always votes on Thursdays — a tradition dating back to the 1930s" },
    { time: "Election night", desc: "Counts begin immediately; most results by morning" },
    { time: "Next morning", desc: "PM resigns or forms government" },
    { time: "Same/next day", desc: "New PM visits the King and takes office" }
  ],
  eu: [
    { time: "~12 months before", desc: "European Parliament sets election dates (4-day window)" },
    { time: "~6 months before", desc: "Parties begin forming pan-European alliances" },
    { time: "~3 months before", desc: "National campaigns and candidate lists finalized" },
    { time: "~1 month before", desc: "Active campaigning period" },
    { time: "Election Days", desc: "Voting across 27 countries over 4 days (Thu–Sun)", note: "Each country uses its own voting rules — some have compulsory voting" },
    { time: "Sunday evening", desc: "All polls close; results released simultaneously" },
    { time: "~2 weeks later", desc: "New MEPs officially confirmed" },
    { time: "~1 month later", desc: "New European Parliament convenes" }
  ],
  brazil: [
    { time: "~6 months before", desc: "Electoral calendar published by TSE" },
    { time: "~4 months before", desc: "Party conventions select candidates" },
    { time: "~3 months before", desc: "Official campaign period begins" },
    { time: "45 days before", desc: "Free TV/radio campaign time begins", note: "Brazil gives candidates FREE airtime on TV and radio — reducing campaign costs" },
    { time: "48 hours before", desc: "Campaign silence begins" },
    { time: "Election Day (Round 1)", desc: "First Sunday in October; voting is compulsory" },
    { time: "Same evening", desc: "Electronic results available within hours" },
    { time: "~4 weeks later", desc: "Runoff (Round 2) if no candidate gets 50%+" },
    { time: "January 1", desc: "New President inaugurated" }
  ],
  canada: [
    { time: "~36–50 days before", desc: "Governor General dissolves Parliament; writs issued", note: "Canadian campaigns are among the shortest in major democracies" },
    { time: "~5 weeks before", desc: "Nominations and voter registration" },
    { time: "~4 weeks before", desc: "Campaign begins; leaders' debates scheduled" },
    { time: "~1 week before", desc: "Advance polling days (4 days)" },
    { time: "Election Day", desc: "Always on a Monday; polls staggered by time zone", note: "Results from eastern provinces can't be broadcast until western polls close" },
    { time: "Election night", desc: "Results typically finalized the same night" },
    { time: "~2 weeks later", desc: "New PM and cabinet sworn in" }
  ],
  australia: [
    { time: "~5 weeks before", desc: "Writs issued; election formally called" },
    { time: "~4 weeks before", desc: "Nominations close; campaign period" },
    { time: "~2 weeks before", desc: "Early voting begins" },
    { time: "~1 week before", desc: "Postal vote deadline" },
    { time: "Election Day", desc: "Always on a Saturday; voting is compulsory", note: "Australians enjoy 'democracy sausages' — BBQ fundraisers at polling stations" },
    { time: "Election night", desc: "Preliminary results; full count takes ~2 weeks for preferences" },
    { time: "~2–3 weeks later", desc: "Final results declared" },
    { time: "~3 weeks later", desc: "New PM commissioned by Governor-General" }
  ],
  japan: [
    { time: "~40 days before", desc: "Emperor dissolves House of Representatives on PM's advice" },
    { time: "~25 days before", desc: "Official campaign period begins (only 12 days long)", note: "Japan has one of the shortest official campaign periods — just 12 days" },
    { time: "~12 days before", desc: "Campaign activities begin with strict rules" },
    { time: "Election Day", desc: "Always on a Sunday" },
    { time: "Election night", desc: "Results announced; NHK provides live coverage" },
    { time: "~1 week later", desc: "Special Diet session convenes" },
    { time: "~10 days later", desc: "PM elected by Diet; cabinet formed" }
  ],
  germany: [
    { time: "~3 months before", desc: "Federal President sets election date" },
    { time: "~2 months before", desc: "Parties finalize candidate lists" },
    { time: "~6 weeks before", desc: "Voter notifications mailed to all eligible citizens", note: "Germany automatically sends voting cards — no voter registration needed" },
    { time: "~4 weeks before", desc: "Active campaigning; TV debates" },
    { time: "~2 weeks before", desc: "Mail-in ballot applications peak" },
    { time: "Election Day", desc: "Always on a Sunday; polls open 8am–6pm" },
    { time: "6pm sharp", desc: "Exit polls released; counting begins" },
    { time: "Election night", desc: "Preliminary results usually clear by midnight" },
    { time: "Weeks to months", desc: "Coalition negotiations begin", note: "Coalition talks can take months — 2017 took 171 days to form a government" }
  ],
  france: [
    { time: "~3 months before", desc: "Candidates begin collecting 500 required sponsor signatures", note: "Candidates need 500 endorsements from elected officials just to qualify" },
    { time: "~1 month before", desc: "Official list of candidates published" },
    { time: "~2 weeks before", desc: "Official campaign begins; equal TV time enforced" },
    { time: "Friday before vote", desc: "Campaign ban begins at midnight", note: "Complete campaign silence before voting — no ads, no rallies, no polling" },
    { time: "Election Day (Round 1)", desc: "Sunday voting; polls close at 8pm" },
    { time: "8pm", desc: "Results projected immediately; intense media coverage" },
    { time: "2 weeks later", desc: "Round 2 (runoff) between top 2 candidates" },
    { time: "~2 weeks after Round 2", desc: "Power transfer; new President inaugurated" }
  ]
};

const QUIZ_BANK = [
  { q: "Which country has the largest number of registered voters in the world?", options: ["United States", "India", "China", "Brazil"], answer: 1, explanation: "India has approximately 950 million registered voters, making it the largest democracy on Earth." },
  { q: "What voting system does Australia use?", options: ["First-Past-The-Post", "Proportional Representation", "Preferential (Ranked-Choice) Voting", "Electoral College"], answer: 2, explanation: "Australia uses preferential voting where voters rank candidates in order of preference." },
  { q: "In the US, who actually elects the President?", options: ["The popular vote", "The Senate", "The Electoral College", "The Supreme Court"], answer: 2, explanation: "The Electoral College — 538 electors — casts the official votes. A candidate needs 270 electoral votes to win." },
  { q: "Which of these countries has compulsory voting?", options: ["United Kingdom", "Japan", "Australia", "Canada"], answer: 2, explanation: "Australia has had compulsory voting since 1924, resulting in turnout rates above 90%." },
  { q: "How many votes does a German citizen cast in a federal election?", options: ["One", "Two", "Three", "Four"], answer: 1, explanation: "Germans cast two votes — one for a local candidate (direct mandate) and one for a political party (party list)." },
  { q: "What is FPTP (First-Past-The-Post)?", options: ["Voters rank all candidates", "Whoever gets the most votes wins, even without majority", "Two rounds of voting", "Proportional seat allocation"], answer: 1, explanation: "FPTP means the candidate with the most votes in a constituency wins — no need for a majority (50%+)." },
  { q: "Which country traditionally holds elections on a Thursday?", options: ["France", "Germany", "United Kingdom", "Japan"], answer: 2, explanation: "The UK has voted on Thursdays by tradition since the 1930s." },
  { q: "What happens in France if no presidential candidate gets 50%+ in Round 1?", options: ["The candidate with most votes wins", "A coin flip decides", "A runoff between top 2 candidates", "Parliament chooses"], answer: 2, explanation: "France uses a two-round system. If no one gets an absolute majority in Round 1, the top 2 face off in Round 2." },
  { q: "What is a 'democracy sausage'?", options: ["A type of ballot paper", "BBQ sausages sold at Australian polling stations", "A German political term", "A slang term for gerrymandering"], answer: 1, explanation: "In Australia, polling stations often host BBQ fundraisers selling sausages — it's become a beloved election tradition!" },
  { q: "How many phases did India's 2024 general election have?", options: ["1", "3", "5", "7"], answer: 3, explanation: "India's 2024 election was held in 7 phases over 6 weeks to allow security forces to be redeployed across the vast country." },
  { q: "Which EU member state has compulsory voting?", options: ["France", "Germany", "Belgium", "Spain"], answer: 2, explanation: "Belgium has compulsory voting — citizens can be fined if they don't vote." },
  { q: "Brazil's voting is compulsory for which age group?", options: ["All citizens 16+", "Ages 18–70", "Ages 18–65", "All citizens 21+"], answer: 1, explanation: "Voting is mandatory for Brazilians aged 18–70. It's optional for 16–17 year olds and those over 70." },
  { q: "What is proportional representation?", options: ["Winner takes all seats", "Seats allocated in proportion to votes received", "Only the top 2 candidates advance", "Voters choose a party leader directly"], answer: 1, explanation: "In PR systems, parties receive seats roughly proportional to their vote share, giving smaller parties better representation." },
  { q: "Which country's election campaign is known for being one of the shortest?", options: ["United States", "India", "Canada", "Brazil"], answer: 2, explanation: "Canadian federal election campaigns typically last only 36–50 days, much shorter than US campaigns." },
  { q: "Japan's official campaign period for House of Representatives is how long?", options: ["12 days", "30 days", "60 days", "90 days"], answer: 0, explanation: "Japan has one of the world's shortest official campaign periods — just 12 days before election day." }
];

const ELIGIBILITY = {
  india: { minAge: 18, citizenship: "Indian citizen", docs: ["Voter ID card (EPIC)", "Aadhaar card", "Passport"], register: "Apply online at voters.eci.gov.in or visit your local Electoral Registration Officer", deadline: "Must be registered before voter roll is finalized (usually weeks before election)", where: "voters.eci.gov.in or nearest BLO (Booth Level Officer)", special: "NRI citizens can also register as overseas voters since 2011, but must vote in person at their registered constituency", gotcha: "You must be 18 on January 1 of the year the voter roll is prepared — not on election day itself" },
  us: { minAge: 18, citizenship: "US citizen", docs: ["State-issued photo ID (varies by state)", "Proof of residence", "Social Security Number"], register: "Register at vote.gov or your state's election website; some states allow same-day registration", deadline: "Varies by state — typically 15–30 days before election day", where: "vote.gov, DMV offices, or local election offices", special: "Felony voting rights vary widely by state — some restore rights after sentence, others permanently ban", gotcha: "Registration rules differ in EVERY state — there's no single national system" },
  uk: { minAge: 18, citizenship: "British, Irish, or qualifying Commonwealth citizen", docs: ["National Insurance number", "Passport (for photo ID at polls since 2023)"], register: "Register online at gov.uk/register-to-vote", deadline: "12 working days before election day", where: "gov.uk/register-to-vote", special: "EU citizens who were previously registered may retain rights depending on status; Commonwealth citizens resident in the UK CAN vote", gotcha: "Since 2023, you need photo ID to vote at a polling station — this is new and catches many people off guard" },
  eu: { minAge: "16–18 (varies by country)", citizenship: "EU citizen (for EU Parliament elections)", docs: ["Varies by member state"], register: "Check your national election authority", deadline: "Varies by country", where: "National electoral commission of your country of residence", special: "You can vote in EU elections from any EU country you reside in — even if you're not a citizen of that country", gotcha: "You must choose to vote either in your country of citizenship OR your country of residence — you cannot vote in both" },
  brazil: { minAge: 16, citizenship: "Brazilian citizen", docs: ["Título de Eleitor (voter registration card)", "ID with photo", "Proof of address"], register: "Register at any Cartório Eleitoral (electoral court office) or online via TSE", deadline: "Up to 150 days before the election", where: "TSE website or nearest Cartório Eleitoral", special: "Voting is OPTIONAL for ages 16–17 and 70+, but MANDATORY for ages 18–70. Not voting without justification can result in fines and restrictions on getting a passport", gotcha: "If you miss voting and don't justify your absence within 60 days, you can face fines and bureaucratic blocks" },
  canada: { minAge: 18, citizenship: "Canadian citizen", docs: ["Government-issued photo ID with address", "OR two pieces of ID with name (one with address)"], register: "Register online via Elections Canada, by mail, or at the polls on election day", deadline: "You can register on election day itself at the polling station", where: "elections.ca or at the polls", special: "Canada allows same-day voter registration — you can register AND vote on election day", gotcha: "You can vote even without ID if another registered voter in the same polling station vouches for you" },
  australia: { minAge: 18, citizenship: "Australian citizen", docs: ["Driver's license or Australian passport"], register: "Enroll online at aec.gov.au — enrollment is COMPULSORY", deadline: "Must be enrolled at least 8 days before election day", where: "aec.gov.au", special: "Not enrolling AND not voting are BOTH offenses — you can be fined for each", gotcha: "Many people know voting is compulsory, but don't realize that enrolling to vote is ALSO compulsory once you turn 18" },
  japan: { minAge: 18, citizenship: "Japanese citizen", docs: ["Entrance ticket (sent to registered address)", "Personal ID if ticket is lost"], register: "Automatic — based on resident registration (jūminhyō)", deadline: "Automatic enrollment; no action needed if registered as a resident", where: "Automatic via municipal government", special: "Japan's voting age was lowered from 20 to 18 in 2016", gotcha: "You're automatically registered based on your residence record, but if you move and don't update your address, you may not receive your voting ticket" },
  germany: { minAge: 18, citizenship: "German citizen (or EU citizen for some elections)", docs: ["Wahlbenachrichtigung (voting notification card)", "Personal ID or passport"], register: "Automatic — all eligible citizens are registered via population registry", deadline: "No registration needed; notification mailed ~4 weeks before election", where: "Automatic via Einwohnermeldeamt (residents' registration office)", special: "Germans living abroad can apply for postal voting to participate from anywhere", gotcha: "You don't need to 'register' to vote — Germany does it automatically. But you DO need to apply separately for a mail-in ballot if you can't vote in person" },
  france: { minAge: 18, citizenship: "French citizen", docs: ["Carte nationale d'identité or passport", "Carte électorale (voter card, not mandatory but helpful)"], register: "Register at your mairie (city hall) or online at service-public.fr", deadline: "6th Friday before election day", where: "service-public.fr or local mairie", special: "Since 2023, young citizens turning 18 are automatically registered", gotcha: "If you've moved, you must re-register at your new address's mairie — your registration doesn't follow you automatically" }
};

const COMMON_MYTHS = [
  { claim: "Dead people vote in elections", verdict: "❌ FALSE", explanation: "While voter rolls sometimes contain names of deceased individuals due to slow updates, actual cases of votes cast in dead people's names are extremely rare and are caught by verification processes. Studies consistently find negligible rates of such fraud.", authority: "Multiple state election authorities and academic studies (e.g., Brennan Center for Justice)", evidence: "A 2017 Brennan Center study found the rate of voter fraud in the US to be between 0.00004% and 0.0025%." },
  { claim: "Electronic voting machines can be easily hacked", verdict: "⚠️ PARTIALLY TRUE", explanation: "While security researchers have demonstrated vulnerabilities in some voting machine models under lab conditions, real-world election hacking is extremely difficult due to physical security, air-gapped systems, pre-election testing, and paper audit trails. No confirmed case of a national election result being changed by machine hacking has been documented.", authority: "CISA (US Cybersecurity Agency), Election Commission of India, academic security researchers", evidence: "India's EVMs are standalone devices with no internet connectivity, one-time programmable chips, and are tested before every election." },
  { claim: "Voter ID laws prevent fraud", verdict: "⚠️ PARTIALLY TRUE", explanation: "Voter ID can add a layer of verification, but in-person voter impersonation (the type ID prevents) is already extremely rare. Critics argue strict ID laws can disenfranchise eligible voters who lack acceptable ID, disproportionately affecting minorities and low-income citizens.", authority: "Various election commissions and civil rights organizations", evidence: "The UK introduced mandatory photo ID in 2023. In the first election, an estimated 14,000 people were turned away, though most returned with valid ID." },
  { claim: "Mail-in voting leads to massive fraud", verdict: "❌ FALSE", explanation: "Mail-in voting has been used safely in many countries and US states for decades. Multiple studies have found no evidence of widespread fraud. States like Oregon and Washington have conducted all-mail elections since the early 2000s without significant fraud.", authority: "MIT Election Data + Science Lab, Heritage Foundation database", evidence: "Oregon has conducted all-mail voting since 2000 with a fraud rate of approximately 0.0001%." },
  { claim: "The candidate with the most total votes always wins", verdict: "❌ FALSE", explanation: "In systems like FPTP and the US Electoral College, the candidate with the most total votes doesn't necessarily win. In FPTP parliamentary systems, a party can win fewer total votes but more seats. In the US, the Electoral College can produce a president who lost the popular vote.", authority: "Historical election records", evidence: "In the 2016 US election, Hillary Clinton received ~3 million more votes than Donald Trump but lost the Electoral College 227-304." },
  { claim: "Compulsory voting means you must choose a candidate", verdict: "❌ FALSE", explanation: "In countries with compulsory voting (like Australia), you're required to ATTEND and have your name marked off, but you can submit a blank or informal ballot. The law requires participation, not a specific choice.", authority: "Australian Electoral Commission", evidence: "In Australia's 2022 election, about 5.2% of ballots were informal (blank or incorrectly filled), which is perfectly legal." }
];

const BALLOT_DATA = {
  india: { type: "EVM (Electronic Voting Machine)", sections: [
    { title: "The Ballot Unit", desc: "You'll see a vertical panel with candidate names, party symbols, and a blue button next to each. There are no paper ballots — everything is electronic." },
    { title: "How to Vote", desc: "Press the blue button next to your chosen candidate. You'll hear a beep and see a light — that confirms your vote. You get only ONE press." },
    { title: "VVPAT Slip", desc: "After pressing the button, a paper slip appears behind a glass window for 7 seconds showing your vote. This is the Voter Verified Paper Audit Trail — you can verify but cannot take it." },
    { title: "Common Mistakes", desc: "⚠️ Don't press multiple buttons — only the first press counts. Don't try to take the VVPAT slip. Don't use your phone inside the booth." }
  ]},
  us: { type: "Varies by state (paper ballot, touchscreen, or optical scan)", sections: [
    { title: "The Ballot", desc: "Typically a long paper form listing multiple races: President, Senator, Representative, Governor, local offices, and ballot measures/propositions." },
    { title: "How to Vote", desc: "Fill in the bubble/oval next to your choice completely (like a standardized test). For write-in candidates, fill in the bubble AND write the name." },
    { title: "Multiple Races", desc: "Unlike many countries, US ballots often have 10–20+ items to vote on in a single election — including judges, school boards, and referendums." },
    { title: "Common Mistakes", desc: "⚠️ Don't use X marks — use filled bubbles. Don't vote for more than the allowed number of candidates per race. Review both sides of the ballot!" }
  ]},
  uk: { type: "Paper ballot with X mark", sections: [
    { title: "The Ballot Paper", desc: "A simple paper listing candidate names and their party affiliations in your constituency. You're voting for ONE local MP (Member of Parliament)." },
    { title: "How to Vote", desc: "Put a single X in the box next to your chosen candidate. That's it — one mark, one choice." },
    { title: "Simplicity", desc: "UK ballots are among the simplest in the world — just one race, one mark. No propositions, no multiple offices." },
    { title: "Common Mistakes", desc: "⚠️ Don't write anything else on the ballot. Don't tick (✓) — use X only. Don't mark more than one candidate. Any identifying marks invalidate the ballot." }
  ]},
  australia: { type: "Paper ballot with numbered preferences", sections: [
    { title: "The Ballot Paper", desc: "House of Representatives: a small green ballot. Senate: a VERY large white ballot (sometimes over 1 meter wide!) listing many candidates." },
    { title: "How to Vote (House)", desc: "Number EVERY candidate in order of preference: 1 for your top choice, 2 for second, and so on. You MUST number ALL boxes." },
    { title: "How to Vote (Senate)", desc: "Either vote 'above the line' (number at least 6 party boxes) OR 'below the line' (number at least 12 individual candidates)." },
    { title: "Common Mistakes", desc: "⚠️ Don't leave any boxes blank on the House ballot. Don't repeat numbers. Don't use ticks or crosses — only numbers. The Senate ballot is huge — take your time!" }
  ]},
  germany: { type: "Paper ballot with two votes", sections: [
    { title: "The Ballot Paper", desc: "A single sheet divided into TWO columns. Left column (Erststimme/First Vote): local candidates. Right column (Zweitstimme/Second Vote): political parties." },
    { title: "First Vote", desc: "Mark ONE X in the left column for your preferred local candidate. This person will directly represent your constituency (like FPTP)." },
    { title: "Second Vote", desc: "Mark ONE X in the right column for your preferred party. This determines the overall proportion of seats each party gets in parliament. This is the MORE important vote." },
    { title: "Common Mistakes", desc: "⚠️ You must make TWO separate marks. Don't forget the second vote — it's actually more impactful! You CAN vote for different parties in each column (split-ticket voting is common)." }
  ]},
  france: { type: "Paper ballot — envelope system", sections: [
    { title: "The Ballot Papers", desc: "You receive separate small paper slips — one for each candidate. Each slip has just one candidate's name on it." },
    { title: "How to Vote", desc: "Take ALL the slips into the booth. Place your chosen candidate's slip into the blue envelope. Discard the rest (or keep them — it's secret)." },
    { title: "The Envelope", desc: "Seal the envelope, present yourself to the table, have your ID verified, then personally drop the envelope into the transparent ballot box (urne)." },
    { title: "Common Mistakes", desc: "⚠️ Don't put multiple slips in the envelope. Don't write on or modify the ballot slip. Don't forget to sign the voter register after depositing your envelope." }
  ]},
  brazil: { type: "Electronic voting machine (urna eletrônica)", sections: [
    { title: "The Machine", desc: "A small electronic device with a number pad (like a phone). You enter the candidate's NUMBER — not their name." },
    { title: "How to Vote", desc: "Enter the candidate's number on the keypad. The screen shows the candidate's photo and party. Press CONFIRMA (green) to confirm, or CORRIGE (orange) to correct." },
    { title: "Multiple Offices", desc: "You vote for multiple offices in sequence: President, Governor, Senator, Federal Deputy, State Deputy. Each has its own number code." },
    { title: "Common Mistakes", desc: "⚠️ You MUST know your candidates' numbers before arriving. Don't press CONFIRMA until you verify the photo on screen. Press BRANCO (white) for a blank vote if you choose." }
  ]},
  japan: { type: "Paper ballot — write candidate name", sections: [
    { title: "The Ballot Paper", desc: "A blank ballot paper where you WRITE the name of your chosen candidate by hand. For the proportional block, you write a party name." },
    { title: "How to Vote", desc: "Write the name of your preferred candidate clearly on the ballot. Use the special pencil provided. For the party vote, write the party name." },
    { title: "Unique System", desc: "Japan is one of the few democracies where voters hand-write candidate names instead of marking a printed list. Counting involves reading handwriting!" },
    { title: "Common Mistakes", desc: "⚠️ Illegible handwriting can invalidate your vote. Don't write additional messages. Don't use your own pen. Misspelled names may still be counted if the intent is clear." }
  ]},
  canada: { type: "Paper ballot with X mark", sections: [
    { title: "The Ballot Paper", desc: "A simple paper listing candidate names and party affiliations in your riding (constituency). Similar to the UK system." },
    { title: "How to Vote", desc: "Mark an X in the circle next to your chosen candidate. Fold the ballot and return it to the election official who tears off the counterfoil." },
    { title: "Simplicity", desc: "Like the UK, you're voting for one local MP. The party that wins the most seats across Canada forms the government." },
    { title: "Common Mistakes", desc: "⚠️ Mark inside the circle, not outside. Don't write anything else on the ballot. Don't unfold the ballot in view of others — keep your vote secret." }
  ]}
};

const FIRST_VOTER = {
  india: { steps: [
    { title: "Check your eligibility", detail: "You must be an Indian citizen, 18+ years old on January 1 of the voter roll revision year, and a resident of the constituency.", tip: "Check the ECI website to see if you're already on the voter roll — someone in your family may have registered you.", mistake: "Many assume turning 18 anytime before voting day qualifies — but the cutoff is January 1 of the roll year." },
    { title: "Register to vote", detail: "Apply online at voters.eci.gov.in (Form 6) or visit your local BLO. You'll need an ID proof and address proof.", tip: "The BLO (Booth Level Officer) for your area can help you register at your doorstep.", mistake: "Waiting until the election is announced — by then, the voter roll may already be finalized." },
    { title: "Find your polling station", detail: "Check your voter slip or use the Voter Helpline App to find your assigned station.", tip: "Download the 'Voter Helpline' app — it shows your polling station, queue status, and more.", mistake: "Going to the wrong polling station — you MUST vote at your assigned station." },
    { title: "Know what to bring", detail: "Bring your Voter ID (EPIC card) or any approved photo ID (Aadhaar, passport, driving license).", tip: "Keep your EPIC card safe — it's your primary voting document for life.", mistake: "Not bringing any ID — you will be turned away without approved identification." },
    { title: "Understand your ballot (EVM)", detail: "You'll use an Electronic Voting Machine. Press the blue button next to your candidate. One press = one vote.", tip: "Check the candidate list and symbols displayed outside the polling station before entering the booth.", mistake: "Pressing the wrong button in a rush — take your time, there's no undo." },
    { title: "Voting day process", detail: "Arrive at your station, join the queue, show ID, get your finger inked, enter the booth, press the button, verify VVPAT slip.", tip: "Go early in the morning to avoid long queues, especially in summer elections.", mistake: "Trying to take a photo inside the booth — phones are not allowed near the EVM." },
    { title: "After you vote", detail: "Track results on the ECI website or news channels on counting day. Your constituency result matters most.", tip: "Watch for your specific constituency result — national trends can be misleading for your local race.", mistake: "Assuming exit polls are definitive — they're estimates and can be significantly off." }
  ]},
  us: { steps: [
    { title: "Check your eligibility", detail: "You must be a US citizen, 18+ on Election Day, and meet your state's residency requirements.", tip: "Check vote.gov to confirm your specific state's rules — they vary significantly.", mistake: "Assuming federal rules apply everywhere — each state has different requirements." },
    { title: "Register to vote", detail: "Register at vote.gov, your state's election website, or at the DMV. Some states offer same-day registration.", tip: "Register well before the deadline — don't wait until the last week.", mistake: "Not checking if your registration is still active — states sometimes purge inactive voters." },
    { title: "Find your polling place", detail: "Look up your polling place on your state's election website or vote.org.", tip: "Check if your state offers early voting — you can often vote days or weeks before Election Day.", mistake: "Going to the wrong precinct — in most states you MUST vote at your assigned location." },
    { title: "Know what to bring", detail: "Requirements vary by state. Some require photo ID, others accept non-photo ID or signed affidavits.", tip: "Look up your specific state's ID requirements at voteriders.org.", mistake: "Not knowing your state's specific ID law — rules changed in many states recently." },
    { title: "Understand your ballot", detail: "US ballots are long — you'll vote on many races and possibly ballot measures. Research all items beforehand.", tip: "Use Ballotpedia or Vote411 to preview your exact ballot before Election Day.", mistake: "Only voting for President and leaving the rest blank — down-ballot races directly affect your daily life." },
    { title: "Voting day process", detail: "Arrive at your polling place, check in, receive your ballot, mark it, feed it into the scanner or submit it.", tip: "If there are issues, ask for a provisional ballot — it's your right in every state.", mistake: "Leaving without voting if there's a problem — always ask for a provisional ballot." },
    { title: "After you vote", detail: "Track results on election night via AP or your state's election website. Some races take days to finalize.", tip: "Results may take several days for close races — this is normal, not suspicious.", mistake: "Sharing your ballot on social media — it's illegal in many states to photograph your completed ballot." }
  ]}
};
