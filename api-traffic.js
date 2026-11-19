// =================================================================
// ZERO-TRUST API SECURITY GATEWAY - LIVE API TRAFFIC SCRIPT
// Powers deep hover inspection, forensic telemetry, filters & sparklines
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSparklines();
  initTableInteractions();
  initFilterDropdowns();
  initSearchFiltering();
  initTimeRangeSelector();
  initNotificationButton();
  initClockSync();
});

// ================= 1. COMPREHENSIVE FORENSIC REPOSITORY =================
const REQUESTS_DATA = {
  'REQ-10923': {
    id: 'REQ-10923',
    time: '12:58:31',
    timestamp: '2026-10-05 12:58:31.402 UTC',
    user: 'X92',
    ip: '103.21.XX.XX',
    endpoint: 'GET /api/admin/users',
    userAgent: 'Mozilla/5.0 (iPhone; iOS 17)',
    device: 'Unknown iPhone',
    location: 'London, UK 🇬🇧',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    action: 'BLOCK',
    forensics: {
      tls: 'TLS 1.3 • AES_256_GCM (Cipher 0x1302)',
      network: 'AS13335 (Cloudflare London Edge)',
      policy: 'ZTP-402 • Admin Strict Geofence',
      latency: '1.2ms • Inline WAF Inspection',
      mdm: 'UNENROLLED • Hardware UUID Mismatch'
    },
    riskFactors: [
      { 
        text: 'Unknown Device', 
        score: '+18', 
        type: 'red', 
        icon: 'hex',
        detail: 'Hardware UUID has no enrolled enterprise MDM profile. Device signature was never registered in corporate inventory.'
      },
      { 
        text: 'Location Anomaly (New Country)', 
        score: '+20', 
        type: 'red', 
        icon: 'hex',
        detail: 'Request originated from London, UK. Account was actively authenticated in Mumbai, India 42 minutes ago (Impossible Travel: 10,400 km/h).'
      },
      { 
        text: 'Abnormal Request Frequency', 
        score: '+24', 
        type: 'red', 
        icon: 'hex',
        detail: 'Observed burst velocity of 48 req/s against administrative routes. Exceeds standard authorized baseline (≤ 5 req/s) by 9.6x.'
      },
      { 
        text: 'Sensitive API Endpoint', 
        score: '+20', 
        type: 'red', 
        icon: 'slash',
        detail: 'Route handles administrative privileges, RBAC roles, and credential modification. Protected under Zero-Trust Level 4 isolation.'
      },
      { 
        text: 'Behaviour Anomaly (ML Model)', 
        score: '+12', 
        type: 'red', 
        icon: 'bolt',
        detail: 'Isolation Forest behavioural biometrics model reported anomaly entropy score 0.94 (divergence threshold: 0.70).'
      }
    ],
    systemResponses: [
      { text: 'Request blocked', detail: 'Dispatched HTTP 403 Forbidden with incident voucher REQ-10923 in 0.8ms.' },
      { text: 'Session flagged', detail: 'OAuth bearer token revoked across edge gateways. Forced re-authentication initiated.' },
      { text: 'Security incident created', detail: 'Automated ticket INC-2026-9912 logged to enterprise SIEM and Splunk clusters.' },
      { text: 'Alert sent to admin', detail: 'Urgent SOC telemetry pushed to Slack #security-alerts and on-call pager.' }
    ]
  },
  'REQ-10922': {
    id: 'REQ-10922',
    time: '12:58:28',
    timestamp: '2026-10-05 12:58:28.118 UTC',
    user: 'Rahul',
    ip: '122.161.45.89',
    endpoint: 'GET /api/profile',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)',
    device: 'Android',
    location: 'India 🇮🇳',
    riskScore: 12,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • ChaCha20_Poly1305',
      network: 'AS24560 (Bharti Airtel Enterprise)',
      policy: 'ZTP-101 • Verified User Profile Read',
      latency: '0.6ms • Edge Cache Served',
      mdm: 'COMPLIANT • Pixel 8 Enterprise Cert'
    },
    riskFactors: [
      { text: 'Registered Corporate Device', score: '+2', type: 'green', icon: 'check', detail: 'Valid cryptographic mTLS client certificate verified.' },
      { text: 'Verified Domestic Geo-IP', score: '+3', type: 'green', icon: 'check', detail: 'Geo-IP matches user historical working baseline location.' },
      { text: 'Standard Request Velocity', score: '+4', type: 'green', icon: 'check', detail: 'Rate interval 1.2 req/s is well within safe threshold.' },
      { text: 'Safe Profile Endpoint', score: '+3', type: 'green', icon: 'check', detail: 'Read-only profile payload with sanitized fields.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Access granted with standard session expiration.' },
      { text: 'Token validity verified', detail: 'Cryptographic signature and scope matched.' },
      { text: 'Session telemetry healthy', detail: 'Device posture scored 98/100 on zero-trust check.' },
      { text: 'Audit log recorded', detail: 'Telemetry archived in warm query storage.' }
    ]
  },
  'REQ-10921': {
    id: 'REQ-10921',
    time: '12:58:25',
    timestamp: '2026-10-05 12:58:25.882 UTC',
    user: 'Amit',
    ip: '49.36.19.102',
    endpoint: 'POST /api/orders',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Chrome/124.0)',
    device: 'Chrome',
    location: 'India 🇮🇳',
    riskScore: 28,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      network: 'AS55836 (Reliance Jio Infocomm)',
      policy: 'ZTP-204 • Standard Checkout Route',
      latency: '1.4ms • Schema Validated',
      mdm: 'REGISTERED • Windows 11 Corp PC'
    },
    riskFactors: [
      { text: 'Browser Fingerprint Matches', score: '+5', type: 'green', icon: 'check', detail: 'Canvas & AudioContext hash matched known profile.' },
      { text: 'Standard Order Payload Size', score: '+8', type: 'green', icon: 'check', detail: 'JSON payload size 1.8KB validated against OpenAPI schema.' },
      { text: 'Slight Request Interval Shift', score: '+15', type: 'green', icon: 'check', detail: 'Rapid consecutive checkout clicks detected (idempotent key applied).' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Transaction passed to Order Processing Bus.' },
      { text: 'Payload schema validated', detail: 'Zero SQLi/XSS attack vectors detected.' },
      { text: 'Order gateway routed', detail: 'Kafka event topic published in 2.1ms.' }
    ]
  },
  'REQ-10920': {
    id: 'REQ-10920',
    time: '12:58:21',
    timestamp: '2026-10-05 12:58:21.054 UTC',
    user: 'Ravi',
    ip: '106.51.72.44',
    endpoint: 'POST /api/payment',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Galaxy S23)',
    device: 'Android',
    location: 'India 🇮🇳',
    riskScore: 71,
    riskLevel: 'HIGH',
    action: 'LIMIT',
    forensics: {
      tls: 'TLS 1.2 • ECDHE_RSA_AES_256',
      network: 'AS45609 (ACT Fibernet Bangalore)',
      policy: 'ZTP-301 • Financial Fraud Rate Limit',
      latency: '0.9ms • Throttle Enforced',
      mdm: 'BYOD • Partial Security Policy'
    },
    riskFactors: [
      { text: 'High Payment Retry Rate', score: '+28', type: 'red', icon: 'hex', detail: '6 failed transaction attempts recorded within last 3 minutes.' },
      { text: 'Card Hash Token Mismatch', score: '+25', type: 'red', icon: 'slash', detail: 'Client token fingerprint differs from active billing profile.' },
      { text: 'Bursty Request Spike (18 req/s)', score: '+18', type: 'red', icon: 'bolt', detail: 'Payment endpoint burst threshold exceeded (max allowed: 3 req/s).' }
    ],
    systemResponses: [
      { text: 'Rate limit threshold applied', detail: 'HTTP 429 Too Many Requests sent with Retry-After: 60s.' },
      { text: 'Retry cooldown enforced', detail: 'Cooling timer activated for user session.' },
      { text: 'Payment fraud gate flagged', detail: '3D-Secure 2.0 biometric challenge mandated on next try.' },
      { text: 'Admin security notification sent', detail: 'Fraud anomaly alert logged in risk stream.' }
    ]
  },
  'REQ-10919': {
    id: 'REQ-10919',
    time: '12:58:18',
    timestamp: '2026-10-05 12:58:18.910 UTC',
    user: 'Sneha',
    ip: '157.34.120.18',
    endpoint: 'GET /api/products',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X; Chrome/123)',
    device: 'Chrome',
    location: 'India 🇮🇳',
    riskScore: 18,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      network: 'AS133612 (Vodafone Idea Limited)',
      policy: 'ZTP-100 • Public Catalog Read',
      latency: '0.4ms • Cloudflare Edge Hit',
      mdm: 'AUTHORIZED • macOS Enterprise Asset'
    },
    riskFactors: [
      { text: 'Known User Agent Profile', score: '+6', type: 'green', icon: 'check', detail: 'Matching macOS Sonoma fingerprint.' },
      { text: 'Catalog Read Endpoint', score: '+4', type: 'green', icon: 'check', detail: 'Low risk public catalog resource.' },
      { text: 'Cached CDN Response', score: '+8', type: 'green', icon: 'check', detail: 'Served from Mumbai edge POP cache.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Clean status 200 OK returned from edge.' },
      { text: 'Served from Edge CDN', detail: 'Zero origin server load incurred.' }
    ]
  },
  'REQ-10918': {
    id: 'REQ-10918',
    time: '12:58:15',
    timestamp: '2026-10-05 12:58:15.331 UTC',
    user: 'Unknown',
    ip: '185.220.101.5',
    endpoint: 'POST /api/login',
    userAgent: 'Python-requests/2.31.0',
    device: 'Unknown',
    location: 'Russia 🇷🇺',
    riskScore: 87,
    riskLevel: 'CRITICAL',
    action: 'BLOCK',
    forensics: {
      tls: 'TLS 1.2 • OpenSSL Script Client',
      network: 'AS200651 (Tor Exit Relay Node)',
      policy: 'ZTP-409 • Automated Script Defense',
      latency: '1.1ms • WAF Drop Injected',
      mdm: 'BLOCKED • Scripted Anomaly'
    },
    riskFactors: [
      { text: 'Known Tor Exit Node IP', score: '+35', type: 'red', icon: 'hex', detail: 'IP identified in active Tor directory and malicious reputation DB.' },
      { text: 'Credential Stuffing Signature', score: '+30', type: 'red', icon: 'slash', detail: 'Rotating username dictionary attack pattern matched.' },
      { text: 'Non-browser Automated Agent', score: '+22', type: 'red', icon: 'bolt', detail: 'Missing modern browser headers (sec-ch-ua, Accept-Language).' }
    ],
    systemResponses: [
      { text: 'Request blocked', detail: 'TCP connection dropped immediately with 403.' },
      { text: 'IP blacklisted in WAF', detail: 'Added to automated 24-hour firewall drop table.' },
      { text: 'Brute force mitigation triggered', detail: 'Account lock timer reset for targeted identities.' },
      { text: 'SOC telemetry incident filed', detail: 'Exported to SIEM watchlist.' }
    ]
  },
  'REQ-10917': {
    id: 'REQ-10917',
    time: '12:58:13',
    timestamp: '2026-10-05 12:58:13.204 UTC',
    user: 'Karan',
    ip: '115.99.182.33',
    endpoint: 'GET /api/cart',
    userAgent: 'Mozilla/5.0 (Linux; Android 14)',
    device: 'Android',
    location: 'India 🇮🇳',
    riskScore: 25,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      network: 'AS24560 (Airtel Broadband)',
      policy: 'ZTP-105 • Session Cart Read',
      latency: '0.7ms • In-Memory Redis Cache',
      mdm: 'KNOWN • User Mobile'
    },
    riskFactors: [
      { text: 'Valid Session Cookie', score: '+10', type: 'green', icon: 'check', detail: 'Encrypted HttpOnly cookie matches redis session store.' },
      { text: 'Standard Mobile Client', score: '+15', type: 'green', icon: 'check', detail: 'Clean Android client certificate.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Cart contents returned.' },
      { text: 'Cart payload synchronized', detail: 'Updated timestamp persisted.' }
    ]
  },
  'REQ-10916': {
    id: 'REQ-10916',
    time: '12:58:10',
    timestamp: '2026-10-05 12:58:10.741 UTC',
    user: 'Priya',
    ip: '182.74.20.91',
    endpoint: 'GET /api/profile',
    userAgent: 'Mozilla/5.0 (iPhone; iOS 17_4)',
    device: 'iPhone',
    location: 'India 🇮🇳',
    riskScore: 34,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_256_GCM',
      network: 'AS4755 (Tata Communications)',
      policy: 'ZTP-101 • Profile Sync',
      latency: '0.9ms • Secure Route',
      mdm: 'VERIFIED • Corporate iOS MDM'
    },
    riskFactors: [
      { text: 'Valid Device Certificate', score: '+14', type: 'green', icon: 'check', detail: 'Apple MDM identity verified via Apple SCEP.' },
      { text: 'Minor Clock Skew Observed', score: '+20', type: 'green', icon: 'check', detail: 'Client clock offset 4.2 seconds from NTP server.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Authorized under corporate profile policy.' },
      { text: 'Profile payload delivered', detail: 'Encrypted profile JSON sent.' }
    ]
  },
  'REQ-10915': {
    id: 'REQ-10915',
    time: '12:58:08',
    timestamp: '2026-10-05 12:58:08.520 UTC',
    user: 'TestUser',
    ip: '45.142.214.88',
    endpoint: 'GET /api/admin',
    userAgent: 'curl/7.88.1',
    device: 'Windows',
    location: 'USA 🇺🇸',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    action: 'BLOCK',
    forensics: {
      tls: 'TLS 1.2 • Generic OpenSSL CLI',
      network: 'AS40065 (Known Proxy Subnet)',
      policy: 'ZTP-500 • Strict Admin Path Quarantine',
      latency: '1.0ms • Fast Reject Injected',
      mdm: 'REJECTED • Unauthenticated CLI'
    },
    riskFactors: [
      { text: 'Direct Admin Path Probing', score: '+35', type: 'red', icon: 'slash', detail: 'Root `/api/admin` scanning with no active identity token.' },
      { text: 'Unauthorized CLI Probe', score: '+30', type: 'red', icon: 'hex', detail: 'User agent `curl` is banned from administrative endpoints.' },
      { text: 'Missing Zero-Trust Header', score: '+26', type: 'red', icon: 'bolt', detail: 'Zero-Trust mutual TLS client cert header missing entirely.' }
    ],
    systemResponses: [
      { text: 'Request blocked', detail: 'HTTP 401 Unauthorized dispatched with intrusion flag.' },
      { text: 'IP quarantined for 60m', detail: 'Subnet blocked in cloud perimeter ACL.' },
      { text: 'Threat alert sent to SOC', detail: 'Incident flagged as reconnaissance scanning.' }
    ]
  },
  'REQ-10914': {
    id: 'REQ-10914',
    time: '12:58:05',
    timestamp: '2026-10-05 12:58:05.105 UTC',
    user: 'Mohit',
    ip: '27.56.241.12',
    endpoint: 'POST /api/orders',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64)',
    device: 'Chrome',
    location: 'India 🇮🇳',
    riskScore: 22,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      network: 'AS55836 (Jio Broadband)',
      policy: 'ZTP-204 • Standard Checkout',
      latency: '1.3ms • Order DB',
      mdm: 'TRUSTED • Windows Hello Token'
    },
    riskFactors: [
      { text: 'Known User Session', score: '+12', type: 'green', icon: 'check', detail: 'Active 2FA session token present.' },
      { text: 'Signature Verified', score: '+10', type: 'green', icon: 'check', detail: 'Payload HMAC signature matches.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Order creation accepted.' },
      { text: 'Order routed to queue', detail: 'Dispatched to fulfillment microservice.' }
    ]
  },
  'REQ-10913': {
    id: 'REQ-10913',
    time: '12:58:02',
    timestamp: '2026-10-05 12:58:02.819 UTC',
    user: 'Neha',
    ip: '103.22.140.7',
    endpoint: 'GET /api/search',
    userAgent: 'Mozilla/5.0 (Linux; Android 12)',
    device: 'Android',
    location: 'India 🇮🇳',
    riskScore: 19,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      network: 'AS133612 (Vi Enterprise)',
      policy: 'ZTP-102 • Read Search',
      latency: '0.5ms • Elasticsearch Index',
      mdm: 'NORMAL • Clean Posture'
    },
    riskFactors: [
      { text: 'Clean Search Query Parameters', score: '+10', type: 'green', icon: 'check', detail: 'No SQL injection patterns or script tags.' },
      { text: 'Safe Latency Profile', score: '+9', type: 'green', icon: 'check', detail: 'Execution within normal distribution curve.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Query results returned.' },
      { text: 'Elasticsearch index queried', detail: '24 matching items fetched.' }
    ]
  },
  'REQ-10912': {
    id: 'REQ-10912',
    time: '12:57:59',
    timestamp: '2026-10-05 12:57:59.601 UTC',
    user: 'Ankit',
    ip: '117.200.41.98',
    endpoint: 'POST /api/upload',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Chrome/122)',
    device: 'Chrome',
    location: 'India 🇮🇳',
    riskScore: 62,
    riskLevel: 'HIGH',
    action: 'LIMIT',
    forensics: {
      tls: 'TLS 1.3 • AES_256_GCM',
      network: 'AS9829 (BSNL Internet)',
      policy: 'ZTP-305 • Multipart Upload Throttle',
      latency: '2.4ms • ClamAV Sandbox',
      mdm: 'UNMANAGED • Upload Quarantine'
    },
    riskFactors: [
      { text: 'Large Multipart Payload (>45MB)', score: '+32', type: 'red', icon: 'hex', detail: 'Payload exceeds standard single-request quota threshold.' },
      { text: 'Consecutive Upload Bursts', score: '+18', type: 'red', icon: 'bolt', detail: '4 concurrent multipart streams initiated simultaneously.' },
      { text: 'AV Scanning Delay', score: '+12', type: 'red', icon: 'slash', detail: 'Heuristic analyzer waiting for sandboxed file detonation.' }
    ],
    systemResponses: [
      { text: 'Upload throttle applied', detail: 'Bandwidth restricted to 256 KB/s.' },
      { text: 'Deep malware sandbox initiated', detail: 'Payload quarantined for sandbox detonation.' },
      { text: 'Bandwidth limit enforced', detail: 'Stream capped under Fair Use QoS.' }
    ]
  },
  'REQ-10911': {
    id: 'REQ-10911',
    time: '12:57:55',
    timestamp: '2026-10-05 12:57:55.220 UTC',
    user: 'Unknown',
    ip: '194.26.29.112',
    endpoint: 'GET /api/admin/users',
    userAgent: 'Go-http-client/1.1',
    device: 'Unknown',
    location: 'Germany 🇩🇪',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    action: 'BLOCK',
    forensics: {
      tls: 'TLS 1.2 • Golang Automated Scanner',
      network: 'AS24940 (Hetzner Cloud Datacenter)',
      policy: 'ZTP-402 • Datacenter IP Blacklist',
      latency: '0.8ms • Perimeter Block',
      mdm: 'BLOCKED • Cloud VPS Origin'
    },
    riskFactors: [
      { text: 'Unauthorized Subnet Range', score: '+34', type: 'red', icon: 'hex', detail: 'Hetzner cloud hosting IP range is blacklisted for admin access.' },
      { text: 'Admin RBAC Policy Violation', score: '+30', type: 'red', icon: 'slash', detail: 'Target `/api/admin/users` requires hardware YubiKey MFA.' },
      { text: 'Zero Auth Token Provided', score: '+25', type: 'red', icon: 'bolt', detail: 'Unauthenticated scraper script detected.' }
    ],
    systemResponses: [
      { text: 'Request blocked', detail: 'HTTP 403 Forbidden with security token error.' },
      { text: 'Access token revoked', detail: 'Perimeter firewall active drop rule applied.' },
      { text: 'Host IP flagged in global threat intel', detail: 'Reported to AbuseIPDB API.' },
      { text: 'Audit alert broadcasted', detail: 'High priority telemetry push to SOC.' }
    ]
  },
  'REQ-10910': {
    id: 'REQ-10910',
    time: '12:57:52',
    timestamp: '2026-10-05 12:57:52.411 UTC',
    user: 'Pooja',
    ip: '103.88.22.9',
    endpoint: 'GET /api/profile',
    userAgent: 'Mozilla/5.0 (iPhone; iOS 16_6)',
    device: 'iPhone',
    location: 'India 🇮🇳',
    riskScore: 14,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      network: 'AS55836 (Jio Infocomm)',
      policy: 'ZTP-101 • User Profile',
      latency: '0.6ms • Edge Clean',
      mdm: 'COMPLIANT • Apple Biometric Passkey'
    },
    riskFactors: [
      { text: 'Biometric Passkey Authenticated', score: '+8', type: 'green', icon: 'check', detail: 'FIDO2 / WebAuthn biometric credential verified.' },
      { text: 'Standard Profile GET Endpoint', score: '+6', type: 'green', icon: 'check', detail: 'Standard user dashboard resource retrieval.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'User session verified.' },
      { text: 'Decrypted user session active', detail: 'Secure session lease extended.' }
    ]
  },
  'REQ-10909': {
    id: 'REQ-10909',
    time: '12:57:50',
    timestamp: '2026-10-05 12:57:50.009 UTC',
    user: 'Rohit',
    ip: '122.179.33.64',
    endpoint: 'GET /api/orders',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Chrome/124)',
    device: 'Chrome',
    location: 'India 🇮🇳',
    riskScore: 27,
    riskLevel: 'LOW',
    action: 'ALLOW',
    forensics: {
      tls: 'TLS 1.3 • AES_128_GCM',
      network: 'AS24560 (Bharti Airtel)',
      policy: 'ZTP-200 • Order Query',
      latency: '1.1ms • Microservice DB',
      mdm: 'AUTHORIZED • Corporate Office LAN'
    },
    riskFactors: [
      { text: 'Standard Pagination Query', score: '+12', type: 'green', icon: 'check', detail: 'Parameters limit=15 and page=1 conform to policy.' },
      { text: 'Clean User Agent', score: '+15', type: 'green', icon: 'check', detail: 'Standard Google Chrome v124 browser on Windows.' }
    ],
    systemResponses: [
      { text: 'Request allowed', detail: 'Paginated order collection dispatched.' },
      { text: 'Order history returned', detail: 'Response cached for 30 seconds.' }
    ]
  }
};

