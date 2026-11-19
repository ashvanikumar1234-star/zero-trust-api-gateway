// Zero-Trust Security Operations Center - Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
  initSparklines();
  initDonutChart();
  initTrafficAreaChart();
  initLiveClock();
  initSearchFilter();
  initNavToggles();
  initThreatInteractions();
  initNotificationButton();
});

// ================= 1. MINI SPARKLINES FOR KPI CARDS =================
function initSparklines() {
  const configs = [
    { id: 'sparkline1', color: '#10b981', data: [12, 16, 14, 22, 19, 28, 26, 35, 31, 40] },
    { id: 'sparkline2', color: '#ef4444', data: [20, 18, 25, 22, 30, 27, 36, 32, 39, 42] },
    { id: 'sparkline3', color: '#f97316', data: [15, 22, 18, 25, 20, 32, 28, 30, 26, 34] },
    { id: 'sparkline4', color: '#8b5cf6', data: [10, 15, 12, 20, 18, 25, 22, 28, 26, 32] },
    { id: 'sparkline5', color: '#10b981', data: [35, 30, 32, 28, 25, 27, 22, 24, 18, 20] }
  ];

  configs.forEach(cfg => {
    const canvas = document.getElementById(cfg.id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 70;
    const height = canvas.height = 26;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    const min = Math.min(...cfg.data);
    const max = Math.max(...cfg.data);
    const range = max - min || 1;
    const step = width / (cfg.data.length - 1);

    cfg.data.forEach((val, i) => {
      const x = i * step;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = cfg.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = cfg.color;
    ctx.shadowBlur = 6;
    ctx.stroke();
  });
}

// ================= 2. RISK DONUT SVG SEGMENTS HOVER & CIRCULAR TILT =================
function initDonutChart() {
  const legendRows = document.querySelectorAll('.legend-row');
  const donutVal = document.querySelector('.donut-total-val');
  const donutLbl = document.querySelector('.donut-total-lbl');
  const donutSvg = document.querySelector('.donut-svg');
  const segmentCircles = document.querySelectorAll('.donut-svg circle.donut-segment');
  const donutBox = document.querySelector('.donut-visual-box');

  if (!donutVal || !donutLbl) return;

  const dataMap = [
    { val: '92.5K', lbl: 'Low Risk (72%)', color: '#10b981', glow: 'rgba(16, 185, 129, 0.65)' },
    { val: '20.5K', lbl: 'Medium Risk (16%)', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.65)' },
    { val: '10.2K', lbl: 'High Risk (8%)', color: '#f97316', glow: 'rgba(249, 115, 22, 0.65)' },
    { val: '5.1K', lbl: 'Critical Risk (4%)', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.65)' }
  ];

  function activateSegment(idx) {
    const item = dataMap[idx];
    if (!item) return;

    donutVal.textContent = item.val;
    donutVal.style.color = item.color;
    donutVal.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.95)';
    donutLbl.textContent = item.lbl;
    donutLbl.style.color = item.color;
    donutLbl.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.95)';

    // Switch circular halo and sonar ripple light to that exact segment color!
    if (donutBox) {
      donutBox.style.setProperty('--donut-active-color', item.color);
      donutBox.style.setProperty('--donut-active-glow', item.glow);
    }

    if (donutSvg) {
      donutSvg.classList.add('has-hover-segment');
    }

    segmentCircles.forEach((c, i) => {
      if (i === idx) {
        c.classList.add('active-hover');
        c.setAttribute('stroke-width', '25');
      } else {
        c.classList.remove('active-hover');
        c.setAttribute('stroke-width', '20');
      }
    });

    legendRows.forEach((row, i) => {
      if (i === idx) {
        row.style.background = 'rgba(255, 255, 255, 0.08)';
        row.style.transform = 'translateX(6px)';
      } else {
        row.style.background = '';
        row.style.transform = '';
      }
    });
  }

  function deactivateSegment() {
    donutVal.textContent = '128K';
    donutVal.style.color = '#ffffff';
    donutVal.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.9)';
    donutLbl.textContent = 'Total Requests';
    donutLbl.style.color = 'var(--text-dim)';
    donutLbl.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.9)';

    if (donutBox) {
      donutBox.style.setProperty('--donut-active-color', '#10b981');
      donutBox.style.setProperty('--donut-active-glow', 'rgba(16, 185, 129, 0.5)');
    }

    if (donutSvg) {
      donutSvg.classList.remove('has-hover-segment');
    }

    segmentCircles.forEach(c => {
      c.classList.remove('active-hover');
      c.setAttribute('stroke-width', '20');
    });

    legendRows.forEach(row => {
      row.style.background = '';
      row.style.transform = '';
    });
  }

  // 1. Hover on SVG Segments directly (when cursor moves over green, yellow, orange, red arcs)
  segmentCircles.forEach((circle, idx) => {
    circle.addEventListener('mouseenter', () => activateSegment(idx));
    circle.addEventListener('mouseleave', deactivateSegment);
  });

  // 2. Hover on Legend rows on the right
  legendRows.forEach((row, idx) => {
    row.addEventListener('mouseenter', () => activateSegment(idx));
    row.addEventListener('mouseleave', deactivateSegment);
  });

  // 3. Interactive 3D Circular Tilt on Donut (Strictly Contained Inside Box)
  if (donutBox) {
    donutBox.addEventListener('mousemove', (e) => {
      const rect = donutBox.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;
      donutBox.style.transform = `perspective(300px) scale(1.04) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`;
    });

    donutBox.addEventListener('mouseleave', () => {
      donutBox.style.transform = '';
      deactivateSegment();
    });

    donutBox.addEventListener('click', () => {
      donutBox.style.transform = 'scale(0.97)';
      setTimeout(() => {
        donutBox.style.transform = 'scale(1.04)';
      }, 120);
    });
  }
}

