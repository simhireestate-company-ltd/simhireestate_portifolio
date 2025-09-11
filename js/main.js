// PWA install: capture install prompt early and manage button state
// Use a global so head-inline scripts can set it before this file loads
window.__deferredPWAInstall = window.__deferredPWAInstall || null;
const __isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const __isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__deferredPWAInstall = e;
  // Optionally update UI when install becomes available
  document.querySelectorAll('#btnInstallPWA').forEach(btn => {
    btn.textContent = 'Install App';
    btn.title = 'Install is available';
  });
});

window.addEventListener('appinstalled', () => {
  window.__deferredPWAInstall = null;
  document.querySelectorAll('#btnInstallPWA').forEach(btn => btn.style.display = 'none');
});

// Mobile menu toggle + inject hubs into header and mobile menu
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Inject Hubs dropdown into header (desktop)
(function addHubsDropdown() {
  const nav = document.querySelector('header nav');
  if (!nav || nav.querySelector('.nav-hubs')) return;
  const wrap = document.createElement('div');
  wrap.className = 'relative nav-hubs';
  wrap.innerHTML = `
    <button class="hover:text-brand-secondary inline-flex items-center gap-1" id="btnHubs">Hubs
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"/></svg>
    </button>
    <div id="menuHubs" class="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg hidden z-50">
      <a href="./workforce.html" class="block px-3 py-2 text-sm hover:bg-slate-50">Workforce & Career</a>
      <a href="./business.html" class="block px-3 py-2 text-sm hover:bg-slate-50">Business & Commerce</a>
      <a href="./property.html" class="block px-3 py-2 text-sm hover:bg-slate-50">Property & Real Estate</a>
      <a href="./community.html" class="block px-3 py-2 text-sm hover:bg-slate-50">Community & Networking</a>
      <a href="./tech.html" class="block px-3 py-2 text-sm hover:bg-slate-50">Tech & Software Services</a>
      <a href="./finance.html" class="block px-3 py-2 text-sm hover:bg-slate-50">Financial & Crypto</a>
    </div>
  `;
  nav.appendChild(wrap);
  const btn = wrap.querySelector('#btnHubs');
  const menu = wrap.querySelector('#menuHubs');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) menu.classList.add('hidden');
  });
})();

