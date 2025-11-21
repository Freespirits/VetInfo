const http = require('http');
const path = require('path');
const fs = require('fs');
const { URL } = require('url');

const [nodeMajor] = process.versions.node.split('.').map(Number);
if (!Number.isInteger(nodeMajor) || nodeMajor < 18) {
  console.error(`Node.js 18+ is required. Detected version: ${process.versions.node}`);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const GUIDELINES_API_BASE = process.env.GUIDELINES_API_BASE || '';
const GUIDELINES_API_KEY = process.env.GUIDELINES_API_KEY || '';
const SAMPLE_DATA_PATH = path.join(__dirname, 'data', 'sample-guidelines.json');

function loadSampleGuidelines() {
  const raw = fs.readFileSync(SAMPLE_DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

const sampleGuidelines = loadSampleGuidelines();

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

async function fetchExternalGuidelines(query) {
  if (!GUIDELINES_API_BASE) return null;

  const url = new URL('/guidelines', GUIDELINES_API_BASE);
  if (query.species) url.searchParams.set('species', query.species);
  if (query.topic) url.searchParams.set('topic', query.topic);
  if (query.search) url.searchParams.set('search', query.search);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url.toString(), {
      headers: GUIDELINES_API_KEY ? { Authorization: `Bearer ${GUIDELINES_API_KEY}` } : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Upstream responded ${response.status}`);
    }

    const body = await response.json();
    return { source: 'external-api', results: body.results || body.data || body }; // flexible shape
  } catch (error) {
    console.error('External API fetch failed, using fallback data:', error.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function filterSampleGuidelines(query) {
  const normalizedSearch = (query.search || '').toLowerCase();
  const normalizedSpecies = (query.species || '').toLowerCase();
  const normalizedTopic = (query.topic || '').toLowerCase();

  const filtered = sampleGuidelines.filter((entry) => {
    const matchesSpecies = !normalizedSpecies || entry.species.toLowerCase() === normalizedSpecies;
    const matchesTopic = !normalizedTopic || entry.topic.toLowerCase().includes(normalizedTopic);
    const matchesSearch =
      !normalizedSearch ||
      entry.title.toLowerCase().includes(normalizedSearch) ||
      entry.summary.toLowerCase().includes(normalizedSearch) ||
      entry.actions.some((step) => step.toLowerCase().includes(normalizedSearch));
    return matchesSpecies && matchesTopic && matchesSearch;
  });

  return { source: 'sample-data', results: filtered };
}

async function handleGuidelinesRequest(req, res, query) {
  const external = await fetchExternalGuidelines(query);
  if (external) {
    sendJson(res, 200, external);
    return;
  }

  const fallback = filterSampleGuidelines(query);
  sendJson(res, 200, fallback);
}

function serveStatic(req, res, pathname) {
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not Found' : 'Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/health') {
      sendJson(res, 200, {
        status: 'ok',
        upstreamConfigured: Boolean(GUIDELINES_API_BASE),
      });
      return;
    }

    if (pathname === '/api/guidelines' && req.method === 'GET') {
      await handleGuidelinesRequest(req, res, parsedUrl.searchParams);
      return;
    }

    sendJson(res, 404, { error: 'API route not found' });
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  if (!GUIDELINES_API_BASE) {
    console.log(
      'No GUIDELINES_API_BASE configured. Serving sample data only. Export GUIDELINES_API_BASE (and optional GUIDELINES_API_KEY) to enable live data.'
    );
  }
});
