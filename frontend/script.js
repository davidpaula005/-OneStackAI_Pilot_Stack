// frontend/script.js
const API_BASE = ''

async function getJSON(path) {
  const r = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function postJSON(path, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

window.addEventListener('DOMContentLoaded', () => {
  const healthBtn = document.querySelector('#btnHealth');
  const healthOut = document.querySelector('#healthOut');
  if (healthBtn && healthOut) {
    healthBtn.addEventListener('click', async () => {
      try { healthOut.textContent = JSON.stringify(await getJSON('/api/marketing/'), null, 2); }
      catch (e) { healthOut.textContent = String(e); }
    });
  }

  const campForm = document.querySelector('#campaignForm');
  const campOut  = document.querySelector('#campaignOut');
  if (campForm && campOut) {
    campForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const b = Object.fromEntries(new FormData(campForm).entries());
      try { campOut.textContent = JSON.stringify(await postJSON('/api/marketing/campaign', b), null, 2); }
      catch (e2) { campOut.textContent = String(e2); }
    });
  }

  const videoForm = document.querySelector('#videoForm');
  const videoOut  = document.querySelector('#videoOut');
  if (videoForm && videoOut) {
    videoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const b = Object.fromEntries(new FormData(videoForm).entries());
      try { videoOut.textContent = JSON.stringify(await postJSON('/api/marketing/video', b), null, 2); }
      catch (e3) { videoOut.textContent = String(e3); }
    });
  }
});
(() => {
  const API_BASE = 'http://localhost:3000';

  async function getJSON(path) {
    const r = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }
  async function postJSON(path, body) {
    const r = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  window.addEventListener('DOMContentLoaded', () => {
    const hb = document.querySelector('#btnHealth');
    const ho = document.querySelector('#healthOut');
    if (hb && ho) {
      hb.addEventListener('click', async () => {
        try { ho.textContent = JSON.stringify(await getJSON('/api/marketing/'), null, 2); }
        catch (e) { ho.textContent = String(e); }
      });
    }

    const cf = document.querySelector('#campaignForm');
    const co = document.querySelector('#campaignOut');
    if (cf && co) {
      cf.addEventListener('submit', async (e) => {
        e.preventDefault();
        const b = Object.fromEntries(new FormData(cf).entries());
        try { co.textContent = JSON.stringify(await postJSON('/api/marketing/campaign', b), null, 2); }
        catch (e2) { co.textContent = String(e2); }
      });
    }

    const vf = document.querySelector('#videoForm');
    const vo = document.querySelector('#videoOut');
    if (vf && vo) {
      vf.addEventListener('submit', async (e) => {
        e.preventDefault();
        const b = Object.fromEntries(new FormData(vf).entries());
        try { vo.textContent = JSON.stringify(await postJSON('/api/marketing/video', b), null, 2); }
        catch (e3) { vo.textContent = String(e3); }
      });
    }
  });
})();
(() => {
  const fmt = (iso) => new Date(iso).toLocaleString();

  async function loadCampaigns() {
    const rows = await getJSON('/api/marketing/campaigns');
    const tb = document.querySelector('#tblCampaigns tbody');
    if (!tb) return;
    tb.innerHTML = rows.map(r => `
      <tr>
        <td>${fmt(r.createdAt)}</td>
        <td>${r.offer ?? ''}</td>
        <td>${r.audience ?? ''}</td>
        <td>${r.goal ?? ''}</td>
        <td>${r.channel ?? ''}</td>
        <td>${r.cta ?? ''}</td>
      </tr>
    `).join('');
  }

  async function loadVideos() {
    const rows = await getJSON('/api/marketing/videos');
    const tb = document.querySelector('#tblVideos tbody');
    if (!tb) return;
    tb.innerHTML = rows.map(r => `
      <tr>
        <td>${fmt(r.createdAt)}</td>
        <td>${r.title}</td>
        <td>${r.type}</td>
        <td>${r.length}</td>
        <td>${r.status}</td>
      </tr>
    `).join('');
  }

  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btnLoadCampaigns')?.addEventListener('click', loadCampaigns);
    document.querySelector('#btnLoadVideos')?.addEventListener('click', loadVideos);
    // autoload ved sidevisning:
    loadCampaigns().catch(()=>{});
    loadVideos().catch(()=>{});
  });
})();
(() => {
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (iso) => new Date(iso).toLocaleString();

  function renderVariants(list){
    const grid = document.getElementById('variantGrid');
    if(!grid) return;
    grid.innerHTML = (list||[]).map(v => `
      <div class="card">
        <h4>${esc(v.headline)}</h4>
        <p>${esc(v.body)}</p>
        <button class="btn" data-copy="${esc(v.cta)}">Kopier CTA</button>
      </div>
    `).join('');
    grid.querySelectorAll('button[data-copy]').forEach(btn=>{
      btn.addEventListener('click',()=>navigator.clipboard.writeText(btn.dataset.copy||''));
    });
  }
  function renderLanding(l){
    const box = document.getElementById('landingBox');
    if(!box) return;
    if(!l){ box.innerHTML=''; return; }
    box.innerHTML = `
      <div class="mono" style="opacity:.7;margin-bottom:6px">${fmt(new Date())}</div>
      <h4 style="margin:0 0 6px">${esc(l.h1||'')}</h4>
      <p style="margin:0 0 8px">${esc(l.h2||'')}</p>
      <ul style="margin:0;padding-left:18px">${(l.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ul>
    `;
  }

  // oppgrader eksisterende campaign-submit til å vise kort
  const campForm = document.querySelector('#campaignForm');
  const campOut  = document.querySelector('#campaignOut');
  if (campForm) {
    const btn = campForm.querySelector('button[type="submit"]');
    campForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn && (btn.disabled = true, btn.dataset.label = btn.dataset.label || btn.textContent, btn.textContent='Laster…');
      try {
        const body = Object.fromEntries(new FormData(campForm).entries());
        const r = await postJSON('/api/marketing/campaign', body);
        if (campOut) campOut.textContent = JSON.stringify(r, null, 2);
        renderVariants(r.variants);
        renderLanding(r.landing);
      } catch (err) {
        if (campOut) campOut.textContent = String(err);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
      }
    });
  }
})();