// Inject hubs in mobile menu
(function addHubsToMobileMenu() {
  if (!mobileMenu || mobileMenu.querySelector('.mobile-hubs')) return;
  const section = document.createElement('div');
  section.className = 'mobile-hubs border-t border-slate-200 mt-2 pt-2';
  section.innerHTML = `
    <div class="font-semibold text-sm mb-1">Hubs</div>
    <a href="./workforce.html" class="block py-2">Workforce & Career</a>
    <a href="./business.html" class="block py-2">Business & Commerce</a>
    <a href="./property.html" class="block py-2">Property & Real Estate</a>
    <a href="./community.html" class="block py-2">Community & Networking</a>
    <a href="./tech.html" class="block py-2">Tech & Software Services</a>
    <a href="./finance.html" class="block py-2">Financial & Crypto</a>
  `;
  mobileMenu.appendChild(section);
})();

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Register service worker for PWA/offline support
if ('serviceWorker' in navigator) {
  // Register ASAP to meet PWA criteria earlier (don’t wait for full load)
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Add Download ZIP and Install prompt to footer
(function enhanceFooter() {
  const footer = document.querySelector('footer .max-w-7xl');
  if (!footer) return;
  // Download link block
  const dlWrap = document.createElement('div');
  dlWrap.className = 'mt-6';
  dlWrap.innerHTML = `
    <div class="flex flex-wrap gap-3 text-sm">
      <a class="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50" href="https://codeload.github.com/simhireestate-company-ltd/simhireestate_portifolio/zip/refs/heads/main" target="_blank" rel="noopener">Download Website (ZIP)</a>
      <button id="btnInstallPWA" class="px-4 py-2 rounded-md text-white" style="background:#063F5E">Install App</button>
    </div>
  `;
  footer.appendChild(dlWrap);

  // PWA install prompt wiring with platform-aware fallback
  const btnInstall = dlWrap.querySelector('#btnInstallPWA');
  if (btnInstall) {
    // Disable by default until event captured
    btnInstall.disabled = !window.__deferredPWAInstall;
    btnInstall.addEventListener('click', async () => {
      // iOS Safari doesn’t support beforeinstallprompt
      if (__isIOS && !__isStandalone) {
        return alert('On iPhone/iPad: tap the Share icon, then "Add to Home Screen" to install.');
      }
      if (!window.__deferredPWAInstall) {
        return alert('Install prompt not ready yet. If your browser supports it, try the menu: "Install app" or "Add to Home Screen".');
      }
      window.__deferredPWAInstall.prompt();
      await window.__deferredPWAInstall.userChoice;
      window.__deferredPWAInstall = null;
      btnInstall.disabled = true;
    });
  }
})();

// Simple email submission via mailto fallback and WhatsApp prefill helper
// For production, replace with a real email/API handler (Netlify Forms, Formspree, AWS SES, etc.)

function buildEmailBody(form, kind) {
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const phone = (data.get('phone') || '').toString().trim();
  const purpose = (data.get('purpose') || '').toString().trim();
  const budget = (data.get('budget') || '').toString().trim();
  const timeline = (data.get('timeline') || '').toString().trim();
  const message = (data.get('message') || '').toString().trim();

  // Create a friendly, human-readable template
  const lines = [
    'Hello SimHireEstate team,',
    '',
    kind ? `I am a ${kind.toLowerCase()} and I would like to get in touch.` : 'I would like to get in touch.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    purpose ? `Purpose: ${purpose}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    '',
    'Details:',
    message || '(No additional details provided)',
    '',
    '— Sent from the SimHireEstate portfolio site'
  ].filter(Boolean);

  return lines.join('\n');
}

function openMailto(to, cc, subject, body) {
  const link = `mailto:${encodeURIComponent(to)}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = link;
}

function handleForm(formId, statusId, subjectPrefix, kind) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (status) status.textContent = 'Opening your email client…';

    const body = buildEmailBody(form, kind);
    // Single mailto with CC — no backend or database required
    openMailto('simhireestate@gmail.com', 'info@simhireestate.com', `${subjectPrefix} Inquiry — SimHireEstate`, body);
  });
}

handleForm('formSeeker', 'seekerStatus', 'Seeker', 'Seeker');
handleForm('formProvider', 'providerStatus', 'Provider', 'Provider');

// Hubs tabs + modal (index)
(function initHubs() {
  const tabs = Array.from(document.querySelectorAll('.hub-tab'));
  const panels = Array.from(document.querySelectorAll('.hub-panel'));
  if (!tabs.length || !panels.length) return;

  function activate(key) {
    tabs.forEach(t => {
      const active = t.dataset.hubTab === key;
      t.classList.toggle('bg-slate-100', active);
    });
    panels.forEach(p => p.classList.toggle('hidden', p.dataset.hubPanel !== key));
  }

  tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.hubTab)));
  activate('workforce');

  // Inject "Learn more" and "Read more" into cards if missing
  function enhanceCards() {
    const cards = document.querySelectorAll('[data-hub-panel] .p-4.bg-white');
    cards.forEach(card => {
      // Add hidden read-more block if not present
      if (!card.querySelector('.read-more')) {
        const read = document.createElement('div');
        read.className = 'read-more mt-2 text-sm text-slate-600 hidden';
        // Custom per-card read more content by feature title
        const title = (card.querySelector('h4')?.textContent || '').trim();
        const extras = {
          'Job Listings & Applications': 'End-to-end hiring funnel with profiles, saved searches, screening questions, and interview scheduling. Optional ATS integration and candidate status tracking.',
          'Internships & Graduate Programs': 'Cohort management, mentor pairing, attendance tracking, and learning milestones with feedback loops and certificates.',
          'Freelancing Marketplace': 'Escrow (planned), milestone payments, portfolio verification, and dispute workflows with transparent reviews.',
          'Skill Development': 'Tracks, quizzes, projects, badges, certificates, and leaderboard support. Integrates with job recommendations.',
          'E‑commerce (products & services)': 'Catalogs, variants, inventory, coupons, and bookings for services. Payment gateway integrations and order tracking.',
          'Marketplace for Digital Goods': 'License keys, versioning, change logs, updates feed, and seller analytics with payout scheduling.',
          'SaaS Tools': 'Multi-tenant provisioning, metered billing, role-based access control (RBAC), and audit logs.',
          'Promotion & Ads Platform': 'Self-serve campaigns with audience targeting, creatives, conversion tracking, and reporting dashboards.',
          'Property Listings': 'Verified listings with rich media, map pins, inquiry tracking, and simple shortlists/favorites.',
          'Smart Contracts (Blockchain)': 'Template contracts, countersign, audit trails, and optional on-chain escrow for payments (region dependent).',
          'Rent & Lease Management': 'Tenant onboarding, digital agreements, rent reminders, receipts, and maintenance ticketing.',
          'Property Valuation Tools (AI)': 'Comparable analysis, trend curves, and confidence scores. Export reports and shareable links.',
          'Groups & Forums': 'Topic channels with moderation tools, roles, pinned posts, and member verification.',
          'Mentorship & Collaboration': 'Mentor matching, shared boards/docs, progress check-ins, and goal tracking.',
          'Events, Webinars & Trainings': 'Listings with RSVPs, ticketing, reminders, and recording replays with access controls.',
          'Social Interactions': 'Lightweight posts, reactions, comments, and creator analytics with safety controls.',
          'Cloud Storage & File Sharing': 'Team drives, shared links with expiry, version history, and granular permissions.',
          'Software Marketplace (plugins, apps, APIs)': 'Seller onboarding, payouts, ratings/reviews, and API usage analytics.',
          'Developer Tools': 'Projects, issues, snippets, and CI/CD hooks with basic activity feeds.',
          'AI Services': 'Image generation, TTS, coding assist, and content insights with usage limits.'
        };
        read.textContent = extras[title] || 'More details: workflows, eligibility, pricing, and timelines tailored for your region.';
        card.appendChild(read);
      }
      // Controls container (where buttons live)
      const controls = card.querySelector('.mt-3.flex.gap-2');
      if (controls && !controls.querySelector('.btn-learn')) {
        // Learn more → choose hub by card hierarchy
        const panel = card.closest('[data-hub-panel]');
        const hubKey = panel?.getAttribute('data-hub-panel');
        const hubLink = {
          workforce: './workforce.html',
          business: './business.html',
          property: './property.html',
          community: './community.html',
          tech: './tech.html',
          finance: './finance.html'
        }[hubKey] || './services.html';

        const learn = document.createElement('a');
        learn.className = 'btn-learn px-3 py-2 text-sm rounded-md border border-slate-200';
        learn.href = hubLink;
        learn.textContent = 'Learn more';

        const readBtn = document.createElement('button');
        readBtn.className = 'btn-read px-3 py-2 text-sm rounded-md border border-slate-200';
        readBtn.type = 'button';
        readBtn.textContent = 'Read more';

        readBtn.addEventListener('click', () => {
          const more = card.querySelector('.read-more');
          if (!more) return;
          const hidden = more.classList.contains('hidden');
          more.classList.toggle('hidden', !hidden);
          readBtn.textContent = hidden ? 'Hide' : 'Read more';
        });

        controls.appendChild(learn);
        controls.appendChild(readBtn);
      }
    });
  }

  // Modal wiring
  const modal = document.getElementById('hubModal');
  const hubInput = document.getElementById('hubInput');
  const featureInput = document.getElementById('featureInput');
  const titleEl = document.getElementById('modalTitle');
  const subtitleEl = document.getElementById('modalSubtitle');
  const statusEl = document.getElementById('hubStatus');

  function openModal(hub, feature) {
    if (!modal) return;
    if (hubInput) hubInput.value = hub;
    if (featureInput) featureInput.value = feature;
    if (titleEl) titleEl.textContent = 'Quick Inquiry';
    if (subtitleEl) subtitleEl.textContent = `${hub} — ${feature}`;
    modal.classList.remove('hidden');
  }
  function closeModal() { if (modal) modal.classList.add('hidden'); }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('btn-inquiry')) {
      const hub = target.getAttribute('data-hub') || '';
      const feature = target.getAttribute('data-feature') || '';
      openModal(hub, feature);
    }
    if (target && target.hasAttribute && target.hasAttribute('data-close-modal')) {
      closeModal();
    }
  });

  const form = document.getElementById('formHubInquiry');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (statusEl) statusEl.textContent = 'Opening your email client…';
      const body = buildEmailBody(form, `${hubInput?.value || ''} — ${featureInput?.value || ''}`);
      openMailto('simhireestate@gmail.com', 'info@simhireestate.com', `Hub Inquiry — ${featureInput?.value || 'Feature'}`, body);
      setTimeout(closeModal, 500);
    });
  }

  // Enhance existing cards on load (index + services)
  enhanceCards();
})();