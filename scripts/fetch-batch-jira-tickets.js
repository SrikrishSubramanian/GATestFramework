#!/usr/bin/env node
/**
 * Batch fetch Jira tickets and organize by component for test generation
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Disable SSL certificate validation for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const JIRA_URL = process.env.JIRA_URL || 'https://bounteous.jira.com';
const JIRA_EMAIL = 'am.puneeth@bounteous.com';
const JIRA_TOKEN = process.env.JIRA_API_TOKEN;
if (!JIRA_TOKEN) {
  console.error('❌ Error: JIRA_API_TOKEN environment variable not set');
  process.exit(1);
}

const TICKETS = [
  'GAAM-1267', 'GAAM-1265', 'GAAM-1252', 'GAAM-1245', 'GAAM-1244', 'GAAM-1217',
  'GAAM-1192', 'GAAM-1179', 'GAAM-1174', 'GAAM-1172', 'GAAM-1155', 'GAAM-1145',
  'GAAM-1138', 'GAAM-1101', 'GAAM-1089', 'GAAM-1084', 'GAAM-1082', 'GAAM-1073',
  'GAAM-1063', 'GAAM-1062', 'GAAM-1021', 'GAAM-989', 'GAAM-978', 'GAAM-903',
  'GAAM-747', 'GAAM-450', 'GAAM-278', 'GAAM-170'
];

console.log('\n╔════════════════════════════════════════════════════════════════════╗');
console.log('║          Batch Jira Ticket Fetch for Test Generation             ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log(`📋 Fetching ${TICKETS.length} tickets...\n`);

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
    const url = new URL(JIRA_URL + path);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    let responseData = '';

    const req = https.request(options, (res) => {
      res.on('data', (chunk) => (responseData += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: responseData ? JSON.parse(responseData) : null
        });
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function fetchTickets() {
  const tickets = [];
  const failed = [];

  for (let i = 0; i < TICKETS.length; i++) {
    const ticketKey = TICKETS[i];
    process.stdout.write(`[${i + 1}/${TICKETS.length}] Fetching ${ticketKey}... `);

    try {
      const response = await makeRequest(`/rest/api/3/issues/${ticketKey}`);

      if (response.status === 200) {
        const ticket = response.data;
        const component = extractComponent(ticket);

        tickets.push({
          key: ticketKey,
          summary: ticket.fields.summary,
          description: ticket.fields.description?.content?.[0]?.content?.[0]?.text || '',
          component,
          acceptanceCriteria: extractAcceptanceCriteria(ticket),
          status: ticket.fields.status.name,
          assignee: ticket.fields.assignee?.displayName || 'Unassigned',
          created: ticket.fields.created,
          updated: ticket.fields.updated
        });
        console.log('✅');
      } else {
        console.log(`❌ HTTP ${response.status}`);
        failed.push({ key: ticketKey, status: response.status });
      }
    } catch (error) {
      console.log(`❌ ${error.message}`);
      failed.push({ key: ticketKey, error: error.message });
    }
  }

  return { tickets, failed };
}

function extractComponent(ticket) {
  // Try multiple ways to extract component name
  const summary = ticket.fields.summary || '';
  const description = ticket.fields.description?.content?.[0]?.content?.[0]?.text || '';

  // Check custom field for component
  const componentFields = ticket.fields.components || [];
  if (componentFields.length > 0) {
    return componentFields[0].name;
  }

  // Extract from summary (usually in format "Component: Description")
  const match = summary.match(/^([a-z-]+)[\s:]/i);
  if (match) {
    return match[1].toLowerCase();
  }

  return 'unknown';
}

function extractAcceptanceCriteria(ticket) {
  const description = ticket.fields.description;
  if (!description || !description.content) return [];

  const criteria = [];
  let currentCriteria = '';

  for (const block of description.content) {
    if (block.type === 'paragraph') {
      const text = block.content?.[0]?.text || '';
      if (text.includes('Given') || text.includes('When') || text.includes('Then')) {
        if (currentCriteria) criteria.push(currentCriteria);
        currentCriteria = text;
      } else if (currentCriteria) {
        currentCriteria += '\n' + text;
      } else {
        criteria.push(text);
      }
    } else if (block.type === 'bulletList') {
      for (const item of (block.content || [])) {
        const text = item.content?.[0]?.content?.[0]?.text || '';
        if (text) criteria.push(text);
      }
    }
  }

  if (currentCriteria) criteria.push(currentCriteria);
  return criteria;
}

async function groupByComponent(tickets) {
  const grouped = {};

  for (const ticket of tickets) {
    const component = ticket.component;
    if (!grouped[component]) {
      grouped[component] = [];
    }
    grouped[component].push(ticket);
  }

  return grouped;
}

async function main() {
  try {
    const { tickets, failed } = await fetchTickets();

    console.log(`\n✅ Successfully fetched ${tickets.length} tickets`);
    if (failed.length > 0) {
      console.log(`⚠️  Failed to fetch ${failed.length} tickets:`);
      failed.forEach(f => console.log(`   - ${f.key}: ${f.status || f.error}`));
    }

    // Group by component
    const grouped = await groupByComponent(tickets);

    console.log(`\n📦 Grouped by component:`);
    for (const [component, componentTickets] of Object.entries(grouped)) {
      console.log(`   ${component}: ${componentTickets.length} ticket(s)`);
    }

    // Save to file
    const artifactsDir = '.aem-developer/artifacts';
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }

    const output = {
      timestamp: new Date().toISOString(),
      totalTickets: tickets.length,
      ticketsGrouped: grouped,
      allTickets: tickets,
      failedTickets: failed
    };

    const outputPath = path.join(artifactsDir, 'batch-jira-requirements.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Saved requirements to: ${outputPath}`);

    // Generate component batch file for Playwright
    const componentBatch = Object.keys(grouped);
    console.log(`\n📝 Components to generate tests for:\n   ${componentBatch.join('\n   ')}`);

    // Save component list for batch generation
    const componentListPath = path.join(artifactsDir, 'batch-components.json');
    fs.writeFileSync(componentListPath, JSON.stringify(componentBatch, null, 2));

    console.log(`\n✅ Component list saved to: ${componentListPath}`);
    console.log(`\n🎯 Next step: Run test generation for each component using Playwright orchestrator\n`);

  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}\n`);
    process.exit(1);
  }
}

main();
