// =================================================================
// ZERO-TRUST API SECURITY GATEWAY - SECURITY POLICIES SCRIPT
// Interactive sliders, toggles, template presets, donut chart & spotlights
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initMasterToggles();
  initSubRuleSwitches();
  initTemplatePresets();
  initDonutInteractions();
  initSaveButton();
  initCursorSpotlights();
  initNotificationButton();
  initLiveClockSync();
});

// ================= 1. INTERACTIVE RANGE SLIDERS =================
function initSliders() {
  const sliders = [
    { rangeId: 'rangeMedium', boxId: 'valBoxMedium', min: 0, max: 100 },
    { rangeId: 'rangeHigh', boxId: 'valBoxHigh', min: 0, max: 100 },
    { rangeId: 'rangeCritical', boxId: 'valBoxCritical', min: 0, max: 100 },
    { rangeId: 'rangeGlobalRate', boxId: 'valBoxGlobalRate', min: 10, max: 1000 },
    { rangeId: 'rangeBurstRate', boxId: 'valBoxBurstRate', min: 1, max: 100 }
  ];

  sliders.forEach(s => {
    const rangeEl = document.getElementById(s.rangeId);
    const boxEl = document.getElementById(s.boxId);
    if (!rangeEl || !boxEl) return;

    function updateSliderFill() {
      const val = parseFloat(rangeEl.value);
      boxEl.textContent = val;
      const pct = ((val - s.min) / (s.max - s.min)) * 100;
      rangeEl.style.setProperty('--fill-pct', `${pct.toFixed(1)}%`);
    }

    rangeEl.addEventListener('input', updateSliderFill);
    updateSliderFill();
  });
}

// ================= 2. MASTER CARD TOGGLE SWITCHES =================
function initMasterToggles() {
  const toggles = document.querySelectorAll('.config-toggle-switch');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.toggle('active');
      const label = toggle.querySelector('.toggle-status-lbl');
      if (label) {
        label.textContent = isActive ? 'Enabled' : 'Disabled';
      }

      const targetId = toggle.getAttribute('data-target');
      if (targetId) {
        const bodyEl = document.getElementById(targetId);
        if (bodyEl) {
          if (isActive) {
            bodyEl.classList.remove('disabled');
          } else {
            bodyEl.classList.add('disabled');
          }
        }
      }

      recalculateActivePolicies();
    });
  });
}

// ================= 3. SUB-RULE PILL MINI SWITCHES =================
function initSubRuleSwitches() {
  const miniSwitches = document.querySelectorAll('.pill-mini-switch');
  
  miniSwitches.forEach(sw => {
    sw.addEventListener('click', () => {
      sw.classList.toggle('active');
      recalculateActivePolicies();
    });
  });
}

// ================= 4. RECALCULATE ACTIVE POLICIES =================
function recalculateActivePolicies() {
  let count = 0;
  
  // Master toggles
  document.querySelectorAll('.config-toggle-switch.active').forEach(() => count += 2);
  
  // Sub-rule switches
  document.querySelectorAll('.pill-mini-switch.active').forEach(() => count += 1);

  const kpiEl = document.getElementById('kpiActivePolicies');
  const donutNumEl = document.getElementById('donutTotalCount');
  if (kpiEl) kpiEl.textContent = count;
  if (donutNumEl) donutNumEl.textContent = count;
}

