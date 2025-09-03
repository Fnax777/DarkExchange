/* =========================
   DarkExchange — Script (updated)
   ========================= */
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for nav
  $$('#nav a, [data-scroll]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const targetSel = a.getAttribute('data-scroll') || a.getAttribute('href');
      if (targetSel && targetSel.startsWith('#')) {
        e.preventDefault();
        document.querySelector(targetSel)?.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Active link on scroll
  const sections = ['#start','#cs2','#pakiety','#cennik','#kontakt'].map(id => document.querySelector(id)).filter(Boolean);
  const navLinks = $$('#nav a');
  const activate = (id)=>{
    navLinks.forEach(a=>{
      const href = a.getAttribute('href');
      const ds = a.getAttribute('data-scroll');
      const target = ds || href;
      a.classList.toggle('active', target === id);
    });
  };
  const onScroll = ()=>{
    const y = window.scrollY + 140;
    for (let i=sections.length-1; i>=0; i--){
      const s = sections[i];
      if (s && s.offsetTop <= y) { activate('#'+s.id); break; }
    }
    const toTop = $('#toTop');
    if (window.scrollY > 400) toTop.classList.add('show'); else toTop.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  $('#toTop')?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  // Accordion
  $$('.acc-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.nextElementSibling;
      const open = panel.style.display === 'block';
      $$('.acc-panel').forEach(p=> p.style.display='none');
      if (!open) panel.style.display = 'block';
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, {threshold: .15});
  $$('.reveal').forEach(el=> io.observe(el));

  // Promo bar handling (stable gradient and offset)
  const promoEl = $('#promo-bar');

  function formatDelta(ms){
    if (ms < 0) ms = 0;
    const sec = Math.floor(ms/1000)%60;
    const min = Math.floor(ms/60000)%60;
    const hr  = Math.floor(ms/3600000)%24;
    const day = Math.floor(ms/86400000);
    const pad = n=> String(n).padStart(2,'0');
    if (day > 0) return `${day}d ${pad(hr)}h ${pad(min)}m ${pad(sec)}s`;
    return `${pad(hr)}h ${pad(min)}m ${pad(sec)}s`;
  }

  function hidePromo(){
    if (!promoEl) return;
    promoEl.classList.add('hidden');
    document.documentElement.style.setProperty('--promo-height', '0px');
  }

  function startPromo(){
    try{
      if (!window.promoConfig || !promoConfig.enabled) return hidePromo();
      const end = new Date(promoConfig.endDate).getTime();
      const now = Date.now();
      if (isNaN(end) || now >= end) return hidePromo();

      // stable background, no sudden change: apply single gradient class
      promoEl.style.background = 'linear-gradient(90deg, rgba(138,43,226,0.35), rgba(255,63,164,0.35))';
      const baseText = String(promoConfig.text || '');
      const render = ()=>{
        const left = end - Date.now();
        if (left <= 0) return hidePromo();
        const txt = baseText.replace('[czas]', formatDelta(left));
        promoEl.textContent = txt;
        promoEl.classList.remove('hidden');
        // update CSS var so topbar is positioned below promo
        document.documentElement.style.setProperty('--promo-height', promoEl.offsetHeight + 'px');
      };
      render();
      const t = setInterval(render, 1000);
      promoEl.addEventListener('promo:hide', ()=> clearInterval(t), {once:true});
    }catch(e){
      console.warn('Promo error', e);
      hidePromo();
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', startPromo);
  } else {
    startPromo();
  }

  // Fix: center callout content vertically if it's small height
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.callout.centered').forEach(c=>{
      c.style.alignItems = 'center';
    });
  });

})();



// Podświetlanie aktywnej sekcji w menu
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("#nav a");

window.addEventListener("scroll", () => {
  let scrollPos = window.scrollY + 100; // offset dla lepszego działania

  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector(`#nav a[href="#${sec.id}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const discordBtn = document.getElementById("discordBtn");
  if (discordBtn && typeof DISCORD_LINK !== "undefined") {
    discordBtn.setAttribute("href", DISCORD_LINK);
    discordBtn.setAttribute("target", "_blank"); // otwieranie w nowej karcie
  }
});
