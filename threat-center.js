// =================================================================
// ZERO-TRUST API SECURITY GATEWAY - THREAT CENTER SCRIPT
// Powers hover auto-inspection, circular SVG gauge, tabs, and filters
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  initThreatSparklines();
  initThreatTableInteractions();
  initThreatTabs();
  initThreatFilters();
  initThreatSearch();
  initThreatTimePicker();
  initCircularGaugeInteractions();
  initNotificationButton();
  initClockSync();
});

// ================= 1. THREAT REPOSITORY =================
const THREATS_DATA = {
  'THR-10923': {
    id: 'THR-10923',
    reqId: 'REQ-10923',
    time: '12:58:25',
    timestamp: '2026-10-05 12:58:25',
    threatType: 'Credential Compromise',
    subTitle: 'Suspicious account activity detected',
    user: 'X92',
    endpoint: 'GET /api/admin/users',
    ip: '103.21.XX.XX',
    device: 'Unknown iPhone',
    location: 'London, UK 🇬🇧',
    riskScore: 94,
    status: 'BLOCKED',
    severity: 'CRITICAL',
    forensics: {
      tls: 'TLS 1.3 • AES_256_GCM (Cipher 0x1302)',
      asn: 'AS13335 (Cloudflare London Edge)',
      policy: 'Rule #ZTP-402 • Admin Geofence Violation',
      latency: '1.2ms • Inline WAF Filter'
    },
    factors: [
      { name: 'Unknown Device', sub: 'Device not recognized from history', points: '+18', detail: 'Hardware UUID has no enrolled enterprise MDM profile. Device signature was never registered in corporate inventory.' },
      { name: 'Location Anomaly', sub: 'New location detected (London, UK)', points: '+20', detail: 'Request originated from London, UK. Account was actively authenticated in Mumbai, India 42 minutes ago (Impossible Travel: 10,400 km/h).' },
      { name: 'Abnormal Request Frequency', sub: 'Unusually high number of requests', points: '+24', detail: 'Observed burst velocity of 48 req/s against administrative routes. Exceeds standard authorized baseline (≤ 5 req/s) by 9.6x.' },
      { name: 'Sensitive Endpoint', sub: 'Accessing admin endpoint', points: '+20', detail: 'Route handles administrative privileges, RBAC roles, and credential modification. Protected under Zero-Trust Level 4 isolation.' },
      { name: 'Behaviour Anomaly (ML Model)', sub: 'Unusual user behaviour pattern', points: '+12', detail: 'Isolation Forest behavioural biometrics model reported anomaly entropy score 0.94 (divergence threshold: 0.70).' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'HTTP 403 Forbidden dispatched synchronously in 0.8ms.' },
      { text: 'User session flagged for monitoring', log: 'OAuth bearer token revoked across edge gateways. Forced 2FA challenge triggered.' },
      { text: 'Security incident created', log: 'Automated ticket INC-2026-9912 logged to enterprise SIEM cluster.' },
      { text: 'Alert sent to admin', log: 'Urgent SOC telemetry pushed to Slack #security-alerts and PagerDuty.' },
      { text: 'IP added to watchlist', log: '103.21.XX.XX quarantined in perimeter rate limit table for 24 hours.' }
    ]
  },
  'THR-10922': {
    id: 'THR-10922',
    reqId: 'REQ-10922',
    time: '12:51:10',
    timestamp: '2026-10-05 12:51:10',
    threatType: 'API Abuse',
    subTitle: 'Abnormal request surge & automated endpoint crawling',
    user: 'Unknown',
    endpoint: '/api/login',
    ip: '185.220.101.5',
    device: 'Unknown',
    location: 'Russia 🇷🇺',
    riskScore: 89,
    status: 'BLOCKED',
    severity: 'CRITICAL',
    forensics: {
      tls: 'TLS 1.2 • Scripted OpenSSL Client',
      asn: 'AS200651 (Tor Exit Relay Node)',
      policy: 'Rule #ZTP-409 • Automated Script Defense',
      latency: '1.1ms • WAF Drop Injected'
    },
    factors: [
      { name: 'Tor Exit Node Match', sub: 'Known anonymity relay IP', points: '+35', detail: 'IP confirmed on Tor project active relay database.' },
      { name: 'Credential Stuffing Pattern', sub: 'Rapid username cycling', points: '+32', detail: '120 distinct username attempts detected in 60s.' },
      { name: 'Headless Browser Profile', sub: 'Missing standard canvas headers', points: '+22', detail: 'Zero WebGL context or modern browser sec-ch-ua signature.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'Connection severed with TCP RST packet.' },
      { text: 'IP added to perimeter drop table', log: 'Banned in cloud edge firewall for 7 days.' },
      { text: 'Security incident created', log: 'INC-2026-9908 filed to SIEM auth-failure index.' },
      { text: 'Alert sent to admin', log: 'SOC Slack notification broadcasted.' }
    ]
  },
  'THR-10921': {
    id: 'THR-10921',
    reqId: 'REQ-10921',
    time: '12:45:33',
    timestamp: '2026-10-05 12:45:33',
    threatType: 'Privilege Misuse',
    subTitle: 'Unauthorized horizontal role elevation attempt',
    user: 'Amit',
    endpoint: '/api/users',
    ip: '49.36.19.102',
    device: 'Chrome',
    location: 'India 🇮🇳',
    riskScore: 81,
    status: 'BLOCKED',
    severity: 'CRITICAL',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS55836 (Reliance Jio Infocomm)',
      policy: 'Rule #ZTP-210 • RBAC Strict Scoping',
      latency: '1.4ms • Auth Matrix Reject'
    },
    factors: [
      { name: 'Role Permission Mismatch', sub: 'User role lacks superuser scope', points: '+38', detail: 'Standard user token attempted to execute admin user deletion.' },
      { name: 'Bypassed UI Flow', sub: 'Direct REST API invocation', points: '+25', detail: 'Request origin header differed from frontend client domain.' },
      { name: 'Multiple Sensitive Accesses', sub: 'Accessing user directory', points: '+18', detail: '4th restricted query within 5 minutes.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'Dispatched HTTP 403 Forbidden.' },
      { text: 'User session flagged for monitoring', log: 'User Amit marked for internal audit.' },
      { text: 'Security incident created', log: 'INC-2026-9892 generated.' }
    ]
  },
  'THR-10920': {
    id: 'THR-10920',
    reqId: 'REQ-10920',
    time: '12:40:12',
    timestamp: '2026-10-05 12:40:12',
    threatType: 'Brute Force',
    subTitle: 'Repeated authentication failures against single account',
    user: 'TestUser',
    endpoint: '/api/login',
    ip: '45.142.214.88',
    device: 'Windows',
    location: 'USA 🇺🇸',
    riskScore: 76,
    status: 'BLOCKED',
    severity: 'HIGH',
    forensics: {
      tls: 'TLS 1.2 • OpenSSL CLI Probe',
      asn: 'AS40065 (Hosting Subnet)',
      policy: 'Rule #ZTP-302 • Auth Brute Force Prevention',
      latency: '0.9ms • Cooldown Enforced'
    },
    factors: [
      { name: 'Excessive Failed Passwords', sub: '12 failed attempts in 2m', points: '+34', detail: 'Password threshold exceeded for account TestUser.' },
      { name: 'Non-Residential IP', sub: 'Cloud VPS origin detected', points: '+24', detail: 'IP resolved to data center hosting infrastructure.' },
      { name: 'Missing CSRF Token', sub: 'No valid cross-site token', points: '+18', detail: 'Header X-CSRF-Token was omitted.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'Dispatched HTTP 429 Too Many Requests.' },
      { text: 'Target account locked', log: '15-minute security lock applied.' },
      { text: 'IP added to watchlist', log: 'Added to temporary 60m quarantine.' }
    ]
  },
  'THR-10919': {
    id: 'THR-10919',
    reqId: 'REQ-10919',
    time: '12:32:15',
    timestamp: '2026-10-05 12:32:15',
    threatType: 'Data Exfiltration',
    subTitle: 'Bulk record download requested outside working hours',
    user: 'Ravi',
    endpoint: '/api/export',
    ip: '106.51.72.44',
    device: 'Android',
    location: 'India 🇮🇳',
    riskScore: 71,
    status: 'BLOCKED',
    severity: 'HIGH',
    forensics: {
      tls: 'TLS 1.3 • ChaCha20_Poly1305',
      asn: 'AS45609 (ACT Fibernet)',
      policy: 'Rule #ZTP-350 • Data Loss Prevention (DLP)',
      latency: '1.8ms • DLP Engine Intercept'
    },
    factors: [
      { name: 'Mass Export Query', sub: 'Query requested 50,000 PII records', points: '+35', detail: 'DLP limit is set to max 500 records per export.' },
      { name: 'Off-Hours Anomaly', sub: 'Unusual query timing (after hours)', points: '+22', detail: 'User baseline exports occur between 09:00 - 18:00 IST.' },
      { name: 'Encrypted Zip Container', sub: 'Compressed export targeted', points: '+14', detail: 'Target format bypasses standard plaintext logging.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'DLP filter aborted data transfer.' },
      { text: 'Security incident created', log: 'INC-2026-9874 flagged for compliance review.' },
      { text: 'Alert sent to admin', log: 'DLP violation sent to Chief Security Officer.' }
    ]
  },
  'THR-10918': {
    id: 'THR-10918',
    reqId: 'REQ-10918',
    time: '12:28:41',
    timestamp: '2026-10-05 12:28:41',
    threatType: 'Unusual Location',
    subTitle: 'Foreign IP login attempt on executive account',
    user: 'Sneha',
    endpoint: '/api/profile',
    ip: '194.26.29.112',
    device: 'Chrome',
    location: 'Germany 🇩🇪',
    riskScore: 68,
    status: 'BLOCKED',
    severity: 'HIGH',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS24940 (Hetzner Online)',
      policy: 'Rule #ZTP-205 • Geo-Fencing Enforce',
      latency: '0.7ms • Geo Reject'
    },
    factors: [
      { name: 'Unregistered Country', sub: 'Germany origin not on travel list', points: '+32', detail: 'User has no approved international travel notice on record.' },
      { name: 'VPN Exit Detected', sub: 'Commercial VPN IP match', points: '+24', detail: 'IP belongs to recognized privacy proxy server.' },
      { name: 'Device Fingerprint New', sub: 'Unrecognized browser cookies', points: '+12', detail: 'Zero matching cookies from prior sessions.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'Geofence rule triggered 403.' },
      { text: 'User session flagged for monitoring', log: 'Out-of-band email verification sent.' }
    ]
  },
  'THR-10917': {
    id: 'THR-10917',
    reqId: 'REQ-10917',
    time: '12:15:20',
    timestamp: '2026-10-05 12:15:20',
    threatType: 'Rate Limit Violation',
    subTitle: 'High frequency order placement rate breach',
    user: 'Karan',
    endpoint: '/api/orders',
    ip: '115.99.182.33',
    device: 'Android',
    location: 'India 🇮🇳',
    riskScore: 62,
    status: 'LIMITED',
    severity: 'HIGH',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS24560 (Airtel Broadband)',
      policy: 'Rule #ZTP-301 • Leaky Bucket Limiter',
      latency: '0.5ms • Throttle Active'
    },
    factors: [
      { name: 'Velocity Threshold Surge', sub: '24 req/s (max permitted: 5 req/s)', points: '+30', detail: 'Automated rapid clicks detected on order confirmation.' },
      { name: 'Simultaneous Threads', sub: '6 concurrent TCP connections', points: '+20', detail: 'Multiple connections from single client identity.' },
      { name: 'Retry After Disregarded', sub: 'Ignored initial 429 warning', points: '+12', detail: 'Client continued hammering endpoint during cooldown.' }
    ],
    responses: [
      { text: 'Rate limit applied (HTTP 429)', log: 'Enforced 30-second backoff penalty.' },
      { text: 'User session throttled', log: 'Token bandwidth restricted to 1 req/s.' }
    ]
  },
  'THR-10916': {
    id: 'THR-10916',
    reqId: 'REQ-10916',
    time: '12:12:11',
    timestamp: '2026-10-05 12:12:11',
    threatType: 'Suspicious Payload',
    subTitle: 'Obfuscated base64 script injection in query string',
    user: 'Unknown',
    endpoint: '/api/search',
    ip: '103.253.144.10',
    device: 'Unknown',
    location: 'Singapore 🇸🇬',
    riskScore: 58,
    status: 'BLOCKED',
    severity: 'MEDIUM',
    forensics: {
      tls: 'TLS 1.2 • OpenSSL Script',
      asn: 'AS13335 (Cloudflare Singapore)',
      policy: 'Rule #ZTP-415 • WAF Payload Detonation',
      latency: '1.5ms • Regex Filter Match'
    },
    factors: [
      { name: 'Malicious Query String', sub: 'Base64 eval() script detected', points: '+28', detail: 'Query parameter `q` contained encoded javascript payload.' },
      { name: 'Payload Size Anomaly', sub: 'Search param length > 2KB', points: '+18', detail: 'Search query exceeded normal character bounds.' },
      { name: 'Headless Agent', sub: 'No referer header supplied', points: '+12', detail: 'Automated vulnerability scanner signature.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'WAF rule signature #415 dropped request.' },
      { text: 'Security incident created', log: 'Payload sample archived for analysis.' }
    ]
  },
  'THR-10915': {
    id: 'THR-10915',
    reqId: 'REQ-10915',
    time: '12:08:09',
    timestamp: '2026-10-05 12:08:09',
    threatType: 'Malicious Request',
    subTitle: 'Executable MIME-type upload disguised as PNG image',
    user: 'Pooja',
    endpoint: '/api/upload',
    ip: '103.88.22.9',
    device: 'iPhone',
    location: 'India 🇮🇳',
    riskScore: 54,
    status: 'LIMITED',
    severity: 'MEDIUM',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS55836 (Jio Infocomm)',
      policy: 'Rule #ZTP-310 • File Magic-Bytes Inspection',
      latency: '2.1ms • Sandbox Detonated'
    },
    factors: [
      { name: 'Magic Bytes Mismatch', sub: 'PE executable header in .png file', points: '+26', detail: 'First 4 bytes matched MZ DOS executable header.' },
      { name: 'Double Extension Pattern', sub: 'Filename `photo.png.exe`', points: '+18', detail: 'Classic evasion technique detected by parser.' },
      { name: 'Unverified Signature', sub: 'Code signature absent', points: '+10', detail: 'Payload failed integrity check.' }
    ],
    responses: [
      { text: 'Upload quarantined in sandbox', log: 'File moved to isolation chamber.' },
      { text: 'User session flagged for monitoring', log: 'Subsequent uploads require manual review.' }
    ]
  },
  'THR-10914': {
    id: 'THR-10914',
    reqId: 'REQ-10914',
    time: '12:01:44',
    timestamp: '2026-10-05 12:01:44',
    threatType: 'Anomalous Behaviour',
    subTitle: 'Navigation speed exceeds typical human interaction',
    user: 'Rohit',
    endpoint: '/api/profile',
    ip: '122.179.33.64',
    device: 'Chrome',
    location: 'India 🇮🇳',
    riskScore: 49,
    status: 'ALLOWED',
    severity: 'MEDIUM',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS24560 (Bharti Airtel)',
      policy: 'Rule #ZTP-120 • ML Behaviour Baseline',
      latency: '0.9ms • Monitored Mode'
    },
    factors: [
      { name: 'Sub-second Page Transitions', sub: '40ms between deep API calls', points: '+25', detail: 'Possible client-side automated browser extension.' },
      { name: 'Linear Mouse Velocity', sub: 'Zero micro-jitter in mouse telemetry', points: '+14', detail: 'Biometrics diverge slightly from human baseline.' },
      { name: 'Known Token Valid', sub: 'Valid credentials provided', points: '+10', detail: 'User passed MFA earlier in session.' }
    ],
    responses: [
      { text: 'Request allowed under surveillance', log: 'Granted with elevated telemetry sampling.' },
      { text: 'Silent re-captcha challenge queued', log: 'Next sensitive action will trigger CAPTCHA.' }
    ]
  },
  'THR-10913': {
    id: 'THR-10913',
    reqId: 'REQ-10913',
    time: '11:58:23',
    timestamp: '2026-10-05 11:58:23',
    threatType: 'SQL Injection Attempt',
    subTitle: 'Boolean-based blind SQLi vector in auth parameter',
    user: 'Unknown',
    endpoint: '/api/login',
    ip: '177.12.89.44',
    device: 'Unknown',
    location: 'Brazil 🇧🇷',
    riskScore: 43,
    status: 'BLOCKED',
    severity: 'MEDIUM',
    forensics: {
      tls: 'TLS 1.2 • Script Client',
      asn: 'AS28573 (Claro Brasil)',
      policy: 'Rule #ZTP-400 • SQL Injection Filter',
      latency: '0.6ms • AST Sanitizer Drop'
    },
    factors: [
      { name: 'SQL Syntax Injected', sub: 'Detected `\' OR 1=1 --` token', points: '+22', detail: 'Lexical analysis identified SQL comment delimiter.' },
      { name: 'Anonymous Proxy Origin', sub: 'Known proxy IP', points: '+14', detail: 'IP listed on open proxy list.' },
      { name: 'High Failure Rate', sub: 'Repeated malformed requests', points: '+7', detail: '5th syntactic error in 10 seconds.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'AST parser sanitized parameter and dropped request.' },
      { text: 'IP added to perimeter drop table', log: 'Blocked for 12 hours.' }
    ]
  },
  'THR-10912': {
    id: 'THR-10912',
    reqId: 'REQ-10912',
    time: '11:52:10',
    timestamp: '2026-10-05 11:52:10',
    threatType: 'Reconnaissance',
    subTitle: 'Automated health endpoint probing by external monitor',
    user: 'Unknown',
    endpoint: '/api/health',
    ip: '54.210.12.98',
    device: 'Unknown',
    location: 'USA 🇺🇸',
    riskScore: 37,
    status: 'ALLOWED',
    severity: 'LOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS14618 (Amazon.com)',
      policy: 'Rule #ZTP-050 • Public Health Probe',
      latency: '0.4ms • Ping Allowed'
    },
    factors: [
      { name: 'Periodic Polling', sub: 'Exact 30s interval observed', points: '+20', detail: 'Signature matches standard uptime monitoring daemon.' },
      { name: 'Cloud Provider Subnet', sub: 'AWS us-east-1 origin', points: '+12', detail: 'Origin is a standard cloud hosting provider.' },
      { name: 'Safe Read Route', sub: 'Public /api/health endpoint', points: '+5', detail: 'Zero data risk associated with route.' }
    ],
    responses: [
      { text: 'Request allowed', log: 'Returned HTTP 200 { status: "UP" }.' }
    ]
  },
  'THR-10911': {
    id: 'THR-10911',
    reqId: 'REQ-10911',
    time: '11:45:58',
    timestamp: '2026-10-05 11:45:58',
    threatType: 'Automated Bot',
    subTitle: 'Commercial price scraper robot scraping catalog',
    user: 'Bot-21',
    endpoint: '/api/products',
    ip: '117.211.30.5',
    device: 'Unknown',
    location: 'India 🇮🇳',
    riskScore: 28,
    status: 'ALLOWED',
    severity: 'LOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS9829 (BSNL Network)',
      policy: 'Rule #ZTP-080 • Bot Management (Tagged)',
      latency: '0.7ms • Edge Tagged'
    },
    factors: [
      { name: 'Bot Signature Matched', sub: 'Bot user-agent identified', points: '+15', detail: 'User agent matches commercial price comparison aggregator.' },
      { name: 'Repetitive Sequence', sub: 'Sequential SKU catalog query', points: '+8', detail: 'Iterating product IDs in ascending sequence.' },
      { name: 'Safe Public Endpoint', sub: 'Catalog data only', points: '+5', detail: 'Public pricing data without sensitive PII.' }
    ],
    responses: [
      { text: 'Request allowed with bot tag', log: 'Logged in analytics bot stream.' }
    ]
  },
  'THR-10910': {
    id: 'THR-10910',
    reqId: 'REQ-10910',
    time: '11:38:27',
    timestamp: '2026-10-05 11:38:27',
    threatType: 'Directory Traversal',
    subTitle: 'Path traversal token `../` detected in filename parameter',
    user: 'Unknown',
    endpoint: '/api/download',
    ip: '88.198.44.12',
    device: 'Unknown',
    location: 'Germany 🇩🇪',
    riskScore: 22,
    status: 'BLOCKED',
    severity: 'LOW',
    forensics: {
      tls: 'TLS 1.2 • Scripted Probe',
      asn: 'AS24940 (Hetzner Online)',
      policy: 'Rule #ZTP-420 • File Path Sanitizer',
      latency: '0.5ms • Traversal Filter'
    },
    factors: [
      { name: 'Traversal Sequence Match', sub: 'Detected `../../etc/passwd` pattern', points: '+14', detail: 'File download controller stopped traversal sequence.' },
      { name: 'Zero Auth Provided', sub: 'Unauthenticated download probe', points: '+8', detail: 'Public request lacked authorization header.' }
    ],
    responses: [
      { text: 'Request blocked by security policy', log: 'Path traversal neutralized.' }
    ]
  },
  'THR-10909': {
    id: 'THR-10909',
    reqId: 'REQ-10909',
    time: '11:32:11',
    timestamp: '2026-10-05 11:32:11',
    threatType: 'XSS Attempt',
    subTitle: 'Inline SVG script tag neutralized in comment body',
    user: 'Unknown',
    endpoint: '/api/comment',
    ip: '103.22.140.7',
    device: 'Unknown',
    location: 'India 🇮🇳',
    riskScore: 18,
    status: 'ALLOWED',
    severity: 'LOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      asn: 'AS133612 (Vi Enterprise)',
      policy: 'Rule #ZTP-430 • HTML Sanitization Pipe',
      latency: '0.8ms • Sanitized & Passed'
    },
    factors: [
      { name: 'XSS Payload Neutralized', sub: 'Detected `<svg onload=alert()>`', points: '+12', detail: 'DOMPurify sanitizer stripped malicious handler.' },
      { name: 'Clean Session Environment', sub: 'Standard browser client', points: '+6', detail: 'User agent matches regular Chrome browser.' }
    ],
    responses: [
      { text: 'Payload sanitized and permitted', log: 'Comment stored after XSS removal.' }
    ]
  }
};