// ================= 5. TEMPLATE PRESETS =================
function initTemplatePresets() {
  const templateCards = document.querySelectorAll('.template-item-row');

  const PRESETS = {
    'strict': {
      medium: 20, high: 50, critical: 70,
      globalRate: 80, burstRate: 15,
      tokenVal: true, blockDevices: true, mfa: true, elevatedPerms: true,
      title: 'Strict Security Template Applied',
      msg: 'Maximum protection enabled: MFA active, tight risk & rate thresholds.'
    },
    'balanced': {
      medium: 30, high: 60, critical: 80,
      globalRate: 100, burstRate: 20,
      tokenVal: true, blockDevices: true, mfa: false, elevatedPerms: true,
      title: 'Balanced Template Applied',
      msg: 'Recommended production standards configured across all endpoints.'
    },
    'dev': {
      medium: 50, high: 80, critical: 95,
      globalRate: 500, burstRate: 50,
      tokenVal: true, blockDevices: false, mfa: false, elevatedPerms: false,
      title: 'Development Template Applied',
      msg: 'Relaxed security policies active for local testing and debugging.'
    }
  };

  templateCards.forEach(card => {
    const applyBtn = card.querySelector('.btn-apply-tpl');
    const tplKey = card.getAttribute('data-template');

    function apply() {
      templateCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const preset = PRESETS[tplKey];
      if (!preset) return;

      // Update Sliders
      setSliderVal('rangeMedium', 'valBoxMedium', preset.medium, 0, 100);
      setSliderVal('rangeHigh', 'valBoxHigh', preset.high, 0, 100);
      setSliderVal('rangeCritical', 'valBoxCritical', preset.critical, 0, 100);
      setSliderVal('rangeGlobalRate', 'valBoxGlobalRate', preset.globalRate, 10, 1000);
      setSliderVal('rangeBurstRate', 'valBoxBurstRate', preset.burstRate, 1, 100);

      // Update Mini Switches
      setSwitch('switchTokenVal', preset.tokenVal);
      setSwitch('switchBlockDevices', preset.blockDevices);
      setSwitch('switchMFA', preset.mfa);
      setSwitch('switchElevatedPerms', preset.elevatedPerms);

      recalculateActivePolicies();
      showToast(preset.title, preset.msg);
    }

    if (applyBtn) applyBtn.addEventListener('click', (e) => { e.stopPropagation(); apply(); });
    card.addEventListener('click', apply);
  });
}

function setSliderVal(rangeId, boxId, val, min, max) {
  const range = document.getElementById(rangeId);
  const box = document.getElementById(boxId);
  if (!range || !box) return;

  range.value = val;
  box.textContent = val;
  const pct = ((val - min) / (max - min)) * 100;
  range.style.setProperty('--fill-pct', `${pct.toFixed(1)}%`);
}

function setSwitch(switchId, state) {
  const sw = document.getElementById(switchId);
  if (!sw) return;
  if (state) sw.classList.add('active');
  else sw.classList.remove('active');
}

// ================= 6. POLICY OVERVIEW DONUT INTERACTIONS =================
function initDonutInteractions() {
  const segments = document.querySelectorAll('.donut-segment');
  const legendRows = document.querySelectorAll('.legend-row-pair');

  legendRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const cat = row.getAttribute('data-category');
      highlightSegment(cat);
    });

    row.addEventListener('mouseleave', () => {
      resetSegments();
    });
  });

  segments.forEach(seg => {
    seg.addEventListener('mouseenter', () => {
      seg.style.strokeWidth = '19';
      seg.style.filter = 'drop-shadow(0 0 10px currentColor)';
    });

    seg.addEventListener('mouseleave', () => {
      seg.style.strokeWidth = '15';
      seg.style.filter = '';
    });
  });

  function highlightSegment(cat) {
    const classMap = {
      'access': '.seg-green',
      'rate': '.seg-blue',
      'threat': '.seg-yellow',
      'endpoint': '.seg-red'
    };
    const target = document.querySelector(classMap[cat]);
    if (target) {
      target.style.strokeWidth = '19';
      target.style.filter = 'drop-shadow(0 0 12px currentColor)';
    }
  }

  function resetSegments() {
    segments.forEach(seg => {
      seg.style.strokeWidth = '15';
      seg.style.filter = '';
    });
  }
}

// ================= 7. SAVE BUTTON & TOAST =================
function initSaveButton() {
  const saveBtn = document.getElementById('btnSavePolicies');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', () => {
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = `
      <svg class="save-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      <span>Saving...</span>
    `;
    saveBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      saveBtn.innerHTML = `
        <svg class="save-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Saved!</span>
      `;
      saveBtn.style.background = '#10b981';
      saveBtn.style.borderColor = '#10b981';

      showToast('Policies Saved Successfully', 'All Zero-Trust security rules & thresholds are now active across gateways.');

      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
        saveBtn.style.borderColor = '';
        saveBtn.style.pointerEvents = 'auto';
      }, 1800);
    }, 600);
  });
}

function showToast(title, msg) {
  const toast = document.getElementById('policiesToast');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMsg');
  if (!toast) return;

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = msg;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ================= 8. CURSOR-FOLLOWING CIRCULAR SPOTLIGHTS =================
function initCursorSpotlights() {
  const cards = document.querySelectorAll('.policy-kpi-card, .policy-config-card, .policy-side-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ================= 9. BACKEND-READY NOTIFICATION HOOK =================
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

// ================= 10. CLOCK SYNC =================
function initLiveClockSync() {
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