// ================= 2. TABLE ROW INTERACTIVITY (HOVER + CLICK) =================
let lockedRowId = 'REQ-10923'; // Default selected/locked row

function initTableInteractions() {
  const tableBody = document.getElementById('trafficTableBody');
  const inspectorPanel = document.getElementById('inspectorPanel');
  const closeInspectorBtn = document.getElementById('closeInspectorBtn');

  if (!tableBody) return;

  // 1. HOVER ON ROW: Auto-inspect & open details smoothly!
  tableBody.addEventListener('mouseover', (e) => {
    const row = e.target.closest('.traffic-row');
    if (!row) return;

    const reqId = row.getAttribute('data-id');
    const data = REQUESTS_DATA[reqId];

    if (!data) return;

    // Auto-open inspector if collapsed
    if (inspectorPanel && inspectorPanel.classList.contains('collapsed')) {
      inspectorPanel.classList.remove('collapsed');
    }

    // Temporary hover visual indication
    document.querySelectorAll('.traffic-row').forEach(r => r.classList.remove('hover-previewing'));
    row.classList.add('hover-previewing');

    // Update inspector with smooth hover radar effect
    updateInspectorView(data, false);
  });

  // When mouse leaves table, restore locked row if not hovering any row
  tableBody.addEventListener('mouseleave', () => {
    document.querySelectorAll('.traffic-row').forEach(r => r.classList.remove('hover-previewing'));
    if (lockedRowId && REQUESTS_DATA[lockedRowId]) {
      updateInspectorView(REQUESTS_DATA[lockedRowId], false);
      highlightSelectedRow(lockedRowId);
    }
  });

  // 2. CLICK ON ROW: Lock & pin this row permanently
  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('.traffic-row');
    if (!row) return;

    const reqId = row.getAttribute('data-id');
    const data = REQUESTS_DATA[reqId];

    if (!data) return;

    lockedRowId = reqId;
    highlightSelectedRow(reqId);

    if (inspectorPanel) {
      inspectorPanel.classList.remove('collapsed');
    }

    updateInspectorView(data, true);
  });

  // Close button for inspector drawer
  if (closeInspectorBtn && inspectorPanel) {
    closeInspectorBtn.addEventListener('click', () => {
      inspectorPanel.classList.add('collapsed');
    });
  }
}