// ================= 2. TABLE ROW INTERACTION (HOVER + CLICK) =================
let lockedThreatId = 'THR-10923';

function initThreatTableInteractions() {
  const tableBody = document.getElementById('threatTableBody');
  const inspector = document.getElementById('threatInspector');
  const closeBtn = document.getElementById('closeThreatBtn');

  if (!tableBody) return;

  // 1. HOVER AUTO-INSPECTION: Hovering over any threat immediately previews details!
  tableBody.addEventListener('mouseover', (e) => {
    const row = e.target.closest('.threat-row');
    if (!row) return;

    const id = row.getAttribute('data-id');
    const data = THREATS_DATA[id];
    if (!data) return;

    if (inspector && inspector.classList.contains('collapsed')) {
      inspector.classList.remove('collapsed');
    }

    document.querySelectorAll('.threat-row').forEach(r => r.classList.remove('hover-previewing'));
    row.classList.add('hover-previewing');

    updateThreatInspector(data);
  });

  tableBody.addEventListener('mouseleave', () => {
    document.querySelectorAll('.threat-row').forEach(r => r.classList.remove('hover-previewing'));
    if (lockedThreatId && THREATS_DATA[lockedThreatId]) {
      updateThreatInspector(THREATS_DATA[lockedThreatId]);
      highlightLockedThreat(lockedThreatId);
    }
  });

  // 2. CLICK: Lock & Pin selection
  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('.threat-row');
    if (!row) return;

    const id = row.getAttribute('data-id');
    const data = THREATS_DATA[id];
    if (!data) return;

    lockedThreatId = id;
    highlightLockedThreat(id);

    if (inspector) {
      inspector.classList.remove('collapsed');
    }

    updateThreatInspector(data);
  });

  if (closeBtn && inspector) {
    closeBtn.addEventListener('click', () => {
      inspector.classList.add('collapsed');
    });
  }
}

