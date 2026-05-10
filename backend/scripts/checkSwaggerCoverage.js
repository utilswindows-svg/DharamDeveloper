#!/usr/bin/env node
/**
 * Verifies every Express route registered under backend/routes/ is documented
 * in backend/config/swagger.js. Exits non-zero on any missing route or method
 * so CI fails fast.
 *
 * Usage: node backend/scripts/checkSwaggerCoverage.js
 */
const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, '..', 'routes');
const INDEX_FILE = path.join(ROUTES_DIR, 'index.js');
const swaggerSpec = require('../config/swagger');

const METHODS = ['get', 'post', 'put', 'delete', 'patch'];

// Parse routes/index.js to learn mount prefixes: router.use('/auth', require('./auth.routes'))
function parseMounts() {
  const src = fs.readFileSync(INDEX_FILE, 'utf8');
  const re = /router\.use\(\s*['"`]([^'"`]+)['"`]\s*,\s*require\(\s*['"`]\.\/([^'"`]+)['"`]\s*\)\s*\)/g;
  const mounts = [];
  let m;
  while ((m = re.exec(src))) {
    mounts.push({ prefix: m[1], file: m[2].endsWith('.js') ? m[2] : `${m[2]}.js` });
  }
  return mounts;
}

// Parse a route file for router.<method>('/path', ...)
function parseRoutesFromFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const re = /router\.(get|post|put|delete|patch)\(\s*['"`]([^'"`]+)['"`]/g;
  const routes = [];
  let m;
  while ((m = re.exec(src))) {
    routes.push({ method: m[1].toLowerCase(), routePath: m[2] });
  }
  return routes;
}

// Convert Express ':param' style to OpenAPI '{param}' style
function toOpenApiPath(p) {
  return p.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

function joinPath(prefix, suffix) {
  const a = prefix.replace(/\/+$/, '');
  const b = suffix.startsWith('/') ? suffix : `/${suffix}`;
  const joined = `${a}${b}`.replace(/\/+/g, '/');
  return joined === '' ? '/' : joined;
}

function collectExpectedRoutes() {
  const mounts = parseMounts();
  const expected = [];
  for (const { prefix, file } of mounts) {
    const abs = path.join(ROUTES_DIR, file);
    if (!fs.existsSync(abs)) {
      throw new Error(`Route file referenced from index.js does not exist: ${file}`);
    }
    for (const { method, routePath } of parseRoutesFromFile(abs)) {
      const full = `/api${joinPath(prefix, toOpenApiPath(routePath))}`;
      expected.push({ method, fullPath: full, source: file });
    }
  }
  return expected;
}

function main() {
  const expected = collectExpectedRoutes();
  const documented = new Set();
  for (const [p, ops] of Object.entries(swaggerSpec.paths || {})) {
    for (const m of Object.keys(ops)) {
      if (METHODS.includes(m)) documented.add(`${m} ${p}`);
    }
  }

  const missing = [];
  for (const r of expected) {
    const key = `${r.method} ${r.fullPath}`;
    if (!documented.has(key)) missing.push({ ...r, key });
  }

  // Also surface documented endpoints that aren't actually registered
  // (excluding /health and any non-/api utility paths).
  const expectedKeys = new Set(expected.map((r) => `${r.method} ${r.fullPath}`));
  const orphans = [];
  for (const key of documented) {
    const [, p] = key.split(' ');
    if (!p.startsWith('/api/')) continue;
    if (!expectedKeys.has(key)) orphans.push(key);
  }

  console.log(`Routes registered: ${expected.length}`);
  console.log(`Swagger operations (under /api): ${[...documented].filter((k) => k.split(' ')[1].startsWith('/api/')).length}`);

  if (missing.length === 0 && orphans.length === 0) {
    console.log('✅ Swagger coverage OK — all routes documented.');
    process.exit(0);
  }

  if (missing.length) {
    console.error(`\n❌ Missing in swagger (${missing.length}):`);
    for (const r of missing) console.error(`   ${r.method.toUpperCase().padEnd(6)} ${r.fullPath}   (from ${r.source})`);
  }
  if (orphans.length) {
    console.error(`\n⚠️  Documented but not registered (${orphans.length}):`);
    for (const k of orphans) console.error(`   ${k}`);
  }
  process.exit(1);
}

main();