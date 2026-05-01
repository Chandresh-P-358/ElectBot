// map.js — Interactive SVG World Map for ElectBot

const COUNTRY_MAP_DATA = {
    india:     { name: 'India',          flag: '🇮🇳', cx: 70, cy: 50, status: 'upcoming',  r: 9, nextElection: '2026 (State)',    turnout: '~67%', system: 'Parliamentary Republic' },
    us:        { name: 'United States',  flag: '🇺🇸', cx: 17, cy: 40, status: 'upcoming',  r: 11, nextElection: 'Nov 2026 (Mid)', turnout: '~62%', system: 'Presidential Republic' },
    uk:        { name: 'United Kingdom', flag: '🇬🇧', cx: 41, cy: 26, status: 'scheduled', r: 7,  nextElection: '~2029',          turnout: '~67%', system: 'Parliamentary Monarchy' },
    eu:        { name: 'European Union', flag: '🇪🇺', cx: 50, cy: 32, status: 'scheduled', r: 8,  nextElection: '2029',           turnout: '~51%', system: 'Supranational Parliamentary' },
    brazil:    { name: 'Brazil',         flag: '🇧🇷', cx: 28, cy: 66, status: 'upcoming',  r: 9,  nextElection: 'Oct 2026',       turnout: '~79%', system: 'Presidential Republic' },
    canada:    { name: 'Canada',         flag: '🇨🇦', cx: 17, cy: 28, status: 'scheduled', r: 8,  nextElection: '~2029',          turnout: '~67%', system: 'Parliamentary Monarchy' },
    australia: { name: 'Australia',      flag: '🇦🇺', cx: 80, cy: 68, status: 'scheduled', r: 9,  nextElection: '~2028',          turnout: '~92%', system: 'Parliamentary Monarchy' },
    japan:     { name: 'Japan',          flag: '🇯🇵', cx: 85, cy: 38, status: 'scheduled', r: 7,  nextElection: '~2028',          turnout: '~56%', system: 'Parliamentary Monarchy' },
    germany:   { name: 'Germany',        flag: '🇩🇪', cx: 50, cy: 24, status: 'scheduled', r: 7,  nextElection: '~2029',          turnout: '~77%', system: 'Federal Republic' },
    france:    { name: 'France',         flag: '🇫🇷', cx: 44, cy: 33, status: 'scheduled', r: 7,  nextElection: 'Apr 2027',       turnout: '~72%', system: 'Semi-Presidential' }
};

const STATUS_COLORS = {
    upcoming:  { fill: 'rgba(245,158,11,0.3)', stroke: '#f59e0b', glow: 'rgba(245,158,11,0.6)' },
    scheduled: { fill: 'rgba(99,102,241,0.3)',  stroke: '#818cf8', glow: 'rgba(99,102,241,0.6)' },
    covered:   { fill: 'rgba(16,185,129,0.3)',  stroke: '#10b981', glow: 'rgba(16,185,129,0.6)' }
};

