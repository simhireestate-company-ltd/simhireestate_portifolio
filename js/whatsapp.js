// Floating WhatsApp widget with modal chooser (animated + rotating hint + badge)
// No backend required

(function(){
  const WA_NUMBER = '250793122136';
  const LS_DISMISSED_KEY = 'she_hint_dismissed_v1';

  // Motion preferences
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Inject styles for animations and visuals
  const style = document.createElement('style');
  style.textContent = `
    @keyframes wa-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }
    @keyframes wa-pulse { 0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.55) } 70% { box-shadow: 0 0 0 12px rgba(37,211,102,0) } 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0) } }
    @keyframes wa-badge-pulse { 0% { transform: scale(1) } 50% { transform: scale(1.15) } 100% { transform: scale(1) } }
    @keyframes wa-bounce-in { 0% { opacity: 0; transform: translateY(8px) scale(.98) } 100% { opacity: 1; transform: translateY(0) scale(1) } }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);

  // Create floating button
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'Chat on WhatsApp');
  btn.className = 'fixed bottom-5 right-5 z-50 rounded-full shadow-lg';
  btn.style.backgroundColor = '#25D366';
  btn.style.color = 'white';
  btn.style.width = '56px';
  btn.style.height = '56px';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  if (!prefersReduced) btn.style.animation = 'wa-float 3s ease-in-out infinite, wa-pulse 2.8s ease-in-out infinite';
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.14 1.59 5.94L0 24l6.2-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22a9.94 9.94 0 0 1-5.08-1.39l-.36-.21-3.62.95.97-3.52-.23-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Zm5.49-7.58c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.6-.92-2.2-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.38-.27.3-1.05 1.02-1.05 2.5 0 1.48 1.08 2.92 1.23 3.12.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>';

  // Badge near the button to improve visibility
  const badge = document.createElement('div');
  badge.className = 'fixed z-50';
  // Position near top-right of the button
  badge.style.bottom = '70px';
  badge.style.right = '16px';
  badge.style.width = '18px';
  badge.style.height = '18px';
  badge.style.borderRadius = '9999px';
  badge.style.background = '#ef4444'; // red badge
  badge.style.color = 'white';
  badge.style.fontSize = '11px';
  badge.style.fontWeight = '700';
  badge.style.display = 'flex';
  badge.style.alignItems = 'center';
  badge.style.justifyContent = 'center';
  if (!prefersReduced) badge.style.animation = 'wa-badge-pulse 1.8s ease-in-out infinite';
  badge.textContent = '1';

  // Modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 hidden';
  overlay.style.background = 'rgba(0,0,0,0.5)';

  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-xl max-w-md w-[90%] mx-auto mt-24 p-6';

  // Dynamic greeting based on time + current page title
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const page = (document.title || 'your site').replace(/\s+—.*/, '');
  const startMsg = `${greeting}! I'm browsing the ${page} page and need some help.`;

  modal.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style="background:#e8fff1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#25D366"><path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.14 1.59 5.94L0 24l6.2-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52Z"/></svg>
      </div>
      <div class="grow">
        <h3 class="text-lg font-semibold" style="color:#063F5E">Chat with SimHireEstate</h3>
        <p class="text-sm text-slate-600 mt-1">We’ll help you quickly. Choose an option below.</p>
      </div>
    </div>

    <div class="mt-4 grid gap-2">
      <button id="waStart" class="px-4 py-2 rounded-md text-white" style="background:#25D366">Start chat with a quick intro</button>
      <a id="waCall" href="tel:+250793122136" class="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-center">Call us now</a>
      <a id="waEmail" href="mailto:simhireestate@gmail.com?subject=Inquiry%20%E2%80%94%20SimHireEstate&body=${encodeURIComponent(startMsg)}" class="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-center">Email us</a>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
      <button data-wa="Hello SimHireEstate! I just landed on your site and I'd like some guidance." class="px-3 py-2 border rounded-md hover:bg-slate-50 text-left">Welcome & guidance</button>
      <button data-wa="Hi! I'm interested in your services. Can you help me choose the right option?" class="px-3 py-2 border rounded-md hover:bg-slate-50 text-left">Help me choose a service</button>
      <button data-wa="Hi! I want to hire or list a property. Please assist." class="px-3 py-2 border rounded-md hover:bg-slate-50 text-left">I am a provider</button>
      <button data-wa="Hi! I am seeking a job or a rental. Please assist." class="px-3 py-2 border rounded-md hover:bg-slate-50 text-left">I am a seeker</button>
    </div>

    <div class="mt-4 text-right">
      <button id="waClose" class="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900">Close</button>
    </div>
  `;

  overlay.appendChild(modal);

  function openModal(){ overlay.classList.remove('hidden'); }
  function closeModal(){ overlay.classList.add('hidden'); }

  btn.addEventListener('click', openModal);
  // Close when clicking outside the modal or pressing Esc
  overlay.addEventListener('click', (e)=>{ if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });
  modal.querySelector('#waClose').addEventListener('click', closeModal);

  // Start chat dynamic
  modal.querySelector('#waStart').addEventListener('click', ()=>{
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(startMsg)}`;
    window.open(url, '_blank');
    closeModal();
  });

  // Quick canned options
  modal.querySelectorAll('[data-wa]').forEach((el)=>{
    el.addEventListener('click', ()=>{
      const msg = el.getAttribute('data-wa');
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
      closeModal();
    });
  });

  // Hint bubble that rotates messages every ~10–12s, improved visual design
  const hint = document.createElement('div');
  hint.className = 'fixed right-5 z-50';
  hint.style.bottom = '92px';
  hint.style.maxWidth = '310px';
  hint.style.display = 'none';
  hint.style.background = '#ffffff';
  hint.style.border = '2px solid #25D366';
  hint.style.borderRadius = '14px';
  hint.style.boxShadow = '0 14px 40px rgba(0,0,0,0.16)';
  hint.style.padding = '10px 12px 12px 12px';
  hint.style.fontSize = '13.5px';
  hint.style.lineHeight = '1.4';
  hint.style.position = 'fixed';
  if (!prefersReduced) hint.style.animation = 'wa-bounce-in .35s ease';

  // Responsive width on small screens
  const isSmall = () => window.innerWidth < 480;
  const positionHint = () => {
    if (isSmall()) {
      hint.style.right = '12px';
      hint.style.left = '12px';
      hint.style.maxWidth = 'unset';
    } else {
      hint.style.left = '';
      hint.style.maxWidth = '310px';
    }
  };
  positionHint();
  window.addEventListener('resize', positionHint);

  const hintInner = document.createElement('div');
  hintInner.style.display = 'grid';
  hintInner.style.gridTemplateColumns = 'auto 1fr auto';
  hintInner.style.gap = '10px';
  hintInner.style.alignItems = 'center';

  const iconWrap = document.createElement('div');
  iconWrap.style.width = '28px';
  iconWrap.style.height = '28px';
  iconWrap.style.borderRadius = '9999px';
  iconWrap.style.background = '#e8fff1';
  iconWrap.style.display = 'flex';
  iconWrap.style.alignItems = 'center';
  iconWrap.style.justifyContent = 'center';
  iconWrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#25D366"><path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.14 1.59 5.94L0 24l6.2-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52Z"/></svg>';

  const textBox = document.createElement('div');
  const title = document.createElement('div');
  title.style.fontWeight = '700';
  title.style.color = '#063F5E';
  title.style.marginBottom = '2px';
  title.textContent = 'Chat with SimHireEstate';

  const hintText = document.createElement('div');
  hintText.style.color = '#0f172a';
  hintText.textContent = 'Need help? Chat with us on WhatsApp.';

  textBox.appendChild(title);
  textBox.appendChild(hintText);

  const cta = document.createElement('button');
  cta.textContent = 'Chat now';
  cta.style.background = '#25D366';
  cta.style.color = 'white';
  cta.style.border = 'none';
  cta.style.borderRadius = '9999px';
  cta.style.fontWeight = '600';
  cta.style.padding = '6px 10px';
  cta.style.cursor = 'pointer';

  const close = document.createElement('button');
  close.setAttribute('aria-label', 'Dismiss');
  close.textContent = '×';
  close.style.position = 'absolute';
  close.style.top = '6px';
  close.style.right = '8px';
  close.style.border = 'none';
  close.style.background = 'transparent';
  close.style.color = '#64748b';
  close.style.cursor = 'pointer';
  close.style.fontSize = '16px';

  const triangle = document.createElement('div');
  triangle.style.position = 'absolute';
  triangle.style.right = '18px';
  triangle.style.bottom = '-10px';
  triangle.style.width = 0;
  triangle.style.height = 0;
  triangle.style.borderLeft = '10px solid transparent';
  triangle.style.borderRight = '10px solid transparent';
  triangle.style.borderTop = '10px solid #ffffff';

  hintInner.appendChild(iconWrap);
  hintInner.appendChild(textBox);
  hintInner.appendChild(cta);
  hint.appendChild(hintInner);
  hint.appendChild(triangle);
  hint.appendChild(close);

  // Add elements to DOM (order matters for z-index stacking)
  document.body.appendChild(btn);
  document.body.appendChild(badge);
  document.body.appendChild(overlay);
  document.body.appendChild(hint);

  // Message rotation
  const messages = [
    'Have a question? We reply fast on WhatsApp. ✅',
    'Tell us what you need — jobs, rentals, or services.',
    'Tap chat to get tailored help in under a minute.',
    'Prefer a call? Open and use "Call us now" ☎️',
    'Unsure where to start? We can guide you. 🧭',
    'Looking to hire or list a property? We can assist.',
    'Need a quick answer? Chat is the fastest way ⚡',
    'Ask us anything — we’re here to help.',
    'Ready to find opportunities? Let’s talk!',
    'Send a message now and we’ll take it from there.',
  ];

  let msgIndex = 0;
  let hintTimer = null;
  let cycling = true;
  let openedOnce = false;
  let dismissed = false;

  function showHint(text){
    if (dismissed) return;
    hintText.textContent = text;
    hint.style.display = 'block';
    hint.style.opacity = '0';
    hint.style.transform = 'translateY(6px)';
    hint.style.transition = 'opacity .25s ease, transform .25s ease';
    requestAnimationFrame(()=>{
      hint.style.opacity = '1';
      hint.style.transform = 'translateY(0)';
    });
    // auto-hide after ~5s
    setTimeout(()=>{ hideHint(); }, 5000);
  }

  function hideHint(){
    hint.style.opacity = '0';
    hint.style.transform = 'translateY(6px)';
    setTimeout(()=>{ if (!dismissed) hint.style.display = 'none'; }, 250);
  }

  function cycleHints(){
    if (!cycling || dismissed) return;
    msgIndex = (msgIndex + 1) % messages.length;
    showHint(messages[msgIndex]);
    hintTimer = setTimeout(cycleHints, 11000); // rotate about every 11s
  }

  // Start hint cycle (respect previous dismiss)
  if (localStorage.getItem(LS_DISMISSED_KEY) !== '1') {
    setTimeout(()=>{
      showHint(messages[msgIndex]);
      hintTimer = setTimeout(cycleHints, 11000);
    }, 2500);
  } else {
    dismissed = true;
    badge.style.display = 'none';
  }

  // Interactions
  const openAndStop = ()=>{ openedOnce = true; cycling = false; if (hintTimer) clearTimeout(hintTimer); hideHint(); badge.style.display = 'none'; openModal(); };
  btn.addEventListener('click', ()=>{ openedOnce = true; cycling = false; if (hintTimer) clearTimeout(hintTimer); hideHint(); badge.style.display = 'none'; });
  cta.addEventListener('click', openAndStop);
  hint.addEventListener('click', (e)=>{
    // Avoid closing when clicking the close button specifically
    if (e.target === close) return;
    openAndStop();
  });

  // Pause cycling on hover for accessibility (desktop)
  hint.addEventListener('mouseenter', ()=>{ cycling = false; if (hintTimer) clearTimeout(hintTimer); });
  hint.addEventListener('mouseleave', ()=>{ if (!openedOnce && !dismissed) { cycling = true; hintTimer = setTimeout(cycleHints, 11000); } });

  // Dismiss (do not show again this visit)
  close.addEventListener('click', (e)=>{
    e.stopPropagation();
    dismissed = true;
    localStorage.setItem(LS_DISMISSED_KEY, '1');
    hideHint();
    badge.style.display = 'none';
  });
})();