// =================================================================
// ZERO-TRUST API SECURITY GATEWAY - ATTACK SIMULATOR SCRIPT
// Powers interactive attack scenarios, dual-axis impact chart & timeline
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  initScenarioCards();
  initImpactChart();
  initTableInteractions();
  initGeneralSpotlights();
  initNotificationButton();
  initTimer();
  initClockSync();
});

// ================= 1. SCENARIOS REPOSITORY =================
const SCENARIOS = {
  'credential': {
    id: 'credential',
    title: 'Credential Compromise',
    color: '#ef4444',
    alertTitle: 'CRITICAL THREAT DETECTED',
    riskScore: 94,
    action: 'BLOCKED',
    details: {
      type: 'Credential Compromise',
      user: 'X92 (Stolen Credentials)',
      device: 'Unknown iPhone (iOS 17)',
      location: 'London, UK',
      endpoint: 'GET /api/admin/users',
      expectedRisk: 'High (80-100)'
    },
    flow: [
      'Login with stolen credentials',
      'New device and location',
      'Multiple rapid requests',
      'Access sensitive endpoint',
      'Trigger security detection'
    ],
    timeline: [
      { text: 'Starting attack simulation...', time: '12:58:10', type: 'check' },
      { text: 'Generating login from unknown device...', time: '12:58:11', type: 'check' },
      { text: 'New location detected (London, UK)...', time: '12:58:11', type: 'check' },
      { text: 'Increasing request frequency...', time: '12:58:12', type: 'check' },
      { text: 'Accessing sensitive endpoint...', time: '12:58:13', type: 'check' },
      { text: 'Threat detected! Risk score: 94', time: '12:58:14', type: 'alert' }
    ],
    chart: {
      labels: ['12:58:10', '12:58:11', '12:58:12', '12:58:13', '12:58:14'],
      riskScores: [36, 48, 65, 82, 94],
      reqFreq: [20, 35, 62, 120, 180],
      velocity: '10 → 50 → 150'
    },
    table: [
      { time: '12:58:14', user: 'X92', endpoint: '/api/admin/users', device: 'iPhone', loc: 'London, UK', risk: 94, action: 'BLOCK', selected: true },
      { time: '12:58:13', user: 'X92', endpoint: '/api/admin/users', device: 'iPhone', loc: 'London, UK', risk: 91, action: 'BLOCK' },
      { time: '12:58:12', user: 'X92', endpoint: '/api/admin/users', device: 'iPhone', loc: 'London, UK', risk: 87, action: 'BLOCK' },
      { time: '12:58:11', user: 'X92', endpoint: '/api/login', device: 'iPhone', loc: 'London, UK', risk: 78, action: 'LIMIT' },
      { time: '12:58:10', user: 'X92', endpoint: '/api/login', device: 'iPhone', loc: 'London, UK', risk: 62, action: 'LIMIT' },
      { time: '12:58:08', user: 'Rahul', endpoint: '/api/profile', device: 'Android', loc: 'India', risk: 12, action: 'ALLOW' },
      { time: '12:58:05', user: 'Amit', endpoint: '/api/orders', device: 'Chrome', loc: 'India', risk: 28, action: 'ALLOW' }
    ]
  },

  'abuse': {
    id: 'abuse',
    title: 'API Abuse',
    color: '#f97316',
    alertTitle: 'HIGH-VELOCITY API ABUSE DETECTED',
    riskScore: 89,
    action: 'BLOCKED',
    details: {
      type: 'API Abuse & Scraping',
      user: 'Unknown (Bot-Scraper)',
      device: 'Headless Chrome (Linux)',
      location: 'Russia',
      endpoint: 'POST /api/login',
      expectedRisk: 'Critical (85-95)'
    },
    flow: [
      'Initial reconnaissance probing ping',
      'Tor exit relay node IP detected',
      'Surge in POST volume (450 req/s)',
      'Automated credential stuffing pattern',
      'Rate limit breach & perimeter quarantine'
    ],
    timeline: [
      { text: 'Initial network probing initiated...', time: '12:58:10', type: 'check' },
      { text: 'Tor exit relay node confirmed (AS200651)...', time: '12:58:11', type: 'check' },
      { text: 'Burst frequency velocity threshold exceeded...', time: '12:58:12', type: 'check' },
      { text: 'Scraper user-agent signature quarantined...', time: '12:58:13', type: 'check' },
      { text: 'Threat detected! Risk score: 89', time: '12:58:14', type: 'alert' }
    ],
    chart: {
      labels: ['12:58:10', '12:58:11', '12:58:12', '12:58:13', '12:58:14'],
      riskScores: [25, 42, 68, 80, 89],
      reqFreq: [30, 80, 160, 220, 260],
      velocity: '30 → 160 → 260'
    },
    table: [
      { time: '12:58:14', user: 'Unknown', endpoint: '/api/login', device: 'Linux', loc: 'Russia', risk: 89, action: 'BLOCK', selected: true },
      { time: '12:58:13', user: 'Unknown', endpoint: '/api/login', device: 'Linux', loc: 'Russia', risk: 85, action: 'BLOCK' },
      { time: '12:58:12', user: 'Unknown', endpoint: '/api/search', device: 'Linux', loc: 'Russia', risk: 74, action: 'LIMIT' },
      { time: '12:58:11', user: 'Unknown', endpoint: '/api/search', device: 'Linux', loc: 'Russia', risk: 65, action: 'LIMIT' },
      { time: '12:58:10', user: 'Unknown', endpoint: '/api/health', device: 'Linux', loc: 'Russia', risk: 40, action: 'ALLOW' },
      { time: '12:58:08', user: 'Pooja', endpoint: '/api/upload', device: 'Chrome', loc: 'India', risk: 54, action: 'LIMIT' },
      { time: '12:58:05', user: 'Sneha', endpoint: '/api/profile', device: 'Chrome', loc: 'Germany', risk: 68, action: 'BLOCK' }
    ]
  },

  'privilege': {
    id: 'privilege',
    title: 'Privilege Misuse',
    color: '#a855f7',
    alertTitle: 'PRIVILEGE ELEVATION ATTEMPT DETECTED',
    riskScore: 81,
    action: 'BLOCKED',
    details: {
      type: 'Privilege Misuse & BOLA',
      user: 'Amit (Standard Employee)',
      device: 'Corporate Windows (Chrome)',
      location: 'India',
      endpoint: 'DELETE /api/users/superadmin',
      expectedRisk: 'Critical (80-90)'
    },
    flow: [
      'Valid corporate employee session created',
      'Direct object reference parameter tampering',
      'Attempting unauthorized SuperAdmin route',
      'Zero-Trust RBAC policy mismatch triggered',
      'Session token revoked & security alert sent'
    ],
    timeline: [
      { text: 'Employee JWT session token authenticated...', time: '12:58:10', type: 'check' },
      { text: 'Endpoint ID parameter tampering detected...', time: '12:58:11', type: 'check' },
      { text: 'SuperAdmin RBAC role required (missing)...', time: '12:58:12', type: 'check' },
      { text: 'Unauthorized delete action intercepted...', time: '12:58:13', type: 'check' },
      { text: 'Threat detected! Risk score: 81', time: '12:58:14', type: 'alert' }
    ],
    chart: {
      labels: ['12:58:10', '12:58:11', '12:58:12', '12:58:13', '12:58:14'],
      riskScores: [20, 35, 55, 72, 81],
      reqFreq: [10, 20, 35, 45, 60],
      velocity: '10 → 35 → 60'
    },
    table: [
      { time: '12:58:14', user: 'Amit', endpoint: '/api/users/superadmin', device: 'Chrome', loc: 'India', risk: 81, action: 'BLOCK', selected: true },
      { time: '12:58:13', user: 'Amit', endpoint: '/api/users', device: 'Chrome', loc: 'India', risk: 75, action: 'BLOCK' },
      { time: '12:58:12', user: 'Amit', endpoint: '/api/users', device: 'Chrome', loc: 'India', risk: 65, action: 'LIMIT' },
      { time: '12:58:11', user: 'Amit', endpoint: '/api/orders', device: 'Chrome', loc: 'India', risk: 28, action: 'ALLOW' },
      { time: '12:58:10', user: 'Amit', endpoint: '/api/profile', device: 'Chrome', loc: 'India', risk: 15, action: 'ALLOW' },
      { time: '12:58:08', user: 'Karan', endpoint: '/api/orders', device: 'Android', loc: 'India', risk: 62, action: 'LIMIT' },
      { time: '12:58:05', user: 'Rohit', endpoint: '/api/profile', device: 'Windows', loc: 'India', risk: 49, action: 'ALLOW' }
    ]
  }
};