function highlightLockedThreat(id) {
  document.querySelectorAll('.threat-row').forEach(r => {
    r.classList.remove('selected-threat');
    const timeCell = r.querySelector('.col-time');
    if (timeCell) timeCell.classList.remove('cell-red');
  });

  const row = document.querySelector(`.threat-row[data-id="${id}"]`);
  if (!row) return;

  row.classList.add('selected-threat');
  const timeCell = row.querySelector('.col-time');
  const data = THREATS_DATA[id];
  if (data && data.status === 'BLOCKED' && timeCell) {
    timeCell.classList.add('cell-red');
  }
}

// Update the Inspector Panel DOM (Circular Gauge, Properties, Factors, Responses)
function updateThreatInspector(data) {
  const inspector = document.getElementById('threatInspector');
  if (inspector) {
    inspector.classList.remove('inspector-pulse');
    void inspector.offsetWidth;
    inspector.classList.add('inspector-pulse');
  }

  // Header
  const title = document.getElementById('threatTitle');
  const sub = document.getElementById('threatSub');
  const sevBadge = document.getElementById('threatSevBadge');

  if (title) title.textContent = data.threatType;
  if (sub) sub.textContent = data.subTitle;
  if (sevBadge) {
    sevBadge.textContent = data.severity;
    sevBadge.className = 'badge-critical-pill';
    if (data.severity === 'HIGH') sevBadge.style.background = '#f97316';
    else if (data.severity === 'MEDIUM') sevBadge.style.background = '#eab308';
    else if (data.severity === 'LOW') sevBadge.style.background = '#10b981';
    else sevBadge.style.background = '#ef4444';
  }

  // Circular Gauge & Ratios
  const gaugeNum = document.getElementById('gaugeNum');
  const gaugeCenterNum = document.getElementById('gaugeCenterNum');
  const gaugeArc = document.getElementById('gaugeArc');
  const gaugeBottomPill = document.getElementById('gaugeBottomPill');

  if (gaugeNum) gaugeNum.textContent = data.riskScore;
  if (gaugeCenterNum) gaugeCenterNum.textContent = data.riskScore;
  if (gaugeBottomPill) {
    gaugeBottomPill.textContent = data.severity;
    if (data.severity === 'HIGH') gaugeBottomPill.style.background = '#f97316';
    else if (data.severity === 'MEDIUM') gaugeBottomPill.style.background = '#eab308';
    else if (data.severity === 'LOW') gaugeBottomPill.style.background = '#10b981';
    else gaugeBottomPill.style.background = '#ef4444';
  }

  // Calculate SVG arc stroke offset (circumference ~ 301.6)
  const gaugeContainer = document.querySelector('.circular-gauge-container');
  let activeGaugeColor = '#ef4444';
  let activeGaugeGlow = 'rgba(239, 68, 68, 0.6)';

  if (data.riskScore >= 80) {
    activeGaugeColor = '#ef4444';
    activeGaugeGlow = 'rgba(239, 68, 68, 0.6)';
  } else if (data.riskScore >= 60) {
    activeGaugeColor = '#f97316';
    activeGaugeGlow = 'rgba(249, 115, 22, 0.6)';
  } else if (data.riskScore >= 40) {
    activeGaugeColor = '#eab308';
    activeGaugeGlow = 'rgba(234, 179, 8, 0.6)';
  } else {
    activeGaugeColor = '#10b981';
    activeGaugeGlow = 'rgba(16, 185, 129, 0.6)';
  }

  if (gaugeContainer) {
    gaugeContainer.style.setProperty('--gauge-color', activeGaugeColor);
    gaugeContainer.style.setProperty('--gauge-glow', activeGaugeGlow);
  }

  if (gaugeArc) {
    const circumference = 301.6;
    const progress = data.riskScore / 100;
    const offset = circumference * (1 - progress);
    gaugeArc.style.strokeDashoffset = offset;
    gaugeArc.style.stroke = activeGaugeColor;
  }

  // Properties Box
  const propReqId = document.getElementById('propReqId');
  const propTimestamp = document.getElementById('propTimestamp');
  const propUser = document.getElementById('propUser');
  const propEndpoint = document.getElementById('propEndpoint');
  const propIp = document.getElementById('propIp');
  const propDevice = document.getElementById('propDevice');
  const propLocation = document.getElementById('propLocation');
  const propStatus = document.getElementById('propStatus');

  if (propReqId) propReqId.textContent = data.reqId;
  if (propTimestamp) propTimestamp.textContent = data.timestamp;
  if (propUser) propUser.textContent = data.user;
  if (propEndpoint) propEndpoint.textContent = data.endpoint;
  if (propIp) propIp.textContent = data.ip;
  if (propDevice) propDevice.textContent = data.device;
  if (propLocation) propLocation.textContent = data.location;
  if (propStatus) {
    propStatus.textContent = data.status;
    propStatus.className = 'status-pill-sub';
    if (data.status === 'ALLOWED') propStatus.style.background = '#10b981';
    else if (data.status === 'LIMITED') propStatus.style.background = '#eab308';
    else propStatus.style.background = '#ef4444';
  }

  // Forensics Accordion
  const fTls = document.getElementById('fTls');
  const fAsn = document.getElementById('fAsn');
  const fPolicy = document.getElementById('fPolicy');
  const fLatency = document.getElementById('fLatency');

  if (data.forensics) {
    if (fTls) fTls.textContent = data.forensics.tls;
    if (fAsn) fAsn.textContent = data.forensics.asn;
    if (fPolicy) fPolicy.textContent = data.forensics.policy;
    if (fLatency) fLatency.textContent = data.forensics.latency;
  }

  // Detection Factors with Expandable Hover Drawers
  const factorsList = document.getElementById('threatFactorsList');
  const totalScoreVal = document.getElementById('totalScoreVal');

  if (totalScoreVal) {
    totalScoreVal.textContent = data.riskScore;
    if (data.riskScore >= 80) totalScoreVal.className = 'total-score-val red';
    else if (data.riskScore >= 60) totalScoreVal.className = 'total-score-val';
    else totalScoreVal.className = 'total-score-val';
  }

  if (factorsList && data.factors) {
    factorsList.innerHTML = '';
    data.factors.forEach(factor => {
      const row = document.createElement('div');
      row.className = 'factor-row factor-hoverable';
      row.innerHTML = `
        <div class="factor-main-line">
          <div class="factor-icon-wrap red">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="factor-texts">
            <span class="factor-name">${factor.name}</span>
            <span class="factor-sub">${factor.sub}</span>
          </div>
          <span class="factor-points red">${factor.points}</span>
        </div>
        <div class="factor-hover-drawer">
          <p class="factor-hover-info">${factor.detail || 'Zero-Trust anomaly engine inspection log.'}</p>
        </div>
      `;
      factorsList.appendChild(row);
    });
  }

  // System Responses with Expandable Hover Logs
  const responseList = document.getElementById('threatResponseList');
  if (responseList && data.responses) {
    responseList.innerHTML = '';
    data.responses.forEach(resp => {
      const item = document.createElement('li');
      item.className = 'response-row-item resp-hoverable';
      item.innerHTML = `
        <div class="resp-main-line">
          <span class="check-dot-green">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3.2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
          <span class="resp-text">${resp.text}</span>
        </div>
        <div class="resp-hover-drawer">
          <span class="resp-log-text">${resp.log || 'Synchronous firewall mitigation action applied.'}</span>
        </div>
      `;
      responseList.appendChild(item);
    });
  }
}

