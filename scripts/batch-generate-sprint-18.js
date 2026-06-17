#!/usr/bin/env node

/**
 * Batch Jira Test Generation for Sprint 18
 *
 * Processes 28 Jira tickets and generates Playwright tests
 * Groups by component to avoid duplicate POM generation
 *
 * Usage:
 *   node scripts/batch-generate-sprint-18.js
 *
 * Environment variables:
 *   JIRA_URL - Jira instance URL (default: https://bounteous.jira.com)
 *   JIRA_USERNAME - Jira username (default: am.puneeth@bounteous.com)
 *   JIRA_API_TOKEN - Jira API token (required)
 *   BATCH_SIZE - Number of parallel tickets to process (default: 3)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SPRINT_18_TICKETS = [
  'GAAM-1267', 'GAAM-1265', 'GAAM-1252', 'GAAM-1245', 'GAAM-1244', 'GAAM-1217',
  'GAAM-1192', 'GAAM-1179', 'GAAM-1174', 'GAAM-1172', 'GAAM-1155', 'GAAM-1145',
  'GAAM-1138', 'GAAM-1101', 'GAAM-1089', 'GAAM-1084', 'GAAM-1082', 'GAAM-1073',
  'GAAM-1063', 'GAAM-1062', 'GAAM-1021', 'GAAM-989', 'GAAM-978', 'GAAM-903',
  'GAAM-747', 'GAAM-450', 'GAAM-278', 'GAAM-170'
];

const JIRA_URL = process.env.JIRA_URL || 'https://bounteous.jira.com';
const JIRA_USERNAME = process.env.JIRA_USERNAME || 'am.puneeth@bounteous.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '3', 10);

class SprintTestGenerator {
  constructor() {
    this.results = {
      successful: [],
      failed: [],
      componentMap: {},
      specFileCount: 0,
      pomCount: 0,
      startTime: Date.now()
    };
  }

  async fetchJiraTicket(ticketKey) {
    if (!JIRA_API_TOKEN) {
      console.error('❌ JIRA_API_TOKEN environment variable is required');
      process.exit(1);
    }

    const url = `${JIRA_URL}/rest/api/3/issues/${ticketKey}`;
    const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');

    try {
      const response = execSync(`curl -s -H "Authorization: Basic ${auth}" "${url}"`, {
        encoding: 'utf-8'
      });

      const data = JSON.parse(response);
      return {
        key: ticketKey,
        summary: data.fields?.summary || '',
        description: data.fields?.description?.content?.[0]?.content?.[0]?.text || '',
        status: data.fields?.status?.name || '',
        component: this.extractComponent(data.fields?.summary || ''),
        acceptanceCriteria: this.extractAC(data.fields?.description || ''),
        figmaLink: this.extractFigmaLink(data.fields?.description || '')
      };
    } catch (error) {
      console.error(`❌ Failed to fetch ${ticketKey}:`, error.message);
      return null;
    }
  }

  extractComponent(summary) {
    // Try to extract component name from ticket summary
    const patterns = [
      /button/i, /form/i, /accordion/i, /tabs/i, /carousel/i, /banner/i,
      /statistic/i, /text/i, /image/i, /spacer/i, /separator/i, /hero/i,
      /footer/i, /header/i, /navigation/i, /breadcrumb/i, /section/i,
      /feature-banner/i, /teaser/i, /rate/i, /rating/i, /video/i
    ];

    for (const pattern of patterns) {
      if (pattern.test(summary)) {
        return summary.match(pattern)[0].toLowerCase();
      }
    }
    return 'unknown';
  }

  extractAC(description) {
    if (!description) return '';

    // Extract acceptance criteria section
    const text = typeof description === 'string' ? description : JSON.stringify(description);
    const acMatch = text.match(/(?:Acceptance Criteria|AC):?\s*(.+?)(?:Test|Dev|$)/is);
    return acMatch ? acMatch[1].trim() : '';
  }

  extractFigmaLink(description) {
    if (!description) return '';

    const text = typeof description === 'string' ? description : JSON.stringify(description);
    const figmaMatch = text.match(/(?:figma|design).*?(https:\/\/[^\s>]+figma[^\s>]*)/i);
    return figmaMatch ? figmaMatch[1] : '';
  }

  async generateTestsForTicket(ticket) {
    if (!ticket) return false;

    console.log(`\n📝 Processing ${ticket.key}: ${ticket.summary}`);
    console.log(`   Component: ${ticket.component}`);

    try {
      // Create requirements JSON file
      const requirementsPath = path.join(
        __dirname,
        `../tickets/${ticket.key}-requirements.json`
      );

      // Create tickets directory if needed
      const ticketsDir = path.dirname(requirementsPath);
      if (!fs.existsSync(ticketsDir)) {
        fs.mkdirSync(ticketsDir, { recursive: true });
      }

      const requirementsData = {
        ticket: ticket.key,
        component: ticket.component,
        title: ticket.summary,
        description: ticket.description,
        acceptanceCriteria: ticket.acceptanceCriteria,
        figmaLink: ticket.figmaLink,
        status: ticket.status
      };

      fs.writeFileSync(requirementsPath, JSON.stringify(requirementsData, null, 2));

      // Run Playwright generator
      const env = {
        ...process.env,
        JIRA_JSON: requirementsPath,
        env: 'local'
      };

      console.log(`   ⚙️  Generating tests...`);

      const command = `JIRA_JSON="${requirementsPath}" env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium --workers 1`;

      execSync(command, {
        stdio: 'pipe',
        env: env,
        cwd: path.join(__dirname, '..')
      });

      console.log(`   ✅ Generated tests for ${ticket.key}`);

      // Track results
      this.results.successful.push(ticket.key);
      if (!this.results.componentMap[ticket.component]) {
        this.results.componentMap[ticket.component] = [];
      }
      this.results.componentMap[ticket.component].push(ticket.key);

      return true;
    } catch (error) {
      console.error(`   ❌ Generation failed: ${error.message}`);
      this.results.failed.push({
        ticket: ticket.key,
        error: error.message
      });
      return false;
    }
  }

  async processBatch(tickets) {
    const results = [];

    for (let i = 0; i < tickets.length; i += BATCH_SIZE) {
      const batch = tickets.slice(i, i + BATCH_SIZE);
      console.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.join(', ')})`);

      const promises = batch.map(ticketKey =>
        this.fetchJiraTicket(ticketKey)
          .then(ticket => this.generateTestsForTicket(ticket))
          .catch(error => {
            console.error(`Error processing ${ticketKey}:`, error);
            this.results.failed.push({ ticket: ticketKey, error: error.message });
            return false;
          })
      );

      await Promise.all(promises);

      // Small delay between batches
      if (i + BATCH_SIZE < tickets.length) {
        console.log('⏳ Waiting before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  async run() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  Sprint 18 - Batch Test Generation     ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n📊 Processing ${SPRINT_18_TICKETS.length} tickets`);
    console.log(`🔹 Batch size: ${BATCH_SIZE}`);
    console.log(`🔹 Jira URL: ${JIRA_URL}`);

    await this.processBatch(SPRINT_18_TICKETS);

    this.generateReport();
  }

  generateReport() {
    const duration = ((Date.now() - this.results.startTime) / 1000).toFixed(2);

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║           Generation Report            ║');
    console.log('╚════════════════════════════════════════╝');

    console.log(`\n✅ Successful: ${this.results.successful.length} tickets`);
    if (this.results.successful.length > 0) {
      console.log('   ' + this.results.successful.join(', '));
    }

    if (this.results.failed.length > 0) {
      console.log(`\n❌ Failed: ${this.results.failed.length} tickets`);
      this.results.failed.forEach(f => {
        console.log(`   ${f.ticket}: ${f.error}`);
      });
    }

    console.log(`\n📦 Components Generated:`);
    Object.entries(this.results.componentMap).forEach(([component, tickets]) => {
      console.log(`   ${component}: ${tickets.join(', ')}`);
    });

    console.log(`\n⏱️  Total time: ${duration}s`);
    console.log(`📈 Success rate: ${Math.round((this.results.successful.length / SPRINT_18_TICKETS.length) * 100)}%`);

    // Save report to file
    const reportPath = path.join(__dirname, '../reports/sprint-18-generation-report.json');
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Full report saved to: ${reportPath}`);

    console.log('\n🎯 Next Steps:');
    console.log('   1. Run tests: env=local npx playwright test tests/specFiles/ga/ --workers 6');
    console.log('   2. Extract failures: node scripts/extract-failed-tests.js');
    console.log('   3. Review generated specs and POMs');

    process.exit(this.results.failed.length > 0 ? 1 : 0);
  }
}

// Run the generator
const generator = new SprintTestGenerator();
generator.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