function highlightSelectedRow(reqId) {
  document.querySelectorAll('.traffic-row').forEach(r => {
    r.classList.remove('selected-row', 'row-selected-allow', 'row-selected-limit');
    const timeCell = r.querySelector('.col-time');
    if (timeCell) timeCell.classList.remove('cell-highlight-red');
  });

  const row = document.querySelector(`.traffic-row[data-id="${reqId}"]`);
  if (!row) return;

  row.classList.add('selected-row');
  const timeCell = row.querySelector('.col-time');
  const data = REQUESTS_DATA[reqId];

  if (data) {
    if (data.action === 'BLOCK' && timeCell) {
      timeCell.classList.add('cell-highlight-red');
    } else if (data.action === 'ALLOW') {
      row.classList.add('row-selected-allow');
    } else if (data.action === 'LIMIT') {
      row.classList.add('row-selected-limit');
    }
  }
}

// Update the Inspector Panel DOM with rich expandable hover details
function updateInspectorView(data, isClick = false) {
  const badgeStatus = document.getElementById('detailStatusBadge');
  const reqId = document.getElementById('detailReqId');
  const timestamp = document.getElementById('detailTimestamp');
  const user = document.getElementById('detailUser');
  const ip = document.getElementById('detailIp');
  const endpoint = document.getElementById('detailEndpoint');
  const userAgent = document.getElementById('detailUserAgent');
  const device = document.getElementById('detailDevice');
  const riskNum = document.getElementById('detailRiskNum');
  const riskTag = document.getElementById('detailRiskTag');
  const location = document.getElementById('detailLocation');
  const totalScore = document.getElementById('detailTotalScore');
  const factorsContainer = document.getElementById('riskFactorsContainer');
  const actionsContainer = document.getElementById('systemActionsContainer');

  // Forensics fields
  const fTls = document.getElementById('fTls');
  const fNetwork = document.getElementById('fNetwork');
  const fPolicy = document.getElementById('fPolicy');
  const fLatency = document.getElementById('fLatency');
  const fMdm = document.getElementById('fMdm');

  // Subtle animation pulse on change
  const inspectorPanel = document.getElementById('inspectorPanel');
  if (inspectorPanel) {
    inspectorPanel.classList.remove('inspector-pulse');
    void inspectorPanel.offsetWidth; // trigger reflow
    inspectorPanel.classList.add('inspector-pulse');
  }

  if (badgeStatus) {
    badgeStatus.textContent = data.action === 'BLOCK' ? 'BLOCKED' : (data.action === 'LIMIT' ? 'LIMITED' : 'ALLOWED');
    badgeStatus.className = 'badge-status-glow';
    if (data.action === 'ALLOW') badgeStatus.classList.add('status-allow');
    else if (data.action === 'LIMIT') badgeStatus.classList.add('status-limit');
  }

  if (reqId) reqId.textContent = data.id;
  if (timestamp) timestamp.textContent = data.timestamp;
  if (user) user.textContent = data.user;
  if (ip) ip.textContent = data.ip;
  if (endpoint) endpoint.textContent = data.endpoint;
  if (userAgent) userAgent.textContent = data.userAgent;
  if (device) device.textContent = data.device;
  if (riskNum) riskNum.textContent = data.riskScore;
  if (location) location.textContent = data.location;

  // Forensics Drawer Values
  if (data.forensics) {
    if (fTls) fTls.textContent = data.forensics.tls;
    if (fNetwork) fNetwork.textContent = data.forensics.network;
    if (fPolicy) fPolicy.textContent = data.forensics.policy;
    if (fLatency) fLatency.textContent = data.forensics.latency;
    if (fMdm) fMdm.textContent = data.forensics.mdm;
  }

  if (totalScore) {
    totalScore.textContent = data.riskScore;
    totalScore.className = 'total-score-value';
    if (data.riskScore >= 80) totalScore.classList.add('score-red');
    else if (data.riskScore >= 60) totalScore.classList.add('score-orange');
    else totalScore.classList.add('score-green');
  }

  if (riskTag) {
    riskTag.textContent = data.riskLevel;
    riskTag.className = 'badge-critical';
    if (data.riskLevel === 'LOW') riskTag.classList.add('badge-low-risk');
    else if (data.riskLevel === 'HIGH') riskTag.classList.add('badge-high-risk');
  }

  // Populate Risk Factors with Expandable Hover Forensics
  if (factorsContainer && data.riskFactors) {
    factorsContainer.innerHTML = '';
    data.riskFactors.forEach(factor => {
      const item = document.createElement('div');
      item.className = 'factor-item factor-expandable';

      let iconSvg = '';
      if (factor.icon === 'slash') {
        iconSvg = `
          <svg class="factor-icon factor-icon-${factor.type}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        `;
      } else if (factor.icon === 'bolt') {
        iconSvg = `
          <svg class="factor-icon factor-icon-${factor.type}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        `;
      } else if (factor.icon === 'check') {
        iconSvg = `
          <svg class="factor-icon factor-icon-${factor.type}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;
      } else {
        iconSvg = `
          <svg class="factor-icon factor-icon-${factor.type}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        `;
      }

      item.innerHTML = `
        <div class="factor-header-row">
          <div class="factor-desc">
            ${iconSvg}
            <span>${factor.text}</span>
          </div>
          <div class="factor-score-pill">
            <span class="factor-score factor-score-${factor.type}">${factor.score}</span>
            <svg class="factor-chevron" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <!-- Expandable Detail Drawer (Opens on Hover) -->
        <div class="factor-drilldown-drawer">
          <div class="drilldown-inner">
            <div class="drilldown-badge">ML Forensic Explanation</div>
            <p class="drilldown-text">${factor.detail || 'Granular heuristic telemetry flagged by Zero-Trust inspection engine.'}</p>
          </div>
        </div>
      `;
      factorsContainer.appendChild(item);
    });
  }

  // Populate System Responses with Expandable Hover Action Logs
  if (actionsContainer && data.systemResponses) {
    actionsContainer.innerHTML = '';
    data.systemResponses.forEach(actionItem => {
      const li = document.createElement('li');
      li.className = 'action-check-item action-expandable';

      const title = typeof actionItem === 'string' ? actionItem : actionItem.text;
      const detail = typeof actionItem === 'object' && actionItem.detail ? actionItem.detail : 'Action dispatched synchronously via perimeter policy engine.';

      li.innerHTML = `
        <div class="action-header-row">
          <span class="check-icon-circle">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
          <span class="check-text">${title}</span>
          <span class="hover-inspect-tag">Hover log</span>
        </div>
        <!-- Expandable Action Drawer (Opens on Hover) -->
        <div class="action-drilldown-drawer">
          <div class="action-inner-log">
            <span class="log-indicator"></span>
            <span class="log-text">${detail}</span>
          </div>
        </div>
      `;
      actionsContainer.appendChild(li);
    });
  }
}