// ================= 3. TABS INTERACTION =================
function initThreatTabs() {
  const tabs = document.querySelectorAll('.threat-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// ================= 4. FILTER TOOLBAR =================
function initThreatFilters() {
  const filterPills = document.querySelectorAll('.threat-pill-select');

  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = pill.classList.contains('open');
      filterPills.forEach(p => p.classList.remove('open'));
      if (!isOpen) pill.classList.add('open');
    });

    const opts = pill.querySelectorAll('.pill-opt');
    opts.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        opts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        const val = opt.getAttribute('data-value');
        const label = pill.querySelector('.pill-label');
        if (label) label.textContent = opt.textContent;

        if (val !== 'all') pill.classList.add('active-filter');
        else pill.classList.remove('active-filter');

        pill.classList.remove('open');
        applyCombinedThreatFilters();
      });
    });
  });

  document.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('open'));
  });
}

// ================= 5. REAL-TIME SEARCH =================
function initThreatSearch() {
  const searchInput = document.getElementById('threatSearchInput');
  const globalSearch = document.getElementById('globalSearch');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyCombinedThreatFilters();
    });
  }

  if (globalSearch) {
    globalSearch.addEventListener('input', () => {
      if (searchInput) searchInput.value = globalSearch.value;
      applyCombinedThreatFilters();
    });
  }
}

