const statusEl = document.getElementById('status');
const resultSourceEl = document.getElementById('result-source');
const resultsEl = document.getElementById('results');
const form = document.getElementById('search-form');
const statusPill = document.getElementById('status-pill');
const apiModeEl = document.getElementById('api-mode');
const healthMessageEl = document.getElementById('health-message');
const healthUpstreamEl = document.getElementById('health-upstream');
const catalogEl = document.getElementById('catalog');
const catalogSourceEl = document.getElementById('catalog-source');
const tabButtons = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('.tab-panel');
const tabOnlyElements = document.querySelectorAll('[data-tab-only]');

async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const body = await res.json();
    const upstreamMsg = body.upstreamConfigured
      ? 'Connected to external guideline API'
      : 'Sample data active (set GUIDELINES_API_BASE to switch to live data)';
    statusEl.textContent = `Backend ready. ${upstreamMsg}`;
    statusEl.classList.remove('offline');
    statusEl.classList.add('ok');

    statusPill.textContent = body.upstreamConfigured ? 'External API connected' : 'Sample data mode';
    apiModeEl.textContent = body.upstreamConfigured ? 'External API' : 'Sample data';
    healthMessageEl.textContent = 'Backend reachable and serving requests.';
    healthUpstreamEl.textContent = body.upstreamConfigured ? 'Yes' : 'No';
  } catch (err) {
    statusEl.textContent = 'Backend unreachable.';
    statusEl.classList.add('offline');

    statusPill.textContent = 'Backend offline';
    apiModeEl.textContent = 'Offline';
    healthMessageEl.textContent = 'Could not reach backend. Check server logs and network.';
    healthUpstreamEl.textContent = 'Unknown';
  }
}

function renderResults(payload) {
  const { source, results } = payload;
  resultSourceEl.textContent = source === 'external-api' ? 'External API results' : 'Sample dataset results';

  if (!results || results.length === 0) {
    resultsEl.innerHTML = '<p class="helper">No guidance found for this filter.</p>';
    return;
  }

  resultsEl.innerHTML = results
    .map((item) => {
      const steps = item.actions?.map((step) => `<li>${step}</li>`).join('') || '';
      return `
        <article class="card">
          <div class="topic">${item.species ?? 'Any species'} · ${item.topic ?? 'General'}</div>
          <h3>${item.title ?? 'Guideline'}</h3>
          <p>${item.summary ?? ''}</p>
          <ul>${steps}</ul>
          <p class="source">Source: ${item.source ?? source}</p>
        </article>
      `;
    })
    .join('');
}

function renderCatalog(payload) {
  const { source, results } = payload;
  catalogSourceEl.textContent = source === 'external-api' ? 'External API results' : 'Sample dataset results';

  if (!results || results.length === 0) {
    catalogEl.innerHTML = '<p class="helper">No catalog entries available.</p>';
    return;
  }

  catalogEl.innerHTML = results
    .map((item) => `
      <article class="catalog-item">
        <div class="meta">
          <div class="pill">${item.species ?? 'Any'}</div>
          <div class="pill">${item.topic ?? 'General'}</div>
        </div>
        <h3>${item.title ?? 'Guideline'}</h3>
        <p class="helper">${item.summary ?? 'Summary coming soon.'}</p>
      </article>
    `)
    .join('');
}

async function getGuidelines(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.species) searchParams.set('species', params.species);
  if (params.topic) searchParams.set('topic', params.topic);
  if (params.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  const endpoint = query ? `/api/guidelines?${query}` : '/api/guidelines';
  const response = await fetch(endpoint);
  return response.json();
}

async function fetchGuidelines(params = {}) {
  const payload = await getGuidelines(params);
  renderResults(payload);
  return payload;
}

async function fetchCatalog() {
  const payload = await getGuidelines();
  renderCatalog(payload);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const species = document.getElementById('species').value;
  const topic = document.getElementById('topic').value;
  const search = document.getElementById('search').value.trim();
  await fetchGuidelines({ species, topic, search });
});

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-tab-target');

    tabButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-tab-target') === target;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.id === `tab-${target}`;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });

    tabOnlyElements.forEach((el) => {
      const requiredTab = el.getAttribute('data-tab-only');
      el.classList.toggle('hidden', requiredTab !== target);
    });
  });
});

(async function init() {
  await checkHealth();
  await fetchGuidelines();
  await fetchCatalog();
})();
