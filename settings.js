/**
 * ZERO-TRUST API SECURITY GATEWAY - SETTINGS INTERACTIVITY
 * Faithful reproduction of media_1791206974297.jpg
 * Features:
 *  - Subtle cursor-following spotlight on hover (non-blurry, crystal-clear text)
 *  - Interactive 6-tab navigation
 *  - Cyber green & blue toggle switches with tactile feedback
 *  - Real JSON file export & backup download simulation
 *  - Danger Zone confirmation modal with destructive action simulation
 *  - Backend-ready notification bell logic
 *  - Real-time sidebar clock sync & search filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpotlights();
  initTabNavigation();
  initToggleSwitches();
  initSaveButtons();
  initBackupAndExport();
  initDangerZoneModal();
  initNotificationBell();
  initSidebarClock();
  initGlobalSearch();
});

/* ================= 1. SUBTLE CURSOR-FOLLOWING SPOTLIGHT ================= */
function initSpotlights() {
  const cards = document.querySelectorAll('.settings-card');
  
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

/* ================= 2. 6-TAB NAVIGATION ================= */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.settings-tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tabId === 'general') {
        showToast('General Settings', 'Displaying core system & gateway parameters.');
      } else {
        const tabTitle = btn.querySelector('span')?.textContent || tabId;
        showToast(`${tabTitle} Tab`, `Viewing configuration panel for ${tabTitle}.`);
      }
    });
  });
}

/* ================= 3. TOGGLE SWITCHES ================= */
function initToggleSwitches() {
  const allToggles = document.querySelectorAll('.cyber-green-toggle, .cyber-blue-toggle');
  
  allToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      
      // Find associated label or parent row
      const parentRow = toggle.closest('.toggle-row-item, .notif-toggle-row, .data-field-pair');
      const labelText = parentRow?.querySelector('.toggle-name, .notif-toggle-title, .data-field-lbl')?.textContent || 'Setting';
      const isEnabled = toggle.classList.contains('active');
      
      showToast(
        isEnabled ? `${labelText} Enabled` : `${labelText} Disabled`,
        `Status updated to ${isEnabled ? 'Active' : 'Inactive'}.`,
        isEnabled ? 'success' : 'info'
      );
    });
  });
}