// ================= 3. FILTER DROPDOWNS & TOOLBAR =================
function initFilterDropdowns() {
  const filterPills = document.querySelectorAll('.filter-pill-select');

  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = pill.classList.contains('open');
      filterPills.forEach(p => p.classList.remove('open'));
      if (!isOpen) {
        pill.classList.add('open');
      }
    });

    const options = pill.querySelectorAll('.filter-opt-item');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        const filterVal = opt.getAttribute('data-value');
        const label = pill.querySelector('.filter-label');

        if (label) {
          label.textContent = opt.textContent;
        }

        if (filterVal !== 'all') {
          pill.classList.add('active-filter');
        } else {
          pill.classList.remove('active-filter');
        }

        pill.classList.remove('open');
        applyCombinedFilters();
      });
    });
  });

  document.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('open'));
  });
}

// ================= 4. REAL-TIME SEARCH & FILTER ENGINE =================
function initSearchFiltering() {
  const searchInput = document.getElementById('tableFilterInput');
  const globalSearch = document.getElementById('globalSearch');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyCombinedFilters();
    });
  }

  if (globalSearch) {
    globalSearch.addEventListener('input', () => {
      if (searchInput) {
        searchInput.value = globalSearch.value;
      }
      applyCombinedFilters();
    });
  }
}