function applyCombinedThreatFilters() {
  const searchVal = (document.getElementById('threatSearchInput')?.value || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#threatTableBody .threat-row');

  const activeType = document.querySelector('#filterTypeSelect .pill-opt.active')?.getAttribute('data-value') || 'all';
  const activeStatus = document.querySelector('#filterStatusSelect .pill-opt.active')?.getAttribute('data-value') || 'all';
  const activeSev = document.querySelector('#filterSeveritySelect .pill-opt.active')?.getAttribute('data-value') || 'all';

  let count = 0;

  rows.forEach(row => {
    const typeText = row.querySelector('.col-type')?.textContent.trim() || '';
    const userText = row.querySelector('.col-user')?.textContent.trim() || '';
    const endpointText = row.querySelector('.col-endpoint')?.textContent.trim() || '';
    const locationText = row.querySelector('.col-location')?.textContent.trim() || '';
    const statusText = row.querySelector('.col-status .status-badge')?.textContent.trim() || '';
    const riskNum = parseInt(row.querySelector('.col-risk .risk-badge')?.textContent.trim() || '0', 10);
    const timeText = row.querySelector('.col-time')?.textContent.trim() || '';

    const textCorpus = `${typeText} ${userText} ${endpointText} ${locationText} ${statusText} ${timeText}`.toLowerCase();
    const matchesSearch = !searchVal || textCorpus.includes(searchVal);
    const matchesType = activeType === 'all' || typeText.toLowerCase().includes(activeType.toLowerCase());
    const matchesStatus = activeStatus === 'all' || statusText.toUpperCase() === activeStatus.toUpperCase();

    let matchesSev = true;
    if (activeSev === 'critical') matchesSev = riskNum >= 80;
    else if (activeSev === 'high') matchesSev = riskNum >= 60 && riskNum < 80;
    else if (activeSev === 'medium') matchesSev = riskNum >= 40 && riskNum < 60;
    else if (activeSev === 'low') matchesSev = riskNum < 40;

    if (matchesSearch && matchesType && matchesStatus && matchesSev) {
      row.style.display = '';
      count++;
    } else {
      row.style.display = 'none';
    }
  });

  const countEl = document.getElementById('threatRecordsCount');
  if (countEl) {
    countEl.textContent = `Showing 1 - ${count} of 48 threats`;
  }
}

// ================= 6. TIME RANGE PICKER =================
function initThreatTimePicker() {
  const picker = document.getElementById('threatTimePicker');
  const btn = document.getElementById('threatTimeBtn');
  const label = document.getElementById('selectedThreatRange');
  const opts = picker?.querySelectorAll('.dropdown-opt');

  if (!picker || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
  });

  opts?.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (label) label.textContent = opt.textContent;
      picker.classList.remove('open');
    });
  });

  document.addEventListener('click', () => {
    picker.classList.remove('open');
  });
}