/* ================= 4. SAVE BUTTONS ================= */
function initSaveButtons() {
  const saveBtn = document.getElementById('btnSaveNotificationSettings');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const originalText = saveBtn.textContent;
      saveBtn.disabled = true;
      saveBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display:inline-block; vertical-align:middle; margin-right:4px;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg> Saving...
      `;
      saveBtn.style.opacity = '0.85';

      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `✓ Saved!`;
        saveBtn.style.background = '#10b981';
        saveBtn.style.borderColor = '#059669';

        showToast('Settings Saved', 'Notification thresholds and email preferences synchronized.');

        setTimeout(() => {
          saveBtn.textContent = originalText;
          saveBtn.style.background = '';
          saveBtn.style.borderColor = '';
          saveBtn.style.opacity = '';
        }, 1800);
      }, 700);
    });
  }
}

/* ================= 5. BACKUP & EXPORT SIMULATION ================= */
function initBackupAndExport() {
  const btnExportLogs = document.getElementById('btnExportLogs');
  const btnExportIncidents = document.getElementById('btnExportIncidents');
  const btnExportPolicies = document.getElementById('btnExportPolicies');
  const btnDownloadBackup = document.getElementById('btnDownloadBackup');

  function triggerDownload(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (btnExportLogs) {
    btnExportLogs.addEventListener('click', () => {
      const mockLogs = {
        exportedAt: new Date().toISOString(),
        totalCount: 128492,
        blockedCount: 1284,
        sampleEntries: [
          { timestamp: '2026-10-05T12:45:21Z', ip: '192.168.1.104', endpoint: '/api/v1/users', status: 200, action: 'ALLOW' },
          { timestamp: '2026-10-05T12:44:18Z', ip: '45.142.214.8', endpoint: '/api/v1/auth/login', status: 403, action: 'BLOCK_BRUTEFORCE' }
        ]
      };
      triggerDownload('zerotrust-logs-export.json', mockLogs);
      showToast('Export Completed', 'Downloaded zerotrust-logs-export.json');
    });
  }

  if (btnExportIncidents) {
    btnExportIncidents.addEventListener('click', () => {
      const mockIncidents = {
        exportedAt: new Date().toISOString(),
        activeIncidents: 4,
        criticalThreats: 1,
        recent: [
          { id: 'INC-2026-089', severity: 'CRITICAL', title: 'SQL Injection on /api/v1/query', status: 'MITIGATED' },
          { id: 'INC-2026-090', severity: 'HIGH', title: 'Credential Stuffing Botnet detected', status: 'BLOCKED' }
        ]
      };
      triggerDownload('zerotrust-incidents-export.json', mockIncidents);
      showToast('Export Completed', 'Downloaded zerotrust-incidents-export.json');
    });
  }

  if (btnExportPolicies) {
    btnExportPolicies.addEventListener('click', () => {
      const mockPolicies = {
        exportedAt: new Date().toISOString(),
        policiesCount: 14,
        rules: [
          { name: 'Rate Limiting Policy', maxRequestsPerMin: 150, burst: 30 },
          { name: 'Geo-Fencing Strict', blockedCountries: ['RU', 'KP', 'IR'] },
          { name: 'JWT Verification', alg: 'RS256', enforceExpiry: true }
        ]
      };
      triggerDownload('zerotrust-policies-export.json', mockPolicies);
      showToast('Export Completed', 'Downloaded zerotrust-policies-export.json');
    });
  }

  if (btnDownloadBackup) {
    btnDownloadBackup.addEventListener('click', () => {
      const backupData = {
        gatewayVersion: 'v1.0.0',
        environment: 'Production',
        backupTimestamp: new Date().toISOString(),
        systemConfig: {
          systemName: document.getElementById('cfgSystemName')?.value || 'Zero-Trust API Security Gateway',
          environment: document.getElementById('cfgEnvironment')?.value || 'Production',
          sessionTimeout: document.getElementById('cfgSessionTimeout')?.value || 60,
          apiBaseUrl: document.getElementById('cfgApiBaseUrl')?.value || 'https://api.yourdomain.com',
          wsUrl: document.getElementById('cfgWsUrl')?.value || 'wss://api.yourdomain.com/ws'
        },
        securitySettings: {
          realTimeMonitoring: true,
          blockUnknownDevices: true,
          mlAnomalyDetection: true,
          geolocationAnalysis: true,
          requestPatternAnalysis: true,
          automatedThreatResponse: true,
          detailedLogging: true
        }
      };
      triggerDownload(`zerotrust-backup-${Date.now()}.json`, backupData);
      showToast('System Backup Downloaded', 'Complete configuration exported securely.');
    });
  }
}

/* ================= 6. DANGER ZONE CONFIRMATION MODAL ================= */
function initDangerZoneModal() {
  const modal = document.getElementById('dangerModal');
  const btnClearLogs = document.getElementById('btnClearLogs');
  const btnResetDefault = document.getElementById('btnResetDefault');
  const btnCancel = document.getElementById('btnCancelModal');
  const btnConfirm = document.getElementById('btnConfirmModal');
  const modalTitle = document.getElementById('modalDangerTitle');
  const modalDesc = document.getElementById('modalDangerDesc');

  let currentAction = null;

  function openModal(title, desc, action) {
    if (!modal) return;
    currentAction = action;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    modal.classList.add('open');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    currentAction = null;
  }

  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', () => {
      openModal(
        'Clear All Security Logs?',
        'This will permanently purge all 128,492 historical logs and telemetry events from storage. This operation CANNOT be reversed.',
        'clear-logs'
      );
    });
  }

  if (btnResetDefault) {
    btnResetDefault.addEventListener('click', () => {
      openModal(
        'Reset Gateway to Default Values?',
        'All custom policies, notification thresholds, API route safeguards, and session timeouts will revert to initial factory state.',
        'reset-default'
      );
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      if (currentAction === 'clear-logs') {
        showToast('Logs Purged', 'All system logs have been permanently erased.', 'error');
      } else if (currentAction === 'reset-default') {
        showToast('Settings Reset', 'Configuration restored to default factory values.', 'error');
        // Reset inputs to default values
        const sysInput = document.getElementById('cfgSystemName');
        if (sysInput) sysInput.value = 'Zero-Trust API Security Gateway';
        const envSelect = document.getElementById('cfgEnvironment');
        if (envSelect) envSelect.value = 'Production';
        const timeoutInput = document.getElementById('cfgSessionTimeout');
        if (timeoutInput) timeoutInput.value = '60';
      }
      closeModal();
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ================= 7. BACKEND-READY NOTIFICATION BELL ================= */
function initNotificationBell() {
  const notifBtn = document.getElementById('notificationBtn');
  const countBadge = document.getElementById('notificationCount');
  
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      if (countBadge) {
        let currentCount = parseInt(countBadge.textContent) || 0;
        if (currentCount > 0) {
          countBadge.textContent = '0';
          countBadge.setAttribute('data-count', '0');
          countBadge.style.display = 'none';
          showToast('Notifications Cleared', 'All 3 security notifications marked as read.');
        } else {
          countBadge.textContent = '3';
          countBadge.setAttribute('data-count', '3');
          countBadge.style.display = 'flex';
          showToast('3 New Security Alerts', 'Critical alert threshold and policy updates pending review.');
        }
      }
    });
  }
}

/* ================= 8. REAL-TIME CLOCK SYNC ================= */
function initSidebarClock() {
  const clockEl = document.getElementById('sidebarClockTime');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    
    clockEl.textContent = `${month} ${day}, ${year} ${hrs}:${mins}:${secs}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ================= 9. GLOBAL SEARCH FILTER ================= */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const searchableItems = document.querySelectorAll(
      '.toggle-row-item, .notif-toggle-row, .data-field-pair, .kv-row, .activity-event-item, .btn-export-item'
    );

    if (!query) {
      searchableItems.forEach(item => {
        item.style.opacity = '1';
        item.style.background = '';
      });
      return;
    }

    searchableItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.opacity = '1';
        item.style.background = 'rgba(56, 189, 248, 0.12)';
      } else {
        item.style.opacity = '0.3';
        item.style.background = '';
      }
    });
  });
}

/* ================= 10. TOAST NOTIFICATION UTILITY ================= */
let toastTimeout = null;

function showToast(title, message, type = 'success') {
  const toast = document.getElementById('settingsToast');
  const toastTitle = document.getElementById('settingsToastTitle');
  const toastMsg = document.getElementById('settingsToastMsg');

  if (!toast || !toastTitle || !toastMsg) return;

  toastTitle.textContent = title;
  toastMsg.textContent = message;

  if (type === 'error') {
    toast.classList.add('toast-error');
  } else {
    toast.classList.remove('toast-error');
  }

  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