let activeScenarioKey = 'credential';

// ================= 2. SCENARIO CARD SWITCHING & SPOTLIGHTS =================
function initScenarioCards() {
  const cards = document.querySelectorAll('.attack-card');

  cards.forEach(card => {
    // Cursor-following circular spotlight & subtle 3D tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (-(y - centerY) / centerY) * 3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;
      card.style.transform = `perspective(600px) translateY(-5px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    // Scenario Switching Click
    card.addEventListener('click', () => {
      const scenario = card.getAttribute('data-scenario');
      if (!scenario || scenario === activeScenarioKey) return;

      cards.forEach(c => {
        c.classList.remove('active');
        const btn = c.querySelector('.btn-simulate');
        if (btn) {
          btn.className = 'btn-simulate btn-sim-outline';
        }
      });

      card.classList.add('active');
      const activeBtn = card.querySelector('.btn-simulate');
      if (activeBtn) {
        if (scenario === 'credential') activeBtn.className = 'btn-simulate btn-sim-red';
        else activeBtn.className = 'btn-simulate btn-sim-outline';
      }

      activeScenarioKey = scenario;
      applyScenario(scenario);
    });
  });
}

function applyScenario(key) {
  const data = SCENARIOS[key];
  if (!data) return;

  // 1. Details
  document.getElementById('dtAttackType').textContent = data.details.type;
  document.getElementById('dtSimUser').textContent = data.details.user;
  document.getElementById('dtDevice').textContent = data.details.device;
  document.getElementById('dtLocation').textContent = data.details.location;
  document.getElementById('dtEndpoint').textContent = data.details.endpoint;
  document.getElementById('dtExpectedRisk').textContent = data.details.expectedRisk;

  // 2. Attack Flow Steps
  const flowContainer = document.getElementById('flowStepsList');
  if (flowContainer) {
    flowContainer.innerHTML = '';
    data.flow.forEach((stepText, i) => {
      const item = document.createElement('div');
      item.className = 'flow-step-item';
      item.innerHTML = `
        <span class="step-num-badge">${i + 1}</span>
        <span class="step-label">${stepText}</span>
      `;
      flowContainer.appendChild(item);
    });
  }

  // 3. Timeline
  const timelineContainer = document.getElementById('verticalTimelineFlow');
  if (timelineContainer) {
    timelineContainer.innerHTML = '';
    data.timeline.forEach((event, i) => {
      const isLast = i === data.timeline.length - 1;
      const row = document.createElement('div');
      row.className = `timeline-event-row ${isLast ? 'alert-event' : 'completed'}`;
      
      if (isLast) {
        row.innerHTML = `
          <div class="event-node-col">
            <span class="event-alert-dot">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
          </div>
          <div class="event-text-col">
            <span class="event-msg text-red-bold">${event.text}</span>
          </div>
          <div class="event-status-col">
            <span class="event-time-col font-red">${event.time}</span>
          </div>
        `;
      } else {
        row.innerHTML = `
          <div class="event-node-col">
            <span class="event-ring-dot"></span>
            <span class="event-connector-line"></span>
          </div>
          <div class="event-text-col">
            <span class="event-msg">${event.text}</span>
          </div>
          <div class="event-status-col">
            <span class="event-time-col">${event.time}</span>
            <span class="event-green-check">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </div>
        `;
      }
      timelineContainer.appendChild(row);
    });
  }

  // 4. Alert Banner
  const alertTitle = document.getElementById('alertTitle');
  const alertScore = document.getElementById('alertScoreRatio');
  const alertAction = document.getElementById('alertActionTag');
  if (alertTitle) alertTitle.textContent = data.alertTitle;
  if (alertScore) alertScore.innerHTML = `<strong>${data.riskScore}</strong> / 100`;
  if (alertAction) alertAction.textContent = data.action;

  // 5. Traffic Table
  const tableBody = document.getElementById('simTableBody');
  if (tableBody) {
    tableBody.innerHTML = '';
    data.table.forEach((r, idx) => {
      const tr = document.createElement('tr');
      tr.className = `sim-row ${r.selected ? 'selected-attack-row' : ''}`;
      tr.setAttribute('data-id', `row-${idx}`);
      tr.innerHTML = `
        <td class="col-time ${r.selected ? 'font-red' : ''}">${r.time}</td>
        <td class="col-user">${r.user}</td>
        <td class="col-endpoint">${r.endpoint}</td>
        <td class="col-device">${r.device}</td>
        <td class="col-loc">${r.loc}</td>
        <td><span class="risk-pill-badge ${r.risk >= 80 ? 'pill-red' : (r.risk >= 60 ? 'pill-orange' : 'pill-green')}">${r.risk}</span></td>
        <td><span class="action-pill-badge ${r.action === 'BLOCK' ? 'pill-block' : (r.action === 'LIMIT' ? 'pill-limit' : 'pill-allow')}">${r.action}</span></td>
        <td class="col-more">&#8942;</td>
      `;
      tableBody.appendChild(tr);
    });
    bindRowSpotlights(tableBody);
  }

  // 6. Velocity text
  const velocityEl = document.getElementById('metricVelocityText');
  if (velocityEl && data.chart.velocity) {
    velocityEl.innerHTML = `${data.chart.velocity.replace(/→/g, '&rarr;')}`;
  }

  // 7. Redraw Chart
  drawDualAxisImpactChart(data.chart);
}

// ================= 3. DUAL-AXIS REAL-TIME IMPACT CANVAS CHART =================
function initImpactChart() {
  const canvas = document.getElementById('impactCanvas');
  if (!canvas) return;

  const currentData = SCENARIOS[activeScenarioKey].chart;
  drawDualAxisImpactChart(currentData);

  // Crosshair hover tooltips
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    drawDualAxisImpactChart(SCENARIOS[activeScenarioKey].chart, mouseX);
  });

  canvas.addEventListener('mouseleave', () => {
    drawDualAxisImpactChart(SCENARIOS[activeScenarioKey].chart);
  });
}

function drawDualAxisImpactChart(data, hoverX = null) {
  const canvas = document.getElementById('impactCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Handle Retina Hi-DPI
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  // Paddings for Dual Axes
  const padLeft = 40;
  const padRight = 44;
  const padTop = 15;
  const padBottom = 26;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // 1. Grid Lines & Left Y-Axis (Risk: 0, 20, 40, 60, 80, 100)
  const yTicks = [0, 20, 40, 60, 80, 100];
  ctx.font = '500 10px var(--font-mono)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  yTicks.forEach(tick => {
    const y = padTop + chartH - (tick / 100) * chartH;
    
    // Grid horizontal line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();

    // Left Y label (Red Risk Score)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.fillText(tick, padLeft - 6, y);
  });

  // Vertical Left Axis Label: "Risk Score"
  ctx.save();
  ctx.translate(11, padTop + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '600 9px var(--font-main)';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.fillText('Risk Score', 0, 0);
  ctx.restore();

  // 2. Right Y-Axis (Requests: 0, 50, 100, 150, 200)
  const rightTicks = [0, 50, 100, 150, 200];
  ctx.textAlign = 'left';
  rightTicks.forEach(tick => {
    const y = padTop + chartH - (tick / 200) * chartH;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.fillText(tick, width - padRight + 6, y);
  });

  // Vertical Right Axis Label: "Requests/min"
  ctx.save();
  ctx.translate(width - 4, padTop + chartH / 2);
  ctx.rotate(Math.PI / 2);
  ctx.font = '600 9px var(--font-main)';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText('Requests/min', 0, 0);
  ctx.restore();

  // 3. X-Axis Time Labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'var(--text-dim)';
  ctx.font = '500 10px var(--font-mono)';

  const stepX = chartW / (data.labels.length - 1);
  const coords = [];

  data.labels.forEach((timeStr, i) => {
    const x = padLeft + i * stepX;
    ctx.fillText(timeStr, x, height - padBottom + 8);

    // Compute coordinate points for Red (Risk) and Blue (Frequency)
    const riskY = padTop + chartH - (data.riskScores[i] / 100) * chartH;
    const freqY = padTop + chartH - (Math.min(data.reqFreq[i], 200) / 200) * chartH;

    coords.push({ x, riskY, freqY, risk: data.riskScores[i], freq: data.reqFreq[i], label: timeStr });
  });

  // 4. Draw Line 2: Blue Request Frequency Line
  ctx.beginPath();
  coords.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.freqY);
    else {
      const prev = coords[i - 1];
      const midX = (prev.x + pt.x) / 2;
      ctx.bezierCurveTo(midX, prev.freqY, midX, pt.freqY, pt.x, pt.freqY);
    }
  });
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 8;
  ctx.stroke();

  // Blue dots
  ctx.shadowBlur = 0;
  coords.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.freqY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pt.x, pt.freqY, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });

  // 5. Draw Line 1: Red Risk Score Line
  ctx.beginPath();
  coords.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.riskY);
    else {
      const prev = coords[i - 1];
      const midX = (prev.x + pt.x) / 2;
      ctx.bezierCurveTo(midX, prev.riskY, midX, pt.riskY, pt.x, pt.riskY);
    }
  });
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.stroke();

  // Red dots
  ctx.shadowBlur = 0;
  coords.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.riskY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pt.x, pt.riskY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });

  // 6. Interactive Hover Crosshair & Dual Tooltip
  if (hoverX !== null && hoverX >= padLeft && hoverX <= width - padRight) {
    // Find closest data point
    let closest = coords[0];
    let minDiff = Infinity;
    coords.forEach(pt => {
      const diff = Math.abs(pt.x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = pt;
      }
    });

    // Vertical dashed guideline
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.moveTo(closest.x, padTop);
    ctx.lineTo(closest.x, padTop + chartH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight hovered points with glowing pulses
    ctx.beginPath();
    ctx.arc(closest.x, closest.riskY, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(closest.x, closest.freqY, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fill();

    // Floating Tooltip Box
    const tipW = 110;
    const tipH = 46;
    let tipX = closest.x - tipW / 2;
    if (tipX < padLeft) tipX = padLeft;
    if (tipX + tipW > width - padRight) tipX = width - padRight - tipW;
    const tipY = Math.min(closest.riskY, closest.freqY) - tipH - 8;

    ctx.fillStyle = '#081022';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tipX, tipY > 5 ? tipY : 10, tipW, tipH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = '700 10px var(--font-main)';
    ctx.textAlign = 'left';
    ctx.fillText(`● Risk: ${closest.risk}/100`, tipX + 8, (tipY > 5 ? tipY : 10) + 16);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`● Freq: ${closest.freq} req/m`, tipX + 8, (tipY > 5 ? tipY : 10) + 32);
  }
}

// ================= 4. TABLE ROW INTERACTIONS & SPOTLIGHTS =================
function bindRowSpotlights(container) {
  if (!container) return;
  const rows = container.querySelectorAll('.sim-row');
  rows.forEach(row => {
    const riskBadge = row.querySelector('.risk-pill-badge');
    const riskVal = riskBadge ? parseInt(riskBadge.textContent.trim(), 10) : 50;

    let glowColor = 'rgba(16, 185, 129, 0.22)';
    if (riskVal >= 80) {
      glowColor = 'rgba(239, 68, 68, 0.24)';
    } else if (riskVal >= 60) {
      glowColor = 'rgba(249, 115, 22, 0.24)';
    }
    row.style.setProperty('--row-glow', glowColor);

    row.addEventListener('mousemove', (e) => {
      const rect = row.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      row.style.setProperty('--row-mouse-x', `${x}px`);
      row.style.setProperty('--row-mouse-y', `${y}px`);
    });
  });
}

function initTableInteractions() {
  const tableBody = document.getElementById('simTableBody');
  if (!tableBody) return;

  bindRowSpotlights(tableBody);

  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('.sim-row');
    if (!row) return;

    tableBody.querySelectorAll('.sim-row').forEach(r => {
      r.classList.remove('selected-attack-row');
      const timeCell = r.querySelector('.col-time');
      if (timeCell) timeCell.classList.remove('font-red');
    });

    row.classList.add('selected-attack-row');
    const timeCell = row.querySelector('.col-time');
    if (timeCell) timeCell.classList.add('font-red');
  });
}

// General Card Spotlights strictly contained inside cards
function initGeneralSpotlights() {
  const cards = document.querySelectorAll('.sim-card, .threat-alert-banner-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    });
  });
}

// ================= 5. LIVE SIMULATION TIMER =================
function initTimer() {
  const timerEl = document.getElementById('simTimer');
  if (!timerEl) return;

  let seconds = 14;
  setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerEl.textContent = `00:${mins}:${secs}`;
  }, 1000);
}

// ================= 6. CLOCK SYNC =================
function initClockSync() {
  const clockEl = document.getElementById('sidebarClockTime');
  function updateTime() {
    if (!clockEl) return;
    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${month} ${day}, ${year} ${hours}:${mins}:${secs}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// ================= 7. BACKEND-READY NOTIFICATION HOOK =================
function initNotificationButton() {
  const notifBtn = document.getElementById('notificationBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Safe decoupled event ready for backend listener with zero errors
      window.dispatchEvent(new CustomEvent('zeroTrustNotificationClick', {
        detail: { count: document.getElementById('notificationCount')?.textContent || '0' }
      }));
    });
  }

  // Global helper for backend to update count dynamically with zero errors
  window.updateNotificationBadge = function(count) {
    const badge = document.getElementById('notificationCount');
    if (!badge) return;
    if (count === undefined || count === null || count === 0 || count === '0' || count === '') {
      badge.textContent = '';
      badge.style.display = 'none';
    } else {
      badge.textContent = String(count);
      badge.style.display = 'flex';
    }
  };
}