function applyCombinedFilters() {
  const searchVal = (document.getElementById('tableFilterInput')?.value || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#trafficTableBody .traffic-row');

  const activeUserOpt = document.querySelector('#filterUsersSelect .filter-opt-item.active')?.getAttribute('data-value') || 'all';
  const activeEndpointOpt = document.querySelector('#filterEndpointsSelect .filter-opt-item.active')?.getAttribute('data-value') || 'all';
  const activeDeviceOpt = document.querySelector('#filterDevicesSelect .filter-opt-item.active')?.getAttribute('data-value') || 'all';
  const activeLocationOpt = document.querySelector('#filterLocationsSelect .filter-opt-item.active')?.getAttribute('data-value') || 'all';
  const activeRiskOpt = document.querySelector('#filterRiskSelect .filter-opt-item.active')?.getAttribute('data-value') || 'all';
  const activeActionOpt = document.querySelector('#filterActionsSelect .filter-opt-item.active')?.getAttribute('data-value') || 'all';

  let visibleCount = 0;

  rows.forEach(row => {
    const userText = row.querySelector('.col-user')?.textContent.trim() || '';
    const endpointText = row.querySelector('.col-endpoint')?.textContent.trim() || '';
    const deviceText = row.querySelector('.col-device')?.textContent.trim() || '';
    const locationText = row.querySelector('.col-location')?.textContent.trim() || '';
    const riskNum = parseInt(row.querySelector('.col-risk .badge-risk')?.textContent.trim() || '0', 10);
    const actionText = row.querySelector('.col-action .badge-action')?.textContent.trim() || '';
    const timeText = row.querySelector('.col-time')?.textContent.trim() || '';

    const textCorpus = `${userText} ${endpointText} ${deviceText} ${locationText} ${actionText} ${timeText}`.toLowerCase();
    const matchesSearch = !searchVal || textCorpus.includes(searchVal);
    const matchesUser = activeUserOpt === 'all' || userText.toLowerCase() === activeUserOpt.toLowerCase();
    const matchesEndpoint = activeEndpointOpt === 'all' || endpointText.startsWith(activeEndpointOpt);
    const matchesDevice = activeDeviceOpt === 'all' || deviceText.toLowerCase().includes(activeDeviceOpt.toLowerCase());
    const matchesLocation = activeLocationOpt === 'all' || locationText.toLowerCase().includes(activeLocationOpt.toLowerCase());

    let matchesRisk = true;
    if (activeRiskOpt === 'critical') matchesRisk = riskNum >= 80;
    else if (activeRiskOpt === 'high') matchesRisk = riskNum >= 60 && riskNum < 80;
    else if (activeRiskOpt === 'medium') matchesRisk = riskNum >= 25 && riskNum < 60;
    else if (activeRiskOpt === 'low') matchesRisk = riskNum < 25;

    const matchesAction = activeActionOpt === 'all' || actionText.toUpperCase() === activeActionOpt.toUpperCase();

    if (matchesSearch && matchesUser && matchesEndpoint && matchesDevice && matchesLocation && matchesRisk && matchesAction) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  const countDisplay = document.querySelector('.records-count-text');
  if (countDisplay) {
    countDisplay.textContent = `Showing 1 - ${visibleCount} of 128,492 requests`;
  }
}

// ================= 5. TIME RANGE PICKER =================
function initTimeRangeSelector() {
  const picker = document.getElementById('timeRangeDropdown');
  const btn = document.getElementById('timeRangeBtn');
  const label = document.getElementById('selectedTimeRange');
  const options = picker?.querySelectorAll('.dropdown-option');

  if (!picker || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
  });

  options?.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (label) label.textContent = opt.textContent;
      picker.classList.remove('open');
      animateKpiRefresh();
    });
  });

  document.addEventListener('click', () => {
    picker.classList.remove('open');
  });
}