// ================= 7. CANVAS SPARKLINES =================
function initThreatSparklines() {
  // Critical (Red trend up)
  drawThreatSparkline('sparklineCritical', [10, 14, 18, 22, 28, 35, 42, 50], '#ef4444', 'rgba(239, 68, 68, 0.15)');

  // High (Orange trend up)
  drawThreatSparkline('sparklineHigh', [12, 16, 14, 20, 24, 22, 30, 36], '#f97316', 'rgba(249, 115, 22, 0.15)');

  // Medium (Yellow trend down)
  drawThreatSparkline('sparklineMedium', [45, 40, 42, 35, 30, 32, 25, 20], '#f59e0b', 'rgba(245, 158, 11, 0.15)');

  // Low (Green trend down)
  drawThreatSparkline('sparklineLow', [60, 55, 48, 42, 38, 30, 24, 16], '#10b981', 'rgba(16, 185, 129, 0.15)');
}

function drawThreatSparkline(canvasId, points, strokeColor, fillColor) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = 110;
  const h = 30;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);

  ctx.clearRect(0, 0, w, h);

  ctx.beginPath();
  points.forEach((val, idx) => {
    const x = idx * step;
    const y = h - ((val - min) / range) * (h - 8) - 4;
    if (idx === 0) ctx.moveTo(x, y);
    else {
      const prevX = (idx - 1) * step;
      const prevY = h - ((points[idx - 1] - min) / range) * (h - 8) - 4;
      const midX = (prevX + x) / 2;
      ctx.bezierCurveTo(midX, prevY, midX, y, x, y);
    }
  });

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 6;
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, fillColor);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fill();
}

// Clock
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

// 7. Interactive 3D Circular Tilt on Gauge (Strictly Contained Inside Box)
function initCircularGaugeInteractions() {
  const container = document.querySelector('.circular-gauge-container');
  if (!container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 6;
    const rotateY = (x / (rect.width / 2)) * 6;
    container.style.transform = `perspective(280px) scale(1.04) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    container.style.transform = '';
  });

  container.addEventListener('click', () => {
    container.style.transform = 'scale(0.97)';
    setTimeout(() => {
      container.style.transform = 'scale(1.04)';
    }, 120);
  });
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