// ================= 3. 24-HOUR TRAFFIC AREA CHART WITH INTERACTIVE HOVER =================
function initTrafficAreaChart() {
  const canvas = document.getElementById('trafficCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const timeframeSelect = document.querySelector('.chart-filter-select');

  let hoverX = null;
  let activeTimeframe = '24h';

  const datasets = {
    '24h': {
      allowed: [120, 115, 140, 135, 150, 160, 210, 230, 220, 250, 280, 275, 260, 270, 290, 270, 295, 320, 340, 355, 330, 310, 290, 285, 300, 320, 330],
      blocked: [40, 45, 55, 60, 50, 65, 45, 40, 50, 48, 55, 60, 70, 65, 80, 75, 85, 95, 90, 105, 80, 70, 60, 65, 75, 80, 85],
      xLabels: ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM', 'Now'],
      timeMarkers: [
        '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', 
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
        '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
        '11:30 PM', '11:45 PM', '11:59 PM'
      ]
    },
    '7d': {
      allowed: [180, 220, 270, 310, 290, 340, 360],
      blocked: [45, 60, 75, 80, 65, 90, 95],
      xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeMarkers: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    '30d': {
      allowed: [150, 165, 180, 210, 220, 240, 260, 250, 270, 280, 290, 310, 320, 300, 315, 330, 340, 325, 350, 360, 345, 365, 375, 360, 370, 380, 365, 375, 385, 395],
      blocked: [35, 40, 45, 55, 50, 60, 65, 55, 60, 70, 75, 80, 85, 75, 80, 85, 90, 85, 95, 100, 90, 95, 105, 95, 100, 110, 100, 105, 110, 115],
      xLabels: ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 28', 'Day 30'],
      timeMarkers: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    }
  };

  function resizeAndDraw() {
    const parent = canvas.parentElement;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(300, rect.width || (parent ? parent.clientWidth : 700));
    const h = Math.max(160, rect.height || 175);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padLeft = 38;
    const padBottom = 26;
    const padTop = 16;
    const padRight = 16;

    ctx.clearRect(0, 0, w, h);

    const chartW = Math.max(10, w - padLeft - padRight);
    const chartH = Math.max(10, h - padTop - padBottom);

    const activeSet = datasets[activeTimeframe] || datasets['24h'];
    const allowedData = activeSet.allowed;
    const blockedData = activeSet.blocked;
    const xLabels = activeSet.xLabels;
    const timeMarkers = activeSet.timeMarkers;

    const maxVal = 400;

    // Y Gridlines (0, 100, 200, 300, 400)
    const ySteps = [0, 100, 200, 300, 400];
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    ySteps.forEach(val => {
      const y = padTop + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillText(val.toString(), padLeft - 8, y + 3);
    });

    // X-axis Markers
    ctx.textAlign = 'center';
    xLabels.forEach((lbl, i) => {
      const x = padLeft + (i / (xLabels.length - 1)) * chartW;
      ctx.fillText(lbl, x, h - 6);
    });

    // Helper: Draw Smooth Bezier Series Curve & Gradient
    function drawSeries(data, strokeColor, fillColor, shadowColor) {
      const step = chartW / (data.length - 1);

      // Area Fill
      ctx.beginPath();
      ctx.moveTo(padLeft, padTop + chartH);

      data.forEach((val, i) => {
        const x = padLeft + i * step;
        const y = padTop + chartH - (val / maxVal) * chartH;
        if (i === 0) {
          ctx.lineTo(x, y);
        } else {
          const prevX = padLeft + (i - 1) * step;
          const prevY = padTop + chartH - (data[i - 1] / maxVal) * chartH;
          const cx = (prevX + x) / 2;
          ctx.bezierCurveTo(cx, prevY, cx, y, x, y);
        }
      });

      ctx.lineTo(padLeft + (data.length - 1) * step, padTop + chartH);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Line Stroke
      ctx.beginPath();
      data.forEach((val, i) => {
        const x = padLeft + i * step;
        const y = padTop + chartH - (val / maxVal) * chartH;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = padLeft + (i - 1) * step;
          const prevY = padTop + chartH - (data[i - 1] / maxVal) * chartH;
          const cx = (prevX + x) / 2;
          ctx.bezierCurveTo(cx, prevY, cx, y, x, y);
        }
      });

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 1. Draw Blocked (Red) Area & Line
    const gradRed = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    gradRed.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
    gradRed.addColorStop(1, 'rgba(239, 68, 68, 0.01)');
    drawSeries(blockedData, '#ef4444', gradRed, 'rgba(239, 68, 68, 0.8)');

    // 2. Draw Allowed (Green) Area & Line
    const gradGreen = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    gradGreen.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
    gradGreen.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
    drawSeries(allowedData, '#10b981', gradGreen, 'rgba(16, 185, 129, 0.8)');

    // 3. Interactive Crosshair Hover Effect
    if (hoverX !== null && hoverX >= padLeft && hoverX <= (w - padRight)) {
      const step = chartW / (allowedData.length - 1);
      const rawIdx = (hoverX - padLeft) / step;
      const idx = Math.max(0, Math.min(allowedData.length - 1, Math.round(rawIdx)));
      const snappedX = padLeft + idx * step;

      const allowVal = allowedData[idx];
      const blockVal = blockedData[idx];
      const allowY = padTop + chartH - (allowVal / maxVal) * chartH;
      const blockY = padTop + chartH - (blockVal / maxVal) * chartH;

      // Vertical dashed scanning crosshair line
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(snappedX, padTop);
      ctx.lineTo(snappedX, padTop + chartH);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00d2ff';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Glowing dot for Allowed
      ctx.beginPath();
      ctx.arc(snappedX, allowY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#10b981';
      ctx.stroke();

      // Glowing dot for Blocked
      ctx.beginPath();
      ctx.arc(snappedX, blockY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Floating HUD Tooltip on canvas
      const timeStr = timeMarkers[idx] || 'Live';
      const tooltipText = `${timeStr} | Allowed: ${allowVal} | Blocked: ${blockVal}`;
      ctx.font = '11px JetBrains Mono, monospace';
      const textWidth = ctx.measureText(tooltipText).width;
      const tipBoxW = textWidth + 20;
      const tipBoxH = 26;
      let tipX = snappedX - tipBoxW / 2;
      if (tipX < padLeft) tipX = padLeft;
      if (tipX + tipBoxW > w - padRight) tipX = w - padRight - tipBoxW;
      const tipY = Math.max(padTop + 2, Math.min(allowY, blockY) - 34);

      // Tooltip background
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(tipX, tipY, tipBoxW, tipBoxH, 6);
      } else {
        ctx.rect(tipX, tipY, tipBoxW, tipBoxH);
      }
      ctx.fillStyle = 'rgba(8, 16, 34, 0.95)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Tooltip text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(tooltipText, tipX + 10, tipY + 17);
    }
  }

  // Event Listeners for Hover
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    hoverX = e.clientX - rect.left;
    resizeAndDraw();
  });

  canvas.addEventListener('mouseleave', () => {
    hoverX = null;
    resizeAndDraw();
  });

  // Timeframe filter switch
  if (timeframeSelect) {
    timeframeSelect.addEventListener('change', (e) => {
      activeTimeframe = e.target.value;
      hoverX = null;
      resizeAndDraw();
    });
  }

  window.addEventListener('resize', resizeAndDraw);

  // Multi-pass initial draw to guarantee rendering even before fonts finish
  resizeAndDraw();
  requestAnimationFrame(resizeAndDraw);
  setTimeout(resizeAndDraw, 60);
  setTimeout(resizeAndDraw, 250);
}

// ================= 4. REAL-TIME CLOCK & LIVE FEED SIMULATION =================
function initLiveClock() {
  const clockEl = document.getElementById('liveClockText');
  const sidebarClockEl = document.getElementById('sidebarClockTime');

  function updateClock() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    if (clockEl) clockEl.textContent = `Last Updated: ${timeStr}`;
    if (sidebarClockEl) {
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      sidebarClockEl.textContent = `${dateStr} ${timeStr}`;
    }
  }

  setInterval(updateClock, 1000);

  // Periodically add new live API request row
  const tableBody = document.querySelector('.api-traffic-table tbody');
  if (tableBody) {
    const samplePool = [
      { user: 'Vikram', ep: '/api/v1/checkout', dev: 'Chrome', loc: 'India', risk: 14, riskCls: 'green', act: 'ALLOW', actCls: 'allow' },
      { user: 'Ananya', ep: '/api/auth/token', dev: 'iOS', loc: 'India', risk: 22, riskCls: 'green', act: 'ALLOW', actCls: 'allow' },
      { user: 'Attacker-40', ep: '/api/graphql', dev: 'Python/Curl', loc: 'Netherlands', risk: 91, riskCls: 'red', act: 'BLOCK', actCls: 'block' },
      { user: 'Siddharth', ep: '/api/reports', dev: 'Firefox', loc: 'India', risk: 68, riskCls: 'orange', act: 'LIMIT', actCls: 'limit' }
    ];

    setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const item = samplePool[Math.floor(Math.random() * samplePool.length)];

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
      tr.style.transition = 'background-color 1.5s ease';

      tr.innerHTML = `
        <td class="table-time">${timeStr}</td>
        <td class="table-user">${item.user}</td>
        <td class="table-endpoint">${item.ep}</td>
        <td class="table-device">${item.dev}</td>
        <td class="table-location">${item.loc}</td>
        <td><span class="badge-risk ${item.riskCls}">${item.risk}</span></td>
        <td><span class="badge-action ${item.actCls}">${item.act}</span></td>
        <td><button class="table-options-btn">⠇</button></td>
      `;

      tableBody.insertBefore(tr, tableBody.firstChild);
      setTimeout(() => {
        tr.style.backgroundColor = 'transparent';
      }, 1500);

      // Keep max 8 rows
      if (tableBody.children.length > 8) {
        tableBody.removeChild(tableBody.lastChild);
      }
    }, 4500);
  }
}

// ================= 5. SEARCH FILTER =================
function initSearchFilter() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('.api-traffic-table tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// ================= 6. SIDEBAR NAV ACTIVE STATE =================
function initNavToggles() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// ================= 7. THREAT ITEM CLICK INSPECTION =================
function initThreatInteractions() {
  const threats = document.querySelectorAll('.threat-item');
  threats.forEach(t => {
    t.addEventListener('click', () => {
      const title = t.querySelector('.threat-title')?.textContent || 'Threat';
      const meta = t.querySelector('.threat-meta')?.textContent || '';
      alert(`[Threat Analysis Forensics]\n\nType: ${title}\nContext: ${meta}\nStatus: Mitigated by Zero-Trust Autonomous Guard.`);
    });
  });

  setTimeout(() => {
    const toast = document.getElementById('dashboardToast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }, 600);
}

// ================= BACKEND-READY NOTIFICATION HOOK =================
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

