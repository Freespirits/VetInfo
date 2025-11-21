const statusEl = document.getElementById('status');
const resultSourceEl = document.getElementById('result-source');
const resultsEl = document.getElementById('results');
const form = document.getElementById('search-form');

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
  } catch (err) {
    statusEl.textContent = 'Backend unreachable.';
    statusEl.classList.add('offline');
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

async function fetchGuidelines(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.species) searchParams.set('species', params.species);
  if (params.topic) searchParams.set('topic', params.topic);
  if (params.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  const endpoint = query ? `/api/guidelines?${query}` : '/api/guidelines';
  const response = await fetch(endpoint);
  const payload = await response.json();
  renderResults(payload);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const species = document.getElementById('species').value;
  const topic = document.getElementById('topic').value;
  const search = document.getElementById('search').value.trim();
  await fetchGuidelines({ species, topic, search });
});

(async function init() {
  await checkHealth();
  await fetchGuidelines();
})();