function animateKpiRefresh() {
  const kpis = document.querySelectorAll('.kpi-big-value');
  kpis.forEach(k => {
    k.style.opacity = '0.4';
    k.style.transform = 'translateY(-2px)';
  });
  setTimeout(() => {
    kpis.forEach(k => {
      k.style.opacity = '1';
      k.style.transform = 'translateY(0)';
    });
  }, 300);
}

// ================= 6. CANVAS SPARKLINES =================
function initSparklines() {
  drawSparkline('sparklineTraffic1', [32, 38, 35, 45, 40, 52, 48, 65, 58, 72, 68, 85], '#10b981', 'rgba(16, 185, 129, 0.15)');
  drawSparkline('sparklineTraffic2', [15, 22, 18, 30, 25, 42, 36, 50, 44, 58, 52, 64], '#ef4444', 'rgba(239, 68, 68, 0.15)');
  drawSparkline('sparklineTraffic3', [40, 32, 48, 35, 55, 42, 60, 48, 65, 52, 70, 78], '#f59e0b', 'rgba(245, 158, 11, 0.15)');
  drawSparkline('sparklineTraffic4', [25, 30, 28, 40, 36, 45, 42, 54, 50, 62, 58, 70], '#10b981', 'rgba(139, 92, 246, 0.15)');
}

function drawSparkline(canvasId, points, strokeColor, fillColor) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = 120;
  const h = 32;

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

// ================= 7. LIVE CLOCK SYNC =================
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