function initWorldMap() {
    const container = document.getElementById('map-container');
    if (!container) return;

    // Create SVG world map
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 80');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'display:block;';

    // Background
    const bg = document.createElementNS(svgNS, 'rect');
    bg.setAttribute('width', '100'); bg.setAttribute('height', '80');
    bg.setAttribute('fill', '#06080f'); svg.appendChild(bg);

    // Continents (simplified shapes)
    const continents = [
        // North America
        'M 8,20 C 10,18 18,18 22,22 L 25,35 C 22,40 18,45 14,45 L 8,38 Z',
        // South America
        'M 20,52 C 24,50 32,50 34,54 L 36,70 C 32,76 24,76 20,72 Z',
        // Europe
        'M 40,26 C 44,24 52,24 56,28 L 58,38 C 54,42 46,42 42,38 Z',
        // Africa
        'M 42,42 C 46,40 56,40 58,44 L 60,64 C 56,70 46,70 42,66 Z',
        // Asia
        'M 56,24 C 66,20 88,22 90,28 L 90,52 C 86,56 62,58 56,52 Z',
        // Australia
        'M 70,60 C 76,58 88,60 90,66 L 88,76 C 82,78 72,76 70,72 Z',
    ];

    continents.forEach(d => {
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'rgba(99,102,241,0.06)');
        path.setAttribute('stroke', 'rgba(99,102,241,0.12)');
        path.setAttribute('stroke-width', '0.3');
        svg.appendChild(path);
    });

    // Grid lines
    for (let x = 0; x <= 100; x += 10) {
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x); line.setAttribute('y1', 0);
        line.setAttribute('x2', x); line.setAttribute('y2', 80);
        line.setAttribute('stroke', 'rgba(99,102,241,0.05)'); line.setAttribute('stroke-width', '0.2');
        svg.appendChild(line);
    }
    for (let y = 0; y <= 80; y += 10) {
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', 0); line.setAttribute('y1', y);
        line.setAttribute('x2', 100); line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(99,102,241,0.05)'); line.setAttribute('stroke-width', '0.2');
        svg.appendChild(line);
    }

    // Connection lines between nearby countries
    const connections = [
        ['us', 'canada'], ['uk', 'eu'], ['eu', 'germany'], ['eu', 'france'],
        ['germany', 'france'], ['india', 'eu']
    ];
    connections.forEach(([k1, k2]) => {
        const a = COUNTRY_MAP_DATA[k1], b = COUNTRY_MAP_DATA[k2];
        if (!a || !b) return;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', a.cx); line.setAttribute('y1', a.cy);
        line.setAttribute('x2', b.cx); line.setAttribute('y2', b.cy);
        line.setAttribute('stroke', 'rgba(99,102,241,0.15)');
        line.setAttribute('stroke-width', '0.3');
        line.setAttribute('stroke-dasharray', '1,1');
        svg.appendChild(line);
    });

    // Country dots
    const tooltip = createTooltip(container);

    Object.entries(COUNTRY_MAP_DATA).forEach(([key, c]) => {
        const colors = STATUS_COLORS[c.status];
        const g = document.createElementNS(svgNS, 'g');
        g.style.cursor = 'pointer';

        // Outer glow ring (animated)
        const outerRing = document.createElementNS(svgNS, 'circle');
        outerRing.setAttribute('cx', c.cx); outerRing.setAttribute('cy', c.cy);
        outerRing.setAttribute('r', c.r + 4);
        outerRing.setAttribute('fill', 'none');
        outerRing.setAttribute('stroke', colors.stroke);
        outerRing.setAttribute('stroke-width', '0.5');
        outerRing.setAttribute('opacity', '0.4');

        // Pulse animation for upcoming
        if (c.status === 'upcoming') {
            const anim = document.createElementNS(svgNS, 'animate');
            anim.setAttribute('attributeName', 'r');
            anim.setAttribute('values', `${c.r + 4};${c.r + 8};${c.r + 4}`);
            anim.setAttribute('dur', '2s'); anim.setAttribute('repeatCount', 'indefinite');
            outerRing.appendChild(anim);
            const anim2 = document.createElementNS(svgNS, 'animate');
            anim2.setAttribute('attributeName', 'opacity');
            anim2.setAttribute('values', '0.4;0;0.4');
            anim2.setAttribute('dur', '2s'); anim2.setAttribute('repeatCount', 'indefinite');
            outerRing.appendChild(anim2);
        }

        // Main circle
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', c.cx); circle.setAttribute('cy', c.cy);
        circle.setAttribute('r', c.r);
        circle.setAttribute('fill', colors.fill);
        circle.setAttribute('stroke', colors.stroke);
        circle.setAttribute('stroke-width', '0.6');

        // Flag emoji text
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', c.cx); text.setAttribute('y', c.cy + 0.5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', Math.max(6, c.r * 0.7));
        text.textContent = c.flag;

        g.appendChild(outerRing);
        g.appendChild(circle);
        g.appendChild(text);

        // Hover effects
        g.addEventListener('mouseenter', (e) => {
            circle.setAttribute('fill', colors.glow);
            showMapTooltip(tooltip, c, e, svg, container);
        });
        g.addEventListener('mouseleave', () => {
            circle.setAttribute('fill', colors.fill);
            tooltip.classList.remove('visible');
        });
        g.addEventListener('click', () => {
            window.location.href = `chat.html?country=${key}`;
        });
        g.addEventListener('mousemove', (e) => {
            positionTooltip(tooltip, e, container);
        });

        svg.appendChild(g);
    });

    container.appendChild(svg);
}

function createTooltip(parent) {
    const div = document.createElement('div');
    div.className = 'map-tooltip';
    parent.style.position = 'relative';
    parent.appendChild(div);
    return div;
}

function showMapTooltip(tooltip, c, e, svg, container) {
    tooltip.innerHTML = `
        <h4>${c.flag} ${c.name}</h4>
        <p>🗳️ <span class="tooltip-stat">${c.system}</span></p>
        <p>📅 Next: <span class="tooltip-stat">${c.nextElection}</span></p>
        <p>📊 Turnout: <span class="tooltip-stat">${c.turnout}</span></p>
        <p style="margin-top:8px;font-size:0.7rem;color:var(--accent2)">Click to explore →</p>`;
    tooltip.classList.add('visible');
    positionTooltip(tooltip, e, container);
}

function positionTooltip(tooltip, e, container) {
    const rect = container.getBoundingClientRect();
    let x = e.clientX - rect.left + 12;
    let y = e.clientY - rect.top + 12;
    if (x + 230 > rect.width) x -= 240;
    if (y + 160 > rect.height) y -= 170;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}
