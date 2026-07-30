#!/usr/bin/env node
/**
 * Fetch Jira tickets/epics for the 16 gap components (no existing automation)
 * and group by the authoritative component mapping (confirmed with the user),
 * bypassing summary-based auto-detection.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const JIRA_URL = process.env.JIRA_URL || 'https://bounteous.jira.com';
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
if (!JIRA_API_TOKEN || !JIRA_USERNAME) {
  console.error('Missing JIRA_USERNAME / JIRA_API_TOKEN in env');
  process.exit(1);
}

const COMPONENT_MAP = {
  'insights-share': { tickets: [], epic: 'GAAM-17' },
  'alert-modal': { tickets: ['GAAM-404'], epic: 'GAAM-19' },
  'podcast-player': { tickets: [], epic: 'GAAM-477' },
  'gated-section': { tickets: [], epic: null },
  'rates-detail-hero': { tickets: ['GAAM-711', 'GAAM-712'], epic: 'GAAM-458' },
  'rates-accordion-filter': { tickets: [], epic: 'GAAM-511' },
  'rates-listing-accordion': { tickets: ['GAAM-795','GAAM-796','GAAM-797','GAAM-798','GAAM-799','GAAM-800','GAAM-801','GAAM-822'], epic: 'GAAM-513' },
  'print-and-share': { tickets: ['GAAM-48','GAAM-594','GAAM-704','GAAM-749','GAAM-727','GAAM-815'], epic: 'GAAM-514,GAAM-631' },
  'rate-admin-screen': { tickets: ['GAAM-49','GAAM-170','GAAM-294','GAAM-337','GAAM-338','GAAM-324','GAAM-326','GAAM-357','GAAM-634','GAAM-55','GAAM-499'], epic: 'GAAM-157' },
  'calculators': { tickets: ['GAAM-118','GAAM-745'], epic: 'GAAM-9' },
  'manage-account': { tickets: [], epic: 'GAAM-689' },
  'firm-selection-modal': { tickets: [], epic: 'GAAM-693' },
  'search': { tickets: ['GAAM-131','GAAM-787','GAAM-788','GAAM-790','GAAM-791'], epic: 'GAAM-2' },
  'bio': { tickets: [], epic: 'GAAM-15' },
  'alerts-banner': { tickets: ['GAAM-469'], epic: 'GAAM-18' },
  'rte-table': { tickets: ['GAAM-523','GAAM-670','GAAM-740','GAAM-774'], epic: 'GAAM-468' },
};

function makeRequest(p) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');
    const url = new URL(JIRA_URL + p);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
    };
    let data = '';
    const req = https.request(options, res => {
      res.on('data', c => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    req.end();
  });
}

function extractAcceptanceCriteria(fields) {
  const description = fields.description;
  if (!description || !description.content) return [];
  const criteria = [];
  const walk = (node) => {
    if (!node) return;
    if (node.type === 'paragraph' || node.type === 'heading') {
      const text = (node.content || []).map(c => c.text || '').join('');
      if (text.trim()) criteria.push(text.trim());
    } else if (node.type === 'bulletList' || node.type === 'orderedList') {
      for (const item of node.content || []) {
        const text = (item.content || []).flatMap(p => (p.content || []).map(c => c.text || '')).join('');
        if (text.trim()) criteria.push(text.trim());
      }
    } else if (node.content) {
      for (const child of node.content) walk(child);
    }
  };
  for (const block of description.content) walk(block);
  return criteria;
}

async function fetchOne(key) {
  try {
    const res = await makeRequest(`/rest/api/3/issue/${key}`);
    if (res.status !== 200) return { key, error: `HTTP ${res.status}` };
    const f = res.data.fields;
    return {
      key,
      summary: f.summary,
      status: f.status?.name,
      issueType: f.issuetype?.name,
      acceptanceCriteria: extractAcceptanceCriteria(f),
    };
  } catch (e) {
    return { key, error: e.message };
  }
}

async function main() {
  const result = {};
  for (const [component, { tickets, epic }] of Object.entries(COMPONENT_MAP)) {
    console.log(`\n=== ${component} ===`);
    const keys = [...tickets];
    if (epic) keys.push(...epic.split(','));
    const fetched = [];
    for (const key of keys) {
      process.stdout.write(`  ${key}... `);
      const r = await fetchOne(key);
      if (r.error) console.log(`FAILED (${r.error})`);
      else console.log(`OK: ${r.summary}`);
      fetched.push(r);
    }
    result[component] = { tickets: fetched.filter(t => tickets.includes(t.key)), epics: fetched.filter(t => epic && epic.split(',').includes(t.key)) };
  }

  const outPath = path.join('.aem-developer/artifacts', 'gap-components-jira.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`\nSaved to ${outPath}`);
}

main();
